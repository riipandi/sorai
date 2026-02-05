// Copyright (c) 2025 Aris Ripandi <aris@duck.com>
//
// Portions of this file are based on Vite Actix by Drew Chase.
// Vite Actix is a library designed to enable seamless integration of the
// Vite development server with the Actix web framework.
//
// Vite Actix is licensed under GNU General Public License v3.0.
// @see: https://github.com/Drew-Chase/vite-actix
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

pub mod vite_app_factory;
pub mod vite_proxy_options;

pub use vite_app_factory::create_vite_router;
pub use vite_proxy_options::ViteProxyOptions;

use anyhow::anyhow;
use axum::body::{Body, Bytes};
use axum::extract::Request;
use axum::http::{HeaderMap, Method, StatusCode, Uri};
use axum::response::{IntoResponse, Response};
use http_body_util::{BodyExt, Full};
use hyper::body::Incoming;
use hyper_util::client::legacy::{Client, connect::HttpConnector};
use hyper_util::rt::TokioExecutor;
use log::{debug, error, info, trace, warn};
use regex::Regex;

type HttpClient = Client<HttpConnector, Full<Bytes>>;

const MAX_PAYLOAD_SIZE: usize = 1024 * 1024 * 1024;

#[derive(Clone)]
pub struct ViteProxyState {
    pub client: HttpClient,
    pub port: u16,
}

pub async fn proxy_to_vite(req: Request) -> Result<Response, StatusCode> {
    let options = ViteProxyOptions::global();

    let port = options.port.ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

    let forward_uri = build_forward_uri(port, req.uri())?;
    let forward_method = req.method().clone();
    let forward_headers = req.headers().clone();

    let body_bytes = collect_request_body(req.into_body())
        .await
        .map_err(|_| StatusCode::PAYLOAD_TOO_LARGE)?;

    let http_req = build_forward_request(&forward_uri, forward_method, forward_headers, body_bytes)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let connector = HttpConnector::new();
    let client = Client::builder(TokioExecutor::new()).build(connector);

    let response = client.request(http_req).await.map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(build_axum_response(response).await)
}

fn build_forward_uri(port: u16, uri: &Uri) -> Result<Uri, StatusCode> {
    let path_and_query = uri.path_and_query().map(|pq| pq.as_str()).unwrap_or("/");

    format!("http://localhost:{}{}", port, path_and_query)
        .parse::<Uri>()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn collect_request_body(body: Body) -> Result<Bytes, StatusCode> {
    use http_body_util::BodyExt;

    let collected = body.collect().await.map_err(|_| StatusCode::BAD_REQUEST)?;
    let body_bytes = collected.to_bytes();

    if body_bytes.len() > MAX_PAYLOAD_SIZE {
        return Err(StatusCode::PAYLOAD_TOO_LARGE);
    }

    Ok(body_bytes)
}

fn build_forward_request(
    uri: &Uri,
    method: Method,
    headers: HeaderMap,
    body: Bytes,
) -> Result<hyper::Request<Full<Bytes>>, anyhow::Error> {
    let mut req = hyper::Request::builder()
        .uri(uri)
        .method(method)
        .body(Full::new(body))
        .map_err(|e| anyhow!("Failed to build request: {}", e))?;

    *req.headers_mut() = headers;

    Ok(req)
}

async fn build_axum_response(response: hyper::Response<Incoming>) -> Response {
    let status = response.status();
    let headers = response.headers().clone();
    let body_bytes = response
        .into_body()
        .collect()
        .await
        .map(|b| b.to_bytes())
        .unwrap_or_else(|_| Bytes::new());

    let mut builder = Response::builder().status(status);

    if let Some(headers_mut) = builder.headers_mut() {
        *headers_mut = headers;
    }

    builder
        .body(Body::from(body_bytes))
        .unwrap_or_else(|_| StatusCode::INTERNAL_SERVER_ERROR.into_response())
}

/// Find Vite executable by trying multiple strategies
fn find_vite_executable(options: &ViteProxyOptions) -> anyhow::Result<String> {
    // Strategy 1: Check environment variable
    if let Ok(vite_path) = std::env::var("VITE_PATH")
        && std::path::Path::new(&vite_path).exists()
    {
        debug!("Using VITE_PATH: {}", vite_path);
        return Ok(vite_path);
    }

    let working_dir = &options.working_directory;

    // Strategy 2: Check node_modules/.bin/vite (local installation)
    let local_vite = std::path::Path::new(working_dir).join("node_modules/.bin/vite");
    if local_vite.exists() {
        #[cfg(target_os = "windows")]
        let vite_path = local_vite.with_extension("cmd");
        #[cfg(not(target_os = "windows"))]
        let vite_path = local_vite;

        if vite_path.exists() {
            debug!("Found local Vite at: {:?}", vite_path);
            return Ok(vite_path.to_string_lossy().to_string());
        }
    }

    // Strategy 3: Detect package manager and use it
    let package_managers: Vec<(&str, Vec<&str>)> = vec![
        ("pnpm", vec!["pnpm", "exec", "vite"]),
        ("yarn", vec!["yarn", "vite"]),
        ("bun", vec!["bun", "vite"]),
        ("npm", vec!["npm", "exec", "vite"]),
        ("npx", vec!["npx", "vite"]),
    ];

    for (pm_name, cmd_args) in package_managers {
        let cmd = cmd_args.first().unwrap();

        // Check if package manager exists
        let check_result = if cfg!(target_os = "windows") {
            std::process::Command::new("where").arg(cmd).output()
        } else {
            std::process::Command::new("which").arg(cmd).output()
        };

        if check_result.is_ok() {
            debug!("Found package manager: {}", pm_name);
            // Return the command and its args as a single string
            let full_cmd = cmd_args.join(" ");
            return Ok(full_cmd);
        }
    }

    // Strategy 4: Try global vite executable
    #[cfg(target_os = "windows")]
    let find_cmd = "where";
    #[cfg(not(target_os = "windows"))]
    let find_cmd = "which";

    let vite_global = std::process::Command::new(find_cmd)
        .arg("vite")
        .stdout(std::process::Stdio::piped())
        .output();

    if let Ok(output) = vite_global {
        let vite = String::from_utf8(output.stdout)?;
        let vite = vite.trim();

        if !vite.is_empty() {
            let vite_path = vite.split("\n").last().unwrap_or(vite).trim();

            debug!("Found global Vite at: {:?}", vite_path);
            return Ok(vite_path.to_string());
        }
    }

    // Nothing found
    Err(anyhow::anyhow!(
        "Vite not found. Tried:\n\
         - VITE_PATH environment variable\n\
         - node_modules/.bin/vite in {}\n\
         - Package managers: pnpm, yarn, bun, npm, npx\n\
         - Global vite executable\n\
         \n\
         Install Vite with: npm install -D vite",
        working_dir
    ))
}

pub fn start_vite_server() -> anyhow::Result<std::process::Child> {
    let options = ViteProxyOptions::global();
    let vite_cmd = find_vite_executable(&options)?;

    debug!("Starting Vite with command: {}", vite_cmd);

    // Parse command and arguments
    let parts: Vec<&str> = vite_cmd.split_whitespace().collect();
    let cmd = parts.first().unwrap();
    let args = &parts[1..];

    let mut vite_process = std::process::Command::new(cmd);
    vite_process.args(args);
    vite_process.current_dir(&options.working_directory);
    vite_process.stdout(std::process::Stdio::piped());

    if let Some(port) = options.port {
        vite_process.arg("--port").arg(port.to_string());
    }

    let mut vite_process = vite_process.spawn()?;

    let vite_stdout = vite_process
        .stdout
        .take()
        .ok_or_else(|| anyhow::Error::msg("Failed to capture Vite process stdout"))?;

    let options_clone = options.clone();

    let (tx, rx) = tokio::sync::mpsc::channel::<String>(100);

    std::thread::spawn(move || {
        use std::io::BufRead;
        let mut reader = std::io::BufReader::new(vite_stdout);
        let mut line = String::new();

        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("Failed to create Tokio runtime");

        let regex = Regex::new(r"(?P<url>http://localhost:\d+).*").unwrap();
        loop {
            line.clear();
            match reader.read_line(&mut line) {
                Ok(0) => {
                    debug!("End of output stream from Vite process, exiting reader loop");
                    break;
                }
                Ok(_) => {
                    let trimmed_line = line.trim().to_string();

                    if rt.block_on(tx.send(trimmed_line.clone())).is_err() {
                        debug!("Failed to send log line, receiver was dropped");
                        break;
                    }
                    let decolored_text = String::from_utf8(strip_ansi_escapes::strip(trimmed_line.as_str())).unwrap();
                    if decolored_text.contains("Local") && decolored_text.contains("http://localhost:") {
                        let caps = regex.captures(&decolored_text).unwrap();
                        let url = caps.name("url").unwrap().as_str();
                        let port = url.split(":").last().unwrap();
                        let port: u16 = port.parse().unwrap();

                        if let Err(e) = ViteProxyOptions::update_port(port) {
                            debug!("Failed to update Vite port to {}: {}", port, e);
                        } else {
                            debug!("Successfully updated Vite port to {}", port);
                        }
                    }
                }
                Err(err) => {
                    error!("Failed to read line from Vite process: {}", err);
                    break;
                }
            }
        }
        debug!("Exiting Vite stdout reader thread");
    });

    if let Ok(handle) = tokio::runtime::Handle::try_current() {
        let options = options_clone.clone();
        handle.spawn(async move {
            let mut rx = rx;
            while let Some(line) = rx.recv().await {
                match options.log_level {
                    None => {}
                    Some(log::Level::Trace) => trace!("{}", line),
                    Some(log::Level::Debug) => debug!("{}", line),
                    Some(log::Level::Info) => info!("{}", line),
                    Some(log::Level::Warn) => warn!("{}", line),
                    Some(log::Level::Error) => error!("{}", line),
                }
            }
        });
    } else {
        std::thread::spawn(move || {
            let rt = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .expect("Failed to create Tokio runtime");

            rt.block_on(async move {
                let mut rx = rx;
                while let Some(line) = rx.recv().await {
                    match options_clone.log_level {
                        None => {}
                        Some(log::Level::Trace) => trace!("{}", line),
                        Some(log::Level::Debug) => debug!("{}", line),
                        Some(log::Level::Info) => info!("{}", line),
                        Some(log::Level::Warn) => warn!("{}", line),
                        Some(log::Level::Error) => error!("{}", line),
                    }
                }
            });
        });
    }

    Ok(vite_process)
}

pub fn create_vite_state(port: u16) -> ViteProxyState {
    let connector = HttpConnector::new();
    let client = Client::builder(TokioExecutor::new()).build(connector);

    ViteProxyState { client, port }
}

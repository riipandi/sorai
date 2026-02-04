/**
 * Portions of this file are based on code from Vite Actix by Drew Chase.
 * Vite Actix is a library designed to enable seamless integration of the
 * Vite development server with the Actix web framework
 *
 * Vite Actix licensed under GNU General Public License v3.0.
 * @see: https://github.com/Drew-Chase/vite-actix/blob/master/LICENSE
 *
 * Ported to Axum framework
 */
pub mod proxy_vite_options;
pub mod vite_app_factory;

use crate::proxy_vite_options::ProxyViteOptions;
use anyhow::anyhow;
use axum::{
    body::{Body, Bytes},
    extract::{Request, State},
    http::{HeaderMap, HeaderValue, Method, StatusCode, Uri},
    response::{IntoResponse, Response},
};
use http_body_util::{BodyExt, Full};
use hyper::body::Incoming;
use hyper_util::{
    client::legacy::{connect::HttpConnector, Client},
    rt::TokioExecutor,
};
use log::{debug, error, info, trace, warn};
use regex::Regex;
use std::time::Duration;

type HttpClient = Client<HttpConnector, Full<Bytes>>;

const MAX_PAYLOAD_SIZE: usize = 1024 * 1024 * 1024;

#[derive(Clone)]
pub struct ViteProxyState {
    pub client: HttpClient,
    pub port: u16,
}

pub async fn proxy_to_vite(State(state): State<ViteProxyState>, req: Request) -> Result<Response, StatusCode> {
    let options = ProxyViteOptions::global();

    let port = options.port.ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

    let forward_uri = build_forward_uri(port, req.uri())?;
    let forward_method = req.method().clone();
    let forward_headers = req.headers().clone();

    let body_bytes = collect_request_body(req.into_body())
        .await
        .map_err(|_| StatusCode::PAYLOAD_TOO_LARGE)?;

    let http_req = build_forward_request(&forward_uri, forward_method, forward_headers, body_bytes)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = state
        .client
        .request(http_req)
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(build_axum_response(response).await)
}

fn build_forward_uri(port: u16, uri: &Uri) -> Result<Uri, StatusCode> {
    let path_and_query = uri.path_and_query().map(|pq| pq.as_str()).unwrap_or("/");

    format!("http://localhost:{}{}", port, path_and_query)
        .parse::<Uri>()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn collect_request_body(body: Body) -> Result<Bytes, StatusCode> {
    let mut body_bytes = BytesMut::new();
    let mut body = body;

    while let Some(chunk) = body.next().await {
        let chunk = chunk.map_err(|_| StatusCode::BAD_REQUEST)?;

        if (body_bytes.len() + chunk.len()) > MAX_PAYLOAD_SIZE {
            return Err(StatusCode::PAYLOAD_TOO_LARGE);
        }

        body_bytes.extend_from_slice(&chunk);
    }

    Ok(body_bytes.freeze())
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

use bytes::{BufMut, BytesMut};

pub fn start_vite_server() -> anyhow::Result<std::process::Child> {
    #[cfg(target_os = "windows")]
    let find_cmd = "where";
    #[cfg(not(target_os = "windows"))]
    let find_cmd = "which";

    let vite = std::process::Command::new(find_cmd)
        .arg("vite")
        .stdout(std::process::Stdio::piped())
        .output()?
        .stdout;

    let vite = String::from_utf8(vite)?;
    let vite = vite.as_str().trim();

    if vite.is_empty() {
        error!("vite not found, make sure it's installed with npm install -g vite");
        Err(std::io::Error::new(std::io::ErrorKind::NotFound, "vite not found"))?;
    }

    let vite = vite
        .split("\n")
        .collect::<Vec<_>>()
        .last()
        .expect("Failed to get vite executable")
        .trim();

    debug!("found vite at: {:?}", vite);

    let options = ProxyViteOptions::global();

    let mut vite_process = std::process::Command::new(vite);
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

                        if let Err(e) = ProxyViteOptions::update_port(port) {
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
    let client = Client::builder(TokioExecutor::new())
        .timeout(Duration::from_secs(60))
        .build(connector);

    ViteProxyState { client, port }
}

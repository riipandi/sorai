use axum::body::Body;
use axum::extract::Path as AxumPath;
use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "$CARGO_MANIFEST_DIR/.output"]
struct Assets;

/// Handler for serving embedded static files with SPA fallback
pub async fn spa_handler(AxumPath(path): AxumPath<String>) -> impl IntoResponse {
    serve_spa_file(&path)
}

/// Handler for serving assets files (no fallback to index.html)
pub async fn assets_handler(AxumPath(path): AxumPath<String>) -> impl IntoResponse {
    serve_static_file(&format!("assets/{}", path))
}

/// Handler for serving images files (no fallback to index.html)
pub async fn images_handler(AxumPath(path): AxumPath<String>) -> impl IntoResponse {
    serve_static_file(&format!("images/{}", path))
}

/// Internal function to serve SPA files with fallback to index.html
fn serve_spa_file(path: &str) -> Response {
    let path = path.trim_start_matches('/');

    // Check if the path looks like a static asset (has extension)
    let has_extension = path.contains('.');

    let result = if has_extension {
        // For paths with extensions, try to get the file
        Assets::get(path).map(|a| {
            let mime = mime_guess::from_path(path).first_or_octet_stream().to_string();
            let content_type = if mime.starts_with("text/") {
                format!("{}; charset=utf-8", mime)
            } else {
                mime
            };
            (a, content_type)
        })
    } else {
        // For paths without extensions (SPA routes), always serve index.html
        Assets::get("index.html").map(|a| (a, "text/html; charset=utf-8".to_string()))
    };

    match result {
        Some((content, content_type)) => Response::builder()
            .status(StatusCode::OK)
            .header(header::CONTENT_TYPE, content_type)
            .header(header::CACHE_CONTROL, "no-cache, no-store, must-revalidate")
            .body(Body::from(content.data.to_vec()))
            .unwrap(),
        None => (StatusCode::NOT_FOUND, "Not Found").into_response(),
    }
}

/// Internal function to serve static files (no fallback)
fn serve_static_file(path: &str) -> Response {
    let path = path.trim_start_matches('/');

    let asset = Assets::get(path);

    match asset {
        Some(content) => {
            let mime = mime_guess::from_path(path).first_or_octet_stream().to_string();
            let content_type = if mime.starts_with("text/") {
                format!("{}; charset=utf-8", mime)
            } else {
                mime
            };

            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, content_type)
                .body(Body::from(content.data.to_vec()))
                .unwrap()
        }
        None => (StatusCode::NOT_FOUND, "Static file not found").into_response(),
    }
}

/// Handler for SPA index page
pub async fn spa_index() -> impl IntoResponse {
    let asset = Assets::get("index.html");

    match asset {
        Some(content) => Response::builder()
            .status(StatusCode::OK)
            .header(header::CONTENT_TYPE, "text/html; charset=utf-8")
            .header(header::CACHE_CONTROL, "no-cache, no-store, must-revalidate")
            .body(Body::from(content.data.to_vec()))
            .unwrap(),
        None => (StatusCode::NOT_FOUND, "index.html not found").into_response(),
    }
}

/// Fallback handler for SPA routes - serves index.html for client-side routing
pub async fn spa_fallback() -> impl IntoResponse {
    let asset = Assets::get("index.html");

    match asset {
        Some(content) => Response::builder()
            .status(StatusCode::OK)
            .header(header::CONTENT_TYPE, "text/html; charset=utf-8")
            .header(header::CACHE_CONTROL, "no-cache, no-store, must-revalidate")
            .body(Body::from(content.data.to_vec()))
            .unwrap(),
        None => (StatusCode::INTERNAL_SERVER_ERROR, "index.html not found").into_response(),
    }
}

/// Handler for serving specific static file by name
pub async fn serve_file(filename: &str) -> impl IntoResponse {
    let asset = Assets::get(filename);

    match asset {
        Some(content) => {
            let mime = mime_guess::from_path(filename).first_or_octet_stream().to_string();

            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, mime)
                .body(Body::from(content.data.to_vec()))
                .unwrap()
        }
        None => (StatusCode::NOT_FOUND, "File not found").into_response(),
    }
}

pub async fn favicon_ico() -> impl IntoResponse {
    serve_file("favicon.ico").await
}

pub async fn favicon_png() -> impl IntoResponse {
    serve_file("favicon.png").await
}

pub async fn favicon_svg() -> impl IntoResponse {
    serve_file("favicon.svg").await
}

pub async fn robots_txt() -> impl IntoResponse {
    serve_file("robots.txt").await
}

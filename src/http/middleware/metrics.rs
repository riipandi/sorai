use crate::metrics::record_http_request;
use axum::extract::{MatchedPath, Request};
use axum::middleware::Next;
use axum::response::IntoResponse;
use std::time::Instant;

/// Middleware to track HTTP request metrics
pub async fn track_metrics(req: Request, next: Next) -> impl IntoResponse {
    let start = Instant::now();

    // Get the matched path for better metric grouping
    let path = if let Some(matched_path) = req.extensions().get::<MatchedPath>() {
        matched_path.as_str().to_owned()
    } else {
        req.uri().path().to_owned()
    };

    let method = req.method().clone();
    let response = next.run(req).await;

    let latency = start.elapsed().as_secs_f64();
    let status = response.status().as_u16();

    // Record metrics
    record_http_request(method.as_str(), &path, status, latency);

    response
}

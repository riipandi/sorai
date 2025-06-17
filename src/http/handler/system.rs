use crate::utils::response::SoraiError;
use crate::utils::response::success;
use axum::extract::State;
use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use metrics_exporter_prometheus::PrometheusHandle;
use serde::{Deserialize, Serialize};

/// Health check response data
#[derive(Debug, Serialize, Deserialize)]
pub struct HealthStatus {
    pub status: String,
    pub service: String,
    pub version: String,
}

/// Simple message response data
#[derive(Debug, Serialize, Deserialize)]
pub struct MessageResponse {
    pub message: String,
}

/// Root endpoint handler
pub async fn index() -> impl IntoResponse {
    success(MessageResponse {
        message: "All is well".to_string(),
    })
}

/// Health check endpoint handler
pub async fn health_check() -> impl IntoResponse {
    let data = HealthStatus {
        status: "OK".to_string(),
        service: "Sorai".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    };
    success(data)
}

/// API status endpoint handler
pub async fn status() -> impl IntoResponse {
    let data = MessageResponse {
        message: "Sorai Server is running".to_string(),
    };
    success(data)
}

/// Metrics endpoint handler
/// GET /metrics
/// Returns Prometheus-compatible metrics for monitoring
pub async fn metrics(State(prometheus_handle): State<PrometheusHandle>) -> impl IntoResponse {
    let metrics_data = prometheus_handle.render();

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "text/plain; version=0.0.4; charset=utf-8")
        .body(metrics_data)
        .unwrap()
}

/// Handler for 404 Not Found routes
pub async fn not_found_handler() -> impl IntoResponse {
    SoraiError::new(
        axum::http::StatusCode::NOT_FOUND,
        "not_found_error",
        "route_not_found",
        "The requested route was not found on this server",
        None,
    )
}

use axum::Json;
use axum::extract::State;
use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use metrics_exporter_prometheus::PrometheusHandle;
use serde::{Deserialize, Serialize};

use crate::http::response::SoraiError;

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
/// Public endpoint - no authentication required
pub async fn index() -> impl IntoResponse {
    Json(MessageResponse {
        message: "All is well".to_string(),
    })
}

/// Health check endpoint handler
/// Public endpoint - no authentication required
pub async fn health_check() -> impl IntoResponse {
    let data = HealthStatus {
        status: "OK".to_string(),
        service: "Sorai".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    };
    Json(data)
}

/// API status endpoint handler
/// Public endpoint - no authentication required
pub async fn status() -> impl IntoResponse {
    let data = MessageResponse {
        message: "Sorai Server is running".to_string(),
    };
    Json(data)
}

/// Metrics endpoint handler
/// GET /metrics
/// Returns Prometheus-compatible metrics for monitoring
/// Public endpoint - no authentication required (typically accessed by monitoring systems)
/// TODO: Consider adding optional authentication for metrics endpoint in production
pub async fn metrics(State(prometheus_handle): State<PrometheusHandle>) -> impl IntoResponse {
    let metrics_data = prometheus_handle.render();

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "text/plain; version=0.0.4; charset=utf-8")
        .body(metrics_data)
        .unwrap()
}

/// Handler for 404 Not Found routes
/// Public endpoint - no authentication required
pub async fn not_found_handler() -> impl IntoResponse {
    SoraiError::new(
        axum::http::StatusCode::NOT_FOUND,
        "invalid_request_error",
        Some("route_not_found"),
        "The requested route was not found on this server",
        None,
        true,
    )
}

// TODO: Add protected system endpoints that require authentication:
// - Admin dashboard endpoints
// - API key management endpoints
// - System configuration endpoints
// - User management endpoints
// - Audit log endpoints

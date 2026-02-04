use axum::extract::State;
use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};
use metrics_exporter_prometheus::PrometheusHandle;
use serde::{Deserialize, Serialize};

use crate::http::response::{create_error, ApiResponse, ErrorCode, ErrorTypeKind, RequestId};

/// Health check response data
#[derive(Debug, Serialize, Deserialize)]
pub struct HealthStatus {
    pub status: String,
    pub service: String,
    pub version: String,
}

/// Root endpoint handler
/// Public endpoint - no authentication required
pub async fn index(RequestId(request_id): RequestId) -> impl IntoResponse {
    ApiResponse::success_with_message((), "All is well".to_string(), request_id)
}

/// Health check endpoint handler
/// Public endpoint - no authentication required
pub async fn health_check(RequestId(request_id): RequestId) -> impl IntoResponse {
    ApiResponse::success_with_message(
        HealthStatus {
            status: "OK".to_string(),
            service: "Sorai".to_string(),
            version: env!("CARGO_PKG_VERSION").to_string(),
        },
        "healthy".to_string(),
        request_id,
    )
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

/// Handler for 404 Not Found API routes
/// Returns JSON error response for API endpoints
pub async fn api_not_found_handler(RequestId(request_id): RequestId) -> impl IntoResponse {
    let response = ApiResponse::<()>::error(
        create_error(
            ErrorCode::InvalidRequest,
            ErrorTypeKind::Internal,
            "API endpoint not found",
        ),
        request_id,
    );
    (StatusCode::NOT_FOUND, response).into_response()
}

// TODO: Add protected system endpoints that require authentication:
// - Admin dashboard endpoints
// - API key management endpoints
// - System configuration endpoints
// - User management endpoints
// - Audit log endpoints

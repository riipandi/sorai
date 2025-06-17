use crate::utils::response::success;
use axum::response::IntoResponse;
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
    let data = MessageResponse {
        message: "Hello, World!!!".to_string(),
    };
    success(data)
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

use crate::handler::health;
use axum::{Router, routing::get};

/// Create application router with all routes
pub fn create_router() -> Router {
    Router::new()
        .route("/", get(health::index))
        .route("/healthz", get(health::health_check))
        .route("/status", get(health::status))
}

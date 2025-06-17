use crate::handler::{completions, health, metrics, not_found};
use axum::Router;
use axum::routing::{get, post};

/// Create application router with all routes
pub fn create_router() -> Router {
    Router::new()
        // Health check routes
        .route("/", get(health::index))
        .route("/healthz", get(health::health_check))
        .route("/status", get(health::status))
        // API v1 routes - Chat completions
        .route("/v1/chat/completions", post(completions::chat_completions))
        // API v1 routes - Text completions
        .route("/v1/text/completions", post(completions::text_completions))
        // Metrics endpoint for Prometheus monitoring
        .route("/metrics", get(metrics::metrics))
        // Fallback handler for 404 routes
        .fallback(not_found::not_found_handler)
}

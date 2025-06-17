use super::handler::{completions, system};
use axum::Router;
use axum::routing::{get, post};
use metrics_exporter_prometheus::PrometheusHandle;

/// Create application router with all routes
pub fn create_router(prometheus_handle: PrometheusHandle) -> Router {
    Router::new()
        // Health check routes
        .route("/", get(system::index))
        .route("/healthz", get(system::health_check))
        .route("/status", get(system::status))
        // API v1 routes - Chat completions
        .route("/v1/chat/completions", post(completions::chat_completions))
        // API v1 routes - Text completions
        .route("/v1/text/completions", post(completions::text_completions))
        // Metrics endpoint for Prometheus monitoring
        .route("/metrics", get(system::metrics))
        // Fallback handler for 404 routes
        .fallback(system::not_found_handler)
        // Add Prometheus handle as shared state
        .with_state(prometheus_handle)
}

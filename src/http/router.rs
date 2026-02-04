use super::handler::{completions, system};
use axum::routing::{get, post};
use axum::Router;
use metrics_exporter_prometheus::PrometheusHandle;

/// Create application router with all routes
pub fn create_router(prometheus_handle: PrometheusHandle) -> Router {
    Router::new()
        // Public routes - no authentication required
        .route("/", get(system::index))
        .route("/healthz", get(system::health_check))
        .route("/metrics", get(system::metrics))
        // API routes with /api prefix
        .nest(
            "/api",
            Router::new()
                // API v1 routes - require Bearer token authentication
                .route("/v1/chat/completions", post(completions::chat_completions))
                .route("/v1/text/completions", post(completions::text_completions)),
        )
        // SPA routes with /ui prefix
        .nest(
            "/ui",
            Router::new()
                .route("/", get(system::spa_wip))
                .route("/ui", get(system::spa_wip))
                .fallback(get(system::spa_wip)),
        )
        // Fallback handler for 404 routes - public
        .fallback(system::not_found_handler)
        // Add Prometheus handle as shared state
        .with_state(prometheus_handle)

    // TODO: Add additional route groups:
    // - /api/v1/auth/* - API key management endpoints (protected with admin auth)
    // - /api/v1/admin/* - Administrative endpoints (protected with admin auth)
    // - /api/v1/users/* - User management endpoints (protected with admin auth)
    // - /api/v1/analytics/* - Usage analytics endpoints (protected)
    // - /api/v1/webhooks/* - Webhook management endpoints (protected)
    // - /api/v2/* - Future API version endpoints
    // - /docs - API documentation (public or protected)
    // - /playground - API testing interface (protected)
}

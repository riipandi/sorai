use super::handler::{completions, spa, system};
use axum::Router;
use axum::routing::{get, post};
use metrics_exporter_prometheus::PrometheusHandle;

/// Create application router with all routes
pub fn create_router(prometheus_handle: PrometheusHandle) -> Router {
    Router::new()
        // Public routes - no authentication required
        .route("/", get(system::index))
        .route("/healthz", get(system::health_check))
        .route("/metrics", get(system::metrics))
        // Static assets routes - serve embedded SPA assets
        .route("/assets/{*path}", get(spa::assets_handler))
        .route("/images/{*path}", get(spa::images_handler))
        // Favicon routes - serve embedded SPA favicons
        .route("/favicon.ico", get(spa::favicon_ico))
        .route("/favicon.png", get(spa::favicon_png))
        .route("/favicon.svg", get(spa::favicon_svg))
        .route("/robots.txt", get(spa::robots_txt))
        // API routes with /api prefix
        .nest(
            "/api",
            Router::new()
                // API v1 routes - require Bearer token authentication
                .route("/v1/chat/completions", post(completions::chat_completions))
                .route("/v1/text/completions", post(completions::text_completions)),
        )
        // SPA routes with /ui prefix - serve embedded static files
        .nest(
            "/ui",
            Router::new()
                .route("/", get(spa::spa_index))
                .route("/{*path}", get(spa::spa_handler)),
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

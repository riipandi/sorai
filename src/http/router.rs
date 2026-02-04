use super::handler::{completions, system};
use axum::routing::{get, post};
use axum::Router;
use metrics_exporter_prometheus::PrometheusHandle;

/// Create application router with all routes
pub fn create_router(prometheus_handle: PrometheusHandle) -> Router {
    let mut router = Router::new()
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
                .route("/v1/text/completions", post(completions::text_completions))
                // Fallback for API routes - return JSON error
                .fallback(system::api_not_found_handler)
                .with_state(prometheus_handle.clone()),
        );

    #[cfg(not(debug_assertions))]
    {
        use super::handler::spa;
        router = router
            // Static assets routes - serve embedded SPA assets (production only)
            .route("/assets/{*path}", get(spa::assets_handler))
            .route("/images/{*path}", get(spa::images_handler))
            // Favicon routes - serve embedded SPA favicons (production only)
            .route("/favicon.ico", get(spa::favicon_ico))
            .route("/favicon.png", get(spa::favicon_png))
            .route("/favicon.svg", get(spa::favicon_svg))
            .route("/robots.txt", get(spa::robots_txt))
            // SPA routes with /ui prefix - serve embedded static files (production only)
            .nest(
                "/ui",
                Router::new()
                    .route("/", get(spa::spa_index))
                    .route("/{*path}", get(spa::spa_handler)),
            )
            // Fallback handler for all other routes - serve SPA (production only)
            .fallback(spa::spa_fallback);
    }

    #[cfg(debug_assertions)]
    {
        use vite_axum::proxy_to_vite;
        router = router.nest(
            "/ui",
            Router::new()
                .route("/", get(proxy_to_vite))
                .route("/{*path}", get(proxy_to_vite)),
        );
    }

    router.with_state(prometheus_handle)

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

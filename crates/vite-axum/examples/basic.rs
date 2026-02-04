// Basic example of using vite-axum
use anyhow::Result;
use axum::{Router, routing::get};
use log::LevelFilter;

use vite_axum::proxy_to_vite;
#[cfg(debug_assertions)]
use vite_axum::{ViteProxyOptions, start_vite_server};

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logger
    env_logger::builder().filter_level(LevelFilter::Debug).init();

    #[cfg(debug_assertions)]
    {
        println!("🔥 Starting in development mode with Vite integration");

        // Configure Vite integration
        ViteProxyOptions::new()
            .port(5173)
            .log_level(log::Level::Debug)
            .build()?;

        // Start Vite dev server
        #[allow(clippy::zombie_processes)]
        let _vite_process = start_vite_server()?;

        println!("✅ Vite dev server started on port 5173");
    }

    // Build router with Vite proxy
    let app = Router::new()
        // API routes
        .route("/api/health", get(|| async { "OK" }))
        .route("/api/ping", get(|| async { "pong" }))
        // Vite dev server proxy (all unmatched routes go to Vite)
        .nest(
            "/ui",
            Router::new()
                .route("/", get(proxy_to_vite))
                .route("/{*path}", get(proxy_to_vite)),
        );

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("🚀 Server running at http://127.0.0.1:3000");
    println!("   API: http://127.0.0.1:3000/api/*");
    println!("   UI:  http://127.0.0.1:3000/ui/*");

    axum::serve(listener, app).await?;

    Ok(())
}

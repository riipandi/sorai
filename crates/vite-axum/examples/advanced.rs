// Advanced example with auto-restart and graceful shutdown
use anyhow::Result;
use axum::routing::{get, post};
use axum::{Json, Router};
use log::{LevelFilter, error, info};
use std::time::Duration;
use tokio::signal;

use vite_axum::proxy_to_vite;
#[cfg(debug_assertions)]
use vite_axum::{ViteProxyOptions, start_vite_server};

#[cfg(debug_assertions)]
fn spawn_vite_server() {
    use std::thread;

    thread::spawn(move || {
        loop {
            info!("🔥 Starting Vite server in development mode...");

            match start_vite_server() {
                Ok(mut child) => match child.wait() {
                    Ok(status) => {
                        if status.success() {
                            info!("✅ Vite server exited cleanly");
                            break;
                        } else {
                            error!("💥 Vite server crashed! Restarting in 2 seconds...");
                            std::thread::sleep(Duration::from_secs(2));
                            continue;
                        }
                    }
                    Err(e) => {
                        error!("❌ Failed to wait for Vite server: {}", e);
                        std::thread::sleep(Duration::from_secs(2));
                        continue;
                    }
                },
                Err(e) => {
                    error!("❌ Failed to start Vite server: {}", e);
                    error!("   Make sure Vite is installed: npm install -D vite");
                    std::thread::sleep(Duration::from_secs(5));
                    continue;
                }
            }
        }
    });
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            println!();
        }
        _ = terminate => {
            println!();
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::builder()
        .filter_level(LevelFilter::Debug)
        .format_timestamp(None)
        .init();

    #[cfg(debug_assertions)]
    {
        ViteProxyOptions::new()
            .port(8779)
            .working_directory("./frontend/")
            .log_level(log::Level::Debug)
            .build()?;

        spawn_vite_server();
    }

    // Create router
    let app = Router::new()
        // API routes
        .route("/api/ping", get(|| async { "pong" }))
        .route("/api/data", post(async || Json(serde_json::json!({"status":"ok"}))))
        // Vite dev server proxy (debug mode only)
        .nest(
            "/ui",
            Router::new()
                .route("/", get(proxy_to_vite))
                .route("/{*path}", get(proxy_to_vite)),
        );

    // Start server with graceful shutdown
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    println!("🚀 Server running at http://127.0.0.1:8080");
    println!("   API:  http://127.0.0.1:8080/api/*");
    println!("   UI:   http://127.0.0.1:8080/ui/*");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    println!("👋 Server shutdown complete");
    Ok(())
}

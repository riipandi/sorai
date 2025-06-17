mod config;
mod handler;
mod http;
mod router;
mod utils;

use clap::{CommandFactory, Parser};
use clap_derive::{Parser, Subcommand};
use std::path::PathBuf;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

use config::Config;
use http::HttpServer;

/// Sorai Server
#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    /// Sets a custom config file
    #[arg(short, long, value_name = "FILE", global = true)]
    config: Option<PathBuf>,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the web server
    Serve {
        /// Override host from config
        #[arg(long)]
        host: Option<String>,
        /// Override port from config
        #[arg(long)]
        port: Option<u16>,
    },
    /// Display configuration values in debug mode
    Debug,
}

/// Initialize basic tracing for CLI operations
fn init_cli_tracing() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| format!("{}=info", env!("CARGO_CRATE_NAME")).into()),
        )
        .with(
            fmt::layer()
                .with_target(false)
                .with_thread_ids(false)
                .with_thread_names(false)
                .with_file(false)
                .with_line_number(false)
                .with_level(true)
                .with_ansi(true)
                .compact(),
        )
        .init();
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    // If no subcommand is provided, show help
    let command = match cli.command {
        Some(cmd) => cmd,
        None => {
            let mut cmd = Cli::command();
            cmd.print_help().expect("Failed to print help");
            println!(); // Keep this println for help formatting
            std::process::exit(0);
        }
    };

    match command {
        Commands::Serve { host, port } => {
            // Convert PathBuf to String for config loading
            let config_path = cli.config.as_ref().map(|p| p.to_string_lossy().to_string());

            // Load configuration
            let mut config = match Config::load(config_path).await {
                Ok(config) => {
                    tracing::info!("✅ Configuration loaded successfully");
                    config
                }
                Err(e) => {
                    // Initialize tracing for error logging
                    init_cli_tracing();
                    tracing::error!("❌ Failed to load config: {}", e);
                    std::process::exit(1);
                }
            };

            // Override config with command line arguments if provided
            if let Some(host) = host {
                tracing::info!("🔧 Overriding host from CLI: {}", host);
                config.sorai.host = host;
            }
            if let Some(port) = port {
                tracing::info!("🔧 Overriding port from CLI: {}", port);
                config.sorai.port = port;
            }

            // Create and start HTTP server
            let server = HttpServer::new(config);
            if let Err(e) = server.start().await {
                tracing::error!("💥 Failed to start server: {}", e);
                std::process::exit(1);
            }
        }
        Commands::Debug => {
            // Initialize tracing for debug command
            init_cli_tracing();

            // Convert PathBuf to String for config loading
            let config_path = cli.config.as_ref().map(|p| p.to_string_lossy().to_string());

            tracing::info!("🔍 Loading configuration for debug display...");

            // Load configuration for debug display
            let config = match Config::load(config_path).await {
                Ok(config) => {
                    tracing::info!("✅ Configuration loaded successfully");
                    config
                }
                Err(e) => {
                    tracing::error!("❌ Failed to load config: {}", e);
                    std::process::exit(1);
                }
            };

            tracing::info!("📋 Displaying configuration in debug mode:");

            // Display configuration in table format
            config.display_debug_table();

            tracing::info!("✅ Debug information displayed successfully");
        }
    }
}

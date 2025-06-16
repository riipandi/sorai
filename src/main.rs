mod config;

use axum::{Router, routing::get};
use clap::{CommandFactory, Parser};
use clap_derive::{Parser, Subcommand};
use std::path::PathBuf;

use config::Config;

/// Swift Relay Server
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
}

async fn index() -> &'static str {
    "Hello, World!!!"
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
            println!(); // Add newline after help
            std::process::exit(0);
        }
    };

    match command {
        Commands::Serve { host, port } => {
            // Convert PathBuf to String for config loading
            let config_path = cli.config.as_ref().map(|p| p.to_string_lossy().to_string());

            // Load configuration
            let mut config = match Config::load(config_path).await {
                Ok(config) => config,
                Err(e) => {
                    eprintln!("Failed to load config: {}", e);
                    std::process::exit(1);
                }
            };

            // Override config with command line arguments if provided
            if let Some(host) = host {
                config.swift_relay.host = host;
            }
            if let Some(port) = port {
                config.swift_relay.port = port;
            }

            let app = Router::new().route("/", get(index));
            let address = format!("{}:{}", config.swift_relay.host, config.swift_relay.port);

            println!("Starting HTTP Server...");
            println!("Listening on: {address}");

            let listener = match tokio::net::TcpListener::bind(&address).await {
                Ok(listener) => listener,
                Err(e) => {
                    eprintln!("Failed to bind to address {}: {}", address, e);
                    std::process::exit(1);
                }
            };

            if let Err(e) = axum::serve(listener, app).await {
                eprintln!("Server error: {}", e);
                std::process::exit(1);
            }
        }
    }
}

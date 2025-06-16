mod config;

use axum::{Router, routing::get};
use clap::Parser;
use clap_derive::Parser;
use std::path::PathBuf;

use config::Config;

/// Swift Relay Server
#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    /// Sets a custom config file
    #[arg(short, long, value_name = "FILE")]
    config: Option<PathBuf>,
}

async fn index() -> &'static str {
    "Hello, World!!!"
}

#[tokio::main]
async fn main() {
    let cli = Cli::try_parse();

    // Convert PathBuf to String for config loading
    let config_path = cli.unwrap().config.as_ref().map(|p| p.to_string_lossy().to_string());

    // Load configuration
    let config = match Config::load(config_path).await {
        Ok(config) => config,
        Err(e) => {
            eprintln!("Failed to load config: {}", e);
            std::process::exit(1);
        }
    };

    let app = Router::new().route("/", get(index));
    let address = format!("{}:{}", config.swift_relay.host, config.swift_relay.port);

    println!("Listening: {address}");

    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

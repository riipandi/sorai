use clap::{CommandFactory, Parser};
use clap_derive::{Parser, Subcommand};
use std::path::PathBuf;

use sorai::{Config, http::HttpServer};

/// Sorai Server
#[derive(Parser)]
#[command(version, about, long_about = None)]
struct Cli {
    /// Sets a custom environment variable file
    #[arg(long, value_name = "FILE", global = true)]
    env_file: Option<PathBuf>,
    /// Sets the data directory for application data
    #[arg(long, value_name = "DIR", global = true)]
    data_dir: Option<PathBuf>,

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
    /// System health check (alias: hc)
    #[command(alias = "hc")]
    Healthcheck,
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
            let env_file = cli.env_file.as_ref().map(|p| p.to_string_lossy().to_string());

            let mut config = match Config::load(env_file) {
                Ok(config) => config,
                Err(e) => {
                    eprintln!("Failed to load config: {e}");
                    std::process::exit(1);
                }
            };

            if let Some(host) = host {
                config.sorai.host = host;
            }
            if let Some(port) = port {
                config.sorai.port = port;
            }
            if let Some(data_dir) = cli.data_dir {
                config.app.data_dir = data_dir.to_string_lossy().to_string();
            }

            let server = HttpServer::new(config);
            if let Err(e) = server.start().await {
                eprintln!("Failed to start server: {}", e);
                std::process::exit(1);
            }
        }
        Commands::Debug => {
            let env_file = cli.env_file.as_ref().map(|p| p.to_string_lossy().to_string());

            let mut config = match Config::load(env_file) {
                Ok(config) => config,
                Err(e) => {
                    eprintln!("Failed to load config: {e}");
                    std::process::exit(1);
                }
            };

            if let Some(data_dir) = cli.data_dir {
                config.app.data_dir = data_dir.to_string_lossy().to_string();
            }

            config.display_debug_table();
        }
        Commands::Healthcheck => {
            let env_file = cli.env_file.as_ref().map(|p| p.to_string_lossy().to_string());

            match Config::load(env_file) {
                Ok(_) => {
                    println!("healthy");
                    std::process::exit(0);
                }
                Err(e) => {
                    eprintln!("unhealthy: {}", e);
                    std::process::exit(1);
                }
            }
        }
    }
}

use crate::config::Config;
use crate::router::create_router;

/// HTTP Server handler
pub struct HttpServer {
    config: Config,
}

impl HttpServer {
    /// Create new HTTP server instance
    pub fn new(config: Config) -> Self {
        Self { config }
    }

    /// Start the HTTP server
    pub async fn start(self) -> Result<(), Box<dyn std::error::Error>> {
        let app = create_router();
        let address = format!("{}:{}", self.config.swift_relay.host, self.config.swift_relay.port);

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

        Ok(())
    }
}

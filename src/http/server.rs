use super::router::create_router;
use crate::config::Config;
use crate::http::middleware::MakeTypeSafeRequestId;
use crate::http::middleware::{analytics_middleware, connection_info_middleware, create_cors_layer, track_metrics};
use crate::metrics::{record_server_info, setup_metrics_recorder};
use crate::utils::time::{PreciseTimeFormat, format_timestamp_readable};
use axum::http::{HeaderName, StatusCode};
use axum::middleware;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::request_id::{PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::timeout::TimeoutLayer;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

const LOG_NAME_PREFIX: &str = env!("CARGO_PKG_NAME");
const REQUEST_ID_HEADER: &str = "x-request-id";

/// HTTP Server handler
pub struct HttpServer {
    config: Config,
}

impl HttpServer {
    /// Create new HTTP server instance
    pub fn new(config: Config) -> Self {
        Self { config }
    }

    /// Parse rotation string to tracing_appender Rotation enum
    /// Returns None if file logging should be disabled
    fn parse_rotation(&self) -> Option<tracing_appender::rolling::Rotation> {
        match self.config.logging.rotation.to_lowercase().as_str() {
            "minutely" => Some(tracing_appender::rolling::Rotation::MINUTELY),
            "hourly" => Some(tracing_appender::rolling::Rotation::HOURLY),
            "daily" => Some(tracing_appender::rolling::Rotation::DAILY),
            "never" => Some(tracing_appender::rolling::Rotation::NEVER),
            "none" | "off" | "disable" | "disabled" => None,
            _ => {
                eprintln!(
                    "⚠️  Invalid rotation '{}', falling back to 'daily'",
                    self.config.logging.rotation
                );
                Some(tracing_appender::rolling::Rotation::DAILY)
            }
        }
    }

    /// Get log directory from data_dir
    fn get_log_dir(&self) -> String {
        format!("{}/logs", self.config.app.data_dir)
    }

    /// Initialize tracing subscriber for logging with config options
    pub fn init_tracing(&self) {
        let env_filter = if self.config.logging.level.to_lowercase().as_str() == "none" {
            tracing_subscriber::EnvFilter::new("off")
        } else {
            let log_level = match self.config.logging.level.to_lowercase().as_str() {
                "trace" => "trace",
                "debug" => "debug",
                "info" => "info",
                "warn" => "warn",
                "error" => "error",
                _ => "info",
            };

            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!(
                    "{}={},tower_http={},axum::rejection=trace",
                    env!("CARGO_CRATE_NAME"),
                    log_level,
                    log_level
                )
                .into()
            })
        };

        // Determine what logging outputs to enable
        let enable_file = self.parse_rotation().is_some();
        let show_timestamp = self.config.logging.show_timestamp;
        let show_module = self.config.logging.show_module;

        match (enable_file, show_timestamp, show_module) {
            // File and console, with timestamp and module for console
            (true, true, true) => {
                let log_dir = &self.get_log_dir();
                if let Err(e) = std::fs::create_dir_all(log_dir) {
                    eprintln!("Failed to create log directory '{}': {}", log_dir, e);
                    eprintln!("Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(true))
                        .init();
                } else {
                    let rotation = self.parse_rotation().unwrap(); // Safe because we checked enable_file
                    let file_appender = tracing_appender::rolling::RollingFileAppender::builder()
                        .rotation(rotation)
                        .filename_prefix(LOG_NAME_PREFIX)
                        .filename_suffix("log")
                        .build(self.get_log_dir())
                        .expect("failed to initialize rolling file appender");

                    // Use non-blocking writer for better performance
                    let (non_blocking_appender, _guard) = tracing_appender::non_blocking(file_appender);

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(non_blocking_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(PreciseTimeFormat)
                                .with_target(true),
                        )
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(true))
                        .init();
                }
            }
            // File and console, with timestamp but without module for console
            (true, true, false) => {
                if let Err(e) = std::fs::create_dir_all(self.get_log_dir()) {
                    eprintln!("Failed to create log directory '{}': {}", &self.get_log_dir(), e);
                    eprintln!("Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(false))
                        .init();
                } else {
                    let rotation = self.parse_rotation().unwrap(); // Safe because we checked enable_file
                    let file_appender = tracing_appender::rolling::RollingFileAppender::builder()
                        .rotation(rotation)
                        .filename_prefix(LOG_NAME_PREFIX)
                        .filename_suffix("log")
                        .build(self.get_log_dir())
                        .expect("failed to initialize rolling file appender");

                    // Use non-blocking writer for better performance
                    let (non_blocking_appender, _guard) = tracing_appender::non_blocking(file_appender);

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(non_blocking_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(PreciseTimeFormat)
                                .with_target(true),
                        )
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(false))
                        .init();
                }
            }
            // File and console, without timestamp but with module for console
            (true, false, true) => {
                if let Err(e) = std::fs::create_dir_all(self.get_log_dir()) {
                    eprintln!("Failed to create log directory '{}': {}", &self.get_log_dir(), e);
                    eprintln!("Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().without_time().with_target(true))
                        .init();
                } else {
                    let rotation = self.parse_rotation().unwrap(); // Safe because we checked enable_file
                    let file_appender = tracing_appender::rolling::RollingFileAppender::builder()
                        .rotation(rotation)
                        .filename_prefix(LOG_NAME_PREFIX)
                        .filename_suffix("log")
                        .build(self.get_log_dir())
                        .expect("failed to initialize rolling file appender");

                    // Use non-blocking writer for better performance
                    let (non_blocking_appender, _guard) = tracing_appender::non_blocking(file_appender);

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(non_blocking_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(PreciseTimeFormat)
                                .with_target(true),
                        )
                        .with(fmt::layer().compact().without_time().with_target(true))
                        .init();
                }
            }
            // File and console, without timestamp and without module for console
            (true, false, false) => {
                if let Err(e) = std::fs::create_dir_all(self.get_log_dir()) {
                    eprintln!("Failed to create log directory '{}': {}", &self.get_log_dir(), e);
                    eprintln!("Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().without_time().with_target(false))
                        .init();
                } else {
                    let rotation = self.parse_rotation().unwrap(); // Safe because we checked enable_file
                    let file_appender = tracing_appender::rolling::RollingFileAppender::builder()
                        .rotation(rotation)
                        .filename_prefix(LOG_NAME_PREFIX)
                        .filename_suffix("log")
                        .build(self.get_log_dir())
                        .expect("failed to initialize rolling file appender");

                    // Use non-blocking writer for better performance
                    let (non_blocking_appender, _guard) = tracing_appender::non_blocking(file_appender);

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(non_blocking_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(PreciseTimeFormat)
                                .with_target(true),
                        )
                        .with(fmt::layer().compact().without_time().with_target(false))
                        .init();
                }
            }
            // Console only, with timestamp and module
            (false, true, true) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(true))
                    .init();
            }
            // Console only, with timestamp but without module
            (false, true, false) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().with_timer(PreciseTimeFormat).with_target(false))
                    .init();
            }
            // Console only, without timestamp but with module
            (false, false, true) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().without_time().with_target(true))
                    .init();
            }
            // Console only, without timestamp and without module
            (false, false, false) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().without_time().with_target(false))
                    .init();
            }
        }
    }

    /// Start the HTTP server
    pub async fn start(self) -> Result<(), Box<dyn std::error::Error>> {
        // Initialize tracing with config
        self.init_tracing();

        // Setup Vite dev server in debug mode
        #[cfg(debug_assertions)]
        {
            use vite_axum::ViteProxyOptions;
            ViteProxyOptions::new()
                .port(8000)
                .build()
                .expect("Failed to configure Vite plugin");

            #[allow(clippy::zombie_processes)]
            vite_axum::start_vite_server().expect("Failed to start Vite dev server");
        }

        // Setup Prometheus metrics recorder
        let prometheus_handle = setup_metrics_recorder();

        // Record server info metrics
        let version = env!("CARGO_PKG_VERSION");
        let build = std::env::var("APP_MODE").unwrap_or_else(|_| "development".to_string());
        record_server_info(version, &build);

        let x_request_id = HeaderName::from_static(REQUEST_ID_HEADER);

        // Create base router with Prometheus handle
        let mut app = create_router(prometheus_handle);

        // Add CORS layer if enabled
        let cors_enabled = if let Some(cors_layer) = create_cors_layer(&self.config) {
            app = app.layer(cors_layer);
            true
        } else {
            false
        };

        // Get timeout request from config
        let timeout_requests = 30u64;

        // Add middleware layers in correct order
        let middleware = ServiceBuilder::new()
            .layer(SetRequestIdLayer::new(x_request_id.clone(), MakeTypeSafeRequestId))
            .layer(TimeoutLayer::with_status_code(
                StatusCode::REQUEST_TIMEOUT,
                Duration::from_secs(timeout_requests),
            ))
            .layer(middleware::from_fn(connection_info_middleware))
            .layer(middleware::from_fn(track_metrics))
            // Use analytics middleware instead of TraceLayer for better performance
            .layer(middleware::from_fn(analytics_middleware))
            // PropagateRequestIdLayer must come AFTER analytics to send headers from request to response
            .layer(PropagateRequestIdLayer::new(x_request_id));

        // Apply middleware to the app
        app = app.layer(middleware);

        let address = format!("{}:{}", self.config.sorai.host, self.config.sorai.port);
        let app_env = std::env::var("APP_MODE").unwrap_or_else(|_| "development".to_string());

        if self.config.logging.level.to_lowercase().as_str() == "none" {
            println!("Starting Sorai HTTP Server ({})", app_env);
            if let Some(ref env_file) = self.config.env_file {
                println!("Environment config from: {}", env_file);
            }
            println!("Server listening on: http://{}", address);
        } else {
            tracing::info!("Starting Sorai HTTP Server ({})", app_env);
            if let Some(ref env_file) = self.config.env_file {
                tracing::info!("Environment config from: {}", env_file);
            }
            tracing::info!("Server listening on: http://{}", address);
        }

        let file_logging_enabled = self.parse_rotation().is_some();

        tracing::info!(
            "Log config: level={} log_to_file={} log_rotation={} log_path={}",
            self.config.logging.level,
            file_logging_enabled,
            if file_logging_enabled {
                self.config.logging.rotation.clone()
            } else {
                "disabled".to_string()
            },
            if file_logging_enabled {
                self.get_log_dir()
            } else {
                "disabled".to_string()
            },
        );

        if cors_enabled {
            tracing::debug!("CORS: Allow headers = {}", self.config.cors.allow_headers.join(", "));
            match self.config.cors.allow_origins.as_slice() {
                [origin] if origin == "*" => {
                    tracing::info!("CORS enabled. Allow origins = * (any)");
                }
                [] => {
                    tracing::warn!("CORS enabled but no origins configured");
                }
                origins => {
                    tracing::info!(
                        "CORS enabled. Allow origins = {} (total: {})",
                        origins.join(", "),
                        origins.len()
                    );
                }
            }
        }

        if self.config.logging.level.to_lowercase().as_str() == "none" {
            println!("Server started at: {}", format_timestamp_readable());
        } else {
            tracing::info!("Server started at: {}", format_timestamp_readable());
        }

        let listener = match tokio::net::TcpListener::bind(&address).await {
            Ok(listener) => listener,
            Err(e) => {
                tracing::error!("Failed to bind to address {}: {}", address, e);
                std::process::exit(1);
            }
        };

        tracing::info!("Server ready to accept connections");

        // Use axum::serve with ConnectInfo to capture client socket addresses
        if let Err(e) = axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>())
            .with_graceful_shutdown(Self::shutdown_signal())
            .await
        {
            tracing::error!("Server error: {}", e);
            std::process::exit(1);
        }

        Ok(())
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
                tracing::info!("Ctrl+C received, shutting down...");
            }
            _ = terminate => {
                tracing::info!("Termination signal received, shutting down...");
            }
        }
    }
}

// TODO: Add additional server features:
// - Health check with dependency validation (database, external APIs)
// - Graceful shutdown with connection draining
// - Server metrics collection (request count, response times, error rates)
// - Rate limiting middleware integration
// - Request/response size limits
// - Security headers middleware
// - API versioning support
// - WebSocket support for streaming responses
// - Server-sent events for real-time updates
// - Background task scheduling and management

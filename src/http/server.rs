use super::router::create_router;
use crate::config::Config;
use crate::http::middleware::MakeTypeSafeRequestId;
use crate::http::middleware::{ConnectionInfo, connection_info_middleware, create_cors_layer, track_metrics};
use crate::metrics::{record_server_info, setup_metrics_recorder};
use crate::utils::time::{PreciseTimeFormat, format_timestamp_readable};
use axum::extract::Request;
use axum::http::{HeaderName, StatusCode};
use axum::middleware;
use axum::response::Response;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::request_id::{PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::timeout::TimeoutLayer;
use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer};
use tracing::Span;
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

    /// Format duration with appropriate precision unit
    fn format_duration(duration: Duration) -> String {
        let nanos = duration.as_nanos();

        if nanos >= 1_000_000 {
            // >= 1ms, show in milliseconds
            format!("{}ms", duration.as_millis())
        } else if nanos >= 1_000 {
            // >= 1μs, show in microseconds
            format!("{}μs", duration.as_micros())
        } else {
            // < 1μs, show in nanoseconds
            format!("{}ns", nanos)
        }
    }

    /// Extract request ID from headers
    fn extract_request_id(request: &Request<axum::body::Body>) -> String {
        request
            .headers()
            .get(REQUEST_ID_HEADER)
            .and_then(|v| v.to_str().ok())
            .map(|id| id.to_string())
            .unwrap_or_else(|| "unknown".to_string())
    }

    /// Extract request ID from response headers
    fn extract_request_id_from_response(response: &Response) -> String {
        response
            .headers()
            .get(REQUEST_ID_HEADER)
            .and_then(|v| v.to_str().ok())
            .map(|id| id.to_string())
            .unwrap_or_else(|| "unknown".to_string())
    }

    /// Extract API key from Authorization header for logging
    fn extract_api_key_for_logging(request: &Request<axum::body::Body>) -> Option<String> {
        request
            .headers()
            .get("authorization")
            .and_then(|v| v.to_str().ok())
            .and_then(|auth| {
                if auth.starts_with("Bearer ") {
                    let key = &auth[7..]; // Remove "Bearer " prefix
                    // Only show first 8 characters for security
                    if key.len() > 8 {
                        Some(format!("{}***", &key[..8]))
                    } else {
                        Some("***".to_string())
                    }
                } else {
                    None
                }
            })
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

    /// Initialize tracing subscriber for logging with config options
    pub fn init_tracing(&self) {
        let log_level = match self.config.logging.level.to_lowercase().as_str() {
            "trace" => "trace",
            "debug" => "debug",
            "info" => "info",
            "warn" => "warn",
            "error" => "error",
            _ => "info", // default fallback
        };

        let env_filter = tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
            // axum logs rejections from built-in extractors with the `axum::rejection`
            // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
            format!(
                "{}={},tower_http={},axum::rejection=trace",
                env!("CARGO_CRATE_NAME"),
                log_level,
                log_level
            )
            .into()
        });

        // Determine what logging outputs to enable
        let enable_file = self.parse_rotation().is_some();
        let show_timestamp = self.config.logging.show_timestamp;
        let show_module = self.config.logging.show_module;

        match (enable_file, show_timestamp, show_module) {
            // File and console, with timestamp and module for console
            (true, true, true) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
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
                        .build(&self.config.logging.log_directory)
                        .expect("failed to initialize rolling file appender");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
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
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
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
                        .build(&self.config.logging.log_directory)
                        .expect("failed to initialize rolling file appender");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
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
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
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
                        .build(&self.config.logging.log_directory)
                        .expect("failed to initialize rolling file appender");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
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
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
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
                        .build(&self.config.logging.log_directory)
                        .expect("failed to initialize rolling file appender");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
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

        let trace_layer_for_http = TraceLayer::new_for_http()
            .make_span_with(|_request: &Request<_>| {
                // Create empty span to avoid field duplication in logs
                tracing::Span::none()
            })
            .on_request(|request: &Request<_>, _span: &Span| {
                let request_id = Self::extract_request_id(request);
                let conn_info = ConnectionInfo::from_request_or_default(request);

                // Use short user agent for cleaner logs
                let short_ua = conn_info.short_user_agent();

                // Add bot indicator if detected
                let bot_indicator = if conn_info.is_bot() { " [BOT]" } else { "" };

                // Extract API key for logging (masked for security)
                let api_key_info = Self::extract_api_key_for_logging(request)
                    .map(|key| format!(" | Key: {}", key))
                    .unwrap_or_default();

                tracing::info!(
                    "[REQ:{}] {} {} | IP: {} | UA: {}{}{}",
                    request_id,
                    request.method(),
                    request.uri().path(),
                    conn_info.client_ip,
                    short_ua,
                    bot_indicator,
                    api_key_info
                );
            })
            .on_response(|response: &Response, latency: Duration, _span: &Span| {
                let status = response.status();
                let duration_str = Self::format_duration(latency);
                let request_id = Self::extract_request_id_from_response(response);

                // Clean response log with [RES] prefix and precise timing
                if latency.as_millis() > 1000 {
                    tracing::info!("[RES:{}] {} {} SLOW", request_id, status.as_u16(), duration_str);
                } else {
                    tracing::info!("[RES:{}] {} {}", request_id, status.as_u16(), duration_str);
                }
            })
            .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                let duration_str = Self::format_duration(latency);
                tracing::error!("[ERR] Request failed after {}: {:?}", duration_str, error);
            });

        // Get timeout request from config
        let timeout_requests = self.config.sorai.timeout_request;

        // Add middleware layers in correct order
        let middleware = ServiceBuilder::new()
            .layer(SetRequestIdLayer::new(x_request_id.clone(), MakeTypeSafeRequestId))
            .layer(TimeoutLayer::with_status_code(
                StatusCode::REQUEST_TIMEOUT,
                Duration::from_secs(timeout_requests),
            ))
            .layer(middleware::from_fn(connection_info_middleware))
            .layer(middleware::from_fn(track_metrics))
            .layer(trace_layer_for_http)
            // PropagateRequestIdLayer must come AFTER TraceLayer to send headers from request to response
            .layer(PropagateRequestIdLayer::new(x_request_id));

        // Apply middleware to the app
        app = app.layer(middleware);

        let address = format!("{}:{}", self.config.sorai.host, self.config.sorai.port);
        let app_env = std::env::var("APP_MODE").unwrap_or_else(|_| "development".to_string());

        tracing::info!("Starting Sorai HTTP Server");
        tracing::info!("Listening on: http://{}", address);
        tracing::info!("Environment: {}", app_env);

        let file_logging_enabled = self.parse_rotation().is_some();

        tracing::info!(
            "Log config: level={} log_to_file={} log_rotation={} log_path={}",
            self.config.logging.level,
            file_logging_enabled,
            if file_logging_enabled {
                self.config.logging.rotation
            } else {
                "disabled".to_string()
            },
            if file_logging_enabled {
                self.config.logging.log_directory
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
                origins if origins.is_empty() => {
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

        tracing::info!("Server started at: {}", format_timestamp_readable());

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
                tracing::info!("👋 Ctrl+C received, shutting down...");
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

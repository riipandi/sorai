use crate::config::Config;
use crate::router::create_router;
use crate::utils::time::{PreciseTimeFormat, format_timestamp_readable};
use axum::http::{HeaderName, HeaderValue, Method, Request};
use axum::response::Response;
use std::time::Duration;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};
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

    /// Extract short request ID (first 8 characters)
    fn extract_short_request_id(request: &Request<axum::body::Body>) -> String {
        request
            .headers()
            .get(REQUEST_ID_HEADER)
            .and_then(|v| v.to_str().ok())
            .map(|id| id.chars().take(8).collect())
            .unwrap_or_else(|| "unknown".to_string())
    }

    /// Extract short request ID from response headers
    fn extract_short_request_id_from_response(response: &Response) -> String {
        response
            .headers()
            .get(REQUEST_ID_HEADER)
            .and_then(|v| v.to_str().ok())
            .map(|id| id.chars().take(8).collect())
            .unwrap_or_else(|| "unknown".to_string())
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

    /// Create CORS layer from configuration
    fn create_cors_layer(&self) -> Option<CorsLayer> {
        if !self.config.cors.enabled {
            tracing::info!("🚫 CORS is disabled");
            return None;
        }

        let mut cors = CorsLayer::new();

        // Configure allowed origins
        if self.config.cors.allow_origins.len() == 1 && self.config.cors.allow_origins[0] == "*" {
            cors = cors.allow_origin(tower_http::cors::Any);
            tracing::info!("🌐 CORS: Allow origins = * (any)");
        } else {
            let origins: Result<Vec<HeaderValue>, _> = self
                .config
                .cors
                .allow_origins
                .iter()
                .map(|origin| origin.parse::<HeaderValue>())
                .collect();

            match origins {
                Ok(origin_values) => {
                    cors = cors.allow_origin(origin_values);
                    tracing::info!("🌐 CORS: Allow origins = {}", self.config.cors.allow_origins.join(", "));
                }
                Err(e) => {
                    tracing::error!("❌ Invalid CORS origin configuration: {}", e);
                    tracing::info!("🔄 Falling back to allow any origin");
                    cors = cors.allow_origin(tower_http::cors::Any);
                }
            }
        }

        // Configure allowed methods
        let methods: Result<Vec<Method>, _> = self
            .config
            .cors
            .allow_methods
            .iter()
            .map(|method| method.parse::<Method>())
            .collect();

        match methods {
            Ok(method_values) => {
                cors = cors.allow_methods(method_values);
                tracing::info!("🔧 CORS: Allow methods = {}", self.config.cors.allow_methods.join(", "));
            }
            Err(e) => {
                tracing::error!("❌ Invalid CORS method configuration: {}", e);
                tracing::info!("🔄 Falling back to default methods");
                cors = cors.allow_methods([
                    Method::GET,
                    Method::POST,
                    Method::PUT,
                    Method::DELETE,
                    Method::HEAD,
                    Method::OPTIONS,
                    Method::PATCH,
                ]);
            }
        }

        // Configure allowed headers
        if !self.config.cors.allow_headers.is_empty() {
            let headers: Result<Vec<HeaderName>, _> = self
                .config
                .cors
                .allow_headers
                .iter()
                .map(|header| header.parse::<HeaderName>())
                .collect();

            match headers {
                Ok(header_values) => {
                    cors = cors.allow_headers(header_values);
                    tracing::info!("📋 CORS: Allow headers = {}", self.config.cors.allow_headers.join(", "));
                }
                Err(e) => {
                    tracing::error!("❌ Invalid CORS header configuration: {}", e);
                    tracing::info!("🔄 Falling back to any headers");
                    cors = cors.allow_headers(tower_http::cors::Any);
                }
            }
        }

        // Configure exposed headers
        if !self.config.cors.expose_headers.is_empty() {
            let expose_headers: Result<Vec<HeaderName>, _> = self
                .config
                .cors
                .expose_headers
                .iter()
                .map(|header| header.parse::<HeaderName>())
                .collect();

            match expose_headers {
                Ok(header_values) => {
                    cors = cors.expose_headers(header_values);
                    tracing::info!(
                        "📤 CORS: Expose headers = {}",
                        self.config.cors.expose_headers.join(", ")
                    );
                }
                Err(e) => {
                    tracing::error!("❌ Invalid CORS expose headers configuration: {}", e);
                }
            }
        }

        // Configure credentials
        if self.config.cors.allow_credentials {
            cors = cors.allow_credentials(true);
            tracing::info!("🔐 CORS: Allow credentials = true");
        }

        // Configure max age
        if self.config.cors.max_age > 0 {
            cors = cors.max_age(Duration::from_secs(self.config.cors.max_age));
            tracing::info!("⏰ CORS: Max age = {}s", self.config.cors.max_age);
        }

        Some(cors)
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

        match (enable_file, show_timestamp) {
            // File and console, with timestamp for console
            (true, true) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "❌ Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
                    eprintln!("📝 Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat))
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
                                .with_timer(PreciseTimeFormat),
                        )
                        .with(fmt::layer().compact().with_timer(PreciseTimeFormat))
                        .init();
                }
            }
            // File and console, without timestamp for console
            (true, false) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "❌ Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
                    eprintln!("📝 Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().without_time())
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
                                .with_timer(PreciseTimeFormat),
                        )
                        .with(fmt::layer().compact().without_time())
                        .init();
                }
            }
            // Console only, with timestamp
            (false, true) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().with_timer(PreciseTimeFormat))
                    .init();
            }
            // Console only, without timestamp
            (false, false) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().without_time())
                    .init();
            }
        }
    }

    /// Start the HTTP server
    pub async fn start(self) -> Result<(), Box<dyn std::error::Error>> {
        // Initialize tracing with config
        self.init_tracing();

        let x_request_id = HeaderName::from_static(REQUEST_ID_HEADER);

        // Create base router
        let mut app = create_router();

        // Add CORS layer if enabled
        let cors_enabled = if let Some(cors_layer) = self.create_cors_layer() {
            app = app.layer(cors_layer);
            true
        } else {
            false
        };

        tracing::info!("🌐 CORS: {}", if cors_enabled { "enabled" } else { "disabled" });

        // Add other middleware layers
        let middleware = ServiceBuilder::new()
            // Set request ID layer - generates UUID for each request
            .layer(SetRequestIdLayer::new(x_request_id.clone(), MakeRequestUuid))
            // Add TraceLayer for HTTP request/response logging with request ID
            .layer((
                TraceLayer::new_for_http()
                    .make_span_with(|_request: &Request<_>| {
                        // Create empty span to avoid field duplication in logs
                        tracing::Span::none()
                    })
                    .on_request(|request: &Request<_>, _span: &Span| {
                        let request_id = Self::extract_short_request_id(request);
                        tracing::info!("[REQ:{}] {} {}", request_id, request.method(), request.uri().path());
                    })
                    .on_response(|response: &Response, latency: Duration, _span: &Span| {
                        let status = response.status();
                        let duration_str = Self::format_duration(latency);
                        let request_id = Self::extract_short_request_id_from_response(response);

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
                    }),
                // Used for graceful shutdown
                TimeoutLayer::new(Duration::from_secs(10)),
            ))
            // Propagate request ID to response headers
            .layer(PropagateRequestIdLayer::new(x_request_id));

        // Apply middleware to the app
        app = app.layer(middleware);

        let address = format!("{}:{}", self.config.sorai.host, self.config.sorai.port);

        tracing::info!("🚀 Starting Sorai HTTP Server");
        tracing::info!("📡 Listening on: http://{}", address);
        tracing::info!(
            "🔧 Environment: {}",
            std::env::var("APP_MODE").unwrap_or_else(|_| "development".to_string())
        );
        tracing::info!("📊 Pool Size: {}", self.config.sorai.pool_size);
        tracing::info!("📝 Log Level: {}", self.config.logging.level);

        let file_logging_enabled = self.parse_rotation().is_some();
        tracing::info!(
            "📄 Log to File: {}",
            if file_logging_enabled { "enabled" } else { "disabled" }
        );

        if file_logging_enabled {
            tracing::info!("📁 Log Directory: {}", self.config.logging.log_directory);
            tracing::info!("🔄 Log Rotation: {}", self.config.logging.rotation);
        }

        tracing::info!("🕐 Server started at: {}", format_timestamp_readable());

        let listener = match tokio::net::TcpListener::bind(&address).await {
            Ok(listener) => listener,
            Err(e) => {
                tracing::error!("❌ Failed to bind to address {}: {}", address, e);
                std::process::exit(1);
            }
        };

        tracing::info!("🎯 Server ready to accept connections");

        if let Err(e) = axum::serve(listener, app)
            .with_graceful_shutdown(Self::shutdown_signal())
            .await
        {
            tracing::error!("💥 Server error: {}", e);
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
                tracing::info!("🔄 Termination signal received, shutting down...");
            }
        }
    }
}

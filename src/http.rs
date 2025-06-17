use crate::config::Config;
use crate::router::create_router;
use crate::utils::time::{PreciseTimeFormat, format_timestamp_readable};
use axum::{http::Request, response::Response};
use std::time::Duration;
use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer};
use tracing::{Span, info_span};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

const LOG_NAME_PREFIX: &str = env!("CARGO_PKG_NAME");

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

        let app = create_router()
            // Add TraceLayer for HTTP request/response logging
            .layer(
                TraceLayer::new_for_http()
                    .make_span_with(|_request: &Request<_>| {
                        // Create empty span to avoid field duplication
                        info_span!("request")
                    })
                    .on_request(|request: &Request<_>, _span: &Span| {
                        // Clean request log with [REQ] prefix
                        tracing::info!("[REQ] {} {}", request.method(), request.uri().path());
                    })
                    .on_response(|response: &Response, latency: Duration, _span: &Span| {
                        let status = response.status();
                        let duration_str = Self::format_duration(latency);

                        // Clean response log with [RES] prefix and precise timing
                        if latency.as_millis() > 1000 {
                            tracing::info!("[RES] {} {} SLOW", status.as_u16(), duration_str);
                        } else {
                            tracing::info!("[RES] {} {}", status.as_u16(), duration_str);
                        }
                    })
                    .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                        let duration_str = Self::format_duration(latency);
                        tracing::error!("Request failed after {}: {:?}", duration_str, error);
                    }),
            );

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
        tracing::info!("🖥️  Log to Console: enabled");

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

        if let Err(e) = axum::serve(listener, app).await {
            tracing::error!("💥 Server error: {}", e);
            std::process::exit(1);
        }

        Ok(())
    }
}

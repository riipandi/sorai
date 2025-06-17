use crate::config::Config;
use crate::router::create_router;
use axum::{extract::MatchedPath, http::Request, response::Response};
use chrono::{DateTime, Utc};
use std::time::Duration;
use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer};
use tracing::{Span, info_span};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

const LOG_NAME_PREFIX: &str = env!("CARGO_PKG_NAME");
const LOG_NAME_SUFFIX: &str = ".log";

/// HTTP Server handler
pub struct HttpServer {
    config: Config,
}

impl HttpServer {
    /// Create new HTTP server instance
    pub fn new(config: Config) -> Self {
        Self { config }
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
        let enable_file = self.config.logging.log_to_file;
        let enable_console = self.config.logging.log_to_console;
        let show_timestamp = self.config.logging.show_timestamp;

        // If no logging is enabled, fallback to console
        let (enable_file, enable_console) = if !enable_file && !enable_console {
            eprintln!("⚠️  No logging output configured, enabling console logging as fallback");
            (false, true)
        } else {
            (enable_file, enable_console)
        };

        match (enable_file, enable_console, show_timestamp) {
            // File only, with timestamp
            (true, false, true) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "❌ Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
                    eprintln!("📝 Falling back to console logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().with_timer(fmt::time::UtcTime::rfc_3339()))
                        .init();
                } else {
                    let file_appender =
                        tracing_appender::rolling::daily(&self.config.logging.log_directory, LOG_NAME_PREFIX);
                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(fmt::time::UtcTime::rfc_3339()),
                        )
                        .init();
                }
            }
            // File only, without timestamp
            (true, false, false) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "❌ Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
                    eprintln!("📝 Falling back to console logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().without_time())
                        .init();
                } else {
                    let file_appender =
                        tracing_appender::rolling::daily(&self.config.logging.log_directory, LOG_NAME_PREFIX);
                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
                                .with_ansi(false)
                                .compact()
                                .without_time(),
                        )
                        .init();
                }
            }
            // Console only, with timestamp
            (false, true, true) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().with_timer(fmt::time::UtcTime::rfc_3339()))
                    .init();
            }
            // Console only, without timestamp
            (false, true, false) => {
                tracing_subscriber::registry()
                    .with(env_filter)
                    .with(fmt::layer().compact().without_time())
                    .init();
            }
            // Both file and console, with timestamp
            (true, true, true) => {
                if let Err(e) = std::fs::create_dir_all(&self.config.logging.log_directory) {
                    eprintln!(
                        "❌ Failed to create log directory '{}': {}",
                        self.config.logging.log_directory, e
                    );
                    eprintln!("📝 Falling back to console-only logging");

                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(fmt::layer().compact().with_timer(fmt::time::UtcTime::rfc_3339()))
                        .init();
                } else {
                    let file_appender =
                        tracing_appender::rolling::daily(&self.config.logging.log_directory, LOG_NAME_PREFIX);
                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
                                .with_ansi(false)
                                .compact()
                                .with_timer(fmt::time::UtcTime::rfc_3339()),
                        )
                        .with(fmt::layer().compact().with_timer(fmt::time::UtcTime::rfc_3339()))
                        .init();
                }
            }
            // Both file and console, without timestamp
            (true, true, false) => {
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
                    let file_appender =
                        tracing_appender::rolling::daily(&self.config.logging.log_directory, LOG_NAME_PREFIX);
                    tracing_subscriber::registry()
                        .with(env_filter)
                        .with(
                            fmt::layer()
                                .with_writer(file_appender)
                                .with_ansi(false)
                                .compact()
                                .without_time(),
                        )
                        .with(fmt::layer().compact().without_time())
                        .init();
                }
            }
            // Handle case where both file and console logging are disabled
            (false, false, _) => {
                // This case should never happen due to the earlier fallback,
                // but we need to handle it to satisfy the exhaustive match
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
                    .make_span_with(|request: &Request<_>| {
                        // Log the matched route's path (with placeholders not filled in).
                        // Use request.uri() or OriginalUri if you want the real path.
                        let matched_path = request.extensions().get::<MatchedPath>().map(MatchedPath::as_str);

                        info_span!(
                            "request",
                            method = %request.method(),
                            uri = %request.uri(),
                            path = matched_path,
                            status = tracing::field::Empty,
                            latency_ms = tracing::field::Empty,
                            timestamp = %Utc::now().format("%Y-%m-%d %H:%M:%S UTC"),
                        )
                    })
                    .on_request(|request: &Request<_>, _span: &Span| {
                        tracing::info!("→ {} {}", request.method(), request.uri().path());
                    })
                    .on_response(|response: &Response, latency: Duration, span: &Span| {
                        let latency_ms = latency.as_millis();
                        let status = response.status();

                        span.record("status", status.as_u16());
                        span.record("latency_ms", latency_ms);

                        let status_emoji = match status.as_u16() {
                            200..=299 => "✅",
                            300..=399 => "↩️",
                            400..=499 => "❌",
                            500..=599 => "💥",
                            _ => "❓",
                        };

                        tracing::info!(
                            "← {} {} {}ms {}",
                            status_emoji,
                            status.as_u16(),
                            latency_ms,
                            if latency_ms > 1000 { "⚠️ SLOW" } else { "" }
                        );
                    })
                    .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                        tracing::error!("💥 Request failed after {}ms: {:?}", latency.as_millis(), error);
                    }),
            );

        let address = format!("{}:{}", self.config.sorai.host, self.config.sorai.port);
        let startup_time: DateTime<Utc> = Utc::now();

        tracing::info!("🚀 Starting Sorai HTTP Server");
        tracing::info!("📡 Listening on: http://{}", address);
        tracing::info!(
            "🔧 Environment: {}",
            std::env::var("APP_MODE").unwrap_or_else(|_| "development".to_string())
        );
        tracing::info!("📊 Pool Size: {}", self.config.sorai.pool_size);
        tracing::info!("📝 Log Level: {}", self.config.logging.level);
        tracing::info!(
            "📄 Log to File: {}",
            if self.config.logging.log_to_file {
                "enabled"
            } else {
                "disabled"
            }
        );
        tracing::info!(
            "🖥️  Log to Console: {}",
            if self.config.logging.log_to_console {
                "enabled"
            } else {
                "disabled"
            }
        );
        if self.config.logging.log_to_file {
            tracing::info!("📁 Log Directory: {}", self.config.logging.log_directory);
        }
        tracing::info!("🕐 Server started at: {}", startup_time.format("%Y-%m-%d %H:%M:%S UTC"));

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

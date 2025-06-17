use crate::config::Config;
use crate::router::create_router;
use axum::{extract::MatchedPath, http::Request, response::Response};
use chrono::{DateTime, Utc};
use std::time::Duration;
use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer};
use tracing::{Span, info_span};
use tracing_subscriber::Layer;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

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

        let fmt_layer = fmt::layer()
            .with_target(true)
            .with_thread_ids(false)
            .with_thread_names(false)
            .with_file(false)
            .with_line_number(false)
            .with_level(true)
            .with_ansi(true)
            .compact();

        let fmt_layer = if self.config.logging.show_timestamp {
            fmt_layer.with_timer(fmt::time::UtcTime::rfc_3339()).boxed()
        } else {
            fmt_layer.without_time().boxed()
        };

        tracing_subscriber::registry()
            .with(
                tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                    // axum logs rejections from built-in extractors with the `axum::rejection`
                    // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                    format!(
                        "{}={},tower_http={},axum::rejection=trace",
                        env!("CARGO_CRATE_NAME"),
                        log_level,
                        log_level
                    )
                    .into()
                }),
            )
            .with(fmt_layer)
            .init();
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

        let address = format!("{}:{}", self.config.swift_relay.host, self.config.swift_relay.port);
        let startup_time: DateTime<Utc> = Utc::now();

        tracing::info!("🚀 Starting SwiftRelay HTTP Server");
        tracing::info!("📡 Listening on: http://{}", address);
        tracing::info!(
            "🔧 Environment: {}",
            std::env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string())
        );
        tracing::info!("📊 Pool Size: {}", self.config.swift_relay.pool_size);
        tracing::info!("📝 Log Level: {}", self.config.logging.level);
        tracing::info!(
            "⏰ Show Timestamp: {}",
            if self.config.logging.show_timestamp {
                "enabled"
            } else {
                "disabled"
            }
        );
        tracing::info!("🕐 Server started at: {}", startup_time.format("%Y-%m-%d %H:%M:%S UTC"));

        let listener = match tokio::net::TcpListener::bind(&address).await {
            Ok(listener) => {
                tracing::info!("✅ Server bound successfully to {}", address);
                listener
            }
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

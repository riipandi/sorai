//! Prometheus metrics module for Sorai HTTP server
//!
//! This module provides metrics collection and exposition for monitoring
//! server performance, request patterns, and system health.

use metrics_exporter_prometheus::{Matcher, PrometheusBuilder, PrometheusHandle};

/// Setup Prometheus metrics recorder with custom buckets
/// Returns a handle that can be used to render metrics
pub fn setup_metrics_recorder() -> PrometheusHandle {
    // Define histogram buckets for HTTP request duration
    // These buckets are optimized for typical API response times
    const EXPONENTIAL_SECONDS: &[f64] = &[
        0.005, // 5ms
        0.01,  // 10ms
        0.025, // 25ms
        0.05,  // 50ms
        0.1,   // 100ms
        0.25,  // 250ms
        0.5,   // 500ms
        1.0,   // 1s
        2.5,   // 2.5s
        5.0,   // 5s
        10.0,  // 10s
    ];

    PrometheusBuilder::new()
        .set_buckets_for_metric(
            Matcher::Full("sorai_http_requests_duration_seconds".to_string()),
            EXPONENTIAL_SECONDS,
        )
        .expect("Failed to set histogram buckets")
        .install_recorder()
        .expect("Failed to install Prometheus recorder")
}

/// Record HTTP request metrics
/// This function should be called from middleware to track request patterns
pub fn record_http_request(method: &str, path: &str, status: u16, duration_seconds: f64) {
    let labels = [
        ("method", method.to_string()),
        ("path", path.to_string()),
        ("status", status.to_string()),
    ];

    // Increment total request counter
    metrics::counter!("sorai_http_requests_total", &labels).increment(1);

    // Record request duration histogram
    metrics::histogram!("sorai_http_requests_duration_seconds", &labels).record(duration_seconds);
}

/// Record server startup metrics
pub fn record_server_info(version: &str, build: &str) {
    let labels = [("version", version.to_string()), ("build", build.to_string())];

    metrics::gauge!("sorai_server_info", &labels).set(1.0);
}

/// Record connection pool metrics
pub fn record_pool_metrics(provider: &str, active: u64, idle: u64) {
    let provider_label = [("provider", provider.to_string())];

    metrics::gauge!("sorai_connection_pool_active", &provider_label).set(active as f64);
    metrics::gauge!("sorai_connection_pool_idle", &provider_label).set(idle as f64);
}

/// Record token usage metrics
pub fn record_token_usage(provider: &str, model: &str, token_type: &str, count: u64) {
    let labels = [
        ("provider", provider.to_string()),
        ("model", model.to_string()),
        ("type", token_type.to_string()),
    ];

    metrics::counter!("sorai_tokens_total", &labels).increment(count);
}

/// Record error metrics
pub fn record_error(provider: &str, error_type: &str) {
    let labels = [
        ("provider", provider.to_string()),
        ("error_type", error_type.to_string()),
    ];

    metrics::counter!("sorai_errors_total", &labels).increment(1);
}

/// Record fallback usage
pub fn record_fallback_usage(primary_provider: &str, fallback_provider: &str) {
    let labels = [
        ("primary_provider", primary_provider.to_string()),
        ("fallback_provider", fallback_provider.to_string()),
    ];

    metrics::counter!("sorai_fallback_usage_total", &labels).increment(1);
}

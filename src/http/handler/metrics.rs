use axum::extract::State;
use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use metrics_exporter_prometheus::PrometheusHandle;

/// Metrics endpoint handler
/// GET /metrics
/// Returns Prometheus-compatible metrics for monitoring
pub async fn metrics(State(prometheus_handle): State<PrometheusHandle>) -> impl IntoResponse {
    let metrics_data = prometheus_handle.render();

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "text/plain; version=0.0.4; charset=utf-8")
        .body(metrics_data)
        .unwrap()
}

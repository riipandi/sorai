use axum::body::Body;
use axum::http::{Request, StatusCode};
use swift_relay::create_router;
use tower::util::ServiceExt;

#[tokio::test]
async fn test_metrics_endpoint() {
    let app = create_router();

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    // Check content type header
    let content_type = response.headers().get("content-type").unwrap();
    assert_eq!(content_type, "text/plain; version=0.0.4; charset=utf-8");

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();

    // Verify Prometheus format metrics are present
    assert!(body_str.contains("# HELP swift_relay_requests_total"));
    assert!(body_str.contains("# TYPE swift_relay_requests_total counter"));
    assert!(body_str.contains("swift_relay_requests_total{"));

    // Verify request duration metrics
    assert!(body_str.contains("# HELP swift_relay_request_duration_seconds"));
    assert!(body_str.contains("# TYPE swift_relay_request_duration_seconds histogram"));
    assert!(body_str.contains("swift_relay_request_duration_seconds_bucket{"));

    // Verify token metrics
    assert!(body_str.contains("# HELP swift_relay_tokens_total"));
    assert!(body_str.contains("# TYPE swift_relay_tokens_total counter"));
    assert!(body_str.contains("swift_relay_tokens_total{"));

    // Verify error metrics
    assert!(body_str.contains("# HELP swift_relay_errors_total"));
    assert!(body_str.contains("# TYPE swift_relay_errors_total counter"));
    assert!(body_str.contains("swift_relay_errors_total{"));

    // Verify connection pool metrics
    assert!(body_str.contains("# HELP swift_relay_connection_pool_active"));
    assert!(body_str.contains("# TYPE swift_relay_connection_pool_active gauge"));
    assert!(body_str.contains("swift_relay_connection_pool_active{"));

    // Verify fallback metrics
    assert!(body_str.contains("# HELP swift_relay_fallback_usage_total"));
    assert!(body_str.contains("# TYPE swift_relay_fallback_usage_total counter"));
    assert!(body_str.contains("swift_relay_fallback_usage_total{"));

    // Verify server info metrics
    assert!(body_str.contains("# HELP swift_relay_server_info"));
    assert!(body_str.contains("# TYPE swift_relay_server_info gauge"));
    assert!(body_str.contains("swift_relay_server_info{"));
}

#[tokio::test]
async fn test_metrics_contains_provider_labels() {
    let app = create_router();

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();

    // Verify different providers are included in metrics
    assert!(body_str.contains("provider=\"openai\""));
    assert!(body_str.contains("provider=\"anthropic\""));
    assert!(body_str.contains("provider=\"bedrock\""));

    // Verify model labels
    assert!(body_str.contains("model=\"gpt-4o\""));
    assert!(body_str.contains("model=\"claude-3-sonnet\""));

    // Verify status labels
    assert!(body_str.contains("status=\"success\""));
    assert!(body_str.contains("status=\"error\""));

    // Verify error type labels
    assert!(body_str.contains("error_type=\"rate_limit\""));
    assert!(body_str.contains("error_type=\"authentication\""));
    assert!(body_str.contains("error_type=\"bad_gateway\""));
}

#[tokio::test]
async fn test_metrics_contains_numeric_values() {
    let app = create_router();

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();

    // Verify metrics have numeric values
    assert!(body_str.contains("} 150"));
    assert!(body_str.contains("} 75"));
    assert!(body_str.contains("} 25"));

    // Verify histogram buckets
    assert!(body_str.contains("le=\"0.1\""));
    assert!(body_str.contains("le=\"0.5\""));
    assert!(body_str.contains("le=\"1.0\""));
    assert!(body_str.contains("le=\"+Inf\""));

    // Verify sum and count metrics
    assert!(body_str.contains("_sum{"));
    assert!(body_str.contains("_count{"));
}

#[tokio::test]
async fn test_metrics_prometheus_format_validity() {
    let app = create_router();

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body.to_vec()).unwrap();

    // Verify each metric has proper HELP and TYPE declarations
    let lines: Vec<&str> = body_str.lines().collect();
    let mut help_count = 0;
    let mut type_count = 0;

    for line in lines {
        if line.starts_with("# HELP") {
            help_count += 1;
        } else if line.starts_with("# TYPE") {
            type_count += 1;
        }
    }

    // Should have equal number of HELP and TYPE declarations
    assert_eq!(help_count, type_count);
    assert!(help_count > 0);
}

#[tokio::test]
async fn test_metrics_method_not_allowed() {
    let app = create_router();

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
}

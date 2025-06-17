use axum::body::Body;
use axum::http::{Request, StatusCode};
use sorai::http::create_router;
use tower::util::ServiceExt;

#[tokio::test]
async fn test_index_route() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(Request::builder().method("GET").uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["success"], true);
    assert_eq!(response_json["data"]["message"], "All is well");
    assert!(response_json["message"].is_null());
}

#[tokio::test]
async fn test_health_check_route() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["success"], true);
    assert_eq!(response_json["data"]["status"], "OK");
    assert_eq!(response_json["data"]["service"], "Sorai");
    assert!(response_json["data"]["version"].is_string());
    assert!(!response_json["data"]["version"].as_str().unwrap().is_empty());
}

#[tokio::test]
async fn test_status_route() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/status")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["success"], true);
    assert_eq!(response_json["data"]["message"], "Sorai Server is running");
    assert!(response_json["message"].is_null());
}

#[tokio::test]
async fn test_health_endpoints_content_type() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let endpoints = vec!["/", "/healthz", "/status"];

    for endpoint in endpoints {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("GET")
                    .uri(endpoint)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        // Check that response is JSON
        let content_type = response.headers().get("content-type");
        if let Some(ct) = content_type {
            assert!(ct.to_str().unwrap().contains("application/json"));
        }

        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let response_json: Result<serde_json::Value, _> = serde_json::from_slice(&body);
        assert!(
            response_json.is_ok(),
            "Response should be valid JSON for endpoint {}",
            endpoint
        );
    }
}

#[tokio::test]
async fn test_health_endpoints_response_structure() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let endpoints = vec!["/", "/healthz", "/status"];

    for endpoint in endpoints {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("GET")
                    .uri(endpoint)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

        // Verify standard ApiResponse structure
        assert!(
            response_json.is_object(),
            "Response should be an object for endpoint {}",
            endpoint
        );
        assert!(
            response_json.get("success").is_some(),
            "Response should have 'success' field for endpoint {}",
            endpoint
        );
        assert!(
            response_json.get("data").is_some(),
            "Response should have 'data' field for endpoint {}",
            endpoint
        );
        assert_eq!(
            response_json["success"], true,
            "Success should be true for endpoint {}",
            endpoint
        );
    }
}

#[tokio::test]
async fn test_health_endpoints_method_not_allowed() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let endpoints = vec!["/", "/healthz", "/status"];

    for endpoint in endpoints {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(endpoint)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(
            response.status(),
            StatusCode::METHOD_NOT_ALLOWED,
            "POST should not be allowed for endpoint {}",
            endpoint
        );
    }
}

#[tokio::test]
async fn test_not_found_route() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/nonexistent")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_multiple_requests_consistency() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    // Test multiple requests to ensure handlers work consistently
    for i in 0..5 {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("GET")
                    .uri("/healthz")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK, "Request {} should succeed", i);

        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

        assert_eq!(response_json["success"], true, "Request {} should return success", i);
        assert_eq!(
            response_json["data"]["status"], "OK",
            "Request {} should return OK status",
            i
        );
        assert_eq!(
            response_json["data"]["service"], "Sorai",
            "Request {} should return correct service name",
            i
        );
    }
}

#[tokio::test]
async fn test_health_check_version_format() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    let version = response_json["data"]["version"].as_str().unwrap();

    // Version should follow semantic versioning pattern (basic check)
    assert!(version.contains('.'), "Version should contain dots");
    assert!(!version.is_empty(), "Version should not be empty");

    // Should be able to split by dots
    let parts: Vec<&str> = version.split('.').collect();
    assert!(parts.len() >= 2, "Version should have at least major.minor format");
}

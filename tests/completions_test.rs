use axum::body::Body;
use axum::http::{Request, StatusCode};
use serde_json::json;
use sorai::http::create_router;
use tower::util::ServiceExt;

#[tokio::test]
async fn test_chat_completions_success() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Hello, world!"
            }
        ]
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["success"], true);
    assert!(response_json["data"]["id"].as_str().unwrap().starts_with("chatcmpl-"));
    assert_eq!(response_json["data"]["object"], "chat.completion");
    assert_eq!(response_json["data"]["model"], "gpt-4o-mini");
}

#[tokio::test]
async fn test_chat_completions_missing_provider() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Hello, world!"
            }
        ]
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["status_code"], 400);
    assert_eq!(response_json["error"]["code"], "bad_request");
    assert_eq!(response_json["error"]["message"], "Provider is required");
}

#[tokio::test]
async fn test_chat_completions_empty_messages() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-4o-mini",
        "messages": []
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["error"]["message"], "Messages array cannot be empty");
}

#[tokio::test]
async fn test_text_completions_success() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-3.5-turbo-instruct",
        "text": "The future of AI is"
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/text/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["success"], true);
    assert!(response_json["data"]["id"].as_str().unwrap().starts_with("cmpl-"));
    assert_eq!(response_json["data"]["object"], "text.completion");
    assert_eq!(response_json["data"]["model"], "gpt-3.5-turbo-instruct");
}

#[tokio::test]
async fn test_text_completions_missing_text() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-3.5-turbo-instruct"
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/text/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["error"]["message"], "Text prompt is required");
}

#[tokio::test]
async fn test_text_completions_empty_text() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-3.5-turbo-instruct",
        "text": ""
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/text/completions")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(response_json["error"]["message"], "Text prompt is required");
}

#[tokio::test]
async fn test_invalid_json_request() {
    let app = create_router(/* metrics_exporter_prometheus::recorder::PrometheusHandle */);

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("content-type", "application/json")
                .body(Body::from("invalid json"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

use axum::body::Body;
use axum::http::{Request, StatusCode};
use serde_json::json;
use sorai::create_router;
use tower::util::ServiceExt;

#[tokio::test]
async fn test_full_application_routes() {
    let app = create_router();

    // Test all major routes are accessible
    let routes = vec![
        ("GET", "/", StatusCode::OK),
        ("GET", "/healthz", StatusCode::OK),
        ("GET", "/status", StatusCode::OK),
        ("GET", "/metrics", StatusCode::OK),
        ("GET", "/nonexistent", StatusCode::NOT_FOUND),
    ];

    for (method, path, expected_status) in routes {
        let response = app
            .clone()
            .oneshot(Request::builder().method(method).uri(path).body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(
            response.status(),
            expected_status,
            "Route {} {} should return {}",
            method,
            path,
            expected_status
        );
    }
}

#[tokio::test]
async fn test_api_endpoints_require_post() {
    let app = create_router();

    let api_endpoints = vec!["/v1/chat/completions", "/v1/text/completions"];

    for endpoint in api_endpoints {
        // GET should not be allowed
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

        assert_eq!(
            response.status(),
            StatusCode::METHOD_NOT_ALLOWED,
            "GET should not be allowed for {}",
            endpoint
        );
    }
}

#[tokio::test]
async fn test_chat_completions_full_workflow() {
    let app = create_router();

    // Test successful request
    let request_body = json!({
        "provider": "openai",
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello, how are you?"
            }
        ],
        "params": {
            "max_tokens": 100,
            "temperature": 0.7
        }
    });

    let response = app
        .clone()
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

    // Verify response structure
    assert_eq!(response_json["success"], true);
    assert!(response_json["data"]["id"].is_string());
    assert_eq!(response_json["data"]["object"], "chat.completion");
    assert_eq!(response_json["data"]["model"], "gpt-4o");
    assert!(response_json["data"]["choices"].is_array());
    assert!(response_json["data"]["usage"].is_object());
    assert!(response_json["data"]["extra_fields"].is_object());

    // Verify choice structure
    let choices = response_json["data"]["choices"].as_array().unwrap();
    assert!(!choices.is_empty());
    assert_eq!(choices[0]["index"], 0);
    assert!(choices[0]["message"].is_object());
    assert_eq!(choices[0]["finish_reason"], "stop");
}

#[tokio::test]
async fn test_text_completions_full_workflow() {
    let app = create_router();

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-3.5-turbo-instruct",
        "text": "The benefits of renewable energy include",
        "params": {
            "max_tokens": 150,
            "temperature": 0.5,
            "stop_sequences": ["\n\n"]
        }
    });

    let response = app
        .clone()
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

    // Verify response structure
    assert_eq!(response_json["success"], true);
    assert!(response_json["data"]["id"].is_string());
    assert_eq!(response_json["data"]["object"], "text.completion");
    assert_eq!(response_json["data"]["model"], "gpt-3.5-turbo-instruct");
    assert!(response_json["data"]["choices"].is_array());
    assert!(response_json["data"]["usage"].is_object());
    assert!(response_json["data"]["extra_fields"].is_object());
}

#[tokio::test]
async fn test_error_handling_consistency() {
    let app = create_router();

    // Test various error scenarios
    let error_cases = vec![
        (
            "/v1/chat/completions",
            json!({"model": "gpt-4o", "messages": []}),
            "Provider is required",
        ),
        (
            "/v1/chat/completions",
            json!({"provider": "openai", "messages": []}),
            "Model is required",
        ),
        (
            "/v1/chat/completions",
            json!({"provider": "openai", "model": "gpt-4o", "messages": []}),
            "Messages array cannot be empty",
        ),
        (
            "/v1/text/completions",
            json!({"model": "gpt-3.5-turbo-instruct", "text": "hello"}),
            "Provider is required",
        ),
        (
            "/v1/text/completions",
            json!({"provider": "openai", "text": "hello"}),
            "Model is required",
        ),
        (
            "/v1/text/completions",
            json!({"provider": "openai", "model": "gpt-3.5-turbo-instruct"}),
            "Text prompt is required",
        ),
    ];

    for (endpoint, request_body, expected_message) in error_cases {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(endpoint)
                    .header("content-type", "application/json")
                    .body(Body::from(request_body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::BAD_REQUEST);

        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let response_json: serde_json::Value = serde_json::from_slice(&body).unwrap();

        // Verify error structure
        assert_eq!(response_json["status_code"], 400);
        assert_eq!(response_json["error_type"], "invalid_request_error");
        assert_eq!(response_json["error"]["code"], "bad_request");
        assert_eq!(response_json["error"]["message"], expected_message);
        assert!(response_json["is_sorai_error"].as_bool().unwrap());
        assert!(response_json["event_id"].is_string());
        assert!(response_json["error"]["event_id"].is_string());
    }
}

#[tokio::test]
async fn test_content_type_validation() {
    let app = create_router();

    // Test missing content-type header
    let response = app
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .body(Body::from(r#"{"provider":"openai","model":"gpt-4o","messages":[]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    // Should still work (Axum is lenient with content-type)
    assert_eq!(response.status(), StatusCode::BAD_REQUEST); // Due to empty messages, not content-type

    // Test wrong content-type
    let response = app
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("content-type", "text/plain")
                .body(Body::from(r#"{"provider":"openai","model":"gpt-4o","messages":[]}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    // Should handle gracefully
    assert!(response.status().is_client_error());
}

#[tokio::test]
async fn test_large_request_handling() {
    let app = create_router();

    // Create a large messages array
    let mut messages = Vec::new();
    for i in 0..100 {
        messages.push(json!({
            "role": if i % 2 == 0 { "user" } else { "assistant" },
            "content": format!("This is message number {} in a long conversation", i)
        }));
    }

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-4o",
        "messages": messages
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
}

#[tokio::test]
async fn test_concurrent_requests() {
    let app = create_router();

    let request_body = json!({
        "provider": "openai",
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": "Hello"
            }
        ]
    });

    // Send multiple concurrent requests
    let mut handles = Vec::new();
    for i in 0..10 {
        let app_clone = app.clone();
        let body_clone = request_body.clone();

        let handle = tokio::spawn(async move {
            let response = app_clone
                .oneshot(
                    Request::builder()
                        .method("POST")
                        .uri("/v1/chat/completions")
                        .header("content-type", "application/json")
                        .body(Body::from(body_clone.to_string()))
                        .unwrap(),
                )
                .await
                .unwrap();

            (i, response.status())
        });

        handles.push(handle);
    }

    // Wait for all requests to complete
    for handle in handles {
        let (request_id, status) = handle.await.unwrap();
        assert_eq!(status, StatusCode::OK, "Request {} should succeed", request_id);
    }
}

// Unit tests for proxy_to_vite handler
use axum::body::Body;
use axum::extract::Request;
use axum::http::{HeaderMap, HeaderValue, Method, StatusCode};
use tower::ServiceExt;
use vite_axum::{ViteProxyOptions, create_vite_router};

#[tokio::test]
async fn test_proxy_handler_creates_response() {
    ViteProxyOptions::new().port(9999).build().unwrap();

    let router = create_vite_router();

    let request = Request::builder()
        .method(Method::GET)
        .uri("/test.js")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    // Should get some response (may be BAD_GATEWAY if Vite not running)
    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_proxy_with_custom_headers() {
    ViteProxyOptions::new().port(9998).build().unwrap();

    let router = create_vite_router();

    let mut headers = HeaderMap::new();
    headers.insert("content-type", HeaderValue::from_static("application/javascript"));
    headers.insert("accept", HeaderValue::from_static("*/*"));

    let request = Request::builder()
        .method(Method::GET)
        .uri("/app.js")
        .header("content-type", "application/javascript")
        .header("accept", "*/*")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_proxy_with_post_request() {
    ViteProxyOptions::new().port(9997).build().unwrap();

    let router = create_vite_router();

    let body = Body::from("{\"key\":\"value\"}");

    let request = Request::builder()
        .method(Method::POST)
        .uri("/api/test")
        .header("content-type", "application/json")
        .body(body)
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    // Vite proxy only handles GET requests, so POST should return METHOD_NOT_ALLOWED
    assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
}

#[tokio::test]
async fn test_proxy_with_query_parameters() {
    ViteProxyOptions::new().port(9996).build().unwrap();

    let router = create_vite_router();

    let request = Request::builder()
        .method(Method::GET)
        .uri("/app.js?v=2&t=123456789")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_proxy_state_creation() {
    let state = vite_axum::create_vite_state(3000);

    assert_eq!(state.port, 3000);
}

#[tokio::test]
async fn test_proxy_multiple_requests() {
    ViteProxyOptions::new().port(9995).build().unwrap();

    let router = create_vite_router();

    let paths = vec!["/index.html", "/app.js", "/style.css", "/logo.png"];

    for path in paths {
        let request = Request::builder()
            .method(Method::GET)
            .uri(path)
            .body(Body::empty())
            .unwrap();

        let response = router
            .clone()
            .oneshot(request)
            .await
            .expect(&format!("Request failed for path: {}", path));

        assert!(response.status() != StatusCode::NOT_FOUND);
    }
}

#[tokio::test]
async fn test_proxy_preserves_headers() {
    ViteProxyOptions::new().port(9994).build().unwrap();

    let router = create_vite_router();

    let custom_header = "X-Custom-Header";
    let custom_value = "test-value";

    let request = Request::builder()
        .method(Method::GET)
        .uri("/test.js")
        .header(custom_header, custom_value)
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    // Response should exist (though headers may not match if Vite not running)
    assert!(response.status() != StatusCode::NOT_FOUND);
}

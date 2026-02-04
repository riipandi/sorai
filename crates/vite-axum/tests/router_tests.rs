// Integration tests for vite-axum router factory
use axum::body::Body;
use axum::extract::Request;
use axum::http::{Method, StatusCode};
use tower::ServiceExt;
use vite_axum::create_vite_router;

#[tokio::test]
async fn test_create_vite_router() {
    let _router = create_vite_router();

    // Router should be created without panicking
    assert!(true);
}

#[tokio::test]
async fn test_router_has_file_route() {
    let router = create_vite_router();

    let request = Request::builder().uri("/test.js").body(Body::empty()).unwrap();

    let response = router.oneshot(request).await.unwrap();

    // Should return some response (may fail to connect to Vite in tests)
    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_router_has_node_modules_route() {
    let router = create_vite_router();

    let request = Request::builder()
        .uri("/node_modules/test/index.js")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_router_wildcard_matches_nested_paths() {
    let router = create_vite_router();

    let test_paths = vec![
        "/src/main.tsx",
        "/components/Button.tsx",
        "/assets/styles.css",
        "/images/logo.png",
    ];

    for path in test_paths {
        let request = Request::builder().uri(path).body(Body::empty()).unwrap();

        let response = router
            .clone()
            .oneshot(request)
            .await
            .expect(&format!("Request failed for path: {}", path));

        assert!(response.status() != StatusCode::NOT_FOUND, "Path {} returned 404", path);
    }
}

#[tokio::test]
async fn test_router_matches_root() {
    let router = create_vite_router();

    let request = Request::builder()
        .method(Method::GET)
        .uri("/")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_router_with_query_params() {
    let router = create_vite_router();

    let request = Request::builder()
        .uri("/test.js?v=123&debug=true")
        .body(Body::empty())
        .unwrap();

    let response = router.oneshot(request).await.unwrap();

    assert!(response.status() != StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_router_different_methods() {
    let router = create_vite_router();

    // Test GET
    let get_request = Request::builder()
        .method(Method::GET)
        .uri("/test.js")
        .body(Body::empty())
        .unwrap();

    let get_response = router.clone().oneshot(get_request).await.expect("GET request failed");

    assert!(get_response.status() != StatusCode::METHOD_NOT_ALLOWED);
}

#[tokio::test]
async fn test_router_deep_nested_paths() {
    let router = create_vite_router();

    let deep_paths = vec![
        "/src/components/layout/Header/index.tsx",
        "/node_modules/@babel/runtime/helpers/esm/extends.js",
        "/assets/images/icons/logo.svg",
    ];

    for path in deep_paths {
        let request = Request::builder().uri(path).body(Body::empty()).unwrap();

        let response = router
            .clone()
            .oneshot(request)
            .await
            .expect(&format!("Request failed for deep path: {}", path));

        assert!(
            response.status() != StatusCode::NOT_FOUND,
            "Deep path {} returned 404",
            path
        );
    }
}

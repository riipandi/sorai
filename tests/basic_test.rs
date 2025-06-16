use axum::http::{Request, StatusCode};
use axum::{Router, body::Body, routing::get};
use tower::util::ServiceExt;

async fn index() -> &'static str {
    "Hello, World!!!"
}

fn create_app() -> Router {
    Router::new().route("/", get(index))
}

#[tokio::test]
async fn test_index_route() {
    let app = create_app();

    let response = app
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    assert_eq!(&body[..], b"Hello, World!!!");
}

#[tokio::test]
async fn test_not_found_route() {
    let app = create_app();

    let response = app
        .oneshot(Request::builder().uri("/nonexistent").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_multiple_requests() {
    let app = create_app();

    // Test multiple requests to ensure the handler works consistently
    for _ in 0..5 {
        let response = app
            .clone()
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"Hello, World!!!");
    }
}

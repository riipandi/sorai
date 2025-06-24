use crate::http::response::*;
use serde_json::json;

#[test]
fn test_success_response() {
    let response = success("test data");
    assert!(response.success);
    assert_eq!(response.data, "test data");
    assert!(response.message.is_none());
}

#[test]
fn test_success_response_with_message() {
    let response = success_with_message("test data", "Success message".to_string());
    assert!(response.success);
    assert_eq!(response.data, "test data");
    assert_eq!(response.message, Some("Success message".to_string()));
}

#[test]
fn test_api_response_success() {
    let response = ApiResponse::success("hello world");
    assert!(response.success);
    assert_eq!(response.data, "hello world");
    assert!(response.message.is_none());
}

#[test]
fn test_api_response_success_with_message() {
    let response = ApiResponse::success_with_message("hello world", "Operation completed".to_string());
    assert!(response.success);
    assert_eq!(response.data, "hello world");
    assert_eq!(response.message, Some("Operation completed".to_string()));
}

#[test]
fn test_sorai_error_bad_request() {
    let error = SoraiError::bad_request("Invalid input", Some(json!({"field": "name"})));
    assert_eq!(error.status_code, 400);
    assert_eq!(error.error_type, "invalid_request_error");
    assert_eq!(error.error.code, "bad_request");
    assert_eq!(error.error.message, "Invalid input");
    assert!(error.is_sorai_error);
    assert!(error.event_id.len() > 0);
    assert_eq!(error.error.event_id, error.event_id);
}

#[test]
fn test_sorai_error_unauthorized() {
    let error = SoraiError::unauthorized("Invalid API key");
    assert_eq!(error.status_code, 401);
    assert_eq!(error.error_type, "authentication_error");
    assert_eq!(error.error.code, "unauthorized");
    assert_eq!(error.error.message, "Invalid API key");
    assert!(error.is_sorai_error);
    assert!(error.error.param.is_none());
}

#[test]
fn test_sorai_error_rate_limit() {
    let error = SoraiError::rate_limit_exceeded("Too many requests");
    assert_eq!(error.status_code, 429);
    assert_eq!(error.error_type, "rate_limit_error");
    assert_eq!(error.error.code, "rate_limit_exceeded");
    assert_eq!(error.error.message, "Too many requests");
    assert!(error.is_sorai_error);
}

#[test]
fn test_sorai_error_internal_server_error() {
    let error = SoraiError::internal_server_error("Something went wrong");
    assert_eq!(error.status_code, 500);
    assert_eq!(error.error_type, "internal_error");
    assert_eq!(error.error.code, "internal_server_error");
    assert_eq!(error.error.message, "Something went wrong");
    assert!(error.is_sorai_error);
}

#[test]
fn test_sorai_error_bad_gateway() {
    let error = SoraiError::bad_gateway("Provider service unavailable");
    assert_eq!(error.status_code, 502);
    assert_eq!(error.error_type, "provider_error");
    assert_eq!(error.error.code, "bad_gateway");
    assert_eq!(error.error.message, "Provider service unavailable");
    assert!(error.is_sorai_error);
}

#[test]
fn test_sorai_error_service_unavailable() {
    let error = SoraiError::service_unavailable("Service temporarily unavailable");
    assert_eq!(error.status_code, 503);
    assert_eq!(error.error_type, "service_error");
    assert_eq!(error.error.code, "service_unavailable");
    assert_eq!(error.error.message, "Service temporarily unavailable");
    assert!(error.is_sorai_error);
}

#[test]
fn test_helper_error_function() {
    use axum::http::StatusCode;

    let error = error(
        StatusCode::BAD_REQUEST,
        "validation_error",
        "invalid_field",
        "Field validation failed",
        Some(json!({"field": "email"})),
    );

    assert_eq!(error.status_code, 400);
    assert_eq!(error.error_type, "validation_error");
    assert_eq!(error.error.code, "invalid_field");
    assert_eq!(error.error.message, "Field validation failed");
    assert!(error.is_sorai_error);
    assert_eq!(error.error.param, Some(json!({"field": "email"})));
}

#[test]
fn test_event_id_consistency() {
    let error = SoraiError::bad_request("Test error", None);
    assert_eq!(error.event_id, error.error.event_id);
    assert!(error.event_id.len() > 0);
}

#[test]
fn test_error_field_structure() {
    let error = SoraiError::unauthorized("Access denied");

    assert_eq!(error.error.error_type, "authentication_error");
    assert_eq!(error.error.code, "unauthorized");
    assert_eq!(error.error.message, "Access denied");
    assert!(error.error.param.is_none());
    assert!(!error.error.event_id.is_empty());
}

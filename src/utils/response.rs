use axum::response::{IntoResponse, Response};
use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use type_safe_id::{StaticType, TypeSafeId};

/// Error event type for TypeID
#[derive(Default)]
struct ErrorEvent;

impl StaticType for ErrorEvent {
    const TYPE: &'static str = "err";
}

/// Type alias for error event ID
type ErrorEventId = TypeSafeId<ErrorEvent>;

/// Standard API response wrapper for success cases
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: T,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

/// Standard error response following Sorai specification
#[derive(Debug, Serialize, Deserialize)]
pub struct SoraiError {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub event_id: Option<String>,
    pub is_sorai_error: bool,
    pub status_code: u16,
    pub error: ErrorField,
}

/// Detailed error information
#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorField {
    #[serde(rename = "type")]
    pub error_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub param: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub event_id: Option<String>,
}

impl<T> ApiResponse<T>
where
    T: Serialize,
{
    /// Create a new success response
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data,
            message: None,
        }
    }

    /// Create a new success response with message
    pub fn success_with_message(data: T, message: String) -> Self {
        Self {
            success: true,
            data,
            message: Some(message),
        }
    }
}

impl<T> IntoResponse for ApiResponse<T>
where
    T: Serialize,
{
    fn into_response(self) -> Response {
        Json(self).into_response()
    }
}

impl SoraiError {
    /// Create a new Sorai error
    pub fn new(
        status_code: StatusCode,
        error_type: &str,
        code: Option<&str>,
        message: &str,
        param: Option<serde_json::Value>,
        is_sorai_error: bool,
    ) -> Self {
        let event_id = if is_sorai_error {
            let id = ErrorEventId::new();
            Some(id.to_string())
        } else {
            None
        };

        Self {
            event_id: event_id.clone(),
            is_sorai_error,
            status_code: status_code.as_u16(),
            error: ErrorField {
                error_type: error_type.to_string(),
                code: code.map(|c| c.to_string()),
                message: message.to_string(),
                param,
                event_id,
            },
        }
    }

    /// Create a bad request error (400)
    pub fn bad_request(message: &str, param: Option<serde_json::Value>) -> Self {
        Self::new(
            StatusCode::BAD_REQUEST,
            "invalid_request_error",
            Some("missing_required_parameter"),
            message,
            param,
            true,
        )
    }

    /// Create an unauthorized error (401)
    /// Used for authentication failures (missing or invalid API key)
    pub fn unauthorized(message: &str) -> Self {
        Self::new(
            StatusCode::UNAUTHORIZED,
            "authentication_error",
            None,
            message,
            None,
            true,
        )
    }

    /// Create a forbidden error (403)
    /// Used for authorization failures (valid API key but insufficient permissions)
    /// TODO: Implement when role-based access control is added
    pub fn forbidden(message: &str) -> Self {
        Self::new(
            StatusCode::FORBIDDEN,
            "authorization_error",
            Some("forbidden"),
            message,
            None,
            true,
        )
    }

    /// Create a rate limit error (429)
    pub fn rate_limit_exceeded(message: &str) -> Self {
        Self::new(
            StatusCode::TOO_MANY_REQUESTS,
            "rate_limit_error",
            None,
            message,
            None,
            false,
        )
    }

    /// Create an internal server error (500)
    pub fn internal_server_error(message: &str) -> Self {
        Self::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "api_error",
            None,
            message,
            None,
            true,
        )
    }

    /// Create a bad gateway error (502)
    pub fn bad_gateway(message: &str) -> Self {
        Self::new(
            StatusCode::BAD_GATEWAY,
            "provider_error",
            Some("bad_gateway"),
            message,
            None,
            true,
        )
    }

    /// Create a service unavailable error (503)
    pub fn service_unavailable(message: &str) -> Self {
        Self::new(
            StatusCode::SERVICE_UNAVAILABLE,
            "service_error",
            Some("service_unavailable"),
            message,
            None,
            true,
        )
    }

    /// Create an API key related error (401)
    /// Specific error for API key authentication issues
    pub fn invalid_api_key(message: &str) -> Self {
        Self::new(
            StatusCode::UNAUTHORIZED,
            "authentication_error",
            None,
            message,
            Some(serde_json::json!({
                "hint": "Please check your Bearer token format: 'Authorization: Bearer sk-xxxx'"
            })),
            true,
        )
    }

    /// Create an API key quota exceeded error (429)
    /// TODO: Implement when usage tracking is added
    pub fn quota_exceeded(message: &str, quota_info: Option<serde_json::Value>) -> Self {
        Self::new(
            StatusCode::TOO_MANY_REQUESTS,
            "quota_error",
            Some("quota_exceeded"),
            message,
            quota_info,
            true,
        )
    }
}

impl IntoResponse for SoraiError {
    fn into_response(self) -> Response {
        let status_code = StatusCode::from_u16(self.status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);

        (status_code, Json(self)).into_response()
    }
}

/// Helper function to create success response
pub fn success<T>(data: T) -> ApiResponse<T>
where
    T: Serialize,
{
    ApiResponse::success(data)
}

/// Helper function to create success response with message
pub fn success_with_message<T>(data: T, message: String) -> ApiResponse<T>
where
    T: Serialize,
{
    ApiResponse::success_with_message(data, message)
}

/// Helper function to create error response
pub fn error(
    status_code: StatusCode,
    error_type: &str,
    code: Option<&str>,
    message: &str,
    param: Option<serde_json::Value>,
    is_sorai_error: bool,
) -> SoraiError {
    SoraiError::new(status_code, error_type, code, message, param, is_sorai_error)
}

// TODO: Add additional response utilities:
// - Pagination response wrapper
// - Streaming response helpers
// - File upload/download response helpers
// - Webhook response formatters
// - API versioning response headers
// - Response caching utilities
// - Response compression helpers
// - Custom error types for specific business logic
// - Response validation utilities
// - Response transformation middleware

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
    pub event_id: String,
    #[serde(rename = "type")]
    pub error_type: String,
    pub is_sorai_error: bool,
    pub status_code: u16,
    pub error: ErrorField,
}

/// Detailed error information
#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorField {
    #[serde(rename = "type")]
    pub error_type: String,
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub param: Option<serde_json::Value>,
    pub event_id: String,
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
        code: &str,
        message: &str,
        param: Option<serde_json::Value>,
    ) -> Self {
        let event_id = ErrorEventId::new();
        let event_id_str = event_id.to_string();

        Self {
            event_id: event_id_str.clone(),
            error_type: error_type.to_string(),
            is_sorai_error: true,
            status_code: status_code.as_u16(),
            error: ErrorField {
                error_type: error_type.to_string(),
                code: code.to_string(),
                message: message.to_string(),
                param,
                event_id: event_id_str,
            },
        }
    }

    /// Create a bad request error (400)
    pub fn bad_request(message: &str, param: Option<serde_json::Value>) -> Self {
        Self::new(
            StatusCode::BAD_REQUEST,
            "invalid_request_error",
            "bad_request",
            message,
            param,
        )
    }

    /// Create an unauthorized error (401)
    pub fn unauthorized(message: &str) -> Self {
        Self::new(
            StatusCode::UNAUTHORIZED,
            "authentication_error",
            "unauthorized",
            message,
            None,
        )
    }

    /// Create a rate limit error (429)
    pub fn rate_limit_exceeded(message: &str) -> Self {
        Self::new(
            StatusCode::TOO_MANY_REQUESTS,
            "rate_limit_error",
            "rate_limit_exceeded",
            message,
            None,
        )
    }

    /// Create an internal server error (500)
    pub fn internal_server_error(message: &str) -> Self {
        Self::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "internal_error",
            "internal_server_error",
            message,
            None,
        )
    }

    /// Create a bad gateway error (502)
    pub fn bad_gateway(message: &str) -> Self {
        Self::new(StatusCode::BAD_GATEWAY, "provider_error", "bad_gateway", message, None)
    }

    /// Create a service unavailable error (503)
    pub fn service_unavailable(message: &str) -> Self {
        Self::new(
            StatusCode::SERVICE_UNAVAILABLE,
            "service_error",
            "service_unavailable",
            message,
            None,
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
    code: &str,
    message: &str,
    param: Option<serde_json::Value>,
) -> SoraiError {
    SoraiError::new(status_code, error_type, code, message, param)
}

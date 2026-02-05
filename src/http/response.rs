use axum::response::{IntoResponse, Response};
use axum::{Json, extract::FromRequestParts, http::StatusCode};
use serde::{Deserialize, Serialize};
use type_safe_id::{StaticType, TypeSafeId};

/// Request type for TypeID
#[derive(Default)]
pub struct HttpRequest;

impl StaticType for HttpRequest {
    const TYPE: &'static str = "";
}

/// Type alias for request IDs
pub type HttpRequestId = TypeSafeId<HttpRequest>;

/// Standard error codes
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ErrorCode {
    #[serde(rename = "MISSING_REQUIRED_PARAMETER")]
    MissingRequiredParameter,
    #[serde(rename = "INVALID_REQUEST")]
    InvalidRequest,
    #[serde(rename = "AUTHENTICATION_ERROR")]
    AuthenticationError,
    #[serde(rename = "AUTHORIZATION_ERROR")]
    AuthorizationError,
    #[serde(rename = "RATE_LIMIT_ERROR")]
    RateLimitError,
    #[serde(rename = "QUOTA_ERROR")]
    QuotaError,
    #[serde(rename = "API_ERROR")]
    ApiError,
    #[serde(rename = "PROVIDER_ERROR")]
    ProviderError,
    #[serde(rename = "SERVICE_ERROR")]
    ServiceError,
}

/// Error type classification
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ErrorTypeKind {
    Internal,
    External,
}

impl From<&str> for ErrorTypeKind {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "internal" => ErrorTypeKind::Internal,
            _ => ErrorTypeKind::External,
        }
    }
}

/// Error information in response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorType {
    pub code: ErrorCode,
    #[serde(rename = "type")]
    pub kind: ErrorTypeKind,
    pub reason: ErrorReason,
}

/// Error reason can be a string or array of strings
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ErrorReason {
    Single(String),
    Multiple(Vec<String>),
}

impl From<String> for ErrorReason {
    fn from(s: String) -> Self {
        ErrorReason::Single(s)
    }
}

impl From<Vec<String>> for ErrorReason {
    fn from(v: Vec<String>) -> Self {
        ErrorReason::Multiple(v)
    }
}

impl From<&str> for ErrorReason {
    fn from(s: &str) -> Self {
        ErrorReason::Single(s.to_string())
    }
}

/// Response metadata
#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseMetadata {
    pub request_id: String,
}

/// Standard API response wrapper
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub status: ResponseStatus,
    pub message: String,
    pub data: Option<T>,
    pub error: Option<ErrorType>,
    pub metadata: ResponseMetadata,
}

/// Response status
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ResponseStatus {
    Success,
    Error,
}

impl<T> ApiResponse<T>
where
    T: Serialize,
{
    /// Create a new success response
    pub fn success(data: T, request_id: String) -> Self {
        Self {
            status: ResponseStatus::Success,
            message: String::new(),
            data: Some(data),
            error: None,
            metadata: ResponseMetadata { request_id },
        }
    }

    /// Create a new success response with message
    pub fn success_with_message(data: T, message: String, request_id: String) -> Self {
        Self {
            status: ResponseStatus::Success,
            message,
            data: Some(data),
            error: None,
            metadata: ResponseMetadata { request_id },
        }
    }

    /// Create an error response
    pub fn error(error: ErrorType, request_id: String) -> Self {
        Self {
            status: ResponseStatus::Error,
            message: error.clone().reason.to_string(),
            data: None,
            error: Some(error),
            metadata: ResponseMetadata { request_id },
        }
    }
}

impl std::fmt::Display for ErrorReason {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ErrorReason::Single(s) => write!(f, "{}", s),
            ErrorReason::Multiple(v) => write!(f, "{}", v.join(", ")),
        }
    }
}

impl<T> IntoResponse for ApiResponse<T>
where
    T: Serialize,
{
    fn into_response(self) -> Response {
        let status_code = match &self.status {
            ResponseStatus::Success => StatusCode::OK,
            ResponseStatus::Error => StatusCode::INTERNAL_SERVER_ERROR,
        };
        (status_code, Json(self)).into_response()
    }
}

/// Request ID extractor
pub struct RequestId(pub String);

impl<S> FromRequestParts<S> for RequestId
where
    S: Send + Sync,
{
    type Rejection = std::convert::Infallible;

    async fn from_request_parts(parts: &mut axum::http::request::Parts, _state: &S) -> Result<Self, Self::Rejection> {
        const REQUEST_ID_HEADER_NAME: &str = "x-request-id";

        let request_id = parts
            .headers
            .get(REQUEST_ID_HEADER_NAME)
            .and_then(|h| h.to_str().ok())
            .map(|s| s.to_string())
            .unwrap_or_else(|| {
                let id = HttpRequestId::new();
                id.to_string()
            });

        Ok(RequestId(request_id))
    }
}

/// Extension key for storing RequestId in request state
pub struct RequestIdExtension(pub String);

/// Create success response (request ID auto-injected via RequestId param)
pub fn success<T>(data: T, request_id: String) -> ApiResponse<T>
where
    T: Serialize,
{
    ApiResponse::success(data, request_id)
}

/// Create success response with message (request ID auto-injected via RequestId param)
pub fn success_with_message<T>(data: T, message: String, request_id: String) -> ApiResponse<T>
where
    T: Serialize,
{
    ApiResponse::success_with_message(data, message, request_id)
}

/// Create error response (request ID auto-injected via RequestId param)
pub fn error(error: ErrorType, request_id: String) -> ApiResponse<()> {
    ApiResponse::error(error, request_id)
}

/// Create error type
pub fn create_error(code: ErrorCode, kind: ErrorTypeKind, reason: impl Into<ErrorReason>) -> ErrorType {
    ErrorType {
        code,
        kind,
        reason: reason.into(),
    }
}

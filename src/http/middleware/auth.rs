use axum::extract::FromRequestParts;
use axum::http::{request::Parts, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::RequestPartsExt;
use axum_extra::headers::{authorization::Bearer, Authorization};
use axum_extra::TypedHeader;

use crate::http::response::{create_error, ApiResponse, ErrorCode, ErrorTypeKind};

/// Valid API keys for authentication
/// TODO: Move this to configuration file or database
const VALID_API_KEYS: &[&str] = &["sk-1234", "sk-4321"];

/// API Key claims extracted from Bearer token
#[derive(Debug, Clone)]
pub struct ApiKey {
    pub key: String,
    pub is_valid: bool,
}

impl ApiKey {
    /// Create new API key instance
    pub fn new(key: String) -> Self {
        let is_valid = VALID_API_KEYS.contains(&key.as_str());
        Self { key, is_valid }
    }

    /// Check if API key is valid
    pub fn is_valid(&self) -> bool {
        self.is_valid
    }

    /// Get the API key value
    pub fn key(&self) -> &str {
        &self.key
    }

    // TODO: Add methods for:
    // - Rate limiting per API key
    // - Usage tracking and analytics
    // - API key permissions/scopes
    // - API key metadata (name, created_at, last_used, etc.)
}

/// Auth rejection type
pub struct AuthRejection {
    request_id: Option<String>,
    error: crate::http::response::ErrorType,
}

impl IntoResponse for AuthRejection {
    fn into_response(self) -> Response {
        let request_id = self.request_id.unwrap_or_else(|| {
            let id = crate::http::response::HttpRequestId::new();
            id.to_string()
        });
        (
            StatusCode::UNAUTHORIZED,
            ApiResponse::<()>::error(self.error, request_id),
        )
            .into_response()
    }
}

impl<S> FromRequestParts<S> for ApiKey
where
    S: Send + Sync,
{
    type Rejection = AuthRejection;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        const REQUEST_ID_HEADER_NAME: &str = "x-request-id";

        // Extract the token from the authorization header
        let TypedHeader(Authorization(bearer)) =
            parts
                .extract::<TypedHeader<Authorization<Bearer>>>()
                .await
                .map_err(|_| AuthRejection {
                    request_id: parts
                        .headers
                        .get(REQUEST_ID_HEADER_NAME)
                        .and_then(|h| h.to_str().ok())
                        .map(|s| s.to_string()),
                    error: create_error(
                        ErrorCode::AuthenticationError,
                        ErrorTypeKind::Internal,
                        "Missing or invalid Authorization header. Please provide a valid Bearer token.",
                    ),
                })?;

        let api_key = ApiKey::new(bearer.token().to_string());

        if !api_key.is_valid() {
            return Err(AuthRejection {
                request_id: parts
                    .headers
                    .get(REQUEST_ID_HEADER_NAME)
                    .and_then(|h| h.to_str().ok())
                    .map(|s| s.to_string()),
                error: create_error(
                    ErrorCode::AuthenticationError,
                    ErrorTypeKind::Internal,
                    "Invalid API key. Please check your Bearer token.",
                ),
            });
        }

        Ok(api_key)
    }
}

// TODO: Implement additional auth features:
// - API key management endpoints (CRUD operations)
// - API key rotation and expiration
// - Different permission levels for API keys
// - Integration with external auth providers
// - Audit logging for authentication events
// - Rate limiting based on API key
// - API key usage analytics and reporting

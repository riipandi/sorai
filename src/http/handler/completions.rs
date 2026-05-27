#![allow(unused_variables, dead_code)]

use crate::http::middleware::ApiKey;
use axum::{extract::Json, response::IntoResponse};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use type_safe_id::{StaticType, TypeSafeId};

use crate::http::response::{ApiResponse, ErrorCode, ErrorTypeKind, RequestId, create_error};

/// Chat completion type for TypeID
#[derive(Default)]
struct ChatCompletion;

impl StaticType for ChatCompletion {
    const TYPE: &'static str = "chatcmpl";
}

/// Text completion type for TypeID
#[derive(Default)]
struct TextCompletion;

impl StaticType for TextCompletion {
    const TYPE: &'static str = "cmpl";
}

/// Type aliases for completion IDs
type ChatCompletionId = TypeSafeId<ChatCompletion>;
type TextCompletionId = TypeSafeId<TextCompletion>;

/// Chat completion request payload
#[derive(Debug, Deserialize)]
pub struct ChatCompletionReq {
    #[serde(default)]
    pub provider: Option<String>,
    #[serde(default)]
    pub model: Option<String>,
    #[serde(default)]
    pub messages: Vec<Value>,
    #[serde(default)]
    pub params: Option<Value>,
    #[serde(default)]
    pub fallbacks: Option<Vec<Value>>,
}

/// Text completion request payload
#[derive(Debug, Deserialize)]
pub struct TextCompletionReq {
    #[serde(default)]
    pub provider: Option<String>,
    #[serde(default)]
    pub model: Option<String>,
    #[serde(default)]
    pub text: Option<String>,
    #[serde(default)]
    pub params: Option<Value>,
    #[serde(default)]
    pub fallbacks: Option<Vec<Value>>,
}

/// Chat completion response following OpenAI format
#[derive(Debug, Serialize)]
pub struct ChatCompletionResponse {
    pub id: String,
    pub object: String,
    pub choices: Vec<ChatCompletionChoice>,
    pub model: String,
    pub created: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub usage: Option<UsageInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra_fields: Option<ExtraFields>,
}

/// Text completion response following OpenAI format
#[derive(Debug, Serialize)]
pub struct TextCompletionResponse {
    pub id: String,
    pub object: String,
    pub choices: Vec<TextCompletionChoice>,
    pub model: String,
    pub created: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub usage: Option<UsageInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra_fields: Option<ExtraFields>,
}

/// Chat completion choice
#[derive(Debug, Serialize)]
pub struct ChatCompletionChoice {
    pub index: i32,
    pub message: ChatMessage,
    pub finish_reason: String,
}

/// Text completion choice
#[derive(Debug, Serialize)]
pub struct TextCompletionChoice {
    pub index: i32,
    pub text: String,
    pub finish_reason: String,
}

/// Chat message structure
#[derive(Debug, Serialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

/// Usage information
#[derive(Debug, Serialize)]
pub struct UsageInfo {
    pub prompt_tokens: i32,
    pub completion_tokens: i32,
    pub total_tokens: i32,
}

/// Extra fields for Sorai-specific information
#[derive(Debug, Serialize)]
pub struct ExtraFields {
    pub provider: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_params: Option<Value>,
    pub latency: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub raw_response: Option<Value>,
}

/// Chat completions endpoint handler
/// POST /v1/chat/completions
/// Requires Bearer token authentication
pub async fn chat_completions(
    api_key: ApiKey,
    RequestId(request_id): RequestId,
    Json(request): Json<ChatCompletionReq>,
) -> impl IntoResponse {
    tracing::debug!("Chat completion request from API key: {}", api_key.key());

    let provider = match &request.provider {
        None => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Provider is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(provider) if provider.is_empty() => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Provider is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(provider) => provider,
    };

    let model = match &request.model {
        None => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Model is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(model) if model.is_empty() => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Model is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(model) => model,
    };

    if request.messages.is_empty() {
        return ApiResponse::<()>::error(
            create_error(
                ErrorCode::MissingRequiredParameter,
                ErrorTypeKind::Internal,
                "Messages array cannot be empty",
            ),
            request_id.clone(),
        )
        .into_response();
    }

    let completion_id = ChatCompletionId::new();
    let response = ChatCompletionResponse {
        id: completion_id.to_string(),
        object: "chat.completion".to_string(),
        choices: vec![ChatCompletionChoice {
            index: 0,
            message: ChatMessage {
                role: "assistant".to_string(),
                content: "Hello! I'm doing well, thank you for asking. How can I help you today?".to_string(),
            },
            finish_reason: "stop".to_string(),
        }],
        model: model.clone(),
        created: chrono::Utc::now().timestamp(),
        usage: Some(UsageInfo {
            prompt_tokens: 12,
            completion_tokens: 19,
            total_tokens: 31,
        }),
        extra_fields: Some(ExtraFields {
            provider: provider.clone(),
            model_params: Some(serde_json::json!({})),
            latency: 1.234,
            raw_response: Some(serde_json::json!({})),
        }),
    };

    ApiResponse::success(response, request_id).into_response()
}

/// Text completions endpoint handler
/// POST /v1/text/completions
/// Requires Bearer token authentication
pub async fn text_completions(
    api_key: ApiKey,
    RequestId(request_id): RequestId,
    Json(request): Json<TextCompletionReq>,
) -> impl IntoResponse {
    tracing::debug!("Text completion request from API key: {}", api_key.key());

    let provider = match &request.provider {
        None => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Provider is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(provider) if provider.is_empty() => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Provider is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(provider) => provider,
    };

    let model = match &request.model {
        None => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Model is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(model) if model.is_empty() => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Model is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(model) => model,
    };

    let text = match &request.text {
        None => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Text prompt is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(text) if text.is_empty() => {
            return ApiResponse::<()>::error(
                create_error(
                    ErrorCode::MissingRequiredParameter,
                    ErrorTypeKind::Internal,
                    "Text prompt is required",
                ),
                request_id.clone(),
            )
            .into_response();
        }
        Some(text) => text,
    };

    let completion_id = TextCompletionId::new();
    let response = TextCompletionResponse {
        id: completion_id.to_string(),
        object: "text.completion".to_string(),
        choices: vec![TextCompletionChoice {
            index: 0,
            text: format!("This is a placeholder completion for: {}", text),
            finish_reason: "stop".to_string(),
        }],
        model: model.clone(),
        created: chrono::Utc::now().timestamp(),
        usage: Some(UsageInfo {
            prompt_tokens: 5,
            completion_tokens: 12,
            total_tokens: 17,
        }),
        extra_fields: Some(ExtraFields {
            provider: provider.clone(),
            model_params: Some(serde_json::json!({})),
            latency: 0.3,
            raw_response: Some(serde_json::json!({})),
        }),
    };

    ApiResponse::success(response, request_id).into_response()
}

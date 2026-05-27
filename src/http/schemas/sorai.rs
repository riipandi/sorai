use serde::{Deserialize, Serialize};

// ModelChatMessageRole represents the role of a chat message

// SoraiMessage represents a message in a chat conversation.

// SoraiResponseChoice represents a choice in the completion result
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct SoraiResponseChoice {
    pub index: i64,
    pub message: String,
}

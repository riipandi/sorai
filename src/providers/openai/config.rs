use crate::config::{ConfigItem, redact_sensitive};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OpenAIConfig {
    #[serde(default)]
    pub api_key: String,
    #[serde(default)]
    pub base_url: String,
}

impl OpenAIConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "OpenAI".to_string(),
            key: "API Key".to_string(),
            value: redact_sensitive(&self.api_key),
        });
        items.push(ConfigItem {
            section: "OpenAI".to_string(),
            key: "Base URL".to_string(),
            value: if self.base_url.is_empty() {
                "<default>".to_string()
            } else {
                self.base_url.clone()
            },
        });
    }
}

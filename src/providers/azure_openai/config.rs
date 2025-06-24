use crate::config::{ConfigItem, redact_sensitive};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AzureOpenAIConfig {
    #[serde(default)]
    pub api_key: String,
    #[serde(default)]
    pub endpoint: String,
}

impl AzureOpenAIConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Azure OpenAI".to_string(),
            key: "API Key".to_string(),
            value: redact_sensitive(&self.api_key),
        });
        items.push(ConfigItem {
            section: "Azure OpenAI".to_string(),
            key: "Endpoint".to_string(),
            value: if self.endpoint.is_empty() {
                "<not set>".to_string()
            } else {
                self.endpoint.clone()
            },
        });
    }
}

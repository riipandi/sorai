use crate::config::{ConfigItem, redact_sensitive};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BedrockConfig {
    #[serde(default)]
    pub api_key: String,
    #[serde(default)]
    pub access_key: String,
}

impl BedrockConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "AWS Bedrock".to_string(),
            key: "API Key".to_string(),
            value: redact_sensitive(&self.api_key),
        });
        items.push(ConfigItem {
            section: "AWS Bedrock".to_string(),
            key: "Access Key".to_string(),
            value: redact_sensitive(&self.access_key),
        });
    }
}

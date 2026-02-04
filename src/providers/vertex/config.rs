use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct VertexConfig {
    #[serde(default)]
    pub project_id: String,
    #[serde(default)]
    pub credentials: String,
    #[serde(default)]
    pub base_url: String,
}

impl VertexConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Google Vertex AI".to_string(),
            key: "Project ID".to_string(),
            value: if self.project_id.is_empty() {
                "<not set>".to_string()
            } else {
                self.project_id.clone()
            },
        });
        items.push(ConfigItem {
            section: "Google Vertex AI".to_string(),
            key: "Credentials Path".to_string(),
            value: if self.credentials.is_empty() {
                "<not set>".to_string()
            } else {
                self.credentials.clone()
            },
        });
        items.push(ConfigItem {
            section: "Google Vertex AI".to_string(),
            key: "Base URL".to_string(),
            value: if self.base_url.is_empty() {
                "<default>".to_string()
            } else {
                self.base_url.clone()
            },
        });
    }
}

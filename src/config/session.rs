use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SessionConfig {
    #[serde(default)]
    pub storage: String,
}

impl SessionConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Session".to_string(),
            key: "Storage".to_string(),
            value: self.storage.clone(),
        });
    }
}

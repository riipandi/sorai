use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DatabaseConfig {
    #[serde(default)]
    pub url: String,
    #[serde(default)]
    pub token: String,
    #[serde(default = "default_auto_migrate")]
    pub auto_migrate: bool,
}

impl DatabaseConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Database".to_string(),
            key: "URL".to_string(),
            value: if self.url.is_empty() {
                "<not set>".to_string()
            } else {
                self.url.clone()
            },
        });
        items.push(ConfigItem {
            section: "Database".to_string(),
            key: "Token".to_string(),
            value: if self.token.is_empty() {
                "<not set>".to_string()
            } else {
                "***".to_string()
            },
        });
        items.push(ConfigItem {
            section: "Database".to_string(),
            key: "Auto Migrate".to_string(),
            value: self.auto_migrate.to_string(),
        });
    }
}

fn default_auto_migrate() -> bool {
    false
}

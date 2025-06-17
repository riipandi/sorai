use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    #[serde(default = "default_show_timestamp")]
    pub show_timestamp: bool,
    #[serde(default = "default_log_level")]
    pub level: String,
    #[serde(default = "default_log_directory")]
    pub log_directory: String,
    #[serde(default = "default_log_rotation")]
    pub rotation: String,
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            show_timestamp: default_show_timestamp(),
            level: default_log_level(),
            log_directory: default_log_directory(),
            rotation: default_log_rotation(),
        }
    }
}

impl LoggingConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Show Timestamp".to_string(),
            value: self.show_timestamp.to_string(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Level".to_string(),
            value: self.level.clone(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Log Directory".to_string(),
            value: self.log_directory.clone(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Rotation".to_string(),
            value: self.rotation.clone(),
        });
    }
}

fn default_show_timestamp() -> bool {
    true
}

fn default_log_level() -> String {
    "info".to_string()
}

fn default_log_directory() -> String {
    "./logs".to_string()
}

fn default_log_rotation() -> String {
    "daily".to_string()
}

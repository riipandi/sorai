use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    #[serde(default = "default_show_timestamp")]
    pub show_timestamp: bool,
    #[serde(default = "default_log_level")]
    pub level: String,
    #[serde(default = "default_log_rotation")]
    pub rotation: String,
    #[serde(default = "default_show_module")]
    pub show_module: bool,
    #[serde(default = "default_request_sampling")]
    pub request_sampling: u32,
    #[serde(default = "default_log_slow_requests_only")]
    pub log_slow_requests_only: bool,
    #[serde(default = "default_slow_threshold_ms")]
    pub slow_threshold_ms: u64,
    #[serde(default = "default_analytics_mode")]
    pub analytics_mode: String,
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            show_timestamp: default_show_timestamp(),
            level: default_log_level(),
            rotation: default_log_rotation(),
            show_module: default_show_module(),
            request_sampling: default_request_sampling(),
            log_slow_requests_only: default_log_slow_requests_only(),
            slow_threshold_ms: default_slow_threshold_ms(),
            analytics_mode: default_analytics_mode(),
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
            key: "Rotation".to_string(),
            value: self.rotation.clone(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Show Module".to_string(),
            value: self.show_module.to_string(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Request Sampling".to_string(),
            value: format!("{}%", self.request_sampling),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Log Slow Only".to_string(),
            value: self.log_slow_requests_only.to_string(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Slow Threshold (ms)".to_string(),
            value: self.slow_threshold_ms.to_string(),
        });
        items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Analytics Mode".to_string(),
            value: self.analytics_mode.clone(),
        });
    }
}

fn default_show_timestamp() -> bool {
    true
}

fn default_log_level() -> String {
    "info".to_string()
}

fn default_log_rotation() -> String {
    "daily".to_string()
}

fn default_show_module() -> bool {
    true
}

fn default_request_sampling() -> u32 {
    100
}

fn default_log_slow_requests_only() -> bool {
    false
}

fn default_slow_threshold_ms() -> u64 {
    1000
}

fn default_analytics_mode() -> String {
    "full".to_string()
}

use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(default = "default_mode")]
    pub mode: String,
    #[serde(default)]
    pub secret_key: String,
    #[serde(default)]
    pub jwt_secret_key: String,
    #[serde(default = "default_jwt_access_token_expiry")]
    pub jwt_access_token_expiry: u64,
    #[serde(default = "default_jwt_refresh_token_expiry")]
    pub jwt_refresh_token_expiry: u64,
    #[serde(default = "default_data_dir")]
    pub data_dir: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            mode: default_mode(),
            secret_key: String::new(),
            jwt_secret_key: String::new(),
            jwt_access_token_expiry: default_jwt_access_token_expiry(),
            jwt_refresh_token_expiry: default_jwt_refresh_token_expiry(),
            data_dir: default_data_dir(),
        }
    }
}

impl AppConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "App".to_string(),
            key: "Mode".to_string(),
            value: self.mode.clone(),
        });
        items.push(ConfigItem {
            section: "App".to_string(),
            key: "Data Directory".to_string(),
            value: if self.data_dir.is_empty() {
                "<not set>".to_string()
            } else {
                self.data_dir.clone()
            },
        });
        items.push(ConfigItem {
            section: "App".to_string(),
            key: "Secret Key".to_string(),
            value: redact_sensitive(&self.secret_key),
        });
        items.push(ConfigItem {
            section: "JWT".to_string(),
            key: "Secret Key".to_string(),
            value: redact_sensitive(&self.jwt_secret_key),
        });
        items.push(ConfigItem {
            section: "JWT".to_string(),
            key: "Access Token Expiry".to_string(),
            value: format!("{}s", self.jwt_access_token_expiry),
        });
        items.push(ConfigItem {
            section: "JWT".to_string(),
            key: "Refresh Token Expiry".to_string(),
            value: format!("{}s", self.jwt_refresh_token_expiry),
        });
    }
}

fn redact_sensitive(value: &str) -> String {
    if value.is_empty() {
        return "<not set>".to_string();
    }
    if value.len() <= 8 {
        return "*".repeat(value.len());
    }
    format!("{}...{}", &value[..4], &value[value.len() - 4..])
}

fn default_mode() -> String {
    "development".to_string()
}

fn default_jwt_access_token_expiry() -> u64 {
    900
}

fn default_jwt_refresh_token_expiry() -> u64 {
    7200
}

fn default_data_dir() -> String {
    "./data".to_string()
}

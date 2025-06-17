use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CorsConfig {
    #[serde(default = "default_cors_enabled")]
    pub enabled: bool,
    #[serde(default = "default_cors_allow_origins")]
    pub allow_origins: Vec<String>,
    #[serde(default = "default_cors_allow_methods")]
    pub allow_methods: Vec<String>,
    #[serde(default = "default_cors_allow_headers")]
    pub allow_headers: Vec<String>,
    #[serde(default = "default_cors_expose_headers")]
    pub expose_headers: Vec<String>,
    #[serde(default = "default_cors_allow_credentials")]
    pub allow_credentials: bool,
    #[serde(default = "default_cors_max_age")]
    pub max_age: u64,
}

impl Default for CorsConfig {
    fn default() -> Self {
        Self {
            enabled: default_cors_enabled(),
            allow_origins: default_cors_allow_origins(),
            allow_methods: default_cors_allow_methods(),
            allow_headers: default_cors_allow_headers(),
            expose_headers: default_cors_expose_headers(),
            allow_credentials: default_cors_allow_credentials(),
            max_age: default_cors_max_age(),
        }
    }
}

impl CorsConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Enabled".to_string(),
            value: self.enabled.to_string(),
        });
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Allow Origins".to_string(),
            value: self.allow_origins.join(", "),
        });
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Allow Methods".to_string(),
            value: self.allow_methods.join(", "),
        });
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Allow Headers".to_string(),
            value: self.allow_headers.join(", "),
        });
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Allow Credentials".to_string(),
            value: self.allow_credentials.to_string(),
        });
        items.push(ConfigItem {
            section: "CORS".to_string(),
            key: "Max Age".to_string(),
            value: format!("{}s", self.max_age),
        });
    }
}

fn default_cors_enabled() -> bool {
    true
}

fn default_cors_allow_origins() -> Vec<String> {
    vec!["*".to_string()]
}

fn default_cors_allow_methods() -> Vec<String> {
    vec![
        "GET".to_string(),
        "POST".to_string(),
        "PUT".to_string(),
        "DELETE".to_string(),
        "HEAD".to_string(),
        "OPTIONS".to_string(),
        "PATCH".to_string(),
    ]
}

fn default_cors_allow_headers() -> Vec<String> {
    vec![
        "accept".to_string(),
        "accept-language".to_string(),
        "authorization".to_string(),
        "content-type".to_string(),
        "user-agent".to_string(),
        "x-requested-id".to_string(),
    ]
}

fn default_cors_expose_headers() -> Vec<String> {
    vec![]
}

fn default_cors_allow_credentials() -> bool {
    false
}

fn default_cors_max_age() -> u64 {
    3600 // 1 hour in seconds
}

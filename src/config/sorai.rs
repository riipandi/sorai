use crate::config::ConfigItem;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoraiConfig {
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_pool_size")]
    pub pool_size: u32,
    #[serde(default = "default_timeout_request")]
    pub timeout_request: u64,
}

impl Default for SoraiConfig {
    fn default() -> Self {
        Self {
            host: default_host(),
            port: default_port(),
            pool_size: default_pool_size(),
            timeout_request: default_timeout_request(),
        }
    }
}

impl SoraiConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Sorai".to_string(),
            key: "Host".to_string(),
            value: self.host.clone(),
        });
        items.push(ConfigItem {
            section: "Sorai".to_string(),
            key: "Port".to_string(),
            value: self.port.to_string(),
        });
        items.push(ConfigItem {
            section: "Sorai".to_string(),
            key: "Pool Size".to_string(),
            value: self.pool_size.to_string(),
        });
        items.push(ConfigItem {
            section: "Sorai".to_string(),
            key: "Timeout Request".to_string(),
            value: format!("{}s", self.timeout_request),
        });
    }
}

fn default_host() -> String {
    "0.0.0.0".to_string()
}

fn default_port() -> u16 {
    8000
}

fn default_pool_size() -> u32 {
    300
}

fn default_timeout_request() -> u64 {
    30
}

use crate::config::{redact_sensitive, ConfigItem};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageConfig {
    #[serde(default)]
    pub s3_access_key_id: String,
    #[serde(default)]
    pub s3_secret_access_key: String,
    #[serde(default)]
    pub s3_bucket_default: String,
    #[serde(default = "default_s3_force_path_style")]
    pub s3_force_path_style: bool,
    #[serde(default)]
    pub s3_path_prefix: Option<String>,
    #[serde(default)]
    pub s3_endpoint_url: String,
    #[serde(default)]
    pub s3_public_url: String,
    #[serde(default)]
    pub s3_region: String,
    #[serde(default = "default_s3_signed_url_expires")]
    pub s3_signed_url_expires: u64,
    #[serde(default = "default_max_upload_size")]
    pub max_upload_size: u64,
}

impl Default for StorageConfig {
    fn default() -> Self {
        Self {
            s3_access_key_id: default_s3_access_key_id(),
            s3_secret_access_key: default_s3_secret_access_key(),
            s3_bucket_default: default_s3_bucket_default(),
            s3_force_path_style: default_s3_force_path_style(),
            s3_path_prefix: default_s3_path_prefix(),
            s3_endpoint_url: default_s3_endpoint_url(),
            s3_public_url: default_s3_public_url(),
            s3_region: default_s3_region(),
            s3_signed_url_expires: default_s3_signed_url_expires(),
            max_upload_size: default_max_upload_size(),
        }
    }
}

impl StorageConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Access Key ID".to_string(),
            value: redact_sensitive(&self.s3_access_key_id),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Secret Access Key".to_string(),
            value: redact_sensitive(&self.s3_secret_access_key),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Bucket Default".to_string(),
            value: self.s3_bucket_default.clone(),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Force Path Style".to_string(),
            value: self.s3_force_path_style.to_string(),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Path Prefix".to_string(),
            value: self.s3_path_prefix.clone().unwrap_or_else(|| "<not set>".to_string()),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Endpoint URL".to_string(),
            value: self.s3_endpoint_url.clone(),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Public URL".to_string(),
            value: self.s3_public_url.clone(),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Region".to_string(),
            value: self.s3_region.clone(),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "S3 Signed URL Expires".to_string(),
            value: format!("{}s", self.s3_signed_url_expires),
        });
        items.push(ConfigItem {
            section: "Storage".to_string(),
            key: "Max Upload Size".to_string(),
            value: format!("{} bytes", self.max_upload_size),
        });
    }
}

fn default_s3_access_key_id() -> String {
    String::new()
}

fn default_s3_secret_access_key() -> String {
    String::new()
}

fn default_s3_bucket_default() -> String {
    String::new()
}

fn default_s3_force_path_style() -> bool {
    true
}

fn default_s3_path_prefix() -> Option<String> {
    None
}

fn default_s3_endpoint_url() -> String {
    String::new()
}

fn default_s3_public_url() -> String {
    String::new()
}

fn default_s3_region() -> String {
    "auto".to_string()
}

fn default_s3_signed_url_expires() -> u64 {
    3600
}

fn default_max_upload_size() -> u64 {
    5242880
}

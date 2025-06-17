use serde::{Deserialize, Serialize};
use std::path::Path;
use tabled::{Table, Tabled, settings::Style};
use tokio::fs;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub swift_relay: SwiftRelayConfig,
    #[serde(default)]
    pub logging: LoggingConfig,
    #[serde(default)]
    pub openai: OpenAIConfig,
    #[serde(default)]
    pub anthropic: AnthropicConfig,
    #[serde(default)]
    pub bedrock: BedrockConfig,
    #[serde(default)]
    pub cohere: CohereConfig,
    #[serde(default)]
    pub azure_openai: AzureOpenAIConfig,
    #[serde(default)]
    pub vertext: VertextConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwiftRelayConfig {
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_pool_size")]
    pub pool_size: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    #[serde(default = "default_show_timestamp")]
    pub show_timestamp: bool,
    #[serde(default = "default_log_level")]
    pub level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OpenAIConfig {
    #[serde(default)]
    pub api_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AnthropicConfig {
    #[serde(default)]
    pub api_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BedrockConfig {
    #[serde(default)]
    pub api_key: String,
    #[serde(default)]
    pub access_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CohereConfig {
    #[serde(default)]
    pub api_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AzureOpenAIConfig {
    #[serde(default)]
    pub api_key: String,
    #[serde(default)]
    pub endpoint: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct VertextConfig {
    #[serde(default)]
    pub project_id: String,
    #[serde(default)]
    pub credentials: String,
}

/// Configuration item for debug table display
#[derive(Tabled)]
pub struct ConfigItem {
    #[tabled(rename = "Section")]
    pub section: String,
    #[tabled(rename = "Key")]
    pub key: String,
    #[tabled(rename = "Value")]
    pub value: String,
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

fn default_show_timestamp() -> bool {
    true
}

fn default_log_level() -> String {
    "info".to_string()
}

impl Default for SwiftRelayConfig {
    fn default() -> Self {
        Self {
            host: default_host(),
            port: default_port(),
            pool_size: default_pool_size(),
        }
    }
}

impl Default for LoggingConfig {
    fn default() -> Self {
        Self {
            show_timestamp: default_show_timestamp(),
            level: default_log_level(),
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            swift_relay: SwiftRelayConfig::default(),
            logging: LoggingConfig::default(),
            openai: OpenAIConfig::default(),
            anthropic: AnthropicConfig::default(),
            bedrock: BedrockConfig::default(),
            cohere: CohereConfig::default(),
            azure_openai: AzureOpenAIConfig::default(),
            vertext: VertextConfig::default(),
        }
    }
}

impl Config {
    /// Load configuration from TOML file
    pub async fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path).await?;
        let config: Config = toml::from_str(&content)?;
        Ok(config)
    }

    /// Get default config file path (current working directory)
    pub fn default_config_path() -> Result<std::path::PathBuf, Box<dyn std::error::Error>> {
        let current_dir = std::env::current_dir()?;
        Ok(current_dir.join("config.toml"))
    }

    /// Load configuration with fallback to default path and default values
    pub async fn load(custom_path: Option<String>) -> Result<Self, Box<dyn std::error::Error>> {
        let config_path = match custom_path {
            Some(path) => std::path::PathBuf::from(path),
            None => Self::default_config_path()?,
        };

        // Check if config file exists
        if !config_path.exists() {
            println!("Config file not found at: {}", config_path.display());
            println!("Using default configuration (host: 0.0.0.0, port: 8000)");
            return Ok(Config::default());
        }

        println!("Loading config from: {}", config_path.display());
        Self::load_from_file(config_path).await
    }

    /// Redact sensitive values for debug display
    /// Shows first 4 and last 4 characters with "..." in between
    fn redact_sensitive(value: &str) -> String {
        if value.is_empty() {
            return "<not set>".to_string();
        }

        if value.len() <= 8 {
            return "*".repeat(value.len());
        }

        let start = &value[..4];
        let end = &value[value.len() - 4..];
        format!("{}...{}", start, end)
    }

    /// Display configuration in table format with redacted sensitive values
    pub fn display_debug_table(&self) {
        let mut config_items = Vec::new();

        // SwiftRelay Configuration
        config_items.push(ConfigItem {
            section: "SwiftRelay".to_string(),
            key: "Host".to_string(),
            value: self.swift_relay.host.clone(),
        });
        config_items.push(ConfigItem {
            section: "SwiftRelay".to_string(),
            key: "Port".to_string(),
            value: self.swift_relay.port.to_string(),
        });
        config_items.push(ConfigItem {
            section: "SwiftRelay".to_string(),
            key: "Pool Size".to_string(),
            value: self.swift_relay.pool_size.to_string(),
        });

        // Logging Configuration
        config_items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Show Timestamp".to_string(),
            value: self.logging.show_timestamp.to_string(),
        });
        config_items.push(ConfigItem {
            section: "Logging".to_string(),
            key: "Level".to_string(),
            value: self.logging.level.clone(),
        });

        // OpenAI Configuration
        config_items.push(ConfigItem {
            section: "OpenAI".to_string(),
            key: "API Key".to_string(),
            value: Self::redact_sensitive(&self.openai.api_key),
        });

        // Anthropic Configuration
        config_items.push(ConfigItem {
            section: "Anthropic".to_string(),
            key: "API Key".to_string(),
            value: Self::redact_sensitive(&self.anthropic.api_key),
        });

        // Bedrock Configuration
        config_items.push(ConfigItem {
            section: "AWS Bedrock".to_string(),
            key: "API Key".to_string(),
            value: Self::redact_sensitive(&self.bedrock.api_key),
        });
        config_items.push(ConfigItem {
            section: "AWS Bedrock".to_string(),
            key: "Access Key".to_string(),
            value: Self::redact_sensitive(&self.bedrock.access_key),
        });

        // Cohere Configuration
        config_items.push(ConfigItem {
            section: "Cohere".to_string(),
            key: "API Key".to_string(),
            value: Self::redact_sensitive(&self.cohere.api_key),
        });

        // Azure OpenAI Configuration
        config_items.push(ConfigItem {
            section: "Azure OpenAI".to_string(),
            key: "API Key".to_string(),
            value: Self::redact_sensitive(&self.azure_openai.api_key),
        });
        config_items.push(ConfigItem {
            section: "Azure OpenAI".to_string(),
            key: "Endpoint".to_string(),
            value: if self.azure_openai.endpoint.is_empty() {
                "<not set>".to_string()
            } else {
                self.azure_openai.endpoint.clone()
            },
        });

        // Vertex AI Configuration
        config_items.push(ConfigItem {
            section: "Google Vertex AI".to_string(),
            key: "Project ID".to_string(),
            value: if self.vertext.project_id.is_empty() {
                "<not set>".to_string()
            } else {
                self.vertext.project_id.clone()
            },
        });
        config_items.push(ConfigItem {
            section: "Google Vertex AI".to_string(),
            key: "Credentials Path".to_string(),
            value: if self.vertext.credentials.is_empty() {
                "<not set>".to_string()
            } else {
                self.vertext.credentials.clone()
            },
        });

        let table = Table::new(config_items).with(Style::sharp()).to_string();
        println!("{}", table);
    }
}

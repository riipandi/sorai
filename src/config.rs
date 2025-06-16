use serde::{Deserialize, Serialize};
use std::path::Path;
use tokio::fs;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub swift_relay: SwiftRelayConfig,
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

fn default_host() -> String {
    "0.0.0.0".to_string()
}

fn default_port() -> u16 {
    8000
}

impl Default for SwiftRelayConfig {
    fn default() -> Self {
        Self {
            host: default_host(),
            port: default_port(),
        }
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            swift_relay: SwiftRelayConfig::default(),
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
}

use serde::{Deserialize, Serialize};
use std::path::Path;
use tabled::{Table, Tabled, settings::Style};
use tokio::fs;

use crate::providers::anthropic::AnthropicConfig;
use crate::providers::azure_openai::AzureOpenAIConfig;
use crate::providers::bedrock::BedrockConfig;
use crate::providers::cohere::CohereConfig;
use crate::providers::openai::OpenAIConfig;
use crate::providers::vertex::VertexConfig;

use super::cors::CorsConfig;
use super::logging::LoggingConfig;
use super::sorai::SoraiConfig;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Config {
    #[serde(default)]
    pub sorai: SoraiConfig,
    #[serde(default)]
    pub logging: LoggingConfig,
    #[serde(default)]
    pub cors: CorsConfig,
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
    pub vertex: VertexConfig,
}

#[derive(Tabled)]
pub struct ConfigItem {
    #[tabled(rename = "Section")]
    pub section: String,
    #[tabled(rename = "Key")]
    pub key: String,
    #[tabled(rename = "Value")]
    pub value: String,
}

impl Config {
    pub async fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path).await?;
        Ok(toml::from_str(&content)?)
    }

    pub fn default_config_path() -> Result<std::path::PathBuf, Box<dyn std::error::Error>> {
        Ok(std::env::current_dir()?.join("config.toml"))
    }

    pub async fn load(custom_path: Option<String>) -> Result<Self, Box<dyn std::error::Error>> {
        let config_path = match custom_path {
            Some(path) => std::path::PathBuf::from(path),
            None => Self::default_config_path()?,
        };

        if !config_path.exists() {
            println!("Config file not found at: {}", config_path.display());
            println!("Using default configuration (host: 0.0.0.0, port: 8000)");
            return Ok(Config::default());
        }

        println!("Loading config from: {}", config_path.display());
        Self::load_from_file(config_path).await
    }

    pub fn display_debug_table(&self) {
        let mut items = Vec::new();

        self.sorai.add_to_debug(&mut items);
        self.logging.add_to_debug(&mut items);
        self.cors.add_to_debug(&mut items);
        self.openai.add_to_debug(&mut items);
        self.anthropic.add_to_debug(&mut items);
        self.bedrock.add_to_debug(&mut items);
        self.cohere.add_to_debug(&mut items);
        self.azure_openai.add_to_debug(&mut items);
        self.vertex.add_to_debug(&mut items);

        let table = Table::new(items).with(Style::sharp()).to_string();
        println!("{}", table);
    }
}

pub fn redact_sensitive(value: &str) -> String {
    if value.is_empty() {
        return "<not set>".to_string();
    }
    if value.len() <= 8 {
        return "*".repeat(value.len());
    }
    format!("{}...{}", &value[..4], &value[value.len() - 4..])
}

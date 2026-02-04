use serde::{Deserialize, Serialize};
use tabled::{Table, Tabled, settings::Style};

use crate::providers::anthropic::AnthropicConfig;
use crate::providers::azure_openai::AzureOpenAIConfig;
use crate::providers::bedrock::BedrockConfig;
use crate::providers::cohere::CohereConfig;
use crate::providers::openai::OpenAIConfig;
use crate::providers::vertex::VertexConfig;

use super::app::AppConfig;
use super::cors::CorsConfig;
use super::database::DatabaseConfig;
use super::logging::LoggingConfig;
use super::mailer::MailerConfig;
use super::session::SessionConfig;
use super::sorai::SoraiConfig;
use super::storage::StorageConfig;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Config {
    #[serde(default)]
    pub sorai: SoraiConfig,
    #[serde(default)]
    pub app: AppConfig,
    #[serde(default)]
    pub logging: LoggingConfig,
    #[serde(default)]
    pub cors: CorsConfig,
    #[serde(default)]
    pub mailer: MailerConfig,
    #[serde(default)]
    pub database: DatabaseConfig,
    #[serde(default)]
    pub session: SessionConfig,
    #[serde(default)]
    pub storage: StorageConfig,
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
    pub fn load(env_file: Option<String>) -> Result<Self, Box<dyn std::error::Error>> {
        if let Some(path) = env_file {
            println!("Loading env file from: {}", path);
            dotenvy::from_path(path)?;
        } else {
            dotenvy::dotenv().ok();
        }

        let mut config = Config::default();

        config.sorai.host = std::env::var("HOST").unwrap_or_else(|_| config.sorai.host.clone());
        config.sorai.port = std::env::var("PORT")
            .ok()
            .and_then(|p| p.parse::<u16>().ok())
            .unwrap_or(config.sorai.port);

        if let Ok(val) = std::env::var("PROVIDER_OPENAI_API_KEY") {
            config.openai.api_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_OPENAI_BASE_URL") {
            config.openai.base_url = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_ANTHROPIC_API_KEY") {
            config.anthropic.api_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_ANTHROPIC_BASE_URL") {
            config.anthropic.base_url = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_BEDROCK_API_KEY") {
            config.bedrock.api_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_BEDROCK_ACCESS_KEY") {
            config.bedrock.access_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_BEDROCK_BASE_URL") {
            config.bedrock.base_url = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_COHERE_API_KEY") {
            config.cohere.api_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_COHERE_BASE_URL") {
            config.cohere.base_url = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_AZURE_OPENAI_API_KEY") {
            config.azure_openai.api_key = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_AZURE_OPENAI_ENDPOINT") {
            config.azure_openai.endpoint = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_VERTEX_PROJECT_ID") {
            config.vertex.project_id = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_VERTEX_CREDENTIALS") {
            config.vertex.credentials = val;
        }
        if let Ok(val) = std::env::var("PROVIDER_VERTEX_BASE_URL") {
            config.vertex.base_url = val;
        }

        if let Ok(val) = std::env::var("SORAI_LOG_LEVEL") {
            config.logging.level = val;
        }
        if let Ok(val) = std::env::var("SORAI_LOG_SHOW_TIMESTAMP") {
            config.logging.show_timestamp = val.parse().unwrap_or(config.logging.show_timestamp);
        }
        if let Ok(val) = std::env::var("SORAI_LOG_ROTATION") {
            config.logging.rotation = val;
        }
        if let Ok(val) = std::env::var("SORAI_LOG_SHOW_MODULE") {
            config.logging.show_module = val.parse().unwrap_or(config.logging.show_module);
        }
        if let Ok(val) = std::env::var("SORAI_LOG_REQUEST_SAMPLING") {
            config.logging.request_sampling = val.parse().unwrap_or(config.logging.request_sampling);
        }
        if let Ok(val) = std::env::var("SORAI_LOG_SLOW_REQUESTS_ONLY") {
            config.logging.log_slow_requests_only = val.parse().unwrap_or(config.logging.log_slow_requests_only);
        }
        if let Ok(val) = std::env::var("SORAI_LOG_SLOW_THRESHOLD_MS") {
            config.logging.slow_threshold_ms = val.parse().unwrap_or(config.logging.slow_threshold_ms);
        }
        if let Ok(val) = std::env::var("SORAI_LOG_ANALYTICS_MODE") {
            config.logging.analytics_mode = val;
        }

        if let Ok(val) = std::env::var("SORAI_CORS_ENABLED") {
            config.cors.enabled = val.parse().unwrap_or(config.cors.enabled);
        }
        if let Ok(val) = std::env::var("SORAI_CORS_ALLOW_ORIGINS") {
            config.cors.allow_origins = val.split(',').map(|s| s.trim().to_string()).collect();
        }
        if let Ok(val) = std::env::var("SORAI_CORS_ALLOW_METHODS") {
            config.cors.allow_methods = val.split(',').map(|s| s.trim().to_string()).collect();
        }
        if let Ok(val) = std::env::var("SORAI_CORS_ALLOW_HEADERS") {
            config.cors.allow_headers = val.split(',').map(|s| s.trim().to_string()).collect();
        }
        if let Ok(val) = std::env::var("SORAI_CORS_EXPOSE_HEADERS") {
            config.cors.expose_headers = val.split(',').map(|s| s.trim().to_string()).collect();
        }
        if let Ok(val) = std::env::var("SORAI_CORS_ALLOW_CREDENTIALS") {
            config.cors.allow_credentials = val.parse().unwrap_or(config.cors.allow_credentials);
        }
        if let Ok(val) = std::env::var("SORAI_CORS_MAX_AGE") {
            config.cors.max_age = val.parse().unwrap_or(config.cors.max_age);
        }

        if let Ok(val) = std::env::var("SORAI_APP_MODE") {
            config.app.mode = val;
        }
        if let Ok(val) = std::env::var("SORAI_APP_SECRET_KEY") {
            config.app.secret_key = val;
        }
        if let Ok(val) = std::env::var("SORAI_JWT_SECRET_KEY") {
            config.app.jwt_secret_key = val;
        }
        if let Ok(val) = std::env::var("SORAI_JWT_ACCESS_TOKEN_EXPIRY") {
            config.app.jwt_access_token_expiry = val.parse().unwrap_or(config.app.jwt_access_token_expiry);
        }
        if let Ok(val) = std::env::var("SORAI_JWT_REFRESH_TOKEN_EXPIRY") {
            config.app.jwt_refresh_token_expiry = val.parse().unwrap_or(config.app.jwt_refresh_token_expiry);
        }

        if let Ok(val) = std::env::var("MAILER_FROM_EMAIL") {
            config.mailer.from_email = val;
        }
        if let Ok(val) = std::env::var("MAILER_FROM_NAME") {
            config.mailer.from_name = val;
        }
        if let Ok(val) = std::env::var("MAILER_SMTP_HOST") {
            config.mailer.smtp_host = val;
        }
        if let Ok(val) = std::env::var("MAILER_SMTP_PORT") {
            config.mailer.smtp_port = val.parse().unwrap_or(config.mailer.smtp_port);
        }
        if let Ok(val) = std::env::var("MAILER_SMTP_USERNAME") {
            config.mailer.smtp_username = val;
        }
        if let Ok(val) = std::env::var("MAILER_SMTP_PASSWORD") {
            config.mailer.smtp_password = val;
        }
        if let Ok(val) = std::env::var("MAILER_SMTP_SECURE") {
            config.mailer.smtp_secure = val.parse().unwrap_or(config.mailer.smtp_secure);
        }

        if let Ok(val) = std::env::var("SORAI_DATABASE_URL") {
            config.database.url = val;
        }
        if let Ok(val) = std::env::var("SORAI_DATABASE_TOKEN") {
            config.database.token = val;
        }
        if let Ok(val) = std::env::var("SORAI_DATABASE_AUTO_MIGRATE") {
            config.database.auto_migrate = val.parse().unwrap_or(config.database.auto_migrate);
        }

        if let Ok(val) = std::env::var("SORAI_SESSION_STORAGE") {
            config.session.storage = val;
        }

        if let Ok(val) = std::env::var("STORAGE_S3_ACCESS_KEY_ID") {
            config.storage.s3_access_key_id = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_SECRET_ACCESS_KEY") {
            config.storage.s3_secret_access_key = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_BUCKET_DEFAULT") {
            config.storage.s3_bucket_default = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_FORCE_PATH_STYLE") {
            config.storage.s3_force_path_style = val.parse().unwrap_or(config.storage.s3_force_path_style);
        }
        if let Ok(val) = std::env::var("STORAGE_S3_PATH_PREFIX") {
            config.storage.s3_path_prefix = Some(val);
        }
        if let Ok(val) = std::env::var("STORAGE_S3_ENDPOINT_URL") {
            config.storage.s3_endpoint_url = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_PUBLIC_URL") {
            config.storage.s3_public_url = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_REGION") {
            config.storage.s3_region = val;
        }
        if let Ok(val) = std::env::var("STORAGE_S3_SIGNED_URL_EXPIRES") {
            config.storage.s3_signed_url_expires = val.parse().unwrap_or(config.storage.s3_signed_url_expires);
        }
        if let Ok(val) = std::env::var("STORAGE_MAX_UPLOAD_SIZE") {
            config.storage.max_upload_size = val.parse().unwrap_or(config.storage.max_upload_size);
        }

        Ok(config)
    }

    pub fn display_debug_table(&self) {
        let mut items = Vec::new();

        self.sorai.add_to_debug(&mut items);
        self.app.add_to_debug(&mut items);
        self.logging.add_to_debug(&mut items);
        self.cors.add_to_debug(&mut items);
        self.mailer.add_to_debug(&mut items);
        self.database.add_to_debug(&mut items);
        self.session.add_to_debug(&mut items);
        self.storage.add_to_debug(&mut items);
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

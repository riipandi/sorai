#[cfg(test)]
mod config_tests {
    use sorai::Config;

    #[test]
    fn test_default_config() {
        let config = Config::default();

        // Check server defaults
        assert_eq!(config.sorai.host, "0.0.0.0");
        assert_eq!(config.sorai.port, 8000);

        // Check app defaults
        assert_eq!(config.app.mode, "development");
        assert_eq!(config.app.data_dir, "./data");
        assert_eq!(config.app.jwt_access_token_expiry, 900);
        assert_eq!(config.app.jwt_refresh_token_expiry, 7200);

        // Check logging defaults
        assert_eq!(config.logging.level, "info");
        assert_eq!(config.logging.rotation, "daily");
        assert!(config.logging.show_timestamp);
        assert!(config.logging.show_module);
        assert_eq!(config.logging.request_sampling, 100);
        assert!(!config.logging.log_slow_requests_only);
        assert_eq!(config.logging.slow_threshold_ms, 1000);

        // Check CORS defaults
        assert!(config.cors.enabled);
        assert_eq!(config.cors.allow_origins, vec!["*"]);
        assert!(config.cors.allow_methods.len() > 0);
        assert!(config.cors.allow_headers.len() > 0);
        assert!(!config.cors.allow_credentials);
        assert_eq!(config.cors.max_age, 3600);

        // Check storage defaults
        assert!(config.storage.s3_force_path_style);
        assert_eq!(config.storage.s3_region, "auto");
        assert_eq!(config.storage.s3_signed_url_expires, 3600);
        assert_eq!(config.storage.max_upload_size, 5242880);

        // Check mailer defaults
        assert_eq!(config.mailer.from_email, "noreply@example.com");
        assert_eq!(config.mailer.from_name, "Sorai");
        assert_eq!(config.mailer.smtp_host, "localhost");
        assert_eq!(config.mailer.smtp_port, 587);
        assert!(config.mailer.smtp_secure);
    }

    #[test]
    fn test_data_dir_default() {
        let config = Config::default();
        assert_eq!(config.app.data_dir, "./data");
    }

    #[test]
    fn test_empty_provider_configs() {
        let config = Config::default();

        // Provider configs should be empty by default
        assert!(config.openai.api_key.is_empty());
        assert!(config.openai.base_url.is_empty());

        assert!(config.anthropic.api_key.is_empty());
        assert!(config.anthropic.base_url.is_empty());

        assert!(config.bedrock.api_key.is_empty());
        assert!(config.bedrock.access_key.is_empty());
        assert!(config.bedrock.base_url.is_empty());

        assert!(config.cohere.api_key.is_empty());
        assert!(config.cohere.base_url.is_empty());

        assert!(config.azure_openai.api_key.is_empty());
        assert!(config.azure_openai.endpoint.is_empty());

        assert!(config.vertex.project_id.is_empty());
        assert!(config.vertex.credentials.is_empty());
        assert!(config.vertex.base_url.is_empty());
    }

    #[test]
    fn test_config_display() {
        let config = Config::default();

        // This test just ensures display_debug_table doesn't panic
        config.display_debug_table();
    }

    #[test]
    fn test_cors_defaults() {
        let config = Config::default();

        assert!(config.cors.enabled);
        assert_eq!(config.cors.allow_origins, vec!["*"]);
        assert_eq!(config.cors.allow_methods.len(), 7); // GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH
        assert!(config.cors.allow_methods.contains(&"GET".to_string()));
        assert!(config.cors.allow_methods.contains(&"POST".to_string()));
        assert!(!config.cors.allow_credentials);
        assert_eq!(config.cors.max_age, 3600);
    }

    #[test]
    fn test_logging_defaults() {
        let config = Config::default();

        assert_eq!(config.logging.level, "info");
        assert_eq!(config.logging.rotation, "daily");
        assert!(config.logging.show_timestamp);
        assert!(config.logging.show_module);
        assert_eq!(config.logging.request_sampling, 100);
        assert!(!config.logging.log_slow_requests_only);
        assert_eq!(config.logging.slow_threshold_ms, 1000);
        assert_eq!(config.logging.analytics_mode, "full");
    }

    #[test]
    fn test_database_defaults() {
        let config = Config::default();

        assert!(config.database.url.is_empty());
        assert!(config.database.token.is_empty());
        assert!(!config.database.auto_migrate);
    }

    #[test]
    fn test_session_default() {
        let config = Config::default();

        // Note: session.storage default is empty string
        // In actual app, this would be validated or use a default
        assert!(config.session.storage.is_empty());
    }

    #[test]
    fn test_mailer_defaults() {
        let config = Config::default();

        assert_eq!(config.mailer.from_email, "noreply@example.com");
        assert_eq!(config.mailer.from_name, "Sorai");
        assert_eq!(config.mailer.smtp_host, "localhost");
        assert_eq!(config.mailer.smtp_port, 587);
        assert!(config.mailer.smtp_username.is_empty());
        assert!(config.mailer.smtp_password.is_empty());
        assert!(config.mailer.smtp_secure);
    }

    #[test]
    fn test_storage_defaults() {
        let config = Config::default();

        assert!(config.storage.s3_access_key_id.is_empty());
        assert!(config.storage.s3_secret_access_key.is_empty());
        assert!(config.storage.s3_bucket_default.is_empty());
        assert!(config.storage.s3_force_path_style);
        assert!(config.storage.s3_path_prefix.is_none());
        assert!(config.storage.s3_endpoint_url.is_empty());
        assert!(config.storage.s3_public_url.is_empty());
        assert_eq!(config.storage.s3_region, "auto");
        assert_eq!(config.storage.s3_signed_url_expires, 3600);
        assert_eq!(config.storage.max_upload_size, 5242880); // 5MB
    }
}

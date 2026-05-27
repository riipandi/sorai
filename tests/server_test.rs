#[cfg(test)]
mod integration_tests {
    use sorai::Config;
    use sorai::http::HttpServer;

    #[test]
    fn test_http_server_creation() {
        let config = Config::default();
        let _server = HttpServer::new(config);

        // Just verify we can create a server instance
        // We're not actually starting it here
    }

    #[test]
    fn test_http_server_with_custom_config() {
        let mut config = Config::default();
        config.sorai.host = "127.0.0.1".to_string();
        config.sorai.port = 3000;
        config.logging.level = "debug".to_string();

        let _server = HttpServer::new(config);

        // Server created successfully with custom config
    }

    #[test]
    fn test_http_server_multiple_instances() {
        let config1 = Config::default();
        let config2 = Config::default();

        let _server1 = HttpServer::new(config1);
        let _server2 = HttpServer::new(config2);

        // Multiple server instances can be created
    }
}

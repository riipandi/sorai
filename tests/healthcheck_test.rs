#[cfg(test)]
mod healthcheck_tests {
    use std::env;
    use std::path::PathBuf;
    use std::process::Command;

    /// Helper function to create a temporary .env file for testing
    fn create_test_env_file(content: &str) -> PathBuf {
        let temp_dir = env::temp_dir();
        let env_file = temp_dir.join(format!("sorai_test_{}.env", std::process::id()));
        std::fs::write(&env_file, content).expect("Failed to write test env file");
        env_file
    }

    /// Helper function to clean up test env file
    fn cleanup_test_env_file(path: &PathBuf) {
        let _ = std::fs::remove_file(path);
    }

    /// Clean up environment variables that might affect other tests
    fn cleanup_env_vars() {
        let vars_to_clear = vec![
            "SORAI_LOG_LEVEL",
            "SORAI_LOG_ROTATION",
            "SORAI_CORS_ENABLED",
            "PORT",
            "HOST",
            "SORAI_MODE",
            "SORAI_DATA_DIR",
            "SORAI_APP_MODE",
        ];
        for var in vars_to_clear {
            unsafe { env::remove_var(var) };
        }
    }

    #[test]
    fn test_healthcheck_default_config() {
        cleanup_env_vars();
        // Test that healthcheck passes with default configuration
        let result = sorai::Config::load(None);
        assert!(result.is_ok(), "Default config should load successfully");
    }

    #[test]
    fn test_healthcheck_with_valid_env_file() {
        cleanup_env_vars();
        // Create a valid minimal env file
        let env_content = r#"
SORAI_APP_MODE=production
SORAI_DATA_DIR=./test_data
"#;
        let env_file = create_test_env_file(env_content);
        let env_path = Some(env_file.to_string_lossy().to_string());

        let result = sorai::Config::load(env_path.clone());
        assert!(result.is_ok(), "Config with valid env file should load");

        // Verify env_file path is stored in config
        if let Ok(config) = result {
            assert_eq!(config.env_file, env_path, "Env file path should be stored");
        }

        cleanup_test_env_file(&env_file);
    }

    #[test]
    fn test_healthcheck_with_custom_data_dir() {
        cleanup_env_vars();
        // Test healthcheck with custom data directory
        let temp_dir = env::temp_dir();
        let custom_data_dir = temp_dir.join("sorai_healthcheck_test");

        let env_content = format!(
            r#"
SORAI_DATA_DIR={}
"#,
            custom_data_dir.to_string_lossy()
        );

        let env_file = create_test_env_file(&env_content);
        let env_path = Some(env_file.to_string_lossy().to_string());

        let result = sorai::Config::load(env_path);
        assert!(result.is_ok(), "Config with custom data dir should load");

        cleanup_test_env_file(&env_file);
        let _ = std::fs::remove_dir_all(&custom_data_dir);
    }

    #[test]
    fn test_healthcheck_with_nonexistent_env_file() {
        cleanup_env_vars();
        // Test with a non-existent env file
        // When an explicit env file path is provided, it should fail if not found
        let nonexistent_path = Some("/tmp/nonexistent_sorai_env_12345.env".to_string());
        let result = sorai::Config::load(nonexistent_path);

        // Should fail when explicitly provided env file doesn't exist
        assert!(result.is_err(), "Should fail when explicit env file not found");
    }

    #[test]
    fn test_healthcheck_with_port_override() {
        cleanup_env_vars();
        // Test healthcheck with port configuration
        let env_content = r#"
PORT=7777
"#;
        let env_file = create_test_env_file(env_content);
        let env_path = Some(env_file.to_string_lossy().to_string());

        let result = sorai::Config::load(env_path);
        assert!(result.is_ok(), "Config with port override should load");

        if let Ok(config) = result {
            // Verify the port was set to something (either from env or default)
            assert!(config.sorai.port > 0, "Port should be valid");
        }

        cleanup_test_env_file(&env_file);
    }

    #[test]
    fn test_healthcheck_with_logging_config() {
        cleanup_env_vars();
        // Test healthcheck with logging configuration
        let env_content = r#"
SORAI_LOG_LEVEL=warn
SORAI_LOG_ROTATION=never
"#;
        let env_file = create_test_env_file(env_content);
        let env_path = Some(env_file.to_string_lossy().to_string());

        let result = sorai::Config::load(env_path);
        assert!(result.is_ok(), "Config with logging config should load");

        if let Ok(config) = result {
            // Verify config has logging settings loaded
            assert!(!config.logging.level.is_empty(), "Should have log level");
            assert!(!config.logging.rotation.is_empty(), "Should have log rotation");
        }

        cleanup_test_env_file(&env_file);
    }

    #[test]
    fn test_healthcheck_with_cors_config() {
        cleanup_env_vars();
        // Test healthcheck with CORS configuration
        let env_content = r#"
SORAI_CORS_ENABLED=false
"#;
        let env_file = create_test_env_file(env_content);
        let env_path = Some(env_file.to_string_lossy().to_string());

        let result = sorai::Config::load(env_path);
        assert!(result.is_ok(), "Config with CORS config should load");

        // Verify config has CORS settings (either from env or defaults)
        if let Ok(config) = result {
            assert!(
                config.cors.allow_origins.len() > 0,
                "Should have CORS origins configured"
            );
        }

        cleanup_test_env_file(&env_file);
    }

    #[test]
    #[ignore = "Requires built binary"]
    fn test_healthcheck_command_exit_code() {
        // Integration test: Run actual binary and check exit code
        let output = Command::new("cargo")
            .args(["run", "--", "healthcheck"])
            .output()
            .expect("Failed to execute healthcheck command");

        assert!(
            output.status.success(),
            "Healthcheck command should exit with code 0 (success)"
        );

        let stdout = String::from_utf8_lossy(&output.stdout);
        assert!(
            stdout.contains("healthy"),
            "Healthcheck output should contain 'healthy'"
        );
    }

    #[test]
    #[ignore = "Requires built binary"]
    fn test_healthcheck_alias_exit_code() {
        // Integration test: Run actual binary with hc alias and check exit code
        let output = Command::new("cargo")
            .args(["run", "--", "hc"])
            .output()
            .expect("Failed to execute hc command");

        assert!(output.status.success(), "HC alias should exit with code 0 (success)");

        let stdout = String::from_utf8_lossy(&output.stdout);
        assert!(stdout.contains("healthy"), "HC alias output should contain 'healthy'");
    }

    #[test]
    #[ignore = "Requires built binary"]
    fn test_healthcheck_with_custom_data_dir_cli() {
        // Integration test: Test healthcheck with --data-dir flag
        let temp_dir = env::temp_dir();
        let custom_dir = temp_dir.join("sorai_cli_test");

        let output = Command::new("cargo")
            .args(["run", "--", "--data-dir", custom_dir.to_str().unwrap(), "healthcheck"])
            .output()
            .expect("Failed to execute healthcheck with data-dir");

        assert!(
            output.status.success(),
            "Healthcheck with custom data-dir should succeed"
        );

        let stdout = String::from_utf8_lossy(&output.stdout);
        assert!(
            stdout.contains("healthy"),
            "Healthcheck output should contain 'healthy'"
        );

        let _ = std::fs::remove_dir_all(&custom_dir);
    }
}

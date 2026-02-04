use crate::config::Config;
use axum::http::{HeaderName, HeaderValue, Method};
use tower_http::cors::CorsLayer;

/// Create CORS layer from configuration
pub fn create_cors_layer(config: &Config) -> Option<CorsLayer> {
    if !config.cors.enabled {
        tracing::debug!("🚫 CORS is disabled");
        return None;
    }

    let mut cors = CorsLayer::new();

    // Configure allowed origins
    if config.cors.allow_origins.len() == 1 && config.cors.allow_origins[0] == "*" {
        cors = cors.allow_origin(tower_http::cors::Any);
    } else {
        let origins: Result<Vec<HeaderValue>, _> = config
            .cors
            .allow_origins
            .iter()
            .map(|origin| origin.parse::<HeaderValue>())
            .collect();

        match origins {
            Ok(origin_values) => {
                cors = cors.allow_origin(origin_values);
            }
            Err(e) => {
                tracing::error!("Invalid CORS origin configuration: {}", e);
                tracing::debug!("Falling back to allow any origin");
                cors = cors.allow_origin(tower_http::cors::Any);
            }
        }
    }

    // Configure allowed methods
    let methods: Result<Vec<Method>, _> = config
        .cors
        .allow_methods
        .iter()
        .map(|method| method.parse::<Method>())
        .collect();

    match methods {
        Ok(method_values) => {
            cors = cors.allow_methods(method_values);
        }
        Err(e) => {
            tracing::error!("Invalid CORS method configuration: {}", e);
            tracing::debug!("Falling back to default methods");
            cors = cors.allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::HEAD,
                Method::OPTIONS,
                Method::PATCH,
            ]);
        }
    }

    // Configure allowed headers
    if !config.cors.allow_headers.is_empty() {
        let headers: Result<Vec<HeaderName>, _> = config
            .cors
            .allow_headers
            .iter()
            .map(|header| header.parse::<HeaderName>())
            .collect();

        match headers {
            Ok(header_values) => {
                cors = cors.allow_headers(header_values);
            }
            Err(e) => {
                tracing::error!("Invalid CORS header configuration: {}", e);
                tracing::debug!("Falling back to any headers");
                cors = cors.allow_headers(tower_http::cors::Any);
            }
        }
    }

    // Configure exposed headers
    if !config.cors.expose_headers.is_empty() {
        let expose_headers: Result<Vec<HeaderName>, _> = config
            .cors
            .expose_headers
            .iter()
            .map(|header| header.parse::<HeaderName>())
            .collect();

        match expose_headers {
            Ok(header_values) => {
                cors = cors.expose_headers(header_values);
            }
            Err(e) => {
                tracing::error!("Invalid CORS expose headers configuration: {}", e);
            }
        }
    }

    // Configure credentials
    if config.cors.allow_credentials {
        cors = cors.allow_credentials(true);
    }

    // Configure max age
    if config.cors.max_age > 0 {
        cors = cors.max_age(std::time::Duration::from_secs(config.cors.max_age));
    }

    Some(cors)
}

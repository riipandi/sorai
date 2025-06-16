/// Root endpoint handler
pub async fn index() -> &'static str {
    "Hello, World!!!"
}

/// Health check endpoint handler
pub async fn health_check() -> &'static str {
    "OK"
}

/// API status endpoint handler
pub async fn status() -> &'static str {
    "Swift Relay Server is running"
}

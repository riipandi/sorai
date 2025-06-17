use axum::{
    extract::{ConnectInfo, Request},
    middleware::Next,
    response::Response,
};
use std::net::SocketAddr;

/// Extract User-Agent from request headers
pub fn extract_user_agent(request: &Request) -> String {
    request
        .headers()
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown")
        .to_string()
}

/// Extract client IP address from request
/// Checks X-Forwarded-For, X-Real-IP, and connection info in order
pub fn extract_client_ip(request: &Request) -> String {
    // Check X-Forwarded-For header first (for reverse proxy setups)
    if let Some(forwarded_for) = request.headers().get("x-forwarded-for").and_then(|v| v.to_str().ok()) {
        // X-Forwarded-For can contain multiple IPs, take the first one
        if let Some(first_ip) = forwarded_for.split(',').next() {
            return first_ip.trim().to_string();
        }
    }

    // Check X-Real-IP header (common with nginx)
    if let Some(real_ip) = request.headers().get("x-real-ip").and_then(|v| v.to_str().ok()) {
        return real_ip.to_string();
    }

    // Check CF-Connecting-IP header (Cloudflare)
    if let Some(cf_ip) = request.headers().get("cf-connecting-ip").and_then(|v| v.to_str().ok()) {
        return cf_ip.to_string();
    }

    // Check X-Forwarded header (less common)
    if let Some(forwarded) = request.headers().get("x-forwarded").and_then(|v| v.to_str().ok()) {
        // Parse "for=ip" format
        if let Some(for_part) = forwarded.split(';').find(|part| part.trim().starts_with("for=")) {
            if let Some(ip) = for_part.trim().strip_prefix("for=") {
                return ip.trim_matches('"').to_string();
            }
        }
    }

    // Fallback to connection remote address if available
    request
        .extensions()
        .get::<ConnectInfo<SocketAddr>>()
        .map(|connect_info| connect_info.0.ip().to_string())
        .unwrap_or_else(|| "unknown".to_string())
}

/// Middleware to extract and store connection information in request extensions
pub async fn connection_info_middleware(mut request: Request, next: Next) -> Response {
    // Extract connection information
    let user_agent = extract_user_agent(&request);
    let client_ip = extract_client_ip(&request);

    // Store in request extensions for later use
    request
        .extensions_mut()
        .insert(ConnectionInfo { user_agent, client_ip });

    // Continue to next middleware/handler
    next.run(request).await
}

/// Connection information extracted from request
#[derive(Debug, Clone)]
pub struct ConnectionInfo {
    pub user_agent: String,
    pub client_ip: String,
}

impl ConnectionInfo {
    /// Get connection info from request extensions or create default
    pub fn from_request_or_default(request: &Request) -> ConnectionInfo {
        request
            .extensions()
            .get::<ConnectionInfo>()
            .cloned()
            .unwrap_or_else(|| ConnectionInfo {
                user_agent: extract_user_agent(request),
                client_ip: extract_client_ip(request),
            })
    }

    /// Get shortened user agent for compact logging
    pub fn short_user_agent(&self) -> String {
        // Extract browser name and version from user agent
        let ua = &self.user_agent;

        if ua.contains("Chrome/") {
            if let Some(start) = ua.find("Chrome/") {
                if let Some(end) = ua[start..].find(' ') {
                    return ua[start..start + end].to_string();
                }
            }
        } else if ua.contains("Firefox/") {
            if let Some(start) = ua.find("Firefox/") {
                if let Some(end) = ua[start..].find(' ') {
                    return ua[start..start + end].to_string();
                } else {
                    return ua[start..].to_string();
                }
            }
        } else if ua.contains("Safari/") && !ua.contains("Chrome") {
            if let Some(start) = ua.find("Version/") {
                if let Some(end) = ua[start..].find(' ') {
                    return format!("Safari/{}", &ua[start + 8..start + end]);
                }
            }
        } else if ua.contains("curl/") {
            if let Some(start) = ua.find("curl/") {
                if let Some(end) = ua[start..].find(' ') {
                    return ua[start..start + end].to_string();
                } else {
                    return ua[start..].to_string();
                }
            }
        }

        // Fallback: truncate long user agents
        if ua.len() > 50 {
            format!("{}...", &ua[..47])
        } else {
            ua.clone()
        }
    }

    /// Check if the request is from a bot/crawler
    pub fn is_bot(&self) -> bool {
        let ua_lower = self.user_agent.to_lowercase();

        // Common bot patterns
        let bot_patterns = [
            "bot",
            "crawler",
            "spider",
            "scraper",
            "curl",
            "wget",
            "postman",
            "googlebot",
            "bingbot",
            "slurp",
            "duckduckbot",
            "baiduspider",
            "yandexbot",
            "facebookexternalhit",
            "twitterbot",
            "linkedinbot",
            "whatsapp",
            "telegram",
            "discord",
            "slack",
            "monitoring",
        ];

        bot_patterns.iter().any(|pattern| ua_lower.contains(pattern))
    }
}

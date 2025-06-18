use axum::http::Request;
use tower_http::request_id::{MakeRequestId, RequestId};
use type_safe_id::{StaticType, TypeSafeId};

/// Request type for TypeID
#[derive(Default)]
pub struct HttpRequest;

impl StaticType for HttpRequest {
    // TypeSafeId prefix for request IDs, set to empty string
    const TYPE: &'static str = "";
}

/// Type alias for request IDs
pub type HttpRequestId = TypeSafeId<HttpRequest>;

/// Custom request ID maker using TypeSafeId
#[derive(Clone, Copy, Default)]
pub struct MakeTypeSafeRequestId;

impl MakeRequestId for MakeTypeSafeRequestId {
    fn make_request_id<B>(&mut self, _request: &Request<B>) -> Option<RequestId> {
        let request_id = HttpRequestId::new();
        let header_value = request_id.to_string().parse().ok()?;
        Some(RequestId::new(header_value))
    }
}

/// Alternative request ID maker with custom prefix
#[derive(Clone)]
pub struct MakeCustomRequestId {
    prefix: &'static str,
}

impl MakeCustomRequestId {
    pub fn new(prefix: &'static str) -> Self {
        Self { prefix }
    }
}

impl Default for MakeCustomRequestId {
    fn default() -> Self {
        Self::new("req")
    }
}

impl MakeRequestId for MakeCustomRequestId {
    fn make_request_id<B>(&mut self, _request: &Request<B>) -> Option<RequestId> {
        // Create a TypeSafeId and extract the suffix part manually
        let id = TypeSafeId::<CustomRequestType>::new();
        let id_str = id.to_string();

        // Extract suffix after the underscore (format is "custom_xxxxxxxxxxxx")
        let suffix = if let Some(pos) = id_str.find('_') {
            &id_str[pos + 1..]
        } else {
            &id_str
        };

        let custom_id = format!("{}_{}", self.prefix, suffix);
        let header_value = custom_id.parse().ok()?;
        Some(RequestId::new(header_value))
    }
}

/// Dynamic request type for custom prefixes
#[derive(Default)]
struct CustomRequestType;

impl StaticType for CustomRequestType {
    const TYPE: &'static str = "custom";
}

use crate::utils::response::SoraiError;
use axum::response::IntoResponse;

/// Handler for 404 Not Found routes
pub async fn not_found_handler() -> impl IntoResponse {
    SoraiError::new(
        axum::http::StatusCode::NOT_FOUND,
        "not_found_error",
        "route_not_found",
        "The requested route was not found on this server",
        None,
    )
}

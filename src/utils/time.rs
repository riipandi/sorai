use chrono::Utc;
use std::fmt;
use tracing_subscriber::fmt::time::FormatTime;

/// Precise time formatter with millisecond precision (24 characters)
/// Format: 2025-06-17T15:23:58.123Z
pub struct PreciseTimeFormat;

impl FormatTime for PreciseTimeFormat {
    fn format_time(&self, w: &mut tracing_subscriber::fmt::format::Writer<'_>) -> fmt::Result {
        let now = Utc::now();
        write!(w, "{}", now.format("%Y-%m-%dT%H:%M:%S%.3fZ"))
    }
}

/// High precision time formatter with microsecond precision (27 characters)
/// Format: 2025-06-17T15:23:58.123456Z
pub struct HighPrecisionTimeFormat;

impl FormatTime for HighPrecisionTimeFormat {
    fn format_time(&self, w: &mut tracing_subscriber::fmt::format::Writer<'_>) -> fmt::Result {
        let now = Utc::now();
        write!(w, "{}", now.format("%Y-%m-%dT%H:%M:%S%.6fZ"))
    }
}

/// Utility function to format timestamp consistently for span fields
/// Returns 24-character timestamp with millisecond precision
pub fn format_timestamp_for_span() -> String {
    Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string()
}

/// Utility function to format timestamp for startup messages
/// Returns human-readable format: "2025-06-17 15:23:58 UTC"
pub fn format_timestamp_readable() -> String {
    Utc::now().format("%Y-%m-%d %H:%M:%S UTC").to_string()
}

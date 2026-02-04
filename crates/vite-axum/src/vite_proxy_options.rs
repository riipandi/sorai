// Copyright (c) 2025 Aris Ripandi <aris@duck.com>
//
// Portions of this file are based on Vite Actix by Drew Chase.
// Vite Actix is a library designed to enable seamless integration of the
// Vite development server with the Actix web framework.
//
// Vite Actix is licensed under GNU General Public License v3.0.
// @see: https://github.com/Drew-Chase/vite-actix
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

use log::Level::Debug;
use std::env::current_dir;
use std::sync::{Mutex, OnceLock};

// Use OnceLock to ensure the Mutex is initialized only once
static PROXY_VITE_OPTIONS: OnceLock<Mutex<ViteProxyOptions>> = OnceLock::new();

#[derive(Clone)]
pub struct ViteProxyOptions {
    pub port: Option<u16>,
    pub working_directory: String,
    pub log_level: Option<log::Level>,
}

impl Default for ViteProxyOptions {
    fn default() -> Self {
        Self {
            port: None,
            working_directory: try_find_vite_dir().unwrap_or(String::from("./")),
            log_level: Some(Debug),
        }
    }
}

impl ViteProxyOptions {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn port(mut self, port: u16) -> Self {
        self.port = Some(port);
        Self::update_port(port).ok();
        self
    }

    pub fn working_directory(mut self, working_directory: impl AsRef<str>) -> Self {
        self.working_directory = working_directory.as_ref().to_string();
        self
    }

    pub fn log_level(mut self, log_level: log::Level) -> Self {
        self.log_level = Some(log_level);
        self
    }

    pub fn disable_logging(mut self) -> Self {
        self.log_level = None;
        self
    }

    // Update port without cloning the entire object
    pub fn update_port(port: u16) -> anyhow::Result<()> {
        let options = get_or_init_mutex();
        let mut options_guard = options
            .lock()
            .map_err(|_| anyhow::Error::msg("Failed to lock proxy options for port update"))?;

        options_guard.port = Some(port);
        log::debug!("Updated global options port to {}", port);

        Ok(())
    }

    // Initialize or update global options
    pub fn build(self) -> anyhow::Result<()> {
        let options = get_or_init_mutex();
        let mut options_guard = options
            .lock()
            .map_err(|_| anyhow::Error::msg("Failed to lock proxy options during build"))?;

        // Update the global state with the new options
        *options_guard = self;

        Ok(())
    }

    // Get a clone of the current global options
    pub fn global() -> Self {
        let options = get_or_init_mutex();

        match options.lock() {
            Ok(guard) => guard.clone(),
            Err(_) => {
                log::warn!("Failed to lock ViteProxyOptions, returning default instance");
                Self::default()
            }
        }
    }
}

// Helper function to initialize the mutex if needed and return a reference to it
fn get_or_init_mutex() -> &'static Mutex<ViteProxyOptions> {
    PROXY_VITE_OPTIONS.get_or_init(|| {
        log::warn!("No initial ViteProxyOptions found, initializing with default values");
        Mutex::new(ViteProxyOptions::default())
    })
}

/// Attempts to find the directory containing `vite.config.ts`
/// by traversing the filesystem upwards from the current working directory.
///
/// # Returns
///
/// Returns `Some(String)` with the path of the directory containing the `vite.config.[ts|js|mjs|mts]` file,
/// if found. Otherwise, returns `None` if the file is not located or an error occurs during traversal.
///
/// # Example
/// ```no-rust
/// if let Some(vite_dir) = try_find_vite_dir() {
///     println!("Found vite.config.ts in directory: {}", vite_dir);
/// } else {
///     println!("vite.config.ts not found.");
/// }
/// ```
pub fn try_find_vite_dir() -> Option<String> {
    // Get the current working directory. If unable to retrieve, return `None`.
    let mut cwd = current_dir().ok()?;

    // Continue traversing upwards in the directory hierarchy until the root directory is reached.
    while cwd != std::path::Path::new("/") {
        // Check if vite.config exists in the current directory (any extension)
        if cwd.join("vite.config.ts").exists()
            || cwd.join("vite.config.js").exists()
            || cwd.join("vite.config.mts").exists()
            || cwd.join("vite.config.mjs").exists()
        {
            // If found, convert the path to a `String` and return it.
            return Some(cwd.to_str()?.to_string());
        }
        // Move to the parent directory if it exists.
        if let Some(parent) = cwd.parent() {
            cwd = parent.to_path_buf();
        } else {
            // Break the loop if the parent directory doesn't exist or if permissions were denied.
            break;
        }
    }

    // Return `None` if vite.config was not found.
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_creation() {
        let options = ViteProxyOptions::new();
        assert_eq!(options.port, None);
        assert!(options.working_directory.contains("./") || options.working_directory.contains("."));
        assert_eq!(options.log_level, Some(log::Level::Debug));
    }

    #[test]
    fn test_port_builder() {
        let options = ViteProxyOptions::new().port(3000);
        assert_eq!(options.port, Some(3000));
    }

    #[test]
    fn test_working_directory_builder() {
        let dir = "/custom/dir";
        let options = ViteProxyOptions::new().working_directory(dir);
        assert_eq!(options.working_directory, dir);
    }

    #[test]
    fn test_log_level_builder() {
        let options = ViteProxyOptions::new().log_level(log::Level::Info);
        assert_eq!(options.log_level, Some(log::Level::Info));
    }

    #[test]
    fn test_disable_logging_builder() {
        let options = ViteProxyOptions::new().disable_logging();
        assert_eq!(options.log_level, None);
    }

    #[test]
    fn test_clone() {
        let options1 = ViteProxyOptions::new()
            .port(9999)
            .working_directory("/test")
            .log_level(log::Level::Warn);

        let options2 = options1.clone();

        assert_eq!(options1.port, options2.port);
        assert_eq!(options1.working_directory, options2.working_directory);
        assert_eq!(options1.log_level, options2.log_level);
    }

    #[test]
    fn test_build_and_global() {
        // Build initial configuration
        ViteProxyOptions::new()
            .port(5000)
            .working_directory("/test/dir")
            .log_level(log::Level::Error)
            .build()
            .unwrap();

        let global = ViteProxyOptions::global();
        assert_eq!(global.port, Some(5000));
        assert_eq!(global.working_directory, "/test/dir");
        assert_eq!(global.log_level, Some(log::Level::Error));
    }

    #[test]
    fn test_update_port() {
        ViteProxyOptions::new().port(3000).build().unwrap();

        ViteProxyOptions::update_port(4000).unwrap();

        let global = ViteProxyOptions::global();
        assert_eq!(global.port, Some(4000));
    }

    #[test]
    fn test_override_global() {
        // First configuration
        ViteProxyOptions::new().port(1111).build().unwrap();

        let global1 = ViteProxyOptions::global();
        assert_eq!(global1.port, Some(1111));

        // Override with new configuration
        ViteProxyOptions::new().port(2222).build().unwrap();

        let global2 = ViteProxyOptions::global();
        assert_eq!(global2.port, Some(2222));
    }
}

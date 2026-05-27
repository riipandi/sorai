# Agent Guidelines for Sorai

This file contains instructions for AI agents working on the Sorai codebase.

## Essential Commands

**IMPORTANT**: This project uses `just` as a task runner. Always prefer `just` commands over direct `cargo` commands.

### Building & Development
```bash
just build      # Build release + debug (frontend + backend)
just check      # Check compilation without building
just format     # Check code formatting
just cleanup    # Clean up build artifacts
```

### Testing
```bash
just test                        # Run all tests (uses nextest)
just test <test_name>            # Run specific test
just coverage                    # Generate code coverage report
cargo test --test config_test    # Run specific test file
cargo test test_default_config   # Run specific test function
cargo test -- --nocapture        # Run tests with output
cargo test -p vite-axum          # Run tests for workspace member
```

### Development Server
```bash
just dev              # Start dev server (watch mode, port 3000, .env.local)
just run <command>    # Run CLI with .env.local
just start            # Start release build
just start-debug      # Start debug build
```

### Linting
```bash
cargo clippy -- -D warnings    # Run Clippy linter
cargo fmt                      # Format code
cargo fmt -- --check           # Check format without writing
```

### Running the Application
```bash
just dev                       # Development server (recommended)
just start                     # Production build
cargo run -- serve             # Run with default config
cargo run -- debug             # Display configuration
cargo run -- --env-file .env.production serve
cargo run -- --data-dir /var/lib/sorai serve
```

## Code Style Guidelines

### File Organization
- Modules organized by feature: `src/config/`, `src/http/`, `src/providers/`, `src/utils/`
- Integration tests in `tests/` directory
- Each provider has its own module with `config.rs`, `handler.rs`, `types.rs`, etc.

### Imports
1. **External crates first** - Standard library, then third-party dependencies
2. **Internal imports second** - Using `use crate::...` for cross-module imports
3. **Re-exports** - Use `pub use` in mod.rs to simplify imports

```rust
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use crate::config::Config;
use crate::http::HttpServer;
```

### Structs & Types
- Always derive `Debug`, `Clone`, `Serialize`, `Deserialize` when applicable
- Use `#[serde(default)]` for optional fields
- Implement `Default` trait manually for complex defaults

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppConfig {
    #[serde(default)]
    pub mode: String,
    #[serde(default = "default_data_dir")]
    pub data_dir: String,
}
```

### Naming Conventions
- **Types**: `PascalCase` (e.g., `OpenAIConfig`, `HttpServer`)
- **Functions/Methods**: `snake_case` (e.g., `load_config`, `add_to_debug`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `LOG_NAME_PREFIX`)
- **Environment variables**: `PREFIX_SECTION__KEY` (e.g., `SORAI_LOG_LEVEL`, `PROVIDER_OPENAI_API_KEY`)

### Error Handling
- Use `Result<T, E>` for fallible operations
- Return `Box<dyn std::error::Error>` for simple error propagation
- Use `thiserror` for custom error types, `anyhow::Result` for application-level errors

### Async/Await
- Use `tokio` runtime with `#[tokio::main]`
- Use `.await` instead of blocking operations
- Prefer async variants (e.g., `tokio::fs` over `std::fs`)

### Testing
- Keep tests simple and focused
- Use `#[test]` for unit tests, `#[tokio::test]` for async tests
- Test name format: `test_<function>_<scenario>`
- Use `assert_eq!`, `assert!` for assertions
- Avoid complex setup; prefer default/fresh state

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = Config::default();
        assert_eq!(config.sorai.port, 8000);
    }
}
```

### Configuration Management
- Load config from environment variables only (not TOML/JSON files)
- Use `dotenvy` for loading `.env` files
- Environment variable naming: `PREFIX_SECTION__KEY`
- Provide sensible defaults for all values
- Support CLI flag overrides for critical values (host, port, data-dir)

### Documentation
- Use `///` for public API documentation
- Use `//` for inline comments explaining "why", not "what"
- Document environment variables in `docs/CONFIGURATION.md` and `.env.example`

### Security
- Never log secrets; use redaction helper functions
- Redact sensitive values in debug output (API keys, tokens, passwords)
- Don't commit `.env` files with real credentials

## Project-Specific Notes

### Workspace Structure
- Main package: `sorai`
- Workspace member: `crates/vite-axum`
- Both packages tested independently

### Provider Configuration
- Each LLM provider has its own config module
- All providers support custom `base_url` for proxies
- Provider configs use `PROVIDER_<NAME>_` prefix for env vars

### Data Directory
- Default: `./data` (relative to CWD)
- Logs stored in `{data_dir}/logs`
- Override with `--data-dir` CLI flag

### When Making Changes
1. Run `just check` after editing code
2. Run `cargo clippy` before committing
3. Run `just test` to ensure tests pass
4. Update `.env.example` if adding new configuration
5. Update `docs/CONFIGURATION.md` for user-facing changes

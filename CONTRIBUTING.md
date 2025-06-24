# Contributing to Sorai

Thank you for your interest in contributing to Sorai! We welcome contributions
from everyone and are grateful for every contribution, no matter how small.
This document provides guidelines and information for developers who want to
contribute to the project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct.
Please be respectful and constructive in all interactions. We aim to create a
welcoming environment for all contributors.

## Table of Contents

- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Development Tools](#development-tools)
- [Docker Development](#docker-development)
- [API Development](#api-development)
- [Monitoring and Debugging](#monitoring-and-debugging)

## Development Setup

### Prerequisites

- **Rust**: Version 1.87 or later. Install via [rustup](https://rustup.rs/)
- **Git**: For version control
- **Just**: Task runner (optional but recommended) - `cargo install just`
- **Watchexec**: For auto-reload during development - `cargo install watchexec-cli`
- **Nextest**: Better test runner - `cargo install cargo-nextest`
- **Tarpaulin**: Code coverage - `cargo install cargo-tarpaulin`
- **Docker**: For containerized development (optional)
- **jq**: JSON processor for parsing metadata - Install from [jq website](https://jqlang.org) or via package manager

This project uses Just for comprehensive development tooling and Watchexec for hot reload support.

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/sorai.git && cd sorai
```

3. Add the upstream remote:
```bash
git remote add upstream https://github.com/riipandi/sorai.git
```

4. Set up configuration, edit `config.toml` with your API keys for testing:
```bash
cp config.toml.example config.toml
```

## Development Workflow

### Using Just (Recommended)

Sorai includes a `justfile` for common development tasks. List all available tasks:

```bash
just
```

Common development commands:

```bash
# Start development server with auto-reload
just dev

# Run the application
just run serve

# Build for release
just build

# Build for debug
just build-debug

# Run tests
just test

# Generate code coverage
just coverage

# Format code
just format

# Check code without building
just check

# Clean artifacts
just cleanup
```

### Manual Development

If you prefer not to use Just:

```bash
# Debug build
cargo build

# Release build
cargo build --release

# Run tests
cargo nextest run --no-fail-fast

# Run with logging
RUST_LOG=debug cargo run -- serve

# Watch for changes
watchexec -r -e rs -- cargo run -- serve

# Format code
cargo fmt --all

# Check code
cargo check

# Generate coverage
cargo tarpaulin --release --out Stdout
```

### Development Server

Start the development server with auto-reload:

```bash
# Using just
just dev

# Manual with watchexec
watchexec -r -e rs -- cargo run -q -- serve
```

The server will start on `http://localhost:8000` by default.

## Code Style and Standards

### Rust Code Style

- Follow standard Rust formatting using `rustfmt`
- Use `cargo clippy` for linting
- Write idiomatic Rust code
- Add documentation comments for public APIs
- Use meaningful variable and function names

### Formatting

Always format your code before committing:

```bash
just format
# or
cargo fmt --all
```

### Linting

Check for common issues:

```bash
just check
# or
cargo clippy --all-targets --all-features
```

## Testing

### Running Tests

```bash
# Run all tests
just test

# Run specific test
cargo nextest run test_name

# Run tests with output
cargo nextest run --no-capture

# Run tests for specific module
cargo nextest run --package sorai --lib config
```

### Writing Tests

- Write unit tests for individual functions
- Write integration tests for API endpoints
- Include edge cases and error conditions
- Use descriptive test names
- Mock external dependencies when possible

Example test structure:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function_name_should_do_something() {
        // Arrange
        let input = "test input";

        // Act
        let result = function_under_test(input);

        // Assert
        assert_eq!(result, expected_output);
    }
}
```

### Code Coverage

Generate code coverage reports:

```bash
just coverage
# or
cargo tarpaulin --release --out Html
```

## Documentation

### Code Documentation

- Add rustdoc comments for public APIs
- Include examples in documentation
- Document error conditions
- Keep documentation up to date

### API Documentation

When making API changes:

1. Update the OpenAPI specification in `docs/openapi.json`
2. Update `docs/http-transport.md`
3. Add examples to `specs` directory

## Submitting Changes

### Pull Request Process

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: add new feature description"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

### Commit Message Format

Use conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

Example:
```
feat: add support for Google Vertex AI provider

- Implement Vertex AI configuration
- Add authentication handling
- Update provider registry
- Add integration tests
```

### Before Submitting

Ensure your changes pass all checks:

```bash
# Format code
just format

# Run tests
just test

# Check for issues
just check

# Build successfully
just build
```

## Development Tools

### CLI Commands and Subcommands

Sorai provides the following CLI interface:

```bash
# Show help (default when no subcommand is provided)
sorai

# Start the web server
sorai serve [OPTIONS]

# Display configuration values in debug mode
sorai debug
```

### Configuration Flags

#### Global Flags

| Flag              | Short | Description               | Default  |
|-------------------|-------|---------------------------|----------|
| `--config <FILE>` | `-c`  | Sets a custom config file | Required |

#### Serve Command Flags

| Flag            | Description               | Default                  |
|-----------------|---------------------------|--------------------------|
| `--host <HOST>` | Override host from config | Uses config file setting |
| `--port <PORT>` | Override port from config | Uses config file setting |

#### Usage Examples

```bash
# Start server with custom config file
cargo run -- serve --config /path/to/config.toml

# Start server with config file and override host/port
cargo run -- serve --config config.toml --host 0.0.0.0 --port 3000

# Debug configuration
cargo run -- debug --config config.toml

# Show help
cargo run -- --help
cargo run -- serve --help
```

### Environment Variables

Useful environment variables for development:

```bash
# Enable debug logging
export RUST_LOG=debug

# Enable trace logging for specific modules
export RUST_LOG=sorai::http::server=trace

# Disable colored output
export NO_COLOR=1
```

## Docker Development

### Building Docker Images

```bash
# Build Docker image
just docker-build

# Build with specific platform
docker build -f Dockerfile . -t sorai:dev --build-arg PLATFORM=linux/amd64
```

### Running with Docker

```bash
# Run with Docker
just docker-run serve

# Execute commands in container
just docker-exec serve --help

# Debug container
just docker-shell

# View Docker images
just docker-images
```

### Docker Compose

For development with external services:

```bash
# Start development environment
just compose-up

# Stop development environment
just compose-down

# Cleanup volumes
just compose-cleanup
```

## API Development

### Testing API Endpoints

Use the provided examples in `specs`:

```bash
# Test chat completions
xh POST localhost:8000/v1/chat/completions < completions-request.json

# Test with curl
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello, Sorai!"}
    ]
  }'
```

### API Response Format

All responses include Sorai-specific extra fields:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "choices": [...],
  "model": "gpt-4o-mini",
  "created": 1677652288,
  "usage": {...},
  "extra_fields": {
    "provider": "openai",
    "model_params": {...},
    "latency": 1.234,
    "raw_response": {...}
  }
}
```

### Error Handling

Implement proper error handling for:

| Status Code | Description                                                     |
|-------------|-----------------------------------------------------------------|
| `400`       | Bad Request - Invalid request format or missing required fields |
| `401`       | Unauthorized - Invalid or missing API key                       |
| `429`       | Too Many Requests - Rate limit exceeded                         |
| `500`       | Internal Server Error - Server or provider error                |
| `502`       | Bad Gateway - Provider service unavailable                      |
| `503`       | Service Unavailable - Sorai service temporarily unavailable     |

## Monitoring and Debugging

### Prometheus Metrics

Access metrics during development:

```bash
curl http://localhost:8000/metrics
```

Key metrics to monitor:
- Request counts by provider, model, and status
- Request latency histograms
- Token usage statistics
- Error rates and types
- Connection pool statistics

### Logging

Configure logging levels in `config.toml`:

```toml
[logging]
show_timestamp = true
level = "debug"  # trace, debug, info, warn, error
log_directory = "./logs"
rotation = "daily"
show_module = true
```

### Debugging Tips

1. Use `RUST_LOG=debug` for detailed logging
2. Check the `/metrics` endpoint for performance issues
3. Monitor log files in the `./logs` directory
4. Use `cargo check` frequently during development
5. Test with multiple providers to ensure compatibility
6. Use the `debug` subcommand to inspect configuration values

## Getting Help

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/riipandi/sorai/issues)
- **GitHub Discussions**: [Join the conversation](https://github.com/riipandi/sorai/discussions)
- **Code Review**: Request reviews on your pull requests

---

Thank you for contributing to Sorai! 🚀

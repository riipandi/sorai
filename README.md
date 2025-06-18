# Sorai LLM Proxy Gateway

[![GitHub Release](https://img.shields.io/github/v/release/riipandi/sorai?logo=docker)](https://github.com/riipandi/sorai/releases)
[![MSRV](https://img.shields.io/badge/rust-v1.87+-orange.svg?logo=rust&label=Rust)](https://www.rust-lang.org)
[![Dependencies](https://deps.rs/repo/github/riipandi/sorai/status.svg)](https://deps.rs/repo/github/riipandi/sorai)
![License: MIT/Apache-2.0](https://img.shields.io/badge/License-MIT%20or%20Apache%202.0-blue.svg)
[![Contribution](https://img.shields.io/badge/Contribute-GitHub-brightgreen)](https://github.com/riipandi/sorai/graphs/contributors)
<!-- ![Build Status](https://img.shields.io/github/actions/workflow/status/riipandi/sorai/ci.yml?branch=main) -->

Sorai provides a unified HTTP API for tapping into multiple AI model providers. Built in Rust as a lightweight,
high-performance open-source LLM proxy gateway. Acting as the central orchestrator, Sorai handles every request
and response with precision. With uniform endpoints for text and chat completions, smart fallback logic, and
full observability, Sorai transforms client-to-LLM interactions into a seamless, elegantly managed experience.

## Key Features

- **🚀 High Performance**: Leverages Rust's speed and memory safety for low-latency, high-throughput proxying.
- **🔌 Multi-Provider Support**: Seamlessly connects to OpenAI, Anthropic, AWS Bedrock, Cohere, etc.
- **⚡ Flexible Integration**: Minimal configuration required for various LLM backends.
- **📊 Built-in Monitoring**: Prometheus metrics and comprehensive observability.
- **🛠️ Developer-Friendly**: Simple setup, clear documentation, and extensible design.
- **🔄 Fallback Support**: Automatic failover between providers for reliability.
- **🌐 CORS Support**: Configurable Cross-Origin Resource Sharing.
- **📝 Structured Logging**: Configurable logging with rotation and timestamps.
- **🐳 Docker Ready**: Container support with multi-platform builds.
- **📈 Scalable Architecture**: Connection pooling and request timeout handling.
- **📝 Open Source**: Dual-licensed under MIT and Apache 2.0 for maximum flexibility.

## Supported Providers

| Provider         | Key         | Configuration Section | Status |
|------------------|-------------|-----------------------|--------|
| OpenAI           | `openai`    | `[openai]`            | ✅      |
| Anthropic        | `anthropic` | `[anthropic]`         | ⏳      |
| Azure OpenAI     | `azure`     | `[azure_openai]`      | ⏳      |
| AWS Bedrock      | `bedrock`   | `[bedrock]`           | ⏳      |
| Cohere           | `cohere`    | `[cohere]`            | ⏳      |
| Google Vertex AI | `vertex`    | `[vertext]`           | ⏳      |

## Getting Started

### Prerequisites

- **Rust**: Ensure you have Rust installed (version 1.87 or later). Install via [rustup](https://rustup.rs/)
- **Git**: Required to clone the repository
- **API Keys**: Valid API keys for your chosen LLM providers
- **Optional**: Docker for containerized deployment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/riipandi/sorai.git && cd sorai
```

2. Build the project:
```bash
# Using cargo directly
cargo build --release

# Or using just (recommended)
just build
```

3. Set up configuration:
```bash
# Copy example configuration
cp config.toml.example config.toml

# Edit with your API keys and settings
nano config.toml
```

### Configuration

Create your `config.toml` file based on the [`config.toml.example`](./config.toml.example)

### Running the Server

```bash
# Using cargo
cargo run -- serve

# Using just (with auto-reload for development)
just dev

# Using built binary
./target/release/sorai serve

# With custom config path
./target/release/sorai serve -config /path/to/config.toml
```

## API Endpoints

Sorai provides OpenAI-compatible API endpoints:

- `POST /v1/chat/completions` - Chat completions with conversation context
- `POST /v1/text/completions` - Simple text completions
- `GET /metrics` - Prometheus metrics for monitoring

### Base URL

```
http://localhost:8000
```

## Documentation

For detailed documentation, see:
- **[HTTP Transport Documentation](./docs/http-transport.md)** - Complete API reference
- **[OpenAPI Specification](./docs/openapi.json)** - Machine-readable API spec
- **[Example Requests](./docs/xh-requests.md)** - Sample requests using [xh](https://github.com/ducaale/xh)

## Monitoring

Sorai provides comprehensive monitoring through Prometheus metrics at `/metrics` endpoint, including:
- Request counts by provider, model, and status
- Request latency histograms
- Token usage statistics
- Error rates and types
- Connection pool statistics

## Docker Support

Sorai includes full Docker support with multi-platform builds:

```bash
# Build Docker image
just docker-build

# Run with Docker
just docker-run serve

# Using Docker Compose
just compose-up
```

## Contributing

We welcome contributions to make Sorai even better!

- Read our **[Contributing Guidelines](./CONTRIBUTING.md)** for detailed guidelines
- Fork the repository and create a feature branch
- Submit a pull request with a clear title and description
- Join the discussion on [GitHub Issues](https://github.com/riipandi/sorai/issues)

Join the flow. Amplify your AI stack with Sorai! 🚀

## Why "Sorai"?

Inspired from Indonesian term for *"joyous uproar"*, Sorai captures the essence of lively
connection. More than just a proxy, it's a seamless bridge that elevates your AI workflows
with speed and reliability.

## License

Sorai is licensed under either of [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0)
or [MIT license](https://choosealicense.com/licenses/mit).

You may choose either license for your use case.

> Unless you explicitly state otherwise, any contribution intentionally submitted
> for inclusion in this project by you, as defined in the Apache-2.0 license, shall
> be dual licensed as above, without any additional terms or conditions.

Copyrights in this project are retained by their contributors.

See the [LICENSE-APACHE](./LICENSE-APACHE) and [LICENSE-MIT](./LICENSE-MIT) files
for more information.

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).</sub>

[![Made by](https://badgen.net/badge/icon/Made%20by%20Aris%20Ripandi?icon=cocoapods&label&color=black&labelColor=black)](https://twitter.com/intent/follow?screen_name=riipandi)

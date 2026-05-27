# Sorai LLM Proxy Gateway

[![GitHub Release](https://img.shields.io/github/v/release/riipandi/sorai?logo=docker)](https://github.com/riipandi/sorai/releases)
[![MSRV](https://img.shields.io/badge/rust-v1.95+-orange.svg?logo=rust&label=Rust)](https://www.rust-lang.org)
[![Dependencies](https://deps.rs/repo/github/riipandi/sorai/status.svg)](https://deps.rs/repo/github/riipandi/sorai)
![License Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Contribution](https://img.shields.io/badge/Contribute-GitHub-brightgreen)](https://github.com/riipandi/sorai/graphs/contributors)
<!-- ![Build Status](https://img.shields.io/github/actions/workflow/status/riipandi/sorai/ci.yml?branch=main) -->

Sorai is an open-source, unified HTTP API gateway for accessing multiple AI model providers. Built in Rust
as a resource-efficient, high-performance open-source LLM proxy, Sorai acts as a central orchestrator,
handling every request and response with precision. It delivers uniform endpoints for text and chat
completions, intelligent fallback logic, and complete observability, transforming client-to-LLM interactions
into a seamless, elegantly managed experience.

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
- **📝 Open Source**: Licensed under Apache 2.0.

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

- **Rust**: Ensure you have Rust installed (version 1.95 or later). Install via [rustup](https://rustup.rs/)
- **Git**: Required to clone the repository
- **API Keys**: Valid API keys for your chosen LLM providers
- **Optional**: Docker for containerized deployment

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd sorai
```

2. Build the project:
```sh
# Using cargo directly
cargo build --release

# Or using just (recommended)
just build
```

3. Set up configuration:
```sh
# Copy example configuration
cp config.toml.example config.toml

# Edit with your API keys and settings
nano config.toml
```

### Configuration

Create your `config.toml` file based on the [`config.toml.example`](./config.toml.example)

### Running the Server

```sh
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

## Performance Benchmarks

Here are example benchmarks using [bombardier](https://github.com/codesenberg/bombardier) HTTP benchmarking tool:

### Health Check Endpoint Performance

**Test Configuration:**
- **Concurrent connections**: 125
- **Number of requests**: 100,000
- **Target endpoint**: `GET /healthz`
- **Environment**: local development server

```sh
bombardier -c 125 -n 100000 -m GET http://localhost:8000/healthz
```

**Example Results:**
```
Statistics        Avg      Stdev        Max
  Reqs/sec     35160.01    8333.65   46008.85
  Latency        3.55ms     2.04ms    44.74ms
  HTTP codes:
    1xx - 0, 2xx - 100000, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    16.64MB/s
```

### Load Testing Different Scenarios

```sh
# Light load - 50 concurrent connections, 1000 requests
bombardier -n 1000 -c 50 http://localhost:8000/healthz

# Medium load - 100 concurrent connections, 2500 requests with 10s duration
bombardier -d 10s -n 2500 -c 100 http://localhost:8000/healthz

# Heavy load - 500 concurrent connections, 10000 requests
bombardier -d 10s -n 10000 -c 500 http://localhost:8000/healthz

# Sustained load test - 30 seconds duration
bombardier -c 100 -d 30s http://localhost:8000/healthz
```

### API Endpoint Benchmarks

For testing actual LLM proxy endpoints:

```sh
# Test chat completions endpoint (requires valid API key)
bombardier -n 100 -c 10 -m POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -b '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}' \
  http://localhost:8000/v1/chat/completions
```

**Performance Notes:**
- Actual LLM endpoints performance depends on upstream provider latency
- Connection pooling and keep-alive significantly improve throughput
- Memory usage remains stable under high concurrent load

## Documentation

For detailed documentation, see:
- **[HTTP Transport Documentation](./docs/http-transport.md)** - Complete API reference
- **[OpenAPI Specification](./docs/openapi.json)** - Machine-readable API spec
- **[Example Requests](./specs)** - Sample requests using [httl](https://httl.dev)

## Monitoring

Sorai provides comprehensive monitoring through Prometheus metrics at `/metrics` endpoint, including:
- Request counts by provider, model, and status
- Request latency histograms
- Token usage statistics
- Error rates and types
- Connection pool statistics

## Docker Support

Sorai includes full Docker support with multi-platform builds:

```sh
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

Join the flow. Amplify your your AI-powered applications with Sorai! 🚀

## Why "Sorai"?

Inspired from Indonesian term for *"joyous uproar"*, Sorai captures the essence of lively connection.
More than just a proxy, it's a seamless bridge that elevates your AI workflows with speed and reliability.

## License

Sorai is licensed under the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0).
See the [LICENSE](./LICENSE) file for more information.

> Unless you explicitly state otherwise, any contribution intentionally submitted
> for inclusion in this project by you shall be licensed under the Apache License 2.0,
> without any additional terms or conditions.

Copyrights in this project are retained by their contributors.

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).</sub>

[![Made by](https://badgen.net/badge/icon/Made%20by%20Aris%20Ripandi?icon=cocoapods&label&color=black&labelColor=black)](https://x.com/intent/follow?screen_name=riipandi)

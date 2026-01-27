# Sorai LLM Proxy Gateway

[![GitHub Release](https://img.shields.io/github/v/release/riipandi/sorai?logo=docker)](https://github.com/riipandi/sorai/releases)
[![MSRV](https://img.shields.io/badge/rust-v1.93+-orange.svg?logo=rust&label=Rust)](https://www.rust-lang.org)
[![Dependencies](https://deps.rs/repo/github/riipandi/sorai/status.svg)](https://deps.rs/repo/github/riipandi/sorai)
![License Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
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

- **Rust**: Ensure you have Rust installed (version 1.93 or later). Install via [rustup](https://rustup.rs/)
- **Git**: Required to clone the repository
- **API Keys**: Valid API keys for your chosen LLM providers
- **Optional**: Docker for containerized deployment

### Installation

1. Clone the repository:
```sh
git clone https://github.com/riipandi/sorai.git && cd sorai
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

Here are example benchmarks using [oha](https://github.com/hatoo/oha) HTTP load generator:

### Health Check Endpoint Performance

**Test Configuration:**
- **Concurrent Users**: 100
- **Total Requests**: 2,500
- **Target**: `GET /healthz`
- **Environment**: local development server

```sh
oha -n 2500 -c 100 --latency-correction http://localhost:8000/healthz
```

**Example Results:**
```
Summary:
  Success rate: 100.00%
  Total:        0.0886 secs
  Slowest:      0.0078 secs
  Fastest:      0.0001 secs
  Average:      0.0034 secs
  Requests/sec: 28203.6793

  Total data:   183.11 KiB
  Size/request: 75 B
  Size/sec:     2.02 MiB

Response time histogram:
  0.000 [1]   |
  0.001 [103] |■■■■■■
  0.002 [225] |■■■■■■■■■■■■■
  0.002 [308] |■■■■■■■■■■■■■■■■■■
  0.003 [453] |■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.004 [539] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.005 [442] |■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.005 [244] |■■■■■■■■■■■■■■
  0.006 [130] |■■■■■■■
  0.007 [45]  |■■
  0.008 [10]  |
```

### Load Testing Different Scenarios

```sh
# Light load - 50 concurrent users, 1000 requests
oha -n 1000 -c 50 http://localhost:8000/healthz

# Medium load - 100 concurrent users, 2500 requests with 10s duration
oha -z 10s -n 2500 -c 100 http://localhost:8000/healthz

# Heavy load - 500 concurrent users, 10000 requests
oha -z 10s -n 10000 -c 500 http://localhost:8000/healthz

# Sustained load test - 30 seconds duration
oha -c 100 -z 30s http://localhost:8000/healthz
```

### API Endpoint Benchmarks

For testing actual LLM proxy endpoints:

```sh
# Test chat completions endpoint (requires valid API key)
oha -n 100 -c 10 -m POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}' \
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

Inspired from Indonesian term for *"joyous uproar"*, Sorai captures the essence of lively
connection. More than just a proxy, it's a seamless bridge that elevates your AI workflows
with speed and reliability.

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

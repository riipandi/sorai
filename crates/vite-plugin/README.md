# Vite Plugin Axum

A library for integrating Vite development server with Axum web framework.

## Features

- **Development Proxy**: Proxies requests to Vite dev server during development with HMR support
- **Zero Configuration**: Automatically detects `vite.config.ts` and starts Vite server
- **Production Ready**: No overhead in production builds
- **Flexible**: Configurable port, working directory, and log levels

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
vite-axum = { path = "../crates/vite-axum" }
```

## Basic Usage

```rust
use anyhow::Result;
use axum::{Router, routing::get};
use vite_axum::{ViteAppFactory, ProxyViteOptions, start_vite_server, create_vite_state};

#[tokio::main]
async fn main() -> Result<()> {
    #[cfg(debug_assertions)]
    {
        ProxyViteOptions::new()
            .port(5173)
            .build()?;

        #[allow(clippy::zombie_processes)]
        start_vite_server()?;
    }

    let options = ProxyViteOptions::global();
    let vite_state = create_vite_state(options.port.unwrap_or(5173));

    let app = Router::new()
        .route("/api/health", get(|| async { "OK" }))
        .configure_vite(vite_state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    println!("Server running at http://127.0.0.1:8080/");

    axum::serve(listener, app).await?;

    Ok(())
}
```

## Configuration

### ProxyViteOptions

Configure Vite integration behavior:

```rust
use vite_axum::ProxyViteOptions;
use log::Level;

ProxyViteOptions::new()
    .port(5173)                    // Vite server port
    .working_directory("./frontend") // Vite working directory
    .log_level(Level::Debug)       // Log level for Vite output
    .disable_logging()             // Disable Vite logging
    .build()?;
```

### Options

- `port(u16)` - Set Vite server port (default: auto-detect)
- `working_directory(str)` - Set Vite working directory (default: auto-detect `vite.config.ts`)
- `log_level(Level)` - Set logging level (default: Debug)
- `disable_logging()` - Disable all Vite logging
- `build()` - Initialize and store global configuration

## API Reference

### `ViteAppFactory` Trait

Extends `axum::Router` with Vite proxy configuration:

```rust
pub trait ViteAppFactory {
    fn configure_vite(self, state: ViteProxyState) -> Self;
}
```

### `start_vite_server()`

Starts the Vite development server:

```rust
pub fn start_vite_server() -> anyhow::Result<std::process::Child>
```

Automatically:
- Finds Vite executable using `which` or `where`
- Detects and updates port from Vite output
- Spawns background logging thread

### `create_vite_state()`

Creates state for Axum router:

```rust
pub fn create_vite_state(port: u16) -> ViteProxyState
```

### `proxy_to_vite()`

Axum handler that proxies requests to Vite server:

```rust
pub async fn proxy_to_vite(
    State(state): State<ViteProxyState>,
    req: Request,
) -> Result<Response, StatusCode>
```

## Routes Configured

When using `.configure_vite()`, these routes are added in debug mode:

- `/{file:.*}` - Proxy all file requests
- `/node_modules/{file:.*}` - Proxy npm modules

## How It Works

**Development Mode (`debug_assertions`):**
1. Starts Vite dev server as child process
2. Captures Vite output to detect port
3. Proxies requests to `http://localhost:<port>`
4. Enables HMR and Vite features

**Production Mode:**
- No Vite server starts
- No proxy configuration added
- Serves embedded static assets directly

## Credits

This library is a port of [vite-actix](https://github.com/Drew-Chase/vite-actix) by [Drew Chase](https://github.com/Drew-Chase), adapted for the Axum web framework.

**Original Author:** Drew Chase
**Axum Port:** Aris Ripandi

## License

This library is licensed under the GNU General Public License v3.0.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

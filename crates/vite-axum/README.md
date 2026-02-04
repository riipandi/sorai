# vite-axum

A library for seamlessly integrating Vite development server with Axum web framework.

This is a port of [vite-actix](https://github.com/Drew-Chase/vite-actix) adapted for the Axum ecosystem.

## Features

- **Development Proxy**: Proxies requests to Vite dev server with HMR (Hot Module Replacement) support
- **Smart Detection**: Automatically finds Vite in `node_modules`, package managers, or global installation
- **Zero Configuration**: Auto-detects `vite.config.ts` and working directory
- **Production Ready**: Zero overhead in release builds
- **Flexible**: Configurable port, working directory, log levels, and custom Vite paths

## Key Differences from vite-actix

| Feature                | vite-actix            | vite-axum                                     |
|------------------------|-----------------------|-----------------------------------------------|
| **Framework**          | Actix Web 4+          | Axum 0.7+                                     |
| **Async Runtime**      | Tokio (built-in)      | Tokio (required)                              |
| **HTTP Client**        | awc                   | hyper-util                                    |
| **State Management**   | Actix web state       | Axum state extraction                         |
| **Router Integration** | Trait-based           | Function-based (`create_vite_router()`)       |
| **Thread Safety**      | Sync mutex            | OnceLock + Mutex                              |
| **Vite Detection**     | Basic `which`/`where` | Multi-strategy with package manager detection |

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
vite-axum = "0.1"
tokio = { version = "1", features = ["full"] }
# For logging (optional)
log = "0.4"
tracing = "0.1"
```

## Quick Start

### Basic Example

```rust
use anyhow::Result;
use axum::{Router, routing::get};
use vite_axum::{ProxyViteOptions, start_vite_server};
use vite_axum::proxy_to_vite;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt::init();

    #[cfg(debug_assertions)]
    {
        // Configure Vite integration
        ProxyViteOptions::new()
            .port(5173)              // Vite dev server port
            .working_directory(".")  // Directory with vite.config.ts
            .log_level(log::Level::Debug)
            .build()?;

        // Start Vite dev server
        #[allow(clippy::zombie_processes)]
        start_vite_server()?;
    }

    // Build router with Vite proxy in debug mode
    let app = Router::new()
        .route("/api/health", get(|| async { "OK" }))
        .nest("/ui", Router::new()
            .route("/", get(proxy_to_vite))
            .route("/{*path}", get(proxy_to_vite))
        );

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("🚀 Server running at http://127.0.0.1:3000");

    axum::serve(listener, app).await?;

    Ok(())
}
```

## Advanced Usage

### With Custom Configuration and Auto-Restart

```rust
use anyhow::Result;
use axum::{Router, routing::{get, post}};
use log::{error, info, LevelFilter};
use tokio::signal;
use vite_axum::{ProxyViteOptions, start_vite_server};
use vite_axum::proxy_to_vite;

#[cfg(debug_assertions)]
fn spawn_vite_server() {
    use std::thread;

    thread::spawn(move || {
        loop {
            info!("🔥 Starting Vite server in development mode...");

            match start_vite_server() {
                Ok(mut child) => {
                    // Wait for Vite process to exit
                    match child.wait() {
                        Ok(status) => {
                            if status.success() {
                                info!("✅ Vite server exited cleanly");
                                break;
                            } else {
                                error!("💥 Vite server crashed! Restarting in 2 seconds...");
                                std::thread::sleep(std::time::Duration::from_secs(2));
                                continue;
                            }
                        }
                        Err(e) => {
                            error!("❌ Failed to wait for Vite server: {}", e);
                            std::thread::sleep(std::time::Duration::from_secs(2));
                            continue;
                        }
                    }
                }
                Err(e) => {
                    error!("❌ Failed to start Vite server: {}", e);
                    error!("   Make sure Vite is installed: npm install -D vite");
                    std::thread::sleep(std::time::Duration::from_secs(5));
                    continue;
                }
            }
        }
    });
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logger
    env_logger::builder()
        .filter_level(LevelFilter::Debug)
        .format_timestamp(None)
        .init();

    #[cfg(debug_assertions)]
    {
        ProxyViteOptions::new()
            .port(8779)
            .working_directory("./examples/wwwroot/")
            .log_level(log::Level::Debug)
            .build()?;

        spawn_vite_server();
    }

    // Create router
    let app = Router::new()
        // API routes
        .route("/api/ping", get(|| async { "pong" }))
        .route("/api/data", post(async || { "{\"status\":\"ok\"}" }))
        // Vite dev server proxy (debug mode only)
        .nest("/ui", Router::new()
            .route("/", get(proxy_to_vite))
            .route("/{*path}", get(proxy_to_vite))
        );

    // Start server with graceful shutdown
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    println!("🚀 Server running at http://127.0.0.1:8080");
    println!("   API:  http://127.0.0.1:8080/api/*");
    println!("   UI:   http://127.0.0.1:8080/ui/*");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    println!("👋 Server shutdown complete");
    Ok(())
}

async fn shutdown_signal() {
    use tokio::signal;

    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            println!();
        }
        _ = terminate => {
            println!();
        }
    }
}
```

### With Environment Variables

```bash
# Override Vite executable path
export VITE_PATH=/custom/path/to/vite

# Set custom port for Vite
export VITE_PORT=9000

# Run your application
cargo run
```

### Conditional Compilation for Production

```rust
#[cfg(debug_assertions)]
{
    use vite_axum::{ProxyViteOptions, start_vite_server};

    ProxyViteOptions::new().build()?;
    start_vite_server()?;

    let app = Router::new()
        .nest("/ui", vite_axum::create_vite_router());
}

#[cfg(not(debug_assertions))]
{
    use rust_embed::RustEmbed;

    #[derive(RustEmbed)]
    #[folder = "./dist"]
    struct Assets;

    // Serve embedded assets
    let app = Router::new()
        .nest("/ui", serve_embedded_assets());
}
```

## Configuration

### ProxyViteOptions

Configure Vite integration behavior:

```rust
use vite_axum::ProxyViteOptions;
use log::Level;

ProxyViteOptions::new()
    .port(5173)                        // Vite server port
    .working_directory("./frontend")   // Vite working directory
    .log_level(Level::Debug)           // Log level for Vite output
    .disable_logging()                 // Disable Vite logging
    .build()?;
```

**Options:**

| Method                   | Type              | Default     | Description                     |
|--------------------------|-------------------|-------------|---------------------------------|
| `port(u16)`              | `u16`             | Auto-detect | Vite dev server port            |
| `working_directory(str)` | `impl AsRef<str>` | Auto-detect | Directory with `vite.config.ts` |
| `log_level(Level)`       | `log::Level`      | `Debug`     | Vite output log level           |
| `disable_logging()`      | -                 | -           | Disable all Vite logging        |
| `build()`                | -                 | -           | Initialize global configuration |

### Vite Detection Strategy

The plugin automatically detects Vite in this order:

1. **VITE_PATH** - Environment variable override
2. **node_modules/.bin/vite** - Local installation (highest priority)
3. **Package Managers** - Auto-detect and execute:
   - `pnpm exec vite`
   - `yarn vite`
   - `bun vite`
   - `npm exec vite`
   - `npx vite`
4. **Global Installation** - `which vite` / `where vite`

### Environment Variables

| Variable    | Description                          | Example                           |
|-------------|--------------------------------------|-----------------------------------|
| `VITE_PATH` | Full path to Vite executable         | `/path/to/node_modules/.bin/vite` |
| `VITE_PORT` | Port override (via ProxyViteOptions) | `9000`                            |

## API Reference

### `start_vite_server()`

Starts the Vite development server as a child process.

```rust
pub fn start_vite_server() -> anyhow::Result<std::process::Child>
```

**Features:**
- Multi-strategy Vite detection
- Captures and logs Vite output
- Auto-detects port from Vite startup logs
- Background logging with tokio channels

### `proxy_to_vite()`

Axum handler that proxies requests to the Vite dev server.

```rust
pub async fn proxy_to_vite(req: Request) -> Result<Response, StatusCode>
```

**Features:**
- Forwards all HTTP methods and headers
- Buffers request/response bodies
- Enforces 1GB payload limit
- Streams responses back to client

### `create_vite_router()`

Creates a pre-configured Axum router for Vite proxy.

```rust
pub fn create_vite_router() -> Router
```

**Routes:**
- `/{file:.*}` - Catch-all for files
- `/node_modules/{file:.*}` - NPM modules

### `ProxyViteOptions`

Configuration builder for Vite integration.

```rust
pub struct ProxyViteOptions {
    pub port: Option<u16>,
    pub working_directory: String,
    pub log_level: Option<log::Level>,
}
```

## Routes

When using `create_vite_router()` or `proxy_to_vite`:

- `/{file:.*}` → Proxies all file requests to Vite
- `/node_modules/{file:.*}` → Proxies npm modules to Vite
- Any path → Falls back to Vite's handling (SPA routing)

## How It Works

### Development Mode (`debug_assertions`)

1. Detects Vite executable using multi-strategy approach
2. Spawns Vite as child process with configured port
3. Captures stdout to detect actual port and log output
4. Proxies all unmatched requests to Vite dev server
5. Enables HMR, React Fast Refresh, and other Vite features

### Production Mode (Release Build)

- ❌ No Vite server starts
- ❌ No proxy overhead
- ✅ Use with `rust-embed` for embedded static assets
- ✅ Single binary deployment

## Project Structure

```
your-app/
├── Cargo.toml
├── src/
│   └── main.rs
├── frontend/
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
└── target/
```

**Recommended workflow:**

```bash
# Terminal 1: Backend (with Vite auto-start)
cd your-app
cargo run

# Terminal 2: Frontend (optional, for other tools)
cd frontend
npm run dev  # If not using auto-start
```

## Comparison: vite-actix vs vite-axum

### vite-actix Example

```rust
use actix_web::{App, web};
use vite_actix::ViteAppFactory;

let app = App::new()
    .route("/api/", web::get().to(HttpResponse::Ok))
    .configure_vite(); // ✅ Trait-based
```

### vite-axum Example

```rust
use axum::Router;
use vite_axum::proxy_to_vite;

let app = Router::new()
    .route("/api/", get(|| async { "OK" }))
    .nest("/ui", Router::new()
        .route("/", get(proxy_to_vite))
        .route("/{*path}", get(proxy_to_vite))
    ); // ✅ Function-based, more explicit
```

**Key Differences:**
- **Framework**: Axum uses Tower middleware stack vs Actix's middleware system
- **Async**: Axum requires `#[tokio::main]` vs Actix's `#[actix_web::main]`
- **State**: Axum uses `State<T>` extractor vs Actix's app data
- **Routing**: Axum's `Router::nest()` vs Actix's `.configure()`
- **Detection**: vite-axum has smarter package manager detection

## Credits

This library is a port of [vite-actix](https://github.com/Drew-Chase/vite-actix) by Drew Chase,
adapted for the Axum web framework.

- **Original Author:** [Drew Chase](https://github.com/Drew-Chase)
- **Axum Port:** [Aris Ripandi](https://github.com/riipandi)

## License

This library is licensed under the GNU General Public License v3.0.

> This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

> You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

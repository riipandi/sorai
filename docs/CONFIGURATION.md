# Sorai Application Configuration

Sorai uses environment variables for configuration. You can set these variables in a `.env` file or pass them directly to the system environment.

## CLI Flags

| Flag                | Description                                              | Example                      |
|---------------------|----------------------------------------------------------|------------------------------|
| `--env-file <FILE>` | Load environment variables from a custom file            | `--env-file .env.production` |
| `--data-dir <DIR>`  | Set the data directory for application data (logs, etc.) | `--data-dir /var/lib/sorai`  |
| `--host <HOST>`     | Override server host (only in `serve` command)           | `--host 0.0.0.0`             |
| `--port <PORT>`     | Override server port (only in `serve` command)           | `--port 8000`                |

## Server Configuration

| Variable | Default   | Description         | Required |
|----------|-----------|---------------------|----------|
| `HOST`   | `0.0.0.0` | Server host address | No       |
| `PORT`   | `8000`    | Server port         | No       |

## Application Configuration

| Variable                         | Default       | Description                                      | Required |
|----------------------------------|---------------|--------------------------------------------------|----------|
| `SORAI_APP_MODE`                 | `development` | Application mode (`development` or `production`) | No       |
| `SORAI_APP_SECRET_KEY`           | -             | Secret key for application encryption            | Yes*     |
| `SORAI_JWT_SECRET_KEY`           | -             | Secret key for JWT token encryption              | Yes*     |
| `SORAI_JWT_ACCESS_TOKEN_EXPIRY`  | `900`         | JWT access token expiry time in seconds          | No       |
| `SORAI_JWT_REFRESH_TOKEN_EXPIRY` | `7200`        | JWT refresh token expiry time in seconds         | No       |

*Required in production mode

## Logging Configuration

| Variable                       | Default | Description                                                  | Required |
|--------------------------------|---------|--------------------------------------------------------------|----------|
| `SORAI_LOG_LEVEL`              | `info`  | Log level: `trace`, `debug`, `info`, `warn`, `error`, `none` | No       |
| `SORAI_LOG_SHOW_TIMESTAMP`     | `true`  | Show timestamp in logs                                       | No       |
| `SORAI_LOG_ROTATION`           | `daily` | Log rotation: `daily`, `hourly`, `none`                      | No       |
| `SORAI_LOG_SHOW_MODULE`        | `true`  | Show module name in logs                                     | No       |
| `SORAI_LOG_REQUEST_SAMPLING`   | `100`   | Request sampling percentage (1-100)                          | No       |
| `SORAI_LOG_SLOW_REQUESTS_ONLY` | `false` | Only log slow requests                                       | No       |
| `SORAI_LOG_SLOW_THRESHOLD_MS`  | `1000`  | Slow request threshold in milliseconds                       | No       |
| `SORAI_LOG_ANALYTICS_MODE`     | `full`  | Analytics mode: `full`, `minimal`, `none`                    | No       |

**Note:** Log files are stored in `{data_dir}/logs` directory. Default `data_dir` is `./data`.

## CORS Configuration

| Variable                       | Default                                                                       | Description                                    | Required |
|--------------------------------|-------------------------------------------------------------------------------|------------------------------------------------|----------|
| `SORAI_CORS_ENABLED`           | `true`                                                                        | Enable CORS                                    | No       |
| `SORAI_CORS_ALLOW_ORIGINS`     | `*`                                                                           | Allowed origins (comma-separated, `*` for all) | No       |
| `SORAI_CORS_ALLOW_METHODS`     | `GET,POST,PUT,DELETE,HEAD,OPTIONS,PATCH`                                      | Allowed HTTP methods (comma-separated)         | No       |
| `SORAI_CORS_ALLOW_HEADERS`     | `accept,accept-language,authorization,content-type,user-agent,x-requested-id` | Allowed headers (comma-separated)              | No       |
| `SORAI_CORS_ALLOW_CREDENTIALS` | `false`                                                                       | Allow credentials                              | No       |
| `SORAI_CORS_MAX_AGE`           | `3600`                                                                        | Preflight cache max age in seconds             | No       |

## Database Configuration

| Variable                      | Default | Description                        | Required    |
|-------------------------------|---------|------------------------------------|-------------|
| `SORAI_DATABASE_URL`          | -       | Database connection URL            | Conditional |
| `SORAI_DATABASE_TOKEN`        | -       | Database authentication token      | Conditional |
| `SORAI_DATABASE_AUTO_MIGRATE` | `false` | Run database migrations on startup | No          |

## Session Configuration

| Variable                | Default    | Description                               | Required |
|-------------------------|------------|-------------------------------------------|----------|
| `SORAI_SESSION_STORAGE` | `database` | Session storage type: `database`, `redis` | No       |

## Mailer Configuration

| Variable               | Default               | Description                  | Required    |
|------------------------|-----------------------|------------------------------|-------------|
| `MAILER_FROM_EMAIL`    | `noreply@example.com` | Default sender email address | No          |
| `MAILER_FROM_NAME`     | `Sorai`               | Default sender name          | No          |
| `MAILER_SMTP_HOST`     | `localhost`           | SMTP server host             | No          |
| `MAILER_SMTP_PORT`     | `587`                 | SMTP server port             | No          |
| `MAILER_SMTP_USERNAME` | -                     | SMTP username                | Conditional |
| `MAILER_SMTP_PASSWORD` | -                     | SMTP password                | Conditional |
| `MAILER_SMTP_SECURE`   | `true`                | Use TLS/SSL for SMTP         | No          |

## Storage Configuration (S3-compatible)

| Variable                        | Default   | Description                        | Required    |
|---------------------------------|-----------|------------------------------------|-------------|
| `STORAGE_S3_ACCESS_KEY_ID`      | -         | S3 access key ID                   | Conditional |
| `STORAGE_S3_SECRET_ACCESS_KEY`  | -         | S3 secret access key               | Conditional |
| `STORAGE_S3_BUCKET_DEFAULT`     | -         | Default S3 bucket name             | Conditional |
| `STORAGE_S3_FORCE_PATH_STYLE`   | `true`    | Force path-style S3 URLs           | No          |
| `STORAGE_S3_PATH_PREFIX`        | -         | S3 path prefix for objects         | No          |
| `STORAGE_S3_ENDPOINT_URL`       | -         | Custom S3 endpoint URL             | Conditional |
| `STORAGE_S3_PUBLIC_URL`         | -         | Public URL for S3 objects          | No          |
| `STORAGE_S3_REGION`             | `auto`    | S3 region                          | No          |
| `STORAGE_S3_SIGNED_URL_EXPIRES` | `3600`    | Signed URL expiry time in seconds  | No          |
| `STORAGE_MAX_UPLOAD_SIZE`       | `5242880` | Maximum upload size in bytes (5MB) | No          |

## LLM Provider Configuration

### OpenAI

| Variable                   | Default | Description                                                          | Required |
|----------------------------|---------|----------------------------------------------------------------------|----------|
| `PROVIDER_OPENAI_API_KEY`  | -       | OpenAI API key                                                       | Yes*     |
| `PROVIDER_OPENAI_BASE_URL` | -       | Custom base URL for OpenAI API (for proxies or regional deployments) | No       |

### Anthropic

| Variable                      | Default | Description                                                             | Required |
|-------------------------------|---------|-------------------------------------------------------------------------|----------|
| `PROVIDER_ANTHROPIC_API_KEY`  | -       | Anthropic API key                                                       | Yes*     |
| `PROVIDER_ANTHROPIC_BASE_URL` | -       | Custom base URL for Anthropic API (for proxies or regional deployments) | No       |

### AWS Bedrock

| Variable                      | Default | Description                     | Required    |
|-------------------------------|---------|---------------------------------|-------------|
| `PROVIDER_BEDROCK_API_KEY`    | -       | AWS Bedrock API key             | Conditional |
| `PROVIDER_BEDROCK_ACCESS_KEY` | -       | AWS access key                  | Conditional |
| `PROVIDER_BEDROCK_BASE_URL`   | -       | Custom base URL for Bedrock API | No          |

### Cohere

| Variable                   | Default | Description                                                          | Required |
|----------------------------|---------|----------------------------------------------------------------------|----------|
| `PROVIDER_COHERE_API_KEY`  | -       | Cohere API key                                                       | Yes*     |
| `PROVIDER_COHERE_BASE_URL` | -       | Custom base URL for Cohere API (for proxies or regional deployments) | No       |

### Azure OpenAI

| Variable                         | Default | Description               | Required |
|----------------------------------|---------|---------------------------|----------|
| `PROVIDER_AZURE_OPENAI_API_KEY`  | -       | Azure OpenAI API key      | Yes*     |
| `PROVIDER_AZURE_OPENAI_ENDPOINT` | -       | Azure OpenAI endpoint URL | Yes*     |

### Google Vertex AI

| Variable                      | Default | Description                                            | Required |
|-------------------------------|---------|--------------------------------------------------------|----------|
| `PROVIDER_VERTEX_PROJECT_ID`  | -       | Google Cloud project ID                                | Yes*     |
| `PROVIDER_VERTEX_CREDENTIALS` | -       | Path to service account JSON credentials               | Yes*     |
| `PROVIDER_VERTEX_BASE_URL`    | -       | Custom base URL for Vertex AI (for regional endpoints) | No       |

*Required if using the provider

## Priority Order

Configuration is loaded in the following priority order (highest to lowest):

1. **CLI flags** (`--host`, `--port`, `--data-dir`)
2. **`--env-file`** if provided
3. **`.env`** file in current directory (auto-detected)
4. **System environment variables**
5. **Default values**

## Examples

### Development Setup

```bash
# .env file
HOST=127.0.0.1
PORT=8000
SORAI_LOG_LEVEL=debug
PROVIDER_OPENAI_API_KEY=sk-your-key-here
```

```bash
# Run with default config
cargo run -- serve

# Run with custom data directory
cargo run -- --data-dir /var/lib/sorai serve

# Run with custom port
cargo run -- serve --port 3000
```

### Production Setup

```bash
# .env.production file
HOST=0.0.0.0
PORT=8000
SORAI_APP_MODE=production
SORAI_APP_SECRET_KEY=your-secure-secret-key
SORAI_JWT_SECRET_KEY=your-jwt-secret-key
SORAI_LOG_LEVEL=info
SORAI_LOG_ROTATION=daily
PROVIDER_OPENAI_API_KEY=sk-prod-key-here
PROVIDER_ANTHROPIC_API_KEY=sk-ant-prod-key-here
```

```bash
# Run with production config
cargo run -- --env-file .env.production serve
```

### Custom Data Directory

```bash
# Store all data in custom location
cargo run -- --data-dir /opt/sorai/data serve

# This will create logs at /opt/sorai/data/logs
```

## Environment File Format

Create a `.env` file in the project root or specify a custom file using `--env-file`:

```bash
# Server
HOST=0.0.0.0
PORT=8000

# App
SORAI_APP_MODE=development
SORAI_APP_SECRET_KEY=change-me-in-production

# Logging
SORAI_LOG_LEVEL=info
SORAI_LOG_ROTATION=daily

# Providers
PROVIDER_OPENAI_API_KEY=sk-...
PROVIDER_ANTHROPIC_API_KEY=sk-ant-...
```

## Debug Configuration

To view the current configuration:

```bash
cargo run -- debug
```

This will display all active configuration values, including defaults and loaded values from environment variables.

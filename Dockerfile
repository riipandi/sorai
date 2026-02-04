# syntax=docker/dockerfile:1.7

# Arguments with default value (for build).
# Platform options: linux/amd64 or linux/arm64
ARG DISTROLESS_TAG=nonroot
ARG PLATFORM=linux/amd64
ARG RUST_VERSION=1.93
ARG NODE_VERSION=24

# -----------------------------------------------------------------------------
# Build the frontend application
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} node:${NODE_VERSION}-trixie-slim AS nodejs
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 COREPACK_INTEGRITY_KEYS=0 PNPM_HOME="/pnpm"
ENV CI=true LEFTHOOK=0 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /usr/src

# Copy the source files
COPY --chown=node:node . .

# Install dependencies and build the application.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install \
    --ignore-scripts --frozen-lockfile --stream \
    && NODE_ENV=production pnpm run build

# -----------------------------------------------------------------------------
# Base image for building the Rust application
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} rust:${RUST_VERSION}-slim-trixie AS base

# Install system dependencies (optional tools for building and debugging)
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update -y \
    && apt-get -yqq --no-install-recommends install build-essential curl jq \
       inotify-tools pkg-config libssl-dev git unzip ca-certificates gnupg \
    && update-ca-certificates

# Add tini for signal handling and zombie reaping
RUN set -eux; \
    TINI_DOWNLOAD_URL="https://github.com/krallin/tini/releases/download/v0.19.0" \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
      amd64|x86_64) TINI_BIN_URL="${TINI_DOWNLOAD_URL}/tini" ;; \
      arm64|aarch64) TINI_BIN_URL="${TINI_DOWNLOAD_URL}/tini-arm64" ;; \
      *) echo "unsupported architecture: ${ARCH}"; exit 1 ;; \
    esac; \
    curl -fsSL "${TINI_BIN_URL}" -o /usr/bin/tini; \
    chmod +x /usr/bin/tini

WORKDIR /usr/src

# -----------------------------------------------------------------------------
# Install dependencies and build the application.
# -----------------------------------------------------------------------------
FROM base AS builder

COPY --from=nodejs /usr/src /usr/src

RUN --mount=type=cache,id=cargo-cache,target=/usr/local/cargo/registry \
    --mount=type=cache,id=cargo-build,target=/usr/src/target cargo build \
    --release --locked && strip -s target/release/sorai \
    && mv target/release/sorai . && chmod +x sorai

# Create the logs directory and set permissions. We need to allow "others" access
# to app folder, because Docker container can be started with arbitrary uid.
RUN mkdir -p /data/logs && chmod ugo+rw -R /data/logs

# -----------------------------------------------------------------------------
# Use the slim image for a lean production container.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} gcr.io/distroless/cc-debian13:${DISTROLESS_TAG} AS runner
# FROM --platform=${PLATFORM} dhi.io/debian-base:trixie AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/sorai"
LABEL org.opencontainers.image.documentation="https://github.com/riipandi/sorai"
LABEL org.opencontainers.image.description="Fast LLM gateway written in Rust"
LABEL org.opencontainers.image.authors="Aris Ripandi"
LABEL org.opencontainers.image.vendor="Aris Ripandi"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# App Configuration
ARG SORAI_APP_MODE=production
ARG SORAI_APP_SECRET_KEY
ARG SORAI_JWT_SECRET_KEY
ARG SORAI_JWT_ACCESS_TOKEN_EXPIRY=900
ARG SORAI_JWT_REFRESH_TOKEN_EXPIRY=7200
ARG SORAI_SESSION_STORAGE=database

# Logging Configuration
ARG SORAI_LOG_LEVEL=info
ARG SORAI_LOG_SHOW_TIMESTAMP=true
ARG SORAI_LOG_ROTATION=daily
ARG SORAI_LOG_SHOW_MODULE=true
ARG SORAI_LOG_REQUEST_SAMPLING=100
ARG SORAI_LOG_SLOW_REQUESTS_ONLY=false
ARG SORAI_LOG_SLOW_THRESHOLD_MS=1000
ARG SORAI_LOG_ANALYTICS_MODE=full

# CORS Configuration
ARG SORAI_CORS_ENABLED=true
ARG SORAI_CORS_ALLOW_ORIGINS
ARG SORAI_CORS_ALLOW_METHODS
ARG SORAI_CORS_ALLOW_HEADERS
ARG SORAI_CORS_ALLOW_CREDENTIALS
ARG SORAI_CORS_MAX_AGE=3600

# Database Configuration
ARG SORAI_DATABASE_AUTO_MIGRATE=true
ARG SORAI_DATABASE_URL
ARG SORAI_DATABASE_TOKEN

# Mailer Configuration
ARG MAILER_FROM_EMAIL
ARG MAILER_FROM_NAME
ARG MAILER_SMTP_HOST
ARG MAILER_SMTP_PORT
ARG MAILER_SMTP_USERNAME
ARG MAILER_SMTP_PASSWORD
ARG MAILER_SMTP_SECURE

# Storage Configuration
ARG STORAGE_S3_ACCESS_KEY_ID
ARG STORAGE_S3_SECRET_ACCESS_KEY
ARG STORAGE_S3_BUCKET_DEFAULT
ARG STORAGE_S3_FORCE_PATH_STYLE
ARG STORAGE_S3_PATH_PREFIX
ARG STORAGE_S3_ENDPOINT_URL
ARG STORAGE_S3_PUBLIC_URL
ARG STORAGE_S3_REGION
ARG STORAGE_S3_SIGNED_URL_EXPIRES
ARG STORAGE_MAX_UPLOAD_SIZE

# Provider Configuration
ARG PROVIDER_OPENAI_API_KEY
ARG PROVIDER_OPENAI_BASE_URL
ARG PROVIDER_ANTHROPIC_API_KEY
ARG PROVIDER_ANTHROPIC_BASE_URL
ARG PROVIDER_BEDROCK_API_KEY
ARG PROVIDER_BEDROCK_ACCESS_KEY
ARG PROVIDER_BEDROCK_BASE_URL
ARG PROVIDER_COHERE_API_KEY
ARG PROVIDER_COHERE_BASE_URL
ARG PROVIDER_AZURE_OPENAI_API_KEY
ARG PROVIDER_AZURE_OPENAI_ENDPOINT
ARG PROVIDER_VERTEX_PROJECT_ID
ARG PROVIDER_VERTEX_CREDENTIALS
ARG PROVIDER_VERTEX_BASE_URL

# Copy the build output files and necessary utilities from previous stage.
# To enhance security, consider avoiding the copying of sysutils.
COPY --from=base --chown=root:root --chmod=0775 /usr/bin/tini /usr/bin/tini
COPY --from=builder --chown=nonroot:nonroot /usr/src/sorai /usr/bin/sorai
COPY --from=builder --chown=nonroot:nonroot /data /data

# Define the host and port to listen on.
ARG RUST_LOG=sorai=info HOST=0.0.0.0 PORT=8000
ENV RUST_LOG=$RUST_LOG HOST=$HOST PORT=$PORT
ENV TINI_SUBREAPER=true PATH="/usr/bin:$PATH"

# Define volumes for persistent storage.
VOLUME /data

WORKDIR /data
USER nonroot:nonroot
EXPOSE $PORT/tcp

# Healthcheck to monitor application status
# HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD sorai healthcheck

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sorai", "--data-dir", "/data", "serve"]

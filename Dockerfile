# syntax=docker/dockerfile:1.7

# Arguments with default value (for build).
ARG PLATFORM=linux/amd64
ARG RUST_VERSION=1.87

FROM --platform=${PLATFORM} busybox:1.37-glibc AS glibc

# -----------------------------------------------------------------------------
# Base image for building the application
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} rust:${RUST_VERSION}-slim-bookworm AS base

# Install build dependencies.
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update -y \
    && apt-get -yqq --no-install-recommends install build-essential curl \
       inotify-tools pkg-config libssl-dev git unzip ca-certificates tini \
    && update-ca-certificates

WORKDIR /usr/src

# -----------------------------------------------------------------------------
# Install dependencies and build the application.
# -----------------------------------------------------------------------------
FROM base AS builder
COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/src/target cargo build \
    --release --locked && strip -s target/release/sorai \
    && mv target/release/sorai . && chmod +x sorai

# -----------------------------------------------------------------------------
# Cleanup the builder stage and create data directory.
# -----------------------------------------------------------------------------
FROM base AS pruner

# Copy output and config files from the builder stage.
COPY --from=builder /usr/src/config.toml.example /srv/config.toml
COPY --from=builder /usr/src/sorai /srv/sorai

# Create the logs directory and set permissions. We need to allow "others" access
# to app folder, because Docker container can be started with arbitrary uid.
RUN mkdir -p /srv/logs && chmod ugo+rw -R /srv/logs

# -----------------------------------------------------------------------------
# Use the slim image for a lean production container.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} gcr.io/distroless/cc-debian12:nonroot AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/sorai"
LABEL org.opencontainers.image.documentation="https://github.com/riipandi/sorai"
LABEL org.opencontainers.image.description="Fast LLM gateway written in Rust"
LABEL org.opencontainers.image.authors="Aris Ripandi"
LABEL org.opencontainers.image.vendor="Aris Ripandi"
LABEL org.opencontainers.image.licenses="Apache-2.0 or MIT"

# Required application environment variables
ARG OPENAI_API_KEY ANTHROPIC_API_KEY BEDROCK_API_KEY BEDROCK_ACCESS_KEY \
    COHERE_API_KEY AZURE_API_KEY AZURE_ENDPOINT VERTEX_PROJECT_ID \
    VERTEX_CREDENTIALS

# Copy the build output files and necessary utilities from previous stage.
COPY --from=pruner --chmod=775 /usr/bin/tini /usr/bin/tini
COPY --from=pruner --chown=nonroot:nonroot /srv /srv

# Add some additional system utilities for debugging (~10MB).
# To enhance security, consider avoiding the copying of sysutils.
COPY --from=glibc /bin/hostname /bin/hostname
COPY --from=glibc /bin/whoami /bin/whoami
COPY --from=glibc /bin/clear /bin/clear
COPY --from=glibc /bin/mkdir /bin/mkdir
COPY --from=glibc /bin/which /bin/which
COPY --from=glibc /bin/head /bin/head
COPY --from=glibc /bin/cat /bin/cat
COPY --from=glibc /bin/ls /bin/ls
COPY --from=glibc /bin/sh /bin/sh

# Define the host and port to listen on.
ARG RUST_LOG=sorai=debug HOST=0.0.0.0 PORT=8000
ENV RUST_LOG=$RUST_LOG HOST=$HOST PORT=$PORT
ENV TINI_SUBREAPER=true PATH="/srv:$PATH"

# Define volumes for persistent storage.
VOLUME /srv/logs /srv/config.toml

WORKDIR /srv
USER nonroot:nonroot
EXPOSE $PORT/tcp

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sorai", "serve"]

# syntax=docker/dockerfile:1.7

# Arguments with default value (for build).
ARG PLATFORM=linux/amd64
ARG RUST_VERSION=1.87

FROM --platform=${PLATFORM} busybox:1.37-glibc AS glibc

# -----------------------------------------------------------------------------
# Base image for building the application
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} rust:${RUST_VERSION}-slim-bookworm AS base
RUN apt-get update && apt-get -yqq --no-install-recommends install tini
RUN update-ca-certificates
WORKDIR /usr/src

# -----------------------------------------------------------------------------
# Install dependencies and build the application.
# -----------------------------------------------------------------------------
FROM base AS builder
COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/src/target cargo build \
    --release && strip -s target/release/swift-relay \
    && mv target/release/swift-relay . && chmod +x swift-relay

# -----------------------------------------------------------------------------
# Use the slim image for a lean production container.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} gcr.io/distroless/cc-debian12:nonroot AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/swift-relay"
LABEL org.opencontainers.image.documentation="https://github.com/riipandi/swift-relay"
LABEL org.opencontainers.image.description="Fast LLM gateway written in Rust"
LABEL org.opencontainers.image.authors="Aris Ripandi"
LABEL org.opencontainers.image.vendor="Aris Ripandi"
LABEL org.opencontainers.image.licenses="Apache-2.0 or MIT"

# Required application environment variables
ARG OPENAI_API_KEY ANTHROPIC_API_KEY BEDROCK_API_KEY BEDROCK_ACCESS_KEY \
    COHERE_API_KEY AZURE_API_KEY AZURE_ENDPOINT VERTEX_PROJECT_ID \
    VERTEX_CREDENTIALS

# Copy the build output files and necessary utilities from previous stage.
COPY --from=builder --chown=nonroot:nonroot /usr/src/swift-relay /srv/swift-relay
COPY --from=builder --chmod=775 /usr/bin/tini /usr/bin/tini

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
ARG RUST_LOG=swift-relay=debug HOST=0.0.0.0 PORT=8000
ENV RUST_LOG=$RUST_LOG HOST=$HOST PORT=$PORT
ENV TINI_SUBREAPER=true PATH="/srv:$PATH"

WORKDIR /srv
USER nonroot:nonroot
EXPOSE $PORT/tcp

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["swift-relay"]

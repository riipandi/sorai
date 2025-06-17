#!/usr/bin/env -S just --justfile
# ^ A shebang isn't required, but allows a justfile to be executed
#   like a script, with `./justfile test`, for example.

# Set additional Docker build args for the image platform
platform_arch := if arch() == "aarch64" { "linux/arm64" } else { "linux/amd64" }

[private]
app_identifier := "sorai"

[private]
app_version := "0.0.0"

[private]
app_image := "ghcr.io/riipandi/sorai"

[private]
default:
  @just --list --unsorted --list-heading $'Available tasks:\n'

#----- Development and Build tasks --------------------------------------------

[doc('Start development server')]
[no-exit-message]
dev *args:
  @watchexec -r -e rs -- cargo run -q -- serve {{args}}

[doc('Run development for CLI')]
[no-exit-message]
run *args:
  @cargo run -q -- {{args}}

[doc('Build the application (release)')]
[no-exit-message]
build *args:
  @echo "Building {{app_identifier}} v{{app_version}} in release mode..."
  @cargo build --release --frozen {{args}}
  @ls -lh target/release/{{app_identifier}}

[doc('Build the application (debug)')]
[no-exit-message]
build-debug *args:
  @echo "Building {{app_identifier}} v{{app_version}} in debug mode..."
  @cargo build --frozen {{args}}
  @ls -lh target/debug/{{app_identifier}}

[doc('Start the application from build (release)')]
[no-exit-message]
start *args:
  @echo "Starting {{app_identifier}} v{{app_version}} in release mode..."
  @target/release/{{app_identifier}} {{args}}

[doc('Start the application from build (debug)')]
[no-exit-message]
start-debug *args:
  @echo "Starting {{app_identifier}} v{{app_version}} in debug mode..."
  @target/debug/{{app_identifier}} {{args}}

[doc('Tests the application')]
test *args:
  @cargo nextest run --frozen --no-fail-fast {{args}}

[doc('Generate code coverage report')]
coverage *args:
  @cargo tarpaulin --frozen --release --out Stdout {{args}}

[doc('Format the code')]
format *args:
  @cargo fmt --all -- --check {{args}}

[doc('Check the code')]
check *args:
  @cargo check --manifest-path Cargo.toml {{args}}

[doc('Clean up artifacts')]
[confirm("Are you sure you want to cleanup the artifacts?")]
cleanup:
  @npx --yes rimraf build dist tmp target

#----- Docker related tasks ---------------------------------------------------

[doc('Build the Docker image')]
docker-build *args:
  @echo "Building {{app_image}}:{{app_version}} for platform {{platform_arch}}"
  @docker build -f Dockerfile . -t {{app_image}}:{{app_version}} --build-arg PLATFORM={{platform_arch}} {{args}}
  @docker image list --filter reference={{app_image}}:*

[doc('Run the Docker image')]
docker-run *args:
  @docker run --network=host --rm -it \
    -v ./config.toml:/srv/config.toml:ro -v ./logs:/srv/logs:rw \
    {{app_image}}:{{app_version}} {{args}}

[doc('Exec into the Docker image')]
[no-exit-message]
docker-exec *args:
  @docker run --network=host --rm -it \
    -v ./config.toml:/srv/config.toml:ro -v ./logs:/srv/logs:rw \
    --entrypoint /srv/sorai {{app_image}}:{{app_version}} {{args}}

[doc('Debug the Docker image')]
[no-exit-message]
docker-shell:
  @docker run --network=host --rm -it \
    -v ./config.toml:/srv/config.toml:ro -v ./logs:/srv/logs:rw \
    --entrypoint /bin/sh {{app_image}}:{{app_version}}

[doc('Get Docker image list')]
docker-images:
  @docker image list --filter reference={{app_image}}:*

[doc('Push the Docker image')]
docker-push:
  @docker push {{app_image}}:{{app_version}}

#----- Docker Compose related tasks -------------------------------------------

[doc('Start the development environment')]
compose-up:
  @docker compose -f compose.yml up --detach --remove-orphans

[doc('Stop the development environment')]
compose-down:
  @docker compose -f compose.yml down --remove-orphans

[doc('Cleanup the development environment')]
compose-cleanup:
  @docker compose -f compose.yml down --remove-orphans --volumes

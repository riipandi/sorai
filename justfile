#!/usr/bin/env -S just --justfile
# ^ A shebang isn't required, but allows a justfile to be executed
#   like a script, with `./justfile test`, for example.

# Set additional Docker build args for the image platform
platform_arch := if arch() == "aarch64" { "linux/arm64" } else { "linux/amd64" }

[private]
app_identifier := `cargo metadata --no-deps --format-version 1 | jq -r '.packages[0].name'`

[private]
app_version := `cargo metadata --no-deps --format-version 1 | jq -r '.packages[0].version'`

[private]
app_image := "ghcr.io/riipandi/" + app_identifier

[private]
default:
  @just --list --unsorted --list-heading $'Available tasks:\n'

#----- Development and Build tasks --------------------------------------------

[group('Development Tasks')]
[doc('Start development server')]
[no-exit-message]
dev *args:
  @watchexec -r -e rs -- cargo run -q -- serve {{args}}

[group('Development Tasks')]
[doc('Run development for CLI')]
[no-exit-message]
run *args:
  @cargo run -q -- {{args}}

[group('Development Tasks')]
[doc('Build the application (release)')]
[no-exit-message]
build *args:
  @echo "Building {{app_identifier}} v{{app_version}} in release mode..."
  @cargo build --release --locked {{args}}
  @echo "Building {{app_identifier}} v{{app_version}} in debug mode..."
  @cargo build --locked {{args}}
  @ls -lh target/{debug,release}/{{app_identifier}}

[group('Development Tasks')]
[doc('Start the application from build (release)')]
[no-exit-message]
start *args:
  @echo "Starting {{app_identifier}} v{{app_version}} in release mode..."
  @target/release/{{app_identifier}} {{args}}

[group('Development Tasks')]
[doc('Start the application from build (debug)')]
[no-exit-message]
start-debug *args:
  @echo "Starting {{app_identifier}} v{{app_version}} in debug mode..."
  @target/debug/{{app_identifier}} {{args}}

[group('Development Tasks')]
[doc('Tests the application')]
test *args:
  @cargo nextest run --locked --no-fail-fast {{args}}

[group('Development Tasks')]
[doc('Generate code coverage report')]
coverage *args:
  @cargo tarpaulin --locked --release --out Stdout {{args}}

[group('Development Tasks')]
[doc('Format the code')]
format *args:
  @cargo fmt --all -- --check {{args}}

[group('Development Tasks')]
[doc('Check the code')]
check *args:
  @cargo check --manifest-path Cargo.toml {{args}}

[group('Development Tasks')]
[doc('Clean up artifacts')]
[confirm("Are you sure you want to cleanup the artifacts?")]
cleanup:
  @npx --yes rimraf build dist tmp target

#----- Docker related tasks ---------------------------------------------------

[group('Docker Tasks')]
[doc('Build the Docker image')]
docker-build *args:
  @echo "Building {{app_image}}:{{app_version}} for platform {{platform_arch}}"
  @docker build -f Dockerfile --build-arg DISTROLESS_TAG=nonroot . \
    -t {{app_image}}:{{app_version}} --build-arg PLATFORM={{platform_arch}} {{args}}
  @docker build -f Dockerfile --build-arg DISTROLESS_TAG=debug-nonroot . \
    -t {{app_image}}:{{app_version}}-debug --build-arg PLATFORM={{platform_arch}} {{args}}
  @docker image list --filter reference={{app_image}}:*

[group('Docker Tasks')]
[doc('Run the Docker image')]
docker-run *args:
  @docker run --network=host --rm -it \
    -v ./config.toml:/etc/sorai.toml:ro \
    -v ./.data/logs:/data/logs:rw \
    {{app_image}}:{{app_version}} {{args}}

[group('Docker Tasks')]
[doc('Debug the Docker image')]
[no-exit-message]
docker-shell:
  @docker run --network=host --rm -it \
    -v ./config.toml:/etc/sorai.toml:ro -v ./logs:/data/logs:rw \
    --entrypoint sh {{app_image}}:{{app_version}}-debug

[group('Docker Tasks')]
[doc('Get Docker image list')]
docker-images:
  @docker image list --filter reference={{app_image}}:*

[group('Docker Tasks')]
[doc('Push the Docker image')]
docker-push:
  @docker push {{app_image}}:{{app_version}}

#----- Docker Compose related tasks -------------------------------------------

[group('Docker Compose Tasks')]
[doc('Start the development environment')]
compose-up:
  @docker compose -f compose.yml up --detach --remove-orphans

[group('Docker Compose Tasks')]
[doc('Stop the development environment')]
compose-down:
  @docker compose -f compose.yml down --remove-orphans

[group('Docker Compose Tasks')]
[doc('Cleanup the development environment')]
compose-cleanup:
  @docker compose -f compose.yml down --remove-orphans --volumes

#!/usr/bin/env -S just --justfile
# ^ A shebang isn't required, but allows a justfile to be executed
#   like a script, with `./justfile test`, for example.

[private]
app_identifier := "swift-relay"

[private]
app_version := "0.0.0"

[private]
app_image := "ghcr.io/riipandi/swift-relay"

[private]
default:
  @just --list --unsorted --list-heading $'Available tasks:\n'

#----- Development and Build tasks --------------------------------------------

[doc('Start development')]
[no-exit-message]
dev *args:
  @watchexec -r -e rs -- cargo run -q -- {{args}}

[doc('Build the application (release)')]
[no-exit-message]
build *args:
  @echo "Building {{app_identifier}} v{{app_version}} in release mode..."
  @cargo build --release {{args}}
  @ls -lh target/release/{{app_identifier}}

[doc('Build the application (debug)')]
[no-exit-message]
build-debug *args:
  @echo "Building {{app_identifier}} v{{app_version}} in debug mode..."
  @cargo build {{args}}
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
  @cargo test {{args}}

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
  @docker build -f Dockerfile . -t {{app_image}}:{{app_version}} {{args}}
  @docker image list --filter reference={{app_image}}:*

[doc('Run the Docker image')]
docker-run *args:
  @docker run --network=host --rm -it -v ./config.toml:/srv/config.toml:ro {{app_image}}:{{app_version}} {{args}}

[doc('Run the Docker image')]
[no-exit-message]
docker-shell:
  @docker run --network=host --rm -it -v ./config.toml:/srv/config.toml:ro --entrypoint /bin/sh {{app_image}}:{{app_version}}

[doc('Get Docker image list')]
docker-images:
  @docker image list --filter reference={{app_image}}:*

[doc('Push the Docker image')]
docker-push:
  @docker push {{app_image}}:{{app_version}}

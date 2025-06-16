#!/usr/bin/env -S just --justfile
# ^ A shebang isn't required, but allows a justfile to be executed
#   like a script, with `./justfile test`, for example.

set dotenv-required := false
set dotenv-load := true
set dotenv-path := ".env"
set export :=  true

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

[doc('Build the application')]
[no-exit-message]
build +APP_ENV='prod':
  @echo "Building {{app_identifier}} v{{app_version}} in {{APP_ENV}} mode..."
  @cargo build

[doc('Start the application from build')]
[no-exit-message]
start +APP_ENV='prod':
  @echo "Starting {{app_identifier}} v{{app_version}} in {{APP_ENV}} mode..."
  @target/debug/{{app_identifier}}

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

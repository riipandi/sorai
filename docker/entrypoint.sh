#!/bin/sh
set -eu

# Using tini to handle zombie processes.

if [ "$1" = 'serve' ]; then
  exec /usr/bin/tini -- /srv/sorai serve
 else
  exec /usr/bin/tini -- /srv/sorai "$@"
fi

exec "$@"

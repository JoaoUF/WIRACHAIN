#!/bin/sh
set -e

# Wait for master
until nc -z postgres-master 5432; do
  echo "Waiting for postgres-master:5432..."
  sleep 2
done

# Wait for replica
until nc -z postgres-first-replica 5432; do
  echo "Waiting for postgres-first-replica:5432..."
  sleep 2
done

exec "$@"
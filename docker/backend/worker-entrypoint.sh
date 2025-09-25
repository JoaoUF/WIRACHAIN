#!/bin/sh

until cd /app/backend/src
do
    echo "Waiting for server volume..."
done

DJANGO_SETTINGS_MODULE='core.settings.development' --loglevel=info --concurrency 1 -E
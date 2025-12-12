#!/bin/sh

ENV_TYPE=${ENV_TYPE:-development}
USE_GUNICORN=${USE_GUNICORN:-""}
GUNICORN_BIND=${GUNICORN_BIND:-0.0.0.0:8000}
GUNICORN_WORKERS=${GUNICORN_WORKERS:-}
GUNICORN_TIMEOUT=${GUNICORN_TIMEOUT:-30}
GUNICORN_MAX_REQUESTS=${GUNICORN_MAX_REQUESTS:-0}
GUNICORN_RELOAD=${GUNICORN_RELOAD:-""}

if [ "$ENV_TYPE" = "production" ]; then
  export DJANGO_SETTINGS_MODULE="core.settings.production"
elif [ "$ENV_TYPE" = "stage" ]; then
  export DJANGO_SETTINGS_MODULE="core.settings.stage"
else
  export DJANGO_SETTINGS_MODULE="core.settings.development"
fi

until cd /app/backend/src
do
    echo "Waiting for server volume..."
done

until python manage.py makemigrations
do
    echo "Creating migration files ..."
    sleep 2
done

until python manage.py migrate --fake-initial
do
    echo "Migrating tables to database ..."
    sleep 2
done

until python manage.py collectstatic --noinput
do
    echo "Collecting static content ..."
    sleep 2
done

# until python manage.py cities_light
# do
#     echo "Migrating data of cities to db ..."
#     sleep 2
# done

ROLES_CONFIG="/app/backend/src/apps/authenticationApp/config/roles_permissions.yaml"

until python manage.py SetUpPermissions --config "$ROLES_CONFIG"
do
    echo "Running SetUpPermissions (creating groups & model perms)..."
    sleep 2
done

until python manage.py loaddata users.json email_adresses.json
do
    echo "Loading groups fixture..."
    sleep 2
done

until python manage.py AssignGroups
do
    echo "Running AssignGroups (mapping fixture groups -> actual groups by name)..."
    sleep 2
done

until python manage.py SeedData
do
    echo "Running SeedData (adding some basic data to default users)"
    sleep 2
done

# Decide whether to use gunicorn.
# Priority: USE_GUNICORN env var (non-empty) -> use gunicorn
# Fallback: ENV_TYPE=production will use gunicorn
# Otherwise use manage.py runserver (development)
SHOULD_USE_GUNICORN=0
if [ -n "$USE_GUNICORN" ]; then
  SHOULD_USE_GUNICORN=1
elif [ "$ENV_TYPE" = "production" ]; then
  SHOULD_USE_GUNICORN=1
fi

if [ "$SHOULD_USE_GUNICORN" -eq 1 ]; then
  # compute default workers if not supplied: 2 * CPUs + 1
  if [ -z "$GUNICORN_WORKERS" ]; then
    # fallback safe default if nproc not available
    if command -v nproc > /dev/null; then
      GUNICORN_WORKERS=$(( $(nproc) * 2 + 1 ))
    else
      GUNICORN_WORKERS=3
    fi
  fi

  GUNICORN_CMD="gunicorn core.wsgi:application -b ${GUNICORN_BIND} -w ${GUNICORN_WORKERS} --timeout ${GUNICORN_TIMEOUT} --log-level info --access-logfile -"
  if [ "${GUNICORN_MAX_REQUESTS}" != "0" ]; then
    GUNICORN_CMD="${GUNICORN_CMD} --max-requests ${GUNICORN_MAX_REQUESTS}"
  fi
  # enable reload if requested (only use in local dev)
  if [ "${GUNICORN_RELOAD}" = "true" ]; then
    GUNICORN_CMD="${GUNICORN_CMD} --reload"
  fi

  echo "Starting gunicorn: ${GUNICORN_CMD}"
  exec ${GUNICORN_CMD}
else
  echo "Starting Django development server with settings ${DJANGO_SETTINGS_MODULE}..."
  exec python manage.py runserver 0.0.0.0:8000
fi
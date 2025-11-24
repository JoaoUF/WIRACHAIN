#!/bin/sh

ENV_TYPE=${ENV_TYPE:-development}

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

echo "Starting Django development server with settings..."
exec python manage.py runserver 0.0.0.0:8000
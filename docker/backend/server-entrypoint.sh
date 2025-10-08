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
    echo "Creating migration files using $MANAGE_PY..."
    sleep 2
done

until python manage.py migrate
do
    echo "Migrating tables to database using $MANAGE_PY..."
    sleep 2
done

# until python manage.py cities_light
# do
#     echo "Migrating data of cities to db $MANAGE_PY..."
#     sleep 2
# done

until python manage.py loaddata groups.json users.json
do
    echo "Loading groups fixture with $MANAGE_PY ..."
    sleep 2
done

# python $MANAGE_PY collectstatic --noinput
echo "Starting Django development server with settings..."
exec python manage.py runserver 0.0.0.0:8000
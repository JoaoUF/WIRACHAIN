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

# until python manage.py makemigrations
# do
#     echo "Creating migration files ..."
#     sleep 2
# done

until python manage.py migrate
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

until python manage.py loaddata groups.json users.json email_adresses.json test.json disease.json speciality.json
do
    echo "Loading groups fixture..."
    sleep 2
done

echo "Starting Django development server with settings..."
exec python manage.py runserver 0.0.0.0:8000
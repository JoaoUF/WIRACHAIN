#!/bin/sh

ENV_TYPE=${ENV_TYPE:-development}

if [ "$ENV_TYPE" = "production" ]; then
  MANAGE_PY=manage.production.py
elif [ "$ENV_TYPE" = "stage" ]; then
  MANAGE_PY=manage.stage.py
else
  MANAGE_PY=manage.py
fi

until cd /app/backend/src
do
    echo "Waiting for server volume..."
done

until python $MANAGE_PY makemigrations
do
    echo "Creating migration files using $MANAGE_PY..."
    sleep 2
done

until python $MANAGE_PY migrate
do
    echo "Migrating tables to database using $MANAGE_PY..."
    sleep 2
done

until python $MANAGE_PY loaddata groups.json
do
    echo "Loading groups initial data using $MANAGE_PY ..."
    sleep 2
done

# python $MANAGE_PY collectstatic --noinput
echo "Starting Django development server with settings..."
exec python $MANAGE_PY runserver 0.0.0.0:8000
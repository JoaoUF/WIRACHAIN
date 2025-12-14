FROM python:3.12.6-alpine

RUN apk update && apk add python3-dev gcc libc-dev

ENV APP_HOME=/app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR $APP_HOME
ARG ENV_TYPE=development
ENV ENV_TYPE=$ENV_TYPE

RUN pip install --upgrade pip
RUN pip install gunicorn
ADD ./backend/src/requirements/base.txt $APP_HOME
ADD ./backend/src/requirements/${ENV_TYPE}.txt $APP_HOME
RUN pip install -r ${ENV_TYPE}.txt

ADD ./backend $APP_HOME/backend
ADD ./docker $APP_HOME/docker
COPY ./pyproject.toml $APP_HOME/
COPY ./.flake8 $APP_HOME/

RUN chmod +x /app/docker/backend/server-entrypoint.sh
RUN chmod +x /app/docker/backend/wait-for-dbs.sh
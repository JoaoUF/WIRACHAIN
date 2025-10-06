from .base import *
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(ENV_DIR, ".env.development"))

# DJANGO
WSGI_APPLICATION = "core.wsgi.development.application"
DEBUG = True
PRODUCTION = False
SECRET_KEY = os.environ.get("SECRET_KEY")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS").split(" ")  # type: ignore

# DATABASE
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST"),
        "PORT": os.environ.get("POSTGRES_PORT"),
    },
    "replica": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_REPLICA_HOST"),
        "PORT": os.environ.get("POSTGRES_REPLICA_PORT"),
    },
}

# STATIC FILE
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
    os.path.join(BASE_DIR, "media"),
]

STATIC_URL = "/static/"
MEDIA_URL = "/media/"

STATIC_ROOT = os.path.join(BASE_DIR, "staticfields")
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafields")

from .base import *
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(ENV_DIR, ".env.production"))

# DJANGO
WSGI_APPLICATION = "core.wsgi.production.application"
ASGI_APPLICATION = "core.asgi.production.application"
DEBUG = False
PRODUCTION = True
SECRET_KEY = os.environ.get("SECRET_KEY")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(" ")
INTERNAL_IPS = os.environ.get("ALLOWED_HOSTS", "").split(" ")
VERIFICATION_EMAIL_REDIRECT_URL = os.environ.get("VERIFICATION_EMAIL_REDIRECT_URL", "")
ACCOUNT_ADAPTER = "authenticationApp.adapter.CustomAccountAdapter"

# DJANGO CORS HEADER
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(" ")
CSRF_TRUSTED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(" ")

# EMAIL
EMAIL_USE_TLS = bool(int(os.environ.get("EMAIL_USE_TLS", "1")))
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")

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
        "TEST": {"MIRROR": "default"},
        "CONN_MAX_AGE": 600,
    },
}

# CACHE
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

# RABBITMQ
RABBIT_USER = os.environ.get("RABBITMQ_DEFAULT_USER")
RABBIT_PASSWORD = os.environ.get("RABBITMQ_DEFAULT_PASS")

# CELERY
CELERY_BROKER_URL = f"amqp://{RABBIT_USER}:{RABBIT_PASSWORD}@rabbitmq:5672//"
CELERY_RESULT_BACKEND = "rpc://"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# STATIC FILE
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
    os.path.join(BASE_DIR, "media"),
]

STATIC_URL = "/static/"
MEDIA_URL = "/media/"

STATIC_ROOT = os.path.join(BASE_DIR, "staticfields")
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafields")

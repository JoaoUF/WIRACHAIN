from pathlib import Path
import os
import sys

BASE_DIR = Path(__file__).resolve().parent.parent.parent
APPS_DIR = os.path.join(BASE_DIR, "apps")
ENV_DIR = os.path.join(BASE_DIR, "environments")

if APPS_DIR not in sys.path:
    sys.path.insert(0, APPS_DIR)
if ENV_DIR not in sys.path:
    sys.path.insert(0, ENV_DIR)

# APPS
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "django_filters",
    "django_extensions",
    "phonenumber_field",
    "drf_spectacular",
    "cities_light",
]

PERSONAL_APPS = [
    "apps.authenticationApp",
    "apps.medicalApp",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PERSONAL_APPS

# MIDDLEWARES
DJANGO_MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

THIRD_PARTY_MIDDLEWARE = []

PERSONAL_MIDDLEWARE = []

MIDDLEWARE = DJANGO_MIDDLEWARE + THIRD_PARTY_MIDDLEWARE + PERSONAL_MIDDLEWARE

# FIXTURES
# FIXTURE_DIRS = os.path.join(BASE_DIR, "fixtures")

# TEMPLATES
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# PASSWORD VALIDATORS
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# LANGUAGE
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DJANGO OPTIONS
AUTH_USER_MODEL = "authenticationApp.CustomUser"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DJANGO REST FRAMEWORK
REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# DRF-SPECTACULAR
SPECTACULAR_SETTINGS = {
    "TITLE": "Wirachain API",
    "DESCRIPTION": "This a tesis proyect for medical records in clinics.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

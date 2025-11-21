import os
from celery import Celery

# Keep a safe default so the worker can be started in dev without depending
# on external env var (env var will still override it).
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    os.environ.get("DJANGO_SETTINGS_MODULE", "core.settings.development"),
)

app = Celery("core")

# Read configuration from Django settings, using the 'CELERY_' namespace.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in installed apps.
app.autodiscover_tasks()

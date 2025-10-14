from .development import *

INSTALLED_APPS = [a for a in INSTALLED_APPS if a not in ("debug_toolbar", "silk")]
MIDDLEWARE = [m for m in MIDDLEWARE if "debug_toolbar" not in m and "silk" not in m]

REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = [
    "rest_framework.authentication.SessionAuthentication",
    "rest_framework.authentication.BasicAuthentication",
]

REST_FRAMEWORK["DEFAULT_PERMISSION_CLASSES"] = [
    "rest_framework.permissions.AllowAny",
]

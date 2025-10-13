from .development import *

INSTALLED_APPS = [a for a in INSTALLED_APPS if a not in ("debug_toolbar", "silk")]
MIDDLEWARE = [m for m in MIDDLEWARE if "debug_toolbar" not in m and "silk" not in m]

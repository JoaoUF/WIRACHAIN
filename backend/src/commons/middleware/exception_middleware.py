from __future__ import annotations

import logging
import traceback
import uuid

from django.conf import settings
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.http import Http404
from django.utils.timezone import now as tz_now


logger = logging.getLogger(__name__)


class ExceptionMiddleware:
    """
    Catch unhandled exceptions at Django middleware level and return a consistent JSON error
    response for API requests (or when Accept header prefers JSON).

    Behavior:
    - If the view/DRF layer raises an exception that DRF's exception handler returns a Response for,
      DRF will send that response and this middleware is not involved.
    - If DRF's exception handler returns None (i.e., it didn't handle the exception), or some
      non-DRF code raises, this middleware will catch the exception and return a JSON response
      when the request looks like an API request.
    - For non-API requests, the middleware re-raises the exception so Django's usual error pages/handlers apply.
    - When settings.DEBUG is True the response includes a traceback string in "meta.debug".
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger("exception_middleware")

        # optional prefix you may set in settings, default "/api/"
        self.api_prefix = getattr(settings, "API_PREFIX", "/api/")

    def __call__(self, request: HttpRequest) -> HttpResponse:
        try:
            response = self.get_response(request)
            return response
        except Exception as exc:
            # Log full exception & traceback
            self.logger.exception("Unhandled exception for request %s %s", request.method, request.path)

            return self._json_error_response(request, exc)

    def _json_error_response(self, request: HttpRequest, exc: Exception) -> JsonResponse:
        """
        Build a standard JSON error response. Includes a unique error id and useful meta.
        """
        error_id = str(uuid.uuid4())
        status_code = 500
        exc_type = exc.__class__.__name__
        message = str(exc) or exc_type

        # map some common Django exceptions to appropriate HTTP status codes
        if isinstance(exc, Http404):
            status_code = 404
        elif isinstance(exc, DjangoPermissionDenied):
            status_code = 403
        # you can add more exception to status mapping here (SuspiciousOperation -> 400, etc.)

        payload = {
            "errors": [
                {
                    "id": error_id,
                    "status": status_code,
                    "type": exc_type,
                    "detail": message,
                }
            ],
            "meta": {
                "path": getattr(request, "path", None),
                "method": getattr(request, "method", None),
                "timestamp": (tz_now().isoformat()),
                "error_count": 1,
            },
        }

        # Include debug trace if DEBUG
        if getattr(settings, "DEBUG", False):
            payload["meta"]["debug"] = {
                "traceback": traceback.format_exc(),
            }

        # Also log the error id (so you can correlate server logs and client error)
        logger.error("Error id %s for request %s %s", error_id, request.method, request.path)

        return JsonResponse(payload, status=status_code)

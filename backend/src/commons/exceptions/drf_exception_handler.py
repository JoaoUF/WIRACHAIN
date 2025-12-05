from __future__ import annotations

import logging
from typing import Optional

from rest_framework.views import exception_handler as drf_default_exception_handler
from rest_framework.response import Response
from rest_framework import status as drf_status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context) -> Optional[Response]:
    """
    Custom DRF exception handler that returns a consistent JSON error format.

    - If DRF's default handler returns a Response, we reformat response.data into:
      { "errors": [ { "status": <int>, "type": "<ExceptionClass>", "detail": <message>, ... } ], "meta": { ... } }
      and return that Response.
    - If DRF's default handler returns None (meaning DRF didn't handle the exception),
      we return None so upstream (middleware) may handle it (this allows Django-level middleware
      to produce a 500 / fallback JSON response).
    """

    # Let DRF build a Response if it can
    response = drf_default_exception_handler(exc, context)

    # If DRF produced a response, normalize its payload to our JSON API-ish "errors" format
    if response is not None:
        status_code = getattr(response, "status_code", drf_status.HTTP_500_INTERNAL_SERVER_ERROR)
        errors = []

        data = response.data

        # If the DRF response is already our normalized structure, keep it
        if isinstance(data, dict) and "errors" in data:
            return response

        # Standard DRF detail responses often have {'detail': '...'} or field errors
        if isinstance(data, dict):
            # detail first if present
            if "detail" in data:
                detail = data.get("detail")
                errors.append(
                    {
                        "status": status_code,
                        "type": exc.__class__.__name__,
                        "detail": detail,
                    }
                )

            # field-specific errors
            for key, val in data.items():
                if key == "detail":
                    continue
                # val may be list or string or nested dict
                errors.append(
                    {
                        "status": status_code,
                        "source": {"pointer": f"/{key}"},
                        "type": exc.__class__.__name__,
                        "detail": val,
                    }
                )

        else:
            # not a dict (e.g., a list of errors), return as single error entry
            errors.append(
                {
                    "status": status_code,
                    "type": exc.__class__.__name__,
                    "detail": data,
                }
            )

        payload = {
            "errors": errors,
            "meta": {
                "handler": "drf",
                "timestamp": None,
            },
        }

        # attach payload to response
        response.data = payload
        return response

    # DRF didn't handle this exception — return None so Django middleware can handle it
    return None

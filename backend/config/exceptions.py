import logging
from rest_framework.views import exception_handler

logger = logging.getLogger('django')

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first to get the standard response
    response = exception_handler(exc, context)

    request = context.get('request')
    path = request.path if request else 'Unknown'
    method = request.method if request else 'Unknown'
    user = request.user if request and request.user else 'Anonymous'

    if response is not None:
        # If the status code indicates an authorization/permission failure (401/403)
        if response.status_code in [401, 403]:
            logger.warning(
                f"Unauthorized access attempt: User={user}, Path={path}, Method={method}, Status={response.status_code}"
            )
    else:
        # Unexpected error (results in standard HTTP 500)
        logger.error(
            f"Unexpected exception on path {path} [{method}]: {exc}",
            exc_info=True
        )

    return response

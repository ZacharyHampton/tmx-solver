class InvalidURLException(Exception):
    """Raised when the solver fails to validate the URL."""
    pass


class FailedToValidateScriptException(Exception):
    """Raised when the solver fails to validate the script."""
    pass


class FailedToRetrieveScriptException(Exception):
    """Raised when the solver fails to retrieve the script."""
    pass

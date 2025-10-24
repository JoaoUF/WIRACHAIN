from drf_spectacular.utils import extend_schema, extend_schema_view
from dj_rest_auth.views import (
    LoginView as DjRestAuthLoginView,
    LogoutView as DjRestAuthLogoutView,
    PasswordResetView as DjRestAuthPasswordResetView,
    PasswordResetConfirmView as DjRestAuthPasswordResetConfirmView,
    PasswordChangeView as DjRestAuthPasswordChangeView,
)
from dj_rest_auth.registration.views import (
    RegisterView as DjRestAuthRegisterView,
    VerifyEmailView as DjRestAuthVerifyEmailView,
    ResendEmailVerificationView as DjRestAuthResendEmailVerificationView,
)


@extend_schema_view(
    post=extend_schema(
        tags=["Authentication"],
        summary="User Login",
        description="Authenticate user and return JWT tokens as cookies.",
    )
)
class LoginView(DjRestAuthLoginView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Authentication"],
        request=None,
        summary="User Logout",
        description="Logout the currently authenticated user.",
    ),
)
class LogoutView(DjRestAuthLogoutView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Authentication"],
        summary="Request Password Reset",
        description="Send password reset email to user.",
    ),
)
class PasswordResetView(DjRestAuthPasswordResetView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Authentication"],
        summary="Confirm Password Reset",
        description="Confirm the password reset with token and new passwords.",
    ),
)
class PasswordResetConfirmView(DjRestAuthPasswordResetConfirmView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Authentication"],
        summary="Change Password",
        description="Change the user's password.",
    ),
)
class PasswordChangeView(DjRestAuthPasswordChangeView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Registration"],
        summary="Register a New User",
        description="Register a new user with username, email, and password.",
        responses={201: None},  # Optionally, specify your response serializer
    )
)
class RegisterView(DjRestAuthRegisterView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Registration"],
        summary="Verify Email",
        description="Verify a user's email with a confirmation key.",
        responses={200: None},
    ),
)
class VerifyEmailView(DjRestAuthVerifyEmailView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Registration"],
        summary="Resend Verification Email",
        description="Resend the verification email to an unverified address.",
        responses={200: None},
    ),
)
class ResendEmailVerificationView(DjRestAuthResendEmailVerificationView):
    pass

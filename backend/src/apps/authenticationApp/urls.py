from django.urls import path, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view

from .views import (
    CustomUserViewSet,
    LoginView,
    LogoutView,
    PasswordResetView,
    PasswordResetConfirmView,
    PasswordChangeView,
    RegisterView,
    VerifyEmailView,
    ResendEmailVerificationView,
    CurrentUserView,
)

router = routers.DefaultRouter()
router.register(r"users", CustomUserViewSet, basename="user")

auth_urlpatterns = [
    re_path(r"^password/reset/?$", PasswordResetView.as_view(), name="rest_password_reset"),
    re_path(r"^password/reset/confirm/?$", PasswordResetConfirmView.as_view(), name="rest_password_reset_confirm"),
    re_path(r"^login/?$", LoginView.as_view(), name="rest_login"),
    re_path(r"^logout/?$", LogoutView.as_view(), name="rest_logout"),
    re_path(r"^password/change/?$", PasswordChangeView.as_view(), name="rest_password_change"),
]

registration_urlpatterns = [
    path("register/", RegisterView.as_view(), name="rest_register"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    re_path(r"^verify-email/?$", VerifyEmailView.as_view(), name="rest_verify_email"),
    re_path(r"^resend-email/?$", ResendEmailVerificationView.as_view(), name="rest_resend_email"),
    re_path(
        r"^account-confirm-email/(?P<key>[-:\w]+)/$",
        TemplateView.as_view(),
        name="account_confirm_email",
    ),
    re_path(
        r"^account-email-verification-sent/?$",
        TemplateView.as_view(),
        name="account_email_verification_sent",
    ),
    re_path(r"^token/verify/?$", TokenVerifyView.as_view(), name="token_verify"),
    re_path(r"^token/refresh/?$", get_refresh_view().as_view(), name="token_refresh"),
]

urlpatterns = router.urls + auth_urlpatterns + registration_urlpatterns

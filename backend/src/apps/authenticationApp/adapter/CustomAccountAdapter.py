from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return settings.VERIFICATION_EMAIL_REDIRECT_URL + emailconfirmation.key

from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return settings.VERIFICATION_EMAIL_REDIRECT_URL + emailconfirmation.key

    def save_user(self, request, user, form, commit=True):
        # Let the default adapter populate basic fields (username/email/password)
        user = super().save_user(request, user, form, commit=False)

        # Get data from the serializer/form. DRF serializer exposes validated_data,
        # allauth may provide cleaned_data. Support both.
        data = {}
        if hasattr(form, "cleaned_data"):
            data = form.cleaned_data
        elif hasattr(form, "validated_data"):
            data = form.validated_data

        # Map your extra serializer fields to the user model fields.
        # Adjust the keys below to match your CustomUser field names.
        # Only set fields present in the serializer data.
        if "first_name" in data:
            user.first_name = data.get("first_name") or user.first_name
        if "last_name" in data:
            user.last_name = data.get("last_name") or user.last_name
        if "gender" in data:
            user.gender = data.get("gender") or user.gender
        if "custom_gender" in data:
            user.custom_gender = data.get("custom_gender") or user.custom_gender
        if "phone" in data:
            user.phone = data.get("phone") or user.phone
        if "birth_date" in data:
            # validated_data should already be a date object; if it's a string,
            # allauth may still pass it through — consider parsing if needed.
            user.birth_date = data.get("birth_date") or user.birth_date
        if "document_type" in data:
            user.document_type = data.get("document_type") or user.document_type
        if "document_value" in data:
            user.document_value = data.get("document_value") or user.document_value
        if "enterprise" in data:
            # Make sure this field and the incoming value are compatible
            user.enterprise = data.get("enterprise") or user.enterprise

        # Save user now (commit=True by default)
        if commit:
            user.save()
        return user

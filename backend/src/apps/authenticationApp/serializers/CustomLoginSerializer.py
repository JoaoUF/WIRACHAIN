from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer as DjLoginSerializer


class CustomLoginSerializer(DjLoginSerializer):
    """
    Extends dj-rest-auth's LoginSerializer to reject inactive users.
    """

    def validate(self, attrs):
        # Let dj-rest-auth validate credentials and attach the user
        validated = super().validate(attrs)

        # dj-rest-auth places the user into validated_data['user']
        user = validated.get("user")
        if user is None:
            # No user -> keep the original error behavior
            return validated

        # If the user is inactive, raise a validation error (400)
        if not getattr(user, "is_active", True):
            raise serializers.ValidationError({"non_field_errors": [_("User account is disabled.")]})

        return validated

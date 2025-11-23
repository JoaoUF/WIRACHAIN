from django.contrib.auth.models import Group, Permission
from ..models import CustomUser
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    user_permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=True, required=False)
    enterprise_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "gender",
            "custom_gender",
            "phone",
            "birth_date",
            "document_type",
            "document_value",
            "enterprise",
            "is_active",
        ]

    def validate(self, attrs):
        doc_type = attrs.get("document_type")
        doc_value = attrs.get("document_value")
        doc_type_lengths = {
            CustomUser.DocumentType.NATIONAL_ID: 8,
            CustomUser.DocumentType.FOREIGNER_ID: 12,
            CustomUser.DocumentType.TAX_REGISTRY: 11,
            CustomUser.DocumentType.PASSPORT: 12,
        }
        required_length = doc_type_lengths.get(doc_type)
        if required_length and doc_value and len(doc_value) != required_length:
            raise serializers.ValidationError(
                {
                    "document_value": f"Document value for type '{dict(CustomUser.DocumentType.choices)[doc_type]}' must be exactly {required_length} digits/characters."
                }
            )
        return attrs

    def validate_enterprise(self, value):
        if self.initial_data.get("groups") and "DOCTOR" in self.initial_data.get("groups"):  # type: ignore
            if value is None:
                raise serializers.ValidationError("A doctor user must have an enterprise assigned.")
        return value

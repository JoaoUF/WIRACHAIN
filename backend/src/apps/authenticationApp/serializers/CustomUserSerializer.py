from rest_framework import serializers
from ..models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    enterprise = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(
            groups__name__in=[
                "ENTERPRISE_BASIC",
                "ENTERPRISE_PREMIUM",
                "ENTERPRISE_PROFESSISONAL",
            ]
        ),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = CustomUser
        fields = "__all__"

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
        if self.initial_data.get("groups") and "DOCTOR" in self.initial_data.get(  # type: ignore
            "groups"
        ):
            if value is None:
                raise serializers.ValidationError(
                    "A doctor user must have an enterprise assigned."
                )
        return value

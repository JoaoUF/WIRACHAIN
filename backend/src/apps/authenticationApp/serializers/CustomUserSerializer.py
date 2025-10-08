from django.contrib.auth.models import Group, Permission
from ..models import CustomUser
from rest_framework import serializers
from .enterprise_data import assign_essential_data_to_enterprise_user


class CustomUserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    user_permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=True, required=False)

    class Meta:
        model = CustomUser
        fields = "__all__"

    def create(self, validated_data):
        groups = validated_data.pop("groups", [])
        user_permissions = validated_data.pop("user_permissions", [])
        user = CustomUser.objects.create(**validated_data)
        user.groups.set(groups)
        user.user_permissions.set(user_permissions)
        assign_essential_data_to_enterprise_user(user)
        return user

    def update(self, instance, validated_data):
        groups = validated_data.pop("groups", None)
        user_permissions = validated_data.pop("user_permissions", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if groups is not None:
            instance.groups.set(groups)
        if user_permissions is not None:
            instance.user_permissions.set(user_permissions)
        assign_essential_data_to_enterprise_user(instance)
        return instance

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

from django.utils.translation import gettext_lazy as _
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from authenticationApp.validators import validate_age_minimum
from medicalApp.validators import alphanumeric
from guardian.shortcuts import assign_perm

from ..models import CustomUser
from django.contrib.auth.models import Group


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(
        required=True,
        max_length=150,
        validators=[alphanumeric],
    )
    last_name = serializers.CharField(
        required=True,
        max_length=150,
        validators=[alphanumeric],
    )
    gender = serializers.ChoiceField(
        choices=CustomUser.Gender.choices,
        default=CustomUser.Gender.NONE,
    )
    custom_gender = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    phone = serializers.CharField(
        required=True,
    )
    birth_date = serializers.DateField(
        required=True,
        input_formats=["%Y-%m-%d"],
        validators=[validate_age_minimum],
    )
    document_type = serializers.ChoiceField(
        choices=CustomUser.DocumentType.choices,
        required=True,
    )
    document_value = serializers.CharField(
        required=True,
        max_length=20,
    )
    enterprise = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True,
    )

    def validate(self, attrs):
        if attrs.get("password1") != attrs.get("password2"):
            raise serializers.ValidationError({"password2": _("The two password fields didn't match.")})

        if attrs.get("gender") == CustomUser.Gender.CUSTOM:
            custom = attrs.get("custom_gender")
            if not custom or str(custom).strip() == "":
                raise serializers.ValidationError(
                    {"custom_gender": _("The custom gender field cannot be empty when gender is CUSTOM.")}
                )

        doc_type_lengths = {
            "01": 8,
            "04": 12,
            "06": 11,
            "07": 12,
        }
        doc_type = attrs.get("document_type")
        doc_value = attrs.get("document_value")
        required_length = doc_type_lengths.get(doc_type)
        if required_length and doc_value and len(str(doc_value)) != required_length:
            raise serializers.ValidationError(
                {
                    "document_value": _(
                        f"Document value for type '{doc_type}' must be exactly {required_length} digits/characters."
                    )
                }
            )

        return attrs

    def get_cleaned_data(self):
        return {
            "email": self.validated_data.get("email", ""),  # type: ignore
            "password1": self.validated_data.get("password1", ""),  # type: ignore
            "first_name": self.validated_data.get("first_name", ""),  # type: ignore
            "last_name": self.validated_data.get("last_name", ""),  # type: ignore
            "gender": self.validated_data.get("gender", CustomUser.Gender.NONE),  # type: ignore
            "custom_gender": self.validated_data.get("custom_gender"),  # type: ignore
            "phone": self.validated_data.get("phone"),  # type: ignore
            "birth_date": self.validated_data.get("birth_date"),  # type: ignore
            "document_type": self.validated_data.get("document_type"),  # type: ignore
            "document_value": self.validated_data.get("document_value"),  # type: ignore
            "enterprise": self.validated_data.get("enterprise", None),  # type: ignore
        }

    def custom_signup(self, request, user):
        patient_group, _ = Group.objects.get_or_create(name="PATIENT")
        user.groups.add(patient_group)
        assign_perm("authenticationApp.view_customuser", user, user)
        assign_perm("authenticationApp.change_customuser", user, user)
        return super().custom_signup(request, user)

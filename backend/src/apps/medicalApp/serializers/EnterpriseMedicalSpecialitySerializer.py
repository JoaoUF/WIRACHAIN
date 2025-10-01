from rest_framework import serializers
from ..models import EnterpriseMedicalSpeciality, MedicalSpeciality
from authenticationApp.models import CustomUser


class EnterpriseMedicalSpecialitySerializer(serializers.ModelSerializer):
    enterprise_user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )
    medical_speciality = serializers.PrimaryKeyRelatedField(
        queryset=MedicalSpeciality.objects.all()
    )

    class Meta:
        model = EnterpriseMedicalSpeciality
        fields = ["id", "enterprise_user", "medical_speciality", "created", "modified"]
        read_only_fields = ["created", "modified"]

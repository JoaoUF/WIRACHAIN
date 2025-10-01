from rest_framework import serializers
from ..models import DoctorMedicalSpeciality, MedicalSpeciality
from authenticationApp.models import CustomUser


class DoctorMedicalSpecialitySerializer(serializers.ModelSerializer):
    doctor_user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    medical_speciality = serializers.PrimaryKeyRelatedField(
        queryset=MedicalSpeciality.objects.all()
    )

    class Meta:
        model = DoctorMedicalSpeciality
        fields = ["id", "doctor_user", "medical_speciality", "created", "modified"]
        read_only_fields = ["created", "modified"]

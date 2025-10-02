from rest_framework import serializers
from ..models import DoctorSpeciality, Speciality
from authenticationApp.models import CustomUser


class DoctorSpecialitySerializer(serializers.ModelSerializer):
    doctor_user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    speciality = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all())

    class Meta:
        model = DoctorSpeciality
        fields = ["id", "doctor_user", "speciality", "created", "modified"]
        read_only_fields = ["created", "modified"]

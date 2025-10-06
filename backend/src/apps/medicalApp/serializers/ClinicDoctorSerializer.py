from rest_framework import serializers
from ..models import ClinicDoctor, Clinic
from authenticationApp.models import CustomUser


class ClinicDoctorSerializer(serializers.ModelSerializer):
    doctor_user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    clinic = serializers.PrimaryKeyRelatedField(queryset=Clinic.objects.all())

    class Meta:
        model = ClinicDoctor
        fields = ["id", "doctor_user", "clinic"]

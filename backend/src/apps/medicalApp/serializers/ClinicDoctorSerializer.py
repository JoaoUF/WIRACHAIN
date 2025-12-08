from rest_framework import serializers
from ..models import ClinicDoctor, Clinic
from authenticationApp.models import CustomUser
from .ExtraSerializer import RelatedIdDisplayField


class ClinicDoctorSerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=Clinic.objects.all())
    doctor_user = RelatedIdDisplayField(queryset=CustomUser.objects.all())

    class Meta:
        model = ClinicDoctor
        fields = ["id", "doctor_user", "clinic"]

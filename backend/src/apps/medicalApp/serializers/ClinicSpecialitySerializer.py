from rest_framework import serializers
from ..models import ClinicSpeciality, Speciality


class ClinicSpecialitySerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=ClinicSpeciality.objects.all())
    speciality = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all())

    class Meta:
        model = ClinicSpeciality
        fields = ["id", "clinic", "speciality", "created", "modified"]
        read_only_fields = ["created", "modified"]

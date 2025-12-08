from rest_framework import serializers
from ..models import ClinicSpeciality, Speciality
from .ExtraSerializer import RelatedIdDisplayField


class ClinicSpecialitySerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=ClinicSpeciality.objects.all())
    speciality = RelatedIdDisplayField(queryset=Speciality.objects.all())

    class Meta:
        model = ClinicSpeciality
        fields = ["id", "clinic", "speciality"]

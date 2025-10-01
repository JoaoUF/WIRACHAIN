from rest_framework import serializers
from ..models import MedicalSpeciality


class MedicalSpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalSpeciality
        fields = [
            "id",
            "name",
            "description",
            "created",
            "modified",
            "status",
            "activate_date",
            "deactivate_date",
        ]
        read_only_fields = ["created", "modified"]

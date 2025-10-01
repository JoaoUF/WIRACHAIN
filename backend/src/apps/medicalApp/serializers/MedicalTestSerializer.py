from rest_framework import serializers
from ..models import MedicalTest


class MedicalTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalTest
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

from rest_framework import serializers
from ..models import DoctorTurn


class DoctorTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorTurn
        fields = ["id", "start_time", "end_time"]

from rest_framework import serializers
from ..models import DoctorSchedule
from .DoctorTurnSerializer import DoctorTurnSerializer


class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source="get_day_of_week_display", read_only=True)
    turns = DoctorTurnSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorSchedule
        fields = [
            "id",
            "doctor",
            "day_of_week",
            "day_of_week_display",
            "turns",
        ]

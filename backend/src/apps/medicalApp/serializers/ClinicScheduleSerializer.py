from rest_framework import serializers
from ..models import ClinicSchedule


class ClinicScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(
        source="get_day_of_week_display", read_only=True
    )

    class Meta:
        model = ClinicSchedule
        fields = [
            "id",
            "clinic",
            "day_of_week",
            "day_of_week_display",
            "open_time",
            "close_time",
        ]
        read_only_fields = ["id", "day_of_week_display"]

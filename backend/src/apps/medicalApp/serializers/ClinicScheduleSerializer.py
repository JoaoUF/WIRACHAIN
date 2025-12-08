from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from ..models import ClinicSchedule, Clinic


class ClinicScheduleSerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=Clinic.objects.all())

    class Meta:
        model = ClinicSchedule
        fields = [
            "id",
            "clinic",
            "day_of_week",
            "open_time",
            "close_time",
        ]
        read_only_fields = ["id"]

    def get_day_of_week_display(self, obj):
        return obj.get_day_of_week_display()

    def validate(self, data):
        # Resolve clinic and day_of_week taking into account updates (instance)
        open_time = data.get("open_time", getattr(self.instance, "open_time", None))
        close_time = data.get("close_time", getattr(self.instance, "close_time", None))

        # Validate times if both provided / available
        if open_time is not None and close_time is not None:
            if open_time >= close_time:
                raise serializers.ValidationError({"open_time": _("open_time must be before close_time.")})

        return data

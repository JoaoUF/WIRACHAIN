from django.contrib import admin
from ..models import ClinicSchedule


@admin.register(ClinicSchedule)
class ClinicScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "clinic",
        "day_of_week",
        "get_day_of_week_display",
        "open_time",
        "close_time",
    )
    list_filter = ("clinic", "day_of_week")
    search_fields = ("clinic__name",)
    ordering = ("clinic", "day_of_week")
    readonly_fields = ()

    def get_day_of_week_display(self, obj):
        return obj.get_day_of_week_display()

    get_day_of_week_display.short_description = "Day of Week"

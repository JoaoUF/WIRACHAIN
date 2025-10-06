from django.contrib import admin
from ..models import DoctorSchedule, DoctorTurn


class DoctorTurnInline(admin.TabularInline):
    model = DoctorTurn
    extra = 0


@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "doctor",
        "day_of_week",
        "get_day_of_week_display",
    )
    list_filter = ("doctor", "day_of_week")
    search_fields = ("doctor__username", "doctor__email")
    ordering = ("doctor", "day_of_week")
    inlines = [DoctorTurnInline]

    def get_day_of_week_display(self, obj):
        return obj.get_day_of_week_display()

    get_day_of_week_display.short_description = "Day of Week"

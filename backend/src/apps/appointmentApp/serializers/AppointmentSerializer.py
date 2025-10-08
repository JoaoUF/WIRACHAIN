from rest_framework import serializers
from ..models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_display = serializers.StringRelatedField(source="patient", read_only=True)
    doctor_display = serializers.StringRelatedField(source="doctor", read_only=True)
    clinic_display = serializers.StringRelatedField(source="clinic", read_only=True)
    speciality_display = serializers.StringRelatedField(source="speciality", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_display",
            "doctor",
            "doctor_display",
            "clinic",
            "clinic_display",
            "speciality",
            "speciality_display",
            "date",
            "start_time",
            "end_time",
            "status",
            "status_display",
            "notes",
        ]

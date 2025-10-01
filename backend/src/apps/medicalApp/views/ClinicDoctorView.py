from rest_framework import viewsets, permissions
from ..models import ClinicDoctor
from ..serializers import ClinicDoctorSerializer


class ClinicDoctorView(viewsets.ModelViewSet):
    queryset = ClinicDoctor.objects.all()
    serializer_class = ClinicDoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_user", "clinic"]

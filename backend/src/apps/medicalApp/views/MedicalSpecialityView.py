from rest_framework import viewsets, permissions
from ..models import MedicalSpeciality
from ..serializers import MedicalSpecialitySerializer


class MedicalSpecialityView(viewsets.ModelViewSet):
    queryset = MedicalSpeciality.objects.all()
    serializer_class = MedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]

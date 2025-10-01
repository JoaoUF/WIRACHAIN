from rest_framework import viewsets, permissions
from ..models import MedicalTest
from ..serializers import MedicalTestSerializer


class MedicalTestView(viewsets.ModelViewSet):
    queryset = MedicalTest.objects.all()
    serializer_class = MedicalTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]

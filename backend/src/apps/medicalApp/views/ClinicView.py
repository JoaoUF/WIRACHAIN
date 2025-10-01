from rest_framework import viewsets, permissions
from ..models import Clinic
from ..serializers import ClinicSerializer


class ClinicView(viewsets.ModelViewSet):

    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = [
        "city",
        "country",
        "enterprise_user",
    ]

from rest_framework import viewsets, permissions
from ..models import EnterpriseMedicalSpeciality
from ..serializers import EnterpriseMedicalSpecialitySerializer


class EnterpriseMedicalSpecialityView(viewsets.ModelViewSet):
    queryset = EnterpriseMedicalSpeciality.objects.all()
    serializer_class = EnterpriseMedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["enterprise_user", "medical_speciality"]

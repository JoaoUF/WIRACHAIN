from rest_framework import viewsets, permissions
from ..models import DoctorMedicalSpeciality
from ..serializers import DoctorMedicalSpecialitySerializer


class DoctorMedicalSpecialityView(viewsets.ModelViewSet):
    queryset = DoctorMedicalSpeciality.objects.all()
    serializer_class = DoctorMedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_user", "medical_speciality"]

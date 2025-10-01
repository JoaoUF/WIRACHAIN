from rest_framework import viewsets, permissions
from ..models import EnterpriseMedicalTest
from ..serializers import EnterpriseMedicalTestSerializer


class EnterpriseMedicalTestView(viewsets.ModelViewSet):
    queryset = EnterpriseMedicalTest.objects.all()
    serializer_class = EnterpriseMedicalTestSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["enterprise_user", "medical_test"]

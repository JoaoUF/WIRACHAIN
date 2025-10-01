from rest_framework import serializers
from ..models import EnterpriseMedicalTest, MedicalTest
from authenticationApp.models import CustomUser


class EnterpriseMedicalTestSerializer(serializers.ModelSerializer):
    enterprise_user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )
    medical_test = serializers.PrimaryKeyRelatedField(
        queryset=MedicalTest.objects.all()
    )

    class Meta:
        model = EnterpriseMedicalTest
        fields = ["id", "enterprise_user", "medical_test", "created", "modified"]
        read_only_fields = ["created", "modified"]

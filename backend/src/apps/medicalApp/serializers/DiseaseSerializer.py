from rest_framework import serializers
from authenticationApp.models import CustomUser
from ..models import Disease


class DiseaseSerializer(serializers.ModelSerializer):
    enterprise_user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Disease
        fields = [
            "id",
            "name",
            "description",
            "status",
            "activate_date",
            "deactivate_date",
            "enterprise_user",
        ]

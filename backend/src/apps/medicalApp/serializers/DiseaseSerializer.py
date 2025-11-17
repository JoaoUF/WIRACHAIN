from rest_framework import serializers
from authenticationApp.models import CustomUser
from ..models import Disease
from ..validators import alphanumeric


class DiseaseSerializer(serializers.ModelSerializer):
    enterprise_user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    name = serializers.CharField(min_length=3, max_length=255, validators=[alphanumeric])
    description = serializers.CharField(min_length=10, max_length=255, required=True)

    class Meta:
        model = Disease
        fields = [
            "id",
            "name",
            "description",
            "enterprise_user",
            "status",
        ]

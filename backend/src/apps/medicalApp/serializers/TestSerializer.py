from rest_framework import serializers
from authenticationApp.models import CustomUser
from ..models import Test
from ..validators import alphanumeric


class TestSerializer(serializers.ModelSerializer):
    enterprise_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    name = serializers.CharField(min_length=3, max_length=255, validators=[alphanumeric])
    description = serializers.CharField(min_length=10, max_length=255, required=True)

    class Meta:
        model = Test
        fields = [
            "id",
            "name",
            "description",
            "enterprise_user",
            "status",
        ]

from rest_framework import serializers
from ..models import Speciality
from ..validators import alphanumeric


class SpecialitySerializer(serializers.ModelSerializer):
    enterprise_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    name = serializers.CharField(min_length=3, max_length=255, validators=[alphanumeric])
    description = serializers.CharField(min_length=10, max_length=255, required=True)

    class Meta:
        model = Speciality
        fields = [
            "id",
            "name",
            "description",
            "enterprise_user",
            "status",
        ]

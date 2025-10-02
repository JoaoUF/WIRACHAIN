from rest_framework import serializers
from ..models import ClinicTest, Test


class ClinicTestSerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=ClinicTest.objects.all())
    test = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all())

    class Meta:
        model = ClinicTest
        fields = ["id", "clinic", "test", "created", "modified"]
        read_only_fields = ["created", "modified"]

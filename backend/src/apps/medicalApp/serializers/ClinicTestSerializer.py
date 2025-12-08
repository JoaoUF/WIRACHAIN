from rest_framework import serializers
from ..models import ClinicTest, Test
from .ExtraSerializer import RelatedIdDisplayField


class ClinicTestSerializer(serializers.ModelSerializer):
    clinic = serializers.PrimaryKeyRelatedField(queryset=ClinicTest.objects.all())
    test = RelatedIdDisplayField(queryset=Test.objects.all())

    class Meta:
        model = ClinicTest
        fields = ["id", "clinic", "test"]

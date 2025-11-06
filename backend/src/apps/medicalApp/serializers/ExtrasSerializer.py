from rest_framework import serializers
from django.utils.translation import gettext_lazy as _


class BulkDeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
        help_text=_("List of Disease UUIDs to delete"),
    )


class BulkUpdateSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
        help_text=_("List of Disease UUIDs to update"),
    )
    status = serializers.IntegerField(help_text=_("New status value"))

from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField
from ..models import Clinic


class ClinicSerializer(serializers.ModelSerializer):
    city = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    phone = PhoneNumberField()
    enterprise_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Clinic
        fields = [
            "id",
            "name",
            "email",
            "website_url",
            "phone",
            "address",
            "city",
            "region",
            "country",
            "enterprise_user",
        ]

    def _display_for(self, instance):
        if instance is None:
            return None
        # prefer display_name then name then str(instance)
        display = getattr(instance, "name", None) or str(instance)
        pk = instance.pk
        # normalize UUID to string
        try:
            import uuid as _uuid

            if isinstance(pk, _uuid.UUID):
                pk = str(pk)
        except Exception:
            pass
        return {"id": pk, "name": display}

    def get_country(self, obj):
        # obj.country should be a model instance if select_related('country') is used in the view
        country = getattr(obj, "country", None)
        return self._display_for(country)

    def get_region(self, obj):
        # obj.region should be a model instance if select_related('region') is used in the view
        region = getattr(obj, "region", None)
        return self._display_for(region)

    def get_city(self, obj):
        # obj.region should be a model instance if select_related('region') is used in the view
        region = getattr(obj, "city", None)
        return self._display_for(region)


class ClinicListSerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    """
    Lightweight serializer used for list endpoints (table).
    Only include the fields needed by your UI table to minimize payload.
    """

    class Meta:
        model = Clinic
        fields = [
            "id",
            "name",
            "email",
            "country",
            "region",
        ]

    def _display_for(self, instance):
        if instance is None:
            return None
        # prefer display_name then name then str(instance)
        display = getattr(instance, "display_name", None) or getattr(instance, "name", None) or str(instance)
        pk = instance.pk
        # normalize UUID to string
        try:
            import uuid as _uuid

            if isinstance(pk, _uuid.UUID):
                pk = str(pk)
        except Exception:
            pass
        return {"id": pk, "name": display}

    def get_country(self, obj):
        # obj.country should be a model instance if select_related('country') is used in the view
        country = getattr(obj, "country", None)
        return self._display_for(country)

    def get_region(self, obj):
        # obj.region should be a model instance if select_related('region') is used in the view
        region = getattr(obj, "region", None)
        return self._display_for(region)


class ClinicDetailSerializer(ClinicSerializer):
    """
    Full serializer used for retrieve/create/update.
    Inherits fields and behavior from ClinicBaseSerializer.
    """

    class Meta(ClinicSerializer.Meta):
        fields = ClinicSerializer.Meta.fields

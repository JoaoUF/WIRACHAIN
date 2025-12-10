from rest_framework import serializers
import uuid


class RelatedIdDisplayField(serializers.PrimaryKeyRelatedField):
    """
    Accept a PK on input; on output return {"id": <pk>, "name": "<display>"}.

    Behavior:
    - If DRF provides a model instance, use it.
    - If DRF provides a PK (int/str/UUID), try to resolve:
        1) self.get_queryset().filter(pk=value).first()
        2) if that fails, fallback to model._default_manager.filter(pk=value).first()
    - Finally pick display attribute in order: display_name, name, code2, first_name, str(instance).
    """

    def to_representation(self, value):
        if value is None:
            return None

        instance = value

        # If not an instance, try to resolve using queryset or model manager
        if not hasattr(value, "__dict__"):
            pk_value = value
            # Try field queryset first (respects any filtering you configured)
            qs = None
            try:
                qs = self.get_queryset()
            except Exception:
                qs = getattr(self, "queryset", None)

            instance = None
            if qs is not None:
                try:
                    instance = qs.filter(pk=pk_value).first()
                except Exception:
                    instance = None

            # Fallback to model default manager (unfiltered)
            if instance is None:
                model = None
                if qs is not None and hasattr(qs, "model"):
                    model = qs.model
                else:
                    # try to infer model from queryset attr
                    try:
                        model = getattr(self, "queryset").model  # type: ignore
                    except Exception:
                        model = None

                if model is not None:
                    try:
                        instance = model._default_manager.filter(pk=pk_value).first()
                    except Exception:
                        instance = None

            # If still not found, return PK as last-resort display
            if instance is None:
                pk = pk_value
                if isinstance(pk, uuid.UUID):
                    pk = str(pk)
                return {"id": pk, "name": str(pk)}

        # Now we have an instance — pick its display attribute
        display = (
            getattr(instance, "display_name", None)
            or getattr(instance, "name", None)
            or getattr(instance, "code2", None)
            or getattr(instance, "first_name", None)
            or ""
        )

        if not display:
            try:
                display = str(instance)
            except Exception:
                display = ""

        pk = instance.pk
        if isinstance(pk, uuid.UUID):
            pk = str(pk)

        return {"id": pk, "name": display}

import uuid
from django.utils.translation import gettext_lazy as _
from django.db import models


class Model(models.Model):
    id = models.UUIDField(_("id"), primary_key=True, default=uuid.uuid4, unique=True)

    class Meta:
        abstract = True

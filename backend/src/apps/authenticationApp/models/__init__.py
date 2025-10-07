from authenticationApp.models.CustomUser import CustomUser

from auditlog.registry import auditlog

auditlog.register(CustomUser)

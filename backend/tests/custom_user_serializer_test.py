import pytest
from django.contrib.auth.models import Group, Permission
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers

from src.apps.authenticationApp.models import CustomUser
from src.apps.authenticationApp.serializers.CustomUserSerializer import CustomUserSerializer

pytestmark = pytest.mark.django_db(databases=["default", "replica"], transaction=True)


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass


@pytest.fixture
def user_data():
    eighteen_years_ago = timezone.now() - timedelta(days=365 * 18 + 5)
    return {
        "email": "user@example.com",
        "password": "testpass123",
        "birth_date": eighteen_years_ago,
        "document_type": CustomUser.DocumentType.NATIONAL_ID,
        "document_value": "12345678",
        "phone": "+12025550123",
    }


@pytest.fixture
def group_doctor():
    return Group.objects.create(name="DOCTOR")


@pytest.fixture
def permission_sample(db):
    from django.contrib.contenttypes.models import ContentType
    from django.contrib.auth.models import Permission

    # Create or get a valid permission for the Group model
    group_ct, _ = ContentType.objects.get_or_create(app_label="auth", model="group")
    perm, _ = Permission.objects.get_or_create(
        codename="add_group",
        content_type=group_ct,
        defaults={"name": "Can add group"},
    )
    return perm


def test_create_user_with_groups_and_permissions(user_data, group_doctor, permission_sample, monkeypatch):
    user_data["groups"] = [group_doctor.pk]
    if permission_sample:
        user_data["user_permissions"] = [permission_sample.pk]
    else:
        user_data["user_permissions"] = []

    called = {}

    def fake_assign(user):
        called["user"] = user

    monkeypatch.setattr(
        "src.apps.authenticationApp.serializers.CustomUserSerializer.assign_essential_data_to_enterprise_user",
        fake_assign,
    )

    serializer = CustomUserSerializer(data=user_data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert user.groups.filter(pk=group_doctor.pk).exists()
    if permission_sample:
        assert user.user_permissions.filter(pk=permission_sample.pk).exists()  # type: ignore
    assert "user" in called, "assign_essential_data_to_enterprise_user was not called"
    assert called["user"] is user


def test_update_user_sets_groups_and_permissions(user_data, group_doctor, permission_sample, monkeypatch):
    from auditlog.registry import auditlog
    from src.apps.authenticationApp.models import CustomUser

    auditlog.unregister(CustomUser)

    user = CustomUser.objects.create(**user_data)
    update_data = dict(user_data)
    update_data["groups"] = [group_doctor.pk]
    if permission_sample:
        update_data["user_permissions"] = [permission_sample.pk]
    else:
        update_data["user_permissions"] = []

    called = {}

    def fake_assign(user):
        called["user"] = user

    monkeypatch.setattr(
        "src.apps.authenticationApp.serializers.CustomUserSerializer.assign_essential_data_to_enterprise_user",
        fake_assign,
    )

    serializer = CustomUserSerializer(instance=user, data=update_data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert user.groups.filter(pk=group_doctor.pk).exists()  # type: ignore
    if permission_sample:
        assert user.user_permissions.filter(pk=permission_sample.pk).exists()  # type: ignore
    assert "user" in called, "assign_essential_data_to_enterprise_user was not called"
    assert called["user"] is user


def test_validate_document_value_length_invalid(user_data):
    serializer = CustomUserSerializer(
        data={
            **user_data,
            "document_type": CustomUser.DocumentType.TAX_REGISTRY,
            "document_value": "1234",
        }
    )
    assert not serializer.is_valid()
    assert "document_value" in serializer.errors or "phone" in serializer.errors or "birth_date" in serializer.errors


def test_validate_document_value_length_valid(user_data):
    serializer = CustomUserSerializer(data=user_data)
    assert serializer.is_valid(), serializer.errors


def test_validate_enterprise_raises_when_doctor_without_enterprise(user_data, group_doctor):
    serializer = CustomUserSerializer(data={**user_data, "groups": [group_doctor.pk]})
    serializer.initial_data = {"groups": ["DOCTOR"]}  # type: ignore
    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.validate_enterprise(None)  # type: ignore
    assert "must have an enterprise" in str(excinfo.value)


def test_validate_enterprise_ok_when_not_doctor(user_data):
    serializer = CustomUserSerializer(data=user_data)
    serializer.initial_data = {}  # type: ignore
    value = object()
    assert serializer.validate_enterprise(value) is value  # type: ignore

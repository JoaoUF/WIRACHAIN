import pytest
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import AnonymousUser, Group
from tests.factories import CustomUserFactory, GroupFactory
from src.apps.authenticationApp.permissions import (
    IsAdmin,
    IsEnterpriseBasic,
    IsEnterprisePremium,
    IsEnterpriseProfessional,
    IsDoctor,
    IsPatient,
)


@pytest.fixture
def factory():
    return APIRequestFactory()


@pytest.mark.django_db(databases=["default", "replica"])
@pytest.mark.parametrize(
    "perm_class, allowed_group",
    [
        (IsAdmin, "ADMIN"),
        (IsEnterpriseBasic, "ENTERPRISE_BASIC"),
        (IsEnterprisePremium, "ENTERPRISE_PREMIUM"),
        (IsEnterpriseProfessional, "ENTERPRISE_PROFESSIONAL"),
        (IsDoctor, "DOCTOR"),
        (IsPatient, "PATIENT"),
    ],
)
def test_has_permission_denies_for_other_groups(factory, perm_class, allowed_group):
    all_groups = {"ADMIN", "ENTERPRISE_BASIC", "ENTERPRISE_PREMIUM", "ENTERPRISE_PROFESSIONAL", "DOCTOR", "PATIENT"}
    for group_name in all_groups - {allowed_group}:
        group = GroupFactory(name=group_name)
        user = CustomUserFactory(groups=[group])
        request = factory.get("/")
        request.user = user
        perm = perm_class()
        assert not perm.has_permission(request, None)


@pytest.mark.django_db(databases=["default", "replica"])
@pytest.mark.parametrize(
    "perm_class",
    [
        IsAdmin,
        IsEnterpriseBasic,
        IsEnterprisePremium,
        IsEnterpriseProfessional,
        IsDoctor,
        IsPatient,
    ],
)
def test_has_permission_denies_for_anonymous(factory, perm_class):
    request = factory.get("/")
    request.user = AnonymousUser()
    perm = perm_class()
    assert not perm.has_permission(request, None)

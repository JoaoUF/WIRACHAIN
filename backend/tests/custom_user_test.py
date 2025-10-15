import pytest
from django.core.exceptions import ValidationError
from tests.factories import CustomUserFactory


@pytest.mark.django_db(databases=["default", "replica"])
def test_clean_valid_user():
    user = CustomUserFactory(document_type="01", document_value="12345678")
    user.full_clean()


@pytest.mark.django_db(databases=["default", "replica"])
def test_validate_enterprise_doctor_relationship_non_doctor_with_enterprise():
    enterprise = CustomUserFactory()
    user = CustomUserFactory(enterprise=enterprise)
    with pytest.raises(ValidationError, match="Only doctors can be linked to an enterprise."):
        user.full_clean()


@pytest.mark.django_db(databases=["default", "replica"])
def test_validate_document_value_length_too_short():
    user = CustomUserFactory(document_type="01", document_value="1234")
    with pytest.raises(ValidationError) as excinfo:
        user.full_clean()
    assert "must be exactly 8 digits/characters" in str(excinfo.value)


@pytest.mark.django_db(databases=["default", "replica"])
def test_validate_document_value_length_too_long():
    user = CustomUserFactory(document_type="06", document_value="1234567890123")
    with pytest.raises(ValidationError) as excinfo:
        user.full_clean()
    assert "must be exactly 11 digits/characters" in str(excinfo.value)


@pytest.mark.django_db(databases=["default", "replica"])
def test_validate_document_value_length_valid():
    user = CustomUserFactory(document_type="04", document_value="123456789012")
    user.full_clean()

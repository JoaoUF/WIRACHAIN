import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_user_success():
    user = User.objects.create_user(
        email="user1@example.com",
        password="testpass123",
        birth_date=timezone.now().replace(year=timezone.now().year - 25),  # or a valid date
        document_type="01",
        document_value="12345678",
        phone="+12025550123",
    )  # type: ignore
    assert user.email == "user1@example.com"
    assert user.check_password("testpass123")
    assert user.is_active is True


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_user_without_email_raises():
    with pytest.raises(ValueError, match="The Email must be set"):
        User.objects.create_user(email=None, password="pw123")  # type: ignore


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_user_normalizes_email():
    user = User.objects.create_user(
        email="TEST@Example.COM",
        password="pw123",
        birth_date=timezone.now(),
        document_type="01",
        document_value="12345678",
        phone="+12025550123",
    )  # type: ignore
    assert user.email == "TEST@example.com"


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_superuser_sets_required_flags():
    superuser = User.objects.create_superuser(
        email="admin@example.com",
        password="pw321",
        birth_date=timezone.now().replace(year=timezone.now().year - 30),
        document_type="01",
        document_value="98765432",
        phone="+12025550124",
    )  # type: ignore
    assert superuser.is_staff is True
    assert superuser.is_superuser is True
    assert superuser.is_active is True


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_superuser_with_is_staff_false_raises():
    with pytest.raises(ValueError, match="Superuser must have is_staff=True."):
        User.objects.create_superuser(email="admin2@example.com", password="pw123", is_staff=False)  # type: ignore


@pytest.mark.django_db(databases=["default", "replica"])
def test_create_superuser_with_is_superuser_false_raises():
    with pytest.raises(ValueError, match="Superuser must have is_superuser=True."):
        User.objects.create_superuser(email="admin3@example.com", password="pw123", is_superuser=False)  # type: ignore

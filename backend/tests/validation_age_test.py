import pytest
from datetime import date, timedelta

from src.apps.authenticationApp.validators import validate_age_minimum
from django.core.exceptions import ValidationError


def test_validate_age_minimum_allows_18_years_old():
    today = date.today()
    birthday = date(today.year - 18, today.month, today.day)
    validate_age_minimum(birthday)


def test_validate_age_minimum_allows_above_18():
    today = date.today()
    birthday = date(today.year - 25, today.month, today.day)
    validate_age_minimum(birthday)


def test_validate_age_minimum_raises_for_just_under_18():
    today = date.today()
    birthday = today.replace(year=today.year - 18) + timedelta(days=1)
    with pytest.raises(ValidationError) as excinfo:
        validate_age_minimum(birthday)
    assert "at least 18" in str(excinfo.value)


def test_validate_age_minimum_raises_for_17_years_old():
    today = date.today()
    birthday = date(today.year - 17, today.month, today.day)
    with pytest.raises(ValidationError) as excinfo:
        validate_age_minimum(birthday)
    assert "at least 18" in str(excinfo.value)

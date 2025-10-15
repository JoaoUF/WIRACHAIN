import pytest
import json
from unittest.mock import patch, mock_open, MagicMock

# Adjust this to your actual import path!
from src.apps.authenticationApp.serializers import enterprise_data


def test_load_json_reads_and_parses_file(monkeypatch):
    # Arrange
    fake_data = {"foo": "bar"}
    m = mock_open(read_data=json.dumps(fake_data))
    filename = "myfile.json"
    json_path = enterprise_data.os.path.join(enterprise_data.ESSENTIAL_DATA_DIR, filename)

    # Patch open and json.load
    with patch("builtins.open", m):
        with patch("json.load", return_value=fake_data) as mock_json_load:
            # Act
            result = enterprise_data.load_json(filename)
            # Assert
            m.assert_called_once_with(json_path, encoding="utf-8")
            mock_json_load.assert_called_once()
            assert result == fake_data


@patch("src.apps.authenticationApp.serializers.enterprise_data.Test")
@patch("src.apps.authenticationApp.serializers.enterprise_data.Speciality")
@patch("src.apps.authenticationApp.serializers.enterprise_data.Disease")
def test_assign_essential_data_to_enterprise_user_creates_objects(
    mock_Disease, mock_Speciality, mock_Test, monkeypatch
):
    # Arrange: fake user with groups
    user = MagicMock()
    user.groups.filter.return_value.exists.return_value = True

    # Patch the ESSENTIAL_* lists to contain fake data
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_TESTS", [{"name": "T1", "description": "descT"}])
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_SPECIALITIES", [{"name": "S1", "description": "descS"}])
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_DISEASES", [{"name": "D1", "description": "descD"}])

    # Act
    enterprise_data.assign_essential_data_to_enterprise_user(user)

    # Assert: objects are created with correct fields
    mock_Test.objects.create.assert_called_once_with(name="T1", description="descT", enterprise_user=user)
    mock_Speciality.objects.create.assert_called_once_with(name="S1", description="descS", enterprise_user=user)
    mock_Disease.objects.create.assert_called_once_with(name="D1", description="descD", enterprise_user=user)


def test_assign_essential_data_to_enterprise_user_does_nothing_if_no_group(monkeypatch):
    # Arrange: user with no group match
    user = MagicMock()
    user.groups.filter.return_value.exists.return_value = False

    # Patch the ESSENTIAL_* lists to contain fake data (won't be used)
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_TESTS", [{"name": "T1"}])
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_SPECIALITIES", [{"name": "S1"}])
    monkeypatch.setattr(enterprise_data, "ESSENTIAL_DISEASES", [{"name": "D1"}])

    # Patch the models so nothing will break if called
    with (
        patch("src.apps.authenticationApp.serializers.enterprise_data.Test") as mock_Test,
        patch("src.apps.authenticationApp.serializers.enterprise_data.Speciality") as mock_Speciality,
        patch("src.apps.authenticationApp.serializers.enterprise_data.Disease") as mock_Disease,
    ):
        # Act
        enterprise_data.assign_essential_data_to_enterprise_user(user)
        # Assert: no object creation at all
        mock_Test.objects.create.assert_not_called()
        mock_Speciality.objects.create.assert_not_called()
        mock_Disease.objects.create.assert_not_called()

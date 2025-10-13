import pytest


@pytest.mark.django_db(databases=["default", "replica"])
def test_admin_url(client):
    resp = client.get("/admin/")
    assert resp.status_code in [200, 302, 404]


@pytest.mark.django_db(databases=["default", "replica"])
def test_authentication_app_url(client):
    resp = client.get("/api/v1/users/")
    assert resp.status_code in [200, 302, 404]


@pytest.mark.django_db(databases=["default", "replica"])
def test_medical_app_url(client):
    resp = client.get("/api/v1/clinics/")
    assert resp.status_code in [200, 302, 404]


@pytest.mark.django_db(databases=["default", "replica"])
def test_appointment_app_url(client):
    resp = client.get("/api/v1/appointments/")
    assert resp.status_code in [200, 302, 404]

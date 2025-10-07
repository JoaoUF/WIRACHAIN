import os
import json
from medicalApp.models import Test, Speciality, Disease

ESSENTIAL_DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "json"
)


def load_json(filename):
    json_path = os.path.join(ESSENTIAL_DATA_DIR, filename)
    with open(json_path, encoding="utf-8") as f:
        return json.load(f)


ESSENTIAL_TESTS = load_json("essential_tests.json")
ESSENTIAL_SPECIALITIES = load_json("essential_specialities.json")
ESSENTIAL_DISEASES = load_json("essential_diseases.json")

ENTERPRISE_GROUPS = {
    "ENTERPRISE_BASIC",
    "ENTERPRISE_PREMIUM",
    "ENTERPRISE_PROFESSISONAL",
}


def assign_essential_data_to_enterprise_user(user):
    if user.groups.filter(name__in=ENTERPRISE_GROUPS).exists():
        for test_data in ESSENTIAL_TESTS:
            Test.objects.create(
                name=test_data["name"],
                description=test_data.get("description", ""),
                enterprise_user=user,
            )
        for speciality_data in ESSENTIAL_SPECIALITIES:
            Speciality.objects.create(
                name=speciality_data["name"],
                description=speciality_data.get("description", ""),
                enterprise_user=user,
            )
        for disease_data in ESSENTIAL_DISEASES:
            Disease.objects.create(
                name=disease_data["name"],
                description=disease_data.get("description", ""),
                enterprise_user=user,
            )

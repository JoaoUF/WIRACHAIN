"""
Seed medical data (Disease, Speciality, Test) and assign object-level permissions
(guardian) to the owner user only.

Differences from previous version:
- DATA does NOT include PKs; objects are created normally and the DB autogenerates PKs.
- Idempotent: uses get_or_create (unique by name + owner) and updates description if it changed.
- Assigns object perms only to the owning user (enterprise_user).
- Supports --models to select a subset, --user-pk to choose the owner, --dry-run and --no-assign-perms.

Usage:
    # dry run
    python manage.py seed_data_and_assign_perms --dry-run

    # real run (default user pk=2)
    python manage.py seed_data_and_assign_perms

    # seed only Disease and Test
    python manage.py seed_data_and_assign_perms --models medicalApp.Disease,medicalApp.Test

Notes:
- Requires django-guardian configured.
- Ensure the owner user (--user-pk) exists before running.
"""

from __future__ import annotations

from typing import Dict, List, Any, Iterable
from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

from guardian.shortcuts import assign_perm

User = get_user_model()

# Hardcoded data (no PKs). Each entry contains 'name' and optional 'description'.
DATA: Dict[str, List[Dict[str, Any]]] = {
    "medicalApp.Disease": [
        {"name": "Diabetes Mellitus", "description": "A group of diseases that result in too much sugar in the blood."},
        {"name": "Hypertension", "description": "High blood pressure."},
        {"name": "Asthma", "description": "A respiratory condition marked by spasms in the bronchi."},
        {"name": "Coronary Artery Disease", "description": "Damage or disease in the heart's major blood vessels."},
        {"name": "Chronic Kidney Disease", "description": "Gradual loss of kidney function."},
        {"name": "Chronic Obstructive Pulmonary Disease", "description": "Group of lung diseases that block airflow."},
        {"name": "Tuberculosis", "description": "Infectious disease affecting the lungs."},
        {"name": "Anemia", "description": "Lack of healthy red blood cells."},
        {"name": "Hepatitis B", "description": "Serious liver infection caused by the hepatitis B virus."},
        {"name": "HIV/AIDS", "description": "Human immunodeficiency virus infection."},
        {"name": "Alzheimer's Disease", "description": "Progressive disease that destroys memory."},
        {"name": "Osteoporosis", "description": "Bones become weak and brittle."},
        {"name": "Rheumatoid Arthritis", "description": "Chronic inflammatory disorder affecting joints."},
        {"name": "Parkinson's Disease", "description": "A disorder of the central nervous system."},
        {"name": "Epilepsy", "description": "A disorder in which nerve cell activity is disturbed."},
        {"name": "Migraine", "description": "A headache of varying intensity, often accompanied by nausea."},
        {"name": "Influenza", "description": "Common viral infection that can be deadly."},
        {"name": "Malaria", "description": "A disease caused by a plasmodium parasite."},
        {"name": "Cancer", "description": "A disease in which abnormal cells divide uncontrollably."},
        {"name": "COVID-19", "description": "Infectious disease caused by coronavirus."},
    ],
    "medicalApp.Speciality": [
        {"name": "Cardiology", "description": "Heart and blood vessel specialist"},
        {"name": "Neurology", "description": "Nervous system and brain specialist"},
        {"name": "Endocrinology", "description": "Hormone and gland specialist"},
        {"name": "Gastroenterology", "description": "Digestive system specialist"},
        {"name": "Pulmonology", "description": "Lung and respiratory system specialist"},
        {"name": "Nephrology", "description": "Kidney specialist"},
        {"name": "Dermatology", "description": "Skin specialist"},
        {"name": "Oncology", "description": "Cancer specialist"},
        {"name": "Hematology", "description": "Blood disorder specialist"},
        {"name": "Ophthalmology", "description": "Eye specialist"},
        {"name": "Orthopedics", "description": "Bone and joint specialist"},
        {"name": "Pediatrics", "description": "Child specialist"},
        {"name": "Geriatrics", "description": "Elderly specialist"},
        {"name": "Obstetrics and Gynecology", "description": "Women's health specialist"},
        {"name": "Psychiatry", "description": "Mental health specialist"},
        {"name": "Rheumatology", "description": "Joint and autoimmune disorder specialist"},
        {"name": "Immunology", "description": "Immune system specialist"},
        {"name": "Urology", "description": "Urinary tract and male reproductive specialist"},
        {"name": "Surgery", "description": "Surgical specialist"},
        {"name": "General Practice", "description": "Primary care physician"},
    ],
    "medicalApp.Test": [
        {"name": "Blood Test", "description": "Basic blood analysis"},
        {"name": "Urine Test", "description": "Urinalysis"},
        {"name": "Glucose Test", "description": "Blood sugar level measurement"},
        {"name": "Cholesterol Test", "description": "Measures cholesterol levels"},
        {"name": "Electrolyte Panel", "description": "Assesses electrolyte balance"},
        {"name": "Liver Function Test", "description": "Checks liver health"},
        {"name": "Kidney Function Test", "description": "Checks kidney performance"},
        {"name": "Thyroid Function Test", "description": "Evaluates thyroid hormones"},
        {"name": "Complete Blood Count", "description": "Measures different blood cells"},
        {"name": "Pregnancy Test", "description": "Detects pregnancy hormone"},
        {"name": "HIV Test", "description": "Detects HIV infection"},
        {"name": "COVID-19 PCR", "description": "Detects SARS-CoV-2 RNA"},
        {"name": "Vitamin D Test", "description": "Measures vitamin D levels"},
        {"name": "Allergy Test", "description": "Identifies allergen sensitivities"},
        {"name": "Stool Test", "description": "Analyzes stool for disorders"},
        {"name": "Pap Smear", "description": "Cervical cancer screening"},
        {"name": "Prostate Specific Antigen", "description": "Prostate cancer screening"},
        {"name": "Coagulation Test", "description": "Assesses blood clotting"},
        {"name": "X-Ray", "description": "Imaging test for bones/organs"},
        {"name": "ECG", "description": "Records electrical heart activity"},
    ],
}


def _iter_models(specs: Iterable[str]) -> List[str]:
    return [s.strip() for s in specs if s and s.strip()]


class Command(BaseCommand):
    help = "Seed hardcoded medical data (no PKs) and assign object-level permissions to the owning user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-pk", type=int, default=2, help="User PK to use as enterprise_user owner (default: 2)"
        )
        parser.add_argument("--dry-run", action="store_true", help="Print actions without writing to DB")
        parser.add_argument(
            "--no-assign-perms", action="store_true", help="Do not assign object permissions after creating objects"
        )
        parser.add_argument(
            "--models",
            type=str,
            default="",
            help="Comma-separated subset of models to process (e.g. 'medicalApp.Disease,medicalApp.Test')",
        )

    def handle(self, *args, **options):
        user_pk = options["user_pk"]
        dry_run = options["dry_run"]
        assign_perms_flag = not options["no_assign_perms"]
        models_opt = options["models"]

        # resolve the owner user
        try:
            owner = User.objects.get(pk=user_pk)
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(f"Owner user with pk={user_pk} not found. Create the user or choose another pk.")
            )
            return

        # decide which models to process
        if models_opt:
            model_specs = _iter_models(models_opt.split(","))
        else:
            model_specs = list(DATA.keys())

        processed_summary = {}

        for spec in model_specs:
            items = DATA.get(spec)
            if items is None:
                self.stdout.write(self.style.WARNING(f"No hardcoded data for model {spec}; skipping."))
                continue

            try:
                app_label, model_name = spec.split(".", 1)
                Model = apps.get_model(app_label, model_name)
            except Exception as exc:
                self.stderr.write(self.style.ERROR(f"Could not load model {spec}: {exc}"))
                continue

            # Verify model permissions exist; warn if missing (not fatal)
            try:
                ct = Model._meta.model_name
                Permission.objects.get(codename=f"view_{ct}", content_type__model=ct)
                Permission.objects.get(codename=f"change_{ct}", content_type__model=ct)
                Permission.objects.get(codename=f"delete_{ct}", content_type__model=ct)
            except Permission.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f"Model-level permissions for {spec} not found. Ensure migrations and setup_roles_permissions ran."
                    )
                )

            created = 0
            updated = 0

            # Use transaction per model to keep operations atomic per model
            with transaction.atomic():
                for item in items:
                    name = item.get("name")
                    description = item.get("description", "")

                    if dry_run:
                        self.stdout.write(f"[dry-run] Would create/update {spec} name={name!r} owner_pk={owner.pk}")
                        created += 1
                        continue

                    # identify object uniquely by (name, owner)
                    defaults = {"description": description, "enterprise_user": owner}
                    obj, was_created = Model.objects.get_or_create(name=name, enterprise_user=owner, defaults=defaults)
                    if was_created:
                        created += 1
                    else:
                        # update description if changed
                        updated_flag = False
                        if getattr(obj, "description", "") != description:
                            obj.description = description  # type: ignore
                            obj.save(update_fields=["description"])
                            updated_flag = True
                        if updated_flag:
                            updated += 1

                    # assign object perms to owner only
                    if assign_perms_flag:
                        try:
                            assign_perm(f"{Model._meta.app_label}.view_{Model._meta.model_name}", owner, obj)
                            assign_perm(f"{Model._meta.app_label}.change_{Model._meta.model_name}", owner, obj)
                            assign_perm(f"{Model._meta.app_label}.delete_{Model._meta.model_name}", owner, obj)
                        except Exception as exc:
                            self.stderr.write(
                                self.style.WARNING(f"Failed to assign object perms for {spec} name={name!r}: {exc}")
                            )

            processed_summary[spec] = {"created": created, "updated": updated}

        # Summary output
        self.stdout.write(self.style.SUCCESS("Seeding complete. Summary:"))
        for spec, counts in processed_summary.items():
            self.stdout.write(f" - {spec}: created={counts['created']}, updated={counts['updated']}")

        if dry_run:
            self.stdout.write(self.style.SUCCESS("Dry-run mode: no database changes were applied."))

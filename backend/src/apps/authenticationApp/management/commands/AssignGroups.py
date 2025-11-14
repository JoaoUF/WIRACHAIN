"""
Assign groups to existing users using a static mapping of user_pk -> group_name.

Usage:
  # Ensure groups exist (created by your setup_roles_permissions command)
  python manage.py setup_roles_permissions --config=config/roles_permissions.yaml

  # Dry-run first
  python manage.py assign_groups_static --dry-run

  # Run for real
  python manage.py assign_groups_static
"""

from __future__ import annotations

from typing import Dict
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

# EDIT THIS: static mapping of user PK -> list of group names
STATIC_USER_GROUPS: Dict[int, list] = {
    1: ["ADMIN"],
    2: ["ENTERPRISE_BASIC"],
    3: ["DOCTOR"],
    4: ["PATIENT"],
    # add more mappings as needed
}


class Command(BaseCommand):
    help = "Assign groups to users using a static mapping user_pk -> group_names."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Show planned changes only")

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        User = get_user_model()

        planned = []
        for user_pk, group_names in STATIC_USER_GROUPS.items():
            planned.append((user_pk, group_names))

        if not planned:
            self.stdout.write("No static assignments defined; nothing to do.")
            return

        self.stdout.write("Planned assignments:")
        for user_pk, names in planned:
            self.stdout.write(f" - user pk={user_pk} -> groups={names}")

        if dry_run:
            self.stdout.write(self.style.SUCCESS("Dry-run complete; no changes applied."))
            return

        applied = 0
        with transaction.atomic():
            for user_pk, names in planned:
                try:
                    user = User.objects.get(pk=user_pk)
                except User.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"User with pk={user_pk} not found; skipping."))
                    continue
                for name in names:
                    try:
                        group = Group.objects.get(name=name)
                    except Group.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Group '{name}' does not exist; skipping assignment for user {user_pk}."
                            )
                        )
                        continue
                    user.groups.add(group)  # idempotent
                applied += 1

        self.stdout.write(self.style.SUCCESS(f"Applied static group assignments for {applied} users."))

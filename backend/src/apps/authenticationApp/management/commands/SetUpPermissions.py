"""
Create groups and assign model + custom permissions from a YAML mapping file.
This command no longer assigns object-level permissions to existing users.
Use `assign_owner_object_perms` management command to bootstrap object perms for existing users.
"""

from __future__ import annotations

import os
from typing import Dict, List, Any, Optional

from django.apps import apps
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from django.db import transaction

try:
    import yaml
except Exception:
    yaml = None

STANDARD_PERM_MAP = {
    "view": "view_{model}",
    "add": "add_{model}",
    "change": "change_{model}",
    "delete": "delete_{model}",
}


def _human_perm_name(action: str, verbose_name: str) -> str:
    return f"Can {action} {verbose_name}"


class Command(BaseCommand):
    help = "Create groups and assign permissions from a YAML mapping file (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--config",
            "-c",
            required=True,
            help="Path to YAML mapping file (required). Example: config/roles_permissions.yaml",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show planned changes without modifying the DB.",
        )

    def load_mapping(self, path: str) -> Dict[str, Any]:
        if yaml is None:
            self.stderr.write(
                self.style.ERROR("PyYAML is required to load YAML mapping. Install with: pip install pyyaml")
            )
            raise SystemExit(1)
        if not os.path.exists(path):
            self.stderr.write(self.style.ERROR(f"Mapping file not found: {path}"))
            raise SystemExit(1)
        with open(path, "r", encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
        if not isinstance(data, dict) or "roles" not in data:
            self.stderr.write(self.style.ERROR("Mapping file must contain top-level 'roles' mapping"))
            raise SystemExit(1)
        return data

    def resolve_content_type(self, app_label: str, model_name: str) -> ContentType:
        try:
            model = apps.get_model(app_label, model_name)
        except LookupError:
            raise LookupError(f"Model not found: {app_label}.{model_name}")
        return ContentType.objects.get_for_model(model)

    def ensure_permission(self, codename: str, ct: ContentType, name: Optional[str] = None) -> Permission:
        perm, created = Permission.objects.get_or_create(
            codename=codename,
            content_type=ct,
            defaults={"name": name or codename},
        )
        return perm

    def handle(self, *args, **options):
        config_path: str = options["config"]
        dry_run: bool = options["dry_run"]

        mapping = self.load_mapping(config_path)
        roles_map = mapping.get("roles", {})

        if not isinstance(roles_map, dict):
            self.stderr.write(self.style.ERROR("'roles' must be a mapping of GROUP_NAME -> [entries]"))
            raise SystemExit(1)

        with transaction.atomic():
            groups: Dict[str, Group] = {}
            for group_name in roles_map.keys():
                g, created = Group.objects.get_or_create(name=group_name)
                groups[group_name] = g
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created group: {group_name}"))
                else:
                    self.stdout.write(f"Group exists: {group_name}")

            for group_name, entries in roles_map.items():
                if not entries:
                    self.stdout.write(f"No permissions declared for group {group_name}, skipping assignment.")
                    continue

                group = groups.get(group_name)
                if not group:
                    self.stderr.write(self.style.WARNING(f"Group {group_name} not found (skipping)"))
                    continue

                perms_to_assign: List[Permission] = []

                for ent in entries:
                    if not isinstance(ent, dict):
                        self.stderr.write(
                            self.style.WARNING(f"Invalid entry for group {group_name}: {ent} (must be a mapping)")
                        )
                        continue
                    app_label = ent.get("app")
                    model_name = ent.get("model")
                    perms = ent.get("perms", [])

                    if not app_label or not model_name or not perms:
                        self.stderr.write(
                            self.style.WARNING(f"Entry missing app/model/perms for group {group_name}: {ent}")
                        )
                        continue

                    try:
                        ct = self.resolve_content_type(app_label, model_name)
                    except LookupError as exc:
                        self.stderr.write(self.style.ERROR(str(exc)))
                        continue

                    for p in perms:
                        if p in STANDARD_PERM_MAP:
                            codename = STANDARD_PERM_MAP[p].format(model=model_name.lower())
                            human = _human_perm_name(p, ct.model_class()._meta.verbose_name)  # type: ignore
                            perm = self.ensure_permission(codename, ct, name=human)
                        else:
                            codename = p
                            human = (
                                ent.get("perm_names", {}).get(p)
                                or f"{p.replace('_', ' ').capitalize()} {ct.model_class()._meta.verbose_name}"  # type: ignore
                            )
                            perm = self.ensure_permission(codename, ct, name=human)
                        perms_to_assign.append(perm)

                unique_perms = {p.pk: p for p in perms_to_assign}.values()
                if dry_run:
                    self.stdout.write(
                        f"[dry-run] Would assign {len(list(unique_perms))} permission(s) to group {group_name}"
                    )
                    continue

                for perm in unique_perms:
                    group.permissions.add(perm)
                self.stdout.write(
                    self.style.SUCCESS(f"Assigned {len(list(unique_perms))} permission(s) to group {group_name}")
                )

        self.stdout.write(self.style.SUCCESS("setup_roles_permissions completed."))

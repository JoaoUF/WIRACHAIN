import factory
from django.contrib.auth.models import Group
from django.utils import timezone
from phonenumber_field.phonenumber import PhoneNumber
from src.apps.authenticationApp.models import CustomUser


class GroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Group
        django_get_or_create = ("name",)

    name = factory.Iterator(  # type: ignore
        [
            "ADMIN",
            "ENTERPRISE_BASIC",
            "ENTERPRISE_PREMIUM",
            "ENTERPRISE_PROFESSIONAL",
            "DOCTOR",
            "PATIENT",
        ]
    )


class CustomUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    email = factory.LazyAttribute(lambda o: f"{o.first_name.lower()}.{o.last_name.lower()}@example.com")  # type: ignore
    first_name = factory.Faker("first_name")  # type: ignore
    last_name = factory.Faker("last_name")  # type: ignore
    gender = factory.Iterator([choice[0] for choice in CustomUser.Gender.choices])  # type: ignore
    document_type = factory.Iterator([choice[0] for choice in CustomUser.DocumentType.choices])  # type: ignore
    phone = factory.LazyFunction(lambda: PhoneNumber.from_string("+15555555555"))  # type: ignore
    birth_date = factory.LazyFunction(lambda: timezone.now().replace(year=timezone.now().year - 25))  # type: ignore
    document_type = factory.Iterator([choice[0] for choice in CustomUser.DocumentType.choices])  # type: ignore
    document_value = factory.Sequence(lambda n: f"{n:08d}")  # type: ignore
    is_verified = True
    is_active = True
    is_staff = False
    password = factory.PostGenerationMethodCall("set_password", "password")  # type: ignore

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        manager = cls._get_manager(model_class)
        return manager.using("default").create(*args, **kwargs)

    @factory.post_generation  # type: ignore
    def groups(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for group in extracted:
                self.groups.add(group)  # type: ignore
            self.save()  # type: ignore

    @factory.post_generation  # type: ignore
    def enterprise(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        self.enterprise = extracted
        self.save()  # type: ignore

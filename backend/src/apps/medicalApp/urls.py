from rest_framework.routers import DefaultRouter
from .views import (
    ClinicView,
    ClinicDoctorView,
    DoctorSpecialityView,
    ClinicSpecialityView,
    ClinicTestView,
    SpecialityView,
    TestView,
    DiseaseView,
)

router = DefaultRouter()
router.register(r"clinics", ClinicView, basename="clinic")
router.register(r"diseases", DiseaseView, basename="disease")
router.register(r"specialities", SpecialityView, basename="speciality")
router.register(r"tests", TestView, basename="test")
router.register(r"clinic-doctors", ClinicDoctorView, basename="clinicdoctor")
router.register(
    r"doctor-specialities", DoctorSpecialityView, basename="doctorspeciality"
)
router.register(
    r"clinic-specialities", ClinicSpecialityView, basename="clinicspeciality"
)
router.register(r"clinic-tests", ClinicTestView, basename="clinictest")

urlpatterns = router.urls

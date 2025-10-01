from rest_framework.routers import DefaultRouter
from .views import (
    ClinicView,
    ClinicDoctorView,
    DoctorMedicalSpecialityView,
    EnterpriseMedicalSpecialityView,
    EnterpriseMedicalTestView,
    MedicalSpecialityView,
    MedicalTestView,
)

router = DefaultRouter()
router.register(r"clinics", ClinicView, basename="clinic")
router.register(r"clinic-doctors", ClinicDoctorView, basename="clinicdoctor")
router.register(
    r"doctor-medical-specialities",
    DoctorMedicalSpecialityView,
    basename="doctormedicalspeciality",
)
router.register(
    r"enterprise-medical-specialities",
    EnterpriseMedicalSpecialityView,
    basename="enterprisedmedicalspeciality",
)
router.register(
    r"enterprise-medical-tests",
    EnterpriseMedicalTestView,
    basename="enterprisedmedicaltest",
)
router.register(
    r"medical-specialities", MedicalSpecialityView, basename="medicalspeciality"
)
router.register(r"medical-tests", MedicalTestView, basename="medicaltest")

urlpatterns = router.urls

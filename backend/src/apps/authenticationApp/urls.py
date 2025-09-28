from rest_framework import routers
from .views import (
    AdminUserListViewSet,
    ClinicUserListViewSet,
    DoctorUserListViewSet,
    PatientUserListViewSet,
    CustomUserViewSet,
)

router = routers.DefaultRouter()
router.register(r"users/admin-list", AdminUserListViewSet, basename="admin-list")
router.register(r"users/clinic-list", ClinicUserListViewSet, basename="clinic-list")
router.register(r"users/doctor-list", DoctorUserListViewSet, basename="doctor-list")
router.register(r"users/patient-list", PatientUserListViewSet, basename="patient-list")
router.register(r"users", CustomUserViewSet, basename="user")

urlpatterns = router.urls

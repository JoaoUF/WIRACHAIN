from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorScheduleView, DoctorTurnView, AppointmentView

router = DefaultRouter()
router.register(r"doctor-schedules", DoctorScheduleView, basename="doctor-schedule")
router.register(r"doctor-turns", DoctorTurnView, basename="doctor-turn")
router.register(r"appointment", AppointmentView, basename="appointment")

urlpatterns = [
    path("", include(router.urls)),
]

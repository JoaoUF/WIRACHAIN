from appointmentApp.models.DoctorSchedule import DoctorSchedule
from appointmentApp.models.DoctorTurn import DoctorTurn
from appointmentApp.models.Appointment import Appointment, AppointmentStatus

from auditlog.registry import auditlog

auditlog.register(DoctorSchedule)
auditlog.register(DoctorTurn)
auditlog.register(Appointment)

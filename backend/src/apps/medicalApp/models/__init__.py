from medicalApp.models.Clinic import Clinic
from medicalApp.models.ClinicDoctor import ClinicDoctor
from medicalApp.models.Disease import Disease
from medicalApp.models.DoctorSpeciality import DoctorSpeciality
from medicalApp.models.ClinicTest import ClinicTest
from medicalApp.models.ClinicSpeciality import ClinicSpeciality
from medicalApp.models.Speciality import Speciality
from medicalApp.models.Test import Test
from medicalApp.models.ClinicSchedule import ClinicSchedule

from auditlog.registry import auditlog

auditlog.register(Clinic)
auditlog.register(ClinicDoctor)
auditlog.register(Disease)
auditlog.register(DoctorSpeciality)
auditlog.register(ClinicTest)
auditlog.register(ClinicSpeciality)
auditlog.register(Speciality)
auditlog.register(Test)
auditlog.register(ClinicSchedule)

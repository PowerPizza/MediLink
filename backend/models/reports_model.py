from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import BigInteger, String, Boolean, DateTime, func, ForeignKey
from datetime import datetime
from models.patients_model import Patients
from models.doctors_model import Doctors

class Reports(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    disease: Mapped[str] = mapped_column(String(200))
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id"))
    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id"))
    is_closed: Mapped[bool] = mapped_column(Boolean, default=False)
    report_file_name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    patient: Mapped[Patients] = relationship()
    doctor: Mapped[Doctors] = relationship()
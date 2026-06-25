from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import BigInteger, String, Integer, ForeignKey, DateTime, func, Boolean
from datetime import datetime
from enum import Enum
from typing import Optional

class BiometricMethods(Enum):
    FINGER_PRINT = "finger_print"
    FACE_RECOGNITION = "face_recognition"
    UNKNOWN = "unknown"

class Doctors(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(70))
    gmail: Mapped[str] = mapped_column(String(50))
    phone_no: Mapped[str] = mapped_column(String(16))
    specialization: Mapped[str] = mapped_column(String(50))
    experience: Mapped[int] = mapped_column(Integer)
    qualifications: Mapped[str] = mapped_column(String(255))
    pfp_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    biometric_method: Mapped[BiometricMethods] = mapped_column(String(50))
    verification_code: Mapped[str] = mapped_column(String(12))
    doctor_id: Mapped[str] = mapped_column(String(30))
    pin: Mapped[str] = mapped_column(String(255))
    agreed_pin_warn: Mapped[bool] = mapped_column(Boolean)
    accepted_terms: Mapped[bool] = mapped_column(Boolean)
    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self):
        return f"Doctors(id={self.id!r}, full_name={self.full_name!r}, hospital_id={self.hospital_id!r})"

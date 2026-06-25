from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import BigInteger, String, Integer, DateTime, func, Boolean
from enum import Enum
from datetime import datetime

class Gender(Enum):
    MALE = "male"
    FEMALE = "female"
    OTHERS = "others"


class Patients(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    fullname: Mapped[str] = mapped_column(String(70))
    gender: Mapped[Gender] = mapped_column(String(50))
    phone_no: Mapped[str] = mapped_column(String(20))
    pfp_url: Mapped[str] = mapped_column(String(255))
    gmail: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(255))
    patient_id: Mapped[str] = mapped_column(String(30))
    age: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
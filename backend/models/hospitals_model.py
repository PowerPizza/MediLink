from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import BigInteger, String, func, DateTime, Boolean
from datetime import datetime

class Hospitals(Base):
    __tablename__ = "hospitals"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    hospital_name: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(50))
    hospital_address: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self):
        return f"Hospitals(id={self.id!r}, hospital_name={self.hospital_name!r}, is_active={self.is_active!r})"

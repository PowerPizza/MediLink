from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.database import get_db
from services.auth_service import auth_service
from models.doctors_model import Doctors
from schemas.doctor_schemas import DoctorResponse
from schemas.hospital_schemas import HospitalResponse

doctor_router = APIRouter(prefix="/doctor")

@doctor_router.get("/")
def onGetDoctorInfo(user=Depends(auth_service.verifyJWT), db: Session = Depends(get_db)):
    # Returns current logged in doctor info extracted from JWT
    statement = select(Doctors).join(Doctors.hospital).where(Doctors.id == user["user_id"])
    doctor = db.execute(statement).scalar_one_or_none()
    if doctor:
        response = DoctorResponse(
            id=doctor.id,
            full_name=doctor.full_name,
            hospital=HospitalResponse(
                id=doctor.hospital.id,
                hospital_name=doctor.hospital.hospital_name,
                city=doctor.hospital.city
            )
        )
        return response
    else:
        return Response("Unable to find doctor info.", 404)
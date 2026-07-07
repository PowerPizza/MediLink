from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from sqlalchemy import select
from database.database import get_db
from services.auth_service import auth_service
from models.patients_model import Patients
from schemas.patient_schemas import PatientResponse

patient_router = APIRouter(prefix="/patient")

@patient_router.get("/")
def onGetPatientInfo(user=Depends(auth_service.verifyJWT), db: Session = Depends(get_db)):
    # Returns current logged in patient info extracted from JWT
    statement = select(Patients).where(Patients.id == user["user_id"])
    patient = db.execute(statement).scalar_one_or_none()
    if patient:
        response = PatientResponse(
            id=patient.id,
            fullname=patient.fullname,
            phone_no=patient.phone_no,
            patient_id=patient.patient_id,
            pfp_url=patient.pfp_url,
            age=patient.age,
            gmail=patient.gmail,
            gender=str(patient.gender),
            created_at=patient.created_at,
            updated_at=patient.updated_at,
            is_active=patient.is_active
        )
        return response
    else:
        return Response("Unable to find patient info.", 404)

@patient_router.get("/all_patient_ids")
def onGetAllPatientIds(user=Depends(auth_service.verifyJWT), db: Session=Depends(get_db)):
    statement = select(Patients.patient_id).where(Patients.is_active == True)
    response = db.execute(statement).all()
    response = list(map(lambda t: t[0], response))
    print(response)
    return response
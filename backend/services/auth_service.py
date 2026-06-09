from sqlalchemy.orm import Session
from database.database import get_db
from sqlalchemy import select, and_
from models.doctors_model import Doctors, BiometricMethods
from models.hospitals_model import Hospitals
from schemas.auth_schemas import DoctorCreateRequest, DoctorSigninRequest
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from config import getSettings
import jwt

class AuthService:
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/signup/doctor")

    @staticmethod
    def checkExistingGmail(gmail, session: Session):
        query = select(Doctors).filter_by(gmail=gmail)
        result = session.execute(query).fetchall()
        return len(result) > 0

    @staticmethod
    def createDoctor(create_request: DoctorCreateRequest, session: Session) -> str:
        hasher_ = PasswordHasher()
        try:
            if AuthService.checkExistingGmail(str(create_request.gmail), session):
                raise Exception('Gmail already exists.')

            hospital = Hospitals()
            hospital.hospital_name = create_request.hospital_name
            hospital.hospital_address = create_request.hospital_address
            hospital.city = create_request.city
            hospital.is_active = True
            session.add(hospital)
            session.flush()

            doctor = Doctors()
            doctor.doctor_id = create_request.doctor_id
            doctor.hospital_id = hospital.id
            doctor.full_name = create_request.full_name
            doctor.is_active = True
            doctor.gmail = str(create_request.gmail)
            doctor.accepted_terms = create_request.accepted_terms
            doctor.agreed_pin_warn = create_request.agreed_to_pin_warning
            doctor.biometric_method = create_request.biometric_method
            doctor.pfp_url = create_request.pfp_url
            doctor.experience = create_request.experience
            doctor.phone_no = create_request.phone_no
            doctor.pin = hasher_.get_password_hash(create_request.pin)
            doctor.qualifications = create_request.qualifications
            doctor.specialization = create_request.specialization
            doctor.verification_code = create_request.verification_code
            session.add(doctor)

            session.commit()
            session.refresh(doctor)

            print(f"Successfully created new doctor record (id:{doctor.id})")
            return AuthService.generateJWT(doctor.full_name, doctor.id, "doctor")
        except BaseException as e:
            print("Error while creating new doctor : ", e)
            session.rollback()
            raise e

    @staticmethod
    def signinDoctor(login_request: DoctorSigninRequest, session: Session):
        hasher = PasswordHasher()
        doctor_fetch_statement = (select(Doctors)
            .where(
                and_(
                    Doctors.gmail == login_request.gmail
                )
            )
        )
        result = session.execute(doctor_fetch_statement)
        doctor = result.scalar_one_or_none()
        if doctor:
            if not hasher.verify_password(login_request.pin, doctor.pin):
                raise Exception("Signin failed - Incorrect password.")
            return AuthService.generateJWT(doctor.full_name, doctor.id, "doctor")
        else:
            raise Exception("Signin failed - No user with this gmail was found.")


    @staticmethod
    def generateJWT(full_name, user_id, role):
        settings = getSettings()
        return jwt.encode({
            "full_name": full_name,
            "user_id": user_id,
            "role": role
        }, settings.super_secret_key, "HS256")

    settings = getSettings()

    @staticmethod
    def verifyJWT(token: str = Depends(oauth2_scheme)):
        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            payload = jwt.decode(token, getSettings().super_secret_key, "HS256")
            return payload
        except BaseException as e:
            raise HTTPException(401, f"Token verification failed : {e}")

class PasswordHasher:
    hasher = PasswordHash.recommended()

    def get_password_hash(self, password: str):
        return self.hasher.hash(password)

    def verify_password(self, password: str, hash_: str):
        return self.hasher.verify(password, hash_)

auth_service = AuthService()
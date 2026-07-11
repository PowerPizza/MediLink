from pydantic import BaseModel, EmailStr
from schemas.auth_schemas import BiometricMethods
from schemas.hospital_schemas import HospitalResponse
from datetime import datetime

class DoctorRequest(BaseModel):
    id: int = None
    full_name: str = None
    gmail: EmailStr = None
    phone_no: str = None
    specialization: str = None
    experience: str = None
    qualifications: str = None
    pfp_url: str = None
    biometric_method: BiometricMethods = None
    verification_code: str = None
    doctor_id: str = None
    pin: str = None
    agreed_pin_warn: str = None
    accepted_terms: str = None
    hospital_id: int = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None

class DoctorResponse(BaseModel):
    id: int = None
    full_name: str = None
    gmail: EmailStr = None
    phone_no: str = None
    specialization: str = None
    experience: str = None
    qualifications: str = None
    pfp_url: str = None
    biometric_method: BiometricMethods = None
    verification_code: str = None
    doctor_id: str = None
    pin: str = None
    agreed_pin_warn: str = None
    accepted_terms: str = None
    hospital: HospitalResponse = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None
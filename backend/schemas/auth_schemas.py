from pydantic import BaseModel, EmailStr, Field
from models.doctors_model import BiometricMethods

class DoctorCreateRequest(BaseModel):
    id: int = None
    full_name: str
    gmail: EmailStr
    phone_no: str
    specialization: str
    experience: int
    qualifications: str
    hospital_name: str
    city: str
    hospital_address: str
    verification_code: str
    doctor_id: str
    pin: str
    agreed_to_pin_warning: bool
    accepted_terms: bool
    pfp_url: str = ""
    biometric_method: BiometricMethods = BiometricMethods.UNKNOWN

class DoctorSigninRequest(BaseModel):
    gmail: str = "",
    pin: str = "",
    code: str = ""
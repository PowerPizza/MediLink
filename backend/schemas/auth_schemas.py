from pydantic import BaseModel, EmailStr, Field
from models.doctors_model import BiometricMethods
from models.patients_model import Gender

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

class PatientSignupRequest(BaseModel):
    id: int = None
    fullname: str = ""
    age: int
    gender: Gender = Gender.MALE
    phone_no: str
    gmail: EmailStr
    password: str
    pfp_url: str
    patient_id: str
    is_active: bool

class PatientSigninRequest(BaseModel):
    gmail: EmailStr
    password: str = ""
    code: str = ""
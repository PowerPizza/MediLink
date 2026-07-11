from pydantic import BaseModel
from datetime import datetime

class PatientRequest(BaseModel):
    id: int = None
    fullname: str = None
    gender: str = None
    phone_no: str = None
    pfp_url: str = None
    gmail: str = None
    patient_id: str = None
    age: int = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None

class PatientResponse(BaseModel):
    id: int = None
    fullname: str = None
    gender: str = None
    phone_no: str = None
    pfp_url: str = None
    gmail: str = None
    patient_id: str = None
    age: int = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None
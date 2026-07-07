from pydantic import BaseModel
from datetime import datetime

class PatientResponse(BaseModel):
    id: int
    fullname: str
    gender: str
    phone_no: str
    pfp_url: str
    gmail: str
    patient_id: str
    age: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
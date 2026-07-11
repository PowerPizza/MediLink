from pydantic import BaseModel
from datetime import datetime

class HospitalRequest(BaseModel):
    id: int = None
    hospital_name: str = None
    city: str = None
    hospital_address: str = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None

class HospitalResponse(BaseModel):
    id: int = None
    hospital_name: str = None
    city: str = None
    hospital_address: str = None
    created_at: datetime = None
    updated_at: datetime = None
    is_active: bool = None
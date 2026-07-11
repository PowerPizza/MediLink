from pydantic import BaseModel
from datetime import datetime

class CreateReportRequest(BaseModel):
    id: int = None
    title: str
    disease: str
    patient_id: int
    doctor_id: int
    hospital_id: int
    is_closed: bool = False
    report_file_name: str
    is_active: bool = True

class ReportPartialResponse(BaseModel):
    id: int
    title: str
    disease: str
    patient_name: str
    created_by: str
    patient_pfp_url: str
    report_file_name: str
    is_closed: bool
    is_active: bool
    created_at: datetime
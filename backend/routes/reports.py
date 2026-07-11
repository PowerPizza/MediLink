from fastapi import APIRouter, File, UploadFile, Depends, Response
from typing import Annotated
from services.auth_service import auth_service
from database.cloud_storage import cloud_storage
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from database.database import get_db
from schemas.reports_schemas import CreateReportRequest, ReportPartialResponse
from models.reports_model import Reports

reports_route = APIRouter(prefix="/reports")

@reports_route.get("/all/partial-report")
def onGetAllPartialReports(user=Depends(auth_service.verifyJWT), db:Session=Depends(get_db)):
    if user["role"] != 'doctor':
        return Response("Access denied for your current role.", 401)

    statement = select(Reports).options(joinedload(Reports.patient), joinedload(Reports.doctor))
    reports = db.scalars(statement).all()
    to_ret = []
    for report in reports:
        resp = ReportPartialResponse(
            id=report.id,
            title=report.title,
            disease=report.disease,
            patient_name=report.patient.fullname,
            created_by=report.doctor.full_name,
            patient_pfp_url=report.patient.pfp_url,
            report_file_name=report.report_file_name,
            is_closed=report.is_closed,
            is_active=report.is_active,
            created_at=report.created_at
        )
        to_ret.append(resp)

    return to_ret

@reports_route.post("/save-report-file")
async def onSaveReportFile(file: Annotated[UploadFile, File()], user=Depends(auth_service.verifyJWT)):
    if user["role"] != 'doctor':
        return Response("Access denied for your current role.", 401)

    content = await file.read()
    report_file_name = str(uuid4()).replace("-", "")[:12]+".report"
    cloud_storage.createFile("report-bucket", report_file_name, content)
    return {"report_file_name": report_file_name}

@reports_route.post("/save-report-data")
def onSaveReportData(request: CreateReportRequest , user=Depends(auth_service.verifyJWT), db:Session=Depends(get_db)):
    if user["role"] != 'doctor':
        return Response("Access denied for your current role.", 401)

    try:
        new_report = Reports()
        new_report.title = request.title
        new_report.disease = request.disease
        new_report.patient_id = request.patient_id
        new_report.doctor_id = request.doctor_id
        new_report.hospital_id = request.hospital_id
        new_report.is_closed = request.is_closed
        new_report.report_file_name = request.report_file_name
        new_report.is_active = request.is_active

        db.add(new_report)
        db.commit()
        db.flush()

        return {"report_id": new_report.id}
    except BaseException as e:
        print(f"Error while saving report : {e}")
        return Response("Failed to save report.", 500)

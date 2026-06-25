from fastapi import APIRouter, Depends
from schemas.mail_schemas import VerificationCodeSendRequest
from services.mail_service import sendVerificationCode
from pydantic import EmailStr
from sqlalchemy.orm import Session
from database.database import get_db
from services.auth_service import AuthService

mail_router = APIRouter(prefix="/mail", tags=["Mail"])

@mail_router.post("/verification-code")
async def send_verification_code(request: VerificationCodeSendRequest):
    response = {"success": True, "message": "Verification code has been sent successfully"}
    try:
        await sendVerificationCode(str(request.to), request.code)
    except BaseException as e:
        response["success"] = False
        response["message"] = f"Failed to send verification code mail.\nError: {e}"
    return response

@mail_router.get("/exists/")
def mail_exists(gmail: EmailStr, role: str, db: Session = Depends(get_db)):
    response = {"success": True, "exists": False}
    try:
        response["exists"] = AuthService.checkExistingGmail(str(gmail), role, db)
    except BaseException as e:
        response["success"] = False
        response["message"] = str(e)
    return response
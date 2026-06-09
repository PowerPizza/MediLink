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
def mail_exists(gmail: EmailStr, db: Session = Depends(get_db)):
    return {"success": True, "exists": AuthService.checkExistingGmail(str(gmail), db)}
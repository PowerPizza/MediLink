from pydantic import BaseModel, EmailStr

class VerificationCodeSendRequest(BaseModel):
    to: EmailStr
    code: str
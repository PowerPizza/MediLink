from http.client import HTTPException

import jwt
from fastapi import APIRouter, Depends, Request
from schemas.auth_schemas import DoctorCreateRequest, DoctorSigninRequest, PatientSignupRequest, PatientSigninRequest
from services.auth_service import auth_service
from sqlalchemy.orm import Session
from database.database import get_db

auth_router = APIRouter(prefix="/auth")

@auth_router.post("/signup/doctor")
def signup(request: DoctorCreateRequest, db: Session = Depends(get_db)):
    response = {"success": True, "message": "Successfully added new doctor."}
    try:
        response["token"] = auth_service.createDoctor(request, db)
    except BaseException as e:
        response["success"] = False
        response["message"] = f"Failed to signup as doctor : {e}"
    return response

@auth_router.post("/signin/doctor")
def signin(request: DoctorSigninRequest, db: Session=Depends(get_db)):
    response = {"success": True, "message": "Login successful."}
    try:
        response["token"] = auth_service.signinDoctor(request, db)
    except BaseException as e:
        response["success"] = False
        response["message"] = str(e)
    return response

@auth_router.post("/signup/patient")
def signupPatient(request: PatientSignupRequest, db: Session=Depends(get_db)):
    response = {"success": True, "message": "Signup successful."}
    try:
        response["token"] = auth_service.signupPatient(request, db)
    except BaseException as e:
        response["success"] = False
        response["message"] = str(e)
    return response

@auth_router.post("/signin/patient")
def signinPatient(request: PatientSigninRequest, db: Session=Depends(get_db)):
    response = {"success": True, "message": "Login successful."}
    try:
        response["token"] = auth_service.signinPatient(request, db)
    except BaseException as e:
        response["success"] = False
        response["message"] = str(e)
    return response

@auth_router.get("/verify")
def verifyLoginSession(request: Request):
    # Checks if jwt incoming is valid or not.
    try:
        token_ = request.headers.get("Authorization")
        if token_:
            return {"verified": True, "msg": None} | auth_service.verifyJWT(token_)
        else:
            raise Exception("Authorization header not found.")
    except BaseException as e:
        return {"verified": False, "msg": str(e)}
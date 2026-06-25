import jwt
from fastapi import FastAPI, APIRouter, Request, Depends, HTTPException
from contextlib import asynccontextmanager

from database.database import Base, db_engine

from routes.mail import mail_router
from routes.auth import auth_router

# Importing models - the corresponding table will be automatically created by sqlalchemy engine if import of associated model is present.
from models.hospitals_model import Hospitals
from models.doctors_model import Doctors
from models.patients_model import Patients
from models.reports_model import Reports

# function will run at startup and end of application
@asynccontextmanager
async def onApplicationStartup(app: FastAPI):
    print("[IF NOT EXISTS] Creating database tables")
    Base.metadata.create_all(bind=db_engine)
    print("Tables created successfully")
    yield
    db_engine.dispose()
    print("Application closed")

# API Logic Begins
app = FastAPI(lifespan=onApplicationStartup)
router = APIRouter(prefix="/api/v1")

# class HttpRequestInterceptor(BaseHTTPMiddleware):
#     ignored_urls = [
#         "/api/v1/signup/doctor"
#     ]
#     async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
#         route_ = request.scope.get("path")
#
#         if route_ in self.ignored_urls:
#             response = await call_next(request)
#             return response
#
#         response = await call_next(request)
#
#         return response
# app.add_middleware(HttpRequestInterceptor)

@router.get("/")
def status():
    return {"success": "true", "version": "v1"}

router.include_router(mail_router)
router.include_router(auth_router)

app.include_router(router)

if __name__ == '__main__':
    import os
    os.system("fastapi dev --port 8084 --host 0.0.0.0")
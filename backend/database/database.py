import psycopg
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.engine import create_engine
from config import getSettings

settings = getSettings()

db_engine = create_engine(settings.database_driver_prefix + settings.database_connection_url, echo=True)

SessionLocal = sessionmaker(bind=db_engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Base(DeclarativeBase):
    pass

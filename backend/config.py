from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    sender_mail_password: str
    sender_mail: str
    database_driver_prefix: str
    database_connection_url: str
    super_secret_key: str

    model_config = SettingsConfigDict(env_file=BASE_DIR.joinpath(".env"), env_file_encoding="utf-8", extra="ignore")

@lru_cache
def getSettings():
    return Settings()

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/auth_db"
    firebase_api_key: str = ""
    google_application_credentials: str = "/app/fir-auth-app-5db66-firebase-adminsdk-fbsvc-d0e970d08c.json"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
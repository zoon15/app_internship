import os


class Settings:
    app_name: str = os.getenv("APP_NAME", "app-backend")
    environment: str = os.getenv("ENVIRONMENT", "development")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    chroma_url: str = os.getenv("CHROMA_URL", "http://localhost:8001")


settings = Settings()

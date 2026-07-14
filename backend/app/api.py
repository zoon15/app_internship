from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "backend",
        "environment": "development",
    }


@router.get("/ready")
def readiness_check():
    return {"status": "ready"}

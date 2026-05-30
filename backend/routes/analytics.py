# routes/analytics.py
# Returns analytics data for the dashboard

from fastapi import APIRouter, HTTPException
from services import db_service

router = APIRouter()


@router.get("/summary")
def get_analytics_summary():
    """
    Endpoint: GET /analytics/summary
    Returns total counts, breakdowns by platform and content type,
    and recent activity for the analytics dashboard
    """
    try:
        summary = db_service.get_analytics_summary()
        return {"success": True, "data": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
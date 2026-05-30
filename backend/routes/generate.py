# routes/generate.py
# These are the AI generation endpoints.
# Each function handles one type of content generation request.

from fastapi import APIRouter, HTTPException
from models.schemas import (
    PostGenerateRequest, CaptionGenerateRequest,
    HashtagGenerateRequest, IdeaGenerateRequest,
    CalendarGenerateRequest
)
from services import gemini_service, db_service

# APIRouter is like a mini FastAPI app for a group of related routes
router = APIRouter()


@router.post("/post")
def generate_post(request: PostGenerateRequest):
    """
    Endpoint: POST /generate/post
    Receives topic, platform, tone → returns AI-generated post
    """
    try:
        content = gemini_service.generate_post(
            topic=request.topic,
            platform=request.platform,
            tone=request.tone,
            extra=request.extra_instructions
        )
        # Log this generation event to analytics
        db_service.log_analytics_event("generate", request.platform, "post")

        return {"success": True, "content": content, "content_type": "post", "platform": request.platform}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/caption")
def generate_caption(request: CaptionGenerateRequest):
    """
    Endpoint: POST /generate/caption
    Receives image description, platform, tone → returns AI-generated caption
    """
    try:
        content = gemini_service.generate_caption(
            image_description=request.image_description,
            platform=request.platform,
            tone=request.tone,
            include_emojis=request.include_emojis
        )
        db_service.log_analytics_event("generate", request.platform, "caption")
        return {"success": True, "content": content, "content_type": "caption", "platform": request.platform}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/hashtags")
def generate_hashtags(request: HashtagGenerateRequest):
    """
    Endpoint: POST /generate/hashtags
    Receives topic, platform, count → returns hashtag list
    """
    try:
        content = gemini_service.generate_hashtags(
            topic=request.topic,
            platform=request.platform,
            count=request.count
        )
        db_service.log_analytics_event("generate", request.platform, "hashtags")
        return {"success": True, "content": content, "content_type": "hashtags", "platform": request.platform}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ideas")
def generate_ideas(request: IdeaGenerateRequest):
    """
    Endpoint: POST /generate/ideas
    Receives niche, platform → returns content ideas list
    """
    try:
        content = gemini_service.generate_content_ideas(
            niche=request.niche,
            platform=request.platform,
            count=request.count
        )
        db_service.log_analytics_event("generate", request.platform, "ideas")
        return {"success": True, "content": content, "content_type": "ideas", "platform": request.platform}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/calendar")
def generate_calendar(request: CalendarGenerateRequest):
    """
    Endpoint: POST /generate/calendar
    Receives brand info → returns full 7-day content calendar
    """
    try:
        content = gemini_service.generate_weekly_calendar(
            brand_name=request.brand_name,
            niche=request.niche,
            platforms=request.platforms,
            tone=request.tone,
            week_start=request.week_start
        )
        db_service.log_analytics_event("generate", "multiple", "calendar")
        return {"success": True, "content": content, "content_type": "calendar", "platform": "multiple"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
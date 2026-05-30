# models/schemas.py
# Pydantic models define the SHAPE of data coming in and going out.
# FastAPI uses these to automatically validate requests.
# If someone sends wrong data, FastAPI rejects it with a clear error.

from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# ── REQUEST MODELS (data sent FROM frontend TO backend) ──────────────────────

class PostGenerateRequest(BaseModel):
    """What the frontend sends when asking for a post"""
    topic: str                        # What the post is about e.g. "product launch"
    platform: str                     # "instagram", "twitter", "linkedin"
    tone: str                         # "professional", "casual", "funny", "inspirational"
    extra_instructions: Optional[str] = ""  # Any extra notes from the user

class CaptionGenerateRequest(BaseModel):
    """What the frontend sends when asking for a caption"""
    image_description: str            # User describes their image
    platform: str
    tone: str
    include_emojis: Optional[bool] = True

class HashtagGenerateRequest(BaseModel):
    """What the frontend sends when asking for hashtags"""
    topic: str
    platform: str
    count: Optional[int] = 15         # How many hashtags to generate

class IdeaGenerateRequest(BaseModel):
    """What the frontend sends when asking for content ideas"""
    niche: str                        # e.g. "fitness", "food", "tech"
    platform: str
    count: Optional[int] = 5

class CalendarGenerateRequest(BaseModel):
    """What the frontend sends when asking for a weekly calendar"""
    brand_name: str
    niche: str
    platforms: List[str]              # e.g. ["instagram", "twitter"]
    tone: str
    week_start: Optional[str] = ""   # e.g. "2024-01-15"

class SaveContentRequest(BaseModel):
    """What the frontend sends when saving content"""
    content_type: str                 # "post", "caption", "hashtags", "idea"
    platform: str
    topic: str
    tone: str
    generated_text: str
    hashtags: Optional[str] = ""

# ── RESPONSE MODELS (data sent FROM backend TO frontend) ─────────────────────

class GeneratedContentResponse(BaseModel):
    """What the backend sends back after generating content"""
    success: bool
    content: str
    content_type: str
    platform: str

class SavedContent(BaseModel):
    """Shape of a saved content item from database"""
    id: str
    content_type: str
    platform: str
    topic: str
    tone: str
    generated_text: str
    hashtags: Optional[str]
    created_at: str

class AnalyticsResponse(BaseModel):
    """Shape of analytics summary data"""
    total_generated: int
    by_platform: dict
    by_content_type: dict
    recent_activity: list
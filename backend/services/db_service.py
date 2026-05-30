# services/db_service.py
# This file handles ALL interactions with our Supabase database.
# Every database read/write goes through here.

import os
from supabase import create_client, Client
from datetime import datetime

# Create the Supabase client using our credentials from .env
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)


def save_content(content_type: str, platform: str, topic: str,
                 tone: str, generated_text: str, hashtags: str = "") -> dict:
    """
    Saves a piece of generated content to the database.
    Returns the saved record including its auto-generated ID.
    """
    data = {
        "content_type": content_type,
        "platform": platform,
        "topic": topic,
        "tone": tone,
        "generated_text": generated_text,
        "hashtags": hashtags,
    }
    result = supabase.table("generated_content").insert(data).execute()
    return result.data[0] if result.data else {}


def get_all_content(limit: int = 50) -> list:
    """
    Fetches all saved content, newest first.
    limit=50 means we get the 50 most recent items.
    """
    result = (
        supabase.table("generated_content")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


def delete_content(content_id: str) -> bool:
    """
    Deletes a content item by its UUID.
    Returns True if deleted, False if not found.
    """
    result = (
        supabase.table("generated_content")
        .delete()
        .eq("id", content_id)
        .execute()
    )
    return len(result.data) > 0


def save_calendar_entry(week_start: str, day_of_week: str,
                        platform: str, content_idea: str, content_type: str) -> dict:
    """Saves one day's entry from a weekly calendar"""
    data = {
        "week_start": week_start,
        "day_of_week": day_of_week,
        "platform": platform,
        "content_idea": content_idea,
        "content_type": content_type,
        "status": "planned"
    }
    result = supabase.table("content_calendar").insert(data).execute()
    return result.data[0] if result.data else {}


def log_analytics_event(event_type: str, platform: str, content_type: str):
    """
    Logs every generation action for analytics tracking.
    Called automatically every time content is generated.
    """
    data = {
        "event_type": event_type,
        "platform": platform,
        "content_type": content_type,
    }
    supabase.table("analytics").insert(data).execute()


def get_analytics_summary() -> dict:
    """
    Returns a summary of all analytics data.
    We calculate totals and group by platform/type for the dashboard.
    """
    all_events = supabase.table("analytics").select("*").execute().data or []
    all_content = supabase.table("generated_content").select("*").execute().data or []

    # Count by platform
    by_platform = {}
    for item in all_content:
        p = item.get("platform", "unknown")
        by_platform[p] = by_platform.get(p, 0) + 1

    # Count by content type
    by_type = {}
    for item in all_content:
        t = item.get("content_type", "unknown")
        by_type[t] = by_type.get(t, 0) + 1

    # Recent activity (last 10 events)
    recent = all_events[-10:] if len(all_events) > 10 else all_events

    return {
        "total_generated": len(all_content),
        "by_platform": by_platform,
        "by_content_type": by_type,
        "recent_activity": recent
    }
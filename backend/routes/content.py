# routes/content.py
# Handles saving, fetching, deleting, and exporting content

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import SaveContentRequest
from services import db_service
import io
import csv

router = APIRouter()


@router.post("/save")
def save_content(request: SaveContentRequest):
    """
    Endpoint: POST /content/save
    Saves a generated content item to the database
    """
    try:
        saved = db_service.save_content(
            content_type=request.content_type,
            platform=request.platform,
            topic=request.topic,
            tone=request.tone,
            generated_text=request.generated_text,
            hashtags=request.hashtags
        )
        return {"success": True, "message": "Content saved!", "data": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all")
def get_all_content():
    """
    Endpoint: GET /content/all
    Returns all saved content items, newest first
    """
    try:
        items = db_service.get_all_content()
        return {"success": True, "data": items, "count": len(items)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{content_id}")
def delete_content(content_id: str):
    """
    Endpoint: DELETE /content/{id}
    Deletes a specific content item by its UUID
    """
    try:
        deleted = db_service.delete_content(content_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Content not found")
        return {"success": True, "message": "Content deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export")
def export_content():
    """
    Endpoint: GET /content/export
    Exports all saved content as a downloadable CSV file.
    StreamingResponse streams the file directly — no temp files needed.
    """
    try:
        items = db_service.get_all_content()

        # Create CSV in memory using StringIO (no file saved on disk)
        output = io.StringIO()
        writer = csv.writer(output)

        # Write header row
        writer.writerow(["ID", "Type", "Platform", "Topic", "Tone", "Content", "Hashtags", "Created At"])

        # Write data rows
        for item in items:
            writer.writerow([
                item.get("id", ""),
                item.get("content_type", ""),
                item.get("platform", ""),
                item.get("topic", ""),
                item.get("tone", ""),
                item.get("generated_text", ""),
                item.get("hashtags", ""),
                item.get("created_at", "")
            ])

        output.seek(0)

        # Return as downloadable file
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=social_media_content.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
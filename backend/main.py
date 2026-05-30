# main.py
# This is the entry point of our entire backend application.
# When we run the server, Python starts reading from this file.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from our .env file
# This must happen BEFORE we import routes, because routes use the env vars
load_dotenv()

# Import our route files (we'll create these next)
from routes import generate, content, analytics

# Create the FastAPI application instance
# This 'app' object is the entire backend
app = FastAPI(
    title="AI Social Media Assistant API",
    description="Backend API for generating social media content using Gemini AI",
    version="1.0.0"
)

# CORS Middleware — VERY IMPORTANT
# CORS = Cross-Origin Resource Sharing
# Without this, your browser will BLOCK the frontend from calling the backend
# because they run on different ports (3000 vs 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],   # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],   # Allow all headers
)

# Register routes — each router handles a group of related endpoints
# prefix means all routes in generate.py start with /generate
app.include_router(generate.router, prefix="/generate", tags=["AI Generation"])
app.include_router(content.router, prefix="/content", tags=["Content Management"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# Health check endpoint — a simple way to confirm the server is running
# Visit http://localhost:8000/ in browser to test
@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI Social Media Assistant API is live!",
        "version": "1.0.0"
    }
# 🤖 SocialAI — AI-Powered Social Media Assistant

A full-stack AI web application that helps content creators and brands generate 
professional social media content instantly using Google Gemini AI.

## 🌟 Live Demo
- **Frontend:** [Coming Soon - Vercel]
- **Backend API:** [Coming Soon - Render]

## ✨ Features
- 🖊️ **AI Post Generator** — Platform-specific posts for Instagram, Twitter, LinkedIn, Facebook
- 📸 **AI Caption Generator** — Engaging captions for any image
- #️⃣ **AI Hashtag Generator** — Trending hashtag sets
- 💡 **Content Idea Generator** — Fresh content ideas for any niche
- 📅 **Weekly Content Calendar** — Full 7-day content plan
- 🎨 **Brand Tone Selector** — Professional, Casual, Funny, Inspirational
- 💾 **Save Generated Content** — Save and manage all content
- 📊 **Analytics Dashboard** — Track usage and performance
- ⬇️ **Export Content** — Download as CSV

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini AI |
| Deployment | Vercel + Render |

## 🚀 Getting Started

### Prerequisites
- Python 3.13+
- Node.js 22+
- Supabase account
- Google Gemini API key

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Start backend:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local`:
NEXT_PUBLIC_API_URL=http://localhost:8000

Start frontend:
```bash
npm run dev
```

Open `http://localhost:3000`

## 📁 Project Structure
social-media-assistant/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── generate.py
│   │   ├── content.py
│   │   └── analytics.py
│   ├── services/
│   │   ├── gemini_service.py
│   │   └── db_service.py
│   └── models/
│       └── schemas.py
└── frontend/
├── app/
│   ├── dashboard/
│   ├── generate/
│   ├── calendar/
│   ├── saved/
│   └── analytics/
├── components/
│   └── sidebar.tsx
└── lib/
└── api.ts

## 🗄️ Database Schema

### generated_content
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| content_type | VARCHAR | post/caption/hashtags/ideas |
| platform | VARCHAR | instagram/twitter/linkedin |
| topic | VARCHAR | Content topic |
| tone | VARCHAR | Brand tone |
| generated_text | TEXT | AI generated content |
| created_at | TIMESTAMP | Creation time |

## 👨‍💻 Developer
Built by **Anany** as a client project demonstrating full-stack AI development.

## 📄 License
MIT License
// lib/api.ts
// All functions that call our FastAPI backend live here.
// The frontend never calls the backend directly — it always goes through these functions.

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── AI GENERATION ────────────────────────────────────────────────────────────

export async function generatePost(
  topic: string, platform: string, tone: string, extra: string = ""
) {
  const res = await api.post("/generate/post", { topic, platform, tone, extra_instructions: extra });
  return res.data;
}

export async function generateCaption(
  image_description: string, platform: string, tone: string, include_emojis: boolean = true
) {
  const res = await api.post("/generate/caption", { image_description, platform, tone, include_emojis });
  return res.data;
}

export async function generateHashtags(
  topic: string, platform: string, count: number = 15
) {
  const res = await api.post("/generate/hashtags", { topic, platform, count });
  return res.data;
}

export async function generateIdeas(
  niche: string, platform: string, count: number = 5
) {
  const res = await api.post("/generate/ideas", { niche, platform, count });
  return res.data;
}

export async function generateCalendar(
  brand_name: string, niche: string, platforms: string[], tone: string, week_start: string = ""
) {
  const res = await api.post("/generate/calendar", { brand_name, niche, platforms, tone, week_start });
  return res.data;
}

// ── CONTENT MANAGEMENT ───────────────────────────────────────────────────────

export async function saveContent(data: {
  content_type: string; platform: string; topic: string;
  tone: string; generated_text: string; hashtags?: string;
}) {
  const res = await api.post("/content/save", data);
  return res.data;
}

export async function getAllContent() {
  const res = await api.get("/content/all");
  return res.data;
}

export async function deleteContent(id: string) {
  const res = await api.delete(`/content/${id}`);
  return res.data;
}

export function getExportUrl() {
  return `${API_BASE}/content/export`;
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────

export async function getAnalytics() {
  const res = await api.get("/analytics/summary");
  return res.data;
}
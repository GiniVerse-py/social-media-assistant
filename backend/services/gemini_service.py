# services/gemini_service.py
# Updated to use the new google-genai SDK (replaces deprecated google-generativeai)

import os
from google import genai

# Create client using new SDK style
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Model to use — gemini-2.5-flash is fast, capable, and free-tier friendly
MODEL = "gemini-2.5-flash"

def generate_text(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        error_msg = str(e)
        # If quota exceeded, return a helpful mock response
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return (
                "🤖 [AI Quota Limit Reached] Your Gemini API key needs a few minutes "
                "to activate or has exceeded its free limit. "
                "The actual AI generation will work once quota is available. "
                "All other features (save, delete, export, analytics) are fully functional!"
            )
        raise Exception(f"Gemini API error: {error_msg}")


def generate_text(prompt: str) -> str:
    """
    Core helper — sends any prompt to Gemini and returns the text response.
    All other functions call this.
    """
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


def generate_post(topic: str, platform: str, tone: str, extra: str = "") -> str:
    """Generates a complete social media post"""
    platform_rules = {
        "twitter": "under 280 characters, punchy and direct",
        "instagram": "engaging, 150-200 words, storytelling style",
        "linkedin": "professional, 200-300 words, insight-driven",
        "facebook": "conversational, 100-150 words, community-focused"
    }
    rule = platform_rules.get(platform.lower(), "clear and engaging, 150 words")

    prompt = f"""You are an expert social media manager for top brands.

Write a {tone} social media post for {platform.upper()} about: {topic}

Platform requirements: {rule}
Tone: {tone}
{f'Additional instructions: {extra}' if extra else ''}

Rules:
- Do NOT include hashtags (those will be added separately)
- Do NOT add labels like "Post:" or "Caption:"
- Write ONLY the post text, ready to copy-paste
- Match the platform's typical writing style exactly

Write the post now:"""

    return generate_text(prompt)


def generate_caption(image_description: str, platform: str, tone: str, include_emojis: bool = True) -> str:
    """Generates a caption for a social media image"""
    emoji_instruction = "Include relevant emojis naturally" if include_emojis else "No emojis"

    prompt = f"""You are an expert social media copywriter.

Write a compelling {tone} caption for a {platform.upper()} post.

The image shows: {image_description}

Requirements:
- {emoji_instruction}
- Tone: {tone}
- Start with a hook (attention-grabbing first line)
- End with a subtle call-to-action
- Do NOT include hashtags
- Do NOT add labels like "Caption:"
- Write ONLY the caption text

Write the caption now:"""

    return generate_text(prompt)


def generate_hashtags(topic: str, platform: str, count: int = 15) -> str:
    """Generates relevant hashtags"""
    prompt = f"""You are a social media hashtag expert.

Generate exactly {count} hashtags for a {platform.upper()} post about: {topic}

Rules:
- Mix of popular (high volume) and niche (targeted) hashtags
- All lowercase, no spaces within a hashtag
- Start each hashtag with #
- Format: put all hashtags on ONE line separated by spaces
- No numbering, no explanations, no extra text

Generate {count} hashtags now:"""

    return generate_text(prompt)


def generate_content_ideas(niche: str, platform: str, count: int = 5) -> str:
    """Generates content idea suggestions"""
    prompt = f"""You are a creative social media strategist.

Generate {count} unique, actionable content ideas for a {niche} brand on {platform.upper()}.

For each idea provide:
1. A catchy title
2. One sentence description
3. Content format (Reel, Carousel, Story, etc.)

Format each idea like this:
IDEA [number]: [Title]
Description: [one sentence]
Format: [content format]

Generate {count} ideas now:"""

    return generate_text(prompt)


def generate_weekly_calendar(brand_name: str, niche: str, platforms: list, tone: str, week_start: str = "") -> str:
    """Generates a full 7-day content calendar"""
    platforms_str = ", ".join(platforms)
    week_context = f"for the week of {week_start}" if week_start else "for next week"

    prompt = f"""You are a senior social media strategist creating a weekly content calendar.

Brand: {brand_name}
Niche: {niche}
Platforms: {platforms_str}
Tone: {tone}
Week: {week_context}

Create a 7-day content calendar. For each day provide one post idea.

Format EXACTLY like this for each day:
DAY: [Monday/Tuesday/etc]
PLATFORM: [platform name]
TYPE: [Post/Reel/Story/Carousel]
TOPIC: [specific topic]
IDEA: [2-3 sentence content description]
---

Cover all 7 days (Monday through Sunday).
Vary the content types and topics for maximum engagement.
Make each idea specific and actionable for the {niche} niche."""

    return generate_text(prompt)
"""
Steal the Look – Python FastAPI Backend (OPTIONAL)
The Next.js app already has built-in API routes (/api/analyze, /api/outfits).
Use this Python backend ONLY if you prefer to run the AI logic separately.

Install:
  pip install fastapi uvicorn anthropic python-multipart

Run:
  export ANTHROPIC_API_KEY=sk-ant-...
  uvicorn main:app --reload --port 8000

Then set in your .env.local:
  NEXT_PUBLIC_API_URL=http://localhost:8000
"""

import json, os
from typing import Optional
import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Steal the Look API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))


class AnalyzeReq(BaseModel):
    image_base64: str
    media_type: str = "image/jpeg"


@app.post("/api/analyze")
async def analyze(req: AnalyzeReq):
    prompt = """Analyze this person's photo. Respond ONLY with JSON (no markdown):
{
  "body_shape": "<Hourglass|Pear|Apple|Rectangle|Inverted Triangle>",
  "skin_tone": "<Fair|Light|Medium|Tan|Deep|Dark>",
  "body_shape_reason": "<one sentence>",
  "skin_tone_reason": "<one sentence>"
}"""
    try:
        msg = client.messages.create(
            model="claude-opus-4-5", max_tokens=256,
            messages=[{"role": "user", "content": [
                {"type": "image", "source": {"type": "base64", "media_type": req.media_type, "data": req.image_base64}},
                {"type": "text", "text": prompt},
            ]}],
        )
        raw = msg.content[0].text.strip().strip("```json").strip("```").strip()
        data = json.loads(raw)
        SHAPES = ["Hourglass","Pear","Apple","Rectangle","Inverted Triangle"]
        TONES  = ["Fair","Light","Medium","Tan","Deep","Dark"]
        return JSONResponse({"success": True,
            "body_shape": data.get("body_shape") if data.get("body_shape") in SHAPES else "Rectangle",
            "skin_tone":  data.get("skin_tone")  if data.get("skin_tone")  in TONES  else "Medium",
            "body_shape_reason": data.get("body_shape_reason",""),
            "skin_tone_reason":  data.get("skin_tone_reason",""),
        })
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


class OutfitReq(BaseModel):
    gender: str = "Female"
    occasion: str = "College"
    vibe: str = "Classic"
    platform: Optional[str] = None
    body_shape: Optional[str] = None
    skin_tone: Optional[str] = None


# Import the same outfit DB from a shared JSON or inline a subset
@app.post("/api/outfits")
async def outfits(req: OutfitReq):
    # This endpoint just proxies back — the real DB lives in the Next.js route.
    # For a standalone Python setup, copy OUTFIT_DB here.
    return JSONResponse({"success": False, "error": "Use Next.js /api/outfits route or copy OUTFIT_DB here."})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

export async function POST(req: NextRequest) {
  const { image_base64, media_type } = await req.json();

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ success: false, error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const prompt = `Analyze this person's photo and determine:
1. Body Shape — choose ONE from: Hourglass, Pear, Apple, Rectangle, Inverted Triangle
2. Skin Tone — choose ONE from: Fair, Light, Medium, Tan, Deep, Dark

Respond ONLY with valid JSON, no markdown or extra text:
{
  "body_shape": "...",
  "skin_tone": "...",
  "body_shape_reason": "one sentence",
  "skin_tone_reason": "one sentence"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: media_type || "image/jpeg", data: image_base64 },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ success: false, error: err }, { status: 502 });
    }

    const data = await response.json();
    let raw: string = data.content[0].text.trim();
    if (raw.startsWith("```")) raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);
    const validShapes = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];
    const validTones  = ["Fair", "Light", "Medium", "Tan", "Deep", "Dark"];

    return NextResponse.json({
      success: true,
      body_shape: validShapes.includes(parsed.body_shape) ? parsed.body_shape : "Rectangle",
      skin_tone:  validTones.includes(parsed.skin_tone)   ? parsed.skin_tone  : "Medium",
      body_shape_reason: parsed.body_shape_reason || "",
      skin_tone_reason:  parsed.skin_tone_reason  || "",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "backend", "outfits.json");
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const outfits = JSON.parse(fileContents);
        return NextResponse.json(outfits);
    } catch (error) {
        console.error("Error reading outfits.json:", error);
        return NextResponse.json({ error: "Failed to load outfits" }, { status: 500 });
    }
}

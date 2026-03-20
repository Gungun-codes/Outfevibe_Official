import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ── Load outfits once ─────────────────────────────────────────────────────────
function loadOutfits() {
  const filePath = path.join(process.cwd(), "backend", "outfits.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Outfit[];
}

interface Outfit {
  id: number;
  title: string;
  gender: string;
  occasion: string[];
  mood: string[];
  budget: string[];
  categories: string[];
  image: string;
  affiliateLink: string;
  persona?: string[];
}

// ── Mood mapping from VIBES options → outfit mood tags ───────────────────────
const VIBE_TO_MOOD: Record<string, string[]> = {
  Classic:        ["classic"],
  Boho:           ["chill", "classic"],
  Trendy:         ["bold", "chill"],
  Minimal:        ["classic", "chill"],
  Edgy:           ["bold"],
  Romantic:       ["classic", "chill"],
  "Street Style": ["bold", "chill"],
  "Smart Casual": ["classic"],
};

// ── Occasion mapping ──────────────────────────────────────────────────────────
const OCCASION_MAP: Record<string, string> = {
  College: "college",
  Party:   "party",
  Date:    "date",
  Festive: "eid",       // maps festive → eid outfits
  Wedding: "wedding",
  Work:    "college",   // work maps to college outfits (professional)
};

// ── POST: filter outfits by gender/occasion/vibe ─────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const {
      gender,
      occasion,
      vibe,
      body_shape,
      skin_tone,
    } = await req.json();

    const outfits = loadOutfits();

    const genderKey   = (gender as string)?.toLowerCase() ?? "female";  // "female" | "male"
    const occasionKey = OCCASION_MAP[occasion as string] ?? "college";
    const moodKeys    = VIBE_TO_MOOD[vibe as string] ?? ["classic"];

    // ── Filter by gender + occasion ───────────────────────────────────────────
    let filtered = outfits.filter(
      (o) =>
        o.gender === genderKey &&
        o.occasion.includes(occasionKey) &&
        o.categories.includes("ai_style")
    );

    // ── Score by mood match ───────────────────────────────────────────────────
    const scored = filtered.map((o) => ({
      ...o,
      score: o.mood.filter((m) => moodKeys.includes(m)).length,
    }));

    // Sort by score desc, shuffle ties
    scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

    // Take top 4 — one per category slot (top, bottom, accessories, shoes)
    // Since our outfits are full outfits (not separates), we take 4 unique ones
    const picks = scored.slice(0, 4);

    // ── If not enough, relax mood filter ─────────────────────────────────────
    if (picks.length < 2) {
      const relaxed = outfits
        .filter(
          (o) =>
            o.gender === genderKey &&
            o.occasion.includes(occasionKey)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map((o) => ({ ...o, score: 0 })); // ✅ match scored type
      picks.push(...relaxed.filter((r) => !picks.find((p) => p.id === r.id)));
    }

    // ── Build response ────────────────────────────────────────────────────────
    const items = picks.slice(0, 4).map((o) => ({
      id:            o.id,
      name:          o.title,
      image:         o.image,           // ✅ real product image
      affiliateLink: o.affiliateLink,   // ✅ real affiliate link
      tags:          buildTags(o, vibe as string),
      rating:        parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
      price:         buildPrice(o.budget[0]),
      category:      inferCategory(o, genderKey),
    }));

    const lookReason = buildLookReason(
      body_shape as string,
      skin_tone as string,
      occasion as string,
      vibe as string,
      genderKey
    );

    return NextResponse.json({
      success:     true,
      look_name:   `${vibe} ${occasion} Look`,
      look_reason: lookReason,
      tags:        [vibe, occasion, body_shape ?? ""].filter(Boolean),
      items,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ── GET: return all outfits ───────────────────────────────────────────────────
export async function GET() {
  try {
    const outfits = loadOutfits();
    return NextResponse.json(outfits);
  } catch (error) {
    console.error("Error reading outfits.json:", error);
    return NextResponse.json({ error: "Failed to load outfits" }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildTags(outfit: Outfit, vibe: string): string[] {
  const tags: string[] = [];
  if (outfit.mood.includes("bold"))        tags.push("Statement piece");
  if (outfit.mood.includes("classic"))     tags.push("Timeless");
  if (outfit.mood.includes("chill"))       tags.push("Relaxed fit");
  if (outfit.mood.includes("traditional")) tags.push("Ethnic wear");
  if (outfit.budget[0] === "low")          tags.push("Budget friendly");
  if (outfit.budget[0] === "high")         tags.push("Premium");
  if (vibe === "Minimal")                  tags.push("Minimal");
  if (vibe === "Edgy")                     tags.push("Bold");
  return tags.slice(0, 3);
}

function buildPrice(budget: string): string {
  const ranges: Record<string, string> = {
    low:    "₹499 – ₹999",
    medium: "₹1,000 – ₹2,499",
    high:   "₹2,500 – ₹5,999",
  };
  return ranges[budget] ?? "₹999 – ₹1,999";
}

function inferCategory(outfit: Outfit, gender: string): string {
  const title = outfit.title.toLowerCase();
  if (title.includes("saree") || title.includes("lehenga")) return "Ethnic Set";
  if (title.includes("kurta") || title.includes("suit"))    return "Kurta Set";
  if (title.includes("dress") || title.includes("gown"))    return "Dress";
  if (title.includes("shirt") || title.includes("top"))     return gender === "female" ? "Top" : "Shirt";
  if (title.includes("jacket") || title.includes("blazer")) return "Jacket";
  if (title.includes("sherwani") || title.includes("bandhgala")) return "Sherwani";
  return gender === "female" ? "Outfit" : "Outfit";
}

function buildLookReason(
  bodyShape: string,
  skinTone: string,
  occasion: string,
  vibe: string,
  gender: string
): string {
  const shapeAdvice: Record<string, string> = {
    Hourglass:           "These pieces highlight your balanced proportions and defined waist beautifully.",
    Pear:                "These outfits balance your silhouette by adding volume on top while flowing over the hips.",
    Apple:               "These looks draw the eye upward and create a defined waistline that flatters your shape.",
    Rectangle:           "These styles add curves and dimension to your frame with clever cuts and details.",
    "Inverted Triangle": "These picks balance your broader shoulders by adding fullness and flow at the bottom.",
  };

  const toneAdvice: Record<string, string> = {
    Fair:   "The lighter and jewel tones in this look complement your fair complexion perfectly.",
    Light:  "These warm and soft hues beautifully enhance your light skin tone.",
    Medium: "The rich, saturated colours here work wonderfully with your medium complexion.",
    Tan:    "These earthy and vibrant tones are a stunning match for your warm tan skin.",
    Deep:   "These bold and bright shades create a striking contrast against your deep complexion.",
    Dark:   "These vivid colours and rich fabrics look absolutely stunning on your skin tone.",
  };

  const shape = shapeAdvice[bodyShape] ?? "These outfits are carefully selected to flatter your unique shape.";
  const tone  = toneAdvice[skinTone]   ?? "The colour palette complements your skin tone.";
  const occ   = `Perfect for your ${occasion?.toLowerCase()} look with a ${vibe?.toLowerCase()} vibe.`;

  return `${shape} ${tone} ${occ}`;
}
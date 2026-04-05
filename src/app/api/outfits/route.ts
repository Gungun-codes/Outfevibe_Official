import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Item {
  id: number;
  type: string;
  title: string;
  occasion: string;
  mood: string;
  website: string;
  price: number;
  review: number;
  fabric: string;
  quality: string;
  image: string;
  affiliate_link: string;
}

interface Outfit {
  id: string;
  website: string;
  gender: string;
  occasions: string[];
  vibe: string;
  moods: string[];
  persona: string;
  body_shapes: string[];
  skin_tones: string[];
  items: Record<string, number>;
  total_price: number;
  budget_range: string;
  priority: number | string;
  why_this_outfit: string[];
}

// ── Load JSON files ───────────────────────────────────────────────────────────
function loadOutfits(): Outfit[] {
  const p = path.join(process.cwd(), "backend", "outfit.json");
  const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
  return raw.outfits ?? raw;
}

function loadItems(): Map<number, Item> {
  const p = path.join(process.cwd(), "backend", "items.json");
  const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
  const arr: Item[] = raw.items ?? raw;
  const map = new Map<number, Item>();
  arr.forEach((i) => map.set(i.id, i));
  return map;
}

// ── Vibe → mood matcher ───────────────────────────────────────────────────────
const VIBE_TO_MOOD: Record<string, string[]> = {
  "Casual Cool":    ["casual_cool"],
  "Street Style":   ["street_style"],
  Minimal:          ["minimal"],
  Boho:             ["boho"],
  "Power Dressing": ["power_dressing"],
  "Smart Casual":   ["smart_casual"],
  Classic:          ["classic"],
  Romantic:         ["romantic"],
  Chic:             ["chic"],
  Trendy:           ["trendy"],
  Glam:             ["glam"],
  Edgy:             ["edgy"],
  Bold:             ["bold"],
  Traditional:      ["traditional"],
  "Ethnic Chic":    ["ethnic_chic"],
  Regal:            ["regal"],
  Sporty:           ["sporty"],
  "Business Formal":["classic", "power_dressing"],
  "Ethnic Smart":   ["ethnic_chic", "smart_casual"],
  "Festive Formal": ["traditional", "glam"],
};

// ── Category display order for 4-card layout ─────────────────────────────────
const CATEGORY_ORDER = ["top", "top_outer", "top_inner", "bottom", "dress", "shoes", "heel", "accessory", "neckpiece", "bag", "Handbag"];

// ── Score outfit ──────────────────────────────────────────────────────────────
function scoreOutfit(
  o: Outfit, occasionKey: string, moodKeys: string[],
  bs: string, st: string, budget: string
): number {
  let s = 0;
  // Occasion match
  if (o.occasions?.some((x) => x.toLowerCase() === occasionKey)) s += 4;
  // Mood/vibe match
  if (moodKeys.some((m) => o.moods?.includes(m))) s += 2;
  if (o.vibe?.toLowerCase() === moodKeys[0]?.toLowerCase()) s += 1;
  // Body shape match
  if (bs && o.body_shapes?.some((b) => b.toLowerCase() === bs.toLowerCase())) s += 3;
  // Skin tone match
  if (st && o.skin_tones?.some((x) => x.toLowerCase() === st.toLowerCase())) s += 2;
  // Budget match
  if (budget && o.budget_range === budget) s += 1;
  // Priority boost
  const p = Number(o.priority);
  s += isNaN(p) ? 0 : p === 1 ? 2 : p === 2 ? 1 : 0;
  return s;
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { gender, occasion, vibe, body_shape, skin_tone, budget } = await req.json();

    const outfits  = loadOutfits();
    const itemsMap = loadItems();

    const genderKey   = (gender  as string)?.toLowerCase() ?? "female";
    const occasionKey = (occasion as string)?.toLowerCase() ?? "college";
    const moodKeys    = VIBE_TO_MOOD[vibe as string] ?? [(vibe as string)?.toLowerCase() ?? "classic"];
    const bs          = (body_shape as string) ?? "";
    const st          = (skin_tone  as string) ?? "";
    const budgetLabel = (budget     as string) ?? "";

    // Filter by gender
    const byGender = outfits.filter(
      (o) => o.gender?.toLowerCase() === genderKey
    );

    if (byGender.length === 0) {
      return NextResponse.json({ success: false, error: "No outfits for this gender" }, { status: 404 });
    }

    // Score and sort
    const scored = byGender
      .map((o) => ({ ...o, _score: scoreOutfit(o, occasionKey, moodKeys, bs, st, budgetLabel) }))
      .sort((a, b) => b._score - a._score);

    // Pick best outfit — if top score is 0, pick random from gender
    const best = scored[0]._score > 0
      ? scored[0]
      : { ...byGender[Math.floor(Math.random() * byGender.length)], _score: 0 };

    // ── Resolve items ─────────────────────────────────────────────────────────
    const itemEntries = Object.entries(best.items);

    // Sort by display category order
    itemEntries.sort(([typeA], [typeB]) => {
      const ai = CATEGORY_ORDER.indexOf(typeA);
      const bi = CATEGORY_ORDER.indexOf(typeB);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    // Take up to 4 items
    const resolved = itemEntries
      .slice(0, 4)
      .map(([type, itemId]) => {
        const item = itemsMap.get(Number(itemId));
        if (!item) return null;
        return {
          id:            item.id,
          name:          item.title,
          image:         item.image,
          affiliateLink: item.affiliate_link,
          platform:      item.website,
          category:      formatCategory(type),
          tags:          [item.fabric, item.quality].filter(Boolean).slice(0, 2),
          rating:        item.review ?? 4.0,
          price:         `₹${item.price?.toLocaleString("en-IN") ?? "–"}`,
        };
      })
      .filter(Boolean);

    if (resolved.length === 0) {
      return NextResponse.json(
        { success: false, error: "Items not found for this outfit" },
        { status: 404 }
      );
    }

    const platform = resolved[0]?.platform ?? best.website ?? "Curated";

    return NextResponse.json({
      success:         true,
      look_name:       `${vibe} ${occasion} Look`,
      look_reason:     buildLookReason(bs, st, occasion as string, vibe as string),
      tags:            [vibe, occasion, bs].filter(Boolean),
      platform,
      items:           resolved,
      why_this_outfit: best.why_this_outfit ?? [],
    });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/outfits] error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    return NextResponse.json(loadOutfits());
  } catch (error) {
    console.error("Error reading outfit.json:", error);
    return NextResponse.json({ error: "Failed to load outfits" }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCategory(type: string): string {
  const map: Record<string, string> = {
    top:       "Top",
    top_inner: "Inner",
    top_outer: "Jacket / Outer",
    bottom:    "Bottom",
    dress:     "Dress",
    shoes:     "Shoes",
    heel:      "Heels",
    accessory: "Accessory",
    neckpiece: "Neckpiece",
    bag:       "Bag",
    Handbag:   "Bag",
  };
  return map[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

function buildLookReason(bs: string, st: string, occasion: string, vibe: string): string {
  const shapeAdvice: Record<string, string> = {
    Hourglass:           "These pieces highlight your balanced proportions beautifully.",
    Pear:                "These outfits balance your silhouette by adding volume on top.",
    Apple:               "These looks draw the eye upward and create a defined waistline.",
    Rectangle:           "These styles add curves and dimension to your frame.",
    "Inverted Triangle": "These picks add fullness and flow at the bottom to balance your shoulders.",
  };
  const toneAdvice: Record<string, string> = {
    Fair:     "The lighter and jewel tones complement your fair complexion perfectly.",
    Light:    "These warm hues beautifully enhance your light skin tone.",
    Medium:   "The rich colours work wonderfully with your medium complexion.",
    Tan:      "These earthy tones are a stunning match for your warm tan skin.",
    Wheatish: "These warm and rich tones complement your wheatish skin beautifully.",
    Dusky:    "These vibrant shades look stunning against your dusky complexion.",
    Deep:     "These bold shades create a striking contrast against your deep complexion.",
    Dark:     "These vivid colours look absolutely stunning on your skin tone.",
  };
  const shape = shapeAdvice[bs] ?? "Carefully selected to flatter your unique shape.";
  const tone  = toneAdvice[st]  ?? "The colour palette complements your skin tone.";
  return `${shape} ${tone} Perfect for ${occasion?.toLowerCase()} with a ${vibe?.toLowerCase()} vibe.`;
}
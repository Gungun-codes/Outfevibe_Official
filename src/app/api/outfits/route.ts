import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Item {
  id: number;
  type: string;
  title: string;
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
  body_shapes: string[];
  skin_tones: string[];
  items: Record<string, number>; // { "top": 1, "bottom": 3, "shoes": 4 }
  budget_range: string;
  priority: number | string;
  why_this_outfit: string[];
}

// ── Load files ────────────────────────────────────────────────────────────────
function loadOutfits(): Outfit[] {
  const p = path.join(process.cwd(), "backend", "outfit.json");
  const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
  // outfit.json has { "outfits": [...] }
  const arr = raw.outfits ?? raw;
  console.log(`[outfit.json] loaded ${arr.length} outfits`);
  return arr;
}

function loadItems(): Map<number, Item> {
  const p = path.join(process.cwd(), "backend", "items.json");
  const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
  // items.json has { "items": [...] }
  const arr: Item[] = raw.items ?? raw;
  const map = new Map<number, Item>();
  arr.forEach((i) => map.set(Number(i.id), i));
  console.log(`[items.json] loaded ${map.size} items`);
  return map;
}

// ── Vibe → moods ──────────────────────────────────────────────────────────────
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
  "Business Formal":["classic","power_dressing"],
  "Ethnic Smart":   ["ethnic_chic","smart_casual"],
  "Festive Formal": ["traditional","glam"],
};

// ── Item display order ────────────────────────────────────────────────────────
const TYPE_ORDER = ["top","top_outer","top_inner","bottom","dress","shoes","heel","accessory","neckpiece","bag","Handbag"];

function formatType(type: string): string {
  const map: Record<string,string> = {
    top:"Top", top_inner:"Inner", top_outer:"Jacket",
    bottom:"Bottom", dress:"Dress", shoes:"Shoes",
    heel:"Heels", accessory:"Accessory", neckpiece:"Neckpiece",
    bag:"Bag", Handbag:"Bag",
  };
  return map[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

// ── Score outfit ──────────────────────────────────────────────────────────────
function score(o: Outfit, occ: string, moods: string[], bs: string, st: string, budget: string): number {
  let s = 0;
  if (o.occasions?.some(x => x.toLowerCase() === occ)) s += 5;
  if (moods.some(m => o.moods?.includes(m)))            s += 2;
  if (o.vibe?.toLowerCase() === moods[0])               s += 1;
  if (bs && o.body_shapes?.some(b => b.toLowerCase() === bs.toLowerCase())) s += 3;
  if (st && o.skin_tones?.some(x => x.toLowerCase() === st.toLowerCase()))  s += 2;
  if (budget && o.budget_range === budget)               s += 1;
  const p = Number(o.priority);
  s += isNaN(p) ? 0 : p === 1 ? 2 : p === 2 ? 1 : 0;
  return s;
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gender, occasion, vibe, body_shape, skin_tone, budget } = body;

    console.log("[/api/outfits] request:", { gender, occasion, vibe, body_shape, skin_tone, budget });

    const outfits  = loadOutfits();
    const itemsMap = loadItems();

    const genderKey = (gender as string)?.toLowerCase() ?? "female";
    const occKey    = (occasion as string)?.toLowerCase() ?? "college";
    const moodKeys  = VIBE_TO_MOOD[vibe as string] ?? [(vibe as string)?.toLowerCase() ?? "classic"];
    const bs        = (body_shape as string) ?? "";
    const st        = (skin_tone  as string) ?? "";
    const budgetKey = (budget     as string) ?? "";

    // 1. Filter by gender
    const byGender = outfits.filter(o => o.gender?.toLowerCase() === genderKey);
    console.log(`[/api/outfits] by gender (${genderKey}): ${byGender.length}`);

    if (byGender.length === 0) {
      return NextResponse.json({ success: false, error: `No outfits for gender: ${genderKey}` }, { status: 404 });
    }

    // 2. Score and sort
    const scored = byGender
      .map(o => ({ ...o, _s: score(o, occKey, moodKeys, bs, st, budgetKey) }))
      .sort((a, b) => b._s - a._s);

    console.log(`[/api/outfits] top scores: ${scored.slice(0,3).map(o => `${o.id}(${o._s})`).join(", ")}`);

    // 3. Pick best — if no score, pick first gender match
    const best = scored[0];
    console.log(`[/api/outfits] selected outfit: ${best.id}, items:`, best.items);

    // 4. Collect all items from this outfit
    const itemEntries = Object.entries(best.items)
      .sort(([a],[b]) => {
        const ai = TYPE_ORDER.indexOf(a), bi = TYPE_ORDER.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .slice(0, 4); // max 4 cards

    const resolvedItems = itemEntries
      .map(([type, itemId]) => {
        const item = itemsMap.get(Number(itemId));
        if (!item) {
          console.warn(`[/api/outfits] item id ${itemId} not found in items.json`);
          return null;
        }
        return {
          id:            item.id,
          name:          item.title,
          image:         item.image,
          affiliateLink: item.affiliate_link,
          platform:      item.website,
          category:      formatType(type),
          tags:          [item.fabric, item.quality].filter(Boolean).slice(0, 2),
          rating:        item.review ?? 4.0,
          price:         `₹${item.price?.toLocaleString("en-IN") ?? "–"}`,
        };
      })
      .filter(Boolean);

    console.log(`[/api/outfits] resolved ${resolvedItems.length} items`);

    if (resolvedItems.length === 0) {
      return NextResponse.json({ success: false, error: "Items not found for outfit " + best.id }, { status: 404 });
    }

    const platform = resolvedItems[0]?.platform ?? best.website ?? "Curated";

    return NextResponse.json({
      success:         true,
      look_name:       `${vibe} ${occasion} Look`,
      look_reason:     buildReason(bs, st, occasion as string, vibe as string),
      tags:            [vibe, occasion, bs].filter(Boolean),
      platform,
      items:           resolvedItems,
      why_this_outfit: best.why_this_outfit ?? [],
    });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/outfits] CRASH:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    return NextResponse.json(loadOutfits());
  } catch (e) {
    return NextResponse.json({ error: "Failed to load outfit.json" }, { status: 500 });
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────
function buildReason(bs: string, st: string, occasion: string, vibe: string): string {
  const shape: Record<string,string> = {
    Hourglass: "These pieces highlight your balanced proportions beautifully.",
    Pear: "These outfits balance your silhouette by adding volume on top.",
    Apple: "These looks create a defined waistline that flatters your shape.",
    Rectangle: "These styles add curves and dimension to your frame.",
    "Inverted Triangle": "These picks add fullness at the bottom to balance your shoulders.",
  };
  const tone: Record<string,string> = {
    Fair: "The lighter and jewel tones complement your fair complexion perfectly.",
    Wheatish: "These warm tones complement your wheatish skin beautifully.",
    Dusky: "These vibrant shades look stunning against your dusky complexion.",
    Tan: "These earthy tones are a stunning match for your warm tan skin.",
    Deep: "These bold shades create a striking contrast against your deep complexion.",
  };
  const s = shape[bs] ?? "Carefully selected to flatter your unique shape.";
  const t = tone[st]  ?? "The colour palette complements your skin tone.";
  return `${s} ${t} Perfect for ${occasion?.toLowerCase()} with a ${vibe?.toLowerCase()} vibe.`;
}
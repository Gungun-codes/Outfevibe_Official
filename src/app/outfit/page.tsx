"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw, Sparkles } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { BudgetSlider } from "@/components/BudgetSlider";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { ColorPaletteCard } from "@/components/ColorPaletteCard";
import { useAnalysisLimit } from "@/app/hooks/useAnalysisLimit";
import { OCCASIONS } from "@/lib/type";
import outfitsData from "../../../backend/outfit.json";
import itemsData from "../../../backend/item.json";
import { ExternalLink, ShoppingBag, Heart, Bookmark } from "lucide-react";

// ── Compliments ────────────────────────────────────────────────────────────────
const FEMALE_COMPLIMENTS = [
  "👑 Queen is about to slay this look!",
  "✨ She's not just wearing it — she's owning it!",
  "💅 This fit was made for you, bestie!",
  "🔥 Your outfit era starts NOW!",
  "💫 Heads will turn, hearts will stop!",
  "🌟 Serving looks and taking names!",
  "💖 You're about to be everyone's fashion inspo!",
];

const MALE_COMPLIMENTS = [
  "👑 King is about to rock this look!",
  "🔥 Bro, you're gonna be the most stylish in the room!",
  "⚡ Clean fit, clean confidence — let's go!",
  "💪 This look hits different on you, king!",
  "🕶️ Style unlocked. You're built different.",
  "🚀 Drip level: maximum. Go get 'em!",
  "😤 No cap, this fit goes crazy hard!",
];

function getCompliment(gender: string): string {
  const list = gender.toLowerCase() === "male" ? MALE_COMPLIMENTS : FEMALE_COMPLIMENTS;
  return list[Math.floor(Math.random() * list.length)];
}

// ── Body shape compliments ─────────────────────────────────────────────────────
const BODY_SHAPE_COMPLIMENTS: Record<string, { female: string; male: string }> = {
  Hourglass: {
    female: "Hourglass? That's literally the most coveted body shape! You share it with Beyoncé & Marilyn Monroe 👑",
    male:   "Hourglass frame? Balanced shoulders and waist — the dream physique of Greek sculptures 🏛️",
  },
  Rectangle: {
    female: "Rectangle body = model body! Kendall Jenner & Cameron Diaz rock it and so do you 🔥",
    male:   "Rectangle build is pure athlete energy — think Chris Evans in his prime 💪",
  },
  Pear: {
    female: "Pear shape is SO aesthetic! JLo, Beyoncé and Rihanna all share your silhouette 🍐✨",
    male:   "Strong lower body like a sprinter — that's pure power and athleticism right there ⚡",
  },
  Apple: {
    female: "Apple shape = bold and confident! Drew Barrymore & Jennifer Hudson absolutely own it 🌟",
    male:   "Apple build is the classic power physique — Jonah Hill turned it into a whole style icon moment 😎",
  },
  "Inverted Triangle": {
    female: "Inverted triangle? That's a warrior goddess silhouette! Strong shoulders = natural confidence ✨",
    male:   "Inverted triangle is THE most sought-after male body — literally the superhero build 🦸",
  },
};

// ── Skin tone compliments ──────────────────────────────────────────────────────
const SKIN_TONE_COMPLIMENTS: Record<string, { female: string; male: string }> = {
  Fair: {
    female: "Fair skin glows like porcelain — jewel tones and pastels will look absolutely magical on you 💎",
    male:   "Fair skin has that clean, sharp look — navy and earth tones make you look effortlessly sharp 🎯",
  },
  Wheatish: {
    female: "Wheatish skin is literally golden hour personified — warm tones and bold colours are made for you ☀️",
    male:   "Wheatish skin is the most versatile canvas — everything from whites to deep burgundy looks fire on you 🔥",
  },
  Dusky: {
    female: "Dusky skin is absolutely stunning — vibrant colours pop on you like no one else can pull off 🌺",
    male:   "Dusky skin with bold colours? That's a walking editorial moment every single time 📸",
  },
  Deep: {
    female: "Deep skin tone is GORGEOUS — bright colours and metallics create the most striking looks on you 🌟",
    male:   "Deep skin is powerful and striking — white, gold and bright hues make you look like royalty 👑",
  },
};

// ── Profile compliment banner (shown after body + skin tone confirmed) ────────
function ProfileComplimentBanner({ bodyShape, skinTone, gender }: {
  bodyShape: string; skinTone: string; gender: string;
}) {
  const g = gender.toLowerCase() === "male" ? "male" : "female";

  const shapeMsg = BODY_SHAPE_COMPLIMENTS[bodyShape]?.[g]
    ?? `${bodyShape} body shape — a stunning silhouette to style! ✨`;

  const toneMsg = SKIN_TONE_COMPLIMENTS[skinTone]?.[g]
    ?? `${skinTone} skin tone — beautiful and full of styling potential 🌟`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="rounded-2xl border relative overflow-hidden space-y-3 p-4"
      style={{ background: "linear-gradient(135deg,#1a1200,#111111)", borderColor: "#d4af7f25" }}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(105deg, transparent 35%, rgba(212,175,127,0.05) 50%, transparent 65%)" }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
      />

      {/* Body shape row */}
      <div className="flex items-start gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
          style={{ background: "#d4af7f18" }}>
          {g === "female" ? "💃" : "🕺"}
        </div>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: "#e8d5a3" }}>
          {shapeMsg}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full relative z-10" style={{ background: "#d4af7f15" }} />

      {/* Skin tone row */}
      <div className="flex items-start gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base"
          style={{ background: "#d4af7f18" }}>
          ✨
        </div>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: "#e8d5a3" }}>
          {toneMsg}
        </p>
      </div>

      {/* Tagline */}
      <p className="text-xs text-neutral-600 text-center relative z-10 pt-1">
        Now let&apos;s find outfits that match your unique vibe 🛍️
      </p>
    </motion.div>
  );
}

// ── Occasion vibes map ────────────────────────────────────────────────────────
const OCCASION_VIBES: Record<string, { Female: string[]; Male: string[] }> = {
  College:  { Female: ["Casual Cool","Street Style","Minimal","Boho"],       Male: ["Street Style","Casual Cool","Minimal","Sporty"] },
  Work:     { Female: ["Power Dressing","Smart Casual","Minimal","Classic"],  Male: ["Business Formal","Smart Casual","Classic","Minimal"] },
  Date:     { Female: ["Romantic","Chic","Minimal","Trendy"],                 Male: ["Smart Casual","Classic","Minimal","Trendy"] },
  Party:    { Female: ["Glam","Edgy","Bold","Chic"],                          Male: ["Edgy","Bold","Smart Casual","Trendy"] },
  Wedding:  { Female: ["Glam","Traditional","Ethnic Chic","Regal"],           Male: ["Traditional","Regal","Festive Formal","Ethnic Smart"] },
  Festive:  { Female: ["Traditional","Ethnic Chic","Glam","Minimal"],         Male: ["Traditional","Ethnic Smart","Classic","Bold"] },
  Gym:      { Female: ["Sporty","Casual Cool","Minimal","Bold"],               Male: ["Sporty","Casual Cool","Minimal","Bold"] },
};

// ── Persona → vibe mapping ────────────────────────────────────────────────────
const PERSONA_VIBE_MAP: Record<string, string> = {
  "Minimalist Maven": "Minimal",
  "Minimalist King":  "Minimal",
  "Edgy Trendsetter": "Edgy",
  "Streetwear Icon":  "Street Style",
  "Romantic Softie":  "Romantic",
  "Playful Creative": "Bold",
  "Comfort Queen":    "Casual Cool",
  "Casual Cool":      "Casual Cool",
  "Modern Gentleman": "Smart Casual",
  "Athleisure Pro":   "Sporty",
};

function getVibes(occasion: string, gender: string): string[] {
  const map = OCCASION_VIBES[occasion];
  if (!map) return ["Classic","Minimal","Trendy","Bold"];
  return map[gender as "Female" | "Male"] ?? map.Female;
}

function toGenderProp(g: string): "male" | "female" {
  return g.toLowerCase() === "male" ? "male" : "female";
}

// ── JSON types ────────────────────────────────────────────────────────────────
interface OutfitJson {
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

interface ItemJson {
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

const ALL_OUTFITS = (outfitsData as any).outfits as OutfitJson[];
const ALL_ITEMS   = (itemsData  as any).items   as ItemJson[];

function getItemById(id: number): ItemJson | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

function getItemsForOutfit(outfit: OutfitJson): ItemJson[] {
  return Object.values(outfit.items)
    .map((id) => getItemById(id))
    .filter((i): i is ItemJson => !!i);
}

function scoreOutfit(o: OutfitJson, bs: string, st: string): number {
  let s = 0;
  if (bs && o.body_shapes?.some((b) => b.toLowerCase() === bs.toLowerCase())) s += 3;
  if (st && o.skin_tones?.some((x) => x.toLowerCase() === st.toLowerCase()))  s += 2;
  const p = typeof o.priority === "number" ? o.priority : 99;
  s += p === 1 ? 2 : p === 2 ? 1 : 0;
  return s;
}

function filterOutfits(
  gender: string,
  occasion: string,
  vibe: string,
  bs: string,
  st: string,
  budgetLabel: string,
): OutfitJson[] {
  const g   = gender.toLowerCase();
  const occ = occasion.toLowerCase();
  const v   = vibe.toLowerCase();

  return ALL_OUTFITS
    .filter((o) => {
      const gMatch   = o.gender?.toLowerCase() === g;
      const occMatch = o.occasions?.some((x) => x.toLowerCase() === occ);
      const budMatch = !budgetLabel || o.budget_range?.toLowerCase() === budgetLabel.toLowerCase();
      return gMatch && occMatch && budMatch;
    })
    .map((o) => ({ ...o, _s: scoreOutfit(o, bs, st) + (o.vibe?.toLowerCase() === v ? 2 : 0) }))
    .sort((a, b) => b._s - a._s)
    .slice(0, 1);
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? "text-amber-400" : "text-neutral-700"}`}>★</span>
      ))}
      <span className="text-xs text-neutral-500 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

// ── Item card — IMAGE FIX: removed imgLoaded opacity trick ────────────────────
function ItemCard({ item, index }: { item: ItemJson; index: number }) {
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [imgError, setImgError] = useState(false);
  const color = "#d4af7f";

  const rawImg = item.image?.trim() ?? "";
  // Only accept absolute URLs or Next.js public-folder paths starting with "/"
  const imgSrc = rawImg.startsWith("http") || rawImg.startsWith("/") ? rawImg : null;
  // Show image only when we have a src AND it hasn't errored
  const showImg = !!imgSrc && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all"
    >
      {/* Image container */}
      <div className="relative w-full bg-neutral-900" style={{ aspectRatio: "3/4" }}>
        {showImg ? (
          // ── Real product image ──────────────────────────────────────────────
          // KEY FIX: No opacity fade trick. Image is visible immediately.
          // Only fall back on actual network/404 errors via onError.
          <img
            src={imgSrc}
            alt={item.title}
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // ── Fallback placeholder ────────────────────────────────────────────
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{ background: `${color}10` }}
          >
            <ShoppingBag className="w-8 h-8" style={{ color }} />
            <span className="text-xs font-medium capitalize" style={{ color }}>{item.type}</span>
          </div>
        )}

        {/* Like + Save buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setLiked((p) => !p)}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: liked ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: liked ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "#fff" : "none"} stroke="#fff" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setSaved((p) => !p)}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: saved ? "rgba(212,175,127,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: saved ? "1px solid rgba(212,175,127,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "#000" : "none"} stroke={saved ? "#000" : "#fff"} />
          </motion.button>
        </div>

        {/* Category badge */}
        <div
          className="absolute bottom-2 left-2 z-10 text-white text-xs font-bold px-2 py-0.5 rounded-full capitalize"
          style={{ background: color }}
        >
          {item.type}
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs font-semibold text-neutral-200 leading-tight mb-2 line-clamp-2">{item.title}</p>
        <StarRating rating={item.review} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-neutral-300">₹{item.price?.toLocaleString("en-IN")}</span>
          <a
            href={item.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity active:scale-95 text-black"
            style={{ background: `linear-gradient(135deg,${color},#b8860b)` }}
          >
            Buy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function OutfitItemsGrid({ outfit, occasion, outfitIndex }: {
  outfit: OutfitJson; occasion: string; outfitIndex: number;
}) {
  const items = getItemsForOutfit(outfit);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: outfitIndex * 0.2 }}
      className="w-full space-y-3 mb-4"
    >
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-white capitalize">{outfit.vibe} Look ✨</p>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
            style={{ background: "#d4af7f18", color: "#d4af7f" }}
          >
            {outfit.budget_range} budget
          </span>
        </div>
        <p className="text-[10px] text-neutral-500 capitalize">{outfit.website} · {occasion}</p>
        {outfit.why_this_outfit?.[0] && (
          <p className="text-[10px] text-neutral-400 mt-1 italic">"{outfit.why_this_outfit[0]}"</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item, i) => (
          <ItemCard key={`${outfit.id}-${item.id}-${i}`} item={item} index={i} />
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-xs text-neutral-500 text-center py-4">No items found for this outfit.</p>
      )}
    </motion.div>
  );
}

// ── Compliment Banner ─────────────────────────────────────────────────────────
function ComplimentBanner({ gender, occasion }: { gender: string; occasion: string }) {
  const compliment = getCompliment(gender);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="rounded-2xl p-4 text-center border relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1a1200,#111111)", borderColor: "#d4af7f30" }}
    >
      {/* Subtle shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(212,175,127,0.06) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
      />
      <p className="text-base font-bold relative z-10" style={{ color: "#d4af7f" }}>
        {compliment}
      </p>
      <p className="text-xs text-neutral-500 mt-1 relative z-10">
        Your curated {occasion.toLowerCase()} picks are ready ✨
      </p>
    </motion.div>
  );
}

// ── Persona banner ────────────────────────────────────────────────────────────
function PersonaBanner({ persona, onDismiss }: { persona: string | null; onDismiss: () => void }) {
  if (persona) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border mb-3"
        style={{ background: "#d4af7f0d", borderColor: "#d4af7f30" }}
      >
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#d4af7f" }} />
        <p className="text-xs text-neutral-400 flex-1 leading-relaxed">
          Styling based on your <span style={{ color: "#d4af7f" }} className="font-semibold">{persona}</span> persona
        </p>
        <button onClick={onDismiss} className="text-neutral-700 hover:text-neutral-500 text-xs">✕</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border mb-3"
      style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      <span className="text-sm flex-shrink-0 mt-0.5">✨</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-400 leading-relaxed">
          Take our quick{" "}
          <a href="/quiz" className="font-semibold underline underline-offset-2" style={{ color: "#d4af7f" }}>
            Style Quiz
          </a>
          {" "}to unlock recommendations tuned to your persona.
        </p>
      </div>
      <button onClick={onDismiss} className="text-neutral-700 hover:text-neutral-500 text-xs flex-shrink-0">✕</button>
    </motion.div>
  );
}

// ── Manual clarification ──────────────────────────────────────────────────────
const BODY_SHAPES = ["Hourglass","Rectangle","Pear","Apple","Inverted Triangle"];
const SKIN_TONES  = ["Fair","Wheatish","Dusky","Deep"];

function ManualClarificationCard({ onConfirm }: { onConfirm: (bs: string, st: string) => void }) {
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedTone,  setSelectedTone]  = useState("");
  const [submitted,     setSubmitted]     = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 space-y-4">
      <div>
        <p className="text-sm font-bold text-white mb-1">Help us style you better 👗</p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Share your body shape and skin tone for better outfit recommendations.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#d4af7f] mb-2 uppercase tracking-wider">Body Shape</p>
        <div className="flex flex-wrap gap-2">
          {BODY_SHAPES.map((shape) => (
            <button
              key={shape}
              disabled={submitted}
              onClick={() => setSelectedShape(shape)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: selectedShape === shape ? "linear-gradient(135deg,#d4af7f,#b8860b)" : "#1a1a1a",
                color:      selectedShape === shape ? "#000" : "#d4af7f",
                border:     selectedShape === shape ? "1px solid transparent" : "1px solid #d4af7f40",
              }}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#d4af7f] mb-2 uppercase tracking-wider">Skin Tone</p>
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone}
              disabled={submitted}
              onClick={() => setSelectedTone(tone)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: selectedTone === tone ? "linear-gradient(135deg,#d4af7f,#b8860b)" : "#1a1a1a",
                color:      selectedTone === tone ? "#000" : "#d4af7f",
                border:     selectedTone === tone ? "1px solid transparent" : "1px solid #d4af7f40",
              }}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={() => {
            if (!selectedShape || !selectedTone) return;
            setSubmitted(true);
            onConfirm(selectedShape, selectedTone);
          }}
          disabled={!selectedShape || !selectedTone}
          className="w-full py-2.5 rounded-full text-sm font-bold text-black transition-all disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        >
          Confirm ✓
        </button>
      ) : (
        <p className="text-xs text-[#d4af7f] text-center">✓ Saved! Finding your colour palette…</p>
      )}
    </div>
  );
}

// ── Message type ──────────────────────────────────────────────────────────────
interface Msg {
  id: string; role: "bot" | "user"; content: React.ReactNode; answered?: boolean;
}

let _n = 0;
const uid = () => `m${++_n}_${Date.now()}`;
let _booted = false;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const [msgs,           setMsgs]          = useState<Msg[]>([]);
  const [typing,         setTyping]         = useState(false);
  const [analysing,      setAnalysing]      = useState(false);
  const [analyseImgUrl,  setAnalyseImgUrl]  = useState("");
  const [persona,        setPersona]        = useState<string | null>(null);
  const [showBanner,     setShowBanner]     = useState(true);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const camRef      = useRef<HTMLInputElement>(null);
  const genderRef   = useRef("");
  const analysisRef = useRef<{ body_shape: string; skin_tone: string } | null>(null);
  const pushBotRef  = useRef<((c: React.ReactNode, d?: number) => Promise<string>) | null>(null);
  const pushUserRef = useRef<((c: React.ReactNode) => void) | null>(null);
  // Track live usage so EndCard can show dots without re-fetching
  const usageRef    = useRef<{ used: number; limit: number }>({ used: 0, limit: 1 });

  const auth = useAuth();
  const user = auth?.user ?? null;
  const { checkLimit, incrementUsage } = useAnalysisLimit(user?.id);

  // ── Load persona ──────────────────────────────────────────────────────────
  useEffect(() => {
    const local = localStorage.getItem("userPersona");
    if (local) { setPersona(local); return; }

    if (user?.id) {
      supabase
        .from("quiz_result")
        .select("persona_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.persona_name) {
            setPersona(data.persona_name);
            localStorage.setItem("userPersona", data.persona_name);
          }
        });
    }
  }, [user?.id]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [msgs, typing, analysing]);

  const markAnswered = useCallback((id: string) =>
    setMsgs((p) => p.map((m) => m.id === id ? { ...m, answered: true } : m)), []);

  const pushUser = useCallback(
    (content: React.ReactNode) =>
      setMsgs((p) => [...p, { id: uid(), role: "user", content }]), []);

  const pushBot = useCallback(
    (content: React.ReactNode, delay = 700): Promise<string> =>
      new Promise((res) => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          const id = uid();
          setMsgs((p) => [...p, { id, role: "bot", content }]);
          res(id);
        }, delay);
      }), []);

  useEffect(() => { pushBotRef.current  = pushBot;  }, [pushBot]);
  useEffect(() => { pushUserRef.current = pushUser; }, [pushUser]);

  // ── Occasion flow ─────────────────────────────────────────────────────────
  const runOccasionFlow = useCallback((
    pb: typeof pushBot, pu: typeof pushUser,
    gender: string, bs: string, st: string,
    preselectedPersona?: string | null,
  ) => {
    const run = async () => {
      const occId = await pb(
        <div>
          <p className="mb-3 font-semibold">What&apos;s the occasion? 🎉</p>
          <ChipSelector options={OCCASIONS} onSelect={async (occ) => {
            markAnswered(occId);
            pu(occ);

            const personaVibe = preselectedPersona ? PERSONA_VIBE_MAP[preselectedPersona] : null;
            const vibeOptions = getVibes(occ, gender);
            const defaultVibe = personaVibe && vibeOptions.includes(personaVibe) ? personaVibe : null;

            const vibeId = await pb(
              <div>
                <p className="mb-2 font-semibold">What&apos;s your vibe? ✨</p>
                {defaultVibe && (
                  <p className="text-[11px] text-[#d4af7f] mb-2.5">
                    ✦ Suggested for your <span className="font-bold">{preselectedPersona}</span> persona
                  </p>
                )}
                <ChipSelector options={vibeOptions} onSelect={async (vibe) => {
                  markAnswered(vibeId);
                  pu(vibe);

                  const budId = await pb(
                    <div>
                      <p className="mb-3 font-semibold">What&apos;s your budget? 💰</p>
                      <BudgetSlider occasion={occ} onConfirm={async (budgetRange) => {
                        markAnswered(budId);
                        pu(`${budgetRange.label} · up to ₹${budgetRange.max.toLocaleString("en-IN")}`);

                        // ── Loading spinner ──────────────────────────────────
                        const loadId = uid();
                        setMsgs((p) => [...p, {
                          id: loadId, role: "bot",
                          content: (
                            <div className="bg-[#111111] rounded-2xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
                              <div
                                className="w-8 h-8 rounded-full animate-spin"
                                style={{ border: "3px solid #d4af7f", borderTopColor: "transparent" }}
                              />
                              <p className="text-sm font-semibold text-[#d4af7f]">Curating {occ} picks…</p>
                              <div className="flex gap-1">
                                {[0,1,2].map((i) => (
                                  <span
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                  />
                                ))}
                              </div>
                            </div>
                          ),
                        }]);

                        await new Promise((r) => setTimeout(r, 1200));

                        // ── Show compliment BEFORE outfits ───────────────────
                        await pb(
                          <ComplimentBanner gender={gender} occasion={occ} />,
                          300
                        );

                        const matched = filterOutfits(gender, occ, vibe, bs, st, budgetRange.jsonKey);

                        setMsgs((p) => p.map((m) =>
                          m.id === loadId ? {
                            ...m,
                            content: (
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-2">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-bold text-white">{occ} Picks ✨</p>
                                  <span
                                    className="text-[10px] px-2 py-1 rounded-full font-semibold"
                                    style={{ background: "#d4af7f18", color: "#d4af7f" }}
                                  >
                                    {matched.length} look{matched.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                {matched.length > 0
                                  ? matched.map((outfit, idx) => (
                                      <OutfitItemsGrid key={outfit.id} outfit={outfit} occasion={occ} outfitIndex={idx} />
                                    ))
                                  : (
                                    <NoOutfitCard
                                      occasion={occ}
                                      vibe={vibe}
                                      budget={budgetRange.label}
                                      onRetry={() => {
                                        // Let user pick again — restart occasion flow WITHOUT consuming a usage
                                        runOccasionFlow(pb, pu, gender, bs, st, preselectedPersona);
                                      }}
                                    />
                                  )}
                              </motion.div>
                            ),
                          } : m
                        ));

                        // ── Increment usage after outfit shown ───────────────
                        await incrementUsage();
                        // Update live usage ref for EndCard dots
                        const { used: usedNow, limit: limitNow, hasReferral: refNow } = await checkLimit();
                        usageRef.current = { used: usedNow, limit: limitNow };

                        await pb(
                          <EndCard
                            onStartOver={handleStartOver}
                            onTryAnother={async () => {
                              const { allowed, used, limit, hasReferral } = await checkLimit();
                              if (!allowed) {
                                await pb(<LimitCard used={used} limit={limit} user={user} hasReferral={hasReferral} />, 300);
                                return;
                              }
                              runOccasionFlow(pb, pu, gender, bs, st, preselectedPersona);
                            }}
                            bodyShape={bs}
                            skinTone={st}
                            used={usedNow}
                            limit={limitNow}
                          />, 700
                        );
                      }} />
                    </div>, 600
                  );
                }} />
              </div>, 600
            );
          }} />
        </div>, 500
      );
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markAnswered]);

  const runPostClarification = useCallback(async (
    pb: typeof pushBot, pu: typeof pushUser,
    gender: string, bs: string, st: string,
    genderProp: "male" | "female",
  ) => {
    const palId = await pb(
      <ColorPaletteCard
        bodyShape={bs}
        skinTone={st}
        gender={genderProp}
        onContinue={async () => {
          markAnswered(palId);
          runOccasionFlow(pb, pu, gender, bs, st, persona);
        }}
      />, 500
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markAnswered, runOccasionFlow, persona]);

  const runManualClarification = useCallback(async (
    pb: typeof pushBot, pu: typeof pushUser,
    gender: string,
  ) => {
    const clarId = await pb(
      <ManualClarificationCard
        onConfirm={async (bs, st) => {
          markAnswered(clarId);
          pu(`${bs} · ${st} skin ✓`);
          analysisRef.current = { body_shape: bs, skin_tone: st };
          // Show body+skin compliment before colour palette
          await pb(
            <ProfileComplimentBanner bodyShape={bs} skinTone={st} gender={gender} />,
            400
          );
          await runPostClarification(pb, pu, gender, bs, st, toGenderProp(gender));
        }}
      />, 600
    );

    await pb(
      <button
        onClick={async () => {
          pu("Skip body & skin info");
          await pb("No problem! Let&apos;s find outfits for you 🛍️", 400);
          runOccasionFlow(pb, pu, gender, "", "", persona);
        }}
        className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline"
      >
        ▷ Skip this too
      </button>,
      300
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markAnswered, runOccasionFlow, runPostClarification, persona]);

  // ── Boot ──────────────────────────────────────────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("users_profile")
          .select("body_shape, skin_tone, gender")
          .eq("id", user.id)
          .single();

        const name = user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || "there";
        const firstName = name.split(" ")[0];

        if (profile?.body_shape && profile?.skin_tone) {
          analysisRef.current = { body_shape: profile.body_shape, skin_tone: profile.skin_tone };

          await pb(
            <div>
              <p className="font-bold text-white mb-1 text-base">Welcome back, {firstName}! 👋</p>
              <p className="text-neutral-400 text-sm">We remember your style profile.</p>
              <div className="flex items-center gap-2 mt-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2 w-fit">
                <span className="text-[#d4af7f] text-xs font-bold">{profile.body_shape}</span>
                <span className="text-neutral-700">·</span>
                <span className="text-[#d4af7f] text-xs font-bold">{profile.skin_tone} skin</span>
                {persona && (
                  <>
                    <span className="text-neutral-700">·</span>
                    <span className="text-[#d4af7f] text-xs font-bold">{persona}</span>
                  </>
                )}
              </div>
            </div>, 800
          );

          await pb(
            <ReturningUserPrompt
              bodyShape={profile.body_shape}
              skinTone={profile.skin_tone}
              onUseProfile={() => {
                pu("Use my saved profile ✓");
                (async () => {
                  const gId = await pb(
                    <div>
                      <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                      <ChipSelector options={["Female","Male"]} onSelect={(g) => {
                        markAnswered(gId);
                        pu(g);
                        genderRef.current = g;
                        runOccasionFlow(pb, pu, g, profile.body_shape, profile.skin_tone, persona);
                      }} />
                    </div>, 400
                  );
                })();
              }}
              onStyleSomeoneElse={async () => {
                pu("Style someone else");
                analysisRef.current = null;
                await pb("Sure! Let's start fresh 📸", 400);
                const gId = await pb(
                  <div>
                    <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                    <ChipSelector options={["Female","Male"]} onSelect={async (g) => {
                      markAnswered(gId);
                      pu(g);
                      genderRef.current = g;
                      await pb(
                        <UploadPromptMsg
                          onCamera={() => camRef.current?.click()}
                          onUpload={() => fileRef.current?.click()}
                          onSkip={async () => {
                            pu("Skip photo");
                            await pb("No worries! 😊", 400);
                            runManualClarification(pb, pu, g);
                          }}
                        />, 600
                      );
                    }} />
                  </div>, 600
                );
              }}
            />, 600
          );
          return;
        }
      } catch { /* fall through */ }
    }

    await pb(
      <div>
        <p className="font-bold text-white mb-1 text-base">Hey! I&apos;m your AI Stylist 👋</p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you.
          I can analyse your body type &amp; skin tone for better recommendations.
        </p>
        {persona && (
          <div className="mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: "#d4af7f" }} />
            <p className="text-[#d4af7f] text-xs font-medium">Styling as: {persona}</p>
          </div>
        )}
        {!persona && (
          <p className="text-[#d4af7f] text-xs mt-2 font-medium">Let&apos;s get started!</p>
        )}
      </div>, 900
    );

    const gId = await pb(
      <div>
        <p className="font-semibold text-white mb-3">First — who are we styling today? 👗</p>
        <ChipSelector options={["Female","Male"]} onSelect={async (gender) => {
          markAnswered(gId);
          pu(gender);
          genderRef.current = gender;
          await pb(
            <UploadPromptMsg
              onCamera={() => camRef.current?.click()}
              onUpload={() => fileRef.current?.click()}
              onSkip={async () => {
                pu("Skip photo");
                await pb("No worries! 😊", 500);
                runManualClarification(pb, pu, gender);
              }}
            />, 800
          );
        }} />
      </div>, 1000
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, markAnswered, runOccasionFlow, runManualClarification, persona]);

  const handleStartOver = useCallback(async () => {
    const { allowed, used, limit, hasReferral } = await checkLimit();
    if (!allowed) {
      await pushBot(<LimitCard used={used} limit={limit} user={user} hasReferral={hasReferral} />, 300);
      return;
    }
    _n = 0;
    genderRef.current   = "";
    analysisRef.current = null;
    setAnalysing(false);
    setMsgs([]);
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser, checkLimit, user]);

  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  const handleFile = useCallback((file: File) => {
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      pu(<img src={url} alt="you" className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-[#d4af7f]/40" />);
      const { allowed, used, limit, hasReferral } = await checkLimit();
      if (!allowed) { await pb(<LimitCard used={used} limit={limit} user={user} hasReferral={hasReferral} />, 400); return; }
      if (!user) {
        await pb(
          <div className="space-y-3">
            <p className="font-semibold text-white">Great photo! 📸</p>
            <p className="text-sm text-neutral-400 leading-relaxed">Sign in to save your style analysis.</p>
            <div className="flex gap-2 flex-wrap">
              <a href="/login" className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-black"
                style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In</a>
              <a href="/signup" className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
                Create Account</a>
            </div>
            <button
              onClick={() => { setAnalyseImgUrl(url); setAnalysing(true); }}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline block"
            >
              ▷ Continue without account
            </button>
          </div>, 600
        );
        return;
      }
      setAnalyseImgUrl(url);
      setAnalysing(true);
    };
    reader.readAsDataURL(file);
  }, [checkLimit, user]);

  const onAnalysisDone = useCallback(async (result: { body_shape: string; skin_tone: string; person_detected: boolean }) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    const shape      = result.body_shape;
    const tone       = result.skin_tone;
    const gender     = genderRef.current || "Female";
    const genderProp = toGenderProp(gender);
    analysisRef.current = { body_shape: shape, skin_tone: tone };

    const editId = await pb(
      <div>
        <p className="mb-1 text-sm font-medium">Here&apos;s what I found! ✨</p>
        <p className="text-xs text-neutral-500 mb-3">If anything looks off, correct it below.</p>
        <AnalysisEditor bodyShape={shape} skinTone={tone} onConfirm={async (s, t) => {
          markAnswered(editId);
          analysisRef.current = { body_shape: s, skin_tone: t };
          pu(`${s} · ${t} skin ✓`);
          // Show body+skin compliment before colour palette
          await pb(
            <ProfileComplimentBanner bodyShape={s} skinTone={t} gender={gender} />,
            400
          );
          await runPostClarification(pb, pu, gender, s, t, genderProp);
        }} />
      </div>, 600
    );
  }, [markAnswered, runPostClarification]);

  const onAnalysisError = useCallback(async (message: string) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    await pb(
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4">
        <p className="text-sm font-bold text-red-400 mb-1">📷 Oops!</p>
        <p className="text-sm text-red-300/80 leading-relaxed">{message}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#111111] border border-red-800/50 text-red-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-950/30 transition"
          >
            📁 Try another photo
          </button>
          <button
            onClick={async () => {
              pu("I'll skip the photo");
              await pb("No worries! 😊", 400);
              runManualClarification(pb, pu, genderRef.current);
            }}
            className="flex items-center gap-1.5 bg-[#111111] border border-neutral-800 text-neutral-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1a1a1a] transition"
          >
            ▷ Skip and continue
          </button>
        </div>
      </div>, 400
    );
  }, [runManualClarification]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto relative" style={{ minHeight: "100dvh", background: "#0a0a0a" }}>
      <header className="flex items-center justify-center px-4 py-4 bg-[#0a0a0a] z-50 border-b border-neutral-800 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Steal the{" "}
          <span className="italic" style={{
            background: "linear-gradient(135deg,#d4af7f,#b8860b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Look</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none", background: "#0a0a0a", minHeight: "0" }}>
        <AnimatePresence>
          {showBanner && (
            <PersonaBanner persona={persona} onDismiss={() => setShowBanner(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ChatBubble role={m.role} answered={m.answered}>{m.content}</ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      <AnimatePresence>
        {analysing && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <div className="w-full max-w-sm">
              <AnalysisScreen imageUrl={analyseImgUrl} onDone={onAnalysisDone} onError={onAnalysisError} durationMs={6000} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

// ── No outfit found — lets user retry without using a suggestion ──────────────
function NoOutfitCard({ occasion, vibe, budget, onRetry }: {
  occasion: string; vibe: string; budget: string; onRetry: () => void;
}) {
  const [clicked, setClicked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🔍</span>
        <div>
          <p className="text-sm font-bold text-white">No outfits found</p>
          <p className="text-xs text-neutral-500">for {vibe} · {occasion} · {budget} budget</p>
        </div>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">
        We don&apos;t have an outfit matching that exact combo yet — but you can try a different occasion, vibe or budget and it won&apos;t count against your daily limit!
      </p>
      <div className="grid grid-cols-1 gap-2">
        <motion.button
          onClick={() => { if (clicked) return; setClicked(true); onRetry(); }}
          disabled={clicked}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        >
          🔄 Try a different occasion / vibe / budget
        </motion.button>
      </div>
      <p className="text-[10px] text-neutral-700 text-center">
        We&apos;re adding new outfits daily — check back soon! 🛍️
      </p>
    </motion.div>
  );
}



function LimitCard({ used, limit, user, hasReferral }: {
  used: number; limit: number; user: any; hasReferral?: boolean;
}) {
  const now  = new Date();
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (now >= noon) noon.setDate(noon.getDate() + 1);
  const diffMs  = noon.getTime() - now.getTime();
  const diffH   = Math.floor(diffMs / 3_600_000);
  const diffM   = Math.floor((diffMs % 3_600_000) / 60_000);
  const resetIn = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl border relative overflow-hidden p-4 space-y-3"
      style={{ background: "linear-gradient(135deg,#1a0a00,#111111)", borderColor: "#d4af7f30" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div>
          <p className="text-sm font-bold text-[#d4af7f]">Daily limit reached</p>
          <p className="text-[10px] text-neutral-500">Resets in {resetIn} (at noon)</p>
        </div>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full border"
              style={{ background: i < used ? "#d4af7f" : "transparent", borderColor: "#d4af7f60" }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed">
        You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> outfit suggestions today.
      </p>

      {!user && (
        <div className="space-y-2">
          <p className="text-xs text-neutral-500">
            Sign in to get <span className="text-[#d4af7f] font-semibold">2 suggestions/day</span> + 1 bonus for referring a friend!
          </p>
          <div className="flex gap-2 flex-wrap">
            <a href="/login" className="px-4 py-2 rounded-full text-sm font-bold text-black"
              style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In for More</a>
            <a href="/signup" className="px-4 py-2 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
              Create Account</a>
          </div>
        </div>
      )}

      {user && !hasReferral && (
        <div className="rounded-xl p-3 border border-[#d4af7f]/20 bg-[#d4af7f08]">
          <p className="text-xs text-[#d4af7f] font-semibold mb-1">🎁 Unlock a 3rd suggestion</p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Refer a friend to Outfevibe and get a permanent +1 bonus suggestion every day.
          </p>
          <a href="/refer" className="mt-2 inline-block text-xs font-bold px-3 py-1.5 rounded-full text-black"
            style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
            Refer a Friend →
          </a>
        </div>
      )}

      {user && hasReferral && (
        <p className="text-xs text-neutral-500">✓ Referral bonus active · Come back after noon 🌅</p>
      )}
    </motion.div>
  );
}

function EndCard({ onStartOver, onTryAnother, bodyShape, skinTone, used, limit }: {
  onStartOver: () => void; onTryAnother: () => void; bodyShape: string; skinTone: string;
  used?: number; limit?: number;
}) {
  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sharing,   setSharing]   = useState(false);

  const STAR_LABELS = ["", "Not great", "Okay", "Good", "Loved it", "Perfect! ✨"];

  const handleRate = (star: number) => {
    if (submitted) return;
    setRating(star);
    setSubmitted(true);
  };

  const handleShare = async () => {
    setSharing(true);
    const profile = [bodyShape && `${bodyShape} body shape`, skinTone && `${skinTone} skin tone`].filter(Boolean).join(" & ");
    const text = `✨ ${profile} — check yours!\n\nI used Outfevibe\'s AI Stylist 🛍️\n\noutfevibe.com/outfit`;
    try {
      if (navigator.share) await navigator.share({ title: "My Outfevibe Style", text, url: "https://www.outfevibe.com/outfit" });
      else { await navigator.clipboard.writeText(text); }
    } catch {}
    setSharing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {/* Usage indicator */}
      {used !== undefined && limit !== undefined && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-neutral-600">
            Today&apos;s suggestions:
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full border transition-all"
                style={{
                  background:  i < used ? "#d4af7f" : "transparent",
                  borderColor: "#d4af7f60",
                }}
              />
            ))}
            <span className="text-[10px] text-neutral-600 ml-1">{used}/{limit}</span>
          </div>
        </div>
      )}

      {/* Rating card */}
      <div className="rounded-2xl border border-neutral-800 bg-[#111111] overflow-hidden">
        {!submitted ? (
          <div className="p-4">
            <p className="text-sm font-bold text-white mb-0.5">Did this look work for you?</p>
            <p className="text-xs text-neutral-500 mb-4">Your feedback helps us style you better next time.</p>
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleRate(star)}
                  className="text-3xl leading-none transition-all duration-100"
                  style={{ color: star <= (hovered || rating) ? "#d4af7f" : "#2a2a2a", filter: star <= (hovered || rating) ? "drop-shadow(0 0 6px #d4af7f60)" : "none" }}
                >
                  ★
                </motion.button>
              ))}
            </div>
            {hovered > 0 && (
              <motion.p
                key={hovered}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold"
                style={{ color: "#d4af7f" }}
              >
                {STAR_LABELS[hovered]}
              </motion.p>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#d4af7f18" }}>
              <span className="text-lg">🙏</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Thanks for rating!</p>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="text-sm" style={{ color: s <= rating ? "#d4af7f" : "#2a2a2a" }}>★</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Primary action */}
      <motion.button
        onClick={onTryAnother}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 rounded-2xl text-sm font-bold text-black relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Explore Another Style
        </span>
        <motion.span
          className="absolute inset-y-0 w-1/3 skew-x-[-15deg] pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)" }}
          animate={{ left: ["-40%", "130%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
        />
      </motion.button>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={handleShare}
          disabled={sharing}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all"
          style={{ background: "#111111", borderColor: "#d4af7f40", color: "#d4af7f" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          {sharing ? "Sharing…" : "Share Look"}
        </motion.button>

        <a
          href="/#feedback"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all"
          style={{ background: "#111111", borderColor: "#2a2a2a", color: "#888" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Feedback
        </a>
      </div>

      {/* Start over */}
      <button
        onClick={onStartOver}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-neutral-700 hover:text-neutral-500 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        Start completely over
      </button>
    </motion.div>
  );
}

function ReturningUserPrompt({ bodyShape, skinTone, onUseProfile, onStyleSomeoneElse }: {
  bodyShape: string; skinTone: string; onUseProfile: () => void; onStyleSomeoneElse: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-300">What would you like to do?</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => { setChosen("profile"); onUseProfile(); }}
          disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-black text-left"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", opacity: chosen && chosen !== "profile" ? 0.4 : 1 }}
        >
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-black">Use my saved profile</p>
            <p className="text-[11px] font-normal opacity-70">{bodyShape} · {skinTone} skin</p>
          </div>
        </button>
        <button
          onClick={() => { setChosen("else"); onStyleSomeoneElse(); }}
          disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-neutral-300 text-left hover:bg-[#222]"
          style={{ opacity: chosen && chosen !== "else" ? 0.4 : 1 }}
        >
          <span className="text-lg">👥</span>
          <div>
            <p>Style someone else</p>
            <p className="text-[11px] font-normal text-neutral-600">Upload a new photo</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function UploadPromptMsg({ onCamera, onUpload, onSkip }: {
  onCamera: () => void; onUpload: () => void; onSkip: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-neutral-200">
        Want to share a photo? I&apos;ll analyse your body shape &amp; skin tone 📸
      </p>
      <div className="mb-3 rounded-xl bg-[#1a1500] border border-[#d4af7f]/20 px-3 py-2.5 flex gap-2 items-start">
        <span className="text-sm mt-0.5">💡</span>
        <p className="text-xs text-neutral-400 leading-relaxed">
          For best results, upload a <span className="text-[#d4af7f] font-semibold">full-body photo</span> with a{" "}
          <span className="text-[#d4af7f] font-semibold">plain background</span>.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onCamera}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
        >
          <Camera className="w-4 h-4 text-pink-500" /> Take Photo
        </button>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
        >
          <Upload className="w-4 h-4 text-purple-500" /> Upload
        </button>
      </div>
      <button
        onClick={onSkip}
        className="mt-3 flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline"
      >
        ▷ Skip for now
      </button>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Check, Bookmark } from "lucide-react";

// ── Color recommendations by skin tone ───────────────────────────────────────
const SKIN_TONE_COLORS: Record<string, Array<{ name: string; hex: string; why: string }>> = {
  Fair: [
    { name: "Dusty Rose",    hex: "#C19A9A", why: "Soft warmth" },
    { name: "Powder Blue",   hex: "#B0C4DE", why: "Cool contrast" },
    { name: "Sage Green",    hex: "#87A878", why: "Natural glow" },
    { name: "Lavender",      hex: "#B57BCA", why: "Dreamy tone" },
    { name: "Ivory",         hex: "#FFFFF0", why: "Luminous" },
    { name: "Berry",         hex: "#8B2252", why: "Bold pop" },
  ],
  Light: [
    { name: "Coral",         hex: "#FF6B6B", why: "Warm flush" },
    { name: "Sky Blue",      hex: "#87CEEB", why: "Fresh contrast" },
    { name: "Mint",          hex: "#98D8C8", why: "Cool glow" },
    { name: "Blush Pink",    hex: "#FFB6C1", why: "Soft femininity" },
    { name: "Champagne",     hex: "#F7E7CE", why: "Subtle radiance" },
    { name: "Teal",          hex: "#008080", why: "Rich depth" },
  ],
  Medium: [
    { name: "Rust",          hex: "#B7410E", why: "Earthy warmth" },
    { name: "Olive",         hex: "#808000", why: "Natural match" },
    { name: "Burnt Orange",  hex: "#CC5500", why: "Bold warmth" },
    { name: "Mustard",       hex: "#FFDB58", why: "Golden glow" },
    { name: "Terracotta",    hex: "#C66A53", why: "Earthy depth" },
    { name: "Forest Green",  hex: "#228B22", why: "Rich contrast" },
  ],
  Tan: [
    { name: "Gold",          hex: "#FFD700", why: "Stunning contrast" },
    { name: "Deep Coral",    hex: "#FF4500", why: "Vibrant pop" },
    { name: "Cobalt Blue",   hex: "#0047AB", why: "Bold statement" },
    { name: "Ivory White",   hex: "#FFFFF0", why: "Clean contrast" },
    { name: "Copper",        hex: "#B87333", why: "Warm harmony" },
    { name: "Emerald",       hex: "#50C878", why: "Jewel tone glow" },
  ],
  Deep: [
    { name: "Fuchsia",       hex: "#FF00FF", why: "Electric pop" },
    { name: "Royal Blue",    hex: "#4169E1", why: "Rich contrast" },
    { name: "Orange",        hex: "#FF8C00", why: "Bold warmth" },
    { name: "Bright White",  hex: "#FFFFFF", why: "Crisp contrast" },
    { name: "Gold",          hex: "#FFD700", why: "Luxe glow" },
    { name: "Red",           hex: "#CC0000", why: "Powerful statement" },
  ],
  Dark: [
    { name: "Electric Blue", hex: "#0000FF", why: "Vivid contrast" },
    { name: "Hot Pink",      hex: "#FF69B4", why: "Striking pop" },
    { name: "Bright Yellow", hex: "#FFFF00", why: "Bold brightness" },
    { name: "Pure White",    hex: "#FFFFFF", why: "Maximum contrast" },
    { name: "Bright Red",    hex: "#FF0000", why: "Bold power" },
    { name: "Lime Green",    hex: "#00FF00", why: "Vivid freshness" },
  ],
};

// ── Style tips by body shape — WOMEN ─────────────────────────────────────────
const BODY_SHAPE_TIPS_FEMALE: Record<string, {
  tip: string;
  avoid: string;
  outfits: string[];
}> = {
  Hourglass: {
    tip:     "Fitted silhouettes, wrap dresses, belted kurtas that highlight your waist.",
    avoid:   "Boxy or shapeless cuts that hide your natural curves.",
    outfits: ["Wrap dress", "Belted anarkali", "Bodycon co-ord set", "Fitted salwar suit", "Peplum top + straight jeans"],
  },
  Pear: {
    tip:     "Bold tops, off-shoulder styles, A-line lehengas, palazzo pants that balance proportions.",
    avoid:   "Tight bottoms, pencil skirts, or anything that adds volume to hips.",
    outfits: ["A-line lehenga", "Off-shoulder top + palazzo", "Flared skirt + embellished blouse", "Boat neck kurti + churidar", "Ruffled top + wide-leg trousers"],
  },
  Apple: {
    tip:     "Empire waists, V-neck kurtis, flowy anarkalis, straight-leg trousers that elongate.",
    avoid:   "Tight waistbands, cropped tops, or clingy fabric around the midsection.",
    outfits: ["Empire waist anarkali", "V-neck flowy kurti", "Straight-cut salwar suit", "Longline blazer + trousers", "Wrap top + palazzo"],
  },
  Rectangle: {
    tip:     "Peplum kurtis, ruffled dupattas, layered outfits, and cinched waist belts to create curves.",
    avoid:   "Straight cuts with no definition — always add structure and shape.",
    outfits: ["Peplum kurti + fitted pants", "Layered lehenga", "Ruffled saree drape", "Tiered skirt + fitted top", "Belted shrug + flared dress"],
  },
  "Inverted Triangle": {
    tip:     "Flared lehengas, wide-leg pants, A-line kurtas to balance broader shoulders.",
    avoid:   "Boat necks, shoulder pads, or anything that widens the upper body further.",
    outfits: ["A-line flared lehenga", "Wide-leg palazzo + simple top", "V-neck kurta + churidar", "Fit & flare dress", "Straight-cut salwar"],
  },
};

// ── Style tips by body shape — MEN ───────────────────────────────────────────
const BODY_SHAPE_TIPS_MALE: Record<string, {
  tip: string;
  avoid: string;
  outfits: string[];
}> = {
  Athletic: {
    tip:     "Fitted shirts, structured blazers, slim-fit trousers that showcase your build.",
    avoid:   "Oversized or boxy fits that hide your physique.",
    outfits: ["Slim-fit kurta + churidar", "Fitted bandhgala", "Structured sherwani", "Slim chinos + fitted shirt", "Tailored blazer + trousers"],
  },
  Slim: {
    tip:     "Layered outfits, structured sherwanis, slim-fit kurtas with jackets that add visual bulk.",
    avoid:   "Ultra-tight fits that emphasise leanness; pure vertical stripes.",
    outfits: ["Layered nehru jacket + kurta", "Slim-fit kurta + jacket", "Structured sherwani", "Chinos + textured shirt", "Double-breasted bandhgala"],
  },
  Rectangle: {
    tip:     "Structured sherwanis, well-tailored kurtas, layered ensembles that create shape.",
    avoid:   "Completely straight-cut outfits with no dimension.",
    outfits: ["Structured sherwani set", "Nehru jacket + kurta pajama", "Tailored suit", "Kurta + fitted joggers", "Textured blazer + trousers"],
  },
  Oval: {
    tip:     "Longline kurtas, vertical patterns, dark solid tones and straight-cut trousers that elongate.",
    avoid:   "Tight waistbands, horizontal stripes, or anything that draws attention to the midsection.",
    outfits: ["Longline straight kurta + churidar", "Dark solid sherwani", "Straight-cut kurta pajama", "Vertical print shirt + straight trousers", "Nehru collar shirt + flat-front pants"],
  },
  "Inverted Triangle": {
    tip:     "Straight-cut trousers, slim-fit bottoms, simple kurtas that balance broader shoulders.",
    avoid:   "Wide lapels, bold shoulder detailing, or bulky upper layers.",
    outfits: ["Slim-fit kurta + straight pajama", "Simple bandhgala", "Flat-front trousers + plain shirt", "Straight sherwani + no embellishment at shoulders", "Chinos + crew-neck tee"],
  },
};

// ── Fallback body shapes if analyser returns something unexpected ─────────────
const FEMALE_SHAPE_KEYS = Object.keys(BODY_SHAPE_TIPS_FEMALE);
const MALE_SHAPE_KEYS   = Object.keys(BODY_SHAPE_TIPS_MALE);

function resolveShape(shape: string, gender: "male" | "female"): string {
  if (gender === "female") {
    return FEMALE_SHAPE_KEYS.includes(shape) ? shape : "Rectangle";
  }
  // Male shapes may come in as "Rectangle", "Athletic", "Slim", "Oval" etc.
  // Also gracefully map female shape names that might slip through
  const map: Record<string, string> = {
    Hourglass:           "Athletic",
    Pear:                "Oval",
    Apple:               "Oval",
    "Inverted Triangle": "Inverted Triangle",
  };
  if (MALE_SHAPE_KEYS.includes(shape)) return shape;
  return map[shape] ?? "Rectangle";
}

interface Props {
  bodyShape: string;
  skinTone:  string;
  gender?:   "male" | "female";   // default: "female"
  onContinue: () => void;
}

export function ColorPaletteCard({ bodyShape, skinTone, gender = "female", onContinue }: Props) {
  const { user }                = useAuth();
  const [saved,   setSaved]     = useState(false);
  const [saving,  setSaving]    = useState(false);

  const isMale      = gender === "male";
  const resolvedShape = resolveShape(bodyShape, gender);

  const colors     = SKIN_TONE_COLORS[skinTone] ?? SKIN_TONE_COLORS["Medium"];
  const shapeTips  = isMale
    ? (BODY_SHAPE_TIPS_MALE[resolvedShape]   ?? BODY_SHAPE_TIPS_MALE["Rectangle"])
    : (BODY_SHAPE_TIPS_FEMALE[resolvedShape] ?? BODY_SHAPE_TIPS_FEMALE["Rectangle"]);

  const handleSave = async () => {
    if (!user || saved) return;
    setSaving(true);
    try {
      await supabase
        .from("users_profile")
        .update({
          body_shape:    resolvedShape,
          skin_tone:     skinTone,
          color_palette: colors.map((c) => c.name),
        })
        .eq("id", user.id);
      setSaved(true);
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#111111] mt-2"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-neutral-800"
        style={{ background: "linear-gradient(135deg,#1a1500,#111111)" }}
      >
        <p className="text-xs font-bold text-[#d4af7f] uppercase tracking-wider">
          🎨 Your Colour Palette
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">
          Curated for {resolvedShape} · {skinTone} skin · {isMale ? "Men" : "Women"}
        </p>
      </div>

      <div className="p-4 space-y-5">

        {/* Color swatches */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Colours that will make you glow ✨
          </p>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color, i) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden border border-neutral-800"
              >
                <div
                  className="h-14 w-full"
                  style={{
                    background: color.hex,
                    border: color.hex === "#FFFFFF" || color.hex === "#FFFFF0" || color.hex === "#FFFF00" ? "1px solid #333" : "none",
                  }}
                />
                <div className="px-2 py-1.5 bg-[#1a1a1a]">
                  <p className="text-[11px] font-semibold text-white leading-tight truncate">{color.name}</p>
                  <p className="text-[10px] text-neutral-600 truncate">{color.why}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Style tips */}
        <div className="rounded-xl border border-neutral-800 bg-[#1a1a1a] p-3 space-y-3">
          <p className="text-xs font-bold text-[#d4af7f] uppercase tracking-wider">
            Style Tips for {resolvedShape} {isMale ? "Men" : ""}
          </p>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <span className="text-green-400 text-xs mt-0.5 flex-shrink-0">✓</span>
              <p className="text-xs text-neutral-300 leading-relaxed">{shapeTips.tip}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✕</span>
              <p className="text-xs text-neutral-500 leading-relaxed">{shapeTips.avoid}</p>
            </div>
          </div>

          {/* Outfit recommendations */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-1">
              {isMale ? "👔" : "👗"} Recommended Outfits
            </p>
            <div className="flex flex-wrap gap-1.5">
              {shapeTips.outfits.map((outfit, i) => (
                <motion.span
                  key={outfit}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-neutral-700 text-neutral-300"
                  style={{ background: "#111111" }}
                >
                  {outfit}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Save to profile */}
        {user && (
          <motion.button
            onClick={handleSave}
            disabled={saved || saving}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all border"
            style={
              saved
                ? { background: "#1a1a1a", borderColor: "#2a2a2a", color: "#d4af7f" }
                : { background: "linear-gradient(135deg,#d4af7f,#b8860b)", borderColor: "transparent", color: "#000" }
            }
          >
            {saved ? (
              <><Check className="w-3.5 h-3.5" /> Saved to your profile ✓</>
            ) : saving ? (
              "Saving…"
            ) : (
              <><Bookmark className="w-3.5 h-3.5" /> Save to Profile</>
            )}
          </motion.button>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full rounded-xl py-3 text-sm font-bold text-black transition-all"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        >
          Find My Outfits →
        </button>

      </div>
    </motion.div>
  );
}
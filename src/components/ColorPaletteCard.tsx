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

// ── Style tips by body shape ──────────────────────────────────────────────────
const BODY_SHAPE_TIPS: Record<string, { tip: string; avoid: string }> = {
  Hourglass: {
    tip:   "Fitted silhouettes, wrap dresses, belted styles that highlight your waist.",
    avoid: "Boxy or shapeless cuts that hide your natural curves.",
  },
  Pear: {
    tip:   "Bold tops, off-shoulder, A-line skirts, wide-leg pants that balance proportions.",
    avoid: "Tight bottoms, pencil skirts, or anything that adds volume to hips.",
  },
  Apple: {
    tip:   "Empire waists, V-necks, flowy tops, straight-leg trousers that elongate.",
    avoid: "Tight waistbands, cropped tops, or clingy fabric around the midsection.",
  },
  Rectangle: {
    tip:   "Peplum tops, ruffles, layered outfits, and belts to create the illusion of curves.",
    avoid: "Straight cuts with no definition — add structure and shape.",
  },
  "Inverted Triangle": {
    tip:   "Flared skirts, wide-leg pants, A-line silhouettes to balance broader shoulders.",
    avoid: "Boat necks, shoulder pads, or anything that widens the upper body further.",
  },
};

interface Props {
  bodyShape: string;
  skinTone: string;
  onContinue: () => void;
}

export function ColorPaletteCard({ bodyShape, skinTone, onContinue }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const colors = SKIN_TONE_COLORS[skinTone] ?? SKIN_TONE_COLORS["Medium"];
  const shapeTips = BODY_SHAPE_TIPS[bodyShape] ?? BODY_SHAPE_TIPS["Rectangle"];

  const handleSave = async () => {
    if (!user || saved) return;
    setSaving(true);
    try {
      await supabase
        .from("users_profile")
        .update({
          body_shape:    bodyShape,
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
          Curated for {bodyShape} · {skinTone} skin
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
                {/* Swatch */}
                <div
                  className="h-14 w-full"
                  style={{
                    background: color.hex,
                    border: color.hex === "#FFFFFF" || color.hex === "#FFFFF0" ? "1px solid #333" : "none",
                  }}
                />
                {/* Label */}
                <div className="px-2 py-1.5 bg-[#1a1a1a]">
                  <p className="text-[11px] font-semibold text-white leading-tight truncate">{color.name}</p>
                  <p className="text-[10px] text-neutral-600 truncate">{color.why}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Style tips */}
        <div className="rounded-xl border border-neutral-800 bg-[#1a1a1a] p-3 space-y-2">
          <p className="text-xs font-bold text-[#d4af7f] uppercase tracking-wider">
            Style Tips for {bodyShape}
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
        </div>

        {/* Save to profile */}
        {user && (
          <motion.button
            onClick={handleSave}
            disabled={saved || saving}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all border"
            style={saved
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
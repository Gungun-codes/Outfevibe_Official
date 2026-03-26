"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const OPTION_META: Record<string, { icon: string; desc?: string }> = {
  Female:         { icon: "👗" },
  Male:           { icon: "👔" },
  College:        { icon: "🎒", desc: "Casual & cool" },
  Party:          { icon: "🎉", desc: "Night out ready" },
  Date:           { icon: "💕", desc: "Romantic vibes" },
  Festive:        { icon: "✨", desc: "Celebrate it" },
  Wedding:        { icon: "💍", desc: "All dressed up" },
  Work:           { icon: "💼", desc: "Power dressing" },
  // ── Occasion-specific moods ──────────────────────────────────────────────
  // College moods
  "Chill & Easy":    { icon: "😌", desc: "Low effort, high style" },
  "Stand Out":       { icon: "🌟", desc: "All eyes on you" },
  "Sporty Fit":      { icon: "🏃", desc: "Active & fresh" },
  "Soft & Preppy":   { icon: "🎀", desc: "Put-together look" },
  // Party moods
  "Club Ready":      { icon: "🪩", desc: "Dance floor approved" },
  "Rooftop Chic":    { icon: "🌆", desc: "Elevated casual" },
  "Bold & Loud":     { icon: "💥", desc: "Statement pieces" },
  "Glam Night":      { icon: "💎", desc: "All that glitters" },
  // Date moods
  "Soft & Dreamy":   { icon: "🌸", desc: "Feminine & sweet" },
  "Subtle Elegant":  { icon: "🕊️", desc: "Understated charm" },
  "Flirty & Fun":    { icon: "🌷", desc: "Playful energy" },
  "Confident Sexy":  { icon: "🔥", desc: "Own the room" },
  // Festive moods
  "Traditional Glam":{ icon: "🪔", desc: "Ethnic elegance" },
  "Fusion Festive":  { icon: "🎊", desc: "East meets West" },
  "Pastel & Pretty": { icon: "🌈", desc: "Soft festive glow" },
  "Gold & Regal":    { icon: "👑", desc: "Royalty vibes" },
  // Wedding moods
  "Guest Glam":      { icon: "💫", desc: "Standout guest look" },
  "Bridal Party":    { icon: "💐", desc: "Coordinated & chic" },
  "Ethnic Royale":   { icon: "🏵️", desc: "Heavy & grand" },
  "Minimalist Wed":  { icon: "🤍", desc: "Subtle sophistication" },
  // Work moods
  "Power Dressing":  { icon: "🦾", desc: "Command the meeting" },
  "Smart Casual":    { icon: "✔️", desc: "Effortlessly neat" },
  "Creative Flex":   { icon: "🎨", desc: "Office with a twist" },
  "Boardroom Ready": { icon: "📊", desc: "Polished & sharp" },
  // Vibe fallback chips
  Classic:           { icon: "🖤", desc: "Timeless" },
  Boho:              { icon: "🌸", desc: "Free spirit" },
  Trendy:            { icon: "🔥", desc: "Right now" },
  Minimal:           { icon: "⬜", desc: "Less is more" },
  Edgy:              { icon: "⚡", desc: "Bold & sharp" },
  Romantic:          { icon: "🌹", desc: "Soft & dreamy" },
  "Street Style":    { icon: "🧢", desc: "Urban cool" },
  // Platforms
  Myntra:            { icon: "🛍️" },
  Ajio:              { icon: "🏷️" },
  Amazon:            { icon: "📦" },
  Flipkart:          { icon: "🛒" },
  Meesho:            { icon: "💜" },
};

// ── Occasion → mood options map ───────────────────────────────────────────────
const OCCASION_MOODS: Record<string, string[]> = {
  College:  ["Chill & Easy", "Stand Out", "Sporty Fit", "Soft & Preppy"],
  Party:    ["Club Ready", "Rooftop Chic", "Bold & Loud", "Glam Night"],
  Date:     ["Soft & Dreamy", "Subtle Elegant", "Flirty & Fun", "Confident Sexy"],
  Festive:  ["Traditional Glam", "Fusion Festive", "Pastel & Pretty", "Gold & Regal"],
  Wedding:  ["Guest Glam", "Bridal Party", "Ethnic Royale", "Minimalist Wed"],
  Work:     ["Power Dressing", "Smart Casual", "Creative Flex", "Boardroom Ready"],
};

// Brand colors
const ACTIVE_STYLE = {
  background:  "linear-gradient(135deg,#d4af7f,#b8860b)",
  borderColor: "transparent",
  color:       "#000",
  boxShadow:   "0 4px 20px rgba(212,175,127,0.35)",
};
const INACTIVE_STYLE = {
  background:  "#111111",
  borderColor: "#2a2a2a",
  color:       "#d4af7f",
};

interface ChipSelectorProps {
  options:      string[];
  onSelect:     (value: string) => void;
  multi?:       boolean;
  actionLabel?: string;
  // Pass the selected occasion so we can render mood chips in the same bubble
  selectedOccasion?: string | null;
}

export function ChipSelector({
  options,
  onSelect,
  multi        = false,
  actionLabel  = "✦ Find My Outfits",
  selectedOccasion,
}: ChipSelectorProps) {
  const [selected,       setSelected]       = useState<string[]>([]);
  const [committed,      setCommitted]      = useState<string | null>(null);
  // For the mood sub-step inside the same chip selector instance
  const [moodCommitted,  setMoodCommitted]  = useState<string | null>(null);
  const [showMoods,      setShowMoods]      = useState(false);

  const hasMeta    = options.some((o) => OPTION_META[o]);
  const hasDesc    = options.some((o) => OPTION_META[o]?.desc);
  const isGender   = options.includes("Female") && options.includes("Male");
  const isPlatform = options.includes("Myntra");
  const isOccasion = options.includes("College") || options.includes("Party");

  const toggle = (opt: string) => {
    if (!multi) {
      if (committed) return;
      setCommitted(opt);

      // If this is the occasion step, reveal mood selector after a beat
      if (isOccasion && OCCASION_MOODS[opt]) {
        setShowMoods(true);
        // Don't call onSelect yet — wait for mood pick
        return;
      }

      setTimeout(() => onSelect(opt), 320);
      return;
    }
    setSelected((p) => p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]);
  };

  const commitMood = (mood: string) => {
    if (moodCommitted) return;
    setMoodCommitted(mood);
    // Send combined value: "Wedding|Ethnic Royale"
    setTimeout(() => onSelect(`${committed}|${mood}`), 320);
  };

  // ── Gender — two big cards ───────────────────────────────────────────────
  if (isGender) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 mt-2">
        {options.map((opt) => {
          const isChosen = committed === opt;
          if (committed && !isChosen) return null;
          return (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={committed ? {} : { scale: 0.95 }}
              disabled={!!committed}
              className="relative flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden"
              style={isChosen ? ACTIVE_STYLE : INACTIVE_STYLE}
            >
              <span className="text-3xl">{OPTION_META[opt]?.icon}</span>
              <span className="text-sm font-bold tracking-wide">{opt}</span>
              {isChosen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-black/20 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  // ── Platform — multi select ──────────────────────────────────────────────
  if (isPlatform) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <motion.button
                key={opt}
                onClick={() => toggle(opt)}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200"
                style={active ? ACTIVE_STYLE : INACTIVE_STYLE}
              >
                <span>{OPTION_META[opt]?.icon}</span>
                {opt}
                {active && <Check className="w-3.5 h-3.5 text-black" />}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              onClick={() => onSelect(selected.join(","))}
              className="mt-4 w-full rounded-2xl py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2 text-black"
              style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", boxShadow: "0 4px 20px rgba(212,175,127,0.4)" }}
            >
              {actionLabel} ({selected.length} selected)
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Occasions & Vibes — card grid (with inline mood step) ────────────────
  if (hasDesc) {
    const moodOptions = committed && OCCASION_MOODS[committed] ? OCCASION_MOODS[committed] : null;

    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-2">
        {/* Occasion grid — collapses to only chosen after selection */}
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt) => {
            const meta     = OPTION_META[opt];
            const isChosen = committed === opt;
            if (committed && !isChosen) return null;
            return (
              <motion.button
                key={opt}
                onClick={() => toggle(opt)}
                whileTap={committed ? {} : { scale: 0.94 }}
                disabled={!!committed}
                className="relative flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200"
                style={isChosen ? ACTIVE_STYLE : INACTIVE_STYLE}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={isChosen ? { background: "rgba(0,0,0,0.15)" } : { background: "#1a1a1a" }}
                >
                  {meta?.icon ?? "✦"}
                </span>
                <div>
                  <p className={`text-sm font-bold leading-tight ${isChosen ? "text-black" : "text-white"}`}>{opt}</p>
                  {meta?.desc && (
                    <p className={`text-xs mt-0.5 ${isChosen ? "text-black/60" : "text-neutral-500"}`}>{meta.desc}</p>
                  )}
                </div>
                {isChosen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-black/20 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-black" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Mood sub-selector appears inline after occasion is picked ── */}
        <AnimatePresence>
          {showMoods && moodOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-neutral-800 bg-[#161616] p-3 space-y-2"
            >
              <p className="text-xs font-bold text-[#d4af7f] uppercase tracking-wider">
                ✦ What's your vibe for {committed}?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((mood) => {
                  const meta     = OPTION_META[mood];
                  const isChosen = moodCommitted === mood;
                  if (moodCommitted && !isChosen) return null;
                  return (
                    <motion.button
                      key={mood}
                      onClick={() => commitMood(mood)}
                      whileTap={moodCommitted ? {} : { scale: 0.94 }}
                      disabled={!!moodCommitted}
                      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200"
                      style={isChosen ? ACTIVE_STYLE : INACTIVE_STYLE}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={isChosen ? { background: "rgba(0,0,0,0.15)" } : { background: "#1a1a1a" }}
                      >
                        {meta?.icon ?? "✦"}
                      </span>
                      <div>
                        <p className={`text-xs font-bold leading-tight ${isChosen ? "text-black" : "text-white"}`}>{mood}</p>
                        {meta?.desc && (
                          <p className={`text-[10px] mt-0.5 ${isChosen ? "text-black/60" : "text-neutral-500"}`}>{meta.desc}</p>
                        )}
                      </div>
                      {isChosen && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 bg-black/20 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-black" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Fallback pill chips ───────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isChosen = !multi ? committed === opt : selected.includes(opt);
        if (!multi && committed && !isChosen) return null;
        return (
          <motion.button
            key={opt}
            onClick={() => toggle(opt)}
            whileTap={committed && !multi ? {} : { scale: 0.93 }}
            disabled={!!committed && !multi}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200"
            style={isChosen ? ACTIVE_STYLE : INACTIVE_STYLE}
          >
            {hasMeta && <span>{OPTION_META[opt]?.icon}</span>}
            {opt}
          </motion.button>
        );
      })}
      {multi && selected.length > 0 && (
        <div className="w-full mt-2">
          <button
            onClick={() => onSelect(selected.join(","))}
            className="text-black rounded-full px-6 py-2.5 text-sm font-bold shadow-md"
            style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}
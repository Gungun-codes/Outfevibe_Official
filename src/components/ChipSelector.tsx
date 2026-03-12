"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// Emoji maps for visual richness
const OPTION_META: Record<string, { icon: string; desc?: string }> = {
  // Gender
  Female:    { icon: "👗" },
  Male:      { icon: "👔" },
  // Occasions
  College:   { icon: "🎒", desc: "Casual & cool" },
  Party:     { icon: "🎉", desc: "Night out ready" },
  Date:      { icon: "💕", desc: "Romantic vibes" },
  Festive:   { icon: "✨", desc: "Celebrate it" },
  Wedding:   { icon: "💍", desc: "All dressed up" },
  Work:      { icon: "💼", desc: "Power dressing" },
  // Vibes
  Classic:        { icon: "🖤", desc: "Timeless" },
  Boho:           { icon: "🌸", desc: "Free spirit" },
  Trendy:         { icon: "🔥", desc: "Right now" },
  Minimal:        { icon: "⬜", desc: "Less is more" },
  Edgy:           { icon: "⚡", desc: "Bold & sharp" },
  Romantic:       { icon: "🌹", desc: "Soft & dreamy" },
  "Street Style": { icon: "🧢", desc: "Urban cool" },
  "Smart Casual": { icon: "✔️", desc: "Effortlessly neat" },
  // Platforms
  Myntra:   { icon: "🛍️" },
  Ajio:     { icon: "🏷️" },
  Amazon:   { icon: "📦" },
  Flipkart: { icon: "🛒" },
  Meesho:   { icon: "💜" },
};

interface ChipSelectorProps {
  options: string[];
  onSelect: (value: string) => void;
  multi?: boolean;
  actionLabel?: string;
}

export function ChipSelector({
  options,
  onSelect,
  multi = false,
  actionLabel = "✨ Find My Outfits",
}: ChipSelectorProps) {
  const [selected,  setSelected]  = useState<string[]>([]);
  const [committed, setCommitted] = useState<string | null>(null); // single-select lock

  const hasMeta    = options.some((o) => OPTION_META[o]);
  const hasDesc    = options.some((o) => OPTION_META[o]?.desc);
  const isGender   = options.includes("Female") && options.includes("Male");
  const isPlatform = options.includes("Myntra");

  const toggle = (opt: string) => {
    if (!multi) {
      if (committed) return;          // already chosen, lock it
      setCommitted(opt);
      setTimeout(() => onSelect(opt), 320); // slight delay so user sees selection
      return;
    }
    setSelected((p) => p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]);
  };

  // ── Gender — two big cards ───────────────────────────────────────────────
  if (isGender) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 mt-2"
      >
        {options.map((opt) => {
          const isChosen = committed === opt;
          return (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden"
              style={isChosen
                ? { background: "linear-gradient(135deg,#e91e8c,#9c27b0)", borderColor: "transparent", color: "#fff", boxShadow: "0 4px 20px rgba(233,30,140,0.35)" }
                : { background: "#faf5ff", borderColor: "#e9d5ff", color: "#6b21a8" }
              }
            >
              <span className="text-3xl">{OPTION_META[opt]?.icon}</span>
              <span className="text-sm font-bold tracking-wide">{opt}</span>
              {isChosen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  // ── Platform — multi select with icons ──────────────────────────────────
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
                style={active
                  ? { background: "linear-gradient(135deg,#e91e8c,#9c27b0)", borderColor: "transparent", color: "#fff", boxShadow: "0 2px 12px rgba(233,30,140,0.3)" }
                  : { background: "white", borderColor: "#e9d5ff", color: "#6b21a8" }
                }
              >
                <span>{OPTION_META[opt]?.icon}</span>
                {opt}
                {active && <Check className="w-3.5 h-3.5" />}
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
              className="mt-4 w-full text-white rounded-2xl py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#e91e8c,#9c27b0)", boxShadow: "0 4px 20px rgba(233,30,140,0.4)" }}
            >
              {actionLabel} ({selected.length} selected)
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Occasions & Vibes — card grid with icon + desc ───────────────────────
  if (hasDesc) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-2 mt-2"
      >
        {options.map((opt) => {
          const meta     = OPTION_META[opt];
          const isChosen = committed === opt;
          return (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.94 }}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200"
              style={isChosen
                ? { background: "linear-gradient(135deg,#e91e8c,#9c27b0)", borderColor: "transparent", boxShadow: "0 3px 14px rgba(233,30,140,0.35)" }
                : { background: "white", borderColor: "#e9d5ff" }
              }
            >
              {/* Icon bubble */}
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={isChosen ? { background: "rgba(255,255,255,0.2)" } : { background: "#faf5ff" }}
              >
                {meta?.icon ?? "✦"}
              </span>
              <div>
                <p className={`text-sm font-bold leading-tight ${isChosen ? "text-white" : "text-gray-800"}`}>
                  {opt}
                </p>
                {meta?.desc && (
                  <p className={`text-xs mt-0.5 ${isChosen ? "text-white/70" : "text-gray-400"}`}>
                    {meta.desc}
                  </p>
                )}
              </div>
              {isChosen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  // ── Fallback pill chips ───────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isChosen = !multi ? committed === opt : selected.includes(opt);
        return (
          <motion.button
            key={opt}
            onClick={() => toggle(opt)}
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200"
            style={isChosen
              ? { background: "linear-gradient(135deg,#e91e8c,#9c27b0)", borderColor: "transparent", color: "#fff" }
              : { background: "white", borderColor: "#e9d5ff", color: "#6b21a8" }
            }
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
            className="text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-md"
            style={{ background: "linear-gradient(135deg,#e91e8c,#9c27b0)" }}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}
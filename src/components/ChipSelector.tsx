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
  Classic:        { icon: "🖤", desc: "Timeless" },
  Boho:           { icon: "🌸", desc: "Free spirit" },
  Trendy:         { icon: "🔥", desc: "Right now" },
  Minimal:        { icon: "⬜", desc: "Less is more" },
  Edgy:           { icon: "⚡", desc: "Bold & sharp" },
  Romantic:       { icon: "🌹", desc: "Soft & dreamy" },
  "Street Style": { icon: "🧢", desc: "Urban cool" },
  "Smart Casual": { icon: "✔️", desc: "Effortlessly neat" },
  Myntra:         { icon: "🛍️" },
  Ajio:           { icon: "🏷️" },
  Amazon:         { icon: "📦" },
  Flipkart:       { icon: "🛒" },
  Meesho:         { icon: "💜" },
};

// Brand colors
const ACTIVE_STYLE = {
  background: "linear-gradient(135deg,#d4af7f,#b8860b)",
  borderColor: "transparent",
  color: "#000",
  boxShadow: "0 4px 20px rgba(212,175,127,0.35)",
};
const INACTIVE_STYLE = {
  background: "#111111",
  borderColor: "#2a2a2a",
  color: "#d4af7f",
};

interface ChipSelectorProps {
  options: string[];
  onSelect: (value: string) => void;
  multi?: boolean;
  actionLabel?: string;
}

export function ChipSelector({ options, onSelect, multi = false, actionLabel = "✦ Find My Outfits" }: ChipSelectorProps) {
  const [selected,  setSelected]  = useState<string[]>([]);
  const [committed, setCommitted] = useState<string | null>(null);

  const hasMeta    = options.some((o) => OPTION_META[o]);
  const hasDesc    = options.some((o) => OPTION_META[o]?.desc);
  const isGender   = options.includes("Female") && options.includes("Male");
  const isPlatform = options.includes("Myntra");

  const toggle = (opt: string) => {
    if (!multi) {
      if (committed) return;
      setCommitted(opt);
      setTimeout(() => onSelect(opt), 320);
      return;
    }
    setSelected((p) => p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]);
  };

  // ── Gender — two big cards ───────────────────────────────────────────────
  if (isGender) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 mt-2">
        {options.map((opt) => {
          const isChosen = committed === opt;
          // ✅ Hide unchosen options after selection
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

  // ── Occasions & Vibes — card grid ────────────────────────────────────────
  if (hasDesc) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2 mt-2">
        {options.map((opt) => {
          const meta     = OPTION_META[opt];
          const isChosen = committed === opt;
          // ✅ Hide unchosen options after selection
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
      </motion.div>
    );
  }

  // ── Fallback pill chips ───────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isChosen = !multi ? committed === opt : selected.includes(opt);
        // ✅ Hide unchosen options after single-select committed
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
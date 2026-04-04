"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useAnswered } from "@/components/ChatBubble";

// ── Only the vibes that are actually used (4 per occasion per gender) ─────────
const OPTION_META: Record<string, { icon: string; desc?: string }> = {
  // Gender
  Female:             { icon: "👗" },
  Male:               { icon: "👔" },

  // Occasions (6)
  College:            { icon: "🎒", desc: "Casual & cool" },
  Work:               { icon: "💼", desc: "Power dressing" },
  Date:               { icon: "💕", desc: "Romantic vibes" },
  Party:              { icon: "🎉", desc: "Night out ready" },
  Wedding:            { icon: "💍", desc: "All dressed up" },
  Festive:            { icon: "✨", desc: "Celebrate it" },

  // Vibes — Female
  "Casual Cool":      { icon: "😎", desc: "Relaxed & stylish" },
  "Street Style":     { icon: "🧢", desc: "Urban cool" },
  Minimal:            { icon: "⬜", desc: "Less is more" },
  Boho:               { icon: "🌸", desc: "Free spirit" },
  "Power Dressing":   { icon: "💪", desc: "Authority & style" },
  "Smart Casual":     { icon: "✔️", desc: "Effortlessly neat" },
  Classic:            { icon: "🖤", desc: "Timeless" },
  Romantic:           { icon: "🌹", desc: "Soft & dreamy" },
  Chic:               { icon: "🤍", desc: "Polished & sleek" },
  Trendy:             { icon: "🔥", desc: "Right now" },
  Glam:               { icon: "💎", desc: "Full glam" },
  Edgy:               { icon: "⚡", desc: "Bold & sharp" },
  Bold:               { icon: "🔴", desc: "Statement look" },
  Traditional:        { icon: "🪔", desc: "Cultural roots" },
  "Ethnic Chic":      { icon: "🧵", desc: "Modern ethnic" },
  Regal:              { icon: "👑", desc: "Royal presence" },

  // Vibes — Male only
  Sporty:             { icon: "🏃", desc: "Athletic edge" },
  "Business Formal":  { icon: "🏢", desc: "Board-room sharp" },
  "Ethnic Smart":     { icon: "🧵", desc: "Sharp ethnic" },
  "Festive Formal":   { icon: "🎊", desc: "Occasion ready" },

  // Platforms
  Myntra:             { icon: "🛍️" },
  Ajio:               { icon: "🏷️" },
  Amazon:             { icon: "📦" },
  Flipkart:           { icon: "🛒" },
  Meesho:             { icon: "💜" },
};

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
}

// ── SelectedBadge ─────────────────────────────────────────────────────────────
function SelectedBadge({ value }: { value: string }) {
  const meta = OPTION_META[value];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{ background: "#1a1a00", borderColor: "#d4af7f40", color: "#d4af7f" }}
    >
      {meta?.icon && <span>{meta.icon}</span>}
      <span>{value}</span>
      <span className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
        <Check className="w-2.5 h-2.5 text-black" />
      </span>
    </motion.div>
  );
}

export function ChipSelector({
  options,
  onSelect,
  multi        = false,
  actionLabel  = "✦ Find My Outfits",
}: ChipSelectorProps) {
  const [selected,  setSelected]  = useState<string[]>([]);
  const [committed, setCommitted] = useState<string | null>(null);

  const answered = useAnswered();
  const showChips = !answered && !committed;

  const isGender   = options.includes("Female") && options.includes("Male");
  const isPlatform = options.includes("Myntra");
  // Occasion grid: exactly 6 items with desc
  const isOccasion = options.length === 6 && options.every((o) => OPTION_META[o]?.desc);
  // Vibe grid: 4 items with desc (not occasion, not gender, not platform)
  const isVibe     = options.length === 4 && !isGender && !isPlatform && !isOccasion;

  const toggle = (opt: string) => {
    if (!multi) {
      if (committed || answered) return;
      setCommitted(opt);
      setTimeout(() => onSelect(opt), 280);
      return;
    }
    setSelected((p) =>
      p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]
    );
  };

  // ── After selection: show badge only ──────────────────────────────────────
  if (!showChips) {
    const displayValue =
      multi && selected.length > 0
        ? selected.join(", ")
        : committed ?? selected.join(", ");
    if (!displayValue) return null;
    return <SelectedBadge value={displayValue} />;
  }

  // ── Gender — two tall cards ───────────────────────────────────────────────
  if (isGender) {
    return (
      <AnimatePresence>
        <motion.div
          key="gender-chips"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
          className="grid grid-cols-2 gap-3 mt-2"
        >
          {options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200"
              style={INACTIVE_STYLE}
            >
              <span className="text-3xl">{OPTION_META[opt]?.icon}</span>
              <span className="text-sm font-bold tracking-wide">{opt}</span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Platform — pill row ───────────────────────────────────────────────────
  if (isPlatform) {
    return (
      <AnimatePresence>
        <motion.div
          key="platform-chips"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
          className="flex flex-wrap gap-2 mt-2"
        >
          {options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200"
              style={INACTIVE_STYLE}
            >
              <span>{OPTION_META[opt]?.icon}</span>
              {opt}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Occasions — 3×2 grid (6 items, icon + name + desc) ───────────────────
  if (isOccasion) {
    return (
      <AnimatePresence>
        <motion.div
          key="occasion-chips"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
          className="grid grid-cols-3 gap-2 mt-2"
        >
          {options.map((opt) => {
            const meta = OPTION_META[opt];
            return (
              <motion.button
                key={opt}
                onClick={() => toggle(opt)}
                whileTap={{ scale: 0.94 }}
                className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-center transition-all duration-200"
                style={INACTIVE_STYLE}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "#1a1a1a" }}
                >
                  {meta?.icon ?? "✦"}
                </span>
                <p className="text-xs font-bold text-white leading-tight">{opt}</p>
                {meta?.desc && (
                  <p className="text-[10px] text-neutral-500 leading-tight">{meta.desc}</p>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Vibes — 2×2 grid (4 items, icon + name + desc) ───────────────────────
  if (isVibe) {
    return (
      <AnimatePresence>
        <motion.div
          key="vibe-chips"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
          className="grid grid-cols-2 gap-2 mt-2"
        >
          {options.map((opt) => {
            const meta = OPTION_META[opt];
            return (
              <motion.button
                key={opt}
                onClick={() => toggle(opt)}
                whileTap={{ scale: 0.94 }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200"
                style={INACTIVE_STYLE}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "#1a1a1a" }}
                >
                  {meta?.icon ?? "✦"}
                </span>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{opt}</p>
                  {meta?.desc && (
                    <p className="text-[10px] mt-0.5 text-neutral-500">{meta.desc}</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Multi-select pills ────────────────────────────────────────────────────
  if (multi) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mt-2"
      >
        {options.map((opt) => {
          const isChosen = selected.includes(opt);
          return (
            <motion.button
              key={opt}
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200"
              style={isChosen ? ACTIVE_STYLE : INACTIVE_STYLE}
            >
              {OPTION_META[opt]?.icon && <span>{OPTION_META[opt]?.icon}</span>}
              {opt}
              {isChosen && <Check className="w-3 h-3" />}
            </motion.button>
          );
        })}
        {selected.length > 0 && (
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

  // ── Fallback single-select pills ──────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        key="pill-chips"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
        className="flex flex-wrap gap-2 mt-2"
      >
        {options.map((opt) => (
          <motion.button
            key={opt}
            onClick={() => toggle(opt)}
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200"
            style={INACTIVE_STYLE}
          >
            {OPTION_META[opt]?.icon && <span>{OPTION_META[opt]?.icon}</span>}
            {opt}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
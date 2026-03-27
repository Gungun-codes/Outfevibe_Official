"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useAnswered } from "@/components/ChatBubble";

const OPTION_META: Record<string, { icon: string; desc?: string }> = {
  Female:             { icon: "👗" },
  Male:               { icon: "👔" },
  College:            { icon: "🎒", desc: "Casual & cool" },
  Party:              { icon: "🎉", desc: "Night out ready" },
  Date:               { icon: "💕", desc: "Romantic vibes" },
  Festive:            { icon: "✨", desc: "Celebrate it" },
  Wedding:            { icon: "💍", desc: "All dressed up" },
  Work:               { icon: "💼", desc: "Power dressing" },
  Classic:            { icon: "🖤", desc: "Timeless" },
  Boho:               { icon: "🌸", desc: "Free spirit" },
  Trendy:             { icon: "🔥", desc: "Right now" },
  Minimal:            { icon: "⬜", desc: "Less is more" },
  Edgy:               { icon: "⚡", desc: "Bold & sharp" },
  Romantic:           { icon: "🌹", desc: "Soft & dreamy" },
  "Street Style":     { icon: "🧢", desc: "Urban cool" },
  "Smart Casual":     { icon: "✔️", desc: "Effortlessly neat" },
  "Casual Cool":      { icon: "😎", desc: "Relaxed & stylish" },
  Preppy:             { icon: "🎓", desc: "Put-together" },
  Sporty:             { icon: "🏃", desc: "Athletic edge" },
  Glam:               { icon: "💎", desc: "Full glam" },
  Bold:               { icon: "🔴", desc: "Statement look" },
  Chic:               { icon: "🤍", desc: "Polished & sleek" },
  "Soft Glam":        { icon: "🌸", desc: "Delicate glow" },
  Traditional:        { icon: "🪔", desc: "Cultural roots" },
  "Ethnic Chic":      { icon: "🧵", desc: "Modern ethnic" },
  "Ethnic Smart":     { icon: "🧵", desc: "Sharp ethnic" },
  Regal:              { icon: "👑", desc: "Royal presence" },
  "Festive Formal":   { icon: "🎊", desc: "Occasion ready" },
  "Power Dressing":   { icon: "💪", desc: "Authority & style" },
  "Business Formal":  { icon: "🏢", desc: "Board-room sharp" },
  "Corporate Chic":   { icon: "📋", desc: "Office elegance" },
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

// ── SelectedBadge — shown after a single-select answer ───────────────────────
function SelectedBadge({ value }: { value: string }) {
  const meta = OPTION_META[value];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{
        background:   "#1a1a00",
        borderColor:  "#d4af7f40",
        color:        "#d4af7f",
      }}
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

  // Read whether the parent ChatBubble has been answered
  const answered = useAnswered();

  // If parent marks this whole bubble as answered and we have a committed value,
  // show only the selected badge — chips are gone.
  const showChips = !answered && !committed;

  const hasMeta    = options.some((o) => OPTION_META[o]);
  const hasDesc    = options.some((o) => OPTION_META[o]?.desc);
  const isGender   = options.includes("Female") && options.includes("Male");
  const isPlatform = options.includes("Myntra");

  const toggle = (opt: string) => {
    if (!multi) {
      if (committed || answered) return;  // already chosen
      setCommitted(opt);
      setTimeout(() => onSelect(opt), 280);
      return;
    }
    setSelected((p) =>
      p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]
    );
  };

  // The value to show in the badge after selection
  const chosenValue = committed;

  // ── After selection: just show the badge ────────────────────────────────────
  if (!showChips) {
    // For multi-select show all selected; for single show committed
    const displayValue =
      multi && selected.length > 0
        ? selected.join(", ")
        : chosenValue ?? selected.join(", ");

    if (!displayValue) return null;
    return <SelectedBadge value={displayValue} />;
  }

  // ── Gender — two big cards ─────────────────────────────────────────────────
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
              className="relative flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 overflow-hidden"
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

  // ── Platform — single select pill chips ───────────────────────────────────
  if (isPlatform) {
    return (
      <AnimatePresence>
        <motion.div
          key="platform-chips"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
          className="mt-2"
        >
          <div className="flex flex-wrap gap-2">
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
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Occasions & Vibes — card grid ─────────────────────────────────────────
  if (hasDesc) {
    return (
      <AnimatePresence>
        <motion.div
          key="desc-chips"
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
                className="relative flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200"
                style={INACTIVE_STYLE}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "#1a1a1a" }}
                >
                  {meta?.icon ?? "✦"}
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight text-white">{opt}</p>
                  {meta?.desc && (
                    <p className="text-xs mt-0.5 text-neutral-500">{meta.desc}</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Fallback pill chips ────────────────────────────────────────────────────
  if (!multi) {
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
              {hasMeta && <span>{OPTION_META[opt]?.icon}</span>}
              {opt}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Multi-select pill chips ────────────────────────────────────────────────
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
            {hasMeta && <span>{OPTION_META[opt]?.icon}</span>}
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
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const OCCASION_RANGES: Record<string, { min: number; max: number }> = {
  College:  { min: 500,  max: 4000  },
  Work:     { min: 800,  max: 5000  },
  Date:     { min: 500,  max: 5000  },
  Party:    { min: 1000, max: 6000  },
  Wedding:  { min: 2000, max: 10000 },
  Festive:  { min: 1000, max: 8000  },
};

const DEFAULT_RANGE = { min: 500, max: 8000 };

function formatPrice(val: number) {
  if (val >= 1000) return `₹${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
  return `₹${val}`;
}

interface BudgetSliderProps {
  occasion: string;
  onConfirm: (range: { min: number; max: number; label: string }) => void;
}

export function BudgetSlider({ occasion, onConfirm }: BudgetSliderProps) {
  const range = OCCASION_RANGES[occasion] ?? DEFAULT_RANGE;
  const [value, setValue] = useState(Math.round((range.min + range.max) / 2));
  const [confirmed, setConfirmed] = useState(false);

  const pct = ((value - range.min) / (range.max - range.min)) * 100;

  const getBudgetLabel = (v: number): string => {
    const third = (range.max - range.min) / 3;
    if (v <= range.min + third) return "low";
    if (v <= range.min + third * 2) return "medium";
    return "high";
  };

  const getTierLabel = (v: number) => {
    const label = getBudgetLabel(v);
    if (label === "low")    return { text: "Budget Friendly 💚", color: "#4ade80" };
    if (label === "medium") return { text: "Mid Range ✨",        color: "#d4af7f" };
    return                         { text: "Premium 💎",          color: "#a78bfa" };
  };

  const tier = getTierLabel(value);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
        style={{ background: "#1a1a00", borderColor: "#d4af7f40", color: "#d4af7f" }}
      >
        <span>💰</span>
        <span>Up to {formatPrice(value)}</span>
        <span className="w-4 h-4 rounded-full flex items-center justify-center text-black text-[10px]"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>✓</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 space-y-4"
    >
      {/* Tier label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: tier.color }}>
          {tier.text}
        </span>
        <span className="text-sm font-bold text-white">
          {formatPrice(range.min)} – {formatPrice(value)}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-2 rounded-full" style={{ background: "#1a1a1a" }}>
        {/* Filled portion */}
        <div
          className="absolute left-0 top-0 h-2 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#d4af7f,#b8860b)",
          }}
        />
        {/* Thumb */}
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 shadow-lg transition-all"
          style={{
            left: `calc(${pct}% - 10px)`,
            background: "linear-gradient(135deg,#d4af7f,#b8860b)",
            borderColor: "#0a0a0a",
            boxShadow: "0 0 12px rgba(212,175,127,0.5)",
          }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-[10px] text-neutral-600">
        <span>{formatPrice(range.min)}</span>
        <span>{formatPrice(range.max)}</span>
      </div>

      {/* Confirm button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setConfirmed(true);
          onConfirm({ min: range.min, max: value, label: getBudgetLabel(value) });
        }}
        className="w-full py-2.5 rounded-full text-sm font-bold text-black transition-all"
        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
      >
        Find Outfits in this Budget ✨
      </motion.button>
    </motion.div>
  );
}
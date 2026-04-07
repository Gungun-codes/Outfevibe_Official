"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

// ── Budget tiers per occasion ─────────────────────────────────────────────────
// jsonKey MUST match outfit.json's budget_range field exactly: "low" | "medium" | "high"
const OCCASION_TIERS: Record<string, { label: string; jsonKey: string; min: number; max: number; description: string }[]> = {
  College: [
    { label: "Budget",    jsonKey: "low",    min: 300,   max: 1500,  description: "Thrift-smart & trendy"   },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 4000,  description: "Stylish without stress"  },
    { label: "Premium",   jsonKey: "high",   min: 4000,  max: 6000,  description: "Investment pieces"       },
  ],
  Work: [
    { label: "Budget",    jsonKey: "low",    min: 500,   max: 1500,  description: "Polished on a budget"    },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 4000,  description: "Professional & sharp"    },
    { label: "Premium",   jsonKey: "high",   min: 4000,  max: 10000, description: "Power dressing"          },
  ],
  Date: [
    { label: "Budget",    jsonKey: "low",    min: 300,   max: 1500,  description: "Effortlessly charming"   },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 4000,  description: "Impressive & stylish"    },
    { label: "Premium",   jsonKey: "high",   min: 4000,  max: 12000, description: "Unforgettable look"      },
  ],
  Party: [
    { label: "Budget",    jsonKey: "low",    min: 300,   max: 1500,  description: "Fun & fierce"            },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 5000,  description: "Turn heads"              },
    { label: "Premium",   jsonKey: "high",   min: 5000,  max: 15000, description: "Full glam mode"          },
  ],
  Wedding: [
    { label: "Budget",    jsonKey: "low",    min: 500,   max: 1500,  description: "Celebration-ready"       },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 5000,  description: "Graceful & festive"      },
    { label: "Premium",   jsonKey: "high",   min: 5000,  max: 30000, description: "Showstopper"             },
  ],
  Festive: [
    { label: "Budget",    jsonKey: "low",    min: 300,   max: 1500,  description: "Ethnic & vibrant"        },
    { label: "Mid Range", jsonKey: "medium", min: 1500,  max: 4000,  description: "Rich & traditional"      },
    { label: "Premium",   jsonKey: "high",   min: 4000,  max: 20000, description: "Grand & regal"           },
  ],
};

const DEFAULT_TIERS = OCCASION_TIERS["College"];

interface BudgetResult {
  label: string;   // display: "Budget" | "Mid Range" | "Premium"
  jsonKey: string; // JSON value: "low" | "medium" | "high"
  min: number;
  max: number;
}

interface BudgetSliderProps {
  occasion?: string;
  onConfirm: (result: BudgetResult) => void;
}

export function BudgetSlider({ occasion = "College", onConfirm }: BudgetSliderProps) {
  const tiers = OCCASION_TIERS[occasion] ?? DEFAULT_TIERS;
  const [selectedTier, setSelectedTier] = useState(1); // default Mid Range
  const [confirmed,    setConfirmed]    = useState(false);

  const tier = tiers[selectedTier];

  const fmt = (n: number) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `₹${n}`;

  const handleConfirm = useCallback(() => {
    if (confirmed) return;
    setConfirmed(true);
    onConfirm({ label: tier.label, jsonKey: tier.jsonKey, min: tier.min, max: tier.max });
  }, [confirmed, tier, onConfirm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Tier selector */}
      <div className="grid grid-cols-3 gap-2">
        {tiers.map((t, i) => {
          const active = selectedTier === i;
          return (
            <motion.button
              key={t.label}
              onClick={() => !confirmed && setSelectedTier(i)}
              disabled={confirmed}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-200 text-center"
              style={{
                background:   active ? "linear-gradient(135deg,#d4af7f18,#b8860b08)" : "#111111",
                borderColor:  active ? "#d4af7f" : "#2a2a2a",
              }}
            >
              <span className="text-xs font-bold mb-0.5"
                style={{ color: active ? "#d4af7f" : "#888" }}>
                {t.label}
              </span>
              <span className="text-[10px] leading-tight"
                style={{ color: active ? "#b8860b" : "#555" }}>
                {fmt(t.min)}–{fmt(t.max)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Description + range display */}
      <motion.div
        key={selectedTier}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-neutral-800 bg-[#0f0f0f]"
      >
        <p className="text-xs text-neutral-400">{tier.description}</p>
        <p className="text-xs font-bold" style={{ color: "#d4af7f" }}>
          {fmt(tier.min)} – {fmt(tier.max)}
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={handleConfirm}
        disabled={confirmed}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-full text-sm font-bold text-black relative overflow-hidden transition-opacity disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
      >
        <span className="relative z-10">
          Find Outfits in this Budget ✦
        </span>
        <motion.span
          className="absolute inset-y-0 w-1/3 skew-x-[-15deg] pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)" }}
          animate={{ left: ["-40%", "130%"] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "linear" }}
        />
      </motion.button>
    </motion.div>
  );
}
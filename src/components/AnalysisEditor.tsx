"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BODY_SHAPES, SKIN_TONES } from "@/lib/type";
import { Check, RefreshCw } from "lucide-react";

const TONE_COLORS: Record<string, { bg: string; text: string }> = {
  Fair:   { bg: "#FFE8D6", text: "#8B5E3C" },
  Light:  { bg: "#F5CCAA", text: "#7A4A2A" },
  Medium: { bg: "#D4956A", text: "#fff"    },
  Tan:    { bg: "#C47B3A", text: "#fff"    },
  Deep:   { bg: "#8B4A2B", text: "#fff"    },
  Dark:   { bg: "#4A2412", text: "#fff"    },
};

const SHAPE_ICONS: Record<string, string> = {
  Hourglass:           "⧖",
  Pear:                "🍐",
  Apple:               "🍎",
  Rectangle:           "▭",
  "Inverted Triangle": "▽",
};

interface Props {
  bodyShape: string;
  skinTone: string;
  onConfirm: (shape: string, tone: string) => void;
}

export function AnalysisEditor({ bodyShape, skinTone, onConfirm }: Props) {
  const [shape, setShape]       = useState(bodyShape);
  const [tone,  setTone]        = useState(skinTone);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => onConfirm(shape, tone), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#111111] shadow-xl mt-2"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-neutral-800"
        style={{ background: "linear-gradient(135deg,#1a1a0a,#111111)" }}>
        <span className="text-lg">🧬</span>
        <div>
          <p className="text-xs font-bold text-[#d4af7f] uppercase tracking-wider">Analysis Complete</p>
          <p className="text-xs text-neutral-500">Correct if anything looks off</p>
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* ── Body Shape — chips only, no dropdown ── */}
        <div>
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Body Shape
          </label>
          <div className="flex flex-wrap gap-2">
            {BODY_SHAPES.map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                disabled={confirmed}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                style={shape === s
                  ? { background: "linear-gradient(135deg,#d4af7f,#b8860b)", borderColor: "transparent", color: "#000" }
                  : { background: "#1a1a1a", borderColor: "#2a2a2a", color: "#d4af7f" }
                }
              >
                <span>{SHAPE_ICONS[s]}</span>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Skin Tone — swatches only, no dropdown ── */}
        <div>
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Skin Tone
          </label>
          <div className="grid grid-cols-6 gap-2 mb-1">
            {SKIN_TONES.map((t) => (
              <button
                key={t}
                title={t}
                onClick={() => setTone(t)}
                disabled={confirmed}
                className={`relative aspect-square rounded-xl border-2 transition-all duration-200 ${
                  tone === t ? "border-[#d4af7f] scale-110 shadow-lg shadow-[#d4af7f]/20" : "border-transparent hover:scale-105"
                }`}
                style={{ background: TONE_COLORS[t]?.bg }}
              >
                {tone === t && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-3 h-3" style={{ color: TONE_COLORS[t]?.text }} />
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Tone labels */}
          <div className="grid grid-cols-6 gap-2">
            {SKIN_TONES.map((t) => (
              <p key={t} className={`text-center text-[10px] font-medium truncate ${tone === t ? "text-[#d4af7f]" : "text-neutral-600"}`}>
                {t}
              </p>
            ))}
          </div>
        </div>

        {/* ── Summary badge ── */}
        <motion.div
          key={shape + tone}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl p-3 border border-neutral-800 bg-[#1a1a1a]"
        >
          <span
            className="w-9 h-9 rounded-full flex-shrink-0 border-2 border-neutral-700 shadow-sm"
            style={{ background: TONE_COLORS[tone]?.bg }}
          />
          <div>
            <p className="text-xs text-neutral-500 font-medium">Your detected profile</p>
            <p className="text-sm font-bold text-white">{shape} · {tone} skin</p>
          </div>
          <RefreshCw className="w-4 h-4 text-neutral-700 ml-auto flex-shrink-0" />
        </motion.div>

        {/* ── Confirm ── */}
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleConfirm}
              className="w-full text-black rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
            >
              <Check className="w-4 h-4" /> Looks good — Let&apos;s style me!
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 text-[#d4af7f] text-sm font-bold"
            >
              <Check className="w-4 h-4" /> Profile saved ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
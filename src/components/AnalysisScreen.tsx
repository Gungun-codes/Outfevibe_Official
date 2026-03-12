"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Scanning facial features…",     icon: "👁️",  pct: 15 },
  { label: "Detecting body proportions…",   icon: "📐",  pct: 32 },
  { label: "Mapping skin undertones…",      icon: "🎨",  pct: 52 },
  { label: "Analysing silhouette shape…",   icon: "✨",  pct: 70 },
  { label: "Cross-referencing style data…", icon: "🔍",  pct: 85 },
  { label: "Finalising your profile…",      icon: "💫",  pct: 97 },
];

interface Props {
  imageUrl: string;
  onDone: () => void;
  durationMs?: number;
}

export function AnalysisScreen({ imageUrl, onDone, durationMs = 5000 }: Props) {
  const [stepIdx, setStepIdx]   = useState(0);
  const [progress, setProgress] = useState(0);

  // Progress bar
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(id); setTimeout(onDone, 300); }
    }, 50);
    return () => clearInterval(id);
  }, [durationMs, onDone]);

  // Step cycling
  useEffect(() => {
    const stepTime = durationMs / STEPS.length;
    const id = setInterval(() => {
      setStepIdx((p) => Math.min(p + 1, STEPS.length - 1));
    }, stepTime);
    return () => clearInterval(id);
  }, [durationMs]);

  const current = STEPS[stepIdx];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      className="rounded-2xl overflow-hidden border border-purple-100 shadow-lg bg-white"
    >
      {/* Image with scan overlay */}
      <div className="relative w-full h-52 overflow-hidden bg-purple-50">
        <img src={imageUrl} alt="analysing" className="w-full h-full object-cover" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_12px_3px_rgba(233,30,140,0.6)]"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />

        {/* Corner brackets */}
        {["top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 border-pink-400 ${cls} rounded-sm`} />
        ))}

        {/* AI badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse inline-block" />
          AI VISION ACTIVE
        </div>
      </div>

      {/* Steps & progress */}
      <div className="p-4">
        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="text-lg">{current.icon}</span>
            <span className="text-sm font-medium text-gray-700">{current.label}</span>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e91e8c, #9c27b0)",
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-right text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIdx ? "bg-pink-500 w-4" : "bg-gray-200 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
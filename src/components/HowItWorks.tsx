"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepData {
  icon: string;
  label: string;
  title: string;
  desc: string;
  tags: { text: string; color: string }[];
  visual?: React.ReactNode;
}

const TAG_STYLES: Record<string, string> = {
  purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  amber:  "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  green:  "bg-green-500/10 text-green-400 border border-green-500/20",
  teal:   "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  pink:   "bg-pink-500/10 text-pink-400 border border-pink-500/20",
};

// ── Quiz Steps ────────────────────────────────────────────────────────────────
const QUIZ_STEPS: StepData[] = [
  {
    icon: "👤", label: "Choose gender",
    title: "Who are we styling?",
    desc: "Pick 'Style for Her' or 'Style for Him' to begin your personalised quiz journey.",
    tags: [{ text: "Free", color: "purple" }, { text: "No signup needed", color: "green" }],
  },
  {
    icon: "❓", label: "6 style questions",
    title: "6 style questions",
    desc: "Answer questions about your everyday look, accessories, footwear, and colour palette. Each answer scores your persona.",
    tags: [{ text: "Visual options", color: "purple" }, { text: "~2 minutes", color: "teal" }],
  },
  {
    icon: "🧬", label: "AI scores persona",
    title: "AI scores your persona",
    desc: "Outfevibe's scoring engine maps your answers across 5 persona dimensions — Minimalist, Edgy, Romantic, Playful, or Comfort.",
    tags: [{ text: "AI-powered", color: "purple" }, { text: "India-built", color: "amber" }],
  },
  {
    icon: "✨", label: "Persona revealed",
    title: "Your persona is revealed",
    desc: "See your style persona, icon, tagline, and a full breakdown of how you scored across all dimensions with outfit previews.",
    tags: [{ text: "Shareable result", color: "purple" }, { text: "Visual breakdown", color: "amber" }],
  },
  {
    icon: "👗", label: "Outfit feed",
    title: "Outfit feed unlocked",
    desc: "Your persona filters the entire outfit catalogue — every recommendation now matches your exact style identity and gender.",
    tags: [{ text: "Persona-matched", color: "purple" }, { text: "Curated for you", color: "green" }],
  },
  {
    icon: "💾", label: "Saved to profile",
    title: "Saved to your profile",
    desc: "Your persona is stored against your account. Your Style DNA, and outfit feed stay personalised — and update every time you retake.",
    tags: [{ text: "Auto-saved", color: "green" }, { text: "Updates on retake", color: "teal" }],
  },
];

// ── AI Outfit Steps (new enhanced flow) ───────────────────────────────────────
const OUTFIT_STEPS: StepData[] = [
  {
    icon: "👤", label: "Her or Him",
    title: "Who are we styling?",
    desc: "Select Her or Him — Outfevibe loads a gender-matched outfit catalogue of 50+ curated Indian looks instantly.",
    tags: [{ text: "Instant", color: "amber" }, { text: "No upload needed", color: "green" }],
  },
  {
    icon: "📸", label: "Upload photo",
    title: "Upload your photo",
    desc: "Upload a clear full-body photo. Our AI scans your proportions, shoulder-to-hip ratio, and skin tone from the image in seconds.",
    tags: [{ text: "Privacy-safe", color: "green" }, { text: "Browser-side AI", color: "amber" }],
  },
  {
    icon: "🧬", label: "Body & skin analysis",
    title: "AI detects body shape & skin tone",
    desc: "MediaPipe Vision analyses your pose landmarks to classify your body shape — hourglass, pear, apple, rectangle, or inverted triangle. Skin tone is sampled from your face region across all 6 Fitzpatrick types.",
    tags: [{ text: "5 body shapes", color: "amber" }, { text: "6 skin tones", color: "pink" }],
  },
  {
    icon: "🎨", label: "Color & style tips",
    title: "Personalised colour & dressing tips",
    desc: "Based on your body shape and skin tone, you get a curated colour palette, fabric suggestions, and silhouette tips — what to wear and what to avoid, specific to you.",
    tags: [{ text: "Colour palette", color: "teal" }, { text: "Silhouette guide", color: "purple" }],
  },
  {
    icon: "🎯", label: "Occasion, mood & budget",
    title: "Tell us the occasion, vibe & budget",
    desc: "College, Party, Date, Wedding, Navratri, Eid — India-specific occasions. Pair with your mood (Chill, Classic, Bold, Traditional) and budget (Low / Medium / High) for a precision match.",
    tags: [{ text: "India-first occasions", color: "amber" }, { text: "Budget-aware", color: "green" }],
  },
  {
    icon: "👗", label: "Outfit preview",
    title: "Outfit preview — click for breakdown",
    desc: "Your top-ranked outfits appear as image cards. Click any outfit to see the full breakdown — top, bottom, shoes, accessories — each with a shop link to Myntra, Amazon India, Meesho, Ajio or Flipkart.",
    tags: [{ text: "4-piece breakdown", color: "amber" }, { text: "Shop Indian links", color: "green" }],
  },
];

// ── Animated visuals per outfit step ─────────────────────────────────────────
function OutfitStepVisual({ step, darkMode }: { step: number; darkMode: boolean }) {
  const bg = darkMode ? "#1a1a1a" : "#f5f5f5";
  const card = darkMode ? "#222" : "#fff";
  const border = darkMode ? "#333" : "#e5e5e5";
  const text = darkMode ? "#fff" : "#111";
  const muted = darkMode ? "#666" : "#aaa";

  if (step === 0) return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "16px 0" }}>
      {["Her ✦", "Him ✦"].map((label, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          style={{
            padding: "14px 28px", borderRadius: 14,
            background: i === 0 ? "linear-gradient(135deg,#ff69b4,#d4af7f)" : "linear-gradient(135deg,#4169e1,#d4af7f)",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>{label}</motion.div>
      ))}
    </div>
  );

  if (step === 1) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <motion.div
        animate={{ boxShadow: ["0 0 0 0 rgba(212,175,127,0)", "0 0 0 12px rgba(212,175,127,0.15)", "0 0 0 0 rgba(212,175,127,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: 90, height: 90, borderRadius: "50%",
          border: "2px dashed #d4af7f",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: bg, fontSize: 32,
        }}>📸</motion.div>
    </div>
  );

  if (step === 2) return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", padding: "8px 0" }}>
      {["Hourglass ⧖", "Pear 🍐", "Apple 🍎", "Rectangle ▭", "Inv. Triangle ▽"].map((shape, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{
            padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: i === 0 ? "rgba(212,175,127,0.2)" : bg,
            border: `1px solid ${i === 0 ? "#d4af7f" : border}`,
            color: i === 0 ? "#d4af7f" : muted,
          }}>{shape}</motion.div>
      ))}
    </div>
  );

  if (step === 3) {
    const colours = ["#FFD700", "#FF6B6B", "#87CEEB", "#98D8C8", "#B57BCA", "#FF8C00"];
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "12px 0" }}>
        {colours.map((hex, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: hex, border: `2px solid ${border}` }} />
        ))}
      </div>
    );
  }

  if (step === 4) return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", padding: "8px 0" }}>
      {[["Navratri 🪔", "amber"], ["College 🎒", "teal"], ["Wedding 💍", "pink"], ["Date 🌹", "purple"], ["Party 🎉", "green"]].map(([label, color], i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08 }}
          style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: i === 0 ? "rgba(212,175,127,0.2)" : bg,
            border: `1px solid ${i === 0 ? "#d4af7f" : border}`,
            color: i === 0 ? "#d4af7f" : muted,
          }}>{label}</motion.div>
      ))}
    </div>
  );

  if (step === 5) return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "8px 0" }}>
      {[
        { label: "Top", emoji: "👚", color: "#d4af7f" },
        { label: "Bottom", emoji: "👖", color: "#87ceeb" },
        { label: "Shoes", emoji: "👟", color: "#98d8c8" },
        { label: "Accessories", emoji: "💍", color: "#b57bca" },
      ].map((item, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "10px 12px", borderRadius: 12,
            background: card, border: `1px solid ${border}`,
            minWidth: 60,
          }}>
          <span style={{ fontSize: 22 }}>{item.emoji}</span>
          <span style={{ fontSize: 9, color: item.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</span>
          <div style={{ width: "100%", height: 2, borderRadius: 1, background: item.color, opacity: 0.4 }} />
          <span style={{ fontSize: 8, color: muted }}>Shop →</span>
        </motion.div>
      ))}
    </div>
  );

  return null;
}

interface HowItWorksProps {
  darkMode: boolean;
}

export default function HowItWorks({ darkMode }: HowItWorksProps) {
  const [activeFlow, setActiveFlow] = useState<"quiz" | "outfit">("quiz");
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef<number | null>(null);
  const INTERVAL = 3200; // slower — was 1800

  const steps = activeFlow === "quiz" ? QUIZ_STEPS : OUTFIT_STEPS;
  const maxStep = steps.length - 1;

  const startLoop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveStep((prev) => (prev >= maxStep ? 0 : prev + 1));
      }
    }, INTERVAL);
  }, [isPaused, maxStep]);

  useEffect(() => {
    startLoop();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startLoop, activeFlow]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, maxStep));
    setActiveStep(clamped);
    startLoop();
  };

  const switchFlow = (flow: "quiz" | "outfit") => {
    setActiveFlow(flow);
    setActiveStep(0);
  };

  // Drag/swipe handlers
  const onDragStart = (x: number) => { dragStartX.current = x; setIsPaused(true); };
  const onDragEnd = (x: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? activeStep + 1 : activeStep - 1);
    dragStartX.current = null;
    setTimeout(() => setIsPaused(false), 1500);
  };

  const progress = Math.round((activeStep / maxStep) * 100);
  const accentColor = activeFlow === "quiz" ? "#a855f7" : "#d4af7f";

  return (
    <section
      id="howitworks"
      className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            How It <span className="text-yellow-400">Works</span>
          </h2>
          <p className={`text-lg ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Two ways to find your perfect outfit — pick your flow.
          </p>
        </motion.div>

        {/* Flow tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {(["quiz", "outfit"] as const).map((flow) => (
            <button key={flow} onClick={() => switchFlow(flow)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition border ${
                activeFlow === flow
                  ? flow === "quiz"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                    : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                  : darkMode
                  ? "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}>
              {flow === "quiz" ? "Style quiz" : "AI outfit stylist"}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className={`h-0.5 rounded-full mb-8 overflow-hidden ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Step bubbles — draggable/swipeable */}
        <div
          className="flex items-center justify-between mb-8 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
        >
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <button onClick={() => goTo(i)} className="flex flex-col items-center gap-2 group">
                <motion.div
                  animate={{
                    scale: i === activeStep ? 1.12 : 1,
                    borderColor: i === activeStep ? accentColor : i < activeStep ? "#22c55e" : darkMode ? "#333" : "#e5e5e5",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-300 ${
                    i < activeStep
                      ? "bg-green-500/10"
                      : i === activeStep
                      ? activeFlow === "quiz" ? "bg-purple-500/15" : "bg-yellow-400/15"
                      : darkMode ? "bg-neutral-900" : "bg-neutral-100"
                  }`}
                  style={{ borderColor: i === activeStep ? accentColor : i < activeStep ? "#22c55e" : darkMode ? "#333" : "#e5e5e5" }}
                >
                  {i < activeStep ? "✓" : step.icon}
                </motion.div>
                <span className={`text-[10px] text-center max-w-[60px] leading-tight transition-colors ${
                  i === activeStep ? (darkMode ? "text-white font-medium" : "text-black font-medium") : "text-neutral-500"
                }`}>{step.label}</span>
              </button>

              {i < steps.length - 1 && (
                <motion.div
                  animate={{ backgroundColor: i < activeStep ? accentColor : darkMode ? "#333" : "#e5e5e5" }}
                  transition={{ duration: 0.4 }}
                  className="w-6 h-0.5 mx-1 flex-shrink-0 rounded"
                />
              )}
            </div>
          ))}
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFlow}-${activeStep}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border p-6 ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  activeFlow === "quiz"
                    ? "bg-purple-500/10 border-purple-500/20"
                    : "bg-yellow-400/10 border-yellow-400/20"
                }`}
              >
                {steps[activeStep].icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono" style={{ color: accentColor }}>
                  Step {activeStep + 1} / {steps.length}
                </span>
                <h3 className={`text-lg font-bold mb-2 mt-0.5 ${darkMode ? "text-white" : "text-black"}`}>
                  {steps[activeStep].title}
                </h3>
                <p className={`text-sm leading-relaxed mb-3 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                  {steps[activeStep].desc}
                </p>

                {/* Animated visual for outfit flow */}
                {activeFlow === "outfit" && (
                  <div className={`rounded-xl border p-3 mb-3 ${darkMode ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"}`}>
                    <OutfitStepVisual step={activeStep} darkMode={darkMode} />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {steps[activeStep].tags.map((tag, i) => (
                    <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${TAG_STYLES[tag.color]}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots + prev/next + pause + CTA */}
        <div className="flex items-center justify-between mt-5 flex-wrap gap-3">

          {/* Prev / dots / next */}
          <div className="flex items-center gap-3">
            <button onClick={() => goTo(activeStep - 1)} disabled={activeStep === 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition
                ${darkMode ? "border-neutral-700 text-neutral-400 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-20" : "border-neutral-300 text-neutral-500 hover:border-yellow-500 disabled:opacity-20"}`}>
              ‹
            </button>

            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeStep ? 20 : 7,
                    height: 7,
                    background: i === activeStep ? accentColor : darkMode ? "#333" : "#ddd",
                  }}
                />
              ))}
            </div>

            <button onClick={() => goTo(activeStep + 1)} disabled={activeStep === maxStep}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition
                ${darkMode ? "border-neutral-700 text-neutral-400 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-20" : "border-neutral-300 text-neutral-500 hover:border-yellow-500 disabled:opacity-20"}`}>
              ›
            </button>

            {/* Pause / play */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition
                ${darkMode ? "border-neutral-700 text-neutral-400 hover:border-yellow-400 hover:text-yellow-400" : "border-neutral-300 text-neutral-500"}`}
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? "▶" : "⏸"}
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <a href="/quiz"
              className="text-sm px-5 py-2 rounded-full border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition">
              Take quiz →
            </a>
            <a href="/outfit"
              className="text-sm px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
              Try stylist →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
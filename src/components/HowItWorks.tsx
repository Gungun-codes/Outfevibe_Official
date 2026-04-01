"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepData {
  icon: string;
  label: string;
  title: string;
  desc: string;
  tags: { text: string; color: string }[];
}

const QUIZ_STEPS: StepData[] = [
  {
    icon: "👤", label: "Choose gender",
    title: "Choose your style",
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
    icon: "👗", label: "Outfit feed unlocked",
    title: "Outfit feed unlocked",
    desc: "Your persona filters the entire outfit catalogue — every recommendation now matches your exact style identity and gender.",
    tags: [{ text: "Persona-matched", color: "purple" }, { text: "Curated for you", color: "green" }],
  },
  {
    icon: "💾", label: "Saved to profile",
    title: "Saved to your profile",
    desc: "Your persona is stored against your account. Your profile, Style DNA, and outfit feed stay personalised — and update every time you retake.",
    tags: [{ text: "Auto-saved", color: "green" }, { text: "Updates on retake", color: "teal" }],
  },
];

const OUTFIT_STEPS: StepData[] = [
  {
    icon: "👤", label: "Her or Him",
    title: "Who are we styling?",
    desc: "Select Her or Him — Outfevibe loads a gender-matched outfit catalogue of 50+ curated Indian looks instantly.",
    tags: [{ text: "Instant", color: "amber" }, { text: "No upload needed", color: "green" }],
  },
  {
    icon: "📍", label: "Pick occasion",
    title: "Pick your occasion",
    desc: "College, Party, Date, Wedding, or Eid — India-specific occasions that most global fashion apps don't understand.",
    tags: [{ text: "India-first", color: "amber" }, { text: "5 occasions", color: "teal" }],
  },
  {
    icon: "🎭", label: "Choose vibe",
    title: "Choose your vibe",
    desc: "Chill, Classic, Bold, or Traditional — your mood on the day shapes the recommendation, not just the event.",
    tags: [{ text: "4 vibes", color: "amber" }, { text: "Mood-aware", color: "purple" }],
  },
  {
    icon: "💰", label: "Set budget",
    title: "Set your budget",
    desc: "Low, Medium, or High — budget is a first-class filter in Outfevibe. We never suggest what you can't afford.",
    tags: [{ text: "Budget-aware", color: "amber" }, { text: "Practical", color: "green" }],
  },
  {
    icon: "🤖", label: "AI ranks fits",
    title: "AI ranks the best fits",
    desc: "Outfevibe scores every outfit by occasion (+3pts), vibe (+2pts), and budget (+1pt) — your top 2 ranked fits surface automatically.",
    tags: [{ text: "Scored ranking", color: "amber" }, { text: "Best 2 shown", color: "purple" }],
  },
  {
    icon: "🛍️", label: "Shop Indian links",
    title: "Shop from Indian platforms",
    desc: "Every result links to Meesho, Ajio, Myntra, Flipkart, or Amazon India — platforms that actually deliver to you.",
    tags: [{ text: "Meesho · Ajio · Myntra", color: "green" }, { text: "Flipkart · Amazon IN", color: "teal" }],
  },
];

const TAG_STYLES: Record<string, string> = {
  purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  amber: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  green: "bg-green-500/10 text-green-400 border border-green-500/20",
  teal: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
};

interface HowItWorksProps {
  darkMode: boolean;
}

export default function HowItWorks({ darkMode }: HowItWorksProps) {
  const [activeFlow, setActiveFlow] = useState<"quiz" | "outfit">("quiz");
  const [activeStep, setActiveStep] = useState(0);
  const [speed, setSpeed] = useState(1800);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = activeFlow === "quiz" ? QUIZ_STEPS : OUTFIT_STEPS;

  const startLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, speed);
  };

  useEffect(() => {
    startLoop();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeFlow, speed]);

  const switchFlow = (flow: "quiz" | "outfit") => {
    setActiveFlow(flow);
    setActiveStep(0);
  };

  const handleStepClick = (i: number) => {
    setActiveStep(i);
    startLoop();
  };

  const progress = Math.round((activeStep / 5) * 100);

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
          <button
            onClick={() => switchFlow("quiz")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition border ${
              activeFlow === "quiz"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : darkMode
                ? "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
            }`}
          >
            Style quiz
          </button>
          <button
            onClick={() => switchFlow("outfit")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition border ${
              activeFlow === "outfit"
                ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                : darkMode
                ? "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
            }`}
          >
            AI outfit stylist
          </button>
        </div>

        {/* Progress bar */}
        <div className={`h-0.5 rounded-full mb-8 overflow-hidden ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`}>
          <motion.div
            className={`h-full rounded-full ${activeFlow === "quiz" ? "bg-purple-500" : "bg-yellow-400"}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step bubbles */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <button
                onClick={() => handleStepClick(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 border ${
                  i === activeStep
                    ? activeFlow === "quiz"
                      ? "bg-purple-500/15 border-purple-500/40 scale-110"
                      : "bg-yellow-400/15 border-yellow-400/40 scale-110"
                    : i < activeStep
                    ? "bg-green-500/10 border-green-500/30"
                    : darkMode
                    ? "bg-neutral-900 border-neutral-800 group-hover:border-neutral-600"
                    : "bg-neutral-100 border-neutral-200 group-hover:border-neutral-400"
                }`}>
                  {i < activeStep ? "✓" : step.icon}
                </div>
                <span className={`text-[10px] text-center max-w-[60px] leading-tight transition-colors ${
                  i === activeStep
                    ? darkMode ? "text-white font-medium" : "text-black font-medium"
                    : "text-neutral-500"
                }`}>
                  {step.label}
                </span>
              </button>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 flex-shrink-0 rounded transition-colors duration-500 ${
                  i < activeStep
                    ? activeFlow === "quiz" ? "bg-purple-500/50" : "bg-yellow-400/50"
                    : darkMode ? "bg-neutral-800" : "bg-neutral-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFlow}-${activeStep}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border p-6 ${
              darkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                activeFlow === "quiz"
                  ? "bg-purple-500/10 border border-purple-500/20"
                  : "bg-yellow-400/10 border border-yellow-400/20"
              }`}>
                {steps[activeStep].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-mono ${
                    activeFlow === "quiz" ? "text-purple-400" : "text-yellow-400"
                  }`}>
                    Step {activeStep + 1} / 6
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}>
                  {steps[activeStep].title}
                </h3>
                <p className={`text-sm leading-relaxed mb-3 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                  {steps[activeStep].desc}
                </p>
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

        {/* Speed + CTA row */}
        <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Speed:</span>
            {[
              { label: "Normal", ms: 1800 },
              { label: "Fast", ms: 900 },
            ].map((s) => (
              <button
                key={s.ms}
                onClick={() => setSpeed(s.ms)}
                className={`text-xs px-3 py-1 rounded-lg border transition ${
                  speed === s.ms
                    ? darkMode
                      ? "bg-neutral-800 border-neutral-700 text-white"
                      : "bg-neutral-200 border-neutral-300 text-black"
                    : darkMode
                    ? "border-neutral-800 text-neutral-500 hover:border-neutral-700"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <a
              href="/quiz"
              className="text-sm px-5 py-2 rounded-full border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition"
            >
              Take quiz →
            </a>
            <a
              href="/outfit"
              className="text-sm px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
            >
              Try stylist →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
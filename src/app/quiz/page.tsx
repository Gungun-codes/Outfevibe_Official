"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

/* ================= TYPES ================= */

interface Option {
  label: string;
  icon: string;
  persona: string;
  points: number;
  feedback: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface PersonaInfo {
  title: string;
  icon: string;
  tagline: string;
  color: string;
}

/* ================= PERSONA META ================= */

const FEMALE_PERSONAS: Record<string, PersonaInfo> = {
  minimal: { title: "Minimalist Maven", icon: "🤍", tagline: "Simplicity is power.", color: "#e0d5c7" },
  edgy: { title: "Edgy Trendsetter", icon: "🔥", tagline: "Bold moves only.", color: "#ef4444" },
  romantic: { title: "Romantic Softie", icon: "🌸", tagline: "Soft, dreamy, unforgettable.", color: "#f9a8d4" },
  creative: { title: "Playful Creative", icon: "🎨", tagline: "Color is your language.", color: "#a78bfa" },
  comfort: { title: "Comfort Queen", icon: "☁️", tagline: "Effortless is the vibe.", color: "#94a3b8" },
  boho: { title: "Boho Spirit", icon: "🌿", tagline: "Free soul, wild heart.", color: "#84cc16" },
};

const MALE_PERSONAS: Record<string, PersonaInfo> = {
  minimal: { title: "Minimalist King", icon: "🎯", tagline: "Clean. Sharp. Respect.", color: "#e0d5c7" },
  street: { title: "Streetwear Icon", icon: "🔥", tagline: "Fit check passed.", color: "#f97316" },
  gentleman: { title: "Modern Gentleman", icon: "💼", tagline: "Class never goes out of style.", color: "#3b82f6" },
  casual: { title: "Casual Cool", icon: "🌊", tagline: "Effortless is the best style.", color: "#06b6d4" },
  athleisure: { title: "Athleisure Pro", icon: "⚡", tagline: "Comfort meets performance.", color: "#22c55e" },
  explorer: { title: "Urban Explorer", icon: "🏔️", tagline: "Ready for anything.", color: "#a16207" },
};

/* ================= PERSONA OUTFITS ================= */

const PERSONA_OUTFITS: Record<string, { title: string; image: string }[]> = {
  "Minimalist Maven": [
    { title: "Neutral Power", image: "/suggestions/mm-1.jpg" },
    { title: "Soft Monochrome", image: "/suggestions/mm-2.jpg" },
  ],
  "Edgy Trendsetter": [
    { title: "Street Rebel", image: "/suggestions/et-1.jpg" },
    { title: "Night Slay", image: "/suggestions/et-2.jpg" },
  ],
  "Romantic Softie": [
    { title: "Soft Pastel Dream", image: "/suggestions/rs-1.jpg" },
    { title: "Cozy Romance", image: "/suggestions/rs-2.jpg" },
  ],
  "Playful Creative": [
    { title: "Color Pop", image: "/suggestions/pc-1.jpg" },
    { title: "Art Girl", image: "/suggestions/pc-2.jpg" },
  ],
  "Comfort Queen": [
    { title: "Elevated Lounge", image: "/suggestions/cq-1.jpg" },
    { title: "Chill Fit", image: "/suggestions/cq-2.jpg" },
  ],
  "Boho Spirit": [
    { title: "Earthy Vibes", image: "/suggestions/bs-1.jpg" },
    { title: "Festival Queen", image: "/suggestions/bs-2.jpg" },
  ],
  "Minimalist King": [
    { title: "Clean Authority", image: "/suggestions/mk-1.jpg" },
    { title: "Neutral Boss", image: "/suggestions/mk-2.jpg" },
  ],
  "Streetwear Icon": [
    { title: "Hype Drop", image: "/suggestions/si-1.jpg" },
    { title: "Layer King", image: "/suggestions/si-2.jpg" },
  ],
  "Modern Gentleman": [
    { title: "Smart Casual", image: "/suggestions/mg-1.jpg" },
    { title: "Evening Sharp", image: "/suggestions/mg-2.jpg" },
  ],
  "Casual Cool": [
    { title: "Weekend Fit", image: "/suggestions/cc-1.jpg" },
    { title: "Denim Classic", image: "/suggestions/cc-2.jpg" },
  ],
  "Athleisure Pro": [
    { title: "Gym Street", image: "/suggestions/ap-1.jpg" },
    { title: "Sport Luxe", image: "/suggestions/ap-2.jpg" },
  ],
  "Urban Explorer": [
    { title: "Adventure Core", image: "/suggestions/ue-1.jpg" },
    { title: "Rugged Layer", image: "/suggestions/ue-2.jpg" },
  ],
};

/* ================= QUESTIONS ================= */

export const QUESTIONS_FEMALE: Question[] = [
  {
    id: 1, question: "What defines your everyday style?",
    options: [
      { label: "Clean & structured", icon: "🤍", persona: "minimal", points: 2, feedback: "Simplicity wins." },
      { label: "Bold & attention-grabbing", icon: "🔥", persona: "edgy", points: 2, feedback: "You love impact." },
      { label: "Soft & delicate", icon: "🌸", persona: "romantic", points: 2, feedback: "Soft energy." },
      { label: "Colorful & playful", icon: "🎨", persona: "creative", points: 2, feedback: "Playful spirit." },
      { label: "Relaxed & easy", icon: "☁️", persona: "comfort", points: 2, feedback: "Ease first." },
      { label: "Flowing & earthy", icon: "🌿", persona: "boho", points: 2, feedback: "Free soul." },
    ],
  },
  {
    id: 2, question: "Your go-to outfit is…",
    options: [
      { label: "Neutral top + straight jeans", icon: "👖", persona: "minimal", points: 2, feedback: "Clean aesthetic." },
      { label: "Statement piece + edgy layers", icon: "🧥", persona: "edgy", points: 2, feedback: "Bold move." },
      { label: "Dress / flowy skirt", icon: "👗", persona: "romantic", points: 2, feedback: "Feminine touch." },
      { label: "Prints or mixed colors", icon: "🌈", persona: "creative", points: 2, feedback: "Creative flair." },
      { label: "Co-ord / relaxed set", icon: "👕", persona: "comfort", points: 2, feedback: "Effortless." },
      { label: "Maxi dress / earthy tones", icon: "🍂", persona: "boho", points: 2, feedback: "Boho vibe." },
    ],
  },
  {
    id: 3, question: "Accessories?",
    options: [
      { label: "Minimal jewelry", icon: "💍", persona: "minimal", points: 2, feedback: "Less is more." },
      { label: "Chunky or bold", icon: "⛓️", persona: "edgy", points: 2, feedback: "Statement ready." },
      { label: "Delicate pieces", icon: "✨", persona: "romantic", points: 2, feedback: "Elegant detail." },
      { label: "Fun & quirky", icon: "🎪", persona: "creative", points: 2, feedback: "Express yourself." },
      { label: "Only practical", icon: "⌚", persona: "comfort", points: 2, feedback: "Practical choice." },
      { label: "Layered / handmade", icon: "📿", persona: "boho", points: 2, feedback: "Artistic touch." },
    ],
  },
  {
    id: 4, question: "Footwear?",
    options: [
      { label: "Clean sneakers / flats", icon: "👟", persona: "minimal", points: 2, feedback: "Classic." },
      { label: "Chunky boots / edgy sneakers", icon: "🥾", persona: "edgy", points: 2, feedback: "Fearless step." },
      { label: "Heels / cute sandals", icon: "👠", persona: "romantic", points: 2, feedback: "Graceful." },
      { label: "Colorful sneakers", icon: "🌟", persona: "creative", points: 2, feedback: "Fun choice." },
      { label: "Slides / comfy shoes", icon: "🩴", persona: "comfort", points: 2, feedback: "Comfort zone." },
      { label: "Boots / earthy sandals", icon: "🪵", persona: "boho", points: 2, feedback: "Grounded vibe." },
    ],
  },
  {
    id: 5, question: "Wardrobe colors?",
    options: [
      { label: "Neutrals", icon: "🤎", persona: "minimal", points: 2, feedback: "Timeless." },
      { label: "Dark bold shades", icon: "🖤", persona: "edgy", points: 2, feedback: "Strong presence." },
      { label: "Pastels", icon: "💗", persona: "romantic", points: 2, feedback: "Soft charm." },
      { label: "Bright colors", icon: "💛", persona: "creative", points: 2, feedback: "Color lover." },
      { label: "Soft fabrics & muted tones", icon: "🩶", persona: "comfort", points: 2, feedback: "Relaxed energy." },
      { label: "Earthy tones", icon: "🍃", persona: "boho", points: 2, feedback: "Nature inspired." },
    ],
  },
  {
    id: 6, question: "What matters most when dressing up?",
    options: [
      { label: "Look clean", icon: "✨", persona: "minimal", points: 3, feedback: "Sharp choice." },
      { label: "Stand out", icon: "⚡", persona: "edgy", points: 3, feedback: "Unmissable." },
      { label: "Feel feminine", icon: "🌷", persona: "romantic", points: 3, feedback: "Graceful energy." },
      { label: "Show personality", icon: "🎯", persona: "creative", points: 3, feedback: "Authentic vibe." },
      { label: "Feel comfortable", icon: "🛋️", persona: "comfort", points: 3, feedback: "Comfort rules." },
      { label: "Feel free", icon: "🕊️", persona: "boho", points: 3, feedback: "Free spirit." },
    ],
  },
];

export const QUESTIONS_MALE: Question[] = [
  {
    id: 1, question: "How do you pick outfits?",
    options: [
      { label: "Safe fit", icon: "🎯", persona: "minimal", points: 2, feedback: "Clean mindset." },
      { label: "Trend inspired", icon: "🔥", persona: "street", points: 2, feedback: "Trend aware." },
      { label: "Structured choice", icon: "💼", persona: "gentleman", points: 2, feedback: "Intentional choice." },
      { label: "Chill & easy", icon: "🌊", persona: "casual", points: 2, feedback: "Relaxed energy." },
      { label: "Comfort first", icon: "☁️", persona: "athleisure", points: 2, feedback: "Comfort driven." },
      { label: "Practical & ready", icon: "🏔️", persona: "explorer", points: 2, feedback: "Ready mindset." },
    ],
  },
  {
    id: 2, question: "Everyday outfit?",
    options: [
      { label: "Tee + jeans", icon: "👕", persona: "minimal", points: 2, feedback: "Classic move." },
      { label: "Oversized + cargos", icon: "🧥", persona: "street", points: 2, feedback: "Street locked." },
      { label: "Shirt + chinos", icon: "👔", persona: "gentleman", points: 2, feedback: "Sharp presence." },
      { label: "Hoodie + denim", icon: "🧢", persona: "casual", points: 2, feedback: "Effortless vibe." },
      { label: "Tracks / sporty", icon: "🏃", persona: "athleisure", points: 2, feedback: "Built for movement." },
      { label: "Utility layers", icon: "🎒", persona: "explorer", points: 2, feedback: "Functional style." },
    ],
  },
  {
    id: 3, question: "Accessories?",
    options: [
      { label: "Watch only", icon: "⌚", persona: "minimal", points: 2, feedback: "Subtle power." },
      { label: "Chains / rings", icon: "⛓️", persona: "street", points: 2, feedback: "Statement ready." },
      { label: "Coordinated details", icon: "💎", persona: "gentleman", points: 2, feedback: "Refined touch." },
      { label: "Rarely wear", icon: "🤷", persona: "casual", points: 2, feedback: "No fuss." },
      { label: "Sport bands / caps", icon: "🧢", persona: "athleisure", points: 2, feedback: "Sport energy." },
      { label: "Utility belts / rugged", icon: "🪖", persona: "explorer", points: 2, feedback: "Practical edge." },
    ],
  },
  {
    id: 4, question: "Footwear?",
    options: [
      { label: "Clean sneakers", icon: "👟", persona: "minimal", points: 2, feedback: "Sharp choice." },
      { label: "Chunky sneakers", icon: "🥾", persona: "street", points: 2, feedback: "Bold step." },
      { label: "Loafers / boots", icon: "👞", persona: "gentleman", points: 2, feedback: "Elevated move." },
      { label: "Any comfy pair", icon: "🩴", persona: "casual", points: 2, feedback: "Chill pick." },
      { label: "Running shoes", icon: "🏃", persona: "athleisure", points: 2, feedback: "Comfort first." },
      { label: "Tactical / rugged boots", icon: "🪖", persona: "explorer", points: 2, feedback: "Action ready." },
    ],
  },
  {
    id: 5, question: "Wardrobe colors?",
    options: [
      { label: "Black / white / grey", icon: "🖤", persona: "minimal", points: 2, feedback: "Timeless energy." },
      { label: "Bold / trending colors", icon: "🔥", persona: "street", points: 2, feedback: "Attention locked." },
      { label: "Navy / structured tones", icon: "💙", persona: "gentleman", points: 2, feedback: "Polished vibe." },
      { label: "Mixed casual tones", icon: "🎨", persona: "casual", points: 2, feedback: "Easy balance." },
      { label: "Sporty tones", icon: "💚", persona: "athleisure", points: 2, feedback: "Dynamic look." },
      { label: "Earthy / military tones", icon: "🍃", persona: "explorer", points: 2, feedback: "Grounded style." },
    ],
  },
  {
    id: 6, question: "What matters most when dressing up?",
    options: [
      { label: "Look clean", icon: "✨", persona: "minimal", points: 3, feedback: "Precision matters." },
      { label: "Look stylish", icon: "🔥", persona: "street", points: 3, feedback: "Impression counts." },
      { label: "Look sharp", icon: "💼", persona: "gentleman", points: 3, feedback: "Command respect." },
      { label: "Feel relaxed", icon: "🌊", persona: "casual", points: 3, feedback: "Stay comfortable." },
      { label: "Move freely", icon: "⚡", persona: "athleisure", points: 3, feedback: "Performance first." },
      { label: "Be prepared", icon: "🏔️", persona: "explorer", points: 3, feedback: "Ready always." },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function StyleQuizPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentQuestions = gender === "male" ? QUESTIONS_MALE : QUESTIONS_FEMALE;
  const personaMap = gender === "male" ? MALE_PERSONAS : FEMALE_PERSONAS;
  const totalQuestions = currentQuestions.length;

  /* ================= LOGIC ================= */

  const handleSelect = (option: Option) => {
    // Update scores
    const newScores = { ...scores };
    newScores[option.persona] = (newScores[option.persona] || 0) + option.points;
    setScores(newScores);

    // Store answer
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    // Show feedback
    setFeedbackMsg(option.feedback);
    setTimeout(() => {
      setFeedbackMsg(null);
      if (step < totalQuestions - 1) {
        setStep(step + 1);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  const goBack = () => {
    if (step > 0) {
      const lastAnswer = answers[step - 1];
      // Undo last score
      const newScores = { ...scores };
      if (lastAnswer) {
        newScores[lastAnswer.persona] = (newScores[lastAnswer.persona] || 0) - lastAnswer.points;
      }
      setScores(newScores);
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    } else {
      setGender(null);
      setStep(0);
      setAnswers([]);
      setScores({});
    }
  };

  const getWinningPersona = () => {
    let maxScore = 0;
    let winner = Object.keys(personaMap)[0];
    for (const [key, val] of Object.entries(scores)) {
      if (val > maxScore) {
        maxScore = val;
        winner = key;
      }
    }
    return personaMap[winner] || personaMap[Object.keys(personaMap)[0]];
  };

  const getWinningPersonaKey = () => {
    let maxScore = 0;
    let winner = Object.keys(personaMap)[0];
    for (const [key, val] of Object.entries(scores)) {
      if (val > maxScore) {
        maxScore = val;
        winner = key;
      }
    }
    return winner;
  };

  const getMaxPossibleScore = () => {
    // 5 questions × 2pts + 1 question × 3pts = 13
    return 13;
  };

  const getSortedScores = () => {
    return Object.entries(personaMap)
      .map(([key, info]) => ({
        key,
        ...info,
        score: scores[key] || 0,
      }))
      .sort((a, b) => b.score - a.score);
  };

  const restart = () => {
    setGender(null);
    setStep(0);
    setAnswers([]);
    setScores({});
    setIsFinished(false);
    setFeedbackMsg(null);
  };

  /* ================= GENDER SCREEN ================= */

  if (!gender) {
    const brandLetters = "OUTFEVIBE".split("");
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af7f]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#d4af7f]/3 blur-[120px] rounded-full pointer-events-none" />

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 relative z-10">
          <div className="text-center max-w-lg">

            {/* Animated OUTFEVIBE letters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-[3px] mb-8 cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              {brandLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="text-4xl md:text-5xl font-extrabold tracking-[0.15em] bg-gradient-to-b from-[#d4af7f] via-[#f5e6c8] to-[#b8860b] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(212,175,127,0.3)] inline-block group-hover:drop-shadow-[0_0_30px_rgba(212,175,127,0.5)] transition-[filter] duration-300"
                  style={{ perspective: "600px" }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
              className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#d4af7f]/50 to-transparent mb-8"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            >
              Let's <span className="text-[#d4af7f]">Style</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-gray-400 text-lg mb-14"
            >
              6 quick questions. Your style persona awaits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGender("female")}
                className="group relative px-12 py-6 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:border-[#d4af7f] transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(212,175,127,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af7f]/0 via-transparent to-[#d4af7f]/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.span
                  className="text-4xl block mb-3"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  👗
                </motion.span>
                <span className="text-lg font-semibold tracking-wide relative z-10">Style for Her</span>
                <span className="block text-xs text-gray-500 mt-1 relative z-10">Discover your vibe</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGender("male")}
                className="group relative px-12 py-6 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:border-[#d4af7f] transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(212,175,127,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af7f]/0 via-transparent to-[#d4af7f]/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.span
                  className="text-4xl block mb-3"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
                >
                  🧥
                </motion.span>
                <span className="text-lg font-semibold tracking-wide relative z-10">Style for Him</span>
                <span className="block text-xs text-gray-500 mt-1 relative z-10">Unlock your persona</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RESULT SCREEN ================= */

  if (isFinished) {
    const winner = getWinningPersona();
    const winnerKey = getWinningPersonaKey();
    const sortedScores = getSortedScores();
    const maxPossible = getMaxPossibleScore();

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
              <Image src="/outfevibe_logo.png" alt="Outfevibe Logo" width={36} height={36} className="object-contain" />
              <span className="text-lg font-bold tracking-widest text-white">OUTFEVIBE</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center pt-24 pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            {/* Result Card */}
            <div className="relative bg-[#111] rounded-3xl border border-[#1f1f1f] overflow-hidden">

              {/* Top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ backgroundColor: winner.color }} />

              <div className="relative p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-7xl mb-6"
                >
                  {winner.icon}
                </motion.div>

                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                  Your Style Persona
                </p>

                <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: winner.color }}>
                  {winner.title}
                </h1>

                <p className="text-gray-400 text-sm mb-8">
                  {winner.tagline}
                </p>

                {/* Score Breakdown with Outfits */}
                <div className="text-left space-y-4 mb-8">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 text-center">
                    Persona Breakdown
                  </h3>
                  {sortedScores.map((item, i) => {
                    const outfits = PERSONA_OUTFITS[item.title] || [];
                    const isWinner = item.key === winnerKey;
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className={`rounded-xl p-3 transition-all duration-300 ${isWinner
                          ? "bg-[#1a1a1a] border border-[#d4af7f]/30"
                          : "bg-transparent"
                          }`}
                      >
                        {/* Persona header + score */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.icon}</span>
                            <span className={`text-sm font-medium ${isWinner ? "text-white" : "text-gray-500"}`}>
                              {item.title}
                            </span>
                          </div>
                          <span className={`text-xs font-mono ${isWinner ? "text-[#d4af7f]" : "text-gray-600"}`}>
                            {item.score}/{maxPossible}
                          </span>
                        </div>

                        {/* Score bar */}
                        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.score / maxPossible) * 100}%` }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: isWinner ? winner.color : "#333",
                            }}
                          />
                        </div>

                        {/* Outfit previews */}
                        {outfits.length > 0 && (
                          <div className="flex gap-2">
                            {outfits.map((outfit, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 + j * 0.05 }}
                                className={`flex-1 rounded-lg overflow-hidden border transition-all duration-300 ${isWinner
                                  ? "border-[#d4af7f]/20 hover:border-[#d4af7f]/50"
                                  : "border-[#1f1f1f] opacity-50 hover:opacity-80"
                                  }`}
                              >
                                <img
                                  src={outfit.image}
                                  alt={outfit.title}
                                  className="w-full h-20 object-cover"
                                />
                                <div className="px-2 py-1.5 bg-[#0f0f0f]">
                                  <p className={`text-[10px] font-medium truncate ${isWinner ? "text-gray-300" : "text-gray-600"}`}>
                                    {outfit.title}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const persona = winner.title;
                    localStorage.setItem("userPersona", persona);
                    localStorage.setItem("quizGender", gender || "");

                    // Fire Supabase save in the background — don't block navigation
                    if (user) {
                      supabase
                        .from("quiz_result")
                        .upsert(
                          {
                            user_id: user.id,
                            persona_name: persona,
                            email: user.email || "",
                            gender: gender === "male" ? "Boy" : "Girl",
                          },
                          { onConflict: "user_id" }
                        )
                        .then(({ error }) => {
                          if (error) {
                            console.error("Upsert failed:", error.message);
                            // Fallback: try plain insert
                            supabase
                              .from("quiz_result")
                              .insert({
                                user_id: user.id,
                                persona_name: persona,
                                email: user.email || "",
                                gender: gender === "male" ? "Boy" : "Girl",
                              })
                              .then(({ error: e2 }) => {
                                if (e2) console.error("Insert also failed:", e2.message);
                              });
                          }
                        });
                    }

                    router.push("/suggestions");
                  }}
                  className="w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-black"
                  style={{ backgroundColor: winner.color }}
                >
                  ✨ Show Me My Fits
                </motion.button>

                {/* Secondary Actions */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <button
                    onClick={restart}
                    className="text-gray-500 hover:text-white text-sm transition flex items-center gap-1.5"
                  >
                    ↻ Retake
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-500 hover:text-white text-sm transition flex items-center gap-1.5"
                  >
                    🏠 Home
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ================= QUESTIONS SCREEN ================= */

  const currentQ = currentQuestions[step];
  const progress = ((step + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/outfevibe_logo.png" alt="Outfevibe Logo" width={36} height={36} className="object-contain" />
            <span className="text-lg font-bold tracking-widest text-white">OUTFEVIBE</span>
          </div>
          <span className="text-xs text-gray-500 font-mono tracking-wide">
            {step + 1} / {totalQuestions}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[2px] bg-[#1a1a1a]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Feedback overlay — blurs background & blocks interaction */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ pointerEvents: "all" }}
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* Feedback card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 bg-gradient-to-br from-[#d4af7f] to-[#b8860b] text-black px-10 py-5 rounded-2xl font-bold text-base shadow-[0_0_60px_rgba(212,175,127,0.4)] border border-[#f5e6c8]/30"
            >
              <span className="mr-2">✨</span>
              {feedbackMsg}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-xl">

          {/* Back button */}
          <button
            onClick={goBack}
            className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1.5 mb-8"
          >
            ← Back
          </button>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">
                {currentQ.question}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 18 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(opt)}
                    className="group relative w-full p-4 pl-5 rounded-xl border border-[#1f1f1f] bg-[#111] hover:bg-[#141414] hover:border-[#d4af7f]/50 transition-all duration-300 text-left flex items-center gap-4 overflow-hidden hover:shadow-[0_0_25px_rgba(212,175,127,0.08)]"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4af7f] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af7f]/0 via-[#d4af7f]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <span className="text-xl relative z-10 group-hover:scale-110 transition-transform duration-200">{opt.icon}</span>
                    <span className="text-sm md:text-base font-medium relative z-10">{opt.label}</span>

                    {/* Points badge */}
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="ml-auto text-xs font-mono text-[#d4af7f]/60 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      +{opt.points}
                    </motion.span>

                    {/* Arrow indicator */}
                    <span className="text-gray-600 group-hover:text-[#d4af7f] transition-colors duration-300 relative z-10 opacity-0 group-hover:opacity-100 text-sm">
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
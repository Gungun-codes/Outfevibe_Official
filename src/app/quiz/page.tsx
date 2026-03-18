"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

/* ================= TYPES ================= */

interface Option {
  label: string;
  icon: string;
  image?: string;
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
};

const MALE_PERSONAS: Record<string, PersonaInfo> = {
  minimal: { title: "Minimalist King", icon: "🎯", tagline: "Clean. Sharp. Respect.", color: "#e0d5c7" },
  street: { title: "Streetwear Icon", icon: "🔥", tagline: "Fit check passed.", color: "#f97316" },
  gentleman: { title: "Modern Gentleman", icon: "💼", tagline: "Class never goes out of style.", color: "#3b82f6" },
  casual: { title: "Casual Cool", icon: "🌊", tagline: "Effortless is the best style.", color: "#06b6d4" },
  athleisure: { title: "Athleisure Pro", icon: "⚡", tagline: "Comfort meets performance.", color: "#22c55e" },
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
};

/* ================= QUESTIONS ================= */

export const QUESTIONS_FEMALE: Question[] = [
  {
    id: 1, question: "What defines your everyday style?",
    options: [
      { label: "Minimal & polished", icon: "🤍", image: "/quiz/f_q1_o1.jpg", persona: "minimal", points: 2, feedback: "Simplicity wins." },
      { label: "Bold & statement", icon: "🔥", image: "/quiz/f_q1_o2.jpg", persona: "edgy", points: 2, feedback: "You love impact." },
      { label: "Soft & feminine", icon: "🌸", image: "/quiz/f_q1_o3.jpg", persona: "romantic", points: 2, feedback: "Soft energy." },
      { label: "Relaxed & casual", icon: "🎨", image: "/quiz/f_q1_o4.jpg", persona: "comfort", points: 2, feedback: "Ease First." },
    ],
  },
  {
    id: 2, question: "Your go-to outfit is…",
    options: [
      { label: "Neutral top + straight jeans", icon: "👖", image: "/quiz/f_q2_o1.jpg", persona: "minimal", points: 2, feedback: "Clean aesthetic." },
      { label: "Statement piece + edgy layers", icon: "🧥", image: "/quiz/f_q2_o2.jpg", persona: "edgy", points: 2, feedback: "Bold move." },
      { label: "Dress / flowy skirt", icon: "👗", image: "/quiz/f_q2_o3.jpg", persona: "romantic", points: 2, feedback: "Feminine touch." },
      { label: "Co-ord / relaxed set", icon: "👕", image: "/quiz/f_q2_o4.jpg", persona: "comfort", points: 2, feedback: "Effortless." },
    ],
  },
  {
    id: 3, question: "Accessories?",
    options: [
      { label: "Minimal jewelry", icon: "💍", image: "/quiz/f_q3_o1.jpg", persona: "minimal", points: 2, feedback: "Less is more." },
      { label: "Chunky or bold", icon: "⛓️", image: "/quiz/f_q3_o2.jpg", persona: "edgy", points: 2, feedback: "Statement ready." },
      { label: "Delicate pieces", icon: "✨", image: "/quiz/f_q3_o3.jpg", persona: "romantic", points: 2, feedback: "Elegant detail." },
      { label: "Only practical", icon: "⌚", image: "/quiz/f_q3_o4.jpg", persona: "comfort", points: 2, feedback: "Practical choice." },
    ],
  },
  {
    id: 4, question: "Footwear?",
    options: [
      { label: "Clean sneakers / flats", icon: "👟", image: "/quiz/f_q4_o1.jpg", persona: "minimal", points: 2, feedback: "Classic." },
      { label: "Chunky boots / edgy sneakers", icon: "🥾", image: "/quiz/f_q4_o2.jpg", persona: "edgy", points: 2, feedback: "Fearless step." },
      { label: "Heels / cute sandals", icon: "👠", image: "/quiz/f_q4_o3.jpg", persona: "romantic", points: 2, feedback: "Graceful." },
      { label: "Slides / comfy shoes", icon: "🩴", image: "/quiz/f_q4_o4.jpg", persona: "comfort", points: 2, feedback: "Comfort zone." },
    ],
  },
  {
    id: 5, question: "Wardrobe colors?",
    options: [
      { label: "Neutral tones", icon: "🤎", image: "/quiz/f_q5_o1.jpg", persona: "minimal", points: 2, feedback: "Timeless." },
      { label: "Dark bold shades", icon: "🖤", image: "/quiz/f_q5_o2.jpg", persona: "edgy", points: 2, feedback: "Strong presence." },
      { label: "Soft Pastels", icon: "💗", image: "/quiz/f_q5_o3.jpg", persona: "romantic", points: 2, feedback: "Soft charm." },
      { label: "Soft fabrics & muted tones", icon: "🩶", image: "/quiz/f_q5_o4.jpg", persona: "comfort", points: 2, feedback: "Relaxed energy." },
    ],
  },
  {
    id: 6, question: "What matters most when dressing up?",
    options: [
      { label: "Look clean & polished", icon: "✨", image: "/quiz/f_q6_o1.jpg", persona: "minimal", points: 3, feedback: "Sharp choice." },
      { label: "Stand out", icon: "⚡", image: "/quiz/f_q6_o2.jpg", persona: "edgy", points: 3, feedback: "Unmissable." },
      { label: "Feel feminine", icon: "🌷", image: "/quiz/f_q6_o3.jpg", persona: "romantic", points: 3, feedback: "Graceful energy." },
      { label: "Feel comfortable", icon: "🛋️", image: "/quiz/f_q6_o4.jpg", persona: "comfort", points: 3, feedback: "Comfort rules." },
    ],
  },
];

export const QUESTIONS_MALE: Question[] = [
  {
    id: 1, question: "How do you pick outfits?",
    options: [
      { label: "Safe fit", icon: "🎯", image: "/quiz/m_q1_o1.jpg", persona: "minimal", points: 2, feedback: "Clean mindset." },
      { label: "Trend inspired", icon: "🔥", image: "/quiz/m_q1_o2.jpg", persona: "street", points: 2, feedback: "Trend aware." },
      { label: "Structured choice", icon: "💼", image: "/quiz/m_q1_o3.jpg", persona: "gentleman", points: 2, feedback: "Intentional choice." },
      { label: "Chill & easy", icon: "🌊", image: "/quiz/m_q1_o4.jpg", persona: "casual", points: 2, feedback: "Relaxed energy." },
    ],
  },
  {
    id: 2, question: "Everyday outfit?",
    options: [
      { label: "Tee + jeans", icon: "👕", image: "/quiz/m_q2_o1.jpg", persona: "minimal", points: 2, feedback: "Classic move." },
      { label: "Oversized + cargos", icon: "🧥", image: "/quiz/m_q2_o2.jpg", persona: "street", points: 2, feedback: "Street locked." },
      { label: "Shirt + chinos", icon: "👔", image: "/quiz/m_q2_o3.jpg", persona: "gentleman", points: 2, feedback: "Sharp presence." },
      { label: "Hoodie + denim", icon: "🧢", image: "/quiz/m_q2_o4.jpg", persona: "casual", points: 2, feedback: "Effortless vibe." },
    ],
  },
  {
    id: 3, question: "Accessories?",
    options: [
      { label: "Watch only", icon: "⌚", image: "/quiz/m_q3_o1.jpg", persona: "minimal", points: 2, feedback: "Subtle power." },
      { label: "Chains / rings", icon: "⛓️", image: "/quiz/m_q3_o2.jpg", persona: "street", points: 2, feedback: "Statement ready." },
      { label: "Coordinated details", icon: "💎", image: "/quiz/m_q3_o3.jpg", persona: "gentleman", points: 2, feedback: "Refined touch." },
      { label: "Sport bands / caps", icon: "🧢", image: "/quiz/m_q3_o4.jpg", persona: "athleisure", points: 2, feedback: "Sport energy." },
    ],
  },
  {
    id: 4, question: "Footwear?",
    options: [
      { label: "Clean sneakers", icon: "👟", image: "/quiz/m_q4_o1.jpg", persona: "minimal", points: 2, feedback: "Sharp choice." },
      { label: "Chunky sneakers", icon: "🥾", image: "/quiz/m_q4_o2.jpg", persona: "street", points: 2, feedback: "Bold step." },
      { label: "Loafers / boots", icon: "👞", image: "/quiz/m_q4_o3.jpg", persona: "gentleman", points: 2, feedback: "Elevated move." },
      { label: "Any comfy pair", icon: "🩴", image: "/quiz/m_q4_o4.jpg", persona: "casual", points: 2, feedback: "Chill pick." },
    ],
  },
  {
    id: 5, question: "Wardrobe colors?",
    options: [
      { label: "Black / white / grey", icon: "🖤", image: "/quiz/m_q5_o1.jpg", persona: "minimal", points: 2, feedback: "Timeless energy." },
      { label: "Bold / trending colors", icon: "🔥", image: "/quiz/m_q5_o2.jpg", persona: "street", points: 2, feedback: "Attention locked." },
      { label: "Navy / structured tones", icon: "💙", image: "/quiz/m_q5_o3.jpg", persona: "gentleman", points: 2, feedback: "Polished vibe." },
      { label: "Mixed casual tones", icon: "🎨", image: "/quiz/m_q5_o4.jpg", persona: "casual", points: 2, feedback: "Easy balance." },
    ],
  },
  {
    id: 6, question: "What matters most when dressing up?",
    options: [
      { label: "Look clean", icon: "✨", image: "/quiz/m_q6_o1.jpg", persona: "minimal", points: 3, feedback: "Precision matters." },
      { label: "Look stylish", icon: "🔥", image: "/quiz/m_q6_o2.jpg", persona: "street", points: 3, feedback: "Impression counts." },
      { label: "Look sharp", icon: "💼", image: "/quiz/m_q6_o3.jpg", persona: "gentleman", points: 3, feedback: "Command respect." },
      { label: "Feel relaxed", icon: "🌊", image: "/quiz/m_q6_o4.jpg", persona: "casual", points: 3, feedback: "Stay comfortable." },
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

  // ── PERSISTENCE: restore quiz state on refresh ──────────────────
  const QUIZ_KEY = "outfevibe_quiz_progress";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gender) setGender(parsed.gender);
        if (typeof parsed.step === "number") setStep(parsed.step);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.isFinished) setIsFinished(parsed.isFinished);
      }
    } catch (e) {
      console.error("Failed to restore quiz state:", e);
    }
  }, []); // runs once on mount

  useEffect(() => {
    // Don't save the very initial empty state
    if (!gender && step === 0 && answers.length === 0) return;
    localStorage.setItem(
      QUIZ_KEY,
      JSON.stringify({ gender, step, answers, scores, isFinished })
    );
  }, [gender, step, answers, scores, isFinished]);
  // ────────────────────────────────────────────────────────────────

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
  localStorage.removeItem("outfevibe_quiz_progress"); // ← ADD THIS LINE
  setGender(null);
  setStep(0);
  setAnswers([]);
  setScores({});
  setIsFinished(false);
  setFeedbackMsg(null);
};

  /* ================= GENDER SCREEN ================= */

  if (!gender) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af7f]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#d4af7f]/3 blur-[120px] rounded-full pointer-events-none" />

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 relative z-10">
          <div className="text-center max-w-lg">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight"
            >
              Discover Your <span className="text-[#d4af7f]">Style Persona</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-gray-400 text-lg mb-14"
            >
              Answer 6 quick questions and discover the style that defines you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 max-w-md mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGender("female")}
                className="group relative w-full rounded-2xl bg-[#111] border border-[#2a2a2a] overflow-hidden hover:border-[#d4af7f] transition-all duration-300"
              >

                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src="/quiz/f_q4_o3.jpg"
                    alt="female fashion"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="py-3 text-center">
                  <span className="text-lg font-semibold">Style for Her</span>
                  <p className="text-xs text-gray-400">Discover your vibe</p>
                </div>

              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGender("male")}
                className="group relative w-full rounded-2xl bg-[#111] border border-[#2a2a2a] overflow-hidden hover:border-[#d4af7f] transition-all duration-300"
              >

                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src="/quiz/m_q2_o1.jpg"
                    alt="male fashion"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="py-3 text-center">
                  <span className="text-lg font-semibold">Style for Him</span>
                  <p className="text-xs text-gray-400">Unlock your persona</p>
                </div>

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
                          <div className="grid grid-cols-2 gap-3">
                            {outfits.map((outfit, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 + j * 0.05 }}
                                className={`flex-1 rounded-xl overflow-hidden border transition-all duration-300 ${isWinner
                                  ? "border-[#d4af7f]/20 hover:border-[#d4af7f]/50"
                                  : "border-[#1f1f1f] opacity-50 hover:opacity-80"
                                  }`}
                              >
                                <img
                                  src={outfit.image}
                                  alt={outfit.title}
                                  className="w-full aspect-[3/4] object-cover"
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

                {/* AI Outfit CTA */}
                <div className="mt-8 mb-6 space-y-4">
                  <p className="text-gray-400 text-sm text-center px-4">
                    According to your personalization Get Your personalized outfit here
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${winner.color}40` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const persona = winner.title;
                      localStorage.setItem("userPersona", persona);
                      localStorage.setItem("quizGender", gender || "");
                      localStorage.removeItem("outfevibe_quiz_progress"); // clear quiz state after completion

                      // if user not logged in then force login
                      if (!user) {
                        router.push("/login?redirect=/outfit");
                        return;
                      }

                      // Fire Supabase save in the background — don't block navigation
                      if (user && user.email) {
                        const saveResult = async () => {
                          try {
                            // Check if a record already exists with this email
                            const { data, error: fetchError } = await supabase
                              .from("quiz_result")
                              .select("id")
                              .eq("email", user.email)
                              .single();

                            if (fetchError && fetchError.code !== "PGRST116") {
                              // PGRST116 means zero rows found, which is fine
                              console.error("Error checking existing record:", fetchError.message);
                            }

                            if (data) {
                              // Record exists, update it
                              const { error: updateError } = await supabase
                                .from("quiz_result")
                                .update({
                                  persona_name: persona,
                                  gender: gender === "male" ? "Boy" : "Girl"
                                })
                                .eq("email", user.email);

                              if (updateError) {
                                console.error("Update failed:", updateError.message);
                              }
                            } else {
                              // Record does not exist, insert new
                              const { error: insertError } = await supabase
                                .from("quiz_result")
                                .insert({
                                  user_id: user.id || null, // fallback in case user.id is somehow missing
                                  persona_name: persona,
                                  email: user.email,
                                  gender: gender === "male" ? "Boy" : "Girl",
                                });

                              if (insertError) {
                                console.error("Insert failed:", insertError.message);
                              }
                            }
                          } catch (err) {
                            console.error("Failed to save quiz result:", err);
                          }
                        };

                        saveResult();
                      }

                      router.push("/outfit");
                    }}
                    className="w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-black"
                    style={{ backgroundColor: winner.color }}
                  >
                    ✨ Get Your AI Outfit
                  </motion.button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <button
                    onClick={() => {
                      const shareText = `I found my style persona using Outfevibe AI! I am a ${winner.title}. Discover yours at`;
                      const shareUrl = "https://www.outfevibe.com";

                      if (navigator.share) {
                        navigator.share({
                          title: "My Outfevibe Style Persona",
                          text: shareText,
                          url: shareUrl,
                        }).catch((error) => console.error("Error sharing", error));
                      } else {
                        // Fallback for browsers that don't support native sharing
                        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="text-gray-500 hover:text-white text-sm transition flex items-center gap-1.5"
                  >
                    📤 Share
                  </button>
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

              <div className="grid grid-cols-2 gap-3">
                {currentQ.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(opt)}
                    className="w-full rounded-xl border border-[#1f1f1f] bg-[#111] overflow-hidden hover:border-[#d4af7f]/60 transition-all"
                  >

                    {/* IMAGE */}
                    {opt.image && (
                      <div className="relative w-full aspect-[4/5]">
                        <Image
                          src={opt.image}
                          alt={opt.label}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* TITLE + ICON */}
                    <div className="flex items-center justify-center gap-2 py-3 px-2">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-medium text-center">{opt.label}</span>
                    </div>

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
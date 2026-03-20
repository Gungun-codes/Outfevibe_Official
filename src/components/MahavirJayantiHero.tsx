"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface MahavirJayantiHeroProps {
  darkMode: boolean;
}

// ── Inline StatsBar so MahavirJayantiHero has zero external dependencies ──
function StatsBar({ darkMode }: { darkMode: boolean }) {
  const [userCount, setUserCount] = useState<number>(178);
  const [quizCount, setQuizCount] = useState<number>(80);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [{ count: users }, { count: quizzes }] = await Promise.all([
          supabase.from("users_profile").select("*", { count: "exact", head: true }),
          supabase.from("quiz_result").select("*", { count: "exact", head: true }),
        ]);
        if (users !== null) setUserCount((users ?? 0) + 150);
        if (quizzes !== null) setQuizCount((quizzes ?? 0) + 80);
        setLoaded(true);
      } catch { setLoaded(true); }
    };
    fetch();
  }, []);

  const stats = [
    { value: "Feb 10, 2026", label: "Launched", live: false },
    { value: `${userCount}+`, label: "Users joined", live: true },
    { value: `${quizCount}+`, label: "Quizzes taken", live: true },
    { value: "200+", label: "Styles generated", live: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className={`flex flex-wrap justify-center gap-6 md:gap-12 mt-14 pt-10 border-t ${
        darkMode ? "border-neutral-800" : "border-neutral-200"
      }`}
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              {stat.value}
            </p>
            {stat.live && (
              <span className={`w-1.5 h-1.5 rounded-full border-2 border-black flex-shrink-0 mt-0.5 ${
                loaded ? "bg-green-400 animate-pulse" : "bg-yellow-400"
              }`} />
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1 tracking-wide">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}

export default function MahavirJayantiHero({ darkMode }: MahavirJayantiHeroProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0a0a0a 0%, #0d1a00 40%, #1a1000 100%)"
          : "linear-gradient(135deg, #f0fff4 0%, #fefce8 50%, #f0fdf4 100%)",
      }}
    >
      {/* ── Rotating rings ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-52 h-52 rounded-full opacity-20"
        style={{ border: "2px solid #ffffff", borderTopColor: "transparent" }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-10 w-36 h-36 rounded-full opacity-15"
        style={{ border: "2px solid #a3e635", borderRightColor: "transparent" }}
      />

      {/* ── Glow blobs ── */}
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full blur-[120px] opacity-15"
        style={{ background: "#ffffff" }} />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full blur-[100px] opacity-20"
        style={{ background: "#84cc16" }} />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: "12%", top: "25%", delay: 0,   char: "☮️" },
          { left: "82%", top: "18%", delay: 1,   char: "🌿" },
          { left: "20%", top: "72%", delay: 2,   char: "✨" },
          { left: "78%", top: "68%", delay: 0.5, char: "🪷" },
          { left: "50%", top: "88%", delay: 1.5, char: "🌸" },
          { left: "92%", top: "42%", delay: 2.5, char: "☮️" },
        ].map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-sm"
            style={{ left: item.left, top: item.top }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -15, 0], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: item.delay }}
          >
            {item.char}
          </motion.span>
        ))}
      </div>

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-md bg-white/5 border border-white/20 px-5 py-2 rounded-full text-sm mb-8"
        style={{ color: darkMode ? "#d9f99d" : "#4d7c0f" }}
      >
        🇮🇳 Mahavir Jayanti · Celebrating Non-Violence & Peace
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className={`text-4xl md:text-6xl font-bold leading-tight max-w-3xl ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Dress with
        <br />
        Grace &
        <span className="relative ml-3 inline-flex items-center gap-2">
          <span
            style={{
              background: "linear-gradient(90deg, #84cc16, #ffffff, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            INTENTION
          </span>
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🪷
          </motion.span>
        </span>
      </motion.h1>

      {/* ── Subtext ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 max-w-xl text-base"
        style={{ color: darkMode ? "#a3a3a3" : "#6b7280" }}
      >
        Celebrate Mahavir Jayanti with outfits that reflect purity, grace, and calm elegance.
        AI-curated looks for every ceremony and prayer gathering.
      </motion.p>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col md:flex-row gap-4 mt-10"
      >
        <a
          href="/quiz"
          className="relative px-8 py-3 rounded-full font-semibold inline-block text-black hover:scale-105 transition"
          style={{ background: "linear-gradient(135deg, #84cc16, #fbbf24)" }}
        >
          <span className="relative z-10">Find Your Celebration Look ✨</span>
          <span
            className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
            style={{ background: "#84cc16" }}
          />
        </a>
        <a
          href="/outfit"
          className="px-8 py-3 rounded-full font-semibold inline-block transition"
          style={{
            border: "1px solid #84cc16",
            color: darkMode ? "#a3e635" : "#4d7c0f",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "linear-gradient(135deg, #84cc16, #fbbf24)";
            (e.target as HTMLElement).style.color = "#000";
            (e.target as HTMLElement).style.borderColor = "transparent";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.color = darkMode ? "#a3e635" : "#4d7c0f";
            (e.target as HTMLElement).style.borderColor = "#84cc16";
          }}
        >
          Style My Festive Outfit 🌿
        </a>
      </motion.div>

      {/* ── Color palette pills ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {[
          { color: "#ffffff", label: "White · Purity",        border: true  },
          { color: "#fffde7", label: "Cream · Elegance",      border: false },
          { color: "#fff9c4", label: "Pale Yellow · Serenity",border: false },
          { color: "#c8e6c9", label: "Sage Green · Nature",   border: false },
          { color: "#f5f5dc", label: "Ivory · Grace",         border: false },
          { color: "#ffd700", label: "Gold · Reverence",      border: false },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.06 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-white/10"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "#d9f99d" : "#4d7c0f",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: item.color,
                border: item.border ? "1px solid #ccc" : "none",
              }}
            />
            {item.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Stats ── */}
      <StatsBar darkMode={darkMode} />
    </section>
  );
}
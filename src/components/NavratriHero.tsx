"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface NavratriHeroProps {
  darkMode: boolean;
}

// ── Inline StatsBar so NavratriHero has zero external dependencies ──
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

export default function NavratriHero({ darkMode }: NavratriHeroProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a00 40%, #0d0014 100%)"
          : "linear-gradient(135deg, #fff7ed 0%, #fde8d8 40%, #f3e8ff 100%)",
      }}
    >
      {/* ── Rotating rings ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-52 h-52 rounded-full opacity-30"
        style={{
          border: "3px solid transparent",
          borderTopColor: "#ff6b35",
          borderRightColor: "#ff006e",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-20"
        style={{
          border: "2px solid transparent",
          borderTopColor: "#a855f7",
          borderLeftColor: "#ff6b35",
        }}
      />

      {/* ── Glow blobs ── */}
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full blur-[100px] opacity-25"
        style={{ background: "#ff6b35" }} />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full blur-[100px] opacity-20"
        style={{ background: "#a855f7" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-[120px] opacity-10"
        style={{ background: "#ff006e" }} />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: "15%", top: "20%", delay: 0,   char: "🪔" },
          { left: "80%", top: "15%", delay: 1,   char: "🌸" },
          { left: "25%", top: "70%", delay: 2,   char: "✨" },
          { left: "75%", top: "65%", delay: 0.5, char: "🪔" },
          { left: "50%", top: "85%", delay: 1.5, char: "🌺" },
          { left: "90%", top: "45%", delay: 2.5, char: "✨" },
        ].map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-sm"
            style={{ left: item.left, top: item.top }}
            animate={{ opacity: [0, 1, 0], y: [0, -20, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: item.delay }}
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
        className="backdrop-blur-md bg-white/5 border border-orange-400/40 px-5 py-2 rounded-full text-sm mb-8"
        style={{ color: "#ffb347" }}
      >
        🇮🇳 Navratri Collection is Here · 9 Nights · 9 Looks
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
        This Navratri,
        <br />
        Dance in Your
        <span className="relative ml-3 inline-flex items-center gap-2">
          <span
            style={{
              background: "linear-gradient(90deg, #ff6b35, #ff006e, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BEST LOOK
          </span>
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🪔
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
        AI-powered Garba & Navratri outfit picks tailored to your body type,
        skin tone, and budget. Look stunning for all 9 nights.
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
          className="relative px-8 py-3 rounded-full font-semibold inline-block text-white hover:scale-105 transition overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ff6b35, #ff006e)" }}
        >
          <span className="relative z-10">Find Your Navratri Look ✨</span>
          <span
            className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse"
            style={{ background: "linear-gradient(135deg, #ff6b35, #ff006e)" }}
          />
        </a>
        <a
          href="/outfit"
          className="px-8 py-3 rounded-full font-semibold inline-block transition"
          style={{
            border: "1px solid #ff6b35",
            color: darkMode ? "#ff9a6c" : "#ff6b35",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "linear-gradient(135deg, #ff6b35, #ff006e)";
            (e.target as HTMLElement).style.color = "#fff";
            (e.target as HTMLElement).style.borderColor = "transparent";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.color = darkMode ? "#ff9a6c" : "#ff6b35";
            (e.target as HTMLElement).style.borderColor = "#ff6b35";
          }}
        >
          Style My Garba Outfit 🪷
        </a>
      </motion.div>

      {/* ── 9 color-of-the-day pills ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-2 mt-8"
      >
        {[
          { day: "Day 1", color: "#ff9d00", label: "Yellow" },
          { day: "Day 2", color: "#00b74a", label: "Green" },
          { day: "Day 3", color: "#808080", label: "Grey" },
          { day: "Day 4", color: "#ff6b35", label: "Orange" },
          { day: "Day 5", color: "#f5f5f5", label: "White" },
          { day: "Day 6", color: "#ff0000", label: "Red" },
          { day: "Day 7", color: "#0064ff", label: "Royal Blue" },
          { day: "Day 8", color: "#ff69b4", label: "Pink" },
          { day: "Day 9", color: "#9c27b0", label: "Purple" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.05 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-white/10"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "#e5e5e5" : "#374151",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: item.color,
                border: item.color === "#f5f5f5" ? "1px solid #ccc" : "none",
              }}
            />
            {item.day} · {item.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Stats ── */}
      <StatsBar darkMode={darkMode} />
    </section>
  );
}
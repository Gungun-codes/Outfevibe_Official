"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface MahavirJayantiHeroProps {
  darkMode: boolean;
}

// ── Inline StatsBar ──
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
      } catch {
        setLoaded(true);
      }
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
      transition={{ delay: 1.4, duration: 0.6 }}
      className={`flex flex-wrap justify-center gap-6 md:gap-12 mt-14 pt-10 border-t ${
        darkMode ? "border-amber-900/40" : "border-amber-200/60"
      }`}
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <p
              className="text-2xl font-bold"
              style={{ color: darkMode ? "#fbbf24" : "#92400e" }}
            >
              {stat.value}
            </p>
            {stat.live && (
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
                  loaded ? "bg-amber-400 animate-pulse" : "bg-yellow-300"
                }`}
              />
            )}
          </div>
          <p
            className="text-xs mt-1 tracking-widest uppercase"
            style={{ color: darkMode ? "#a16207" : "#b45309" }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

// ── Lord Mahavir meditating silhouette (SVG) ──
function MahavirFigure({ darkMode }: { darkMode: boolean }) {
  return (
    <svg
      viewBox="0 0 220 320"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Lord Mahavir meditating"
    >
      <defs>
        <radialGradient id="aura" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="innerAura" cx="50%" cy="40%" r="35%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={darkMode ? "#fef3c7" : "#92400e"} />
          <stop offset="100%" stopColor={darkMode ? "#d97706" : "#451a03"} />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer divine aura rings */}
      <ellipse cx="110" cy="135" rx="105" ry="110" fill="url(#aura)" />
      <ellipse cx="110" cy="125" rx="75" ry="78" fill="url(#innerAura)" opacity="0.5" />

      {/* Halo ring */}
      <circle cx="110" cy="72" r="42" fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.7" filter="url(#glow)" />
      <circle cx="110" cy="72" r="48" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
      <circle cx="110" cy="72" r="38" fill="none" stroke="#fef3c7" strokeWidth="0.8" opacity="0.5" />

      {/* Head */}
      <ellipse cx="110" cy="68" rx="22" ry="26" fill="url(#bodyGrad)" />

      {/* Ushnisha (cranial protrusion — sign of enlightenment) */}
      <ellipse cx="110" cy="44" rx="10" ry="8" fill={darkMode ? "#fbbf24" : "#92400e"} opacity="0.9" />

      {/* Third eye dot */}
      <circle cx="110" cy="62" r="2.5" fill="#fbbf24" filter="url(#glow)" />

      {/* Serene closed eyes */}
      <path d="M100 70 Q105 73 110 70 Q105 68 100 70" fill={darkMode ? "#451a03" : "#fef3c7"} />
      <path d="M110 70 Q115 73 120 70 Q115 68 110 70" fill={darkMode ? "#451a03" : "#fef3c7"} />

      {/* Neck */}
      <rect x="104" y="92" width="12" height="12" rx="3" fill="url(#bodyGrad)" />

      {/* Shoulders & torso (meditation pose, draped robe) */}
      <path
        d="M60 115 Q75 104 110 102 Q145 104 160 115 L165 200 Q140 215 110 218 Q80 215 55 200 Z"
        fill="url(#bodyGrad)"
        opacity="0.92"
      />

      {/* Cross-legged base (padmasana) */}
      <ellipse cx="110" cy="220" rx="58" ry="18" fill={darkMode ? "#d97706" : "#78350f"} opacity="0.8" />
      <path
        d="M55 220 Q65 240 110 245 Q155 240 165 220"
        fill={darkMode ? "#b45309" : "#92400e"}
        opacity="0.9"
      />

      {/* Left arm resting */}
      <path
        d="M68 140 Q60 165 58 195 Q70 198 80 192 Q78 168 82 148 Z"
        fill="url(#bodyGrad)"
        opacity="0.85"
      />

      {/* Right arm resting */}
      <path
        d="M152 140 Q160 165 162 195 Q150 198 140 192 Q142 168 138 148 Z"
        fill="url(#bodyGrad)"
        opacity="0.85"
      />

      {/* Hands in dhyana mudra (meditation gesture) */}
      <ellipse cx="110" cy="195" rx="24" ry="10" fill={darkMode ? "#fef3c7" : "#78350f"} opacity="0.9" />
      <ellipse cx="95" cy="197" rx="12" ry="7" fill={darkMode ? "#fef3c7" : "#92400e"} opacity="0.95" />
      <ellipse cx="125" cy="197" rx="12" ry="7" fill={darkMode ? "#fef3c7" : "#92400e"} opacity="0.95" />

      {/* Lotus seat petals */}
      {[-50, -30, -10, 10, 30, 50].map((offset, i) => (
        <ellipse
          key={i}
          cx={110 + offset}
          cy="240"
          rx="14"
          ry="8"
          fill="#fbbf24"
          opacity="0.35"
          transform={`rotate(${offset * 0.3}, ${110 + offset}, 240)`}
        />
      ))}

      {/* Decorative robe lines */}
      <path d="M90 110 Q88 155 85 195" stroke={darkMode ? "#fef3c7" : "#fbbf24"} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M130 110 Q132 155 135 195" stroke={darkMode ? "#fef3c7" : "#fbbf24"} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M100 115 Q99 160 97 195" stroke={darkMode ? "#fef3c7" : "#fbbf24"} strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Small sparkles / divine particles */}
      {[
        [40, 80], [175, 95], [30, 150], [188, 145], [55, 55], [168, 60],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="2" fill="#fbbf24" opacity="0.7" filter="url(#glow)" />
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

// ── Ahimsa Hand Symbol (SVG) ──
function AhimsaHand({ darkMode }: { darkMode: boolean }) {
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="40" cy="40" r="36" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      {/* Stylized hand shape */}
      <path
        d="M40 60 Q28 58 24 48 Q20 38 24 30 Q27 24 32 25 Q33 18 38 18 Q43 18 44 25 Q49 23 52 28 Q56 22 60 26 Q64 30 60 36 Q64 40 62 48 Q58 58 46 60 Z"
        fill={darkMode ? "#fef3c7" : "#92400e"}
        opacity="0.85"
      />
      {/* Dharmachakra wheel in palm */}
      <circle cx="40" cy="42" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="40" cy="42" r="2" fill="#fbbf24" />
      {[0, 45, 90, 135].map((angle, i) => (
        <line
          key={i}
          x1={40 + 3 * Math.cos((angle * Math.PI) / 180)}
          y1={42 + 3 * Math.sin((angle * Math.PI) / 180)}
          x2={40 + 7.5 * Math.cos((angle * Math.PI) / 180)}
          y2={42 + 7.5 * Math.sin((angle * Math.PI) / 180)}
          stroke="#fbbf24"
          strokeWidth="1"
        />
      ))}
      {[0, 45, 90, 135].map((angle, i) => (
        <line
          key={i + 4}
          x1={40 + 3 * Math.cos(((angle + 22.5) * Math.PI) / 180)}
          y1={42 + 3 * Math.sin(((angle + 22.5) * Math.PI) / 180)}
          x2={40 + 7.5 * Math.cos(((angle + 22.5) * Math.PI) / 180)}
          y2={42 + 7.5 * Math.sin(((angle + 22.5) * Math.PI) / 180)}
          stroke="#fbbf24"
          strokeWidth="0.7"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

export default function MahavirJayantiHero({ darkMode }: MahavirJayantiHeroProps) {
  // Jain five sacred flag colors
  const jainColors = [
    { color: "#ffffff", label: "White · Arihant",     textDark: "#1c1917" },
    { color: "#ef4444", label: "Red · Siddha",        textDark: "#1c1917" },
    { color: "#fbbf24", label: "Gold · Acharya",      textDark: "#1c1917" },
    { color: "#22c55e", label: "Green · Upadhyaya",   textDark: "#1c1917" },
    { color: "#60a5fa", label: "Blue · Sadhu",        textDark: "#1c1917" },
    { color: "#f5f5dc", label: "Ivory · Purity",      textDark: "#78350f" },
  ];

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(160deg, #0c0800 0%, #1a0f00 35%, #0d1500 70%, #0c0800 100%)"
          : "linear-gradient(160deg, #fffbeb 0%, #fef3c7 30%, #f0fdf4 70%, #fffbeb 100%)",
      }}
    >
      {/* ── Background noise texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── Decorative geometric mandala-like rings ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: "700px", height: "700px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(251,191,36,0.08)",
          borderRadius: "50%",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: "550px", height: "550px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px dashed rgba(251,191,36,0.12)",
          borderRadius: "50%",
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: "400px", height: "400px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(251,191,36,0.06)",
          borderRadius: "50%",
        }}
      />

      {/* ── Golden glow blobs ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "500px", height: "400px",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0", right: "-100px",
          width: "400px", height: "300px",
          background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0", left: "-100px",
          width: "350px", height: "300px",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-medium mb-6"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))"
            : "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.15))",
          border: "1px solid rgba(251,191,36,0.35)",
          color: darkMode ? "#fbbf24" : "#92400e",
          backdropFilter: "blur(8px)",
        }}
      >
        <AhimsaHand darkMode={darkMode} />
        <span>🇮🇳 Mahavir Jayanti · Ahimsa Paramo Dharma</span>
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl"
        style={{ color: darkMode ? "#fef3c7" : "#1c0a00" }}
      >
        Dress with
        <br />
        Grace &{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #fbbf24 0%, #fef3c7 40%, #f59e0b 70%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
          }}
          className="animate-shimmer"
        >
          INTENTION
        </span>
        <motion.span
          className="inline-block ml-2 text-3xl"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🪷
        </motion.span>
      </motion.h1>

      {/* Jain wisdom quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 text-xs font-semibold tracking-[0.25em] uppercase"
        style={{ color: darkMode ? "#d97706" : "#b45309" }}
      >
        ✦ Parasparopagraho Jīvānām · All life is interdependent ✦
      </motion.p>

      {/* ── Subtext ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-5 max-w-xl text-base leading-relaxed"
        style={{ color: darkMode ? "#d4d4d4" : "#44403c" }}
      >
        Celebrate Lord Mahavir&apos;s birth anniversary with outfits that radiate{" "}
        <strong style={{ color: darkMode ? "#fbbf24" : "#92400e" }}>purity, grace, and divine calm</strong>.
        AI-curated looks for every temple ceremony, prayer gathering & festive occasion.
      </motion.p>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        className="flex flex-col md:flex-row gap-4 mt-10"
      >
        <a
          href="/quiz"
          className="relative px-8 py-3.5 rounded-full font-bold inline-block text-sm tracking-wide transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #fbbf24 50%, #f59e0b 100%)",
            color: "#1c0a00",
            boxShadow: "0 0 30px rgba(251,191,36,0.4), 0 4px 20px rgba(217,119,6,0.3)",
          }}
        >
          <span className="relative z-10">✨ Find Your Celebration Look</span>
          <span
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              opacity: 0.25,
              filter: "blur(12px)",
            }}
          />
        </a>
        <a
          href="/outfit"
          className="px-8 py-3.5 rounded-full font-bold inline-block text-sm tracking-wide transition-all hover:scale-105"
          style={{
            border: "1.5px solid rgba(251,191,36,0.6)",
            color: darkMode ? "#fbbf24" : "#92400e",
            background: darkMode
              ? "rgba(251,191,36,0.06)"
              : "rgba(251,191,36,0.08)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "linear-gradient(135deg, #d97706, #fbbf24)";
            el.style.color = "#1c0a00";
            el.style.borderColor = "transparent";
            el.style.boxShadow = "0 0 20px rgba(251,191,36,0.35)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = darkMode ? "rgba(251,191,36,0.06)" : "rgba(251,191,36,0.08)";
            el.style.color = darkMode ? "#fbbf24" : "#92400e";
            el.style.borderColor = "rgba(251,191,36,0.6)";
            el.style.boxShadow = "none";
          }}
        >
          🌿 Style My Festive Outfit
        </a>
      </motion.div>

      {/* ── Jain five sacred flag colors ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex flex-wrap justify-center gap-2 mt-9"
      >
        {jainColors.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.15 + i * 0.07 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: darkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.7)",
              border: `1px solid ${item.color}55`,
              color: darkMode ? "#d4d4d4" : "#44403c",
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
              style={{ background: item.color }}
            />
            {item.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Floating sacred particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "8%",  top: "20%", delay: 0,   char: "✦", size: "text-xs" },
          { left: "88%", top: "15%", delay: 1.2, char: "🪷", size: "text-sm" },
          { left: "15%", top: "75%", delay: 2,   char: "✦", size: "text-xs" },
          { left: "85%", top: "72%", delay: 0.7, char: "✦", size: "text-xs" },
          { left: "92%", top: "42%", delay: 1.8, char: "🌸", size: "text-xs" },
          { left: "5%",  top: "50%", delay: 2.5, char: "🌿", size: "text-xs" },
        ].map((item, i) => (
          <motion.span
            key={i}
            className={`absolute ${item.size}`}
            style={{
              left: item.left,
              top: item.top,
              color: "#fbbf24",
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [0, -20, 0],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: item.delay,
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </div>

      {/* ── Stats ── */}
      <StatsBar darkMode={darkMode} />

      {/* shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }
      `}</style>
    </section>
  );
}
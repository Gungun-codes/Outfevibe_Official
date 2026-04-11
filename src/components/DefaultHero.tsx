"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DefaultHeroProps {
  darkMode: boolean;
}

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ── Outfit card data ──────────────────────────────────────────────────────────
const OUTFIT_CARDS = [
  {
    id: 1,
    label: "Minimalist Maven",
    items: ["White linen co-ord", "Beige mules", "Gold hoops"],
    palette: ["#F5F0E8", "#D4C5A9", "#C9A96E"],
    emoji: "🤍",
    price: "₹1,200",
  },
  {
    id: 2,
    label: "Streetwear Icon",
    items: ["Oversized tee", "Cargo joggers", "Chunky sneakers"],
    palette: ["#2A2A2A", "#4A4A4A", "#C9A96E"],
    emoji: "🔥",
    price: "₹2,400",
  },
  {
    id: 3,
    label: "Comfort Queen",
    items: ["Floral kurta set", "Block heels", "Jhumkas"],
    palette: ["#E8D5C4", "#C4956A", "#8B4513"],
    emoji: "🌸",
    price: "₹899",
  },
];

const SCAN_LABELS = [
  "Body shape → Pear",
  "Skin tone → Warm Medium",
  "Style vibe → Indo-fusion",
  "Budget → ₹500–₹2000",
  "Occasion → Casual",
];

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ isMobile }: { isMobile: boolean }) {
  const roundDown = (n: number) => Math.floor(n / 10) * 10;
  const BASE_USERS = 600;
  const BASE_QUIZZES = 400;

  const [userCount, setUserCount] = useState(roundDown(BASE_USERS));
  const [quizCount, setQuizCount] = useState(roundDown(BASE_QUIZZES));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [{ count: users }, { count: quizzes }] = await Promise.all([
          supabase.from("users_profile").select("*", { count: "exact", head: true }),
          supabase.from("quiz_result").select("*", { count: "exact", head: true }),
        ]);
        if (users !== null) setUserCount(roundDown((users ?? 0) + BASE_USERS));
        if (quizzes !== null) setQuizCount(roundDown((quizzes ?? 0) + BASE_QUIZZES));
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { num: `${userCount}+`, label: "Users joined", live: true },
    { num: `${quizCount}+`, label: "Quizzes taken", live: true },
    { num: "200+", label: "Styles generated", live: false },
    { num: "Free", label: "No signup needed", live: false },
  ];

  if (isMobile) {
    // 2×2 grid on mobile
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px 12px",
          paddingTop: 24,
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        {stats.map((stat) => (
          <div key={stat.num}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  color: "#C9A96E",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              {stat.live && (
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: loaded ? "#4ADE80" : "#FACC15",
                    border: "1.5px solid rgba(0,0,0,0.3)",
                    flexShrink: 0,
                  }}
                  className={loaded ? "animate-pulse" : ""}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#5A5A5A",
                marginTop: 3,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  // Desktop: horizontal row
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        flexWrap: "wrap",
        paddingTop: 28,
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      {stats.map((stat, i) => (
        <div key={stat.num} style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {i > 0 && (
            <div style={{ width: "0.5px", height: 32, background: "rgba(255,255,255,0.08)" }} />
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <motion.div
                key={stat.num}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  color: "#C9A96E",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {stat.num}
              </motion.div>
              {stat.live && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: loaded ? "#4ADE80" : "#FACC15",
                    border: "2px solid rgba(0,0,0,0.3)",
                    flexShrink: 0,
                  }}
                  className={loaded ? "animate-pulse" : ""}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "#5A5A5A",
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ── Animated scan label ───────────────────────────────────────────────────────
function ScanLabel({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        color: "#C9A96E",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.04em",
      }}
    >
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#C9A96E",
          flexShrink: 0,
        }}
      />
      {text}
    </motion.div>
  );
}

// ── Phone mockup ──────────────────────────────────────────────────────────────
function PhoneMockup({ small = false }: { small?: boolean }) {
  const [scanY, setScanY] = useState(0);
  const W = small ? 170 : 220;
  const H = small ? 300 : 390;

  useEffect(() => {
    const start = Date.now();
    let id: number;
    const tick = () => {
      const t = ((Date.now() - start) % 2400) / 2400;
      setScanY(t * 100);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // Only show 3 scan labels on small
  const labels = small ? SCAN_LABELS.slice(0, 3) : SCAN_LABELS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative", width: W, flexShrink: 0 }}
    >
      <div
        style={{
          width: W,
          height: H,
          background: "#0F0F0F",
          borderRadius: small ? 24 : 32,
          border: "1.5px solid rgba(201,169,110,0.35)",
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(201,169,110,0.08), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,169,110,0.12)",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: small ? 46 : 60,
            height: 5,
            background: "#1A1A1A",
            borderRadius: 3,
            zIndex: 10,
            border: "0.5px solid rgba(201,169,110,0.15)",
          }}
        />

        {/* BG */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #0F0F0F 0%, #141414 40%, #1a1208 100%)",
          }}
        />

        {/* Body silhouette */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <ellipse cx={W / 2} cy={H * 0.56} rx={W * 0.27} ry={H * 0.23} fill="rgba(201,169,110,0.04)" />
          <ellipse cx={W / 2} cy={H * 0.26} rx={W * 0.1} ry={H * 0.065} fill="rgba(201,169,110,0.12)" />
          <path
            d={`M${W*0.4} ${H*0.325} Q${W*0.36} ${H*0.415} ${W*0.327} ${H*0.62}
               Q${W*0.41} ${H*0.64} ${W*0.5} ${H*0.645}
               Q${W*0.59} ${H*0.64} ${W*0.673} ${H*0.62}
               Q${W*0.64} ${H*0.415} ${W*0.6} ${H*0.325}
               Q${W*0.545} ${H*0.343} ${W*0.5} ${H*0.343}
               Q${W*0.455} ${H*0.343} ${W*0.4} ${H*0.325}Z`}
            fill="rgba(201,169,110,0.09)"
          />
          <path
            d={`M${W*0.327} ${H*0.62} Q${W*0.295} ${H*0.8} ${W*0.309} ${H*0.948}
               L${W*0.691} ${H*0.948} Q${W*0.705} ${H*0.8} ${W*0.673} ${H*0.62}Z`}
            fill="rgba(201,169,110,0.06)"
          />
        </svg>

        {/* Scan beam */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,169,110,0.7) 20%, rgba(201,169,110,1) 50%, rgba(201,169,110,0.7) 80%, transparent)",
            boxShadow: "0 0 10px rgba(201,169,110,0.5)",
            pointerEvents: "none",
          }}
        />

        {/* Grid overlay */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * (W / 7)} y1="0" x2={(i + 1) * (W / 7)} y2={H} stroke="#C9A96E" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * (H / 11)} x2={W} y2={(i + 1) * (H / 11)} stroke="#C9A96E" strokeWidth="0.5" />
          ))}
        </svg>

        {/* Corner brackets */}
        {[
          { top: small ? 28 : 40, left: 10 },
          { top: small ? 28 : 40, right: 10 },
          { bottom: small ? 56 : 76, left: 10 },
          { bottom: small ? 56 : 76, right: 10 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{
              position: "absolute",
              width: small ? 10 : 14,
              height: small ? 10 : 14,
              borderColor: "rgba(201,169,110,0.7)",
              borderStyle: "solid",
              borderWidth: 0,
              ...(pos as React.CSSProperties),
              borderTopWidth: "top" in pos ? 1.5 : 0,
              borderBottomWidth: "bottom" in pos ? 1.5 : 0,
              borderLeftWidth: "left" in pos ? 1.5 : 0,
              borderRightWidth: "right" in pos ? 1.5 : 0,
            }}
          />
        ))}

        {/* Scan results panel */}
        <div
          style={{
            position: "absolute",
            bottom: small ? 12 : 20,
            left: small ? 8 : 12,
            right: small ? 8 : 12,
            background: "rgba(0,0,0,0.78)",
            borderRadius: 8,
            padding: small ? "7px 10px" : "10px 12px",
            border: "0.5px solid rgba(201,169,110,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: small ? 3 : 5,
          }}
        >
          {labels.map((label, i) => (
            <ScanLabel key={label} text={label} delay={0.9 + i * 0.15} />
          ))}
        </div>

        {/* Status bar */}
        <div
          style={{
            position: "absolute",
            top: small ? 22 : 28,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              color: "rgba(201,169,110,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI Stylist
          </span>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }}
          />
        </div>
      </div>

      {/* Analysing badge */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: small ? -12 : -16,
          right: small ? -16 : -28,
          background: "#0A0A0A",
          border: "0.5px solid rgba(201,169,110,0.4)",
          borderRadius: 20,
          padding: small ? "5px 10px" : "6px 14px",
          fontSize: small ? 10 : 11,
          color: "#C9A96E",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          ✦
        </motion.span>
        Analysing…
      </motion.div>
    </motion.div>
  );
}

// ── Outfit result card ────────────────────────────────────────────────────────
function OutfitResultCard({
  card,
  delay,
  floatOffset,
  small = false,
}: {
  card: (typeof OUTFIT_CARDS)[number];
  delay: number;
  floatOffset: number;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [floatOffset, floatOffset - 6, floatOffset],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 4 + Math.abs(floatOffset) * 0.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        },
      }}
      style={{
        background: "rgba(18,18,18,0.92)",
        border: "0.5px solid rgba(201,169,110,0.2)",
        borderRadius: small ? 10 : 14,
        padding: small ? "10px 12px" : "14px 16px",
        width: small ? 130 : 164,
        backdropFilter: "blur(12px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: small ? 14 : 18 }}>{card.emoji}</span>
        <div
          style={{
            background: "rgba(201,169,110,0.1)",
            border: "0.5px solid rgba(201,169,110,0.25)",
            borderRadius: 20,
            padding: "2px 7px",
            fontSize: 9,
            color: "#C9A96E",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {card.price}
        </div>
      </div>

      <div
        style={{
          fontSize: small ? 11 : 13,
          fontWeight: 700,
          color: "#F5F0E8",
          fontFamily: "'Playfair Display', serif",
          marginBottom: 6,
        }}
      >
        {card.label}
      </div>

      {card.items.map((item) => (
        <div
          key={item}
          style={{
            fontSize: 9,
            color: "rgba(138,138,138,0.9)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(201,169,110,0.5)", flexShrink: 0 }} />
          {item}
        </div>
      ))}

      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {card.palette.map((color) => (
          <div
            key={color}
            style={{
              width: small ? 10 : 14,
              height: small ? 10 : 14,
              borderRadius: "50%",
              background: color,
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Mobile visual cluster — phone center, two cards flanking ─────────────────
function MobileVisualCluster({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      style={{
        position: "relative",
        width: "100%",
        height: 340,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        marginBottom: 40,
      }}
    >
      {/* Card left */}
      <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-52%)", zIndex: 3 }}>
        <OutfitResultCard card={OUTFIT_CARDS[0]} delay={0.9} floatOffset={0} small />
      </div>

      {/* Phone center */}
      <div style={{ position: "relative", zIndex: 4 }}>
        <PhoneMockup small />
      </div>

      {/* Card right */}
      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-40%)", zIndex: 3 }}>
        <OutfitResultCard card={OUTFIT_CARDS[2]} delay={1.1} floatOffset={8} small />
      </div>

      {/* Platform strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          background: darkMode ? "rgba(12,12,12,0.92)" : "rgba(255,255,255,0.92)",
          border: "0.5px solid rgba(201,169,110,0.18)",
          borderRadius: 10,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          zIndex: 5,
        }}
      >
        <span style={{ fontSize: 9, color: "#5A5A5A", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
          Shops on
        </span>
        {["Myntra", "Meesho", "Ajio", "Amazon IN"].map((brand) => (
          <span
            key={brand}
            style={{
              fontSize: 10,
              color: darkMode ? "#8A8A8A" : "#5A5A5A",
              fontWeight: 500,
              letterSpacing: "0.03em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── DefaultHero ───────────────────────────────────────────────────────────────
export default function DefaultHero({ darkMode }: DefaultHeroProps) {
  const isMobile = useIsMobile();

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (isMobile) return; // skip cursor glow on touch devices
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, isMobile]);

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: 0.08 + i * 0.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <section
      style={{
        background: darkMode ? "#0A0A0A" : "#FAFAF8",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        color: darkMode ? "#F5F0E8" : "#0A0A0A",
      }}
    >
      {/* Cursor glow — desktop only */}
      {!isMobile && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            zIndex: 0,
          }}
        />
      )}

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(201,169,110,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.035) 1px, transparent 1px)",
          backgroundSize: isMobile ? "40px 40px" : "56px 56px",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          width: isMobile ? 400 : 700,
          height: isMobile ? 400 : 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)",
          top: isMobile ? -160 : -280,
          right: isMobile ? -120 : -180,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: isMobile ? 300 : 500,
          height: isMobile ? 300 : 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 65%)",
          bottom: isMobile ? -100 : -200,
          left: isMobile ? -80 : -150,
          pointerEvents: "none",
        }}
      />

      {/* Diagonal accent — desktop only */}
      {!isMobile && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0.06,
          }}
          viewBox="0 0 600 800"
          preserveAspectRatio="none"
        >
          <line x1="600" y1="0" x2="0" y2="800" stroke="#C9A96E" strokeWidth="1" />
          <line x1="550" y1="0" x2="0" y2="700" stroke="#C9A96E" strokeWidth="0.5" />
        </svg>
      )}

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 32px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isMobile ? (
          /* ── MOBILE LAYOUT ── */
          <div style={{ flex: 1, paddingTop: 32, paddingBottom: 60 }}>
            {/* Hook tag */}
            <motion.div {...stagger(0)}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(201,169,110,0.08)",
                  border: "0.5px solid rgba(201,169,110,0.22)",
                  borderRadius: 8,
                  padding: "7px 14px",
                  marginBottom: 20,
                  fontSize: 12,
                  color: "#E8C98A",
                  letterSpacing: "0.02em",
                }}
              >
                <span>✦</span>
                Your mirror lies. Your AI stylist doesn&apos;t.
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...stagger(1)}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 8vw, 48px)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                marginBottom: 16,
                color: darkMode ? "#F5F0E8" : "#0A0A0A",
              }}
            >
              Dress like you{" "}
              <em style={{ color: "#C9A96E", fontStyle: "italic" }}>know</em>
              <br />
              who you are.
            </motion.h1>

            {/* Subline */}
            <motion.p
              {...stagger(2)}
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: darkMode ? "#6E6E6E" : "#6B6560",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Upload a photo — AI reads your body shape, skin tone &amp; vibe, then styles you for{" "}
              <span style={{ color: darkMode ? "#B0A090" : "#7A6E65" }}>
                college, dates, weddings, office
              </span>
              . Real Indian brands. Real you.
            </motion.p>

            {/* Persona chips — scrollable row on mobile */}
            <motion.div
              {...stagger(3)}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 24,
                overflowX: "auto",
                paddingBottom: 4,
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              {["🤍 Maven", "🔥 Streetwear", "🌸 Comfort", "✨ Indo-Fusion", "💼 Power"].map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                    background: "rgba(201,169,110,0.06)",
                    border: "0.5px solid rgba(201,169,110,0.18)",
                    borderRadius: 100,
                    padding: "5px 12px",
                    fontSize: 11,
                    color: "#C4B49A",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip}
                </div>
              ))}
            </motion.div>

            {/* Visual cluster */}
            <MobileVisualCluster darkMode={darkMode} />

            {/* CTAs — stacked on mobile */}
            <motion.div
              {...stagger(4)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 36,
              }}
            >
              <Link
                href="/outfit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#C9A96E",
                  color: "#0A0A0A",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  padding: "16px 28px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✨ Steal the Look
              </Link>

              <Link
                href="/quiz"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "transparent",
                  color: darkMode ? "#F5F0E8" : "#0A0A0A",
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                  padding: "16px 28px",
                  borderRadius: 12,
                  border: darkMode
                    ? "0.5px solid rgba(245,240,232,0.18)"
                    : "0.5px solid rgba(10,10,10,0.2)",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Take Style Quiz →
              </Link>
            </motion.div>

            {/* Stats — 2×2 grid */}
            <StatsBar isMobile />
          </div>
        ) : (
          /* ── DESKTOP LAYOUT ── */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
              flex: 1,
              paddingBottom: 60,
              paddingTop: 40,
            }}
          >
            {/* Left */}
            <div style={{ flex: 1, maxWidth: 560 }}>
              {/* Hook */}
              <motion.div {...stagger(0)}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(201,169,110,0.08)",
                    border: "0.5px solid rgba(201,169,110,0.22)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    marginBottom: 28,
                    fontSize: 13,
                    color: "#E8C98A",
                    letterSpacing: "0.03em",
                  }}
                >
                  <span>✦</span>
                  Your mirror lies. Your AI stylist doesn&apos;t.
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...stagger(1)}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(38px, 5vw, 64px)",
                  lineHeight: 1.08,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  marginBottom: 24,
                  color: darkMode ? "#F5F0E8" : "#0A0A0A",
                }}
              >
                Dress like you{" "}
                <em style={{ color: "#C9A96E", fontStyle: "italic" }}>know</em>
                <br />
                who you are.
              </motion.h1>

              {/* Subline */}
              <motion.p
                {...stagger(2)}
                style={{
                  fontSize: 16,
                  fontWeight: 300,
                  color: darkMode ? "#6E6E6E" : "#6B6560",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                Upload a photo — our AI reads your body shape, skin tone &amp; vibe,
                then styles you for{" "}
                <span style={{ color: darkMode ? "#B0A090" : "#7A6E65" }}>
                  college, dates, weddings, office
                </span>
                . Real Indian brands. Real budget.{" "}
                <span style={{ color: darkMode ? "#B0A090" : "#7A6E65" }}>Real you.</span>
              </motion.p>

              {/* Persona chips */}
              <motion.div
                {...stagger(3)}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
              >
                {[
                  "🤍 Minimalist Maven",
                  "🔥 Streetwear Icon",
                  "🌸 Comfort Queen",
                  "✨ Indo-Fusion",
                  "💼 Power Dresser",
                ].map((chip) => (
                  <div
                    key={chip}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(201,169,110,0.06)",
                      border: "0.5px solid rgba(201,169,110,0.18)",
                      borderRadius: 100,
                      padding: "6px 14px",
                      fontSize: 12,
                      color: "#C4B49A",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {chip}
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                {...stagger(4)}
                style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 52 }}
              >
                <Link
                  href="/outfit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#C9A96E",
                    color: "#0A0A0A",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    padding: "14px 28px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#E8C98A";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#C9A96E";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  ✨ Steal the Look
                </Link>

                <Link
                  href="/quiz"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: darkMode ? "#F5F0E8" : "#0A0A0A",
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: "0.04em",
                    padding: "14px 28px",
                    borderRadius: 10,
                    border: darkMode
                      ? "0.5px solid rgba(245,240,232,0.18)"
                      : "0.5px solid rgba(10,10,10,0.2)",
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.5)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = darkMode
                      ? "rgba(245,240,232,0.18)"
                      : "rgba(10,10,10,0.2)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  Take Style Quiz →
                </Link>
              </motion.div>

              <StatsBar isMobile={false} />
            </div>

            {/* Right: Visual cluster */}
            <div
              style={{
                flexShrink: 0,
                position: "relative",
                width: 420,
                height: 540,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Card top-left */}
              <div style={{ position: "absolute", top: 0, left: -10, zIndex: 3 }}>
                <OutfitResultCard card={OUTFIT_CARDS[0]} delay={1.0} floatOffset={0} />
              </div>

              {/* Phone center */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -52%)",
                  zIndex: 4,
                }}
              >
                <PhoneMockup />
              </div>

              {/* Card bottom-right */}
              <div style={{ position: "absolute", bottom: 10, right: -10, zIndex: 3 }}>
                <OutfitResultCard card={OUTFIT_CARDS[2]} delay={1.3} floatOffset={5} />
              </div>

              {/* Card mid-right peek */}
              <div style={{ position: "absolute", top: "28%", right: -28, zIndex: 2 }}>
                <OutfitResultCard card={OUTFIT_CARDS[1]} delay={1.6} floatOffset={-5} />
              </div>

              {/* Platform strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.6 }}
                style={{
                  position: "absolute",
                  bottom: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: darkMode ? "rgba(12,12,12,0.92)" : "rgba(255,255,255,0.92)",
                  border: "0.5px solid rgba(201,169,110,0.18)",
                  borderRadius: 12,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  whiteSpace: "nowrap",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  zIndex: 5,
                }}
              >
                <span style={{ fontSize: 10, color: "#5A5A5A", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  Shops on
                </span>
                {["Myntra", "Meesho", "Ajio", "Amazon IN"].map((brand) => (
                  <span
                    key={brand}
                    style={{
                      fontSize: 11,
                      color: darkMode ? "#8A8A8A" : "#5A5A5A",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.25,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E" }}>
          Scroll
        </span>
        <div style={{ width: "0.5px", height: 28, background: "linear-gradient(#C9A96E, transparent)" }} />
      </motion.div>

      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
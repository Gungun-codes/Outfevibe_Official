"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureCardProps {
  num: string;
  badge: "live" | "soon" | "later";
  title: string;
  desc: string;
  cta?: { label: string; href: string };
  visual: React.ReactNode;
  stats?: { value: string; label: string }[];
  darkMode: boolean;
  colSpan?: "1" | "2" | "3";
  visualHeight?: number;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ type }: { type: "live" | "soon" | "later" }) {
  if (type === "live")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-green-400/10 text-green-400 border border-green-400/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
        Live now
      </span>
    );
  if (type === "soon")
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/30">
        Coming soon
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-neutral-400/10 text-neutral-400 border border-neutral-400/20">
      After above features
    </span>
  );
}

// ─── Serial number pill ───────────────────────────────────────────────────────
function SerialNum({ num }: { num: string }) {
  return (
    <span
      className="absolute top-4 right-4 font-bold text-[11px] tracking-wide z-10"
      style={{
        fontFamily: "'Syne', sans-serif",
        color: "rgba(201,169,110,0.75)",
        background: "rgba(201,169,110,0.08)",
        border: "0.5px solid rgba(201,169,110,0.25)",
        borderRadius: 6,
        padding: "3px 7px",
        pointerEvents: "none",
      }}
    >
      {num}
    </span>
  );
}

// ─── Visual: AI Styler ────────────────────────────────────────────────────────
function AIStylerVisual({ darkMode }: { darkMode: boolean }) {
  const pills = [
    "Floral kurta · mango skin tone",
    "Pear body · A-line silhouette",
    "Festive · under ₹1,500",
  ];
  return (
    <div className="flex items-center gap-3 px-4 w-full">
      <div
        className="flex-shrink-0 rounded-xl relative overflow-hidden border"
        style={{ width: 48, height: 64, background: "#1e1510", borderColor: "rgba(201,169,110,0.3)" }}
      >
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 18, height: 18, background: "rgba(201,169,110,0.38)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-xl"
          style={{ height: 20, background: "rgba(201,169,110,0.16)" }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {pills.map((p) => (
          <div
            key={p}
            className="h-[20px] rounded-md flex items-center px-2 gap-1.5 text-[9px] border"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 7, color: "#C9A96E", flexShrink: 0 }}>✦</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p}</span>
          </div>
        ))}
      </div>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0 opacity-60">
        <circle cx="16" cy="16" r="15.5" stroke="rgba(201,169,110,0.5)" />
        <path d="M9 16L14 21L23 11" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Visual: Style Quiz ───────────────────────────────────────────────────────
function QuizVisual({ darkMode }: { darkMode: boolean }) {
  const rows = [
    { label: "Minimalist Maven", pct: 82, color: "#C9A96E" },
    { label: "Streetwear Icon", pct: 54, color: "#A78BFA" },
    { label: "Comfort Queen", pct: 38, color: "#4ADE80" },
    { label: "Bold & Festive", pct: 29, color: "#F87171" },
  ];
  return (
    <div className="flex flex-col gap-1.5 px-4 py-2 w-full">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center gap-2 text-[9px]"
          style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
          <span className="flex-shrink-0" style={{ width: 88 }}>{r.label}</span>
          <div
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: 5, background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
          >
            <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
          </div>
          <span className="flex-shrink-0">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Visual: Discover My Fit ──────────────────────────────────────────────────
function DiscoverVisual({ darkMode }: { darkMode: boolean }) {
  const platforms = [
    { label: "AMZ Find", icon: "A", color: "#FF9900", bg: "rgba(255,153,0,0.12)", border: "rgba(255,153,0,0.35)" },
    { label: "MYN Find", icon: "M", color: "#FF3F6C", bg: "rgba(255,63,108,0.12)", border: "rgba(255,63,108,0.35)" },
    { label: "Meesho Find", icon: "Me", color: "#9B51E0", bg: "rgba(155,81,224,0.12)", border: "rgba(155,81,224,0.35)" },
  ];
  const styles = [
    { label: "Korean Look", color: "#60A5FA", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)" },
    { label: "Bollywood", color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)" },
    { label: "Old Money Look", color: "#3a0f0f", bg: "rgba(78, 20, 20, 0.12)", border: "rgba(248,113,113,0.35)" },
  ];
  const filters = [
    { label: "Body shape", color: "#C9A96E", bg: "rgba(201,169,110,0.1)", border: "rgba(201,169,110,0.3)" },
    { label: "Skin tone", color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
    { label: "Budget", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
  ];

  const muted = darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <div className="flex flex-col gap-2 px-3 py-2 w-full">
      {/* Row 1: Platforms */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[8px] font-medium flex-shrink-0" style={{ color: muted, minWidth: 36 }}>Shop on</span>
        {platforms.map((p) => (
          <span
            key={p.label}
            className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0"
            style={{ color: p.color, background: p.bg, borderColor: p.border }}
          >
            <span
              className="w-3 h-3 rounded-full flex items-center justify-center font-bold flex-shrink-0"
              style={{ background: p.color, color: "#fff", fontSize: 6 }}
            >
              {p.icon}
            </span>
            {p.label}
          </span>
        ))}
      </div>
      {/* Row 2: Style vibes */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[8px] font-medium flex-shrink-0" style={{ color: muted, minWidth: 36 }}>Style vibe</span>
        {styles.map((s) => (
          <span
            key={s.label}
            className="text-[9px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0"
            style={{ color: s.color, background: s.bg, borderColor: s.border }}
          >
            {s.label}
          </span>
        ))}
      </div>
      {/* Row 3: Personalised filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[8px] font-medium flex-shrink-0" style={{ color: muted, minWidth: 36 }}>Filters</span>
        {filters.map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0"
            style={{ color: f.color, background: f.bg, borderColor: f.border }}
          >
            <span style={{ fontSize: 7 }}>✦</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Visual: Creator Hub ──────────────────────────────────────────────────────
function CreatorVisual({ darkMode }: { darkMode: boolean }) {
  const bars = [
    { label: "Reach", pct: 70, opacity: 0.5 },
    { label: "Sales", pct: 90, opacity: 1 },
    { label: "Collabs", pct: 55, opacity: 0.3 },
  ];
  return (
    <div className="flex gap-2 px-4 py-2 w-full" style={{ alignItems: "flex-end" }}>
      {bars.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded overflow-hidden"
            style={{ height: 44, background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-full rounded"
              style={{
                height: `${b.pct}%`,
                background: `rgba(201,169,110,${b.opacity})`,
                marginTop: `${100 - b.pct}%`,
              }}
            />
          </div>
          <span className="text-[8px]" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
            {b.label}
          </span>
        </div>
      ))}
      <div className="flex flex-col gap-1.5 ml-2 flex-shrink-0">
        <span className="text-[9px] flex items-center gap-1" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
          <span style={{ color: "#4ADE80" }}>↑</span>38% MoM
        </span>
        <span className="text-[9px]" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
          3 active deals
        </span>
      </div>
    </div>
  );
}

// ─── Visual: Seller ───────────────────────────────────────────────────────────
function SellerVisual({ darkMode }: { darkMode: boolean }) {
  const stats = [
    { value: "1K", label: "Sellers waitlisted" },
    { value: "₹0", label: "Commission at launch" },
    { value: "48hr", label: "Setup to live" },
  ];
  return (
    <div className="flex items-center justify-around px-4 py-2 w-full">
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="text-center">
            <div
              className="font-bold leading-none"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, color: "#C9A96E" }}
            >
              {s.value}
            </div>
            <div
              className="mt-1 text-[8px]"
              style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
            >
              {s.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div
              className="w-px h-7"
              style={{ background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Visual: Wardrobe ─────────────────────────────────────────────────────────
function WardrobeVisual({ darkMode }: { darkMode: boolean }) {
  const colors = [
    "rgba(201,169,110,0.45)",
    "rgba(139,92,246,0.38)",
    "rgba(74,222,128,0.38)",
    "rgba(248,113,113,0.38)",
  ];
  return (
    <div className="grid gap-1.5 px-3 py-2 w-full" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
      {colors.map((c, i) => (
        <div
          key={i}
          className="relative rounded overflow-hidden border"
          style={{
            aspectRatio: "2/3",
            background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 rounded-b" style={{ height: "50%", background: c }} />
        </div>
      ))}
      <div
        className="flex items-center justify-center rounded border"
        style={{
          aspectRatio: "2/3",
          background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          fontSize: 14,
        }}
      >
        +
      </div>
    </div>
  );
}

// ─── Reusable Feature Card ────────────────────────────────────────────────────
function FeatureCard({
  num, badge, title, desc, cta, visual, stats, darkMode, visualHeight = 110,
}: FeatureCardProps) {
  const border = darkMode ? "border-neutral-800" : "border-neutral-200";
  const bg = darkMode ? "bg-neutral-900" : "bg-white";
  const visBg = darkMode ? "bg-neutral-800" : "bg-neutral-100";

  const inner = (
    <div
      className={`relative rounded-[18px] border ${border} ${bg} hover:border-[#C9A96E] overflow-hidden transition-all duration-200 hover:-translate-y-1 h-full flex flex-col`}
    >
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div
            className={`w-full rounded-xl mb-4 overflow-hidden flex items-center justify-center ${visBg}`}
            style={{ height: visualHeight }}
          >
            {visual}
          </div>
          <div className="mb-2"><Badge type={badge} /></div>
          <h3
            className={`font-bold mb-1.5 leading-snug ${darkMode ? "text-white" : "text-black"}`}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}
          >
            {title}
          </h3>
          <p
            className={`text-[12.5px] leading-relaxed ${stats || cta ? "mb-4" : "mb-0"} ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}
          >
            {desc}
          </p>
        </div>
        <div>
          {cta && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full"
              style={{
                color: "#C9A96E",
                border: "0.5px solid rgba(201,169,110,0.4)",
                background: "rgba(201,169,110,0.06)",
              }}
            >
              {cta.label} →
            </span>
          )}
          {stats && (
            <div
              className={`flex gap-4 pt-2.5 mt-2.5 border-t ${darkMode ? "border-neutral-800" : "border-neutral-200"}`}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    className={`font-bold leading-none ${darkMode ? "text-white" : "text-black"}`}
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}
                  >
                    {s.value}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${darkMode ? "text-neutral-500" : "text-neutral-500"}`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <SerialNum num={num} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {cta ? (
        <Link href={cta.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}

// ─── Roadmap Timeline ─────────────────────────────────────────────────────────
function RoadmapTimeline({ darkMode }: { darkMode: boolean }) {
  const steps = [
    { label: "AI Styler", sub: "Live", status: "live" as const },
    { label: "Style Quiz", sub: "Live", status: "live" as const },
    { label: "Discover Fit", sub: "Coming soon", status: "soon" as const },
    { label: "Creator Hub", sub: "Coming soon", status: "soon" as const },
    { label: "Seller Store", sub: "Coming soon", status: "soon" as const },
    { label: "Virtual Wardrobe", sub: "Later", status: "later" as const },
  ];

  const dotStyle = (status: "live" | "soon" | "later"): React.CSSProperties =>
    status === "live"
      ? { background: "#C9A96E", boxShadow: "0 0 0 3px rgba(201,169,110,0.2)" }
      : status === "soon"
      ? { background: "transparent", border: "1.5px solid rgba(139,92,246,0.5)" }
      : { background: "transparent", border: `1.5px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}` };

  const labelColor = (status: "live" | "soon" | "later") =>
    status === "live" ? "#C9A96E" : darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

  return (
    <>
      {/* ── Desktop horizontal timeline ── */}
      <div
        className={`hidden md:flex items-start pt-4 mt-3 border-t ${darkMode ? "border-neutral-800" : "border-neutral-200"}`}
        style={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 4 }}
      >
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start" style={{ flex: i < steps.length - 1 ? 1 : "none" }}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={dotStyle(step.status)} />
              <div className="text-center" style={{ maxWidth: 64 }}>
                <div
                  style={{
                    fontSize: 8.5,
                    lineHeight: 1.3,
                    fontWeight: step.status === "live" ? 500 : 400,
                    color: labelColor(step.status),
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    opacity: 0.65,
                    color: labelColor(step.status),
                  }}
                >
                  {step.sub}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 0.5,
                  marginTop: 5,
                  background:
                    step.status === "live"
                      ? "#C9A96E"
                      : darkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Mobile vertical timeline ── */}
      <div
        className={`md:hidden mt-6 pt-5 border-t ${darkMode ? "border-neutral-800" : "border-neutral-200"}`}
      >
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#C9A96E] mb-4">
          Product Roadmap
        </p>
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3">
              {/* Dot + connector line */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 10 }}>
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ ...dotStyle(step.status), marginTop: 2 }}
                />
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 0.5,
                      flex: 1,
                      minHeight: 22,
                      background:
                        step.status === "live"
                          ? "rgba(201,169,110,0.4)"
                          : darkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.08)",
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <div className="pb-4">
                <span
                  className="text-[13px] font-medium"
                  style={{ color: labelColor(step.status) }}
                >
                  {step.label}
                </span>
                <span
                  className="ml-2 text-[11px]"
                  style={{ color: darkMode ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}
                >
                  {step.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── MAIN EXPORTED SECTION ────────────────────────────────────────────────────
export default function FeaturesSection({ darkMode }: { darkMode: boolean }) {
  const border = darkMode ? "border-neutral-800" : "border-neutral-200";
  const bg = darkMode ? "bg-neutral-900" : "bg-white";
  const visBg = darkMode ? "bg-neutral-800" : "bg-neutral-100";

  return (
    <section
      id="features"
      className={`px-4 md:px-6 py-16 md:py-24 overflow-x-hidden ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#C9A96E] mb-3">
            Platform Features
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`font-extrabold leading-tight mb-4 ${darkMode ? "text-white" : "text-black"}`}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 44px)" }}
          >
            Everything you need to{" "}
            <span style={{ color: "#C9A96E" }}>dress like you mean it.</span>
          </motion.h2>
          <p
            className={`text-[14px] md:text-[15px] max-w-md mx-auto leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}
          >
            Two features live today. Three more on the way. Built for India, powered by AI.
          </p>
        </div>

        {/* ── Responsive grid ──
              Mobile (< sm):  1 column — all cards stack
              Tablet (sm):    2 columns — hero takes both cols
              Desktop (md+):  3 columns — hero takes 2 cols
        ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-3.5">

          {/* 01 — AI Styler (hero: 2 cols on sm+, full on mobile) */}
          <motion.div
            className="col-span-1 sm:col-span-2 md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/outfit"
              className={`relative rounded-[18px] border ${border} ${bg} hover:border-[#C9A96E] overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col`}
              style={{ minHeight: 260, textDecoration: "none" }}
            >
              <div className="p-5 md:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div
                    className={`w-full rounded-xl mb-4 overflow-hidden flex items-center justify-center ${visBg}`}
                    style={{ height: 130 }}
                  >
                    <AIStylerVisual darkMode={darkMode} />
                  </div>
                  <div className="mb-2"><Badge type="live" /></div>
                  <h3
                    className={`font-bold mb-1.5 leading-snug ${darkMode ? "text-white" : "text-black"}`}
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(15px,2.5vw,18px)" }}
                  >
                    AI Styler — Steal the Look
                  </h3>
                  <p className={`text-[13px] leading-relaxed mb-4 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                    Upload your photo. Our AI reads your body shape, skin tone, and occasion — then curates looks from Indian brands you can actually buy.
                  </p>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full"
                    style={{
                      color: "#C9A96E",
                      border: "0.5px solid rgba(201,169,110,0.4)",
                      background: "rgba(201,169,110,0.06)",
                    }}
                  >
                    Try it now →
                  </span>
                  <div
                    className={`flex gap-4 pt-2 border-t ${darkMode ? "border-neutral-800" : "border-neutral-200"}`}
                  >
                    {[
                      { v: "2K+", l: "Styles generated" },
                      { v: "4.8★", l: "Avg rating" },
                      { v: "6 sec", l: "Time to outfit" },
                    ].map((s) => (
                      <div key={s.l}>
                        <div
                          className={`font-bold leading-none ${darkMode ? "text-white" : "text-black"}`}
                          style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}
                        >
                          {s.v}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${darkMode ? "text-neutral-500" : "text-neutral-500"}`}>
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SerialNum num="01" />
            </Link>
          </motion.div>

          {/* 02 — Style Quiz */}
          <FeatureCard
            num="02"
            badge="live"
            title="Style Persona Quiz"
            desc="6 questions. Your outfit feed filtered by who you actually are — not just what's trending."
            cta={{ label: "Take the quiz", href: "/quiz" }}
            visual={<QuizVisual darkMode={darkMode} />}
            darkMode={darkMode}
            visualHeight={110}
          />

          {/* 03 — Discover My Fit */}
          <FeatureCard
            num="03"
            badge="soon"
            title="Discover My Fit"
            desc="Shop Amazon, Myntra & Meesho finds. Filter by Korean looks, Bollywood vibes, body shape, skin tone, and budget — all personalised to you."
            visual={<DiscoverVisual darkMode={darkMode} />}
            darkMode={darkMode}
            visualHeight={116}
          />

          {/* 04 — Creator Hub */}
          <FeatureCard
            num="04"
            badge="soon"
            title="Creator Hub"
            desc="Monetise your style. Brand collabs, affiliate drops, and audience insights in one place."
            visual={<CreatorVisual darkMode={darkMode} />}
            darkMode={darkMode}
            visualHeight={110}
          />

          {/* 05 — Seller Storefront */}
          <FeatureCard
            num="05"
            badge="soon"
            title="Seller Storefront"
            desc="Independent sellers and boutiques — list, style, and sell to India's most style-conscious audience."
            visual={<SellerVisual darkMode={darkMode} />}
            darkMode={darkMode}
            visualHeight={110}
          />

          {/* 06 — Virtual Wardrobe (full width on all breakpoints) */}
          <motion.div
            className="col-span-1 sm:col-span-2 md:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className={`relative rounded-[18px] border ${border} ${bg} hover:border-[#C9A96E] overflow-hidden transition-all duration-200`}
            >
              {/* Stacks vertically on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 md:p-6">
                <div className="flex-1 min-w-0">
                  <div className="mb-2"><Badge type="later" /></div>
                  <h3
                    className={`font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px,2.5vw,20px)" }}
                  >
                    Virtual Wardrobe
                  </h3>
                  <p className={`text-[13px] leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                    Upload your real clothes, get AI outfit pairings, and never ask "what do I wear today?" again. Plan looks for weddings, college, work — months in advance.
                  </p>
                </div>
                {/* Visual: full width on mobile, fixed width on sm+ */}
                <div
                  className={`w-full sm:w-52 md:w-60 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${visBg}`}
                  style={{ height: 72 }}
                >
                  <WardrobeVisual darkMode={darkMode} />
                </div>
              </div>
              <SerialNum num="06" />
            </div>
          </motion.div>

        </div>

        

      </div>
    </section>
  );
}
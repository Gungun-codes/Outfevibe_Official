"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import outfitsData from "../../backend/outfits.json";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HowItWorks from "@/components/HowItWorks";
import { usePWAInstall } from "@/app/hooks/usePWAInstall";
import FestivalHero from "@/components/FestivalHero";
import DefaultHero from "@/components/DefaultHero";
import { StreakBadge } from "@/components/StreakBadge";
import TrendingCarousel from "@/components/TrendingCarousel";
import FeaturesSection from "@/components/FeaturesSection";

function FeedbackForm({ darkMode }: { darkMode: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const { error } = await supabase.from("feedback").insert([{ name: name.trim(), email: email.trim(), message: message.trim() }]);
      if (error) { console.error("Supabase error:", error); setStatus("error"); }
      else { setStatus("success"); setName(""); setEmail(""); setMessage(""); }
    } catch (err) { console.error("Unexpected error:", err); setStatus("error"); }
  };

  const inputClass = `w-full p-3 rounded-lg border text-sm ${darkMode ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400" : "bg-white border-neutral-300 text-black placeholder-neutral-500"}`;

  return (
    <div className="flex flex-col gap-4">
      <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <textarea placeholder="Your Message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          {!name.trim() || !email.trim() || !message.trim() ? "Please fill in all fields." : "Something went wrong. Please try again."}
        </p>
      )}
      {status === "success" && <p className="text-green-400 text-sm text-center">Thank you for your feedback ❤️</p>}
      <button onClick={handleSubmit} disabled={status === "loading"}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
        {status === "loading" ? "Sending..." : "Share Your Thoughts"}
      </button>
    </div>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const testimonials = [
  { image: "/Feedback/feedback_01.jpg", name: "Neha Rajput", location: "Outfevibe User", text: "I absolutely love this app! it has made getting dressed so much fun and honestly helped me rediscover pieces I haven't worn in months. the outfevibe is really fun and it suggests combinations I never would have thought of on my own. It's super easy to use, A must-have for anyone looking to organize their wardrobe." },
  { image: "/Feedback/feedback_02.jpg", name: "Simran Karnwal", location: "Outfevibe User", text: "The website looks really nice and the design is user-friendly. The outfit concept is interesting. overall, it's impressive and has great potential. The layout is clean and easy to understand." },
  { image: "/Feedback/feedback_03.jpg", name: "Kamran Faraz Khan", location: "Outfevibe User", text: "The website demonstrates an excellent level of usability and professionalism. It's intuitive layout and well-structured interface. the content is presented in a clear and coherent manner, enhancing the overall user experience. Additionally, the website operates efficiently with minimal loading time." },
  { image: "/Feedback/feedback_04.jpg", name: "Palak Yadav", location: "Outfevibe User", text: "Your outfit collections are total style explosion-fresh, trendy, and so relatable! The way you curate each look is pure perfection." },
  { image: "/Feedback/feedback_05.jpg", name: "Debasish Mallick", location: "Outfevibe User", text: "love it. website's clean, elegant, super eye-catching. No unnecessary stuff, just what's needed. And the best part... the product actually works." },
];

function NewsletterSignup({ darkMode }: { darkMode: boolean }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail }) });
      if (res.ok) { setStatus("success"); setNewsletterEmail(""); } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="email" placeholder="your@email.com" value={newsletterEmail}
          onChange={(e) => { setNewsletterEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
          disabled={status === "success"}
          className={`flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 transition
            ${darkMode ? "bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500" : "bg-white border border-neutral-300 text-black placeholder-neutral-400"}
            ${status === "success" ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        <button onClick={handleSubscribe} disabled={status === "loading" || status === "success"}
          className="px-6 py-3 bg-[#d4af7f] text-black font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap text-sm">
          {status === "loading" ? "Joining..." : status === "success" ? "You're in ✓" : "Join"}
        </button>
      </div>
      {status === "success" && <p className="text-green-400 text-xs">🎉 Welcome to Outfevibe! Check your inbox for a surprise.</p>}
      {status === "error" && <p className="text-red-400 text-xs">{!newsletterEmail.includes("@") ? "Please enter a valid email." : "Something went wrong. Try again."}</p>}
    </div>
  );
}

function WaitlistForm({ darkMode }: { darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleJoin = async () => {
    if (!email || !email.includes("@")) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const { error } = await supabase.from("feedback").insert([{ name: "Waitlist", email: email.trim(), message: "Joined Virtual Wardrobe waitlist" }]);
      if (error) { console.error("Supabase error:", error); setStatus("error"); }
      else { setStatus("success"); setEmail(""); }
    } catch (err) { console.error("Unexpected error:", err); setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
        <span className="text-yellow-400 text-lg">✓</span>
        <p className="text-sm text-yellow-400 font-medium">You're on the list! We'll notify you at launch.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input type="email" placeholder="your@email.com" value={email}
          onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 transition
            ${darkMode ? "bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500" : "bg-white border border-neutral-300 text-black placeholder-neutral-400"}`}
        />
        <button onClick={handleJoin} disabled={status === "loading"}
          className="px-5 py-2.5 bg-yellow-400 text-black text-sm font-bold rounded-xl hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap">
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </div>
      {status === "error" && <p className="text-red-400 text-xs pl-1">{!email.includes("@") ? "Please enter a valid email." : "Something went wrong. Try again."}</p>}
    </div>
  );
}

function MobileInstallBanner({ install, darkMode }: { install: () => void; darkMode: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 border-t flex items-center justify-between gap-3 ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}>
      <div className="flex items-center gap-3">
        <img src="/outfevibe_logo.png" alt="Outfevibe" className="w-10 h-10 rounded-xl" />
        <div>
          <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-black"}`}>Install Outfevibe</p>
          <p className="text-xs text-neutral-500">Add to home screen for quick access</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setDismissed(true)} className="text-xs text-neutral-500 hover:text-neutral-400 px-2 py-1">Not now</button>
        <button onClick={install} className="px-4 py-2 bg-yellow-400 text-black text-xs font-bold rounded-full hover:bg-yellow-300 transition">Install</button>
      </div>
    </div>
  );
}

// ── Hamburger icon — animates to X when open ──────────────────────────────────
function HamburgerIcon({ darkMode }: { darkMode: boolean }) {
  const color = darkMode ? "#F5F0E8" : "#0A0A0A";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ display: "block" }}>
      <line x1="3" y1="5" x2="15" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="9" x2="15" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({
  open,
  onClose,
  darkMode,
  setDarkMode,
  user,
  userAvatar,
  getUserInitials,
  isInstallable,
  install,
  router,
}: {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  user: any;
  userAvatar: string | null;
  getUserInitials: () => string;
  isInstallable: boolean;
  install: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "Trending", href: "#trending", icon: "🔥" },
    { label: "Features", href: "#features", icon: "✨" },
    { label: "How it works", href: "#how-it-works", icon: "💡" },
    { label: "About", href: "#about", icon: "📖" },
    { label: "Blog", href: "/blog", icon: "✍️" },
    { label: "Feedback", href: "#feedback", icon: "💬" },
  ];

  const handleNavClick = (href: string) => {
    onClose();
    if (href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 320);
    }
  };

  const bg = darkMode ? "#0A0A0A" : "#FAFAF8";
  const text = darkMode ? "#F5F0E8" : "#0A0A0A";
  const muted = darkMode ? "#6E6E6E" : "#8A8A8A";
  const border = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const divider = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const hoverBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "78vw",
              maxWidth: 296,
              zIndex: 101,
              background: bg,
              borderLeft: `0.5px solid ${border}`,
              display: "flex",
              flexDirection: "column",
              fontFamily: "'DM Sans', sans-serif",
              overflowY: "hidden",
            }}
          >
            {/* ── Header ── */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: `0.5px solid ${divider}`,
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/outfevibe_logo.png" alt="Outfevibe" style={{ width: 22, height: 22, borderRadius: 5 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: text, letterSpacing: "0.01em" }}>Outfevibe</span>
              </div>
              <button onClick={onClose} style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `0.5px solid ${border}`,
                background: "transparent", color: muted,
                fontSize: 14, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
              }}>✕</button>
            </div>

            {/* ── Profile strip (logged in only) ── */}
            {user && (
              <button onClick={() => { onClose(); router.push("/profile"); }} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 18px",
                borderBottom: `0.5px solid ${divider}`,
                background: "transparent", cursor: "pointer",
                width: "100%", textAlign: "left", flexShrink: 0,
              }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #C9A96E", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid #C9A96E", background: "linear-gradient(135deg,#C9A96E,#E8C98A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{getUserInitials()}</span>
                    </div>
                  )}
                  <span style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", border: `1.5px solid ${bg}` }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.3 }}>
                    {user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "My Profile"}
                  </div>
                  <div style={{ fontSize: 11, color: "#C9A96E", marginTop: 1 }}>View profile →</div>
                </div>
              </button>
            )}

            {/* ── Nav links ── */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              {navLinks.map((link, i) => {
                const isAnchor = link.href.startsWith("#") || link.href === "/";
                const sharedStyle: React.CSSProperties = {
                  display: "flex", alignItems: "center", gap: 13,
                  width: "100%", padding: "12px 18px",
                  background: "transparent", border: "none",
                  cursor: "pointer", textAlign: "left",
                  borderBottom: i < navLinks.length - 1 ? `0.5px solid ${divider}` : "none",
                  textDecoration: "none",
                };
                const inner = (
                  <>
                    <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }}>{link.icon}</span>
                    <span style={{ fontSize: 14, color: text, fontWeight: 400 }}>{link.label}</span>
                  </>
                );
                return isAnchor ? (
                  <button key={link.label} onClick={() => handleNavClick(link.href)} style={sharedStyle}>{inner}</button>
                ) : (
                  <Link key={link.label} href={link.href} onClick={onClose} style={sharedStyle}>{inner}</Link>
                );
              })}

              {/* ── CTA shortcuts ── */}
              <div style={{ padding: "10px 14px 4px", borderTop: `0.5px solid ${divider}`, marginTop: 4 }}>
                <Link href="/outfit" onClick={onClose} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#C9A96E", color: "#0A0A0A",
                  padding: "11px 14px", borderRadius: 10,
                  textDecoration: "none", marginBottom: 7,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 15 }}>📸</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>Upload your photo</div>
                      <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>AI styles you instantly</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, opacity: 0.7 }}>→</span>
                </Link>

                <Link href="/quiz" onClick={onClose} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "transparent", color: darkMode ? "rgba(245,240,232,0.7)" : "rgba(10,10,10,0.65)",
                  padding: "9px 13px", borderRadius: 8,
                  border: `0.5px solid ${border}`, textDecoration: "none", fontSize: 13,
                }}>
                  <span>✦ Style quiz · 2 min</span>
                  <span style={{ fontSize: 11, opacity: 0.35 }}>→</span>
                </Link>
              </div>
            </nav>

            {/* ── Bottom controls ── */}
            <div style={{
              padding: "12px 14px",
              borderTop: `0.5px solid ${divider}`,
              display: "flex", flexDirection: "column", gap: 8,
              flexShrink: 0,
            }}>
              {/* Dark mode toggle */}
              <button onClick={() => setDarkMode(!darkMode)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 13px", borderRadius: 10,
                border: `0.5px solid ${border}`, background: "transparent",
                cursor: "pointer", width: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 14 }}>{darkMode ? "🌙" : "☀️"}</span>
                  <span style={{ fontSize: 13, color: text }}>{darkMode ? "Dark mode" : "Light mode"}</span>
                </div>
                {/* Toggle pill */}
                <div style={{
                  width: 34, height: 19, borderRadius: 10,
                  background: darkMode ? "#C9A96E" : "rgba(0,0,0,0.12)",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}>
                  <div style={{
                    position: "absolute", top: 2.5,
                    left: darkMode ? 17 : 2.5,
                    width: 14, height: 14, borderRadius: "50%",
                    background: "#fff", transition: "left 0.2s",
                  }} />
                </div>
              </button>

              {/* Install app */}
              {isInstallable && (
                <button onClick={() => { install(); onClose(); }} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 13px", borderRadius: 10,
                  border: `0.5px solid rgba(201,169,110,0.3)`,
                  background: "rgba(201,169,110,0.06)",
                  cursor: "pointer", width: "100%",
                }}>
                  <span style={{ fontSize: 14 }}>📲</span>
                  <span style={{ fontSize: 13, color: "#C9A96E", fontWeight: 500 }}>Install app</span>
                </button>
              )}

              {/* Login / go to profile */}
              {!user ? (
                <button onClick={() => { onClose(); router.push("/login"); }} style={{
                  padding: "11px 13px", borderRadius: 10,
                  background: darkMode ? "#F5F0E8" : "#0A0A0A",
                  color: darkMode ? "#0A0A0A" : "#F5F0E8",
                  border: "none", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", width: "100%",
                }}>Login</button>
              ) : (
                <button onClick={() => { onClose(); router.push("/profile"); }} style={{
                  padding: "11px 13px", borderRadius: 10,
                  background: "transparent", color: muted,
                  border: `0.5px solid ${border}`,
                  fontSize: 13, cursor: "pointer", width: "100%",
                }}>Go to profile →</button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"general" | "festive" | "forYou">("general");
  const [activeGender, setActiveGender] = useState<"women" | "men">("women");
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const { isInstallable, install } = usePWAInstall();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [trendingIndex, setTrendingIndex] = useState(0);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => setActiveIndex((prev) => (prev + 1) % testimonials.length), 2500);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isPaused, activeIndex]);

  const goTo = (index: number) => setActiveIndex((index + testimonials.length) % testimonials.length);
  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent, startX: number) => {
    const endX = "touches" in e ? (e as React.TouchEvent).changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) { if (diff > 0) goTo(activeIndex + 1); else goTo(activeIndex - 1); }
  };

  const trendingList = useMemo(() => {
    const categoryMap: any = { general: "general_trending", festive: "holi_trending", forYou: "persona_trending" };
    const genderMap: any = { men: "male", women: "female" };
    return outfitsData.filter((item: any) => item.categories?.includes(categoryMap[activeCategory]) && item.gender === genderMap[activeGender]).slice(0, 4);
  }, [activeCategory, activeGender]);

  const getUserInitials = () => {
    const name = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "U";
    return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  };
  const userAvatar = user?.user_metadata?.avatar_url || null;

  const defaultHero = <DefaultHero darkMode={darkMode} />;

  return (
    <div>
      {/* ── NAVBAR ── */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b border-neutral-800/40 ${darkMode ? "bg-black" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <img src="/outfevibe_logo.png" alt="Outfevibe Logo" className="h-6 w-6" />
            <span className={darkMode ? "text-white" : "text-black"}>Outfevibe</span>
          </div>

          {/* Desktop nav links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm ${darkMode ? "text-neutral-300" : "text-neutral-700"}`}>
            <a href="#about" className="hover:text-yellow-400 transition">About</a>
            <a href="#trending" className="hover:text-yellow-400 transition">Trending</a>
            <a href="#features" className="hover:text-yellow-400 transition">Features</a>
            <a href="#feedback" className="hover:text-yellow-400 transition">Feedback</a>
          </nav>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-4">
            {isInstallable && (
              <button onClick={install} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition ${darkMode ? "border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black" : "border-yellow-500/50 text-yellow-600 hover:bg-yellow-400 hover:text-black"}`}>
                📲 Install App
              </button>
            )}
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-700 hover:border-yellow-400 transition" onClick={() => setDarkMode(!darkMode)}>☀️</button>
            {authLoading ? (
              <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse" />
            ) : user ? (
              <button onClick={() => router.push("/profile")} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-400 hover:border-yellow-300 transition flex items-center justify-center" title="Go to Profile">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-black text-xs font-bold">{getUserInitials()}</span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
              </button>
            ) : (
              <button onClick={() => router.push("/login")} className={`px-6 py-2.5 rounded-full font-semibold transition ${darkMode ? "bg-white text-black hover:bg-[#d4af7f]" : "bg-black text-white hover:bg-neutral-800"}`}>Login</button>
            )}
          </div>

          {/* Mobile right — profile/login + dark mode + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Profile / Login — visible on mobile too */}
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => router.push("/profile")}
                className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-400 flex items-center justify-center"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-black text-xs font-bold">{getUserInitials()}</span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-black" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}
              >
                Login
              </button>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-700 hover:border-yellow-400 transition text-sm"
            >
              ☀️
            </button>

            <button
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Open navigation menu"
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition ${darkMode ? "border-neutral-700 hover:border-yellow-400/50" : "border-neutral-300 hover:border-yellow-500/50"}`}
            >
              <HamburgerIcon darkMode={darkMode} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered outside header so it overlays full page */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        userAvatar={userAvatar}
        getUserInitials={getUserInitials}
        isInstallable={isInstallable}
        install={install}
        router={router}
      />

      {/* FESTIVAL / DEFAULT HERO */}
      {session && <StreakBadge userId={session.user.id} />}
      <FestivalHero darkMode={darkMode} defaultHero={defaultHero} />

      {/* TRENDING */}
      <section id="trending" className={`px-6 py-20 overflow-x-hidden ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn} className={`text-4xl md:text-5xl font-extrabold text-center ${darkMode ? "text-white" : "text-black"}`}>Trending Outfits</motion.h2>
        <p className={`text-center mt-3 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>Stay ahead of the curve. Curated fits that define the moment.</p>
        {user && (
          <div className="flex justify-center mt-4">
            <StreakBadge userId={user.id} />
          </div>
        )}
        <div className="flex justify-center mt-6">
          <div className={`flex flex-wrap items-center gap-2 px-2 py-2 rounded-full border ${darkMode ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-white"} shadow-sm`}>
            {(["general", "festive", "forYou"] as const).map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setTrendingIndex(0); }}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${activeCategory === cat ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : darkMode ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-100"}`}>
                {cat === "general" ? "🔥 General" : cat === "festive" ? "✨ Festive" : "🫶 For You"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <div className={`flex items-center p-1 rounded-full ${darkMode ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-100 border border-neutral-200"}`}>
            {(["women", "men"] as const).map((g) => (
              <button key={g} onClick={() => { setActiveGender(g); setTrendingIndex(0); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeGender === g ? "bg-neutral-800 text-white" : darkMode ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-white"}`}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <TrendingCarousel
          cards={trendingList}
          darkMode={darkMode}
          activeIndex={trendingIndex}
          setActiveIndex={setTrendingIndex}
        />
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks darkMode={darkMode} />

      {/* FEATURES */}
      <section id="features" className={`px-6 py-24 overflow-x-hidden ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <FeaturesSection darkMode={darkMode} />
      </section>

      {/* ABOUT */}
      <section id="about" className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold">About Outfevibe</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className={`mt-8 text-lg leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Outfevibe is a smart fashion platform that helps you discover outfits that truly match your style. Instead of spending hours deciding what to wear, you can upload your photo and get outfit ideas based on your body type, skin tone, and the occasion. Our goal is to make styling simple, fun, and accessible for everyone. With Outfevibe, finding the right outfit becomes faster, easier, and more confident.
          </motion.p>
        </div>
      </section>

      {/* WHY OUTFEVIBE */}
      <section className={`px-6 py-24 ${darkMode ? "bg-[#0a0a0a] text-white" : "bg-neutral-50 text-black"}`}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-yellow-400 mb-4">Made for you. Made for India.</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Style that knows{" "}
              <span className="text-yellow-400">who you are.</span>
            </h2>
            <p className={`mt-4 max-w-xl mx-auto text-lg ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
              Outfevibe goes beyond trends. It understands your body, your skin, your budget, and your culture — then dresses you for it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🧬", title: "Body shape analysis", desc: "Classifies your body type — hourglass, pear, apple, rectangle — and recommends cuts and silhouettes that actually flatter you.", tag: "AI-powered" },
              { icon: "🎨", title: "Skin tone matching", desc: "Detects your skin tone and maps it to colours, fabrics, and palettes that complement your complexion — not just what's trending.", tag: "AI-powered" },
              { icon: "🇮🇳", title: "India-first occasions", desc: "Eid, Diwali, weddings, college fests, mehendi — we understand Indian occasions and dress you for them, not generic Western events.", tag: "Unique to us" },
              { icon: "🎯", title: "Style persona quiz", desc: "6 questions. 1 persona. Minimalist Maven, Streetwear Icon, Comfort Queen — your outfit feed is filtered entirely by who you are.", tag: "Unique to us" },
              { icon: "🛍️", title: "Indian affiliate links", desc: "Every recommendation links to Meesho, Ajio, Myntra, Flipkart, and Amazon India — not US stores that don't ship here.", tag: "India-first" },
              { icon: "💰", title: "Budget-aware styling", desc: "Low, medium, or high — your budget is a first-class filter, not an afterthought. Outfevibe never recommends what you can't afford.", tag: "Practical" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-6 rounded-2xl border ${darkMode ? "bg-neutral-900 border-neutral-800 hover:border-yellow-400/40" : "bg-white border-neutral-200 hover:border-yellow-400/60"} transition group`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${item.tag === "AI-powered" ? "text-purple-400 border-purple-400/30 bg-purple-400/10"
                    : item.tag === "Unique to us" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                      : item.tag === "India-first" ? "text-green-400 border-green-400/30 bg-green-400/10"
                        : "text-blue-400 border-blue-400/30 bg-blue-400/10"
                    }`}>{item.tag}</span>
                </div>
                <h3 className={`text-base font-bold mb-2 group-hover:text-yellow-400 transition ${darkMode ? "text-white" : "text-black"}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
            className={`mt-6 p-5 rounded-2xl border border-dashed ${darkMode ? "border-neutral-700 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"} text-center`}>
            <p className={`text-sm ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}>
              <span className="text-yellow-400 font-semibold">Coming soon —</span>{" "}
              Virtual Wardrobe · Tailor connect · Rent &amp; donate · Sell unused clothes · Budget tracker
            </p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`px-6 py-20 text-center overflow-hidden ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl font-bold mb-12">What Users <span className="text-yellow-400">Say</span></motion.h2>
        {!mounted ? null : (
          <div className="max-w-2xl mx-auto">
            <div className="relative select-none cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
              onMouseDown={(e) => setDragStartX(e.clientX)}
              onMouseUp={(e) => { if (dragStartX !== null) { handleDragEnd(e, dragStartX); setDragStartX(null); } }}
              onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => { if (dragStartX !== null) { handleDragEnd(e, dragStartX); setDragStartX(null); } }}>
              <motion.div key={activeIndex} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: "easeOut" }}
                className={`${darkMode ? "bg-neutral-900" : "bg-neutral-100"} p-10 rounded-2xl shadow-lg`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-yellow-400">
                    <img src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-base ${darkMode ? "text-white" : "text-black"}`}>{testimonials[activeIndex].name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{testimonials[activeIndex].location}</p>
                  </div>
                </div>
                <p className={`italic text-base leading-relaxed ${darkMode ? "text-neutral-300" : "text-neutral-700"}`}>{testimonials[activeIndex].text}</p>
              </motion.div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              <button onClick={() => goTo(activeIndex - 1)} className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${darkMode ? "border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400" : "border-neutral-300 text-neutral-600 hover:border-yellow-500 hover:text-yellow-500"}`}>‹</button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 h-2 bg-yellow-400" : `w-2 h-2 ${darkMode ? "bg-neutral-700" : "bg-neutral-300"} hover:bg-yellow-400/50`}`} />
                ))}
              </div>
              <button onClick={() => goTo(activeIndex + 1)} className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${darkMode ? "border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400" : "border-neutral-300 text-neutral-600 hover:border-yellow-500 hover:text-yellow-500"}`}>›</button>
            </div>
          </div>
        )}
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className={`px-6 py-20 w-full ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="max-w-xl mx-auto">
          <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-black"}`}>Submit Feedback</motion.h2>
          <FeedbackForm darkMode={darkMode} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t px-6 py-16 ${darkMode ? "bg-black text-white border-neutral-800" : "bg-white text-black border-neutral-200"}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-wide">OUTFEVIBE</h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-4 text-sm leading-relaxed`}>AI-powered styling that understands identity. Not just clothes.</p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/outfevibe?igsh=MXFwZmZpczVsbHj0dg==" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>IG</a>
              <a href="https://www.linkedin.com/in/outfevibe-offical-14903a3a9" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>LN</a>
              <a href="https://youtube.com/@outfevibe?si=WFslmfGzuiLvrR16" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>YT</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <li><Link href="/outfit" className="hover:text-yellow-400 transition">AI Outfit Suggestions</Link></li>
              <li className="cursor-default">Virtual Wardrobe</li>
              <li><Link href="/quiz" className="hover:text-yellow-400 transition">Style Quiz</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <li><Link href="/about" className="hover:text-yellow-400 transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-yellow-400 transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>Weekly style drops, straight to your inbox.</p>
            <NewsletterSignup darkMode={darkMode} />
          </div>
        </div>
        <div className={`border-t mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${darkMode ? "border-neutral-800 text-gray-500" : "border-neutral-200 text-gray-600"}`}>
          <p>© {new Date().getFullYear()} Outfevibe. Built with intention.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-yellow-400 transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-yellow-400 transition">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {isInstallable && <MobileInstallBanner install={install} darkMode={darkMode} />}
    </div>
  );
}
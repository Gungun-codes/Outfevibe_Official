"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import UserDropdown from "@/components/UserDropdown";

type FestiveOutfit = {
  id: number;
  title: string;
  gender: "male" | "female";
  occasion: string[];
  mood: string[];
  budget: string[];
  categories: string[];
  image: string;
  affiliateLink: string;
};
import FallingColors from "@/components/FallingColors";
import { motion } from "framer-motion";
import { Sparkles, Upload, ArrowRight, Zap, Target, BarChart3, Menu, X } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("female");
  const [trendingTab, setTrendingTab] = useState<"general" | "persona" | "festive">("general");
  const [userPersona, setUserPersona] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [festiveOutfits, setFestiveOutfits] = useState<FestiveOutfit[]>([]);
  const [festiveGender, setFestiveGender] = useState<"male" | "female">("female");

  const router = useRouter();

  // Load user persona from Supabase (or localStorage fallback)
  useEffect(() => {
    const loadPersona = async () => {
      if (user && user.email) {
        const { data, error } = await supabase
          .from("quiz_result")
          .select("persona_name")
          .eq("email", user.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data && data.persona_name) {
          setUserPersona(data.persona_name);
          localStorage.setItem("userPersona", data.persona_name);
          setTrendingTab("persona");
        } else {
          setUserPersona(null);
        }
      } else {
        const storedPersona = localStorage.getItem("userPersona");
        if (storedPersona) {
          setUserPersona(storedPersona);
          setTrendingTab("persona");
        }
      }
    };
    loadPersona();
  }, [user]);

  // Load festive outfits from API
  useEffect(() => {
    async function loadFestive() {
      try {
        const res = await fetch("/api/outfits");
        const data: FestiveOutfit[] = await res.json();
        const holi = data.filter((item) =>
          item.categories?.includes("holi_trending")
        );
        setFestiveOutfits(holi);
      } catch (err) {
        console.error("Failed to load festive outfits:", err);
      }
    }
    loadFestive();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !message) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      setLoading(true);
      const insertData: any = {
        message: `Name: ${name}\n\nMessage: ${message}`,
        created_at: new Date().toISOString(),
      };
      if (user) {
        insertData.user_id = user.id;
      }

      const { error } = await supabase
        .from("feedback")
        .insert(insertData);

      if (error) throw error;

      alert("Feedback submitted successfully!");
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error adding feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TRENDING DATA ================= */

  const trending_general = {
    female: [
      { id: 1, name: "Power Luxe", desc: "Minimal yet bold.", image: "/outfits/party_02.jpg", affiliateLink: "https://amzn.to/4tXDZE7" },
      { id: 2, name: "Regal Grace", desc: "Timeless elegance with commanding Aura.", image: "/outfits/wedding_04.jpg", affiliateLink: "https://amzn.to/4kYhjjc" },
      { id: 3, name: "Blush Breeze", desc: "Confident & structured.", image: "/outfits/college_01.jpg", affiliateLink: "https://amzn.to/4aBPTfp" },
      { id: 4, name: "Velvet Poise", desc: "Sharp night aesthetic.", image: "/outfits/college_03.jpg", affiliateLink: "https://amzn.to/4sc36S2" },
    ],
    male: [
      { id: 1, name: "Gentlemen's Reserve", desc: "Classic tailoring with quiet Luxury.", image: "/outfits/party_13.jpg", affiliateLink: "https://myntr.it/2guT947" },
      { id: 2, name: "Urban Drift", desc: "Relaxed street style with everyday edge.", image: "/outfits/party_13.jpg", affiliateLink: "https://amzn.to/4kWWOys" },
      { id: 3, name: "Midnight Minimal", desc: "Sharp layers with understated edge.", image: "/outfits/wedding_09.jpg", affiliateLink: "https://amzn.to/40wa0pn" },
      { id: 4, name: "Modern Gent", desc: "Relaxed premium.", image: "/outfits/date_10.jpg", affiliateLink: "https://amzn.to/4rFgMVT" },
    ],
  };

  const trending_persona: Record<string, { id: number; name: string; desc: string; image: string; affiliateLink: string }[]> = {
    "Minimalist Maven": [],
    "Edgy Trendsetter": [],
    "Romantic Softie": [],
    "Playful Creative": [],
    "Comfort Queen": [],
    "Minimalist King": [],
    "Streetwear Icon": [],
    "Modern Gentleman": [],
    "Casual Cool": [],
    "Athleisure Pro": [],
  };

  return (
    <main className="min-h-screen font-sans">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Left - Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Image src="/outfevibe_logo.png" alt="Outfevibe Logo" width={32} height={32} className="object-contain" />
            <span className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Outfevibe
            </span>
          </div>

          {/* CENTER - NAV LINKS (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-purple-600 transition-colors duration-300">
              About
            </a>
            <a href="#trend" className="hover:text-purple-600 transition-colors duration-300">
              Trend
            </a>
            <a href="#feature" className="hover:text-purple-600 transition-colors duration-300">
              Feature
            </a>
            <a href="#feedback" className="hover:text-purple-600 transition-colors duration-300">
              Feedback
            </a>
          </nav>

          {/* RIGHT - Login / User + Mobile Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserDropdown user={user} logout={logout} />
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Login
              </button>
            )}
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/50 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-white/30 px-6 py-4 flex flex-col gap-3"
          >
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 hover:text-purple-600 transition">About</a>
            <a href="#trend" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 hover:text-purple-600 transition">Trend</a>
            <a href="#feature" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 hover:text-purple-600 transition">Feature</a>
            <a href="#feedback" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 hover:text-purple-600 transition">Feedback</a>
          </motion.div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="holi-bg pt-28 pb-24 px-6 relative">
        <FallingColors />

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10">

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-lg text-sm font-medium text-slate-700">
              <Sparkles size={16} className="text-purple-500" />
              AI-Powered Styling Platform
            </span>
          </motion.div>

          {/* Hero Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="text-slate-800">Curate Your</span>
            <br />
            <span className="gradient-text-holi">Festival Aesthetic</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mb-3"
          >
            Discover outfits curated for your vibe.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-slate-400 text-base md:text-lg max-w-xl mb-10"
          >
            Upload your photo, let our AI analyze your style, and
            get personalized Holi outfit recommendations instantly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-12"
          >
            {/* Let's Style */}
            <button
              onClick={() => router.push("/quiz")}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={18} />
                Let&apos;s Style
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>

            {/* Personalized Fit */}
            <button
              onClick={() => router.push("/outfit")}
              className="group relative px-10 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                Personalized Fit
                <ArrowRight size={20} className="inline-block group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>

          {/* Stat Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <span className="pill-glow-red inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-sm font-semibold">
              <BarChart3 size={14} />
              50K+ Styles Analyzed
            </span>
            <span className="pill-glow-purple inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-50/80 backdrop-blur-sm border border-purple-200/50 text-purple-600 text-sm font-semibold">
              <Target size={14} />
              98% Match Accuracy
            </span>
            <span className="pill-glow-green inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50/80 backdrop-blur-sm border border-green-200/50 text-green-600 text-sm font-semibold">
              <Zap size={14} />
              Instant Results
            </span>
          </motion.div>
        </div>
      </section>

      {/* ================= TRENDING OUTFITS ================= */}
      <section id="trend" className="py-24 bg-gradient-to-b from-white to-slate-50 text-slate-900 relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-[-100px] left-1/4 w-[400px] h-[400px] bg-purple-300/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-50px] right-1/4 w-[300px] h-[300px] bg-pink-300/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Trending <span className="gradient-text-holi">Outfits</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Stay ahead of the curve. Curated fits that define the moment.
            </p>
          </div>

          {/* Tab Switcher: General / Festive / For You */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setTrendingTab("general")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${trendingTab === "general"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                🔥 General
              </button>
              <button
                onClick={() => setTrendingTab("festive")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${trendingTab === "festive"
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                🎉 Festive
              </button>
              <button
                onClick={() => setTrendingTab("persona")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${trendingTab === "persona"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                ✨ For You
              </button>
            </div>
          </div>

          {/* GENERAL TAB */}
          {trendingTab === "general" && (
            <>
              {/* Gender Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => setSelectedGender("female")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedGender === "female"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Women
                  </button>
                  <button
                    onClick={() => setSelectedGender("male")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedGender === "male"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Men
                  </button>
                </div>
              </div>

              {/* General Cards Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trending_general[selectedGender].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:border-purple-300 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
                  >
                    {/* Image container */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-semibold text-lg text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>

                      <a
                        href={item.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-purple-500 text-sm font-medium hover:gap-2.5 transition-all duration-300"
                      >
                        Explore Look
                        <span className="text-xs">→</span>
                      </a>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* PERSONA TAB */}
          {trendingTab === "persona" && (
            <>
              {userPersona && trending_persona[userPersona] ? (
                <>
                  {/* Persona badge */}
                  <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200/50 text-sm">
                      <span className="text-purple-500">✨</span>
                      <span className="text-slate-500">Curated for</span>
                      <span className="text-purple-600 font-semibold">{userPersona}</span>
                    </span>
                  </div>

                  {/* Persona Cards Grid */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {trending_persona[userPersona].map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:border-purple-300 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="p-6 space-y-2">
                          <h3 className="font-semibold text-lg text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-500">{item.desc}</p>

                          <a
                            href={item.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-purple-500 text-sm font-medium hover:gap-2.5 transition-all duration-300"
                          >
                            Explore Look
                            <span className="text-xs">→</span>
                          </a>
                        </div>

                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* No persona CTA */
                <div className="text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex flex-col items-center gap-4 p-10 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm max-w-md shadow-xl"
                  >
                    <span className="text-5xl">🎯</span>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Discover your <span className="gradient-text-holi">Style Persona</span>
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Take our 6-question style quiz to unlock personalized trending looks curated just for you.
                    </p>
                    <button
                      onClick={() => router.push("/quiz")}
                      className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                      Take the Quiz →
                    </button>
                  </motion.div>
                </div>
              )}
            </>
          )}

          {/* FESTIVE TAB */}
          {trendingTab === "festive" && (
            <>
              {/* Festive badge */}
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200/50 text-sm">
                  <span className="text-orange-500">🎨</span>
                  <span className="text-slate-500">Holi Special Collection</span>
                </span>
              </div>

              {/* Gender Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => setFestiveGender("female")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${festiveGender === "female"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Women
                  </button>
                  <button
                    onClick={() => setFestiveGender("male")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${festiveGender === "male"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Men
                  </button>
                </div>
              </div>

              {/* Festive Cards Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {festiveOutfits
                  .filter((item) => item.gender === festiveGender)
                  .map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:border-orange-300 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:-translate-y-1"
                    >
                      {/* Image container */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-semibold text-sm text-slate-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {item.mood.map((m) => (
                            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100 capitalize">
                              {m}
                            </span>
                          ))}
                          {item.budget.map((b) => (
                            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-500 border border-green-100 capitalize">
                              {b}
                            </span>
                          ))}
                        </div>

                        <a
                          href={item.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-orange-500 text-sm font-medium hover:gap-2.5 transition-all duration-300"
                        >
                          Explore Look
                          <span className="text-xs">→</span>
                        </a>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
                    </motion.div>
                  ))}
              </div>
            </>
          )}

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="py-28 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-20 text-slate-800">
            How It <span className="gradient-text-holi">Works</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-10 relative">

            {/* CONNECTING LINE */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-40" />

            {[
              {
                number: "01",
                title: "Upload",
                desc: "Upload a clothing piece or start fresh.",
                gradient: "from-pink-500 to-rose-400"
              },
              {
                number: "02",
                title: "Select Context",
                desc: "Choose mood, occasion & color.",
                gradient: "from-purple-500 to-violet-400"
              },
              {
                number: "03",
                title: "Style Engine",
                desc: "Our AI matches pieces intelligently.",
                gradient: "from-blue-500 to-cyan-400"
              },
              {
                number: "04",
                title: "Get Look",
                desc: "Receive powerful outfit combinations.",
                gradient: "from-green-500 to-emerald-400"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group p-10 rounded-2xl border border-slate-100 bg-white hover:border-purple-200 transition duration-300 overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Big Background Number */}
                <span className={`absolute -top-4 -left-2 text-[72px] font-bold bg-gradient-to-b ${step.gradient} bg-clip-text text-transparent opacity-15 transition-all duration-300 group-hover:opacity-30 pointer-events-none select-none`}>
                  {step.number}
                </span>

                <h3 className="text-xl font-semibold mb-3 mt-8 text-slate-800">
                  {step.title}
                </h3>

                <p className="text-slate-500 text-sm">
                  {step.desc}
                </p>

              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="feature" className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">
            Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* AI Outfit Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => router.push("/outfit")}
              className="cursor-pointer border border-slate-200/60 bg-white/90 backdrop-blur-sm p-8 rounded-2xl hover:border-purple-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] transition group"
            >
              <div className="mb-6">
                <img
                  src="/features/ai-suggest.png"
                  alt="AI Outfit Suggestion"
                  className="w-16 h-16 object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-slate-800 group-hover:text-purple-600 transition">
                AI Outfit Suggestions
              </h3>

              <p className="text-slate-500 text-sm">
                Get personalized outfit recommendations based on your personality,
                occasion, and style preferences.
              </p>
            </motion.div>

            {/* Virtual Wardrobe */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border border-slate-200/60 bg-white/90 backdrop-blur-sm p-8 rounded-2xl opacity-80 cursor-not-allowed hover:shadow-[0_8px_30px_rgba(236,72,153,0.1)] transition"
            >
              <div className="mb-6">
                <img
                  src="/features/wardrobe.png"
                  alt="Virtual Wardrobe"
                  className="w-16 h-16 object-contain"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Virtual Wardrobe
              </h3>

              <p className="text-slate-500 text-sm mb-4">
                Organize and manage your wardrobe digitally. Mix, match, and plan
                your outfits effortlessly.
              </p>

              <span className="inline-block text-xs px-3 py-1 border border-purple-200 rounded-full text-purple-500 bg-purple-50">
                Coming Soon
              </span>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="py-28 px-6 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-8 text-slate-800">
            About <span className="gradient-text-holi">Outfevibe</span>
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mx-auto">
            Outfevibe is built for individuals who want confidence without confusion.
            We style what you already own and transform your wardrobe into a system of
            powerful expression. Fashion is not gender. It is identity. It is presence.
          </p>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-28 px-6 border-t border-slate-100 bg-white text-slate-900">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-slate-800">
            What Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally a styling system that understands identity. Not just clothes.",
                author: "Early User",
                gradient: "from-pink-500/10"
              },
              {
                quote: "It feels like the app actually understands my vibe. The personality result was scary accurate.",
                author: "Beta Tester",
                gradient: "from-purple-500/10"
              },
              {
                quote: "I shared my personality result with friends — now they're all using Outfevibe too.",
                author: "College User",
                gradient: "from-blue-500/10"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative border border-slate-200/60 bg-white p-8 rounded-2xl hover:border-purple-200 transition duration-300 group shadow-sm hover:shadow-lg"
              >
                <div className="gradient-text-holi text-3xl mb-4">❝</div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {testimonial.quote}
                </p>

                <span className="text-xs text-purple-500 tracking-wide font-medium">
                  — {testimonial.author}
                </span>

                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br ${testimonial.gradient} via-transparent to-transparent`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK ================= */}
      <section id="feedback" className="py-28 px-6 bg-gradient-to-b from-slate-50 to-white text-slate-900 border-t border-slate-100 relative overflow-hidden">

        {/* subtle glow background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300/10 blur-[100px] rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-800">
            Your Voice <span className="gradient-text-holi">Matters</span>
          </h2>

          <p className="text-center text-slate-500 mb-16 max-w-xl mx-auto">
            Help us shape the future of Outfevibe. Your feedback fuels the revolution.
          </p>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl">

            {/* Name */}
            <div className="mb-8">
              <label className="block text-sm mb-2 text-slate-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-400 outline-none transition text-slate-800"
              />
            </div>

            {/* Message */}
            <div className="mb-10">
              <label className="block text-sm mb-2 text-slate-500">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-400 outline-none transition resize-none text-slate-800"
              />
            </div>

            {/* Button */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold tracking-wide hover:opacity-90 transition shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-100 bg-white text-slate-800 px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold tracking-wide">
              <span className="gradient-text-holi">OUTFEVIBE</span>
            </h3>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">
              AI-powered styling that understands identity.
              Not just clothes.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/what.gungun?igsh=NDBma3Fzdnp3bG5q" target="_blank" className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform">
                IG
              </a>
              <a href="https://www.linkedin.com/in/gungun-jain-1508" target="_blank" className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform">
                LN
              </a>
              <a href="https://youtube.com/@heygungun?si=QH1rCAhN-7EeNMvP" target="_blank" className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform">
                YT
              </a>
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Product</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li> <Link href="/outfit" className="hover:text-purple-500 transition">AI Outfit Suggestions</Link></li>
              <li className="hover:text-purple-500 transition" >Virtual Wardrobe </li>
              <li> <Link href="/quiz" className="hover:text-purple-500 transition">Style Quiz</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Company</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li><Link href="/about" className="hover:text-purple-500 transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-purple-500 transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-purple-500 transition">Contact</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-4">
              Get early access to new features and drops.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-l-xl text-sm focus:outline-none focus:border-purple-400 text-slate-800"
              />
              <button
                onClick={() => {
                  if (!email) return alert("Enter Email First!");
                  alert("You Are On The List!");
                }}
                className="px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-r-xl hover:opacity-90 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-100 mt-16 pt-6 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </div>
      </footer>

    </main >
  );
}
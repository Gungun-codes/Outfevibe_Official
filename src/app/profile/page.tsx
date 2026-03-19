"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSavedOutfits } from "@/app/hooks/useSavedOutfits";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut, Sparkles, TrendingUp, Zap,
  Calendar, Award, ShoppingBag, ArrowLeft,
  Star, Clock, Heart, Bookmark, ExternalLink,
} from "lucide-react";

// ── Persona trait map ──
const PERSONA_TRAITS: Record<string, {
  emoji: string;
  traits: string[];
  colors: string[];
  vibe: string;
}> = {
  Minimalist: {
    emoji: "🤍",
    traits: ["Clean lines", "Neutral tones", "Less is more", "Timeless pieces"],
    colors: ["White", "Beige", "Grey", "Black"],
    vibe: "Quiet luxury with intention",
  },
  Edgy: {
    emoji: "🔥",
    traits: ["Bold statements", "Dark palette", "Leather & chains", "Rule-breaking"],
    colors: ["Black", "Red", "Charcoal", "Metallics"],
    vibe: "Fierce, fearless, unapologetic",
  },
  Romantic: {
    emoji: "🌸",
    traits: ["Soft fabrics", "Floral prints", "Feminine silhouettes", "Pastel tones"],
    colors: ["Blush", "Lavender", "Cream", "Dusty rose"],
    vibe: "Dreamy and effortlessly soft",
  },
  Playful: {
    emoji: "🎨",
    traits: ["Bold colours", "Fun prints", "Mix & match", "Statement pieces"],
    colors: ["Yellow", "Coral", "Electric blue", "Hot pink"],
    vibe: "Joyful, expressive, always surprising",
  },
  Comfort: {
    emoji: "☁️",
    traits: ["Cosy fabrics", "Relaxed fits", "Effortless styling", "Everyday wear"],
    colors: ["Oatmeal", "Sage", "Dusty blue", "Warm brown"],
    vibe: "Laid-back but always put together",
  },
  Streetwear: {
    emoji: "🏙️",
    traits: ["Oversized fits", "Sneaker culture", "Graphic tees", "Urban edge"],
    colors: ["White", "Black", "Neon accents", "Camo"],
    vibe: "Street-smart, culture-driven",
  },
  Gentleman: {
    emoji: "💼",
    traits: ["Tailored fits", "Classic pieces", "Smart casual", "Polished details"],
    colors: ["Navy", "Charcoal", "White", "Camel"],
    vibe: "Refined masculinity with class",
  },
  Casual: {
    emoji: "🌊",
    traits: ["Easy outfits", "Versatile basics", "Comfortable cuts", "Everyday style"],
    colors: ["Denim blue", "White", "Olive", "Tan"],
    vibe: "Relaxed confidence for every day",
  },
  Athleisure: {
    emoji: "⚡",
    traits: ["Performance fabrics", "Sporty silhouettes", "Functional style", "Active lifestyle"],
    colors: ["Black", "Grey", "Electric blue", "Neon green"],
    vibe: "Always ready to move and look good doing it",
  },
};

function getPersonaData(persona: string | null) {
  if (!persona) return null;
  const key = Object.keys(PERSONA_TRAITS).find((k) => persona.includes(k));
  return key ? PERSONA_TRAITS[key] : null;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [persona, setPersona] = useState<string | null>(null);
  const [quizGender, setQuizGender] = useState<string | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"liked" | "saved">("liked");

  const { likedOutfits, savedOutfits, loading: outfitsLoading } = useSavedOutfits(user?.id);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchName = async () => {
      const { data } = await supabase
        .from("users_profile")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (data?.full_name) setDbName(data.full_name);
    };
    fetchName();
  }, [user]);

  useEffect(() => {
    const loadPersona = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("quiz_result")
          .select("persona_name, gender")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (!error && data) {
          setPersona(data.persona_name);
          setQuizGender(data.gender);
          return;
        }
      }
      const localPersona = localStorage.getItem("userPersona");
      const localGender = localStorage.getItem("quizGender");
      if (localPersona) {
        setPersona(localPersona);
        setQuizGender(
          localGender === "male" ? "Him" :
          localGender === "female" ? "Her" : localGender
        );
      }
    };
    loadPersona();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d4af7f] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const displayName =
    dbName ||
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "You";

  const photoURL = user.user_metadata?.avatar_url || null;
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Recently";
  const memberSince = user.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();
  const daysSinceJoined = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const personaData = getPersonaData(persona);
  const activeOutfits = activeTab === "liked" ? likedOutfits : savedOutfits;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden px-4 sm:px-6 lg:px-8 pb-16 pt-10">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#d4af7f] transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Hi, <span className="text-[#d4af7f]">{displayName}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm font-mono tracking-widest uppercase mt-2">
            {user.email}
          </p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Member since {memberSince}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#d4af7f]">
              <Star className="w-3.5 h-3.5" />
              {daysSinceJoined} days on Outfevibe
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push("/outfit")}
            className="group bg-gradient-to-br from-[#d4af7f] to-[#b8860b] p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(212,175,127,0.3)] hover:scale-[1.02] transition-all text-left"
          >
            <Sparkles className="w-8 h-8 text-black mb-3 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-bold text-black mb-1">AI Stylist</h3>
            <p className="text-sm text-black/70">Get outfit suggestions</p>
          </button>

          <button
            onClick={() => router.push("/quiz")}
            className="group bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl hover:border-[#d4af7f] hover:scale-[1.02] transition-all text-left"
          >
            <Zap className="w-8 h-8 text-[#d4af7f] mb-3 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-1">Style Quiz</h3>
            <p className="text-sm text-gray-400">Discover your vibe</p>
          </button>

          <button
            onClick={() => router.push("/#trending")}
            className="group bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl hover:border-[#d4af7f] hover:scale-[1.02] transition-all text-left"
          >
            <TrendingUp className="w-8 h-8 text-[#d4af7f] mb-3 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-1">Trending</h3>
            <p className="text-sm text-gray-400">See what's hot</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Card */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a] shadow-xl">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-[#2a2a2a]">
                    <AvatarImage src={photoURL || ""} alt={displayName} />
                    <AvatarFallback className="text-2xl bg-[#1a1a1a] text-[#d4af7f]">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#111]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-0.5 truncate">{displayName}</h2>
                  <p className="text-gray-400 text-sm font-mono truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#d4af7f]/10 text-[#d4af7f] border border-[#d4af7f]/20 font-medium">
                      Free Plan
                    </span>
                    <span className="text-xs text-gray-600">· Joined {createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#2a2a2a]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4af7f]">{likedOutfits.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Liked</p>
                </div>
                <div className="text-center border-x border-[#2a2a2a]">
                  <p className="text-2xl font-bold text-[#d4af7f]">{savedOutfits.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4af7f]">{daysSinceJoined}</p>
                  <p className="text-xs text-gray-500 mt-1">Days active</p>
                </div>
              </div>
            </div>

            {/* ── LIKED / SAVED TABS ── */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
              {/* Tab header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("liked")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      activeTab === "liked"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "text-gray-500 hover:text-white border border-transparent"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={activeTab === "liked" ? "currentColor" : "none"} />
                    Liked ({likedOutfits.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      activeTab === "saved"
                        ? "bg-[#d4af7f]/10 text-[#d4af7f] border border-[#d4af7f]/20"
                        : "text-gray-500 hover:text-white border border-transparent"
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={activeTab === "saved" ? "currentColor" : "none"} />
                    Saved ({savedOutfits.length})
                  </button>
                </div>
                <button
                  onClick={() => router.push("/#trending")}
                  className="text-xs text-[#d4af7f] hover:underline"
                >
                  Browse more →
                </button>
              </div>

              {/* Outfit grid */}
              {outfitsLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-[#d4af7f] border-t-transparent animate-spin" />
                </div>
              ) : activeOutfits.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl gap-3">
                  {activeTab === "liked" ? (
                    <Heart className="w-8 h-8 text-neutral-700" />
                  ) : (
                    <Bookmark className="w-8 h-8 text-neutral-700" />
                  )}
                  <p className="text-gray-500 text-sm">
                    No {activeTab} outfits yet
                  </p>
                  <button
                    onClick={() => router.push("/#trending")}
                    className="text-xs text-[#d4af7f] hover:underline"
                  >
                    Explore trending outfits →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeOutfits.map((outfit, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0a0a0a] group"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={outfit.outfit_image}
                          alt={outfit.outfit_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {activeTab === "liked" ? (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white" fill="currentColor" />
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#d4af7f] rounded-full flex items-center justify-center">
                            <Bookmark className="w-3 h-3 text-black" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs text-white line-clamp-1 mb-1.5">
                          {outfit.outfit_title}
                        </p>
                        {outfit.outfit_link && (
                          <a
                            href={outfit.outfit_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-pink-500 hover:underline"
                          >
                            Shop <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4af7f]" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                  <div className="w-10 h-10 rounded-full bg-[#d4af7f]/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#d4af7f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Account Created</p>
                    <p className="text-xs text-gray-500">{createdAt}</p>
                  </div>
                  <span className="text-xs text-[#d4af7f] bg-[#d4af7f]/10 px-2 py-0.5 rounded-full">Day 1</span>
                </div>

                {persona && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-10 h-10 rounded-full bg-[#d4af7f]/10 flex items-center justify-center flex-shrink-0 text-lg">
                      {personaData?.emoji || "✨"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Style Persona Unlocked</p>
                      <p className="text-xs text-gray-500">{persona}</p>
                    </div>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Done</span>
                  </div>
                )}

                {likedOutfits.length > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Liked {likedOutfits.length} outfit{likedOutfits.length > 1 ? "s" : ""}</p>
                      <p className="text-xs text-gray-500">Your taste is taking shape</p>
                    </div>
                  </div>
                )}

                {likedOutfits.length === 0 && savedOutfits.length === 0 && (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl gap-2">
                    <p className="text-gray-500 text-sm">No activity yet</p>
                    <button onClick={() => router.push("/#trending")} className="text-xs text-[#d4af7f] hover:underline">
                      Explore trending outfits →
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">

            {/* Style Persona */}
            <div className={`rounded-2xl p-6 border ${persona ? "bg-gradient-to-b from-[#1a1408] to-[#111] border-[#d4af7f]/20" : "bg-[#111] border-[#2a2a2a]"}`}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af7f]" />
                Your Style Persona
              </h3>

              {persona ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4af7f]/10 border border-[#d4af7f]/20 flex items-center justify-center text-3xl">
                    {personaData?.emoji || "✨"}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#d4af7f]">{persona}</p>
                    {quizGender && <p className="text-xs text-gray-500 mt-0.5">Style for {quizGender}</p>}
                    {personaData?.vibe && (
                      <p className="text-xs text-neutral-400 mt-2 italic">"{personaData.vibe}"</p>
                    )}
                  </div>
                  <div className="pt-2 space-y-2">
                    <button onClick={() => router.push("/outfit")} className="w-full py-2.5 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition text-sm">
                      View My Fits
                    </button>
                    <button onClick={() => router.push("/quiz")} className="w-full py-2.5 rounded-xl border border-[#2a2a2a] hover:border-[#d4af7f] transition text-sm text-gray-400 hover:text-white">
                      Retake Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-3xl">🎯</div>
                  <div>
                    <p className="text-sm text-white font-medium mb-1">No persona yet</p>
                    <p className="text-xs text-gray-500">Take the quiz to discover your unique style identity</p>
                  </div>
                  <button onClick={() => router.push("/quiz")} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-[1.02] transition text-sm">
                    Take Style Quiz →
                  </button>
                </div>
              )}
            </div>

            {/* ── STYLE DNA ── */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af7f]" />
                Style DNA
              </h3>
              <p className="text-xs text-gray-500 mb-5">Your fashion identity decoded</p>

              {personaData ? (
                <div className="space-y-5">
                  {/* Traits */}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mb-3">Key traits</p>
                    <div className="flex flex-wrap gap-2">
                      {personaData.traits.map((trait, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-[#d4af7f]/10 border border-[#d4af7f]/20 text-[#d4af7f]">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mb-3">Your palette</p>
                    <div className="flex flex-wrap gap-2">
                      {personaData.colors.map((color, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vibe */}
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mb-1">Your vibe</p>
                    <p className="text-sm text-white italic">"{personaData.vibe}"</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-gray-500 text-sm">Take the style quiz to unlock your DNA</p>
                  <button
                    onClick={() => router.push("/quiz")}
                    className="text-xs text-[#d4af7f] hover:underline"
                  >
                    Take Style Quiz →
                  </button>
                </div>
              )}
            </div>

            {/* For You */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#d4af7f]" />
                For You
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Take Style Quiz", desc: "Discover your unique vibe", action: () => router.push("/quiz"), highlight: !persona },
                  { title: "Try AI Stylist", desc: "Get personalised outfit picks", action: () => router.push("/outfit"), highlight: false },
                  { title: "Browse Trending", desc: "See what's popular now", action: () => router.push("/#trending"), highlight: false },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className={`w-full p-3 rounded-xl border text-left transition group ${
                      item.highlight
                        ? "border-[#d4af7f]/40 bg-[#d4af7f]/5 hover:border-[#d4af7f]"
                        : "border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#d4af7f]"
                    }`}
                  >
                    <p className="text-sm font-medium text-white group-hover:text-[#d4af7f] transition mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#1a1a1a] flex justify-center">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-[#111] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition font-medium border border-red-500/10 hover:border-red-500/30 text-sm tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
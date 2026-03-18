"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut, Sparkles, TrendingUp, Zap,
  Calendar, Award, ShoppingBag, ArrowLeft,
  Star, Clock
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [persona, setPersona] = useState<string | null>(null);
  const [quizGender, setQuizGender] = useState<string | null>(null);
  const [dbName, setDbName] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch full name from users_profile
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

  // Load persona from Supabase with localStorage fallback
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
          localGender === "female" ? "Her" :
          localGender
        );
      }
    };
    loadPersona();
  }, [user]);

  // Loading spinner
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

  const getPersonaEmoji = (p: string | null) => {
    if (!p) return "✨";
    if (p.includes("Minimalist")) return "🤍";
    if (p.includes("Edgy")) return "🔥";
    if (p.includes("Romantic")) return "🌸";
    if (p.includes("Playful")) return "🎨";
    if (p.includes("Comfort")) return "☁️";
    if (p.includes("Streetwear")) return "🏙️";
    if (p.includes("Gentleman")) return "💼";
    if (p.includes("Casual")) return "🌊";
    if (p.includes("Athleisure")) return "⚡";
    return "✨";
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

  // Days since joined
  const daysSinceJoined = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Hi, <span className="text-[#d4af7f]">{displayName}</span> 👋
            </h1>
          </div>
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
                  {/* Online dot */}
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#111]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-0.5 truncate">{displayName}</h2>
                  <p className="text-gray-400 text-sm font-mono truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#d4af7f]/10 text-[#d4af7f] border border-[#d4af7f]/20 font-medium">
                      Free Plan
                    </span>
                    <span className="text-xs text-gray-600">· Joined {createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#2a2a2a]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4af7f]">0</p>
                  <p className="text-xs text-gray-500 mt-1">Outfits</p>
                </div>
                <div className="text-center border-x border-[#2a2a2a]">
                  <p className="text-2xl font-bold text-[#d4af7f]">0</p>
                  <p className="text-xs text-gray-500 mt-1">Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4af7f]">{daysSinceJoined}</p>
                  <p className="text-xs text-gray-500 mt-1">Days active</p>
                </div>
              </div>
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Account Created</p>
                    <p className="text-xs text-gray-500">{createdAt}</p>
                  </div>
                  <span className="text-xs text-[#d4af7f] bg-[#d4af7f]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    Day 1
                  </span>
                </div>

                {persona && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-10 h-10 rounded-full bg-[#d4af7f]/10 flex items-center justify-center flex-shrink-0 text-lg">
                      {getPersonaEmoji(persona)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">Style Persona Unlocked</p>
                      <p className="text-xs text-gray-500">{persona}</p>
                    </div>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      Done
                    </span>
                  </div>
                )}

                <div className="h-28 flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl gap-2">
                  <p className="text-gray-500 text-sm">No outfit activity yet</p>
                  <button
                    onClick={() => router.push("/outfit")}
                    className="text-xs text-[#d4af7f] hover:underline"
                  >
                    Generate your first outfit →
                  </button>
                </div>
              </div>
            </div>

            {/* Style DNA */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af7f]" />
                Style DNA
              </h3>
              <p className="text-xs text-gray-500 mb-5">Your style breakdown — unlocks as you create outfits</p>
              <div className="space-y-4">
                {[
                  { label: "Casual", value: 0 },
                  { label: "Formal", value: 0 },
                  { label: "Trendy", value: 0 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="text-sm text-[#d4af7f]">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#2a2a2a]">
                      <div
                        className="h-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center">
                Create outfits to unlock your full style profile
              </p>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">

            {/* Style Persona Card */}
            <div className={`rounded-2xl p-6 border ${persona ? "bg-gradient-to-b from-[#1a1408] to-[#111] border-[#d4af7f]/20" : "bg-[#111] border-[#2a2a2a]"}`}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af7f]" />
                Your Style Persona
              </h3>

              {persona ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4af7f]/10 border border-[#d4af7f]/20 flex items-center justify-center text-3xl">
                    {getPersonaEmoji(persona)}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#d4af7f]">{persona}</p>
                    {quizGender && (
                      <p className="text-xs text-gray-500 mt-0.5">Style for {quizGender}</p>
                    )}
                  </div>
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => router.push("/outfit")}
                      className="w-full py-2.5 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition text-sm"
                    >
                      View My Fits
                    </button>
                    <button
                      onClick={() => router.push("/quiz")}
                      className="w-full py-2.5 rounded-xl border border-[#2a2a2a] hover:border-[#d4af7f] transition text-sm text-gray-400 hover:text-white"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium mb-1">No persona yet</p>
                    <p className="text-xs text-gray-500">Take the quiz to discover your unique style identity</p>
                  </div>
                  <button
                    onClick={() => router.push("/quiz")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-[1.02] transition text-sm"
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
                  {
                    title: "Take Style Quiz",
                    desc: "Discover your unique vibe",
                    action: () => router.push("/quiz"),
                    highlight: !persona,
                  },
                  {
                    title: "Try AI Stylist",
                    desc: "Get personalised outfit picks",
                    action: () => router.push("/outfit"),
                    highlight: false,
                  },
                  {
                    title: "Browse Trending",
                    desc: "See what's popular now",
                    action: () => router.push("/#trending"),
                    highlight: false,
                  },
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
                    <p className="text-sm font-medium text-white group-hover:text-[#d4af7f] transition mb-0.5">
                      {item.title}
                    </p>
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
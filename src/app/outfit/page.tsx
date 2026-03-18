"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

/* ---------------- TYPES ---------------- */

type Outfit = {
  id: number;
  gender: "male" | "female";
  occasion: string[];
  mood: string[];
  budget: string[];
  title?: string;
  image: string;
  affiliateLink?: string;
};

export default function OutfitChat() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [occasion, setOccasion] = useState("");
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<Outfit[]>([]);
  const [typing, setTyping] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const moods = ["Chill", "Classic", "Bold", "Traditional"];
  const occasions = ["College", "Party", "Date", "Wedding", "Eid"];
  const budgets = ["Low", "Medium", "High"];

  /* ---------------- LOAD JSON FROM PUBLIC ---------------- */

  useEffect(() => {
    async function loadOutfits() {
      const res = await fetch("/api/outfits");
      const data = await res.json();
      setAllOutfits(data);
    }

    loadOutfits();
  }, []);

  /* ---------------- LOAD SAVED ---------------- */

  useEffect(() => {
    if (!user) return;

    const loadSaved = async () => {
      const { data } = await supabase
        .from("ai_outfit_images")
        .select("ai_suggestion")
        .eq("user_id", user.id);

      if (data) {
        const savedIds = data
          .map((row: any) => {
            const match = row.ai_suggestion?.match(/\[ID:(\d+)\]/);
            return match ? parseInt(match[1]) : null;
          })
          .filter((id: number | null): id is number => id !== null);

        setSaved(savedIds);
      }
    };

    loadSaved();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, results, typing]);

  function simulateTyping(nextStep: number) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(nextStep);
    }, 500);
  }

  /* ---------------- RANKING LOGIC ---------------- */

  function generateLooks() {
    if (!gender) return;

    const genderFiltered = allOutfits.filter(
      (item) => item.gender === gender
    );

    const scored = genderFiltered.map((item) => {
      let score = 0;

      if (item.occasion.includes(occasion.toLowerCase()))
        score += 3;

      if (item.mood.includes(mood.toLowerCase()))
        score += 2;

      if (item.budget.includes(budget.toLowerCase()))
        score += 1;

      return { ...item, score };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);

    let topTwo: Outfit[] = [];

    if (sorted.length > 0) {
      topTwo = sorted.slice(0, 2);
    } else {
      const shuffled = [...genderFiltered].sort(() => 0.5 - Math.random());
      topTwo = shuffled.slice(0, 2);
    }

    setResults(topTwo);
    simulateTyping(5);
  }

  /* ---------------- SURPRISE ---------------- */

  function surpriseMe() {
    if (!gender) return;

    const genderFiltered = allOutfits.filter(
      (item) => item.gender === gender
    );

    const shuffled = [...genderFiltered].sort(() => 0.5 - Math.random());
    setResults(shuffled.slice(0, 2));
  }

  function restyle() {
    setGender("");
    setMood("");
    setOccasion("");
    setBudget("");
    setResults([]);
    setStep(1);
  }

  const handleShare = async () => {
    if (results.length === 0) return;

    const urls = results.map((r) => r.affiliateLink).filter(Boolean).join("\n");
    const adjective = gender === "male" ? "sharp" : "gorgeous";
    const emoji = gender === "male" ? "🔥" : "✨";
    const closingEmoji = gender === "male" ? "😎" : "💖";

    const message = `Check out these ${adjective} outfits curated just for me by the Outfevibe AI Stylist! ${emoji}\n\nShop my looks here:\n${urls}\n\nFind your perfect aesthetic at Outfevibe! ${closingEmoji}\nwww.outfevibe.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Outfevibe Style ${emoji}`,
          text: message,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      navigator.clipboard.writeText(message);
      alert("Looks and message copied to clipboard! ✨ Share it with your friends!");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl space-y-6">

          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Outfevibe Stylist
            </h1>
          </Link>

          {step >= 1 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">Who are we styling today?</p>
              {!gender ? (
                <div className="flex gap-3 flex-wrap">
                  <button
                    className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all"
                    onClick={() => { setGender("female"); simulateTyping(2); }}>Her</button>
                  <button
                    className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all"
                    onClick={() => { setGender("male"); simulateTyping(2); }}>Him</button>
                </div>
              ) : (
                <div className="inline-block px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                  {gender === "female" ? "Her" : "Him"}
                </div>
              )}
            </div>
          )}

          {step >= 2 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">Where are we going?</p>
              {!occasion ? (
                <div className="flex gap-3 flex-wrap">
                  {occasions.map((o) => (
                    <button
                      key={o}
                      className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all"
                      onClick={() => { setOccasion(o); simulateTyping(3); }}>
                      {o}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-block px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                  {occasion}
                </div>
              )}
            </div>
          )}

          {step >= 3 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">What’s the vibe?</p>
              {!mood ? (
                <div className="flex gap-3 flex-wrap">
                  {moods.map((m) => (
                    <button
                      key={m}
                      className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all"
                      onClick={() => { setMood(m); simulateTyping(4); }}>
                      {m}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-block px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                  {mood}
                </div>
              )}
            </div>
          )}

          {step >= 4 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">What’s your budget?</p>
              {!budget ? (
                <div className="flex gap-3 flex-wrap">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all"
                      onClick={() => { setBudget(b); generateLooks(); }}>
                      {b}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-block px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                  {budget}
                </div>
              )}
            </div>
          )}

          {typing && (
            <div className="flex items-center gap-1 p-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 mt-4">
              <p className="font-medium text-slate-800 text-lg">Your looks ✨</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((look) => (
                  <div key={look.id} className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white hover:shadow-lg transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={look.image} alt={look.title || "Outfit"} className="w-full h-full object-cover" />
                    </div>
                    {look.title && <p className="p-3 text-sm font-medium text-slate-700 text-center">{look.title}</p>}
                    {look.affiliateLink && (
                      <a
                        href={look.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-xs text-purple-600 font-semibold py-3 bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        Explore Look →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={restyle}
                  className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Restyle
                </button>
                <button
                  onClick={surpriseMe}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
                >
                  Surprise Me
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 sm:ml-auto"
                >
                  Share ✨
                </button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    </main>
  );
}
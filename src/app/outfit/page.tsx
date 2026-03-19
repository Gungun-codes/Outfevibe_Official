"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, Bookmark, ExternalLink } from "lucide-react";
import { useSavedOutfits } from "@/app/hooks/useSavedOutfits";

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
  categories?: string[];
};

export default function OutfitChat() {
  const { user } = useAuth();
  const { isLiked, isSaved, toggleOutfit, savedOutfits } = useSavedOutfits(user?.id);

  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [occasion, setOccasion] = useState("");
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<Outfit[]>([]);
  const [typing, setTyping] = useState(false);
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const moods = ["Chill", "Classic", "Bold", "Traditional"];
  const occasions = ["College", "Party", "Date", "Wedding", "Eid"];
  const budgets = ["Low", "Medium", "High"];

  /* ---------------- LOAD JSON ---------------- */
  useEffect(() => {
    async function loadOutfits() {
      const res = await fetch("/api/outfits");
      const data = await res.json();
      setAllOutfits(data);
    }
    loadOutfits();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, results, typing]);

  /* ---------------- MILESTONE NOTIFICATION ---------------- */
  useEffect(() => {
    const count = savedOutfits.length;
    if ([5, 10, 25, 50].includes(count) && user?.id) {
      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "outfit_milestone",
          payload: String(count),
          userId: user.id,
        }),
      });
    }
  }, [savedOutfits.length, user?.id]);

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

    const genderFiltered = allOutfits.filter((item) => item.gender === gender);

    const scored = genderFiltered.map((item) => {
      let score = 0;
      if (item.occasion.includes(occasion.toLowerCase())) score += 3;
      if (item.mood.includes(mood.toLowerCase())) score += 2;
      if (item.budget.includes(budget.toLowerCase())) score += 1;
      return { ...item, score };
    });

    const sorted = scored.sort((a: any, b: any) => b.score - a.score);
    const topTwo =
      sorted.length > 0
        ? sorted.slice(0, 2)
        : [...genderFiltered].sort(() => 0.5 - Math.random()).slice(0, 2);

    setResults(topTwo);
    simulateTyping(5);
  }

  /* ---------------- SURPRISE ---------------- */
  function surpriseMe() {
    if (!gender) return;
    const genderFiltered = allOutfits.filter((item) => item.gender === gender);
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
        await navigator.share({ title: `My Outfevibe Style ${emoji}`, text: message });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      navigator.clipboard.writeText(message);
      alert("Looks and message copied to clipboard! ✨");
    }
  };

  /* ---------------- SHARED CHIP STYLE ---------------- */
  const chipBase = "px-5 py-2.5 rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 font-medium transition-all";
  const chipSelected = "inline-block px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100";

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

          {/* STEP 1 — Gender */}
          {step >= 1 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">Who are we styling today?</p>
              {!gender ? (
                <div className="flex gap-3 flex-wrap">
                  <button className={chipBase} onClick={() => { setGender("female"); simulateTyping(2); }}>Her</button>
                  <button className={chipBase} onClick={() => { setGender("male"); simulateTyping(2); }}>Him</button>
                </div>
              ) : (
                <div className={chipSelected}>{gender === "female" ? "Her" : "Him"}</div>
              )}
            </div>
          )}

          {/* STEP 2 — Occasion */}
          {step >= 2 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">Where are we going?</p>
              {!occasion ? (
                <div className="flex gap-3 flex-wrap">
                  {occasions.map((o) => (
                    <button key={o} className={chipBase} onClick={() => { setOccasion(o); simulateTyping(3); }}>{o}</button>
                  ))}
                </div>
              ) : (
                <div className={chipSelected}>{occasion}</div>
              )}
            </div>
          )}

          {/* STEP 3 — Mood */}
          {step >= 3 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">What's the vibe?</p>
              {!mood ? (
                <div className="flex gap-3 flex-wrap">
                  {moods.map((m) => (
                    <button key={m} className={chipBase} onClick={() => { setMood(m); simulateTyping(4); }}>{m}</button>
                  ))}
                </div>
              ) : (
                <div className={chipSelected}>{mood}</div>
              )}
            </div>
          )}

          {/* STEP 4 — Budget */}
          {step >= 4 && (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">What's your budget?</p>
              {!budget ? (
                <div className="flex gap-3 flex-wrap">
                  {budgets.map((b) => (
                    <button key={b} className={chipBase} onClick={() => { setBudget(b); generateLooks(); }}>{b}</button>
                  ))}
                </div>
              ) : (
                <div className={chipSelected}>{budget}</div>
              )}
            </div>
          )}

          {/* TYPING INDICATOR */}
          {typing && (
            <div className="flex items-center gap-1 p-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            </div>
          )}

          {/* STEP 5 — Results */}
          {step === 5 && (
            <div className="space-y-6 mt-4">
              <p className="font-medium text-slate-800 text-lg">Your looks ✨</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((look) => {
                  const liked = isLiked(look.title || String(look.id));
                  const saved = isSaved(look.title || String(look.id));

                  const outfitForHook = {
                    title: look.title || `Outfit ${look.id}`,
                    image: look.image,
                    affiliateLink: look.affiliateLink || "",
                    categories: look.categories || [occasion.toLowerCase()],
                    gender: look.gender,
                  };

                  return (
                    <div
                      key={look.id}
                      className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white hover:shadow-lg transition-all"
                    >
                      {/* Image with overlay buttons */}
                      <div className="relative aspect-[3/4] overflow-hidden group">
                        <img
                          src={look.image}
                          alt={look.title || "Outfit"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Like + Save overlay */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button
                            onClick={() => toggleOutfit(outfitForHook, "liked")}
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow transition-all ${
                              liked
                                ? "bg-red-500 text-white shadow-red-500/30"
                                : "bg-white/70 text-slate-600 hover:bg-white"
                            }`}
                            title={liked ? "Unlike" : "Like"}
                          >
                            <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
                          </button>

                          <button
                            onClick={() => toggleOutfit(outfitForHook, "saved")}
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow transition-all ${
                              saved
                                ? "bg-purple-500 text-white shadow-purple-500/30"
                                : "bg-white/70 text-slate-600 hover:bg-white"
                            }`}
                            title={saved ? "Unsave" : "Save"}
                          >
                            <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-3">
                        {look.title && (
                          <p className="text-sm font-medium text-slate-700 text-center mb-2 line-clamp-2">
                            {look.title}
                          </p>
                        )}

                        {/* Like / Save inline + Shop */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleOutfit(outfitForHook, "liked")}
                              className={`flex items-center gap-1 text-xs transition ${
                                liked ? "text-red-500" : "text-slate-400 hover:text-red-500"
                              }`}
                            >
                              <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
                              {liked ? "Liked" : "Like"}
                            </button>

                            <button
                              onClick={() => toggleOutfit(outfitForHook, "saved")}
                              className={`flex items-center gap-1 text-xs transition ${
                                saved ? "text-purple-500" : "text-slate-400 hover:text-purple-500"
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
                              {saved ? "Saved" : "Save"}
                            </button>
                          </div>

                          {look.affiliateLink && (
                            <a
                              href={look.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-purple-600 font-semibold hover:underline"
                            >
                              Shop <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
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
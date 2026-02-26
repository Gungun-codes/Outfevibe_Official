"use client";

import { useState, useEffect, useRef } from "react";
import outfits from "../../../data/outfits.json";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";

type Outfit = {
  id: number;
  gender: string;
  occasion: string;
  mood: string;
  color?: string;
  title?: string;
  image: string;
  affiliateLink?: string;
};

export default function OutfitChat() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("");
  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [refineMode, setRefineMode] = useState<"color" | "upload" | "">("");
  const [color, setColor] = useState("");
  const [results, setResults] = useState<Outfit[]>([]);
  const [typing, setTyping] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const moods = [
    "Main Character",
    "Soft & Stunning",
    "Desi Drama",
    "Chill but Hot",
  ];

  const occasions = [
    "Haldi",
    "Mehendi",
    "Sangeet",
    "Bachelor's",
    "Wedding",
    "College Fest",
  ];

  const colors = ["Red", "Black", "Gold", "Pink", "Blue", "Beige", "purple"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, results, typing]);

  // Load saved outfits from Supabase on mount
  useEffect(() => {
    if (!user) return;
    const loadSaved = async () => {
      const { data, error } = await supabase
        .from("ai_outfit_images")
        .select("ai_suggestion")
        .eq("user_id", user.id);
      if (!error && data) {
        // Extract outfit IDs from saved records
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

  function simulateTyping(nextStep: number) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(nextStep);
    }, 500);
  }

  function pickTwoRandom(arr: Outfit[]) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

  function generateLooks() {
    const allOutfits = outfits as Outfit[];

    let filtered = allOutfits.filter(
      (item) =>
        item.gender === gender &&
        item.occasion === occasion &&
        item.mood === mood
    );

    if (filtered.length === 0) {
      filtered = allOutfits.filter(
        (item) => item.gender === gender
      );
    }

    setResults(pickTwoRandom(filtered));
    simulateTyping(6);
  }

  function surpriseMe() {
    const genderFiltered = (outfits as Outfit[]).filter((item) => item.gender === gender);
    setResults(pickTwoRandom(genderFiltered));
  }
  function restyle() {
    setGender("");
    setMood("");
    setOccasion("");
    setColor("");
    setResults([]);
  }

  async function toggleSave(id: number) {
    const isAlreadySaved = saved.includes(id);

    if (isAlreadySaved) {
      // Unsave: remove from local state and Supabase
      setSaved((prev) => prev.filter((i) => i !== id));
      if (user) {
        const { error } = await supabase
          .from("ai_outfit_images")
          .delete()
          .eq("user_id", user.id)
          .like("ai_suggestion", `%[ID:${id}]%`);
        if (error) console.error("Error removing saved outfit:", error);
      }
    } else {
      // Save: add to local state and Supabase
      setSaved((prev) => [...prev, id]);
      const outfit = results.find((r) => r.id === id);
      if (user && outfit) {
        const titleToSave = outfit.title || `${outfit.color ? outfit.color + ' ' : ''}${outfit.occasion} ${outfit.mood}`;
        const { error } = await supabase.from("ai_outfit_images").insert({
          user_id: user.id,
          image_url: outfit.image,
          ai_suggestion: `${titleToSave} [ID:${outfit.id}]`,
        });
        if (error) console.error("Error saving outfit:", error);
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex justify-center py-12">
      <div className="w-full max-w-xl px-4">
        <div className="bg-white rounded-3xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] space-y-4">

          {/* INTRO + GENDER SIDE BY SIDE */}
          {/* INTRO - Always visible */}
          <div>
            <h1 className="text-2xl font-bold cursor-pointer hover:text-[#d4af7f] transition" onClick={() => window.location.href = "/"}>
              Outfevibe
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Let’s build something iconic.
            </p>
          </div>
          <div className="h-px bg-gray-200 my-3" />


          {/* STEP 1 - GENDER */}
          {step >= 1 && (
            <>
              <BotBubble text="Who are we styling today?" />

              {gender && <UserBubble text={gender} />}

              {!gender && (
                <div className="flex gap-2">
                  <ChoiceChip
                    text="Girl"
                    onClick={() => {
                      setGender("Girl");
                      simulateTyping(2);
                    }}
                  />
                  <ChoiceChip
                    text="Boy"
                    onClick={() => {
                      setGender("Boy");
                      simulateTyping(2);
                    }}
                  />
                </div>
              )}
            </>
          )}


          {/* MOOD */}
          {step >= 2 && (
            <>
              <BotBubble text="What’s the energy?" />
              {mood && <UserBubble text={mood} />}
              {!mood && (
                <ChipGrid
                  options={moods}
                  onSelect={(val) => {
                    setMood(val);
                    simulateTyping(3);
                  }}
                />
              )}
            </>
          )}

          {/* OCCASION */}
          {step >= 3 && (
            <>
              <BotBubble text="Where are we showing up?" />
              {occasion && <UserBubble text={occasion} />}
              {!occasion && (
                <ChipGrid
                  options={occasions}
                  onSelect={(val) => {
                    setOccasion(val);
                    simulateTyping(4);
                  }}
                />
              )}
            </>
          )}

          {/* REFINE */}
          {step >= 4 && (
            <>
              <BotBubble text="Want to refine or keep it bold?" />
              {!refineMode && (
                <ChipGrid
                  options={["Pick color", "Upload", "Skip"]}
                  onSelect={(val) => {
                    if (val === "Pick color") {
                      setRefineMode("color");
                      simulateTyping(5);
                    } else if (val === "Upload") {
                      setRefineMode("upload");
                      simulateTyping(5);
                    } else {
                      generateLooks();
                    }
                  }}
                />
              )}
            </>
          )}

          {step >= 5 && refineMode === "color" && (
            <>
              <BotBubble text="Which color are we feeling?" />
              {!color && (
                <ChipGrid
                  options={colors}
                  onSelect={(val) => {
                    setColor(val);
                    generateLooks();
                  }}
                />
              )}
              {color && <UserBubble text={color} />}
            </>
          )}

          {step >= 5 && refineMode === "upload" && (
            <>
              <BotBubble text="Upload your piece. I’ll build around it." />
              <input type="file" className="text-sm" />
              <button
                onClick={generateLooks}
                className="mt-2 bg-black text-white px-4 py-2 rounded-full text-sm"
              >
                Continue
              </button>
            </>
          )}

          {/* RESULTS */}
          {step === 6 && (
            <>
              <BotBubble text="This is giving main character energy." />

              <div className="space-y-5">
                {results.map((look) => (
                  <div
                    key={look.id}
                    className="border rounded-2xl p-4 hover:shadow-xl transition"
                  >
                    <img
                      src={look.image}
                      alt={look.title || `${look.color ? look.color + ' ' : ''}${look.occasion} ${look.mood} look`}
                      className="w-full h-56 object-cover rounded-xl mb-3"
                    />

                    <p className="font-semibold capitalize">
                      {look.title || `${look.color ? look.color + ' ' : ''}${look.occasion} ${look.mood} Look`}
                    </p>

                    <div className="flex gap-3 mt-3">
                      {look.affiliateLink ? (
                        <a
                          href={look.affiliateLink}
                          target="_blank"
                          className="flex-1 flex items-center justify-center bg-black text-white py-2 rounded-full text-center text-sm"
                        >
                          Try This Look
                        </a>
                      ) : (
                        <span className="flex-1 flex items-center justify-center bg-gray-200 text-gray-500 py-2 rounded-full text-center text-sm cursor-not-allowed">
                          Unavailable
                        </span>
                      )}

                      <button
                        onClick={() => toggleSave(look.id)}
                        className={`px-4 py-2 rounded-full text-sm border ${saved.includes(look.id)
                          ? "bg-black text-white"
                          : ""
                          }`}
                      >
                        {saved.includes(look.id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="border px-4 py-2 rounded-full text-sm"
                >
                  Restyle
                </button>
                <button
                  onClick={surpriseMe}
                  className="border px-4 py-2 rounded-full text-sm"
                >
                  Surprise Me
                </button>
              </div>
            </>
          )}

          {typing && <BotBubble text="Styling..." subtle />}

          <div ref={chatEndRef} />
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */

function BotBubble({ text, subtle }: { text: string; subtle?: boolean }) {
  return (
    <div className={`bg-gray-100 px-4 py-3 rounded-2xl text-sm ${subtle ? "opacity-60" : ""}`}>
      {text}
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-black text-white px-4 py-3 rounded-2xl text-sm">
        {text}
      </div>
    </div>
  );
}

function ChoiceChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full border text-sm hover:bg-black hover:text-white transition"
    >
      {text}
    </button>
  );
}

function ChipGrid({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <ChoiceChip key={opt} text={opt} onClick={() => onSelect(opt)} />
      ))}
    </div>
  );
}

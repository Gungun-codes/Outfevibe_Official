"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";

/* -------------------- TYPES -------------------- */

interface Outfit {
  id: string;
  title: string;
  image: string;
  description: string;
}

/* -------------------- PERSONA DATA -------------------- */

const PERSONA_OUTFITS: Record<string, Outfit[]> = {

  "Minimalist Maven": [
    {
      id: "mm1",
      title: "Neutral Power",
      image: "/suggestions/mm-1.jpg",
      description: "Clean lines. Timeless vibe."
    },
    {
      id: "mm2",
      title: "Soft Monochrome",
      image: "/suggestions/mm-2.jpg",
      description: "Understated elegance."
    }
  ],

  "Edgy Trendsetter": [
    {
      id: "et1",
      title: "Street Rebel",
      image: "/suggestions/et-1.jpg",
      description: "Bold and fearless."
    },
    {
      id: "et2",
      title: "Night Slay",
      image: "/suggestions/et-2.jpg",
      description: "Main character energy."
    }
  ],

  "Playful Creative": [
    {
      id: "pc1",
      title: "Color Pop",
      image: "/suggestions/pc-1.jpg",
      description: "Fun meets fashion."
    },
    {
      id: "pc2",
      title: "Art Girl",
      image: "/suggestions/pc-2.jpg",
      description: "Creative soul vibes."
    }
  ],

  "Romantic Softie": [
    {
      id: "rs1",
      title: "Soft Pastel Dream",
      image: "/suggestions/rs-1.jpg",
      description: "Whimsical and gentle."
    },
    {
      id: "rs2",
      title: "Cozy Romance",
      image: "/suggestions/rs-2.jpg",
      description: "Soft layered beauty."
    }
  ],

  "Comfort Queen": [
    {
      id: "cq1",
      title: "Elevated Lounge",
      image: "/suggestions/cq-1.jpg",
      description: "Comfort but make it cute."
    },
    {
      id: "cq2",
      title: "Chill Fit",
      image: "/suggestions/cq-2.jpg",
      description: "Relaxed and confident."
    }
  ],

  "Boho Spirit": [
    {
      id: "bs1",
      title: "Earthy Vibes",
      image: "/suggestions/bs-1.jpg",
      description: "Free spirited energy."
    },
    {
      id: "bs2",
      title: "Festival Queen",
      image: "/suggestions/bs-2.jpg",
      description: "Bohemian charm."
    }
  ],

  "Minimalist King": [
    {
      id: "mk1",
      title: "Clean Authority",
      image: "/suggestions/mk-1.jpg",
      description: "Sharp and refined."
    },
    {
      id: "mk2",
      title: "Neutral Boss",
      image: "/suggestions/mk-2.jpg",
      description: "Understated dominance."
    }
  ],

  "Streetwear Icon": [
    {
      id: "si1",
      title: "Hype Drop",
      image: "/suggestions/si-1.jpg",
      description: "Street certified."
    },
    {
      id: "si2",
      title: "Layer King",
      image: "/suggestions/si-2.jpg",
      description: "Urban edge."
    }
  ],

  "Modern Gentleman": [
    {
      id: "mg1",
      title: "Smart Casual",
      image: "/suggestions/mg-1.jpg",
      description: "Classy but chill."
    },
    {
      id: "mg2",
      title: "Evening Sharp",
      image: "/suggestions/mg-2.jpg",
      description: "Polished presence."
    }
  ],

  "Casual Cool": [
    {
      id: "cc1",
      title: "Weekend Fit",
      image: "/suggestions/cc-1.jpg",
      description: "Effortless drip."
    },
    {
      id: "cc2",
      title: "Denim Classic",
      image: "/suggestions/cc-2.jpg",
      description: "Simple but strong."
    }
  ],

  "Athleisure Pro": [
    {
      id: "ap1",
      title: "Gym Street",
      image: "/suggestions/ap-1.jpg",
      description: "Performance meets fashion."
    },
    {
      id: "ap2",
      title: "Sport Luxe",
      image: "/suggestions/ap-2.jpg",
      description: "Comfort domination."
    }
  ],

  "Urban Explorer": [
    {
      id: "ue1",
      title: "Adventure Core",
      image: "/suggestions/ue-1.jpg",
      description: "Functional and stylish."
    },
    {
      id: "ue2",
      title: "Rugged Layer",
      image: "/suggestions/ue-2.jpg",
      description: "Outdoor ready."
    }
  ]
};

/* -------------------- COMPONENT -------------------- */

export default function SuggestionsPage() {

  const { user } = useAuth();
  const router = useRouter();
  const [persona, setPersona] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedPersona = localStorage.getItem("userPersona");
    setPersona(storedPersona);
  }, []);

  // Load previously saved suggestion outfits from Supabase
  useEffect(() => {
    if (!user) return;
    const loadSaved = async () => {
      const { data, error } = await supabase
        .from("ai_outfit_images")
        .select("ai_suggestion")
        .eq("user_id", user.id);
      if (!error && data) {
        const ids = new Set<string>(
          data
            .map((row: any) => {
              const match = row.ai_suggestion?.match(/\[SID:([^\]]+)\]/);
              return match ? match[1] : null;
            })
            .filter(Boolean) as string[]
        );
        setSaved(ids);
      }
    };
    loadSaved();
  }, [user]);

  const toggleSave = async (outfit: Outfit) => {
    const isSaved = saved.has(outfit.id);

    if (isSaved) {
      // Unsave
      setSaved((prev) => {
        const next = new Set(prev);
        next.delete(outfit.id);
        return next;
      });
      if (user) {
        const { error } = await supabase
          .from("ai_outfit_images")
          .delete()
          .eq("user_id", user.id)
          .like("ai_suggestion", `%[SID:${outfit.id}]%`);
        if (error) console.error("Error removing saved outfit:", error);
      }
    } else {
      // Save
      setSaved((prev) => new Set(prev).add(outfit.id));
      if (user) {
        const { error } = await supabase.from("ai_outfit_images").insert({
          user_id: user.id,
          image_url: outfit.image,
          ai_suggestion: `${outfit.title} - ${outfit.description} [SID:${outfit.id}]`,
        });
        if (error) console.error("Error saving outfit:", error);
      }
    }
  };

  if (!persona) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your style...
      </div>
    );
  }

  const outfits = PERSONA_OUTFITS[persona] || [];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">
            Your Curated Fits
          </h1>
          <p className="text-gray-400 mt-3">
            Persona: {persona}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-gray-500 hover:text-white text-sm transition"
          >
            🏠 Go Home
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden hover:border-white transition"
            >
              <img
                src={outfit.image}
                alt={outfit.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {outfit.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {outfit.description}
                </p>

                <button
                  onClick={() => toggleSave(outfit)}
                  className={`px-5 py-2 rounded-full text-sm border transition ${saved.has(outfit.id)
                    ? "bg-white text-black border-white"
                    : "border-gray-600 hover:border-white"
                    }`}
                >
                  {saved.has(outfit.id) ? "✓ Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

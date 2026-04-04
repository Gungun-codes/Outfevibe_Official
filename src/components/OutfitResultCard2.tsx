"use client";

import { motion } from "framer-motion";
import { ExternalLink, Heart, Bookmark, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useSavedOutfits } from "@/app/hooks/useSavedOutfits";
import { useAuth } from "@/context/authContext";

interface SimpleOutfit {
  id: number;
  title: string;
  gender: string;
  occasions: string[];
  mood: string[];
  budget: string;
  persona: string[];
  body_shapes: string[];
  skin_tones: string[];
  image: string;
  affiliateLink: string;
  categories?: string[];
  priority?: number;
}

interface OutfitResultCard2Props {
  outfits: SimpleOutfit[];
  occasion?: string;
  bodyShape?: string;
  skinTone?: string;
  onGetRefined?: () => void;
}

function OutfitCard({ outfit, index }: { outfit: SimpleOutfit; index: number }) {
  const { user } = useAuth();
  const { isLiked, isSaved, toggleOutfit } = useSavedOutfits(user?.id);

  const liked = isLiked(outfit.title);
  const saved = isSaved(outfit.title);

  const card = {
    title: outfit.title,
    image: outfit.image,
    affiliateLink: outfit.affiliateLink,
    categories: outfit.categories ?? [],
    gender: outfit.gender,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#111111] shadow-md"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }} />

        {/* Like + Save */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleOutfit(card, "liked")}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: liked ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: liked ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "#fff" : "none"} stroke="#fff" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleOutfit(card, "saved")}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            style={{
              background: saved ? "rgba(212,175,127,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: saved ? "1px solid rgba(212,175,127,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "#000" : "none"} stroke={saved ? "#000" : "#fff"} />
          </motion.button>
        </div>

        {/* Budget badge bottom left */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black capitalize"
            style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
            {outfit.budget}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-3 bg-[#111111]">
        <p className="text-xs font-semibold text-neutral-200 leading-snug line-clamp-2 mb-2">
          {outfit.title}
        </p>

        {/* Persona tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {outfit.persona.slice(0, 2).map((p) => (
            <span key={p} className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
              style={{ background: "#d4af7f18", color: "#d4af7f" }}>
              {p.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        {/* Buy button */}
        <a
          href={outfit.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-xs font-bold text-black transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        >
          <ShoppingBag className="w-3 h-3" />
          Shop Now
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

export function OutfitResultCard2({
  outfits,
  occasion,
  bodyShape,
  skinTone,
  onGetRefined,
}: OutfitResultCard2Props) {
  if (!outfits.length) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 text-center">
        <p className="text-sm text-neutral-400">No outfits found for your profile yet.</p>
        <p className="text-xs text-neutral-600 mt-1">We're adding more daily! 🛍️</p>
      </div>
    );
  }

  // Grid layout based on count
  const count = outfits.length;
  const gridClass =
    count === 1 ? "grid grid-cols-1 gap-3" :
    "grid grid-cols-2 gap-3";

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-bold text-white">
            {occasion ? `${occasion} Picks` : "Curated For You"} ✨
          </p>
          {bodyShape && skinTone && (
            <p className="text-[10px] text-neutral-600 mt-0.5">
              {bodyShape} · {skinTone} skin
            </p>
          )}
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-semibold"
          style={{ background: "#d4af7f18", color: "#d4af7f" }}>
          {count} look{count > 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Grid */}
      {count === 3 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <OutfitCard key={outfits[0].id} outfit={outfits[0]} index={0} />
            <OutfitCard key={outfits[1].id} outfit={outfits[1]} index={1} />
          </div>
          <OutfitCard key={outfits[2].id} outfit={outfits[2]} index={2} />
        </div>
      ) : (
        <div className={gridClass}>
          {outfits.map((outfit, i) => (
            <OutfitCard key={outfit.id} outfit={outfit} index={i} />
          ))}
        </div>
      )}

      {/* Get refined button */}
      {onGetRefined && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGetRefined}
          className="w-full py-3 rounded-2xl border border-[#d4af7f]/30 text-sm font-semibold text-[#d4af7f] transition-all hover:bg-[#1a1a1a]"
          style={{ background: "#0f0f0f" }}
        >
          🎯 Get occasion-specific outfits →
        </motion.button>
      )}
    </div>
  );
}
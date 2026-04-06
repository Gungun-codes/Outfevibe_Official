"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Heart, Bookmark } from "lucide-react";
import { OutfitItem, OutfitResult } from "@/lib/type";
import { useState } from "react";

const PLATFORM_COLORS: Record<string, string> = {
  Myntra:   "#FF3F6C",
  Ajio:     "#E65100",
  Amazon:   "#FF9900",
  Flipkart: "#2874F0",
  Meesho:   "#9C27B0",
  Curated:  "#d4af7f",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? "text-amber-400" : "text-neutral-700"}`}>★</span>
      ))}
      <span className="text-xs text-neutral-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ItemCard({
  item,
  index,
  onLike,
  onSave,
  liked,
  saved,
}: {
  item: OutfitItem & { image?: string; affiliateLink?: string };
  index: number;
  onLike: () => void;
  onSave: () => void;
  liked: boolean;
  saved: boolean;
}) {
  // Use item's own platform color — each item can be from a different website
  const color  = PLATFORM_COLORS[item.platform] ?? "#d4af7f";
  const buyUrl = item.affiliateLink || `https://www.${item.platform?.toLowerCase()}.com/search?q=${encodeURIComponent(item.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-700 transition-all"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden bg-neutral-900" style={{ aspectRatio: "3/4" }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const fallback = (e.target as HTMLImageElement).nextElementSibling;
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
        ) : null}

        {/* Fallback */}
        <div className={`${item.image ? "hidden" : ""} absolute inset-0 flex flex-col items-center justify-center gap-1`}
          style={{ background: `${color}10` }}>
          <ShoppingBag className="w-8 h-8" style={{ color }} />
          <span className="text-xs font-medium" style={{ color }}>{item.category}</span>
        </div>

        {/* Like + Save */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.preventDefault(); onLike(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all"
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
            onClick={(e) => { e.preventDefault(); onSave(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all"
            style={{
              background: saved ? "rgba(212,175,127,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: saved ? "1px solid rgba(212,175,127,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "#000" : "none"} stroke={saved ? "#000" : "#fff"} />
          </motion.button>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: color }}>
          {item.category}
        </div>
      </div>

      <div className="p-3 bg-[#111111]">
        <p className="text-xs font-semibold text-neutral-200 leading-tight mb-2 line-clamp-2">{item.name}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${color}18`, color }}>
              {tag}
            </span>
          ))}
        </div>

        <StarRating rating={item.rating} />

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-neutral-300">{item.price}</span>
          <a href={buyUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity active:scale-95 text-black"
            style={{ background: `linear-gradient(135deg,${color},#b8860b)` }}>
            Buy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

interface OutfitResultCardProps {
  result: OutfitResult;
  platform: string;
}

export function OutfitResultCard({ result, platform }: OutfitResultCardProps) {
  const headerColor = PLATFORM_COLORS[platform] ?? "#d4af7f";
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const toggleLike = (i: number) => setLiked((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleSave = (i: number) => setSaved((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="w-full">
      {/* Platform badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: headerColor }}>
          {platform}
        </span>
        <span className="text-xs text-neutral-600">Item-level picks for you</span>
      </div>

      {/* Look header */}
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 shadow-sm p-4 mb-3">
        <h3 className="text-base font-bold text-white mb-2">{result.look_name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {result.tags?.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full font-bold"
              style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", color: "#000" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 4-item grid — always 2 columns */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {result.items.map((item: any, i: number) => (
          <ItemCard
            key={i}
            item={item}
            index={i}
            onLike={() => toggleLike(i)}
            onSave={() => toggleSave(i)}
            liked={liked.has(i)}
            saved={saved.has(i)}
          />
        ))}
      </div>

      {/* Liked/saved hint */}
      {(liked.size > 0 || saved.size > 0) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-neutral-500 text-center mb-3"
        >
          {liked.size > 0 && `❤️ ${liked.size} liked`}
          {liked.size > 0 && saved.size > 0 && "  ·  "}
          {saved.size > 0 && `🔖 ${saved.size} saved`}
          {" — scroll down to save to profile"}
        </motion.p>
      )}

      {/* Why this suits you */}
      <div className="rounded-2xl p-4 border border-neutral-800" style={{ background: "#111111" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "#d4af7f" }}>✨ Why this suits you</p>
        <p className="text-sm text-neutral-400 leading-relaxed">{result.look_reason}</p>
      </div>
    </div>
  );
}
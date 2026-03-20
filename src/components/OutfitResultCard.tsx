"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { OutfitItem, OutfitResult } from "@/lib/type";

const PLATFORM_COLORS: Record<string, string> = {
  Myntra:   "#FF3F6C",
  Ajio:     "#E65100",
  Amazon:   "#FF9900",
  Flipkart: "#2874F0",
  Meesho:   "#9C27B0",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${i <= Math.round(rating) ? "text-amber-400" : "text-neutral-700"}`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-neutral-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ItemCard({ item, index }: { item: OutfitItem & { image?: string; affiliateLink?: string }; index: number }) {
  const color = PLATFORM_COLORS[item.platform] ?? "#9c27b0";
  const buyUrl = item.affiliateLink || `https://www.${item.platform?.toLowerCase()}.com/search?q=${encodeURIComponent(item.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-700 transition-all"
    >
      {/* ✅ Real product image */}
      <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback to placeholder if image fails
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div
          className={`${item.image ? "hidden" : ""} absolute inset-0 flex flex-col items-center justify-center gap-1`}
          style={{ background: `${color}10` }}
        >
          <ShoppingBag className="w-8 h-8" style={{ color }} />
          <span className="text-xs font-medium" style={{ color }}>{item.category}</span>
        </div>

        {/* Category badge */}
        <div
          className="absolute bottom-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: color }}
        >
          {item.category}
        </div>
      </div>

      <div className="p-3 bg-[#111111]">
        {/* Product name */}
        <p className="text-xs font-semibold text-neutral-200 leading-tight mb-2 line-clamp-2">
          {item.name}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${color}18`, color }}
            >
              {tag}
            </span>
          ))}
        </div>

        <StarRating rating={item.rating} />

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-neutral-300">{item.price}</span>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity active:scale-95"
            style={{ background: `linear-gradient(135deg, ${color}, #9c27b0)` }}
          >
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
  const color = PLATFORM_COLORS[platform] ?? "#9c27b0";

  return (
    <div className="w-full">
      {/* Platform badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: color }}
        >
          {platform}
        </span>
        <span className="text-xs text-neutral-600">AI-curated for you</span>
      </div>

      {/* Look header */}
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 shadow-sm p-4 mb-3">
        <h3 className="text-base font-bold text-white mb-2">{result.look_name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", color: "#000" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ✅ Product grid with real images */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {result.items.map((item: any, i: number) => (
          <ItemCard key={i} item={{ ...item, platform }} index={i} />
        ))}
      </div>

      {/* Why this suits you */}
      <div
        className="rounded-2xl p-4 border border-neutral-800"
        style={{ background: "#111111" }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "#d4af7f" }}>
          ✨ Why this suits you
        </p>
        <p className="text-sm text-neutral-400 leading-relaxed">{result.look_reason}</p>
      </div>
    </div>
  );
}
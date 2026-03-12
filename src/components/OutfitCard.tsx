"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { OutfitItem, OutfitResult } from "@/lib/type";

const PLATFORM_COLORS: Record<string, string> = {
  Myntra:   "#FF3F6C",
  Ajio:     "#E65100",
  Amazon:   "#FF9900",
  Flipkart: "#2874F0",
  Meesho:   "#9C27B0",
};

const CATEGORY_ICONS: Record<string, string> = {
  Top: "👗", Bottom: "👖", Dress: "👗", Set: "✨",
  Footwear: "👟", Bag: "👜", Jewellery: "💍",
  Saree: "🥻", Suit: "👘", Kurta: "🧥", Jacket: "🧥",
  Lehenga: "👗", Blouse: "👗", Accessory: "⌚",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating}</span>
    </div>
  );
}

function ItemCard({ item, index }: { item: OutfitItem; index: number }) {
  const buyUrl = `https://www.${item.platform.toLowerCase()}.com/search?q=${encodeURIComponent(item.name)}`;
  const color = PLATFORM_COLORS[item.platform] ?? "#9c27b0";
  const icon = CATEGORY_ICONS[item.category] ?? "🛍️";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-purple-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image placeholder */}
      <div
        className="h-32 flex flex-col items-center justify-center gap-1"
        style={{ background: `${color}10` }}
      >
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-medium" style={{ color }}>{item.category}</span>
      </div>

      <div className="p-3">
        <p className="text-xs font-semibold text-gray-800 leading-tight mb-2 line-clamp-2">{item.name}</p>

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
          <span className="text-sm font-bold text-gray-900">{item.price}</span>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
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
      <p className="text-xs font-bold mb-2" style={{ color }}>
        {platform}
      </p>

      {/* Look header */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-4 mb-3">
        <h3 className="font-display text-base font-bold text-gray-900 mb-2">{result.look_name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-semibold text-white grad-btn"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {result.items.map((item, i) => (
          <ItemCard key={i} item={item} index={i} />
        ))}
      </div>

      {/* Why this suits you */}
      <div className="rounded-2xl p-4 border border-purple-100" style={{ background: "#fdf5ff" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "#e91e8c" }}>
          ✨ Why this suits you
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{result.look_reason}</p>
      </div>
    </div>
  );
}
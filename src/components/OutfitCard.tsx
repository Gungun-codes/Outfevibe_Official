"use client";

import { Heart, Bookmark } from "lucide-react";
import { useSavedOutfits } from "@/app/hooks/useSavedOutfits";
import { useAuth } from "@/context/authContext";

interface OutfitCardProps {
  card: {
    title: string;
    image: string;
    affiliateLink: string;
    categories: string[];
    gender: string;
  };
  darkMode: boolean;
}

export default function OutfitCard({ card, darkMode }: OutfitCardProps) {
  const { user } = useAuth();
  const { isLiked, isSaved, toggleOutfit } = useSavedOutfits(user?.id);

  const liked = isLiked(card.title);
  const saved = isSaved(card.title);

  return (
    <div
      className={`rounded-2xl overflow-hidden flex flex-col ${
        darkMode
          ? "bg-neutral-900 border border-neutral-800"
          : "bg-neutral-100 border border-neutral-200"
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Image — aspect ratio based so it never over-crops on any screen */}
      <div className="relative w-full overflow-hidden group" style={{ aspectRatio: "3/4" }}>
        <img
          src={card.image || ""}
          alt={card.title || ""}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Like + Save overlay buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleOutfit(card, "liked")}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              liked
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={liked ? "Unlike" : "Like"}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => toggleOutfit(card, "saved")}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              saved
                ? "bg-[#d4af7f] text-black shadow-lg shadow-[#d4af7f]/30"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={saved ? "Unsave" : "Save"}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Card body */}
      <div
        className={`flex flex-col flex-1 px-3 py-3 gap-2 ${
          darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"
        }`}
      >
        {/* Title — max 2 lines, full text visible */}
        <p className="font-medium text-xs leading-relaxed line-clamp-2 flex-1">
          {card.title || "Trending Fit"}
        </p>

        {/* Actions row */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/30">
          {card.affiliateLink ? (
            <a
              href={card.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-pink-500 hover:text-pink-400 transition"
            >
              Shop →
            </a>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleOutfit(card, "liked")}
              className={`flex items-center gap-1 text-xs transition ${
                liked ? "text-red-400" : "text-neutral-500 hover:text-red-400"
              }`}
            >
              <Heart className="w-3 h-3" fill={liked ? "currentColor" : "none"} />
              {liked ? "Liked" : "Like"}
            </button>

            <button
              onClick={() => toggleOutfit(card, "saved")}
              className={`flex items-center gap-1 text-xs transition ${
                saved ? "text-[#d4af7f]" : "text-neutral-500 hover:text-[#d4af7f]"
              }`}
            >
              <Bookmark className="w-3 h-3" fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
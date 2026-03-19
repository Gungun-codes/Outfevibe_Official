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
      className={`rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-neutral-900 border border-neutral-800"
          : "bg-neutral-100 border border-neutral-200"
      } shadow-sm`}
    >
      {/* Image */}
      <div className="h-60 w-full overflow-hidden relative group">
        <img
          src={card.image || ""}
          alt={card.title || ""}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Like + Save overlay buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Like */}
          <button
            onClick={() => toggleOutfit(card, "liked")}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              liked
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={liked ? "Unlike" : "Like"}
          >
            <Heart
              className="w-4 h-4"
              fill={liked ? "currentColor" : "none"}
            />
          </button>

          {/* Save */}
          <button
            onClick={() => toggleOutfit(card, "saved")}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              saved
                ? "bg-[#d4af7f] text-black shadow-lg shadow-[#d4af7f]/30"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={saved ? "Unsave" : "Save"}
          >
            <Bookmark
              className="w-4 h-4"
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* Card body */}
      <div
        className={`${
          darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"
        } px-4 py-3`}
      >
        <div className="font-medium text-sm line-clamp-2 mb-2">
          {card.title || "Trending Fit"}
        </div>

        <div className="flex items-center justify-between">
          {card.affiliateLink && (
            <a
              href={card.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-pink-500 hover:underline"
            >
              Shop →
            </a>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Inline like count feel */}
            <button
              onClick={() => toggleOutfit(card, "liked")}
              className={`flex items-center gap-1 text-xs transition ${
                liked ? "text-red-400" : "text-neutral-500 hover:text-red-400"
              }`}
            >
              <Heart
                className="w-3.5 h-3.5"
                fill={liked ? "currentColor" : "none"}
              />
              {liked ? "Liked" : "Like"}
            </button>

            <button
              onClick={() => toggleOutfit(card, "saved")}
              className={`flex items-center gap-1 text-xs transition ${
                saved
                  ? "text-[#d4af7f]"
                  : "text-neutral-500 hover:text-[#d4af7f]"
              }`}
            >
              <Bookmark
                className="w-3.5 h-3.5"
                fill={saved ? "currentColor" : "none"}
              />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
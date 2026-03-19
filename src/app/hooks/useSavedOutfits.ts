"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface SavedOutfit {
  id: string;
  outfit_title: string;
  outfit_image: string;
  outfit_link: string;
  category: string;
  gender: string;
  action: "liked" | "saved";
  created_at: string;
}

const LOCAL_LIKED_KEY = "outfevibe_liked_outfits";
const LOCAL_SAVED_KEY = "outfevibe_saved_outfits";

// ── Local Storage Helpers ──
function getLocalOutfits(key: string): SavedOutfit[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setLocalOutfits(key: string, outfits: SavedOutfit[]) {
  localStorage.setItem(key, JSON.stringify(outfits));
}

function getKey(action: "liked" | "saved") {
  return action === "liked" ? LOCAL_LIKED_KEY : LOCAL_SAVED_KEY;
}

// ── Main Hook ──
export function useSavedOutfits(userId?: string) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedOutfits, setLikedOutfits] = useState<SavedOutfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const liked = getLocalOutfits(LOCAL_LIKED_KEY);
    const saved = getLocalOutfits(LOCAL_SAVED_KEY);
    setLikedOutfits(liked);
    setSavedOutfits(saved);
    setLikedIds(new Set(liked.map((o) => `${o.outfit_title}-liked`)));
    setSavedIds(new Set(saved.map((o) => `${o.outfit_title}-saved`)));
    setLoading(false);
  }, []);

  // Sync from Supabase if logged in
  useEffect(() => {
    if (!userId) return;
    const syncFromSupabase = async () => {
      const { data, error } = await supabase
        .from("saved_outfits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) return;

      const liked = data.filter((o) => o.action === "liked");
      const saved = data.filter((o) => o.action === "saved");

      // Merge with localStorage (Supabase is source of truth when logged in)
      setLikedOutfits(liked);
      setSavedOutfits(saved);
      setLikedIds(new Set(liked.map((o) => `${o.outfit_title}-liked`)));
      setSavedIds(new Set(saved.map((o) => `${o.outfit_title}-saved`)));

      // Sync back to localStorage
      setLocalOutfits(LOCAL_LIKED_KEY, liked);
      setLocalOutfits(LOCAL_SAVED_KEY, saved);
    };

    syncFromSupabase();
  }, [userId]);

  const toggleOutfit = useCallback(
    async (
      outfit: {
        title: string;
        image: string;
        affiliateLink: string;
        categories: string[];
        gender: string;
      },
      action: "liked" | "saved"
    ) => {
      const key = getKey(action);
      const idKey = `${outfit.title}-${action}`;
      const isActive =
        action === "liked" ? likedIds.has(idKey) : savedIds.has(idKey);

      const outfitObj: SavedOutfit = {
        id: crypto.randomUUID(),
        outfit_title: outfit.title,
        outfit_image: outfit.image,
        outfit_link: outfit.affiliateLink,
        category: outfit.categories?.[0] || "general",
        gender: outfit.gender,
        action,
        created_at: new Date().toISOString(),
      };

      if (isActive) {
        // ── REMOVE ──
        const current = getLocalOutfits(key);
        const updated = current.filter((o) => o.outfit_title !== outfit.title);
        setLocalOutfits(key, updated);

        if (action === "liked") {
          setLikedOutfits(updated);
          setLikedIds((prev) => {
            const next = new Set(prev);
            next.delete(idKey);
            return next;
          });
        } else {
          setSavedOutfits(updated);
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(idKey);
            return next;
          });
        }

        // Remove from Supabase in background
        if (userId) {
          supabase
            .from("saved_outfits")
            .delete()
            .eq("user_id", userId)
            .eq("outfit_title", outfit.title)
            .eq("action", action)
            .then(() => {});
        }
      } else {
        // ── ADD ──
        const current = getLocalOutfits(key);
        const updated = [outfitObj, ...current];
        setLocalOutfits(key, updated);

        if (action === "liked") {
          setLikedOutfits(updated);
          setLikedIds((prev) => new Set([...prev, idKey]));
        } else {
          setSavedOutfits(updated);
          setSavedIds((prev) => new Set([...prev, idKey]));
        }

        // Save to Supabase in background
        if (userId) {
          supabase
            .from("saved_outfits")
            .insert([{ ...outfitObj, user_id: userId }])
            .then(() => {});
        }
      }
    },
    [likedIds, savedIds, userId]
  );

  const isLiked = useCallback(
    (title: string) => likedIds.has(`${title}-liked`),
    [likedIds]
  );

  const isSaved = useCallback(
    (title: string) => savedIds.has(`${title}-saved`),
    [savedIds]
  );

  return {
    likedOutfits,
    savedOutfits,
    likedIds,
    savedIds,
    isLiked,
    isSaved,
    toggleOutfit,
    loading,
  };
}
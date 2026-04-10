"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

// ── Limits ────────────────────────────────────────────────────────────────────
export const GUEST_LIMIT   = 1;   // guest (not signed in): 1 per day
export const USER_LIMIT    = 2;   // signed-in user: 2 per day
export const REFERRAL_BONUS = 1;  // +1 for users who referred a friend (one-time unlock)
// Total max for referrer = USER_LIMIT + REFERRAL_BONUS = 3

// ── localStorage keys (guest) ─────────────────────────────────────────────────
const LS_COUNT_KEY  = "outfevibe_outfit_count";
const LS_DATE_KEY   = "outfevibe_outfit_date";

// ── Daily reset at 12:00 PM (noon) ────────────────────────────────────────────
function getResetDateStr(): string {
  const now = new Date();
  // If it's before noon today, the "day bucket" is yesterday-noon → today-noon
  // i.e. the bucket key is the date of the most recent noon that has already passed.
  // Simplest: use "YYYY-MM-DD HH" where HH is the noon boundary.
  // We use the date portion of "the last noon that passed".
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (now < noon) {
    // Before noon: we're still in yesterday's noon bucket
    noon.setDate(noon.getDate() - 1);
  }
  return noon.toISOString().split("T")[0]; // "YYYY-MM-DD" of the noon that opened this bucket
}

function getGuestCount(): number {
  if (typeof window === "undefined") return 0;
  const storedDate  = localStorage.getItem(LS_DATE_KEY);
  const currentDate = getResetDateStr();
  if (storedDate !== currentDate) {
    localStorage.setItem(LS_DATE_KEY,  currentDate);
    localStorage.setItem(LS_COUNT_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(LS_COUNT_KEY) ?? "0", 10);
}

function incrementGuestCount() {
  const current = getGuestCount();
  localStorage.setItem(LS_COUNT_KEY, String(current + 1));
  localStorage.setItem(LS_DATE_KEY,  getResetDateStr());
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAnalysisLimit(userId: string | null | undefined) {

  /**
   * Returns { allowed, used, limit, hasReferral }
   * - allowed: whether the user can start a new outfit recommendation
   * - used: how many they've used today
   * - limit: their personal daily limit (1 / 2 / 3)
   * - hasReferral: whether they already unlocked the referral bonus
   */
  const checkLimit = useCallback(async (): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
    hasReferral: boolean;
  }> => {
    // ── Guest: localStorage ───────────────────────────────────────────────────
    if (!userId) {
      const used = getGuestCount();
      return {
        allowed:     used < GUEST_LIMIT,
        used,
        limit:       GUEST_LIMIT,
        hasReferral: false,
      };
    }

    // ── Logged-in: Supabase ───────────────────────────────────────────────────
    try {
      const today = getResetDateStr();

      // Fetch usage row and referral status in parallel
      const [usageRes, referralRes] = await Promise.all([
        supabase
          .from("outfit_usage")
          .select("count")
          .eq("user_id", userId)
          .eq("date", today)
          .single(),
        supabase
          .from("referrals")
          .select("id")
          .eq("referrer_id", userId)
          .limit(1),
      ]);

      const used        = usageRes.data?.count ?? 0;
      const hasReferral = (referralRes.data?.length ?? 0) > 0;
      const limit       = USER_LIMIT + (hasReferral ? REFERRAL_BONUS : 0);

      return { allowed: used < limit, used, limit, hasReferral };

    } catch {
      // Fail open — don't block user if DB is down
      return { allowed: true, used: 0, limit: USER_LIMIT, hasReferral: false };
    }
  }, [userId]);

  /**
   * Increment the usage counter after showing an outfit recommendation.
   */
  const incrementUsage = useCallback(async () => {
    if (!userId) {
      incrementGuestCount();
      return;
    }

    try {
      const today = getResetDateStr();

      const { data: existing } = await supabase
        .from("outfit_usage")
        .select("count")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        await supabase
          .from("outfit_usage")
          .update({ count: (existing.count ?? 0) + 1 })
          .eq("user_id", userId)
          .eq("date", today);
      } else {
        await supabase
          .from("outfit_usage")
          .insert({ user_id: userId, date: today, count: 1 });
      }
    } catch (e) {
      console.error("Usage increment failed:", e);
    }
  }, [userId]);

  return { checkLimit, incrementUsage, GUEST_LIMIT, USER_LIMIT, REFERRAL_BONUS };
}
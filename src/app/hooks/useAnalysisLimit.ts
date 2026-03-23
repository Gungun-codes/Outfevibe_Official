"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

// ── Constants ────────────────────────────────────────────────────────────────
const GUEST_LIMIT   = 1;   // guest: 1 free analysis
const USER_LIMIT    = 2;   // logged in: 2 per day
const LS_KEY        = "outfevibe_analysis_count";
const LS_DATE_KEY   = "outfevibe_analysis_date";

// ── Helpers ───────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0]; // "2026-03-21"
}

// ── TESTING: All limit helpers commented out ──────────────────────────────────
// function getGuestCount(): number {
//   if (typeof window === "undefined") return 0;
//   const date  = localStorage.getItem(LS_DATE_KEY);
//   const count = parseInt(localStorage.getItem(LS_KEY) ?? "0", 10);
//   if (date !== todayStr()) {
//     localStorage.setItem(LS_DATE_KEY, todayStr());
//     localStorage.setItem(LS_KEY, "0");
//     return 0;
//   }
//   return count;
// }

// function incrementGuestCount() {
//   const current = getGuestCount();
//   localStorage.setItem(LS_KEY, String(current + 1));
//   localStorage.setItem(LS_DATE_KEY, todayStr());
// }

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAnalysisLimit(userId: string | null | undefined) {

  // ── TESTING: Always allow — limit checks bypassed ─────────────────────────
  const checkLimit = useCallback(async (): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
  }> => {
    return { allowed: true, used: 0, limit: USER_LIMIT };

    // ── Restore below when testing is done ───────────────────────────────────
    // // ── Guest: localStorage ─────────────────────────────────────────────────
    // if (!userId) {
    //   const used = getGuestCount();
    //   return { allowed: used < GUEST_LIMIT, used, limit: GUEST_LIMIT };
    // }

    // // ── Logged-in: Supabase ─────────────────────────────────────────────────
    // try {
    //   const today = todayStr();

    //   const { data, error } = await supabase
    //     .from("analysis_usage")
    //     .select("count")
    //     .eq("user_id", userId)
    //     .eq("date", today)
    //     .single();

    //   if (error && error.code !== "PGRST116") {
    //     // PGRST116 = no rows found (first time today)
    //     console.error("Usage check error:", error);
    //     return { allowed: true, used: 0, limit: USER_LIMIT }; // fail open
    //   }

    //   const used = data?.count ?? 0;
    //   return { allowed: used < USER_LIMIT, used, limit: USER_LIMIT };

    // } catch {
    //   return { allowed: true, used: 0, limit: USER_LIMIT }; // fail open
    // }
  }, [userId]);

  // ── TESTING: incrementUsage is a no-op ───────────────────────────────────
  const incrementUsage = useCallback(async () => {
    return;

    // ── Restore below when testing is done ───────────────────────────────────
    // if (!userId) {
    //   incrementGuestCount();
    //   return;
    // }

    // try {
    //   const today = todayStr();

    //   // Upsert: increment count or create row
    //   const { data: existing } = await supabase
    //     .from("analysis_usage")
    //     .select("count")
    //     .eq("user_id", userId)
    //     .eq("date", today)
    //     .single();

    //   if (existing) {
    //     await supabase
    //       .from("analysis_usage")
    //       .update({ count: (existing.count ?? 0) + 1 })
    //       .eq("user_id", userId)
    //       .eq("date", today);
    //   } else {
    //     await supabase
    //       .from("analysis_usage")
    //       .insert({ user_id: userId, date: today, count: 1 });
    //   }
    // } catch (e) {
    //   console.error("Usage increment failed:", e);
    // }
  }, [userId]);

  return { checkLimit, incrementUsage, GUEST_LIMIT, USER_LIMIT };
}
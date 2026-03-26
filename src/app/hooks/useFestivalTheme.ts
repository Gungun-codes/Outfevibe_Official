// ── In useFestivalTheme.ts ────────────────────────────────────────────────
// PROBLEM: useState("default") always renders Eid hero first
// FIX: Calculate the correct theme synchronously before first render

"use client";

import { useState, useEffect } from "react";

export const FESTIVAL_OVERRIDES = {
  EID: false,
  NAVRATRI: false,
  MAHAVIR_JAYANTI: true,
  DIWALI: false,
  HOLI: false,
  INDEPENDENCE_DAY: false,
};

export type FestivalTheme =
  | "eid" | "navratri" | "mahavir_jayanti"
  | "diwali" | "holi" | "independence_day" | "default";

// ✅ Run synchronously — no useEffect needed
function detectTheme(): FestivalTheme {
  // Manual overrides first
  if (FESTIVAL_OVERRIDES.EID)              return "eid";
  if (FESTIVAL_OVERRIDES.NAVRATRI)         return "navratri";
  if (FESTIVAL_OVERRIDES.MAHAVIR_JAYANTI)  return "mahavir_jayanti";
  if (FESTIVAL_OVERRIDES.DIWALI)           return "diwali";
  if (FESTIVAL_OVERRIDES.HOLI)             return "holi";
  if (FESTIVAL_OVERRIDES.INDEPENDENCE_DAY) return "independence_day";

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  const d = now.getDate();
  const h = now.getHours();

  if (y === 2026) {
    // Holi: Mar 13–14
    if (m === 2 && d >= 13 && d <= 14) return "holi";

    // Eid: Mar 20 to Mar 21 before 12pm
    if (m === 2 && (d === 20 || (d === 21 && h < 12))) return "eid";

    // Chaitra Navratri: Mar 21 12pm to Mar 26
    if (m === 2 && ((d === 21 && h >= 12) || (d >= 22 && d <= 26))) return "navratri";

    // Mahavir Jayanti: Mar 27 to Apr 4
    if ((m === 2 && d >= 27) || (m === 3 && d >= 1 && d <= 4)) return "mahavir_jayanti";

    // Independence Day: Aug 11–15
    if (m === 7 && d >= 11 && d <= 15) return "independence_day";

    // Sharad Navratri: Oct 2–11
    if (m === 9 && d >= 2 && d <= 11) return "navratri";

    // Diwali: Oct 15–22
    if (m === 9 && d >= 15 && d <= 22) return "diwali";
  }

  if (y === 2025 && m === 9 && d >= 2 && d <= 11) return "navratri";

  return "default";
}

export function useFestivalTheme(): FestivalTheme {
  // ✅ Initialize with correct value immediately — no flash
  const [theme] = useState<FestivalTheme>(() => detectTheme());
  return theme;
}
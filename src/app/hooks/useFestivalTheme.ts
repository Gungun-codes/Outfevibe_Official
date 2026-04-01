"use client";

import { useState } from "react";

// ── Manual overrides — flip to true to force a festival theme ────────────────
// ⚠️  Remember to set back to false after the festival ends
export const FESTIVAL_OVERRIDES = {
  EID: false,
  NAVRATRI: false,
  MAHAVIR_JAYANTI: false,
  DIWALI: false,
  HOLI: false,
  INDEPENDENCE_DAY: false,
};

export type FestivalTheme =
  | "eid"
  | "navratri"
  | "mahavir_jayanti"
  | "diwali"
  | "holi"
  | "independence_day"
  | "default";

// Runs synchronously — no useEffect, no hydration flash
function detectTheme(): FestivalTheme {
  // Manual overrides take priority over date logic
  if (FESTIVAL_OVERRIDES.EID) return "eid";
  if (FESTIVAL_OVERRIDES.NAVRATRI) return "navratri";
  if (FESTIVAL_OVERRIDES.MAHAVIR_JAYANTI) return "mahavir_jayanti";
  if (FESTIVAL_OVERRIDES.DIWALI) return "diwali";
  if (FESTIVAL_OVERRIDES.HOLI) return "holi";
  if (FESTIVAL_OVERRIDES.INDEPENDENCE_DAY) return "independence_day";

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed: Jan=0, Mar=2, Apr=3
  const d = now.getDate();
  const h = now.getHours();

  if (y === 2026) {
    // Holi: Mar 13–14
    if (m === 2 && d >= 13 && d <= 14) return "holi";

    // Eid: Mar 20 – Mar 21 before noon
    if (m === 2 && (d === 20 || (d === 21 && h < 12))) return "eid";

    // Chaitra Navratri: Mar 21 noon – Mar 26
    if (m === 2 && ((d === 21 && h >= 12) || (d >= 22 && d <= 26))) return "navratri";

    // Mahavir Jayanti: Mar 27–31 only
    // ✅ Fixed: was (m===3 && d<=4) which caught Apr 1–4 — today is Apr 1!
    if (m === 2 && d >= 27) return "mahavir_jayanti";

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
  // Initialized synchronously — correct value on first render, no flash
  const [theme] = useState<FestivalTheme>(() => detectTheme());
  return theme;
}
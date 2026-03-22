"use client";

import { useState, useEffect } from "react";

// ================================================================
// OUTFEVIBE — FESTIVAL CALENDAR
// ================================================================
// To TEST any festival → set its override to true
// To GO LIVE → set all overrides to false (dates auto-detect)
// ================================================================

export const FESTIVAL_OVERRIDES = {
  EID: false,
  NAVRATRI: true,
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

export function useFestivalTheme(): FestivalTheme {
  const [theme, setTheme] = useState<FestivalTheme>("default");

  useEffect(() => {
    // ── Manual overrides ─────────────────────────────────────
    if (FESTIVAL_OVERRIDES.EID)               { setTheme("eid");               return; }
    if (FESTIVAL_OVERRIDES.NAVRATRI)          { setTheme("navratri");           return; }
    if (FESTIVAL_OVERRIDES.MAHAVIR_JAYANTI)   { setTheme("mahavir_jayanti");    return; }
    if (FESTIVAL_OVERRIDES.DIWALI)            { setTheme("diwali");             return; }
    if (FESTIVAL_OVERRIDES.HOLI)              { setTheme("holi");               return; }
    if (FESTIVAL_OVERRIDES.INDEPENDENCE_DAY)  { setTheme("independence_day");   return; }

    // ── Auto date detection ───────────────────────────────────
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-indexed (0=Jan, 9=Oct)
    const d = now.getDate();
    const h = now.getHours();

    // ── 2026 ─────────────────────────────────────────────────

    // Holi: Mar 13–14
    if (y === 2026 && m === 2 && d >= 13 && d <= 14) {
      setTheme("holi"); return;
    }

    // Eid: Mar 20 to Mar 21 before 12pm
    if (y === 2026 && m === 2 && (d === 20 || (d === 21 && h < 12))) {
      setTheme("eid"); return;
    }

    // Chaitra Navratri: Mar 21 12pm to Mar 26
    if (y === 2026 && m === 2 && ((d === 21 && h >= 12) || (d >= 22 && d <= 26))) {
      setTheme("navratri"); return;
    }

    // Mahavir Jayanti: Mar 27 to Apr 4
    if (y === 2026 && ((m === 2 && d >= 27) || (m === 3 && d >= 1))) {
      setTheme("mahavir_jayanti"); return;
    }

    // Independence Day: Aug 11–15
    if (y === 2026 && m === 7 && d >= 11 && d <= 15) {
      setTheme("independence_day"); return;
    }

    // Sharad Navratri: Oct 2–11 (approx — update when confirmed)
    if (y === 2026 && m === 9 && d >= 2 && d <= 11) {
      setTheme("navratri"); return;
    }

    // Diwali: Oct 15–22 (approx — update when confirmed)
    if (y === 2026 && m === 9 && d >= 15 && d <= 22) {
      setTheme("diwali"); return;
    }

    // ── 2025 fallback ─────────────────────────────────────────
    if (y === 2025 && m === 9 && d >= 2 && d <= 11) {
      setTheme("navratri"); return;
    }

    setTheme("default");
  }, []);

  return theme;
}
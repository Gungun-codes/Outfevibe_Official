"use client";

// ================================================================
// FestivalHero — Master switcher
// Drop this into page.tsx — it handles all festival hero swaps
// automatically based on date or manual override
// ================================================================

import { useFestivalTheme } from "@/app/hooks/useFestivalTheme";
import NavratriHero from "@/components/NavratriHero";
import MahavirJayantiHero from "@/components/MahavirJayantiHero";

interface FestivalHeroProps {
  darkMode: boolean;
  defaultHero: React.ReactNode;
}

export default function FestivalHero({ darkMode, defaultHero }: FestivalHeroProps) {
  const festival = useFestivalTheme();

  switch (festival) {
    case "navratri":
      return <NavratriHero darkMode={darkMode} />;

    case "mahavir_jayanti":
      return <MahavirJayantiHero darkMode={darkMode} />;

    // Add more festivals below as you build them:
    // case "diwali":
    //   return <DiwaliHero darkMode={darkMode} />;
    // case "holi":
    //   return <HoliHero darkMode={darkMode} />;
    // case "independence_day":
    //   return <IndependenceDayHero darkMode={darkMode} />;

    default:
      return <>{defaultHero}</>;
  }
}
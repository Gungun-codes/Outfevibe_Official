import { useEffect, useRef, useState } from "react";

interface StreakData {
  streak_count: number;
  longest_streak: number;
  badges: string[];
  new_badge: string | null;
  already_done: boolean;
}

export function useStreak(userId: string | null) {
  const [streak, setStreak]   = useState<StreakData | null>(null);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef          = useRef(false);

  useEffect(() => {
    if (!userId || triggeredRef.current) return;

    // Trigger streak after 30 seconds of being on page
    timerRef.current = setTimeout(async () => {
      triggeredRef.current = true;
      try {
        const res  = await fetch("/api/streak/update", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ userId }),
        });
        const data = await res.json();
        setStreak(data);
      } catch (err) {
        console.error("Streak update failed", err);
      }
    }, 30_000); // 30 seconds

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userId]);

  return streak;
}
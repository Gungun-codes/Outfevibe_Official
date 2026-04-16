import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStreak } from "@/app/hooks/useStreak";

const BADGE_LABELS: Record<string, { emoji: string; label: string }> = {
  "3_day_streak":        { emoji: "🔥", label: "3-Day Streak" },
  "week_warrior":        { emoji: "⚡", label: "Week Warrior" },
  "fortnight_fashionista":{ emoji: "💎", label: "Fortnight Fashionista" },
  "style_legend":        { emoji: "👑", label: "Style Legend" },
};

export function StreakBadge({ userId }: { userId: string }) {
  const streak                        = useStreak(userId);
  const [showCelebration, setShow]    = useState(false);

  useEffect(() => {
    if (streak?.new_badge) setShow(true);
  }, [streak?.new_badge]);

  if (!streak) return null;

  return (
    <>
      {/* Streak counter — always visible */}
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-bold text-[#d4af7f]">{streak.streak_count}</span>
        <span className="text-xs text-neutral-400">day streak</span>
        {streak.already_done && (
          <span className="text-xs text-green-500 ml-1">✓ done today</span>
        )}
      </div>

      {/* New badge celebration popup */}
      <AnimatePresence>
        {showCelebration && streak.new_badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111] border border-[#d4af7f] rounded-2xl px-6 py-4 shadow-2xl text-center"
          >
            <p className="text-3xl mb-1">
              {BADGE_LABELS[streak.new_badge]?.emoji ?? "🏅"}
            </p>
            <p className="text-white font-bold text-sm">Badge Unlocked!</p>
            <p className="text-[#d4af7f] font-bold">
              {BADGE_LABELS[streak.new_badge]?.label}
            </p>
            <button
              onClick={() => setShow(false)}
              className="mt-3 text-xs text-neutral-500 underline"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
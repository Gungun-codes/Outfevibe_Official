"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStreak } from "@/app/hooks/useStreak";

const BADGE_LABELS: Record<string, { emoji: string; label: string }> = {
  "3_day_streak":          { emoji: "🔥", label: "3-Day Streak" },
  "week_warrior":          { emoji: "⚡", label: "Week Warrior" },
  "fortnight_fashionista": { emoji: "💎", label: "Fortnight Fashionista" },
  "style_legend":          { emoji: "👑", label: "Style Legend" },
};

const MILESTONE_REWARDS: Record<number, string> = {
  3:  "Badge unlocked 🔥",
  7:  "+1 outfit rec per day ⚡",
  14: "Early access to drops 💎",
  30: "Unlimited recommendations 👑",
};

const NEXT_MILESTONES = [3, 7, 14, 30];

export function StreakBadge({ userId }: { userId: string }) {
  const streak                         = useStreak(userId);
  const [showCelebration, setShow]     = useState(false);
  const [freezeLoading, setFreezeLoad] = useState(false);
  const [freezeMsg, setFreezeMsg]      = useState<string | null>(null);
  const [freezeCount, setFreezeCount]  = useState<number>(1);

  useEffect(() => {
    if (streak?.new_badge) setShow(true);
    if (streak?.freeze_count !== undefined) setFreezeCount(streak.freeze_count);
  }, [streak?.new_badge, streak?.freeze_count]);

  const handleFreeze = async () => {
    setFreezeLoad(true);
    try {
      const res  = await fetch("/api/streak/freeze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setFreezeMsg(`🧊 Freeze used! Your ${data.streak_count}-day streak is safe.`);
        setFreezeCount(0);
      } else {
        setFreezeMsg(data.error ?? "Could not apply freeze.");
      }
    } catch {
      setFreezeMsg("Something went wrong.");
    } finally {
      setFreezeLoad(false);
      setTimeout(() => setFreezeMsg(null), 4000);
    }
  };

  if (!streak) return null;

  const nextMilestone = NEXT_MILESTONES.find((m) => streak.streak_count < m);
  const prevMilestone = nextMilestone
    ? NEXT_MILESTONES[NEXT_MILESTONES.indexOf(nextMilestone) - 1] ?? 0
    : 30;
  const progress = nextMilestone
    ? ((streak.streak_count - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 100;

  return (
    <>
      {/* ── Main streak widget ── */}
      <div className="w-full max-w-sm bg-[#111111] border border-neutral-800 rounded-2xl p-4 space-y-3">

        {/* Top row — streak count + done today */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-lg font-extrabold text-[#d4af7f] leading-none">{streak.streak_count} days</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {streak.already_done ? "✓ Done today" : "Visit daily to keep your streak"}
              </p>
            </div>
          </div>
          {streak.already_done && (
            <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full font-semibold">
              ✓ Streak safe
            </span>
          )}
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div>
            <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
              <span>Next: Day {nextMilestone} — {MILESTONE_REWARDS[nextMilestone]}</span>
              <span>{streak.streak_count}/{nextMilestone}</span>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#d4af7f,#b8860b)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Milestone rewards list */}
        <div className="grid grid-cols-2 gap-1.5">
          {NEXT_MILESTONES.map((m) => {
            const unlocked = streak.streak_count >= m;
            return (
              <div key={m}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                  unlocked
                    ? "border-[#d4af7f]/30 bg-[#d4af7f]/8 text-[#d4af7f]"
                    : "border-neutral-800 bg-neutral-900/50 text-neutral-600"
                }`}>
                <span>{unlocked ? "✓" : "○"}</span>
                <span>Day {m} — {MILESTONE_REWARDS[m]}</span>
              </div>
            );
          })}
        </div>

        {/* Freeze button */}
        <div className="pt-1 border-t border-neutral-800">
          {freezeMsg ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs text-center text-[#d4af7f] py-1">
              {freezeMsg}
            </motion.p>
          ) : freezeCount > 0 ? (
            <button
              onClick={handleFreeze}
              disabled={freezeLoading || streak.already_done}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-semibold hover:bg-blue-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {freezeLoading ? "Applying…" : "🧊 Use Streak Freeze (1 left this month)"}
            </button>
          ) : (
            <p className="text-[10px] text-neutral-600 text-center py-1">
              ❄️ No freezes left this month — resets on the 1st
            </p>
          )}
        </div>
      </div>

      {/* ── Badge celebration popup ── */}
      <AnimatePresence>
        {showCelebration && streak.new_badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111] border border-[#d4af7f] rounded-2xl px-6 py-5 shadow-2xl text-center min-w-[240px]"
          >
            <p className="text-4xl mb-2">
              {BADGE_LABELS[streak.new_badge]?.emoji ?? "🏅"}
            </p>
            <p className="text-white font-bold text-sm">Badge Unlocked!</p>
            <p className="text-[#d4af7f] font-bold text-base mt-0.5">
              {BADGE_LABELS[streak.new_badge]?.label}
            </p>
            {streak.new_reward && (
              <p className="text-xs text-neutral-400 mt-2 border-t border-neutral-800 pt-2">
                🎁 Reward: {streak.new_reward}
              </p>
            )}
            <button
              onClick={() => setShow(false)}
              className="mt-3 text-xs text-neutral-500 hover:text-neutral-400 underline"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
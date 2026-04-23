import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Milestone definitions
const MILESTONES: Record<number, { badge: string; reward: string; limitBonus: number }> = {
  3:  { badge: "3_day_streak",          reward: "3-Day Streak badge 🔥",                    limitBonus: 0 },
  7:  { badge: "week_warrior",          reward: "+1 outfit recommendation per day ⚡",        limitBonus: 1 },
  14: { badge: "fortnight_fashionista", reward: "Early access to new outfit drops 💎",        limitBonus: 0 },
  30: { badge: "style_legend",          reward: "Unlimited recommendations forever 👑",       limitBonus: 99 },
};

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data: profile, error } = await supabase
      .from("users_profile")
      .select("streak_count, last_streak_date, longest_streak, badges, outfit_limit_bonus, freeze_count, freeze_used_month, freeze_reset_month")
      .eq("id", userId)
      .single();

    if (error || !profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const today     = new Date().toISOString().split("T")[0];
    const lastDate  = profile.last_streak_date;

    // Already logged today
    if (lastDate === today) {
      return NextResponse.json({
        streak_count:       profile.streak_count,
        longest_streak:     profile.longest_streak,
        already_done:       true,
        badges:             profile.badges ?? [],
        new_badge:          null,
        outfit_limit_bonus: profile.outfit_limit_bonus ?? 0,
        freeze_count:       profile.freeze_count ?? 1,
      });
    }

    const yesterday      = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const isConsecutive  = lastDate === yesterday;
    const newStreak      = isConsecutive ? profile.streak_count + 1 : 1;
    const newLongest     = Math.max(newStreak, profile.longest_streak ?? 0);

    // Check badge + reward milestones
    const currentBadges: string[] = profile.badges ?? [];
    const newBadges    = [...currentBadges];
    let   newBadge: string | null = null;
    let   newReward: string | null = null;
    let   limitBonusDelta = 0;

    const milestone = MILESTONES[newStreak];
    if (milestone && !currentBadges.includes(milestone.badge)) {
      newBadges.push(milestone.badge);
      newBadge       = milestone.badge;
      newReward      = milestone.reward;
      limitBonusDelta = milestone.limitBonus;
    }

    const currentBonus   = profile.outfit_limit_bonus ?? 0;
    const newLimitBonus  = Math.min(currentBonus + limitBonusDelta, 99); // cap at 99 = unlimited

    await supabase
      .from("users_profile")
      .update({
        streak_count:       newStreak,
        last_streak_date:   today,
        longest_streak:     newLongest,
        badges:             newBadges,
        outfit_limit_bonus: newLimitBonus,
        last_active:        new Date().toISOString(),
      })
      .eq("id", userId);

    // Send milestone push notification if earned
    if (newBadge && newReward) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            type:    "streak_milestone",
            payload: `${newStreak} days — ${newReward}`,
            userId,
          }),
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({
      streak_count:       newStreak,
      longest_streak:     newLongest,
      already_done:       false,
      new_badge:          newBadge,
      new_reward:         newReward,
      badges:             newBadges,
      outfit_limit_bonus: newLimitBonus,
      freeze_count:       profile.freeze_count ?? 1,
    });

  } catch (err) {
    console.error("[streak/update]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
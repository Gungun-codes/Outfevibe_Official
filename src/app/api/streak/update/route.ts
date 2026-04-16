import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // Fetch current profile
    const { data: profile, error } = await supabase
      .from("user_profile")
      .select("streak_count, last_streak_date, longest_streak, badges")
      .eq("id", userId)
      .single();

    if (error || !profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0]; // "2024-01-15"
    const lastDate = profile.last_streak_date;

    // Already logged today — no update needed
    if (lastDate === today) {
      return NextResponse.json({
        streak_count: profile.streak_count,
        already_done: true,
        badges: profile.badges,
      });
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const isConsecutive = lastDate === yesterday;

    // Calculate new streak
    const newStreak = isConsecutive ? profile.streak_count + 1 : 1;
    const newLongest = Math.max(newStreak, profile.longest_streak ?? 0);

    // Check badge milestones
    const currentBadges: string[] = profile.badges ?? [];
    const milestones: Record<number, string> = {
      3:  "3_day_streak",
      7:  "week_warrior",
      14: "fortnight_fashionista",
      30: "style_legend",
    };

    const newBadges = [...currentBadges];
    if (milestones[newStreak] && !currentBadges.includes(milestones[newStreak])) {
      newBadges.push(milestones[newStreak]);
    }

    // Update profile
    await supabase
      .from("user_profile")
      .update({
        streak_count:    newStreak,
        last_streak_date: today,
        longest_streak:  newLongest,
        badges:          newBadges,
        last_active:     new Date().toISOString(),
      })
      .eq("id", userId);

    return NextResponse.json({
      streak_count:  newStreak,
      longest_streak: newLongest,
      already_done:  false,
      new_badge:     milestones[newStreak] ?? null,
      badges:        newBadges,
    });

  } catch (err) {
    console.error("[streak/update]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
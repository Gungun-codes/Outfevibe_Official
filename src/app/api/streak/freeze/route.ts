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

    const { data: profile, error } = await supabase
      .from("users_profile")
      .select("streak_count, last_streak_date, freeze_count, freeze_used_month, freeze_reset_month, badges, longest_streak, outfit_limit_bonus")
      .eq("id", userId)
      .single();

    if (error || !profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const currentMonth = new Date().getMonth(); // 0-11

    // Reset freeze if it's a new month
    let freezeCount      = profile.freeze_count      ?? 1;
    let freezeUsedMonth  = profile.freeze_used_month  ?? 0;
    const freezeResetMonth = profile.freeze_reset_month ?? -1;

    if (freezeResetMonth !== currentMonth) {
      // New month — reset the used flag and give 1 freeze back
      freezeCount     = 1;
      freezeUsedMonth = 0;
    }

    // Already used freeze this month
    if (freezeUsedMonth === 1) {
      return NextResponse.json({
        success: false,
        error:   "You've already used your freeze this month. It resets on the 1st of next month.",
        freeze_count: 0,
      });
    }

    // No streak to freeze
    if (!profile.streak_count || profile.streak_count === 0) {
      return NextResponse.json({ success: false, error: "No active streak to freeze." });
    }

    // Check if yesterday was actually missed (freeze only applies when streak is at risk)
    const today     = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastDate  = profile.last_streak_date;

    if (lastDate === today) {
      return NextResponse.json({ success: false, error: "Your streak is safe today — no freeze needed!" });
    }

    if (lastDate !== yesterday && lastDate !== today) {
      return NextResponse.json({
        success: false,
        error:   "Your streak already broke. A freeze can only protect a streak that was active yesterday.",
      });
    }

    // Apply freeze — set last_streak_date to today so streak continues
    await supabase
      .from("users_profile")
      .update({
        last_streak_date:   today,
        freeze_used_month:  1,
        freeze_reset_month: currentMonth,
        freeze_count:       0,
        last_active:        new Date().toISOString(),
      })
      .eq("id", userId);

    return NextResponse.json({
      success:      true,
      message:      `Streak freeze used! Your ${profile.streak_count}-day streak is safe 🧊`,
      streak_count: profile.streak_count,
      freeze_count: 0,
    });

  } catch (err) {
    console.error("[streak/freeze]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
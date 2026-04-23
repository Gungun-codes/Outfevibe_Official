import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export async function GET() {
  const vapidEmail      = process.env.VAPID_EMAIL;
  const vapidPublicKey  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "VAPID not configured" }, { status: 503 });
  }

  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

  // ✅ Supabase inside handler
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const today = new Date().toISOString().split("T")[0];

    // Find users who:
    // 1. Have an active streak (streak_count > 0)
    // 2. Have NOT visited today yet (last_streak_date != today)
    // 3. Visited yesterday (so streak is at risk, not already broken)
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const { data: atRiskUsers } = await supabase
      .from("users_profile")
      .select("id, streak_count")
      .gt("streak_count", 0)
      .eq("last_streak_date", yesterday); // visited yesterday but not today

    if (!atRiskUsers || atRiskUsers.length === 0) {
      return NextResponse.json({ sent: 0, message: "No at-risk streaks" });
    }

    let sent = 0;

    for (const user of atRiskUsers) {
      // Get their push subscriptions
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user.id);

      if (!subs || subs.length === 0) continue;

      const notification = {
        title: "⚠️ Your streak is about to break!",
        body:  `You have a ${user.streak_count}-day streak 🔥 Visit Outfevibe before midnight to keep it alive!`,
        url:   "https://www.outfevibe.com/outfit",
      };

      const results = await Promise.allSettled(
        subs.map((sub) =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify(notification)
          )
        )
      );

      // Clean expired subs
      const expired = subs.filter(
        (_, i) =>
          results[i].status === "rejected" &&
          (results[i] as PromiseRejectedResult).reason?.statusCode === 410
      );
      if (expired.length > 0) {
        await Promise.all(
          expired.map((sub) =>
            supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint)
          )
        );
      }

      const userSent = results.filter((r) => r.status === "fulfilled").length;
      if (userSent > 0) sent++;
    }

    console.log(`[streak-warning] Sent warnings to ${sent}/${atRiskUsers.length} users`);
    return NextResponse.json({ success: true, sent, total: atRiskUsers.length });

  } catch (err) {
    console.error("[streak-warning cron]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Notification templates for each event type
export const NOTIFICATION_TEMPLATES = {
  new_feature: (featureName: string) => ({
    title: "New on Outfevibe ✨",
    body: `${featureName} is now live! Come check it out.`,
    url: "https://www.outfevibe.com",
  }),
  weekly_style_drop: () => ({
    title: "Weekly Style Drop 🔥",
    body: "Fresh outfits just dropped. See what's trending this week.",
    url: "https://www.outfevibe.com/#trending",
  }),
  quiz_completed: (persona: string) => ({
    title: "Your Style Persona is Ready 🎯",
    body: `You're a ${persona}! See your personalised outfit picks.`,
    url: "https://www.outfevibe.com/profile",
  }),
  outfit_milestone: (count: number) => ({
    title: "Style Milestone 💫",
    body: `You've saved ${count} outfits! Your wardrobe is taking shape.`,
    url: "https://www.outfevibe.com/profile",
  }),
  festival_campaign: (festival: string) => ({
    title: `${festival} Looks Are Here ✨`,
    body: `Discover curated ${festival} outfits made for you.`,
    url: "https://www.outfevibe.com/#trending",
  }),
  new_trending: () => ({
    title: "New Trending Outfits Added 👗",
    body: "We just added fresh looks to the trending section. Go explore!",
    url: "https://www.outfevibe.com/#trending",
  }),
};

export async function POST(req: NextRequest) {
  try {
    const { type, payload, userId } = await req.json();

    if (!type || !NOTIFICATION_TEMPLATES[type as keyof typeof NOTIFICATION_TEMPLATES]) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    // Build notification data from template
    const template = NOTIFICATION_TEMPLATES[type as keyof typeof NOTIFICATION_TEMPLATES];
    const notificationData = (template as any)(payload || "");

    // Fetch subscriptions — either specific user or all
    let query = supabase.from("push_subscriptions").select("*");
    if (userId) query = query.eq("user_id", userId);

    const { data: subscriptions, error } = await query;

    if (error || !subscriptions?.length) {
      return NextResponse.json({ sent: 0, message: "No subscriptions found" });
    }

    // Send to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(notificationData)
        )
      )
    );

    // Clean up expired subscriptions (410 Gone)
    const expired = subscriptions.filter(
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

    const sent = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({ success: true, sent, total: subscriptions.length });
  } catch (err) {
    console.error("Push send error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
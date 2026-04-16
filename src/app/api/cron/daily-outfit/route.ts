import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // ✅ Move INSIDE the function — not at module level
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const resend = new Resend(process.env.RESEND_API_KEY!);

  const { data: users } = await supabase
    .from("profiles")
    .select("email, name")
    .lt("last_active", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());

  if (!users || users.length === 0)
    return NextResponse.json({ sent: 0 });

  const results = await Promise.allSettled(
    users.map((user) =>
      resend.emails.send({
        from: "Outfevibe <hello@outfevibe.com>",
        to: user.email,
        subject: "✨ Your daily outfit is ready!",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:16px;">
            <h2 style="color:#d4af7f;">Hey ${user.name}! 👋</h2>
            <p style="color:#a3a3a3;">Your personalised outfit for today is waiting.</p>
            <a href="https://www.outfevibe.com" style="display:inline-block;background:linear-gradient(to right,#d4af7f,#b8860b);color:#000;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">
              See My Outfit →
            </a>
          </div>
        `,
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ sent, total: users.length });
}
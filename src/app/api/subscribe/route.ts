import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase is safe at module level — it uses NEXT_PUBLIC_ vars
//    which ARE available at build time (they're inlined by Next.js)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  // ✅ Resend instantiated lazily — only when the route is actually called,
  //    not at module load time during `next build`
  const apiKey = process.env.RESEND_API_KEY;

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Save to Supabase feedback table
    const { error: dbError } = await supabase
      .from("feedback")
      .insert([{ email, name: "Newsletter Subscriber", message: "Subscribed via Stay Updated" }]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
    }

    // Send welcome email only if API key is configured
    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error: emailError } = await resend.emails.send({
        from: "Outfevibe <onboarding@resend.dev>",
        to: email,
        subject: "You're on the list ✨ Welcome to Outfevibe",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
            <img src="https://www.outfevibe.com/outfevibe_logo.png" alt="Outfevibe" style="height: 32px; margin-bottom: 24px;" />
            <h1 style="font-size: 28px; font-weight: 700; color: #d4af7f; margin-bottom: 8px;">
              You're on the list ✨
            </h1>
            <p style="color: #a3a3a3; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
              Hey there! Welcome to <strong style="color: #ffffff;">Outfevibe</strong> — AI-powered styling that understands identity, not just clothes.
            </p>
            <p style="color: #a3a3a3; font-size: 15px; line-height: 1.7; margin-bottom: 32px;">
              You'll be the first to know about new features, style drops, and exclusive early access. Stay tuned 🔥
            </p>
            <a href="https://www.outfevibe.com" style="display: inline-block; background: linear-gradient(to right, #d4af7f, #b8860b); color: #000000; font-weight: 700; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 14px;">
              Explore Outfevibe →
            </a>
            <p style="color: #4a4a4a; font-size: 12px; margin-top: 40px;">
              © ${new Date().getFullYear()} Outfevibe. Built with intention.
            </p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Resend error:", emailError);
        // Still return success — subscriber is saved even if email send fails
      }
    } else {
      console.warn("RESEND_API_KEY not set — welcome email skipped");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
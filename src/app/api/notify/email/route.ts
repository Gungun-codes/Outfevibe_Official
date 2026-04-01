import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ── Email Templates ──────────────────────────────────────────────────────────
const EMAIL_TEMPLATES = {
  new_feature: (featureName: string) => ({
    subject: `New on Outfevibe: ${featureName} is live ✨`,
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">Something new just dropped ✨</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        Hey there! We just launched <strong style="color:#ffffff;">${featureName}</strong> on Outfevibe.
        Come check it out — it's built for people like you.
      </p>
      <a href="https://www.outfevibe.com" style="${ctaStyle}">Explore Now →</a>
    `),
  }),

  weekly_style_drop: () => ({
    subject: "Your weekly style drop is here 🔥",
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">Weekly Style Drop 🔥</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        Fresh outfits just hit the trending section. Curated for the week ahead — from festive looks to everyday fits.
      </p>
      <a href="https://www.outfevibe.com/#trending" style="${ctaStyle}">See What's Trending →</a>
    `),
  }),

  quiz_completed: (persona: string) => ({
    subject: `Your style persona is ready: ${persona} 🎯`,
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">You're a ${persona} ✨</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        Your style quiz results are in! We've analysed your answers and built a personalised outfit 
        feed just for your vibe. Head to your profile to see your style DNA.
      </p>
      <a href="https://www.outfevibe.com/profile" style="${ctaStyle}">View My Profile →</a>
    `),
  }),

  outfit_milestone: (count: number) => ({
    subject: `You've saved ${count} outfits — your style is taking shape 💫`,
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">Style milestone unlocked 💫</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        You've saved <strong style="color:#ffffff;">${count} outfits</strong> on Outfevibe. 
        Your wardrobe vision is coming together — keep going!
      </p>
      <a href="https://www.outfevibe.com/profile" style="${ctaStyle}">View My Saved Outfits →</a>
    `),
  }),

  festival_campaign: (festival: string) => ({
    subject: `${festival} looks are here — dress to impress ✨`,
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">${festival} Looks Are Here ✨</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        The festival season is here and we've curated the best looks just for you. 
        Find your perfect <strong style="color:#ffffff;">${festival}</strong> outfit — styled by AI, made for you.
      </p>
      <a href="https://www.outfevibe.com/#trending" style="${ctaStyle}">Explore ${festival} Looks →</a>
    `),
  }),

  new_trending: () => ({
    subject: "Fresh fits just dropped on Outfevibe 👗",
    html: emailWrapper(`
      <h1 style="font-size:26px;font-weight:700;color:#d4af7f;margin-bottom:8px;">New Trending Outfits Added 👗</h1>
      <p style="color:#a3a3a3;font-size:15px;line-height:1.7;margin-bottom:24px;">
        We just updated the trending section with fresh looks. New styles, new vibes — 
        go explore what's hot right now.
      </p>
      <a href="https://www.outfevibe.com/#trending" style="${ctaStyle}">See New Arrivals →</a>
    `),
  }),
};

const ctaStyle = `
  display:inline-block;
  background:linear-gradient(to right,#d4af7f,#b8860b);
  color:#000000;
  font-weight:700;
  padding:14px 32px;
  border-radius:50px;
  text-decoration:none;
  font-size:14px;
`;

function emailWrapper(content: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#ffffff;padding:40px;border-radius:16px;">
      <img src="https://www.outfevibe.com/outfevibe_logo.png" alt="Outfevibe" style="height:32px;margin-bottom:32px;" />
      ${content}
      <p style="color:#4a4a4a;font-size:12px;margin-top:40px;line-height:1.6;">
        You're receiving this because you're part of the Outfevibe community.<br/>
        © ${new Date().getFullYear()} Outfevibe. Built with intention.
      </p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  // ✅ Instantiate Resend lazily — only when the route is actually called,
  //    not at module load time. This prevents the build-time crash when
  //    RESEND_API_KEY is not available as a static env var.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  try {
    const { type, payload, to, toAll } = await req.json();

    if (!type || !EMAIL_TEMPLATES[type as keyof typeof EMAIL_TEMPLATES]) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    const template = EMAIL_TEMPLATES[type as keyof typeof EMAIL_TEMPLATES];
    const { subject, html } = (template as any)(payload || "");

    // Single email
    if (to && !toAll) {
      const { error } = await resend.emails.send({
        from: "Outfevibe <hello@outfevibe.com>",
        to,
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }

      return NextResponse.json({ success: true, sent: 1 });
    }

    return NextResponse.json({ error: "No recipients specified" }, { status: 400 });
  } catch (err) {
    console.error("Email notify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
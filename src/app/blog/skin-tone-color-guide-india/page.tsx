"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SKIN_TONES = [
  {
    tone:        "Fair",
    hex:         "#FFE8D6",
    description: "Very light skin, often with pink or peachy undertones. Burns easily in the sun.",
    bestColours: [
      { name: "Dusty Rose",   hex: "#C19A9A", why: "Adds warmth without washing out" },
      { name: "Powder Blue",  hex: "#B0C4DE", why: "Cool contrast that pops" },
      { name: "Sage Green",   hex: "#87A878", why: "Natural, earthy warmth" },
      { name: "Lavender",     hex: "#B57BCA", why: "Dreamy and flattering" },
      { name: "Berry",        hex: "#8B2252", why: "Bold statement colour" },
      { name: "Navy",         hex: "#1a2a4a", why: "Classic, always works" },
    ],
    avoid:        "Neon shades and very pale pastels that match the skin tone — they wash you out.",
    neutrals:     "Ivory, off-white, blush — better than stark white.",
    undertone:    "Cool/pink undertone → go for cool colours (blues, purples, soft pinks)",
  },
  {
    tone:        "Light",
    hex:         "#F5CCAA",
    description: "Light skin with warm or neutral undertones. Common in North India.",
    bestColours: [
      { name: "Coral",      hex: "#FF6B6B", why: "Warm flush of colour" },
      { name: "Sky Blue",   hex: "#87CEEB", why: "Fresh and crisp" },
      { name: "Mint",       hex: "#98D8C8", why: "Cool glow" },
      { name: "Blush Pink", hex: "#FFB6C1", why: "Soft and feminine" },
      { name: "Teal",       hex: "#008080", why: "Rich depth" },
      { name: "Warm Red",   hex: "#CC3333", why: "Classic and striking" },
    ],
    avoid:        "Very dark browns can look too stark. Very muted, muddy tones.",
    neutrals:     "Cream, warm white, camel — more flattering than stark white.",
    undertone:    "Warm/neutral undertone → warm colours (coral, peach, warm red) work best",
  },
  {
    tone:        "Medium",
    hex:         "#D4956A",
    description: "Warm beige to light olive skin. One of the most common tones in India.",
    bestColours: [
      { name: "Rust",        hex: "#B7410E", why: "Earthy warmth — stunning" },
      { name: "Olive",       hex: "#808000", why: "Natural tonal match" },
      { name: "Burnt Orange",hex: "#CC5500", why: "Bold and warm" },
      { name: "Mustard",     hex: "#FFDB58", why: "Golden glow" },
      { name: "Terracotta",  hex: "#C66A53", why: "Earthy depth" },
      { name: "Forest Green",hex: "#228B22", why: "Rich contrast" },
    ],
    avoid:        "Neon yellow and very washed-out pastels — they dull medium skin tones.",
    neutrals:     "Warm white, camel, khaki — pair beautifully.",
    undertone:    "Warm/olive undertone → earthy, warm colours are your best friends",
  },
  {
    tone:        "Tan",
    hex:         "#C47B3A",
    description: "Golden-brown to warm brown skin. Extremely common in India, especially in summer.",
    bestColours: [
      { name: "Gold",       hex: "#FFD700", why: "Stunning contrast" },
      { name: "Deep Coral", hex: "#FF4500", why: "Vibrant and warm" },
      { name: "Cobalt Blue",hex: "#0047AB", why: "Bold statement" },
      { name: "Ivory White",hex: "#FFFFF0", why: "Clean, crisp contrast" },
      { name: "Copper",     hex: "#B87333", why: "Warm tonal harmony" },
      { name: "Emerald",    hex: "#50C878", why: "Jewel tone glow" },
    ],
    avoid:        "Muddy browns and dark olive — blend into the skin tone, no contrast.",
    neutrals:     "Ivory, off-white, cream — more elegant than stark white.",
    undertone:    "Warm golden undertone → jewel tones and warm brights look incredible",
  },
  {
    tone:        "Deep",
    hex:         "#8B4A2B",
    description: "Rich brown skin with warm or neutral undertones.",
    bestColours: [
      { name: "Fuchsia",     hex: "#FF00FF", why: "Electric and eye-catching" },
      { name: "Royal Blue",  hex: "#4169E1", why: "Rich contrast" },
      { name: "Orange",      hex: "#FF8C00", why: "Bold warmth" },
      { name: "Bright White",hex: "#FFFFFF", why: "Crisp, striking contrast" },
      { name: "Gold",        hex: "#FFD700", why: "Luxurious glow" },
      { name: "Red",         hex: "#CC0000", why: "Powerful statement" },
    ],
    avoid:        "Dark navy and dark brown — too little contrast, colours disappear.",
    neutrals:     "Pure white and bright ivory work better than cream.",
    undertone:    "Bold, bright colours create the most striking looks on deep skin",
  },
  {
    tone:        "Dark",
    hex:         "#4A2412",
    description: "Very deep skin with blue, neutral or warm undertones.",
    bestColours: [
      { name: "Electric Blue",hex: "#0000FF", why: "Vivid, vibrant contrast" },
      { name: "Hot Pink",     hex: "#FF69B4", why: "Striking and bold" },
      { name: "Bright Yellow",hex: "#FFFF00", why: "Maximum brightness" },
      { name: "Pure White",   hex: "#FFFFFF", why: "Maximum contrast" },
      { name: "Bright Red",   hex: "#FF0000", why: "Bold power" },
      { name: "Lime Green",   hex: "#00FF00", why: "Vivid freshness" },
    ],
    avoid:        "Very dark colours — they reduce contrast and make outfits disappear.",
    neutrals:     "Pure white, bright silver — most flattering neutrals.",
    undertone:    "The richest, most saturated colours look absolutely stunning",
  },
];

export default function SkinToneBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500] to-black" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500 blur-[150px] opacity-10 rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-yellow-400 transition">Blog</Link>
            <span>›</span>
            <span className="text-yellow-400">Style Guide</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Which Colours Suit Your<br />
            <span className="text-yellow-400">Skin Tone? The Indian Guide</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>March 5, 2026</span><span>·</span>
            <span>6 min read</span><span>·</span>
            <span className="text-yellow-400">Style Guide</span>
          </div>
          <p className="text-neutral-400 text-lg">
            The right colour can make your skin glow. The wrong one can wash you out completely.
            This guide covers all 6 Indian skin tones — with the best colours, what to avoid,
            and how to find your undertone.
          </p>
        </div>
      </section>

      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Warm vs Cool Undertones — Why It Matters
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-4">
          Skin tone and undertone are different things. Your skin tone is what you see on the surface —
          fair, tan, deep. Your undertone is the hue beneath the surface — warm (yellow/golden),
          cool (pink/blue) or neutral.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { type: "Warm undertone", test: "Your veins appear greenish. Gold jewellery looks better on you than silver.", colours: "Earthy, warm tones — rust, gold, olive, coral" },
            { type: "Cool undertone", test: "Your veins appear bluish-purple. Silver jewellery flatters you more.", colours: "Cool tones — blues, purples, soft pinks, greens" },
            { type: "Neutral undertone", test: "Can't tell if veins are green or blue. Both gold and silver suit you.", colours: "Most colours work — lucky you!" },
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
              <p className="font-bold text-white text-sm mb-2">{item.type}</p>
              <p className="text-xs text-neutral-500 mb-2">{item.test}</p>
              <p className="text-xs text-yellow-400">{item.colours}</p>
            </div>
          ))}
        </div>

        {/* Mid CTA */}
        <div className="rounded-2xl p-5 border mb-10 text-center bg-yellow-400/5 border-yellow-400/20">
          <p className="text-white font-semibold mb-2">🎨 Not sure of your skin tone?</p>
          <p className="text-neutral-400 text-sm mb-4">
            Outfevibe&apos;s AI detects your skin tone from a photo and suggests the perfect colour palette.
          </p>
          <Link href="/outfit"
            className="inline-block px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition">
            Detect My Skin Tone →
          </Link>
        </div>

        {/* Each skin tone */}
        {SKIN_TONES.map((tone, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} viewport={{ once: true }} className="mb-12">

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl border-2 border-neutral-700 flex-shrink-0"
                style={{ background: tone.hex }} />
              <div>
                <h2 className="text-2xl font-bold text-white">{tone.tone} Skin Tone</h2>
                <p className="text-neutral-500 text-sm">{tone.undertone}</p>
              </div>
            </div>

            <p className="text-neutral-400 leading-relaxed mb-5">{tone.description}</p>

            {/* Colour swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {tone.bestColours.map((colour, j) => (
                <div key={j} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                  <div className="h-12 w-full" style={{ background: colour.hex,
                    border: colour.hex === "#FFFFFF" || colour.hex === "#FFFFF0" ? "1px solid #333" : "none" }} />
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-white">{colour.name}</p>
                    <p className="text-xs text-neutral-500">{colour.why}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-red-950/30 rounded-xl p-4 border border-red-900/30">
                <p className="text-xs font-bold text-red-400 mb-1">✕ Avoid</p>
                <p className="text-sm text-neutral-400">{tone.avoid}</p>
              </div>
              <div className="bg-green-950/30 rounded-xl p-4 border border-green-900/30">
                <p className="text-xs font-bold text-green-400 mb-1">✓ Neutrals</p>
                <p className="text-sm text-neutral-400">{tone.neutrals}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">FAQs</h2>
        {[
          { q: "Which colour suits Indian skin tone the most?", a: "For the most common Indian skin tones (medium to tan), earthy warm colours like rust, mustard, terracotta, gold, cobalt blue and emerald green are universally flattering. These colours complement warm and golden undertones beautifully." },
          { q: "What colours should I avoid if I have a tan skin tone?", a: "If you have tan skin, avoid muddy browns and dark olives — they blend into your skin tone and reduce contrast. Also avoid very pale, washed-out pastels that can make the skin look dull." },
          { q: "How do I know my skin undertone?", a: "Look at your wrist veins in natural light. If they appear green, you have warm undertones. If they look blue or purple, you have cool undertones. If you can't tell, you're neutral. Gold vs silver jewellery is another test — warm undertones suit gold, cool undertones suit silver." },
          { q: "Can I wear any colour regardless of skin tone?", a: "Technically yes — fashion has no rules. But understanding which colours enhance your natural complexion versus wash it out helps you look your most radiant. The goal isn't restriction, it's knowing what makes you glow." },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      <section className="px-6 py-16 text-center bg-neutral-950">
        <h2 className="text-2xl font-bold mb-4">Find Your Perfect Colour Palette</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Upload your photo and Outfevibe&apos;s AI detects your skin tone and recommends
          a personalised colour palette — plus outfit recommendations that use those colours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit" className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
            Detect My Skin Tone ✨
          </Link>
          <Link href="/quiz" className="px-8 py-3 rounded-full border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition">
            Take Style Quiz
          </Link>
        </div>
      </section>

      <section className="px-6 py-12 border-t border-neutral-900 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Body Shape Outfit Guide for Indian Women", href: "/blog/body-shape-outfit-guide-india", tag: "Style Guide" },
            { title: "Navratri Outfit Ideas 2026 — 9 Day Colour Guide", href: "/blog/navratri-outfit-ideas-2026", tag: "Festive" },
          ].map((post, i) => (
            <Link key={i} href={post.href}
              className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-yellow-400/40 transition">
              <span className="text-xs text-yellow-400 font-medium">{post.tag}</span>
              <p className="text-sm font-semibold text-white mt-1 line-clamp-2">{post.title}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
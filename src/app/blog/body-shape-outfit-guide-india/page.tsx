"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const BODY_SHAPES = [
  {
    shape:       "Hourglass",
    icon:        "⧖",
    description: "Shoulders and hips are roughly equal width with a clearly defined, narrow waist.",
    percentage:  "About 8% of women have a true hourglass shape.",
    celebs:      "Deepika Padukone, Priyanka Chopra",
    bestOutfits: [
      { type: "Tops",    tip: "Wrap tops, fitted V-necks, crop tops, bodycon silhouettes — anything that shows your waist." },
      { type: "Bottoms", tip: "High-waist jeans, pencil skirts, fitted trousers, flared jeans — all work beautifully." },
      { type: "Dresses", tip: "Wrap dresses, bodycon dresses, belted midi dresses, fitted anarkalis." },
      { type: "Ethnic",  tip: "Belted kurtas, fitted anarkalis, sarees draped to show the waist, lehenga cholis." },
    ],
    avoid: "Boxy or shapeless cuts that hide your natural waist definition.",
    colours: "All colours work — your shape carries any silhouette.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    shape:       "Pear",
    icon:        "🍐",
    description: "Hips and thighs are wider than shoulders. Lower body is heavier than upper body.",
    percentage:  "Most common body shape — about 20% of women.",
    celebs:      "Alia Bhatt, Jennifer Lopez",
    bestOutfits: [
      { type: "Tops",    tip: "Off-shoulder, boat neck, ruffled tops, puff sleeves, embellished necklines — add volume upward." },
      { type: "Bottoms", tip: "A-line skirts, wide-leg pants, flared jeans, dark-coloured bottoms — balance the hips." },
      { type: "Dresses", tip: "Fit-and-flare, A-line, empire waist dresses that flare below the waist." },
      { type: "Ethnic",  tip: "Heavily embroidered cholis or kurta tops with A-line or flared lehenga/salwar." },
    ],
    avoid: "Skinny jeans, tight pencil skirts, cargo pants that add volume to hips.",
    colours: "Bright or bold tops + dark bottoms — classic pear dressing rule.",
    gradient: "from-yellow-500 to-orange-400",
  },
  {
    shape:       "Apple",
    icon:        "🍎",
    description: "Weight carried around the midsection. Shoulders and hips similar width, less defined waist.",
    percentage:  "About 14% of women.",
    celebs:      "Drew Barrymore, Catherine Zeta-Jones",
    bestOutfits: [
      { type: "Tops",    tip: "Empire waist, V-neck, wrap tops, flowy tunics, longline tops that skim the waist." },
      { type: "Bottoms", tip: "Straight-leg, wide-leg, bootcut trousers — avoid high-waist that cuts at the widest point." },
      { type: "Dresses", tip: "Empire waist, A-line, wrap dresses, shift dresses with belt below the bust." },
      { type: "Ethnic",  tip: "Empire waist anarkalis, flowy kurtas with straight pants, sarees draped to elongate." },
    ],
    avoid: "Crop tops, tight waistbands, clingy fabric around the midsection.",
    colours: "Vertical stripes, monochromatic looks elongate and slim visually.",
    gradient: "from-red-500 to-rose-400",
  },
  {
    shape:       "Rectangle",
    icon:        "▭",
    description: "Shoulders, waist and hips are roughly the same width. Straight up-and-down silhouette.",
    percentage:  "About 46% of women — the most common shape.",
    celebs:      "Cameron Diaz, Kate Middleton",
    bestOutfits: [
      { type: "Tops",    tip: "Peplum, ruffles, off-shoulder, crop tops, embellished tops — add curve and dimension." },
      { type: "Bottoms", tip: "Mini skirts, pleated skirts, flared pants, cargo pants, wide-leg trousers." },
      { type: "Dresses", tip: "Belted dresses, bodycon, ruffled hemlines, tiered dresses that create volume." },
      { type: "Ethnic",  tip: "Heavily embellished lehengas, belted kurtas, gharara sets that add curve." },
    ],
    avoid: "Straight shift dresses with zero definition — add a belt or structural detail.",
    colours: "Bold prints, colour-blocking, horizontal stripes — all create visual width.",
    gradient: "from-blue-500 to-indigo-400",
  },
  {
    shape:       "Inverted Triangle",
    icon:        "▽",
    description: "Shoulders are significantly wider than hips. Athletic or broad-shouldered appearance.",
    percentage:  "About 14% of women.",
    celebs:      "Naomi Campbell, Renée Zellweger",
    bestOutfits: [
      { type: "Tops",    tip: "V-necks, scoop necks, halter tops, simple fitted tops — avoid anything that adds shoulder width." },
      { type: "Bottoms", tip: "Wide-leg, flared, A-line skirts, pleated skirts, ruffled hems — add fullness below." },
      { type: "Dresses", tip: "A-line, fit-and-flare, trumpet silhouettes that narrow at shoulders and flare at hips." },
      { type: "Ethnic",  tip: "Simple choli with voluminous lehenga, palazzo suits, A-line salwar." },
    ],
    avoid: "Boat neck, off-shoulder, puff sleeves, shoulder pads — anything that widens shoulders.",
    colours: "Dark tops + bright bottoms reverses the visual weight distribution.",
    gradient: "from-purple-500 to-violet-400",
  },
];

const HOW_TO_IDENTIFY = [
  { step: "1", title: "Measure your shoulders", desc: "Measure across the widest point of your shoulders." },
  { step: "2", title: "Measure your waist", desc: "Measure the narrowest point, usually 1 inch above your belly button." },
  { step: "3", title: "Measure your hips", desc: "Measure the widest point of your hips and buttocks." },
  { step: "4", title: "Compare the numbers", desc: "Hourglass: shoulders ≈ hips, waist much smaller. Pear: hips > shoulders. Apple: waist ≈ hips. Rectangle: all similar. Inverted Triangle: shoulders > hips." },
];

export default function BodyShapeBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a000a] to-black" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 blur-[150px] opacity-10 rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-yellow-400 transition">Blog</Link>
            <span>›</span>
            <span className="text-yellow-400">Style Guide</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            The Complete Body Shape<br />
            <span className="text-yellow-400">Outfit Guide for Indian Women</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>March 10, 2026</span><span>·</span>
            <span>7 min read</span><span>·</span>
            <span className="text-yellow-400">Style Guide</span>
          </div>
          <p className="text-neutral-400 text-lg">
            Every body is different. This guide breaks down exactly what to wear
            for each of the 5 body shapes — with Indian outfit examples, what to
            avoid, and colour tips for each type.
          </p>
        </div>
      </section>

      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          The 5 Body Shapes — Which One Are You?
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          Fashion stylists classify women&apos;s body shapes into 5 categories based on
          the proportional relationship between shoulders, waist and hips.
          Understanding your body shape is the single most useful tool for dressing well —
          more useful than following trends or copying celebrity outfits.
        </p>

        {/* How to identify */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 mb-10">
          <h3 className="font-bold text-white mb-4">How to Identify Your Body Shape</h3>
          <div className="space-y-3">
            {HOW_TO_IDENTIFY.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-neutral-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 text-sm mb-3">Or skip the measuring tape entirely —</p>
            <Link href="/outfit"
              className="inline-block px-5 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition">
              Let AI Detect My Body Shape →
            </Link>
          </div>
        </div>

        {/* Each body shape */}
        {BODY_SHAPES.map((shape, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} viewport={{ once: true }}
            className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${shape.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                {shape.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{shape.shape} Body Shape</h2>
                <p className="text-neutral-500 text-sm">{shape.percentage}</p>
              </div>
            </div>

            <p className="text-neutral-400 leading-relaxed mb-4">{shape.description}</p>
            <p className="text-sm text-neutral-500 mb-5">
              <span className="text-yellow-400 font-medium">Celebrity examples:</span> {shape.celebs}
            </p>

            <div className="space-y-3 mb-5">
              {shape.bestOutfits.map((item, j) => (
                <div key={j} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                  <p className="text-xs font-bold text-yellow-400 mb-1 uppercase tracking-wider">{item.type}</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-red-950/30 rounded-xl p-4 border border-red-900/30">
                <p className="text-xs font-bold text-red-400 mb-1">✕ Avoid</p>
                <p className="text-sm text-neutral-400">{shape.avoid}</p>
              </div>
              <div className="bg-green-950/30 rounded-xl p-4 border border-green-900/30">
                <p className="text-xs font-bold text-green-400 mb-1">✓ Colour tip</p>
                <p className="text-sm text-neutral-400">{shape.colours}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">FAQs</h2>
        {[
          { q: "What is the most common body shape for Indian women?", a: "The rectangle body shape is the most common globally, including among Indian women — about 46% of women have this shape. Pear is the second most common at around 20%." },
          { q: "How do I find my body shape?", a: "Measure your shoulders, waist and hips, then compare the ratios. Or use Outfevibe's AI which analyses a photo of you and detects your body shape automatically in seconds." },
          { q: "What body shape do most Bollywood actresses have?", a: "Many Bollywood actresses like Deepika Padukone and Priyanka Chopra have hourglass or pear body shapes, but actresses of all shapes thrive. Alia Bhatt is often cited as pear-shaped, Katrina Kaif as rectangle." },
          { q: "Does body shape change with weight?", a: "Your basic body shape — the proportional relationship between shoulders, waist and hips — tends to stay consistent even as weight fluctuates. However, significant weight changes can shift your classification." },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-neutral-950">
        <h2 className="text-2xl font-bold mb-4">Let AI Detect Your Body Shape</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Upload your photo and Outfevibe&apos;s AI detects your body shape and skin tone,
          then recommends outfits that actually flatter you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit" className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
            Detect My Body Shape ✨
          </Link>
          <Link href="/quiz" className="px-8 py-3 rounded-full border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition">
            Take Style Quiz
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 py-12 border-t border-neutral-900 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Which Colours Suit Your Skin Tone? The Indian Guide", href: "/blog/skin-tone-colour-guide-india", tag: "Style Guide" },
            { title: "College Outfit Ideas for Indian Girls 2026", href: "/blog/college-outfit-ideas-india", tag: "College" },
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
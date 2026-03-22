"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MahavirBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0a0f0a,#000)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-[#D4AF7F] transition">Blog</Link>
            <span>›</span>
            <span style={{ color: "#D4AF7F" }}>Festive</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Mahavir Jayanti Outfit Ideas 2026 —<br />
            <span style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Elegant, Pure & Spiritual
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>March 27, 2026</span><span>·</span>
            <span>4 min read</span><span>·</span>
            <span style={{ color: "#D4AF7F" }}>Festive</span>
          </div>
          <p className="text-neutral-400 text-lg">
            Mahavir Jayanti 2026 falls on April 4. Here&apos;s your complete outfit guide —
            what to wear, which colours are most auspicious, and the best ethnic wear
            for every body shape and skin tone.
          </p>
        </div>
      </section>

      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">When is Mahavir Jayanti 2026?</h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          Mahavir Jayanti 2026 is on <strong className="text-white">April 4, 2026</strong>.
          It marks the birth anniversary of Lord Mahavir, the 24th and last Tirthankara of Jainism,
          born in 599 BC. The festival is celebrated with prayers, processions, charitable activities
          and fasting. Dressing in clean, modest and white or ivory ethnic wear is considered most auspicious.
        </p>

        <div className="rounded-2xl p-5 border mb-8 text-center"
          style={{ background: "rgba(212,175,127,0.05)", borderColor: "rgba(212,175,127,0.2)" }}>
          <p className="text-white font-semibold mb-2">☮️ Get your personalised Mahavir Jayanti look</p>
          <p className="text-neutral-400 text-sm mb-4">AI outfit recommendations based on your body shape and skin tone.</p>
          <Link href="/outfit"
            className="inline-block px-6 py-2.5 rounded-full font-bold text-sm text-black"
            style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)" }}>
            Get My Look →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">What Colour to Wear for Mahavir Jayanti?</h2>
        <p className="text-neutral-400 leading-relaxed mb-4">
          White is the primary colour for Mahavir Jayanti — it represents peace, non-violence (ahimsa)
          and purity, the core values of Jainism. Other auspicious colours include:
        </p>
        <ul className="space-y-2 mb-8">
          {[
            { colour: "White", meaning: "Purity, peace, ahimsa — most auspicious" },
            { colour: "Ivory / Cream", meaning: "Warm and traditional, widely accepted" },
            { colour: "Pale Yellow", meaning: "Gentle and pious" },
            { colour: "Sage Green", meaning: "Symbolises nature and non-violence" },
            { colour: "Soft Gold", meaning: "Celebratory and auspicious" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span style={{ color: "#D4AF7F" }} className="font-bold text-sm mt-0.5">✓</span>
              <div>
                <span className="text-white font-semibold text-sm">{item.colour}</span>
                <span className="text-neutral-400 text-sm"> — {item.meaning}</span>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-6">Best Mahavir Jayanti Outfits for Women</h2>
        {[
          { outfit: "White Anarkali Gown", why: "Elegant, flows beautifully, suits all body shapes. Go for subtle embroidery in silver or gold thread." },
          { outfit: "Ivory Lehenga Choli", why: "Traditional and stunning. Lightweight fabric for a comfortable day of prayers and celebrations." },
          { outfit: "White Palazzo Suit with Dupatta", why: "Comfortable and modest. Great for long days. Palazzo silhouette flatters pear and apple body shapes." },
          { outfit: "Cream Silk Saree", why: "The most traditional choice. Silk sarees in off-white or cream are considered very auspicious." },
        ].map((item, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 mb-4">
            <h3 className="font-bold text-white mb-1">{item.outfit}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.why}</p>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-white mt-10 mb-6">Best Mahavir Jayanti Outfits for Men</h2>
        {[
          { outfit: "White Kurta Pyjama", why: "The most traditional and widely worn choice. Cotton or linen fabric keeps you comfortable all day." },
          { outfit: "Cream Bandhgala Suit", why: "Smart and elegant. The structured collar adds formality appropriate for temple visits and processions." },
          { outfit: "White Kurta with Cream Churidar", why: "A classic combination. Simple, clean and very auspicious for the festival." },
          { outfit: "Off-White Nehru Jacket over Kurta", why: "Adds elegance to a simple kurta. Great for formal processions and community celebrations." },
        ].map((item, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 mb-4">
            <h3 className="font-bold text-white mb-1">{item.outfit}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.why}</p>
          </div>
        ))}

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">FAQs</h2>
        {[
          { q: "What is the dress code for Mahavir Jayanti?", a: "White is the most auspicious colour for Mahavir Jayanti. Wear clean, modest ethnic wear — kurtas, sarees, lehengas or salwar suits in white, cream or ivory. Avoid bright, flashy colours." },
          { q: "Can I wear colours other than white for Mahavir Jayanti?", a: "Yes — while white is primary, soft pastels like pale yellow, sage green, ivory and cream are also considered auspicious. Avoid very bright or dark colours." },
          { q: "What should a woman wear for Mahavir Jayanti 2026?", a: "Women can wear a white anarkali gown, ivory lehenga choli, cream silk saree, or a white palazzo suit with dupatta. All are appropriate and elegant for the festival." },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg,#0a0f0a,#000)" }}>
        <h2 className="text-2xl font-bold mb-4">Find Your Mahavir Jayanti Look</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          AI-powered outfit recommendations based on your body shape and skin tone. Free to use.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit"
            className="px-8 py-3 rounded-full font-bold text-black hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)" }}>
            Get AI Outfit ☮️
          </Link>
          <Link href="/mahavir-jayanti-outfits"
            className="px-8 py-3 rounded-full border font-semibold hover:bg-white/5 transition"
            style={{ borderColor: "rgba(212,175,127,0.4)", color: "#D4AF7F" }}>
            Browse Mahavir Jayanti Outfits
          </Link>
        </div>
      </section>

      <section className="px-6 py-12 border-t border-neutral-900 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Navratri Outfit Ideas 2026 — 9 Day Colour Guide", href: "/blog/navratri-outfit-ideas-2026", tag: "Festive" },
            { title: "College Outfit Ideas for Indian Girls 2026", href: "/blog/college-outfit-ideas-india", tag: "College" },
          ].map((post, i) => (
            <Link key={i} href={post.href}
              className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-[#D4AF7F]/40 transition">
              <span className="text-xs font-medium" style={{ color: "#D4AF7F" }}>{post.tag}</span>
              <p className="text-sm font-semibold text-white mt-1 line-clamp-2">{post.title}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
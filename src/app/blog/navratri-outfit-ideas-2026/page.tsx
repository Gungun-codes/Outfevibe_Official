"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const DAYS = [
  { day: 1, date: "Mar 19", colour: "Yellow",     hex: "#FFD700", goddess: "Shailaputri",    outfit: "Yellow embroidered lehenga or mustard anarkali" },
  { day: 2, date: "Mar 20", colour: "Green",      hex: "#2ECC71", goddess: "Brahmacharini",  outfit: "Green silk chaniya choli or mint palazzo suit" },
  { day: 3, date: "Mar 21", colour: "Grey",       hex: "#95A5A6", goddess: "Chandraghanta",  outfit: "Grey georgette saree or silver-grey anarkali" },
  { day: 4, date: "Mar 22", colour: "Orange",     hex: "#E67E22", goddess: "Kushmanda",      outfit: "Orange chaniya choli or rust embroidered suit" },
  { day: 5, date: "Mar 23", colour: "White",      hex: "#E8E8E8", goddess: "Skandamata",     outfit: "White lehenga with mirror work or ivory palazzo set" },
  { day: 6, date: "Mar 24", colour: "Red",        hex: "#E74C3C", goddess: "Katyayani",      outfit: "Red bridal lehenga or deep red anarkali gown" },
  { day: 7, date: "Mar 25", colour: "Royal Blue", hex: "#2980B9", goddess: "Kalaratri",      outfit: "Royal blue chaniya choli or cobalt silk suit" },
  { day: 8, date: "Mar 26", colour: "Pink",       hex: "#FF69B4", goddess: "Mahagauri",      outfit: "Pink lehenga with heavy embroidery or blush anarkali" },
  { day: 9, date: "Mar 27", colour: "Purple",     hex: "#9B59B6", goddess: "Siddhidatri",    outfit: "Purple silk lehenga or violet palazzo suit" },
];

const BODY_TIPS = [
  {
    shape: "Hourglass ⧖",
    navratri: "You can wear almost any silhouette. Fitted chaniya choli with flared lehenga skirt is your power look.",
    avoid: "Nothing — you're the lucky one!",
  },
  {
    shape: "Pear 🍐",
    navratri: "Choose heavily embroidered or embellished blouses/cholis to draw attention to your upper body. Flared or A-line lehenga skirts balance the hips beautifully.",
    avoid: "Tight mermaid skirts or lehengas with minimal flare.",
  },
  {
    shape: "Apple 🍎",
    navratri: "Empire waist anarkali suits are your best friend. Flowy dupattas draped across the midsection create elegance. Avoid tight waistbands.",
    avoid: "Heavily embellished waistbands or crop-style cholis.",
  },
  {
    shape: "Rectangle ▭",
    navratri: "Create curves with heavily embellished lehengas and peplum or ruffled choli tops. Belt your outfit for instant waist definition.",
    avoid: "Straight cut salwar suits with no shape.",
  },
  {
    shape: "Inverted Triangle ▽",
    navratri: "Go for voluminous, heavily embellished lehenga skirts with simple choli tops. This balances your broader shoulders perfectly.",
    avoid: "Off-shoulder or boat-neck cholis that widen shoulders further.",
  },
];

export default function NavratriBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#1a0010,#000)" }} />
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full blur-[100px] opacity-20"
          style={{ background: "#FF69B4" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-pink-400 transition">Blog</Link>
            <span>›</span>
            <span className="text-pink-400">Festive</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Navratri Outfit Ideas 2026 —<br />
            <span style={{ background: "linear-gradient(135deg,#FF69B4,#9B59B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Complete 9 Day Colour Guide
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>March 22, 2026</span>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <span className="text-pink-400">Festive</span>
          </div>
          <p className="text-neutral-400 text-lg">
            Chaitra Navratri 2026 runs March 19–27. Each day has a sacred colour and a goddess to honour.
            Here&apos;s your complete outfit guide — with picks for every body shape and skin tone.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Chaitra Navratri 2026 — When Is It?
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          Chaitra Navratri 2026 begins on March 19 (Ghatasthapana) and ends on March 27 (Ram Navami).
          These 9 nights celebrate the nine forms of Goddess Durga, with each day dedicated to a
          specific colour and goddess. Wearing the correct colour is considered auspicious.
        </p>

        {/* Mid article CTA */}
        <div className="rounded-2xl p-5 border mb-8 text-center"
          style={{ background: "rgba(255,105,180,0.05)", borderColor: "rgba(255,105,180,0.2)" }}>
          <p className="text-white font-semibold mb-2">🪔 Navratri campaign is LIVE on Outfevibe</p>
          <p className="text-neutral-400 text-sm mb-4">
            Upload your photo and get a personalised Navratri look based on your body shape and skin tone.
          </p>
          <Link href="/outfit"
            className="inline-block px-6 py-2.5 rounded-full font-bold text-sm text-black"
            style={{ background: "linear-gradient(135deg,#FF69B4,#9B59B6)" }}>
            Get My Navratri Look →
          </Link>
        </div>

        {/* 9 Days table */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-6">
          Navratri 2026 — Day by Day Colour & Outfit Guide
        </h2>

        <div className="space-y-4 mb-10">
          {DAYS.map((day, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              className="flex gap-4 items-start p-4 rounded-2xl border border-neutral-800 bg-neutral-900">
              {/* Colour circle */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-neutral-700"
                  style={{ background: day.hex }} />
                <p className="text-xs text-neutral-500">Day {day.day}</p>
                <p className="text-xs text-neutral-600">{day.date}</p>
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{day.colour}</span>
                  <span className="text-xs text-neutral-500">— {day.goddess}</span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{day.outfit}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Body shape section */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-4">
          Best Navratri Outfits by Body Shape
        </h2>
        <p className="text-neutral-400 mb-6">
          The colour is just the start — the right silhouette makes all the difference.
          Here&apos;s what works best for each body type during Navratri:
        </p>

        <div className="space-y-4 mb-10">
          {BODY_TIPS.map((item, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
              <h3 className="font-bold text-white mb-2">{item.shape}</h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-2">{item.navratri}</p>
              <p className="text-xs text-red-400">
                <span className="font-semibold">Avoid:</span> {item.avoid}
              </p>
            </div>
          ))}
        </div>

        {/* Skin tone */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-4">
          Navratri Outfit Colours for Your Skin Tone
        </h2>
        <p className="text-neutral-400 mb-6">
          While each day has a prescribed colour, you can still choose the shade within
          that colour family that suits your skin tone best:
        </p>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left py-3 px-4 text-neutral-400">Skin Tone</th>
                <th className="text-left py-3 px-4 text-neutral-400">Best Shade Choice</th>
                <th className="text-left py-3 px-4 text-neutral-400">Fabric Tip</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tone: "Fair",   shade: "Soft pastels within the day colour", fabric: "Georgette, chiffon" },
                { tone: "Light",  shade: "Warm, medium-saturated tones", fabric: "Silk, satin" },
                { tone: "Medium", shade: "Rich, earthy tones — rust, mustard, forest", fabric: "Brocade, tissue" },
                { tone: "Tan",    shade: "Bold, jewel tones — cobalt, emerald, gold", fabric: "Velvet, raw silk" },
                { tone: "Deep",   shade: "Vivid, bright versions of each colour", fabric: "Silk, brocade" },
                { tone: "Dark",   shade: "Maximum saturation — the brightest version", fabric: "Any — you glow in all" },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-neutral-900 ${i % 2 === 0 ? "bg-neutral-950" : "bg-black"}`}>
                  <td className="py-3 px-4 text-white font-medium">{row.tone}</td>
                  <td className="py-3 px-4 text-neutral-300">{row.shade}</td>
                  <td className="py-3 px-4 text-neutral-500 text-xs">{row.fabric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">
          Frequently Asked Questions
        </h2>
        {[
          {
            q: "What are the 9 colours of Navratri 2026?",
            a: "The 9 Navratri 2026 colours are: Day 1 Yellow, Day 2 Green, Day 3 Grey, Day 4 Orange, Day 5 White, Day 6 Red, Day 7 Royal Blue, Day 8 Pink, Day 9 Purple.",
          },
          {
            q: "When is Chaitra Navratri 2026?",
            a: "Chaitra Navratri 2026 starts on March 19 (Pratipada/Ghatasthapana) and ends on March 27 (Ram Navami). It runs for 9 days.",
          },
          {
            q: "What should I wear for Navratri Garba?",
            a: "For Garba, comfort is key alongside tradition. Chaniya cholis with mirror work are the most popular choice. Choose a flared chaniya skirt in the day's colour. For body-conscious dressing, a fitted choli with a voluminous chaniya works for all body types.",
          },
          {
            q: "Can I wear a lehenga for Navratri?",
            a: "Yes, lehengas are perfect for Navratri. Choose a lehenga in the day's prescribed colour. For Garba dancing, opt for a lighter fabric like georgette or chiffon that allows movement.",
          },
          {
            q: "Which body shape suits chaniya choli best?",
            a: "Chaniya choli suits all body shapes but looks especially stunning on hourglass and pear body shapes. Hourglass figures shine in fitted cholis with flared chaniya. Pear shapes can balance their proportions with embellished choli tops.",
          },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2 text-base">{item.q}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      {/* Final CTA */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg,#0d0010,#000)" }}>
        <h2 className="text-2xl font-bold mb-4">Get Your Personalised Navratri Look</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Stop guessing what to wear. Upload your photo and Outfevibe&apos;s AI will
          find the perfect Navratri outfit for your body shape and skin tone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit"
            className="px-8 py-3 rounded-full font-bold text-black hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg,#FF69B4,#9B59B6)" }}>
            Get My AI Navratri Look 🪔
          </Link>
          <Link href="/navratri-outfits"
            className="px-8 py-3 rounded-full border font-semibold hover:bg-white/5 transition"
            style={{ borderColor: "rgba(255,105,180,0.4)", color: "#FF69B4" }}>
            Browse Navratri Outfits
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 py-12 border-t border-neutral-900 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Best Eid Outfit Ideas 2026 — For Every Body Type", href: "/blog/eid-outfit-ideas-2026", tag: "Festive" },
            { title: "The Complete Body Shape Outfit Guide for Indian Women", href: "/blog/body-shape-outfit-guide-india", tag: "Style Guide" },
          ].map((post, i) => (
            <Link key={i} href={post.href}
              className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-pink-400/40 transition">
              <span className="text-xs text-pink-400 font-medium">{post.tag}</span>
              <p className="text-sm font-semibold text-white mt-1 hover:text-pink-400 transition line-clamp-2">{post.title}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
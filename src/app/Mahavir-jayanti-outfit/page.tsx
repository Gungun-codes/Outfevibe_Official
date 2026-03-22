"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const COLOUR_PALETTE = [
  { name: "Pure White",    hex: "#FFFFFF", why: "Peace & purity — the primary colour of Jain festivals" },
  { name: "Ivory",         hex: "#FFFFF0", why: "Soft, spiritual and elegant" },
  { name: "Cream",         hex: "#FFFDD0", why: "Warm and traditional" },
  { name: "Sage Green",    hex: "#87A878", why: "Symbolises nature and non-violence" },
  { name: "Soft Gold",     hex: "#D4AF7F", why: "Auspicious and celebratory" },
  { name: "Pale Yellow",   hex: "#FAFAD2", why: "Gentle and pious" },
];

const OUTFITS_FEMALE = [
  { title: "SHAFNUFAB Net Semi Stitched Lehenga Choli", image: "/outfits/wedding_07.jpg", link: "https://amzn.to/4012Glt", price: "₹1,199", tag: "Elegant" },
  { title: "Miss Ethnic Hub Anarkali Gown with Dupatta", image: "/outfits/wedding_08.jpg", link: "https://amzn.to/3OB3OKg", price: "₹1,399", tag: "Traditional" },
  { title: "Lehenga Choli Indo-Western Draped Set", image: "/outfits/wedding_01.jpg", link: "https://amzn.to/4kX53iH", price: "₹2,199", tag: "Premium" },
  { title: "Party Top Palazzo and Dupatta Set", image: "/outfits/wedding_02.jpg", link: "https://amzn.to/3MKeTIi", price: "₹999", tag: "Budget Pick" },
];

const OUTFITS_MALE = [
  { title: "VASTRAMAY Chanderi Kurta Set with Cream Pant", image: "/outfits/wedding_14.jpg", link: "https://amzn.to/3OLdf9O", price: "₹1,299", tag: "Classic" },
  { title: "BK&FASHION Embroidered Nehru Jacket", image: "/outfits/wedding_15.jpg", link: "https://amzn.to/4rxAvXm", price: "₹799", tag: "Budget Pick" },
  { title: "WINTAGE Embroidered Velvet Bandhgala", image: "/outfits/wedding_12.jpg", link: "https://amzn.to/3MwNjhH", price: "₹1,999", tag: "Premium" },
  { title: "Bellstone Cotton Blend Solid Regular Kurta", image: "/outfits/college_15.jpg", link: "https://amzn.to/3ODivMG", price: "₹499", tag: "Simple & Pure" },
];

const BODY_TIPS = [
  { shape: "Hourglass ⧖",           tip: "White fitted anarkali or ivory lehenga with cinched waist — your proportions shine in clean silhouettes." },
  { shape: "Pear 🍐",               tip: "Embellished white choli with flared ivory lehenga. Adds volume on top, flows gracefully below." },
  { shape: "Apple 🍎",              tip: "Empire waist white kurta with palazzo pants. Flowy and elegant without clinging at the waist." },
  { shape: "Rectangle ▭",          tip: "Layered white dupatta and peplum kurta to create beautiful curves in a minimal palette." },
  { shape: "Inverted Triangle ▽",  tip: "Simple white choli with voluminous ivory lehenga — lets the bottom half take centre stage." },
];

export default function MahavirJayantiPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0a0f0a,#000)" }} />
        <div className="absolute top-10 right-10 w-64 h-64 opacity-15 rounded-full blur-[150px]"
          style={{ background: "#D4AF7F" }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 opacity-10 rounded-full blur-[120px]"
          style={{ background: "#87A878" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
            style={{ background: "rgba(212,175,127,0.1)", borderColor: "rgba(212,175,127,0.3)", color: "#D4AF7F" }}>
            ☮️ Mahavir Jayanti 2026 — April 4
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Mahavir Jayanti<br />Outfit Ideas 2026
            <br />
            <span style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Elegant. Pure. Spiritual.
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            Mahavir Jayanti celebrates the birth of Lord Mahavir. Dress in white, cream,
            ivory and pastel ethnic wear — AI-curated for every body shape and skin tone.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/outfit"
              className="px-8 py-3 rounded-full font-bold text-black hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)" }}>
              Get My Mahavir Jayanti Look ✨
            </Link>
            <Link href="/quiz"
              className="px-8 py-3 rounded-full border font-semibold hover:bg-white/5 transition"
              style={{ borderColor: "rgba(212,175,127,0.4)", color: "#D4AF7F" }}>
              Find My Style Persona
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Colour Palette */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Mahavir Jayanti Colour Palette</h2>
        <p className="text-neutral-400 text-center mb-10">
          White symbolises peace, non-violence and purity — the core values of Jainism.
          These colours are considered most auspicious for Mahavir Jayanti.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COLOUR_PALETTE.map((colour, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }} viewport={{ once: true }}
              className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-neutral-700"
                style={{ background: colour.hex }} />
              <div>
                <p className="font-semibold text-white text-sm">{colour.name}</p>
                <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">{colour.why}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Women Outfits */}
      <section className="px-6 py-16 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Mahavir Jayanti Outfits for Women</h2>
          <p className="text-neutral-400 text-center mb-12">
            Elegant white and ivory ethnic wear from Indian platforms
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {OUTFITS_FEMALE.map((outfit, i) => (
              <motion.a key={i} href={outfit.link} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#D4AF7F]/50 transition-all">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={outfit.image} alt={outfit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 text-black text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: "#D4AF7F" }}>
                    {outfit.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-white line-clamp-2 mb-2">{outfit.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: "#D4AF7F" }}>{outfit.price}</span>
                    <span className="text-xs text-neutral-500 group-hover:text-[#D4AF7F] transition">Shop →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Men Outfits */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Mahavir Jayanti Outfits for Men</h2>
        <p className="text-neutral-400 text-center mb-12">
          Kurta sets, bandhgalas and nehru jackets in white and cream
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {OUTFITS_MALE.map((outfit, i) => (
            <motion.a key={i} href={outfit.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#D4AF7F]/50 transition-all">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={outfit.image} alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 text-black text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: "#D4AF7F" }}>
                  {outfit.tag}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-white line-clamp-2 mb-2">{outfit.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#D4AF7F" }}>{outfit.price}</span>
                  <span className="text-xs text-neutral-500 group-hover:text-[#D4AF7F] transition">Shop →</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Body Shape Guide */}
      <section className="px-6 py-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Best Mahavir Jayanti Outfits by Body Shape
          </h2>
          <p className="text-neutral-400 text-center mb-10">
            White and minimal — but still flattering for your unique shape
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BODY_TIPS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
                <h3 className="font-bold text-white mb-2">{item.shape}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.tip}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/outfit"
              className="inline-block px-8 py-3 rounded-full font-bold text-black transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)" }}>
              Let AI Detect My Body Shape →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(135deg,#0a0f0a,#000)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Mahavir Jayanti Look
          </h2>
          <p className="text-neutral-400 mb-8 text-lg">
            Upload your photo and Outfevibe&apos;s AI will recommend the most flattering
            white and ivory ethnic outfit for your body shape and skin tone.
          </p>
          <Link href="/outfit"
            className="inline-block px-10 py-4 rounded-full font-bold text-lg text-black hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg,#D4AF7F,#87A878)" }}>
            Get My AI Look ☮️
          </Link>
        </motion.div>
      </section>

      {/* SEO text */}
      <section className="px-6 py-12 max-w-4xl mx-auto border-t border-neutral-900">
        <h2 className="text-xl font-bold mb-4 text-neutral-300">About These Mahavir Jayanti Recommendations</h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-3">
          Mahavir Jayanti 2026 falls on April 4. It celebrates the birth of Lord Mahavir,
          the 24th Tirthankara of Jainism. The festival is observed with prayer, processions
          and charitable activities. White, ivory and cream are the most auspicious colours to wear.
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Find your personalised look with our{" "}
          <Link href="/outfit" className="text-[#D4AF7F] hover:underline">AI outfit suggester</Link> or{" "}
          <Link href="/quiz" className="text-[#D4AF7F] hover:underline">free style quiz</Link>.
        </p>
      </section>

    </div>
  );
}
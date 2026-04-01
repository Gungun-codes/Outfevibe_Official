"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const NAVRATRI_DAYS = [
  { day: 1, colour: "Yellow",     hex: "#FFD700", emoji: "🌻", significance: "Shailaputri — new beginnings" },
  { day: 2, colour: "Green",      hex: "#2ECC71", emoji: "🌿", significance: "Brahmacharini — growth & harmony" },
  { day: 3, colour: "Grey",       hex: "#95A5A6", emoji: "🩶", significance: "Chandraghanta — courage" },
  { day: 4, colour: "Orange",     hex: "#E67E22", emoji: "🟠", significance: "Kushmanda — warmth & energy" },
  { day: 5, colour: "White",      hex: "#F8F9FA", emoji: "🤍", significance: "Skandamata — peace & purity" },
  { day: 6, colour: "Red",        hex: "#E74C3C", emoji: "❤️", significance: "Katyayani — power & love" },
  { day: 7, colour: "Royal Blue", hex: "#2980B9", emoji: "💙", significance: "Kalaratri — protection" },
  { day: 8, colour: "Pink",       hex: "#FF69B4", emoji: "🩷", significance: "Mahagauri — compassion" },
  { day: 9, colour: "Purple",     hex: "#9B59B6", emoji: "💜", significance: "Siddhidatri — divine blessings" },
];

const NAVRATRI_OUTFITS = [
  { title: "Embroidered Yellow Lehenga Choli Set", image: "/outfits/eid_01.jpg", link: "https://amzn.to/4bc20Pg", price: "₹1,299", day: 1, tag: "Day 1 Pick" },
  { title: "Green Georgette Anarkali Suit", image: "/outfits/eid_05.jpg", link: "https://amzn.to/4lyKZ6V", price: "₹699", day: 2, tag: "Day 2 Pick" },
  { title: "Mirror Work Salwar Suit", image: "/outfits/eid_06.jpg", link: "https://amzn.to/4d69w0z", price: "₹1,399", day: 3, tag: "Day 3 Pick" },
  { title: "Orange Embroidered Chaniya Choli", image: "/outfits/eid_03.jpg", link: "https://amzn.to/4ugcQws", price: "₹999", day: 4, tag: "Day 4 Pick" },
  { title: "White Silk Palazzo Set with Dupatta", image: "/outfits/eid_02.jpg", link: "https://amzn.to/40hlBra", price: "₹1,599", day: 5, tag: "Day 5 Pick" },
  { title: "Red Chiffon Salwar Lehenga", image: "/outfits/eid_04.jpg", link: "https://amzn.to/3OUAvT1", price: "₹1,199", day: 6, tag: "Day 6 Pick" },
];

const BODY_TIPS = [
  { shape: "Hourglass", tip: "Fitted chaniya choli with cinched waist, flared lehenga skirt. Show off your natural curves.", icon: "⧖", best: "Fitted blouse + heavily flared lehenga" },
  { shape: "Pear",      tip: "Embellished or heavily embroidered blouses to draw attention upward. Flared lehenga balances hips.", icon: "🍐", best: "Embroidered blouse + A-line chaniya" },
  { shape: "Apple",     tip: "Empire waist anarkali suits and flowy dupattas that skim the midsection.", icon: "🍎", best: "Flowy anarkali + palazzo pants" },
  { shape: "Rectangle", tip: "Belt your lehenga or choose heavily embellished pieces to create curves.", icon: "▭", best: "Belted lehenga + peplum blouse" },
  { shape: "Inverted Triangle", tip: "Heavily embellished lehenga skirts with simple blouses to balance broader shoulders.", icon: "▽", best: "Simple blouse + voluminous lehenga" },
];

// Get today's Navratri day (Chaitra Navratri 2026: Mar 19 - Mar 27)
function getTodayNavratriDay(): number | null {
  const today = new Date();
  const start = new Date(2026, 2, 19); // March 19 2026
  const diff  = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diff >= 0 && diff <= 8) return diff + 1;
  return null;
}

export default function NavratriOutfitsPage() {
  const todayDay = getTodayNavratriDay();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0010, #0a000a, #000)" }} />
        <div className="absolute top-10 right-10 w-64 h-64 opacity-20 rounded-full blur-[150px]"
          style={{ background: "#FF69B4" }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 opacity-15 rounded-full blur-[120px]"
          style={{ background: "#9B59B6" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
            style={{ background: "rgba(255,105,180,0.1)", borderColor: "rgba(255,105,180,0.3)", color: "#FF69B4" }}>
            🪔 Chaitra Navratri 2026 — Live Now
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Navratri Outfit Ideas 2026<br />
            <span style={{ background: "linear-gradient(135deg, #FF69B4, #9B59B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              9 Days. 9 Colours. 9 Looks.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            AI-curated Navratri outfits for every body shape and skin tone.
            From chaniya cholis to elegant anarkalis — find your perfect Garba look.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/outfit"
              className="px-8 py-3 rounded-full font-bold hover:opacity-90 transition text-black"
              style={{ background: "linear-gradient(135deg, #FF69B4, #9B59B6)" }}>
              Get My Navratri Look ✨
            </Link>
            <Link href="/quiz"
              className="px-8 py-3 rounded-full border font-semibold hover:bg-white/5 transition"
              style={{ borderColor: "rgba(255,105,180,0.5)", color: "#FF69B4" }}>
              Find My Style Persona
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 9 Days Colour Guide */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">
          Navratri 2026 — 9 Days 9 Colours
        </h2>
        <p className="text-neutral-400 text-center mb-10">
          Each day has a sacred colour. Dress right to honour the goddess.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {NAVRATRI_DAYS.map((day) => {
            const isToday = todayDay === day.day;
            return (
              <motion.div key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: day.day * 0.04 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  isToday
                    ? "border-white/40 scale-105"
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
                style={isToday ? { background: `${day.hex}15`, borderColor: `${day.hex}60` } : { background: "#111" }}>
                {isToday && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-black"
                    style={{ background: day.hex }}>
                    Today
                  </span>
                )}
                <div className="w-10 h-10 rounded-full border-2 border-neutral-700"
                  style={{ background: day.hex }} />
                <p className="text-xs font-bold text-white text-center">Day {day.day}</p>
                <p className="text-xs text-center" style={{ color: day.hex }}>{day.colour}</p>
                <p className="text-[9px] text-neutral-600 text-center leading-tight hidden md:block">
                  {day.significance.split("—")[0]}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Outfit Grid */}
      <section className="px-6 py-16 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Top Navratri Outfits 2026
          </h2>
          <p className="text-neutral-400 text-center mb-12">
            Handpicked from Amazon India — fast delivery, every budget
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {NAVRATRI_OUTFITS.map((outfit, i) => {
              const dayInfo = NAVRATRI_DAYS[outfit.day - 1];
              return (
                <motion.a key={i} href={outfit.link} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-pink-400/50 transition-all">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={outfit.image} alt={outfit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-black"
                      style={{ background: dayInfo.hex }}>
                      {dayInfo.emoji} {outfit.tag}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white line-clamp-2 mb-2">{outfit.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: dayInfo.hex }}>{outfit.price}</span>
                      <span className="text-xs text-neutral-400 group-hover:text-pink-400 transition">
                        Shop →
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Body Shape Guide */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">
          Best Navratri Outfits by Body Shape
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Not all lehengas suit all bodies — find your most flattering Navratri look
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BODY_TIPS.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 hover:border-pink-400/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold text-white">{item.shape}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-3">{item.tip}</p>
              <div className="bg-neutral-800 rounded-xl px-3 py-2">
                <p className="text-xs text-pink-400 font-semibold">Best pick:</p>
                <p className="text-xs text-neutral-300 mt-0.5">{item.best}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/outfit"
            className="inline-block px-8 py-3 rounded-full font-bold text-black transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FF69B4, #9B59B6)" }}>
            Let AI Detect My Body Shape →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(135deg, #0d0010, #000)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want Your Perfect Navratri Look?
          </h2>
          <p className="text-neutral-400 mb-8 text-lg">
            Upload your photo — Outfevibe&apos;s AI detects your body shape and skin tone,
            then recommends the most flattering Navratri outfit for you from Indian platforms.
          </p>
          <Link href="/outfit"
            className="inline-block px-10 py-4 rounded-full font-bold text-lg text-black transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FF69B4, #9B59B6)" }}>
            Get My AI Navratri Look 🪔
          </Link>
        </motion.div>
      </section>

      {/* SEO text */}
      <section className="px-6 py-12 max-w-4xl mx-auto border-t border-neutral-900">
        <h2 className="text-xl font-bold mb-4 text-neutral-300">
          About These Navratri Outfit Recommendations
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-4">
          Outfevibe is India&apos;s first AI-powered personal styling platform for Gen Z and Millennials.
          Our Navratri 2026 outfit collection is curated for every body shape — hourglass, pear, apple,
          rectangle, and inverted triangle — and every skin tone. All outfits follow the traditional
          9-colour guide for Chaitra Navratri 2026 (March 19–27).
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Looking for a personalised recommendation? Try our{" "}
          <Link href="/outfit" className="text-pink-400 hover:underline">AI outfit suggester</Link>{" "}
          or take our{" "}
          <Link href="/quiz" className="text-pink-400 hover:underline">free style quiz</Link>{" "}
          to discover your fashion persona. Also see our{" "}
          <Link href="/navratri-outfits" className="text-pink-400 hover:underline">full Navratri lookbook</Link>.
        </p>
      </section>

    </div>
  );
}
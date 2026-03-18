"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Recycle, ShoppingBag, Heart } from "lucide-react";
import { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#d4af7f] transition group mb-16"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-6"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
          >
            Our Story
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Built by someone
            <br />
            <span className="text-[#d4af7f]">who couldn't dress.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-neutral-400 max-w-2xl leading-relaxed"
          >
            Outfevibe didn't start in a boardroom. It started in front of a wardrobe full of clothes
            with absolutely nothing to wear.
          </motion.p>
        </motion.div>
      </section>

      {/* DIVIDER LINE */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* FOUNDING STORY */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left — big pull quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="sticky top-24"
          >
            <div className="border-l-2 border-[#d4af7f] pl-8">
              <p className="text-3xl md:text-4xl font-bold leading-tight text-white">
                "People kept telling me my clothes didn't match.
                <span className="text-[#d4af7f]"> So I built an AI that actually helps."</span>
              </p>
              <p className="mt-6 text-sm text-neutral-500 font-mono tracking-wider">
                — Gungun Jain, Founder
              </p>
            </div>
          </motion.div>

          {/* Right — story paragraphs */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6 text-neutral-400 text-base leading-relaxed"
          >
            <motion.p variants={fadeUp}>
              It started with a simple, embarrassing problem. I have always been terrible at fashion.
              My cupboard was full — shirts, kurtas, co-ords, everything — and yet every morning
              I'd stand there completely lost. I'd throw something together and walk out, only to
              hear "that doesn't match at all" from the people around me.
            </motion.p>

            <motion.p variants={fadeUp}>
              It wasn't funny anymore. It was affecting my confidence. And the worst part?
              Hundreds of clothes sitting untouched in my wardrobe while I kept wearing the same
              three outfits on rotation.
            </motion.p>

            <motion.p variants={fadeUp}>
              So I decided to build something. Not for the fashion-forward — for people like me.
              Something that looks at <span className="text-white font-medium">your body type, your skin tone, your occasion</span> and simply says:
              wear this today. This is yours. This works for you.
            </motion.p>

            <motion.p variants={fadeUp}>
              That's Outfevibe. It's not perfect yet — I'll be the first to admit we're still building.
              But every feature we ship is one step closer to what I originally needed: a personal stylist
              that fits in your pocket and actually understands who you are.
            </motion.p>
          </motion.div>

        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* MISSION */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
          >
            Our Mission
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            AI-powered styling that understands
            <br />
            <span className="text-[#d4af7f]">identity. Not just clothes.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            We believe everyone deserves to feel confident in what they wear — regardless of budget,
            body type, or fashion knowledge. Our goal is to make styling simple, personal, and
            accessible for every single person.
          </motion.p>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* PRODUCT VISION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <motion.p
              variants={fadeUp}
              className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
            >
              Where We're Going
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              The bigger vision.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-neutral-400 max-w-xl mx-auto"
            >
              Outfevibe is building toward a complete fashion ecosystem —
              one that's kind to your wallet and the planet.
            </motion.p>
          </div>

          {/* Vision cards */}
          <motion.div
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                icon: <ShoppingBag className="w-6 h-6 text-[#d4af7f]" />,
                title: "Style what you own",
                desc: "The Virtual Wardrobe lets you digitise your existing clothes and get outfit suggestions from what you already have. Stop buying more. Start wearing better.",
                status: "Coming Soon",
              },
              {
                icon: <Recycle className="w-6 h-6 text-[#d4af7f]" />,
                title: "Wear, rent, donate, repeat",
                desc: "Clothes shouldn't sit untouched forever. We're building toward a rental, donation, and resale layer — so every garment finds its purpose.",
                status: "On the Roadmap",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#d4af7f]" />,
                title: "Occasion-aware AI",
                desc: "From a wedding to a job interview to a casual Sunday — Outfevibe will know what the moment calls for and dress you accordingly.",
                status: "In Progress",
              },
              {
                icon: <Heart className="w-6 h-6 text-[#d4af7f]" />,
                title: "Fashion for everyone",
                desc: "Every body type. Every skin tone. Every budget. Style advice shouldn't be a privilege. We're making it universal.",
                status: "Core Mission",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-[#d4af7f]/40 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af7f]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-neutral-600 border border-neutral-700 px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4af7f] transition">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-8"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Be part of the journey.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-neutral-400 max-w-lg mx-auto"
          >
            We're early, we're building, and we're honest about it.
            If this resonates with you — come try it.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/outfit"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-105 transition"
            >
              Try AI Stylist
            </a>
            <a
              href="/quiz"
              className="px-8 py-4 rounded-full border border-[#d4af7f] text-[#d4af7f] font-bold hover:bg-[#d4af7f] hover:text-black transition"
            >
              Take Style Quiz
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer note */}
      <div className="max-w-5xl mx-auto px-6 pb-12 text-center">
        <p className="text-xs text-neutral-700 font-mono">
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </p>
      </div>

    </div>
  );
}
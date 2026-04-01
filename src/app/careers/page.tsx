"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Code2, Server, Palette, Brain, TrendingUp, Shirt, Database, ExternalLink } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const APPLY_LINK = "https://forms.gle/8LUm1aW8FoQid5Ds7";

const roles = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Frontend Developer",
    type: "Full-time / Part-time",
    tag: "Engineering",
    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    desc: "Build and enhance our user interface using React and Next.js. You'll own the visual experience — from animations to responsive layouts — and help make Outfevibe feel as good as it looks.",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "Backend Developer",
    type: "Full-time / Part-time",
    tag: "Engineering",
    tagColor: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    desc: "Develop and maintain our server-side logic, APIs, and database architecture using Node.js and Supabase. You'll be the backbone of everything that powers the product.",
    skills: ["Node.js", "Supabase", "PostgreSQL", "REST APIs"],
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "UI/UX Designer",
    type: "Full-time / Freelance",
    tag: "Design",
    tagColor: "text-pink-400 border-pink-400/30 bg-pink-400/10",
    desc: "Create beautiful, intuitive interfaces that feel effortless. You'll design everything from onboarding flows to AI result screens — making complex technology feel simple and stylish.",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI / ML Engineer",
    type: "Full-time / Part-time",
    tag: "AI",
    tagColor: "text-purple-400 border-purple-400/30 bg-purple-400/10",
    desc: "Help us push the intelligence of our styling engine. You'll work on body type analysis, skin tone detection, and outfit recommendation models — making our AI genuinely smarter.",
    skills: ["Python", "Computer Vision", "LLMs", "Model Fine-tuning"],
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Marketing & Growth",
    type: "Full-time / Part-time",
    tag: "Growth",
    tagColor: "text-green-400 border-green-400/30 bg-green-400/10",
    desc: "Drive awareness and user acquisition for Outfevibe. You'll own our content strategy, social presence, campaigns, and SEO — turning a great product into a known brand.",
    skills: ["Social Media", "SEO", "Content Strategy", "Analytics"],
  },
  {
    icon: <Shirt className="w-5 h-5" />,
    title: "Fashion Stylist / Curator",
    type: "Freelance / Part-time",
    tag: "Fashion",
    tagColor: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    desc: "Curate outfit collections, validate AI recommendations, and bring real fashion expertise to the platform. You'll be the human taste behind the machine intelligence.",
    skills: ["Fashion Knowledge", "Trend Awareness", "Styling", "Curation"],
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Data Researcher",
    type: "Freelance / Part-time",
    tag: "Research",
    tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    desc: "Help us build richer datasets for fashion, body types, and style preferences. Your research will directly feed our AI models and make recommendations more accurate for every user.",
    skills: ["Data Collection", "Research", "Excel / Sheets", "Attention to Detail"],
  },
];

const perks = [
  { emoji: "🚀", title: "Early equity opportunity", desc: "Join at the ground floor of something real" },
  { emoji: "🌍", title: "Remote-first", desc: "Work from anywhere, anytime" },
  { emoji: "🤖", title: "Work with cutting-edge AI", desc: "Claude Vision, Supabase, Next.js 14" },
  { emoji: "👗", title: "Shape fashion's future", desc: "Your work reaches real users every day" },
  { emoji: "📈", title: "Grow fast", desc: "Small team means big ownership and impact" },
  { emoji: "💬", title: "Direct founder access", desc: "No layers, no bureaucracy" },
];

export default function CareersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Back */}
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#d4af7f] transition group mb-16"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
          >
            We're Hiring
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Build the future
            <br />
            <span className="text-[#d4af7f]">of fashion with us.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-neutral-400 max-w-2xl leading-relaxed"
          >
            We're a small, ambitious team building AI-powered styling that actually works.
            If you're passionate about fashion, technology, or both — there's a seat at the table for you.
          </motion.p>
          <motion.div variants={fadeUp}>
            <a
              href={APPLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-105 transition"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* ── PERKS ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-10"
        >
          <div className="text-center space-y-3">
            <motion.p
              variants={fadeUp}
              className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
            >
              Why Outfevibe
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Small team.
              <span className="text-[#d4af7f]"> Big impact.</span>
            </motion.h2>
          </div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-[#d4af7f]/40 transition"
              >
                <span className="text-2xl mb-3 block">{perk.emoji}</span>
                <p className="text-sm font-semibold text-white mb-1">{perk.title}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* ── ROLES ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-10"
        >
          <div className="text-center space-y-3">
            <motion.p
              variants={fadeUp}
              className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
            >
              Open Roles
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              {roles.length} positions open.
            </motion.h2>
          </div>

          <motion.div variants={stagger} className="space-y-4">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 hover:border-[#d4af7f]/40 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#d4af7f]/10 flex items-center justify-center text-[#d4af7f] flex-shrink-0 mt-0.5">
                      {role.icon}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#d4af7f] transition">
                          {role.title}
                        </h3>
                        <span className={`text-xs font-mono px-3 py-1 rounded-full border ${role.tagColor}`}>
                          {role.tag}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 font-mono">{role.type}</p>

                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {role.desc}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {role.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="text-xs px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Apply button */}
                  <a
                    href={APPLY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl border border-[#d4af7f] text-[#d4af7f] text-sm font-semibold hover:bg-[#d4af7f] hover:text-black transition whitespace-nowrap"
                  >
                    Apply
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Don't see your role?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-neutral-400 max-w-lg mx-auto"
          >
            We're always open to extraordinary people. If you believe in what
            we're building, reach out anyway — tell us how you'd contribute.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={APPLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-105 transition"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="px-8 py-4 rounded-full border border-[#d4af7f] text-[#d4af7f] font-bold hover:bg-[#d4af7f] hover:text-black transition"
            >
              Get in Touch
            </a>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-xs text-neutral-600 font-mono"
          >
            outfevibe@gmail.com · We reply within 48 hours
          </motion.p>
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
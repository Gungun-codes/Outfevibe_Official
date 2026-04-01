"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MessageSquare, Briefcase, Newspaper, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, Variants } from "framer-motion";


const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const categories = [
  { id: "support", label: "Support", icon: <MessageSquare className="w-4 h-4" />, desc: "Help with the product" },
  { id: "partnerships", label: "Partnerships", icon: <Briefcase className="w-4 h-4" />, desc: "Work with us" },
  { id: "press", label: "Press", icon: <Newspaper className="w-4 h-4" />, desc: "Media enquiries" },
  { id: "other", label: "Other", icon: <Mail className="w-4 h-4" />, desc: "Anything else" },
];

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("support");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("feedback")
        .insert([{
          name: name.trim(),
          email: email.trim(),
          message: `[${category.toUpperCase()}] ${message.trim()}`,
        }]);

      if (error) {
        console.error("Supabase error:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setCategory("support");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#d4af7f] transition";

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

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-4 mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono tracking-[0.25em] uppercase text-[#d4af7f]"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            We'd love to
            <br />
            <span className="text-[#d4af7f]">hear from you.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-neutral-400 max-w-lg text-lg leading-relaxed"
          >
            Whether it's a question, a collab idea, or just a hi — drop us a message and we'll get back to you.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Category selector */}
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mb-3">
                What's this about?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                      category === cat.id
                        ? "border-[#d4af7f] bg-[#d4af7f]/10 text-[#d4af7f]"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    {cat.icon}
                    <div>
                      <p className="text-sm font-medium">{cat.label}</p>
                      <p className="text-xs opacity-60">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); if (status !== "idle") setStatus("idle"); }}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
              className={inputClass}
            />
            <textarea
              placeholder="Your message..."
              rows={5}
              value={message}
              onChange={(e) => { setMessage(e.target.value); if (status !== "idle") setStatus("idle"); }}
              className={inputClass}
            />

            {/* Status */}
            {status === "error" && (
              <p className="text-red-400 text-sm">
                {!name.trim() || !email.trim() || !message.trim()
                  ? "Please fill in all fields."
                  : "Something went wrong. Please try again."}
              </p>
            )}

            {status === "success" && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#d4af7f]/10 border border-[#d4af7f]/30">
                <span className="text-[#d4af7f]">✓</span>
                <p className="text-sm text-[#d4af7f] font-medium">
                  Message sent! We'll get back to you soon.
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading" || status === "success"}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
              {status === "loading" ? "Sending..." : status === "success" ? "Sent ✓" : "Send Message"}
            </button>
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Response time */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-mono tracking-widest uppercase text-neutral-500">
                Direct contact
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af7f]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#d4af7f]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">outfevibe@gmail.com</p>
                  <p className="text-xs text-neutral-500">We reply within 24–48 hours</p>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-mono tracking-widest uppercase text-neutral-500">
                What to expect
              </p>
              {[
                { emoji: "⚡", title: "Fast replies", desc: "We respond within 1–2 business days" },
                { emoji: "🤝", title: "Open to collabs", desc: "Brands, creators, and developers welcome" },
                { emoji: "💬", title: "Real humans", desc: "No bots, no auto-replies — just us" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <p className="text-xs font-mono tracking-widest uppercase text-neutral-500">
                Follow us
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Instagram", href: "https://www.instagram.com/outfevibe" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/outfevibe-offical-14903a3a9" },
                  { label: "YouTube", href: "https://youtube.com/@outfevibe" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-neutral-700 text-sm text-neutral-400 hover:border-[#d4af7f] hover:text-[#d4af7f] transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-5xl mx-auto px-6 pb-12 text-center">
        <p className="text-xs text-neutral-700 font-mono">
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </p>
      </div>

    </div>
  );
}
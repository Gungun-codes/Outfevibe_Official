"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const COMPARISON = [
  { factor: "Cost",           ai: "Free",                            human: "₹5,000–₹50,000 per session", winner: "ai" },
  { factor: "Availability",   ai: "24/7, instant",                   human: "By appointment, limited hours", winner: "ai" },
  { factor: "Body analysis",  ai: "AI detects shape + skin tone",    human: "Visual assessment", winner: "tie" },
  { factor: "India-specific", ai: "Built for Indian occasions",      human: "Varies by stylist", winner: "ai" },
  { factor: "Human judgment", ai: "Pattern-based recommendations",   human: "Emotional + contextual understanding", winner: "human" },
  { factor: "Occasion fit",   ai: "Eid, Diwali, weddings built-in", human: "Depends on experience", winner: "ai" },
  { factor: "Budget filter",  ai: "Strict budget filtering",         human: "Can recommend anything", winner: "ai" },
  { factor: "Personal touch", ai: "Improving but not human",        human: "True personal relationship", winner: "human" },
  { factor: "Shop from",      ai: "Myntra, Amazon, Meesho etc.",    human: "May recommend premium brands only", winner: "ai" },
  { factor: "Scalability",    ai: "Unlimited users simultaneously",  human: "One client at a time", winner: "ai" },
];

export default function AiStylistBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000a05] to-black" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-500 blur-[150px] opacity-10 rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-yellow-400 transition">Blog</Link>
            <span>›</span>
            <span className="text-yellow-400">AI Fashion</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            AI Stylist vs Personal Stylist —<br />
            <span className="text-yellow-400">Which is Better for Indians?</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>February 28, 2026</span><span>·</span>
            <span>4 min read</span><span>·</span>
            <span className="text-yellow-400">AI Fashion</span>
          </div>
          <p className="text-neutral-400 text-lg">
            Personal stylists cost ₹5,000–₹50,000 per session. AI stylists like Outfevibe are free.
            But is free as good? Here&apos;s an honest comparison.
          </p>
        </div>
      </section>

      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          What Does a Personal Stylist Actually Do?
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          A personal stylist meets with you, assesses your body shape, skin tone, lifestyle and
          budget, then curates outfits specifically for you. They often accompany clients shopping,
          help organise wardrobes and advise on what to wear for specific events.
          In India, a session costs anywhere from ₹5,000 for a basic consultation to ₹50,000+
          for a full wardrobe makeover.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          What Does an AI Stylist Do?
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          An AI stylist like Outfevibe analyses your photo to detect body shape and skin tone,
          asks about your occasion, budget and vibe, then recommends outfits from Indian shopping
          platforms with direct purchase links. It&apos;s free, available 24/7 and improves
          as more users provide feedback.
        </p>

        {/* Mid CTA */}
        <div className="rounded-2xl p-5 border mb-10 text-center bg-yellow-400/5 border-yellow-400/20">
          <p className="text-white font-semibold mb-1">Try Outfevibe — India&apos;s first AI Stylist</p>
          <p className="text-neutral-400 text-sm mb-4">Free. No signup needed. Results in 60 seconds.</p>
          <Link href="/outfit"
            className="inline-block px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition">
            Try Free AI Styling →
          </Link>
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-6">Head-to-Head Comparison</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left py-3 px-4 text-neutral-400">Factor</th>
                <th className="text-left py-3 px-4 text-yellow-400">AI Stylist</th>
                <th className="text-left py-3 px-4 text-neutral-400">Personal Stylist</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className={`border-b border-neutral-900 ${i % 2 === 0 ? "bg-neutral-950" : "bg-black"}`}>
                  <td className="py-3 px-4 text-white font-medium">{row.factor}</td>
                  <td className={`py-3 px-4 text-sm ${row.winner === "ai" ? "text-green-400 font-semibold" : "text-neutral-400"}`}>
                    {row.winner === "ai" && "✓ "}{row.ai}
                  </td>
                  <td className={`py-3 px-4 text-sm ${row.winner === "human" ? "text-blue-400 font-semibold" : "text-neutral-400"}`}>
                    {row.winner === "human" && "✓ "}{row.human}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Verdict</h2>
        <div className="space-y-4 mb-8">
          <div className="bg-green-950/30 rounded-2xl p-5 border border-green-900/30">
            <h3 className="font-bold text-green-400 mb-2">Choose AI Stylist if:</h3>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• You want free, instant outfit recommendations</li>
              <li>• You need India-specific occasion outfits (Eid, Diwali, college, wedding)</li>
              <li>• You shop on Myntra, Amazon, Meesho, Ajio or Flipkart</li>
              <li>• You want to understand your body shape and skin tone</li>
              <li>• You&apos;re budget-conscious</li>
            </ul>
          </div>
          <div className="bg-blue-950/30 rounded-2xl p-5 border border-blue-900/30">
            <h3 className="font-bold text-blue-400 mb-2">Choose Personal Stylist if:</h3>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• You have a major life event (wedding, high-profile function)</li>
              <li>• You want to completely overhaul your wardrobe</li>
              <li>• Budget is not a concern</li>
              <li>• You want a human relationship and ongoing styling support</li>
            </ul>
          </div>
        </div>

        <p className="text-neutral-400 leading-relaxed mb-10">
          For most Indians — especially Gen Z and Millennials — an AI stylist gives 80% of the
          value of a personal stylist at 0% of the cost. For everyday outfit decisions, college
          looks, festive wear and casual shopping, AI styling is more than sufficient.
          Personal stylists remain valuable for truly significant events where the stakes are high.
        </p>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">FAQs</h2>
        {[
          { q: "Is Outfevibe really free?", a: "Yes — Outfevibe is completely free. You can upload your photo, get your body shape and skin tone analysed, take the style quiz and receive outfit recommendations without paying anything or signing up." },
          { q: "How accurate is AI styling compared to a human stylist?", a: "AI stylists are highly accurate for body shape classification and colour matching — often more consistent than human assessment. Where humans still have an edge is in understanding emotional context, lifestyle nuances and the subtle judgment calls that come with experience." },
          { q: "Which is the best AI stylist app in India?", a: "Outfevibe is India's first AI-powered personal styling platform built specifically for Gen Z and Millennials. It's designed for Indian occasions, Indian shopping platforms and Indian skin tones — unlike international apps that don't account for Indian fashion contexts." },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      <section className="px-6 py-16 text-center bg-neutral-950">
        <h2 className="text-2xl font-bold mb-4">Try India&apos;s First AI Stylist — Free</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          No appointment. No cost. Upload your photo and get personalised outfit recommendations in 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit" className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
            Try AI Styling Free ✨
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
            { title: "Which Colours Suit Your Skin Tone? The Indian Guide", href: "/blog/skin-tone-colour-guide-india", tag: "Style Guide" },
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
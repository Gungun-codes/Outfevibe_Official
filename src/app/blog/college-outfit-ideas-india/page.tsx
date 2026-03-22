"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const OUTFIT_IDEAS = [
  { look: "Oversized Shirt + Straight Jeans", vibe: "Chill", budget: "₹800–₹1,200", tip: "The most versatile college look. Go for neutral stripes or solid pastels. Tuck in the front for shape." },
  { look: "Crop Top + High-Waist Jeans", vibe: "Trendy", budget: "₹600–₹1,000", tip: "A college classic. Choose a cotton crop tee and pair with dark wash jeans for a put-together look." },
  { look: "Co-ord Set (Top + Skirt)", vibe: "Bold", budget: "₹1,000–₹1,500", tip: "Effortlessly stylish. Matching sets always look intentional. Floral or geometric prints work best." },
  { look: "Kurta + Jeans", vibe: "Traditional Fusion", budget: "₹500–₹900", tip: "Short printed kurta with straight or flared jeans. Add a dupatta for festive college days." },
  { look: "Puff Sleeve Top + Trousers", vibe: "Classic", budget: "₹700–₹1,100", tip: "Clean and polished. A structured puff sleeve top with straight trousers looks put-together for presentations." },
  { look: "Flared Sleeve Top + Palazzo", vibe: "Boho", budget: "₹600–₹900", tip: "Comfortable and breezy for long college days. Works especially well for pear and rectangle body shapes." },
];

const BUDGET_GUIDE = [
  { range: "Under ₹500", tip: "Meesho and Amazon basics. Look for cotton tops, printed shirts. Quality is decent for the price.", platforms: "Meesho, Amazon" },
  { range: "₹500–₹1,000", tip: "Sweet spot for college wear. Myntra and Amazon have great options — H&M basics, roadster, etc.", platforms: "Myntra, Amazon, Ajio" },
  { range: "₹1,000–₹2,000", tip: "Better quality fabrics, more structured silhouettes. Good for special college occasions.", platforms: "Myntra, Ajio, Amazon" },
];

export default function CollegeBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000a1a] to-black" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/blog" className="hover:text-yellow-400 transition">Blog</Link>
            <span>›</span>
            <span className="text-yellow-400">College</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            College Outfit Ideas for<br />
            <span className="text-yellow-400">Indian Girls 2026</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-4">
            <span>March 15, 2026</span><span>·</span>
            <span>5 min read</span><span>·</span>
            <span className="text-yellow-400">College</span>
          </div>
          <p className="text-neutral-400 text-lg">
            Trendy, comfortable and budget-friendly college looks for Indian girls.
            From casual tees to smart kurtas — here&apos;s everything you need to dress
            well on campus in 2026.
          </p>
        </div>
      </section>

      <article className="px-6 py-10 max-w-3xl mx-auto">

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          What Makes a Good College Outfit in India?
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-4">
          College in India means long days — early morning lectures, canteen breaks,
          sports periods and evening hangouts. Your outfit needs to survive all of it.
          The best college outfits are: comfortable for 8+ hours, appropriate for the
          classroom, easy to style quickly in the morning, and affordable.
        </p>

        {/* Mid CTA */}
        <div className="rounded-2xl p-5 border mb-8 text-center bg-yellow-400/5 border-yellow-400/20">
          <p className="text-white font-semibold mb-2">🎒 Want AI to pick your college outfit?</p>
          <p className="text-neutral-400 text-sm mb-4">Upload your photo and get personalised picks based on your body shape and style.</p>
          <Link href="/outfit"
            className="inline-block px-6 py-2.5 rounded-full font-bold text-sm text-black bg-yellow-400 hover:bg-yellow-300 transition">
            Get My College Look →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10 mb-6">
          6 College Outfit Ideas for Indian Girls
        </h2>

        <div className="space-y-5 mb-10">
          {OUTFIT_IDEAS.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{item.look}</h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">{item.vibe}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-400">{item.budget}</span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.tip}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-6">
          Budget Guide — Where to Shop
        </h2>
        <div className="space-y-4 mb-10">
          {BUDGET_GUIDE.map((item, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-yellow-400">{item.range}</span>
                <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">{item.platforms}</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-6">
          College Outfit Tips by Body Shape
        </h2>
        {[
          { shape: "Hourglass", tip: "Fitted crop tops with high-waist jeans or skirts. Your natural waist is your best feature — show it off with tucked-in tops." },
          { shape: "Pear", tip: "Bold printed or embellished tops with dark straight-leg jeans. Draws the eye upward and balances proportions beautifully." },
          { shape: "Apple", tip: "Longline shirts and flowy tunics with straight-leg trousers. Avoid tight waistbands — empire waist styles are most flattering." },
          { shape: "Rectangle", tip: "Peplum tops, ruffled blouses and belted shirts create curves. Layer for dimension — a short jacket or shrug works well." },
          { shape: "Inverted Triangle", tip: "Wide-leg jeans, flared skirts and palazzo pants balance broader shoulders. Keep tops simple and bottoms voluminous." },
        ].map((item, i) => (
          <div key={i} className="mb-5 pb-5 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-1">{item.shape} Body Shape</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.tip}</p>
          </div>
        ))}

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">FAQs</h2>
        {[
          { q: "What is the best college outfit for Indian girls?", a: "The most versatile college outfit for Indian girls is an oversized shirt with straight-leg jeans. It works for all body shapes, is comfortable for long days, and can be dressed up or down." },
          { q: "Which app is best for college outfit ideas in India?", a: "Outfevibe is India's first AI styling app that gives personalised college outfit recommendations based on your body shape, skin tone and style personality — all from Indian shopping platforms." },
          { q: "How do I dress stylishly for college on a budget in India?", a: "Shop on Meesho and Amazon for tops under ₹500. Focus on versatile basics in neutral colours that mix and match. Invest in one good pair of jeans or trousers that you can style multiple ways." },
        ].map((item, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-neutral-900 last:border-0">
            <h3 className="font-bold text-white mb-2">{item.q}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
          </div>
        ))}

      </article>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-neutral-950">
        <h2 className="text-2xl font-bold mb-4">Get Your Personalised College Look</h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Stop guessing. Upload your photo and Outfevibe&apos;s AI finds the perfect college outfit for your body shape and style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit" className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
            Get AI College Outfit ✨
          </Link>
          <Link href="/college-outfits" className="px-8 py-3 rounded-full border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition">
            Browse College Outfits
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 py-12 border-t border-neutral-900 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Navratri Outfit Ideas 2026 — 9 Day Colour Guide", href: "/blog/navratri-outfit-ideas-2026", tag: "Festive" },
            { title: "Best Eid Outfit Ideas 2026 — For Every Body Type", href: "/blog/eid-outfit-ideas-2026", tag: "Festive" },
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
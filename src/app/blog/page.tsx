"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const POSTS = [
  {
    slug:     "navratri-outfit-ideas-2026",
    title:    "Navratri Outfit Ideas 2026 — Complete 9 Day Colour Guide",
    excerpt:  "Chaitra Navratri 2026 runs March 19–27. Day-by-day colour guide with outfit recommendations for every body shape and skin tone.",
    tag:      "Festive",
    date:     "March 22, 2026",
    readTime: "6 min read",
    image:    "/outfits/eid_03.jpg",
    hot:      true,
  },
  {
    slug:     "mahavir-jayanti-outfit-ideas-2026",
    title:    "Mahavir Jayanti Outfit Ideas 2026 — Elegant, Pure & Spiritual",
    excerpt:  "Mahavir Jayanti 2026 falls on April 4. Complete guide to white, cream and ivory ethnic wear for men and women.",
    tag:      "Festive",
    date:     "March 27, 2026",
    readTime: "4 min read",
    image:    "/outfits/wedding_14.jpg",
    hot:      true,
  },
  {
    slug:     "eid-outfit-ideas-2026",
    title:    "Best Eid Outfit Ideas 2026 — What to Wear for Every Body Type",
    excerpt:  "Complete guide to Eid outfits 2026 for Indian women. Best salwar suits, anarkalis, sharara sets matched to your body shape and skin tone.",
    tag:      "Festive",
    date:     "March 20, 2026",
    readTime: "5 min read",
    image:    "/outfits/eid_01.jpg",
    hot:      false,
  },
  {
    slug:     "college-outfit-ideas-india",
    title:    "College Outfit Ideas for Indian Girls 2026 — Trendy & Budget Friendly",
    excerpt:  "The ultimate college outfit guide for Indian girls. From casual co-ords to chic kurtas — all under ₹1,000.",
    tag:      "College",
    date:     "March 15, 2026",
    readTime: "5 min read",
    image:    "/outfits/college_05.jpg",
    hot:      false,
  },
  {
    slug:     "body-shape-outfit-guide-india",
    title:    "The Complete Body Shape Outfit Guide for Indian Women",
    excerpt:  "Hourglass, pear, apple, rectangle or inverted triangle — exactly what to wear for each body type with Indian outfit examples.",
    tag:      "Style Guide",
    date:     "March 10, 2026",
    readTime: "7 min read",
    image:    "/outfits/party_01.jpg",
    hot:      false,
  },
  {
    slug:     "skin-tone-colour-guide-india",
    title:    "Which Colours Suit Your Skin Tone? The Indian Guide",
    excerpt:  "From fair to dark — a complete colour matching guide for Indian skin tones with outfit recommendations for every shade.",
    tag:      "Style Guide",
    date:     "March 5, 2026",
    readTime: "6 min read",
    image:    "/outfits/date_07.jpg",
    hot:      false,
  },
  {
    slug:     "ai-stylist-vs-personal-stylist",
    title:    "AI Stylist vs Personal Stylist — Which is Better for Indians?",
    excerpt:  "Personal stylists cost ₹5,000–₹50,000 per session. AI stylists like Outfevibe are free. Here's an honest comparison.",
    tag:      "AI Fashion",
    date:     "February 28, 2026",
    readTime: "4 min read",
    image:    "/outfits/college_05.jpg",
    hot:      false,
  },
];

const TAG_COLORS: Record<string, string> = {
  "Festive":     "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  "College":     "bg-blue-400/10 text-blue-400 border-blue-400/30",
  "Style Guide": "bg-purple-400/10 text-purple-400 border-purple-400/30",
  "AI Fashion":  "bg-green-400/10 text-green-400 border-green-400/30",
};

const CATEGORIES = ["All", "Festive", "College", "Style Guide", "AI Fashion"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500] to-black" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400 blur-[150px] opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-500 blur-[120px] opacity-8 rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 rounded-full text-yellow-400 text-sm font-medium mb-6">
            ✦ Outfevibe Style Blog
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Outfit Ideas &<br />
            <span className="text-yellow-400">Fashion Tips for India</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg max-w-xl mx-auto">
            Body type guides, skin tone tips, occasion outfits and AI fashion insights —
            written for Gen Z and Millennials in India.
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 pb-10 max-w-6xl mx-auto">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link href={`/blog/${POSTS[0].slug}`}
            className="group grid md:grid-cols-2 gap-0 bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 hover:border-yellow-400/40 transition-all">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img src={POSTS[0].image} alt={POSTS[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/20" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TAG_COLORS[POSTS[0].tag]}`}>
                  {POSTS[0].tag}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  🔥 Live Now
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                <span>{POSTS[0].date}</span><span>·</span><span>{POSTS[0].readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition leading-snug">
                {POSTS[0].title}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-5">{POSTS[0].excerpt}</p>
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                Read article <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </motion.article>
      </section>

      {/* All Posts Grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">All Articles</h2>
          <p className="text-neutral-500 text-sm">{POSTS.length} articles</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.slice(1).map((post, i) => (
            <motion.article key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
              <Link href={`/blog/${post.slug}`}
                className="group block bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-400/40 transition-all h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TAG_COLORS[post.tag]}`}>
                      {post.tag}
                    </span>
                    {post.hot && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Hot</span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
                  </div>
                  <h2 className="font-bold text-white text-base leading-snug mb-3 group-hover:text-yellow-400 transition line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="mt-4 text-yellow-400 text-sm font-semibold flex items-center gap-2">
                    Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 py-16 text-center border-t border-neutral-900"
        style={{ background: "linear-gradient(135deg,#0a0500,#000)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Get Style Tips in Your Inbox</h2>
          <p className="text-neutral-400 text-sm mb-8">
            Weekly outfit ideas, trend alerts and festival fashion guides — for free.
          </p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-yellow-400 transition" />
            <Link href="/"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition whitespace-nowrap">
              Subscribe
            </Link>
          </div>
          <p className="text-neutral-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </section>

      {/* AI CTA */}
      <section className="px-6 py-16 text-center bg-neutral-950">
        <h2 className="text-2xl font-bold mb-3">Ready for Your Personalised Look?</h2>
        <p className="text-neutral-400 mb-8">Stop reading about outfits. Let AI find yours in 60 seconds.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/outfit"
            className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
            Get AI Outfit Suggestions ✨
          </Link>
          <Link href="/quiz"
            className="px-8 py-3 rounded-full border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition">
            Take Free Style Quiz
          </Link>
        </div>
      </section>

    </div>
  );
}
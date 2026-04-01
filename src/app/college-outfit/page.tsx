"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const COLLEGE_OUTFITS_FEMALE = [
  { title: "Womens Striped Shirt Casual Button Down Top", image: "/outfits/college_01.jpg", link: "https://amzn.to/4aBPTfp", price: "₹599", tag: "Trending", mood: "Chill" },
  { title: "Sweetheart Neck Cotton Crop Regular Top", image: "/outfits/college_02.jpg", link: "https://myntr.it/0oSa4Q8", price: "₹449", tag: "Best Seller", mood: "Chill" },
  { title: "Secret of Fashion Trendy Flared Sleeve Top", image: "/outfits/college_05.jpg", link: "https://amzn.to/4sbXU0j", price: "₹499", tag: "Trending", mood: "Bold" },
  { title: "Women Relaxed Fit Vertical Striped Shirt", image: "/outfits/college_06.jpg", link: "https://amzn.to/4lfS24h", price: "₹799", tag: "Classic", mood: "Bold" },
  { title: "Puff Sleeve Textured Top Square Neck", image: "/outfits/college_07.jpg", link: "https://amzn.to/4r0wLwG", price: "₹499", tag: "Budget Pick", mood: "Classic" },
  { title: "Two-Piece Crop Top and High-Waist Skirt Set", image: "/outfits/college_08.jpg", link: "https://amzn.to/47bNMN3", price: "₹1,299", tag: "Premium", mood: "Classic" },
];

const COLLEGE_OUTFITS_MALE = [
  { title: "Combo Cotton Blend Casual Shirt for Men", image: "/outfits/college_09.jpg", link: "https://amzn.to/4qWvp5M", price: "₹599", tag: "Best Seller", mood: "Classic" },
  { title: "Textured Fabric Solid Half-Open Collar T-Shirt", image: "/outfits/college_10.jpg", link: "https://amzn.to/3MH2o05", price: "₹799", tag: "Trending", mood: "Classic" },
  { title: "Quarter Zip Fleece Sweatshirt Hoodie", image: "/outfits/college_11.jpg", link: "https://amzn.to/3OxkWR3", price: "₹1,299", tag: "Premium", mood: "Chill" },
  { title: "Oversized Anime Back Printed T-Shirt", image: "/outfits/college_12.jpg", link: "https://amzn.to/4qVR0eA", price: "₹449", tag: "Budget Pick", mood: "Chill" },
  { title: "JVX Men Oversized Casual Shirt", image: "/outfits/college_13.jpg", link: "https://amzn.to/4tXzERw", price: "₹499", tag: "Trending", mood: "Bold" },
  { title: "Noble Monk Solid Polo Collar Tshirt", image: "/outfits/college_14.jpg", link: "https://amzn.to/4bbGg7m", price: "₹699", tag: "Classic", mood: "Bold" },
];

const STYLE_TIPS = [
  { title: "Chill & Casual", emoji: "😎", desc: "Oversized tees, cargo pants, sneakers. Comfortable and effortlessly cool.", colours: "Neutrals, earth tones, pastels" },
  { title: "Bold & Trendy", emoji: "🔥", desc: "Statement prints, co-ord sets, structured silhouettes. Stand out on campus.", colours: "Bright colours, contrast combos" },
  { title: "Classic & Clean", emoji: "✨", desc: "Fitted shirts, straight trousers, minimal accessories. Polished every day.", colours: "White, navy, beige, grey" },
  { title: "Traditional Fusion", emoji: "🌸", desc: "Kurtas with jeans, printed dupattas, ethnic sneakers. India-meets-modern.", colours: "Jewel tones, pastels, ivory" },
];

const BODY_TIPS_FEMALE = [
  { shape: "Hourglass ⧖", tip: "Fitted crop tops with high-waist bottoms highlight your natural waist. Co-ord sets work beautifully." },
  { shape: "Pear 🍐", tip: "Bold printed or embellished tops with dark straight-leg jeans. Draw attention upward." },
  { shape: "Apple 🍎", tip: "Longline shirts and flowy tunics with straight-leg trousers. Avoid tight waistbands." },
  { shape: "Rectangle ▭", tip: "Peplum tops, ruffled blouses and belted shirts create curves. Layer for dimension." },
  { shape: "Inverted Triangle ▽", tip: "Flared skirts, wide-leg pants, A-line silhouettes balance broader shoulders." },
];

export default function CollegeOutfitsPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000a1a] to-black" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 blur-[150px] opacity-15 rounded-full" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-yellow-400 blur-[120px] opacity-10 rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 rounded-full text-yellow-400 text-sm font-medium mb-6">
            🎒 College Fashion 2026
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            College Outfit Ideas<br />
            <span className="text-yellow-400">for Indian Students</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
            Trendy, budget-friendly college looks for girls and boys. AI-curated picks
            from Amazon, Myntra & Meesho — all under ₹1,000.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/outfit"
              className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
              Get My College Look ✨
            </Link>
            <Link href="/quiz"
              className="px-8 py-3 rounded-full border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition">
              Find My Style Persona
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Style Moods */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Pick Your College Vibe</h2>
        <p className="text-neutral-400 text-center mb-10">What mood are you dressing for today?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STYLE_TIPS.map((style, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 hover:border-yellow-400/40 transition text-center">
              <span className="text-3xl mb-3 block">{style.emoji}</span>
              <h3 className="font-bold text-white text-sm mb-2">{style.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-2">{style.desc}</p>
              <p className="text-xs text-yellow-400">{style.colours}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Girls Outfits */}
      <section className="px-6 py-16 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">College Outfits for Girls 2026</h2>
          <p className="text-neutral-400 text-center mb-12">Trending picks under ₹1,000 from Indian platforms</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {COLLEGE_OUTFITS_FEMALE.map((outfit, i) => (
              <motion.a key={i} href={outfit.link} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-400/50 transition-all">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={outfit.image} alt={outfit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                    {outfit.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                    {outfit.mood}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white line-clamp-2 mb-2">{outfit.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold">{outfit.price}</span>
                    <span className="text-xs text-neutral-400 group-hover:text-yellow-400 transition">Shop →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Boys Outfits */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">College Outfits for Boys 2026</h2>
        <p className="text-neutral-400 text-center mb-12">Clean, casual and affordable picks for Indian guys</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {COLLEGE_OUTFITS_MALE.map((outfit, i) => (
            <motion.a key={i} href={outfit.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-400/50 transition-all">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={outfit.image} alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                  {outfit.tag}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-white line-clamp-2 mb-2">{outfit.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{outfit.price}</span>
                  <span className="text-xs text-neutral-400 group-hover:text-yellow-400 transition">Shop →</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Body Shape Tips */}
      <section className="px-6 py-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">College Outfits by Body Shape</h2>
          <p className="text-neutral-400 text-center mb-12">Dress for your shape, not just what&apos;s trending</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BODY_TIPS_FEMALE.map((item, i) => (
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
              className="inline-block px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">
              Let AI Detect My Body Shape →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Want a Look Made Just for You?</h2>
          <p className="text-neutral-400 mb-8">
            Upload your photo and Outfevibe&apos;s AI will detect your body shape and skin tone,
            then recommend the perfect college outfit from Indian shopping platforms.
          </p>
          <Link href="/outfit"
            className="inline-block px-10 py-4 rounded-full bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition">
            Get My AI College Look ✨
          </Link>
        </motion.div>
      </section>

      {/* SEO text */}
      <section className="px-6 py-12 max-w-4xl mx-auto border-t border-neutral-900">
        <h2 className="text-xl font-bold mb-4 text-neutral-300">About These College Outfit Recommendations</h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-4">
          Outfevibe is India&apos;s first AI-powered personal styling platform for Gen Z and Millennials.
          Our college outfit collection is curated specifically for Indian students — budget-friendly picks
          under ₹1,000 from Amazon India, Myntra, Meesho, Ajio and Flipkart. Every recommendation is
          filtered by body shape, mood and occasion.
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Want personalised picks? Try our{" "}
          <Link href="/outfit" className="text-yellow-400 hover:underline">AI outfit suggester</Link> or{" "}
          <Link href="/quiz" className="text-yellow-400 hover:underline">free style quiz</Link>.
          Also see our{" "}
          <Link href="/blog/college-outfit-ideas-india" className="text-yellow-400 hover:underline">college style guide</Link>.
        </p>
      </section>

    </div>
  );
}
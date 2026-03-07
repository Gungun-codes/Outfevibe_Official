"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Sparkles } from "lucide-react";
import outfitsData from "../../backend/outfits.json";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'general' | 'festive' | 'forYou'>('general')
  const [activeGender, setActiveGender] = useState<'women' | 'men'>('women')
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false)
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  const trendingList = useMemo(() => {
    const categoryMap: any = {
      general: "general_trending",
      festive: "holi_trending",
      forYou: "persona_trending"
    }
    const genderMap: any = {
      men: "male",
      women: "female"
    }
    const selectedCategory = categoryMap[activeCategory]
    const selectedGender = genderMap[activeGender]

    const filtered = outfitsData.filter((item: any) =>
      item.categories?.includes(selectedCategory) &&
      item.gender === selectedGender
    )
    return filtered.slice(0, 4)
  }, [activeCategory, activeGender])

  return (
    <div>
      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b border-neutral-800/40 ${darkMode ? 'bg-black' : 'bg-white'}`}>

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <img src="/outfevibe_logo.png" alt="Outfevibe Logo" className="h-6 w-6" />
            <span className={`${darkMode ? 'text-white' : 'text-black'}`}>
              Outfevibe
            </span>
          </div>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center gap-8 text-sm ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>

            <a href="#about" className="hover:text-yellow-400 transition">
              About
            </a>

            <a href="#trending" className="hover:text-yellow-400 transition">
              Trending
            </a>

            <a href="#features" className="hover:text-yellow-400 transition">
              Features
            </a>

            <a href="#feedback" className="hover:text-yellow-400 transition">
              Feedback
            </a>

          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-700 hover:border-yellow-400 transition" onClick={() => setDarkMode(!darkMode)}>
              ☀️
            </button>

            {/* LOGIN BUTTON */}
            <div>
              {user ? (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                  className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-[#d4af7f] transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className={`px-6 py-2.5 rounded-full font-semibold transition
${darkMode ? "bg-white text-black hover:bg-[#d4af7f]" : "bg-black text-white hover:bg-neutral-800"}
`}                >
                  Login
                </button>
              )}
            </div>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

        {/* GOLDEN RING */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-52 h-52 rounded-full border-[3px] border-yellow-400 opacity-40"
          style={{
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
          }}
        />

        {/* GOLD GLOW */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-yellow-400 blur-[120px] opacity-30 rounded-full"></div>

        {/* SPARKLES (fixed positions to avoid hydration mismatch) */}
        <div className="absolute inset-0 pointer-events-none">

          <motion.span
            className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`}
            style={{ left: "20%", top: "35%" }}
            animate={{ opacity: [0, 1, 0], y: [0, 30] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <motion.span
            className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`}
            style={{ left: "70%", top: "60%" }}
            animate={{ opacity: [0, 1, 0], y: [0, 30] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <motion.span
            className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`}
            style={{ left: "40%", top: "80%" }}
            animate={{ opacity: [0, 1, 0], y: [0, 30] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          <motion.span
            className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`}
            style={{ left: "85%", top: "25%" }}
            animate={{ opacity: [0, 1, 0], y: [0, 30] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

        </div>

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="backdrop-blur-md bg-white/5 border border-yellow-400/40 px-5 py-2 rounded-full text-sm text-yellow-200 mb-8"
        >
          🌙 AI-Based Outfit Suggestion
        </motion.div>

        {/* HEADING */}
        <h1 className={`text-4xl md:text-6xl font-bold leading-tight max-w-3xl ${darkMode ? 'text-white' : 'text-black'}`}>

          This Eid, Let Your Outfit
          <br />

          Speak

          <span className="relative ml-3 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            <span>NOOR</span>
            {/* Sparkle Animation moved to the side of NOOR */}
            <motion.span
              className="text-yellow-400 text-xl"
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 20, -20, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              ✨
            </motion.span>
          </span>

        </h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-400 mt-6 max-w-xl"
        >
          Discover your personalized festive style powered by AI.
          Elevate your Eid celebration with curated elegance.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mt-10"
        >

          <a href="/quiz" className="relative px-8 py-3 rounded-full font-semibold inline-block
bg-gradient-to-r from-yellow-400 to-yellow-500
text-black
hover:scale-105 transition">
            <span className="relative z-10">
              Let's Style Me
            </span>
            <span className="absolute inset-0 rounded-full blur-xl bg-yellow-400 opacity-40 animate-pulse"></span>
          </a>

          <a href="/outfit" className="px-8 py-3 rounded-full border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black transition inline-block">
            Find My Personalized Fit
          </a>

        </motion.div>

      </section>

      {/* TRENDING */}
      <section id="trending" className={`px-6 py-20 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
          className={`text-4xl md:text-5xl font-extrabold text-center ${darkMode ? 'text-white' : 'text-black'}`}
        >
          Trending Outfits
        </motion.h2>

        <p className={`text-center mt-3 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Stay ahead of the curve. Curated fits that define the moment.
        </p>

        {/* Segmented categories */}
        <div className="flex justify-center mt-6">
          <div className={`flex flex-wrap items-center gap-2 px-2 py-2 rounded-full border ${darkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-white'} shadow-sm`}>
            <button
              onClick={() => setActiveCategory('general')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'general' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}
            >
              🔥 General
            </button>

            <button
              onClick={() => setActiveCategory('festive')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'festive' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}
            >
              ✨ Festive
            </button>

            <button
              onClick={() => setActiveCategory('forYou')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'forYou' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}
            >
              🫶 For You
            </button>
          </div>
        </div>

        {/* Gender toggle */}
        <div className="flex justify-center mt-6">
          <div className={`flex items-center p-1 rounded-full ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-100 border border-neutral-200'}`}>
            <button
              onClick={() => setActiveGender('women')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeGender === 'women' ? 'bg-neutral-800 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-white')}`}
            >
              Women
            </button>

            <button
              onClick={() => setActiveGender('men')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeGender === 'men' ? 'bg-neutral-800 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-white')}`}
            >
              Men
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {trendingList.map((card: any, idx: number) => (
            <div
              key={`${card.title || card.image || 'it'}-${idx}`}
              className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-100 border border-neutral-200'} shadow-sm`}
            >

              <div className="h-60 w-full overflow-hidden">
                <img
                  src={card.image || ''}
                  alt={card.title || ''}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className={`${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-black'} px-4 py-3`}>

                <div className="font-medium">{card.title || 'Trending Fit'}</div>

                {/* Explore Affiliate Link */}
                {card.affiliateLink && (
                  <a
                    href={card.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-semibold text-pink-500 hover:underline"
                  >
                    Explore →
                  </a>
                )}

              </div>

            </div>
          ))}
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" className={`px-6 py-24 text-center ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

        <motion.h2
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold mb-16">
          How It <span className="text-yellow-400">Works</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              icon: <Upload className="mx-auto text-yellow-400 mb-4" />,
              title: "Upload Your Wardrobe",
              text: "Snap photos of your clothes or browse curated pieces"
            },
            {
              icon: <Cpu className="mx-auto text-yellow-400 mb-4" />,
              title: "AI Analyzes Style",
              text: "AI learns your body type and preferences"
            },
            {
              icon: <Sparkles className="mx-auto text-yellow-400 mb-4" />,
              title: "Get Suggestions",
              text: "Receive personalized outfit recommendations"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn}
              className={`${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} p-6 rounded-xl`}>

              {item.icon}
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-neutral-400 text-sm mt-2">{item.text}</p>

            </motion.div>
          ))}

        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >

        <div className="max-w-6xl mx-auto text-center">

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Explore Features
          </motion.h2>

          <p className={`mt-4 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Powerful tools designed to elevate your fashion decisions.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">

            {/* AI Outfit Suggestions */}
            <motion.a
              href="/outfit"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl text-left transition shadow-lg 
        ${darkMode
                  ? "bg-neutral-900 border border-neutral-800 hover:border-yellow-400"
                  : "bg-neutral-100 border border-neutral-200 hover:border-yellow-500"}
        `}
            >

              <h3 className="text-xl font-semibold mb-3">
                AI Based Outfit Suggestions
              </h3>

              <p className={`${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                Upload your image and let our AI analyze your body shape,
                skin tone, and style preferences to recommend outfits that
                perfectly match your personality and occasion.
              </p>

            </motion.a>

            {/* Virtual Wardrobe */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl text-left shadow-lg 
        ${darkMode
                  ? "bg-neutral-900 border border-neutral-800"
                  : "bg-neutral-100 border border-neutral-200"}
        `}
            >

              <h3 className="text-xl font-semibold mb-3">
                Virtual Wardrobe
                <span className="ml-3 text-sm text-yellow-400">
                  Coming Soon
                </span>
              </h3>

              <p className={`${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                Upload and organize your real wardrobe digitally.
                Mix and match your clothes, plan outfits for events,
                and get smart recommendations from the items you already own.
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section
        id="about"
        className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >

        <div className="max-w-4xl mx-auto text-center">

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            About Outfevibe
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`mt-8 text-lg leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"
              }`}
          >
            Outfevibe is a smart fashion platform that helps you discover outfits that truly match your style.
            Instead of spending hours deciding what to wear, you can upload your photo and get outfit ideas
            based on your body type, skin tone, and the occasion. Our goal is to make styling simple,
            fun, and accessible for everyone. With Outfevibe, finding the right outfit becomes faster,
            easier, and more confident.
          </motion.p>

        </div>

      </section>

      {/* TESTIMONIAL */}
      <section className={`px-6 py-20 text-center overflow-hidden ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

        <motion.h2
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12"
        >
          What Users <span className="text-yellow-400">Say</span>
        </motion.h2>

        {!mounted ? null : (

          <div className="relative w-full overflow-hidden">

            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            >

              {[
                {
                  text: "Outfevibe made choosing outfits so much easier. I get ready faster and feel more confident.",
                  name: "Riya Sharma — Delhi"
                },
                {
                  text: "I love how simple it is. Just open the app and instantly get outfit ideas.",
                  name: "Emily Watson — London"
                },
                {
                  text: "It feels like having a personal stylist. Perfect for college and casual outings.",
                  name: "Aisha Khan — Mumbai"
                },
                {
                  text: "The AI outfit suggestions are surprisingly accurate. It really understands my style.",
                  name: "Sophia Martinez — Madrid"
                },
                {
                  text: "Fashion decisions used to take me so long. Outfevibe made everything quicker.",
                  name: "Neha Patel — Ahmedabad"
                }
              ].concat([
                {
                  text: "Outfevibe made choosing outfits so much easier. I get ready faster and feel more confident.",
                  name: "Riya Sharma — Delhi"
                },
                {
                  text: "I love how simple it is. Just open the app and instantly get outfit ideas.",
                  name: "Emily Watson — London"
                },
                {
                  text: "It feels like having a personal stylist. Perfect for college and casual outings.",
                  name: "Aisha Khan — Mumbai"
                },
                {
                  text: "The AI outfit suggestions are surprisingly accurate. It really understands my style.",
                  name: "Sophia Martinez — Madrid"
                },
                {
                  text: "Fashion decisions used to take me so long. Outfevibe made everything quicker.",
                  name: "Neha Patel — Ahmedabad"
                }
              ]).map((item, i) => (

                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} p-8 rounded-xl min-w-[300px] md:min-w-[360px] shadow-lg`}
                >

                  <p className="italic text-neutral-300">
                    "{item.text}"
                  </p>

                  <div className="mt-4 text-sm text-neutral-400">
                    {item.name}
                  </div>

                </motion.div>

              ))}

            </motion.div>

          </div>

        )}

      </section>

      {/* FEEDBACK */}
      <section
        id="feedback"
        className={`px-6 py-20 w-full ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
      >

        <div className="max-w-xl mx-auto">

          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-black'}`}
          >
            Submit Feedback
          </motion.h2>

          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault()

              const form = e.target as HTMLFormElement
              const formData = new FormData(form)

              const name = formData.get("name")
              const email = formData.get("email")
              const message = formData.get("message")

              const { error } = await supabase.from("feedback").insert([
                {
                  name,
                  email,
                  message
                }
              ])

              if (!error) {
                alert("Thank you for your feedback ❤️")
                form.reset()
              } else {
                alert("Something went wrong.")
                console.error(error)
              }
            }}
          >

            <input
              name="name"
              placeholder="Your Name"
              className={`${darkMode ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400' : 'bg-white border-neutral-300 text-black placeholder-neutral-500'} p-3 rounded-lg border`}
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              className={`${darkMode ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400' : 'bg-white border-neutral-300 text-black placeholder-neutral-500'} p-3 rounded-lg border`}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              className={`${darkMode ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400' : 'bg-white border-neutral-300 text-black placeholder-neutral-500'} p-3 rounded-lg border`}
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Share Your Thoughts
            </button>

          </form>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className={`border-t px-6 py-16 ${darkMode
          ? "bg-black text-white border-neutral-800"
          : "bg-white text-black border-neutral-200"
          }`}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold tracking-wide">
              OUTFEVIBE
            </h3>

            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-4 text-sm leading-relaxed`}>
              AI-powered styling that understands identity.
              Not just clothes.
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href="https://www.instagram.com/what.gungun?igsh=NDBma3Fzdnp3bG5q"
                target="_blank"
                className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}
              >
                IG
              </a>

              <a
                href="https://www.linkedin.com/in/gungun-jain-1508"
                target="_blank"
                className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}
              >
                LN
              </a>

              <a
                href="https://youtube.com/@heygungun?si=QH1rCAhN-7EeNMvP"
                target="_blank"
                className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}
              >
                YT
              </a>

            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>

            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>

              <li>
                <Link href="/outfit" className="hover:text-yellow-400 transition">
                  AI Outfit Suggestions
                </Link>
              </li>

              <li className="hover:text-yellow-400 transition">
                Virtual Wardrobe
              </li>

              <li>
                <Link href="/quiz" className="hover:text-yellow-400 transition">
                  Style Quiz
                </Link>
              </li>

            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>

            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>

              <li>
                <Link href="/about" className="hover:text-yellow-400 transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/careers" className="hover:text-yellow-400 transition">
                  Careers
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition">
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>

            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
              Get early access to new features and drops.
            </p>

            <div className="flex">

              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded-l-xl focus:outline-none ${darkMode
                  ? "bg-black border border-neutral-700 text-white placeholder-neutral-400"
                  : "bg-white border border-neutral-300 text-black placeholder-neutral-500"
                  }`}
              />

              <button
                onClick={() => {
                  if (!email) return alert("Enter Email First!");
                  alert("You Are On The List!");
                }}
                className="px-6 bg-[#d4af7f] text-black font-semibold rounded-r-xl hover:opacity-90 transition"
              >
                Join
              </button>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div
          className={`border-t mt-16 pt-6 text-center text-sm ${darkMode
            ? "border-neutral-800 text-gray-500"
            : "border-neutral-200 text-gray-600"
            }`}
        >
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </div>
      </footer>

    </div>
  );
}
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Sparkles } from "lucide-react";
import outfitsData from "../../backend/outfits.json";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

function FeedbackForm({ darkMode }: { darkMode: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
        .insert([{ name: name.trim(), email: email.trim(), message: message.trim() }]);

      if (error) {
        console.error("Supabase error:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("error");
    }
  };  

  const inputClass = `w-full p-3 rounded-lg border text-sm ${
    darkMode
      ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400"
      : "bg-white border-neutral-300 text-black placeholder-neutral-500"
  }`;

  
  return (
    <div className="flex flex-col gap-4">
      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Your Message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={inputClass}
      />

      {/* Status messages */}
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          {!name.trim() || !email.trim() || !message.trim()
            ? "Please fill in all fields."
            : "Something went wrong. Please try again."}
        </p>
      )}
      {status === "success" && (
        <p className="text-green-400 text-sm text-center">
          Thank you for your feedback ❤️
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "loading" ? "Sending..." : "Share Your Thoughts"}
      </button>
    </div>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const testimonials = [
  {
    image: "/Feedback/feedback_01.jpg",
    name: "Neha Rajput",
    location: "Outfevibe User",
    text: "I absolutely love this app! it has made getting dressed so much fun and honestly helped me rediscover pieces I haven't worn in months. the outfevibe is really fun and it suggests combinations I never would have thought of on my own. It's super easy to use, A must-have for anyone looking to organize their wardrobe."
  },
  {
    image: "/Feedback/feedback_02.jpg",
    name: "Simran Karnwal",
    location: "Outfevibe User",
    text: "The website looks really nice and the design is user-friendly. The outfit concept is interesting. overall, it's impressive and has great potential. The layout is clean and easy to understand."
  },
  {
    image: "/Feedback/feedback_03.jpg",
    name: "Kamran Faraz Khan",
    location: "Outfevibe User",
    text: "The website demonstrates an excellent level of usability and professionalism. It's intuitive layout and well-structured interface. the content is presented in a clear and coherent manner, enhancing the overall user experience. Additionally, the website operates efficiently with minimal loading time."
  },
  {
    image: "/Feedback/feedback_04.jpg",
    name: "Palak Yadav",
    location: "Outfevibe User",
    text: "Your outfit collections are total style explosion-fresh, trendy, and so relatable! The way you curate each look is pure perfection."
  },
  {
    image: "/Feedback/feedback_05.jpg",
    name: "Debasish Mallick",
    location: "Outfevibe User",
    text: "love it. website's clean, elegant, super eye-catching. No unnecessary stuff, just what's needed. And the best part... the product actually works."
  },
];

function NewsletterSignup({ darkMode }: { darkMode: boolean }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setStatus("success");
        setNewsletterEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={newsletterEmail}
          onChange={(e) => {
            setNewsletterEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
          disabled={status === "success"}
          className={`flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 transition
            ${darkMode
              ? "bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500"
              : "bg-white border border-neutral-300 text-black placeholder-neutral-400"}
            ${status === "success" ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
        <button
          onClick={handleSubscribe}
          disabled={status === "loading" || status === "success"}
          className="px-6 py-3 bg-[#d4af7f] text-black font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap text-sm"
        >
          {status === "loading" ? "Joining..." : status === "success" ? "You're in ✓" : "Join"}
        </button>
      </div>
      {status === "success" && (
        <p className="text-green-400 text-xs">
          🎉 Welcome to Outfevibe! Check your inbox for a surprise.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs">
          {!newsletterEmail.includes("@") ? "Please enter a valid email." : "Something went wrong. Try again."}
        </p>
      )}
    </div>
  );
}

function WaitlistForm({ darkMode }: { darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleJoin = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("feedback")
        .insert([{
          name: "Waitlist",
          email: email.trim(),
          message: "Joined Virtual Wardrobe waitlist",
        }]);

      if (error) {
        console.error("Supabase error:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
        <span className="text-yellow-400 text-lg">✓</span>
        <p className="text-sm text-yellow-400 font-medium">
          You're on the list! We'll notify you at launch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 transition
            ${darkMode
              ? "bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500"
              : "bg-white border border-neutral-300 text-black placeholder-neutral-400"
            }`}
        />
        <button
          onClick={handleJoin}
          disabled={status === "loading"}
          className="px-5 py-2.5 bg-yellow-400 text-black text-sm font-bold rounded-xl hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs pl-1">
          {!email.includes("@") ? "Please enter a valid email." : "Something went wrong. Try again."}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'general' | 'festive' | 'forYou'>('general')
  const [activeGender, setActiveGender] = useState<'women' | 'men'>('women')
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false)
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 2500);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, activeIndex]);

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent, startX: number) => {
    const endX = 'touches' in e
      ? (e as React.TouchEvent).changedTouches[0].clientX
      : (e as React.MouseEvent).clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
  };

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

  const getUserInitials = () => {
    const name =
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const userAvatar = user?.user_metadata?.avatar_url || null;

  return (
    <div>
      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b border-neutral-800/40 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <img src="/outfevibe_logo.png" alt="Outfevibe Logo" className="h-6 w-6" />
            <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Outfevibe</span>
          </div>

          {/* Nav links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
            <a href="#about" className="hover:text-yellow-400 transition">About</a>
            <a href="#trending" className="hover:text-yellow-400 transition">Trending</a>
            <a href="#features" className="hover:text-yellow-400 transition">Features</a>
            <a href="#feedback" className="hover:text-yellow-400 transition">Feedback</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-700 hover:border-yellow-400 transition"
              onClick={() => setDarkMode(!darkMode)}
            >
              ☀️
            </button>

            {authLoading ? (
              <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => router.push("/profile")}
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-yellow-400 hover:border-yellow-300 transition flex items-center justify-center"
                title="Go to Profile"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-black text-xs font-bold">{getUserInitials()}</span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className={`px-6 py-2.5 rounded-full font-semibold transition ${darkMode ? "bg-white text-black hover:bg-[#d4af7f]" : "bg-black text-white hover:bg-neutral-800"}`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={`relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-52 h-52 rounded-full border-[3px] border-yellow-400 opacity-40"
          style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
        />
        <div className="absolute top-20 right-20 w-40 h-40 bg-yellow-400 blur-[120px] opacity-30 rounded-full"></div>
        <div className="absolute inset-0 pointer-events-none">
          <motion.span className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`} style={{ left: "20%", top: "35%" }} animate={{ opacity: [0, 1, 0], y: [0, 30] }} transition={{ duration: 5, repeat: Infinity }} />
          <motion.span className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`} style={{ left: "70%", top: "60%" }} animate={{ opacity: [0, 1, 0], y: [0, 30] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.span className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`} style={{ left: "40%", top: "80%" }} animate={{ opacity: [0, 1, 0], y: [0, 30] }} transition={{ duration: 7, repeat: Infinity }} />
          <motion.span className={`absolute w-[3px] h-[3px] rounded-full ${darkMode ? 'bg-white' : 'bg-yellow-400/70'}`} style={{ left: "85%", top: "25%" }} animate={{ opacity: [0, 1, 0], y: [0, 30] }} transition={{ duration: 6, repeat: Infinity }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="backdrop-blur-md bg-white/5 border border-yellow-400/40 px-5 py-2 rounded-full text-sm text-yellow-200 mb-8">
          🌙 AI-Based Outfit Suggestion
        </motion.div>
        <h1 className={`text-4xl md:text-6xl font-bold leading-tight max-w-3xl ${darkMode ? 'text-white' : 'text-black'}`}>
          This Eid, Let Your Outfit
          <br />
          Speak
          <span className="relative ml-3 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            <span>NOOR</span>
            <motion.span className="text-yellow-400 text-xl" animate={{ scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.span>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-neutral-400 mt-6 max-w-xl">
          Discover your personalized festive style powered by AI. Elevate your Eid celebration with curated elegance.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col md:flex-row gap-4 mt-10">
          <a href="/quiz" className="relative px-8 py-3 rounded-full font-semibold inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105 transition">
            <span className="relative z-10">Let's Style Me</span>
            <span className="absolute inset-0 rounded-full blur-xl bg-yellow-400 opacity-40 animate-pulse"></span>
          </a>
          <a href="/outfit" className="px-8 py-3 rounded-full border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black transition inline-block">
            Find My Personalized Fit
          </a>
        </motion.div>
      </section>

      {/* TRENDING */}
      <section id="trending" className={`px-6 py-20 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn} className={`text-4xl md:text-5xl font-extrabold text-center ${darkMode ? 'text-white' : 'text-black'}`}>
          Trending Outfits
        </motion.h2>
        <p className={`text-center mt-3 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Stay ahead of the curve. Curated fits that define the moment.
        </p>
        <div className="flex justify-center mt-6">
          <div className={`flex flex-wrap items-center gap-2 px-2 py-2 rounded-full border ${darkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-white'} shadow-sm`}>
            <button onClick={() => setActiveCategory('general')} className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'general' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}>🔥 General</button>
            <button onClick={() => setActiveCategory('festive')} className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'festive' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}>✨ Festive</button>
            <button onClick={() => setActiveCategory('forYou')} className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition ${activeCategory === 'forYou' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100')}`}>🫶 For You</button>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <div className={`flex items-center p-1 rounded-full ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-100 border border-neutral-200'}`}>
            <button onClick={() => setActiveGender('women')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeGender === 'women' ? 'bg-neutral-800 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-white')}`}>Women</button>
            <button onClick={() => setActiveGender('men')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeGender === 'men' ? 'bg-neutral-800 text-white' : (darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-white')}`}>Men</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {trendingList.map((card: any, idx: number) => (
            <div key={`${card.title || card.image || 'it'}-${idx}`} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-100 border border-neutral-200'} shadow-sm`}>
              <div className="h-60 w-full overflow-hidden">
                <img src={card.image || ''} alt={card.title || ''} className="h-full w-full object-cover" />
              </div>
              <div className={`${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-black'} px-4 py-3`}>
                <div className="font-medium">{card.title || 'Trending Fit'}</div>
                {card.affiliateLink && (
                  <a href={card.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold text-pink-500 hover:underline">
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
        <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl font-bold mb-16">
          How It <span className="text-yellow-400">Works</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <Upload className="mx-auto text-yellow-400 mb-4" />, title: "Upload Your Wardrobe", text: "Snap photos of your clothes or browse curated pieces" },
            { icon: <Cpu className="mx-auto text-yellow-400 mb-4" />, title: "AI Analyzes Style", text: "AI learns your body type and preferences" },
            { icon: <Sparkles className="mx-auto text-yellow-400 mb-4" />, title: "Get Suggestions", text: "Receive personalized outfit recommendations" }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn} className={`${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} p-6 rounded-xl`}>
              {item.icon}
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-neutral-400 text-sm mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold">
            Explore Features
          </motion.h2>
          <p className={`mt-4 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Powerful tools designed to elevate your fashion decisions.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <motion.a href="/outfit" whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className={`p-8 rounded-2xl text-left transition shadow-lg ${darkMode ? "bg-neutral-900 border border-neutral-800 hover:border-yellow-400" : "bg-neutral-100 border border-neutral-200 hover:border-yellow-500"}`}>
              <h3 className="text-xl font-semibold mb-3">AI Based Outfit Suggestions</h3>
              <p className={`${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                Upload your image and let our AI analyze your body shape, skin tone, and style preferences to recommend outfits that perfectly match your personality and occasion.
              </p>
            </motion.a>
           <motion.div
  whileHover={{ scale: 1.05 }}
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className={`p-8 rounded-2xl text-left shadow-lg ${darkMode ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-100 border border-neutral-200"}`}
>
  <h3 className="text-xl font-semibold mb-3">
    Virtual Wardrobe
    <span className="ml-3 text-sm text-yellow-400">Coming Soon</span>
  </h3>
  <p className={`mb-6 ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
    Upload and organize your real wardrobe digitally. Mix and match your clothes, plan outfits for events, and get smart recommendations from the items you already own.
  </p>
  <WaitlistForm darkMode={darkMode} />
</motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={`px-6 py-24 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold">
            About Outfevibe
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className={`mt-8 text-lg leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
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
        <motion.h2 variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl font-bold mb-12">
          What Users <span className="text-yellow-400">Say</span>
        </motion.h2>

        {!mounted ? null : (
          <div className="max-w-2xl mx-auto">
            <div
              className="relative select-none cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onMouseDown={(e) => setDragStartX(e.clientX)}
              onMouseUp={(e) => { if (dragStartX !== null) { handleDragEnd(e, dragStartX); setDragStartX(null); } }}
              onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => { if (dragStartX !== null) { handleDragEnd(e, dragStartX); setDragStartX(null); } }}
            >
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} p-10 rounded-2xl shadow-lg`}
              >
                {/* Avatar + Name — side by side */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-yellow-400">
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-black'}`}>
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{testimonials[activeIndex].location}</p>
                  </div>
                </div>

                {/* Quote */}
                <p className={`italic text-base leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  {testimonials[activeIndex].text}
                </p>


              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => goTo(activeIndex - 1)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${darkMode ? 'border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400' : 'border-neutral-300 text-neutral-600 hover:border-yellow-500 hover:text-yellow-500'}`}
              >
                ‹
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 h-2 bg-yellow-400' : `w-2 h-2 ${darkMode ? 'bg-neutral-700' : 'bg-neutral-300'} hover:bg-yellow-400/50`}`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${darkMode ? 'border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400' : 'border-neutral-300 text-neutral-600 hover:border-yellow-500 hover:text-yellow-500'}`}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FEEDBACK */}
<section id="feedback" className={`px-6 py-20 w-full ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
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

    <FeedbackForm darkMode={darkMode} />
  </div>
</section>

      {/* FOOTER */}
      <footer className={`border-t px-6 py-16 ${darkMode ? "bg-black text-white border-neutral-800" : "bg-white text-black border-neutral-200"}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-wide">OUTFEVIBE</h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-4 text-sm leading-relaxed`}>
              AI-powered styling that understands identity. Not just clothes.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/outfevibe?igsh=MXFwZmZpczVsbHj0dg==" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>IG</a>
              <a href="https://www.linkedin.com/in/outfevibe-offical-14903a3a9" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>LN</a>
              <a href="https://youtube.com/@outfevibe?si=WFslmfGzuiLvrR16" target="_blank" className={`circle ${darkMode ? "hover:text-yellow-400" : "hover:text-black"}`}>YT</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <li><Link href="/outfit" className="hover:text-yellow-400 transition">AI Outfit Suggestions</Link></li>
              <li className="hover:text-yellow-400 transition">Virtual Wardrobe</li>
              <li><Link href="/quiz" className="hover:text-yellow-400 transition">Style Quiz</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className={`space-y-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <li><Link href="/about" className="hover:text-yellow-400 transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-yellow-400 transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
  <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
    Weekly style drops, straight to your inbox.
  </p>
  <NewsletterSignup darkMode={darkMode} />
</div>
        </div>
        <div className={`border-t mt-16 pt-6 text-center text-sm ${darkMode ? "border-neutral-800 text-gray-500" : "border-neutral-200 text-gray-600"}`}>
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </div>
      </footer>

    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import UserDropdown from "@/components/UserDropdown";

export default function Home() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("female");

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !message) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      setLoading(true);
      const insertData: any = {
        message: `Name: ${name}\n\nMessage: ${message}`,
        created_at: new Date().toISOString(),
      };
      if (user) {
        insertData.user_id = user.id;
      }

      const { error } = await supabase
        .from("feedback")
        .insert(insertData);

      if (error) throw error;

      alert("Feedback submitted successfully!");
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error adding feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const femaleTrending = [
    { id: 1, name: "Power Luxe", desc: "Minimal yet bold.", image: "/trending/power_luxe.jpg", affiliateLink: "https://myntr.it/KZQlcwk", },
    { id: 2, name: "Regal Grace", desc: "Timeless elegance with commanding Aura.", image: "/trending/regal_grace.jpg", affiliateLink: "https://myntr.it/nqbG7HT", },
    { id: 3, name: "Blush Breeze", desc: "Confident & structured.", image: "/trending/blush_breeze.jpg", affiliateLink: "https://myntr.it/3A7h4jM", },
    { id: 4, name: "Velvet Poise", desc: "Sharp night aesthetic.", image: "/trending/velvet_poise.jpg", affiliateLink: "https://myntr.it/cduZpsB", }
  ];
  const maleTrending = [
    { id: 1, name: "Gentlemen's Reserve", desc: "Classic tailoring with quiet Luxury.", image: "/trending/gentlemen_reserve.jpg", affiliateLink: "https://myntr.it/DXSr4Q5", },
    { id: 2, name: "Urban Drift", desc: "Relaxed street style with everyday edge.", image: "/trending/urban_drift.jpg", affiliateLink: "https://myntr.it/91rJvpL", },
    { id: 3, name: "Midnight Minimal", desc: "Sharp layers with understated edge.", image: "/trending/midnight_minimal.jpg", affiliateLink: "https://myntr.it/8xeku29", },
    { id: 4, name: "Modern Gent", desc: "Relaxed premium.", image: "/trending/modern_gent.jpg", affiliateLink: "https://myntr.it/wfj2Ks0", }
  ];

  return (
    <main className="bg-[#0f0f0f] text-[#f5f5f5] min-h-screen font-sans">

      {/* ================= NAVBAR ================= */}

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left - Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <Image
              src="/outfevibe_logo.png"
              alt="Outfevibe Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-widest text-white">
              OUTFEVIBE
            </span>
          </div>

          {/* CENTER - NAV LINKS */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-gray-300">
            <a href="#about" className="hover:text-[#d4af7f] transition-colors duration-300">
              About
            </a>
            <a href="#trend" className="hover:text-[#d4af7f] transition-colors duration-300">
              Trend
            </a>
            <a href="#feature" className="hover:text-[#d4af7f] transition-colors duration-300">
              Feature
            </a>
            <a href="#feedback" className="hover:text-[#d4af7f] transition-colors duration-300">
              Feedback
            </a>
          </nav>
          {/* RIGHT - LOGIN BUTTON */}
          <div>
            {user ? (
              <UserDropdown user={user} logout={logout} />
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-[#d4af7f] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(212,175,127,0.4)]"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Personal <br />
              <span className="text-[#d4af7f]">
                Style Companion
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg max-w-lg">
              Discover outfits that match your mood, occasion and vibe —
              styled using what you already own.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => router.push("/quiz")}
                className="group relative px-8 py-3 rounded-lg bg-white text-black font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,127,0.4)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af7f]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  Let's Style
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("feature");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-black transition"
              >
                Explore
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[420px] md:h-[520px]">
            <img
              src="/hero/hero.jpg"
              alt="Outfevibe Hero"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
          </div>

        </div>
      </section>

      {/* TRENDING OUTFITS */}
      <section id="trend" className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Trending Outfits
            </h2>

            {/* Gender Toggle */}
            <div className="flex border border-black rounded-full overflow-hidden">
              <button
                onClick={() => setSelectedGender("female")}
                className={`px-6 py-2 text-sm font-medium transition ${selectedGender === "female"
                  ? "bg-black text-white"
                  : "bg-white text-black"
                  }`}
              >
                Women
              </button>

              <button
                onClick={() => setSelectedGender("male")}
                className={`px-6 py-2 text-sm font-medium transition ${selectedGender === "male"
                  ? "bg-black text-white"
                  : "bg-white text-black"
                  }`}
              >
                Men
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {(selectedGender === "female" ? femaleTrending : maleTrending).map(
              (item) => (
                <div
                  key={item.id}
                  className="border border-gray-800 bg-[#0f0f0f] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#d4af7f]/10 transition duration-300"
                >
                  {/* IMAGE — SMALLER HEIGHT */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>

                    <a
                      href={item.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[#d4af7f] text-sm hover:underline"
                    >
                      Explore Look
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>



      {/* ================= HOW IT WORKS ================= */}
      <section className="py-28 px-6 bg-black border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-20">
            How It <span className="text-[#d4af7f]">Works</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-10 relative">

            {/* CONNECTING LINE */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af7f] to-transparent opacity-20" />

            {[
              {
                number: "01",
                title: "Upload",
                desc: "Upload a clothing piece or start fresh."
              },
              {
                number: "02",
                title: "Select Context",
                desc: "Choose mood, occasion & color."
              },
              {
                number: "03",
                title: "Style Engine",
                desc: "Our AI matches pieces intelligently."
              },
              {
                number: "04",
                title: "Get Look",
                desc: "Receive powerful outfit combinations."
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative group p-10 rounded-2xl border border-[#1f1f1f] bg-[#111] hover:border-[#d4af37] transition duration-300 overflow-hidden"
              >

                {/* Big Background Number */}
                <span className="absolute
                 -top-4 
                 -left-2 
                 text-[72px] 
                 font-bold 
                 bg-gradient-to-b
                 from-[#d4af37]
                 to-[#b8860b]
                 bg-clip-text
                 text-transparent
                 opacity-20
                 transition-all 
                 duration-300 
                 group-hover:opacity-40
                 pointer-events-none
                 select-none
                 ">
                  {step.number}
                </span>

                <h3 className="text-xl font-semibold mb-3 mt-8">
                  {step.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {step.desc}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="feature" className="py-20 px-6 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* AI Outfit Suggestions */}
            <div
              onClick={() => router.push("/outfit")}
              className="cursor-pointer border border-[#1f1f1f] bg-[#151515] p-8 rounded-2xl hover:border-[#d4af7f] hover:shadow-[0_0_40px_rgba(212,175,127,0.2)] transition group"
            >
              {/* ICON */}
              <div className="mb-6">
                <img
                  src="/features/ai-suggest.png"
                  alt="AI Outfit Suggestion"
                  className="w-16 h-16 object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 group-hover:text-[#d4af7f] transition">
                AI Outfit Suggestions
              </h3>

              <p className="text-gray-400 text-sm">
                Get personalized outfit recommendations based on your personality,
                occasion, and style preferences.
              </p>
            </div>

            {/* Virtual Wardrobe */}
            <div
              className="border border-[#1f1f1f] bg-[#151515] p-8 rounded-2xl opacity-80 cursor-not-allowed hover:shadow-[0_0_40px_rgba(255,0,150,0.15)] transition"
            >
              {/* ICON */}
              <div className="mb-6">
                <img
                  src="/features/wardrobe.png"
                  alt="Virtual Wardrobe"
                  className="w-16 h-16 object-contain"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4">
                Virtual Wardrobe
              </h3>

              <p className="text-gray-400 text-sm mb-4">
                Organize and manage your wardrobe digitally. Mix, match, and plan
                your outfits effortlessly.
              </p>

              <span className="inline-block text-xs px-3 py-1 border border-gray-600 rounded-full text-gray-400">
                Coming Soon
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="py-28 px-6 bg-gradient-to-b from-black to-[#0a0a0a] border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-8">
            About <span className="text-[#d4af7f]">Outfevibe</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Outfevibe is built for individuals who want confidence without confusion.
            We style what you already own and transform your wardrobe into a system of
            powerful expression. Fashion is not gender. It is identity. It is presence.
          </p>

        </div>
      </section>
      {/* ================= TESTIMONIALS ================= */}
      <section className="py-28 px-6 border-t border-[#1f1f1f] bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            What Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Testimonial 1 */}
            <div className="relative border border-[#1f1f1f] bg-[#111] p-8 rounded-2xl hover:border-[#d4af7f] transition duration-300 group">

              <div className="text-[#d4af7f] text-3xl mb-4">❝</div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Finally a styling system that understands identity.
                Not just clothes.
              </p>

              <span className="text-xs text-[#d4af7f] tracking-wide">
                — Early User
              </span>

              {/* subtle glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-[#d4af7f]/10 via-transparent to-transparent"></div>
            </div>


            {/* Testimonial 2 */}
            <div className="relative border border-[#1f1f1f] bg-[#111] p-8 rounded-2xl hover:border-[#d4af7f] transition duration-300 group">

              <div className="text-[#d4af7f] text-3xl mb-4">❝</div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                It feels like the app actually understands my vibe.
                The personality result was scary accurate.
              </p>

              <span className="text-xs text-[#d4af7f] tracking-wide">
                — Beta Tester
              </span>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-[#d4af7f]/10 via-transparent to-transparent"></div>
            </div>


            {/* Testimonial 3 */}
            <div className="relative border border-[#1f1f1f] bg-[#111] p-8 rounded-2xl hover:border-[#d4af7f] transition duration-300 group">

              <div className="text-[#d4af7f] text-3xl mb-4">❝</div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I shared my personality result with friends —
                now they’re all using Outfevibe too.
              </p>

              <span className="text-xs text-[#d4af7f] tracking-wide">
                — College User
              </span>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-[#d4af7f]/10 via-transparent to-transparent"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEEDBACK ================= */}
      <section id="feedback" className="py-28 px-6 bg-black text-white border-t border-[#1f1f1f] relative overflow-hidden">

        {/* subtle glow background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#d4af7f]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d4af7f]/5 blur-[100px] rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Your Voice <span className="text-[#d4af7f]">Matters</span>
          </h2>

          <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
            Help us shape the future of Outfevibe. Your feedback fuels the revolution.
          </p>

          {/* Card */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-10 shadow-[0_0_60px_rgba(212,175,127,0.05)]">

            {/* Name */}
            <div className="mb-8">
              <label className="block text-sm mb-2 text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-5 py-4 rounded-xl bg-black border border-[#2a2a2a] focus:border-[#d4af7f] outline-none transition"
              />
            </div>

            {/* Message */}
            <div className="mb-10">
              <label className="block text-sm mb-2 text-gray-400">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full px-5 py-4 rounded-xl bg-black border border-[#2a2a2a] focus:border-[#d4af7f] outline-none transition resize-none"
              />
            </div>

            {/* Button */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#d4af7f] text-black font-semibold tracking-wide hover:opacity-90 transition shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#1f1f1f] bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold tracking-wide">
              OUTFEVIBE
            </h3>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              AI-powered styling that understands identity.
              Not just clothes.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/what.gungun?igsh=NDBma3Fzdnp3bG5q" target="_blank" className="circle">
                IG
              </a>

              <a href="https://www.linkedin.com/in/gungun-jain-1508" target="_blank" className="circle">LN</a>

              <a href="https://youtube.com/@heygungun?si=QH1rCAhN-7EeNMvP" target="_blank" className="circle">YT</a>

            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li> <Link href="/outfit" className="hover:text-white transition">AI Outfit Suggestions</Link></li>
              <li className="hover:text-white transition" >Virtual Wardrobe </li>
              <li> <Link href="/quiz" className="hover:text-white transition">Style Quiz</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get early access to new features and drops.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-l-xl text-sm focus:outline-none focus:border-[#d4af7f]"
              />
              <button
                onClick={() => {
                  if (!email) return alert("Enter Email First!");
                  alert("You Are On The List!");
                }}
                className="px-6 bg-[#d4af7f] text-black font-semibold rounded-r-xl hover:opacity-90 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#1f1f1f] mt-16 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Outfevibe. Built with intention.
        </div>
      </footer>

    </main >
  );
}

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information you provide directly",
        text: "When you create an account, we collect your name, email address, and password. When you use our style quiz or AI outfit suggestions, we collect your style preferences, body type, skin tone, occasion, and budget preferences.",
      },
      {
        subtitle: "Information collected automatically",
        text: "We automatically collect device information, browser type, IP address, pages visited, and time spent on the platform. We use cookies and similar tracking technologies to enhance your experience and analyze platform usage.",
      },
      {
        subtitle: "Photos you upload",
        text: "If you use our AI-powered outfit suggestions, you may upload photos of yourself. These images are processed by our AI model to analyze body shape and skin tone. We do not store your photos permanently — they are processed in real time and discarded after analysis.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "To provide and improve our services",
        text: "We use your information to deliver personalized outfit recommendations, maintain your style persona, save your outfit preferences, and improve our AI models. Your data helps us understand what's working and what needs improvement.",
      },
      {
        subtitle: "To communicate with you",
        text: "We may send you transactional emails (account verification, password reset), product updates, weekly style drops, and promotional content. You can opt out of marketing emails at any time via the unsubscribe link in any email.",
      },
      {
        subtitle: "Affiliate and shopping links",
        text: "Outfevibe uses affiliate links to platforms like Meesho, Myntra, Ajio, Flipkart, and Amazon India. When you click these links and make a purchase, we may earn a commission. This does not affect the price you pay.",
      },
    ],
  },
  {
    title: "3. Data Sharing",
    content: [
      {
        subtitle: "We do not sell your data",
        text: "Outfevibe does not sell, rent, or trade your personal information to third parties for their marketing purposes. Ever.",
      },
      {
        subtitle: "Service providers",
        text: "We share data with trusted third-party service providers who help us operate our platform — including Supabase (database), Anthropic (AI analysis), Resend (email delivery), Vercel (hosting), and Google Analytics (usage analytics). Each provider is bound by data processing agreements.",
      },
      {
        subtitle: "Legal requirements",
        text: "We may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect our rights or the safety of our users.",
      },
    ],
  },
  {
    title: "4. Data Storage & Security",
    content: [
      {
        subtitle: "Where your data is stored",
        text: "Your data is stored securely on Supabase servers. We implement industry-standard security measures including encryption in transit (HTTPS) and at rest. Your password is hashed and never stored in plain text.",
      },
      {
        subtitle: "Retention",
        text: "We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.",
      },
    ],
  },
  {
    title: "5. Your Rights",
    content: [
      {
        subtitle: "Access and correction",
        text: "You have the right to access, correct, or update your personal information at any time through your profile page on Outfevibe.",
      },
      {
        subtitle: "Deletion",
        text: "You can request deletion of your account and all associated data by contacting us at outfevibe@gmail.com. We will process your request within 30 days.",
      },
      {
        subtitle: "Opt-out",
        text: "You can opt out of push notifications through your device settings, opt out of marketing emails via the unsubscribe link, and disable cookies through your browser settings.",
      },
    ],
  },
  {
    title: "6. Children's Privacy",
    content: [
      {
        subtitle: "Age restriction",
        text: "Outfevibe is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it immediately.",
      },
    ],
  },
  {
    title: "7. Cookies",
    content: [
      {
        subtitle: "What we use cookies for",
        text: "We use essential cookies to keep you logged in and maintain your preferences (like dark/light mode). We use analytics cookies to understand how users interact with our platform. We do not use advertising cookies or sell cookie data to advertisers.",
      },
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      {
        subtitle: "Updates",
        text: "We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email or a prominent notice on our platform. The date at the top of this page indicates when the policy was last updated.",
      },
    ],
  },
  {
    title: "9. Contact Us",
    content: [
      {
        subtitle: "Questions or concerns?",
        text: "If you have any questions about this Privacy Policy or how we handle your data, please contact us at outfevibe@gmail.com. We aim to respond within 48 hours.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-neutral-800/40 bg-black/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/outfevibe_logo.png" alt="Outfevibe" width={28} height={28} className="object-contain" />
            <span className="font-bold text-lg tracking-widest">OUTFEVIBE</span>
          </div>
          <Link href="/" className="text-sm text-neutral-400 hover:text-yellow-400 transition">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/5 text-yellow-400 text-xs font-mono tracking-widest uppercase mb-6">
            Legal
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            We believe privacy is a right, not a feature. Here's exactly how Outfevibe collects, uses, and protects your data.
          </p>
          <p className="text-neutral-600 text-sm mt-4">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">

          {/* Sticky sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-4">Contents</p>
              {sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="block text-sm text-neutral-500 hover:text-yellow-400 transition py-1 border-l-2 border-transparent hover:border-yellow-400 pl-3"
                >
                  {s.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="scroll-mt-24"
              >
                <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-neutral-800">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.content.map((item, j) => (
                    <div key={j}>
                      <h3 className="text-sm font-semibold text-yellow-400 mb-2">{item.subtitle}</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </main>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 mt-16 py-10 text-center">
        <p className="text-neutral-600 text-sm">
          © {new Date().getFullYear()} Outfevibe ·{" "}
          <Link href="/privacy-policy" className="text-[#d4af7f] hover:underline">Privacy Policy</Link>
          {" · "}
          <Link href="/terms-of-service" className="text-[#d4af7f] hover:underline">Terms of Service</Link>
          {" · "}
          <a href="mailto:outfevibe@gmail.com" className="text-[#d4af7f] hover:underline">Contact</a>
        </p>
      </footer>

    </div>
  );
}
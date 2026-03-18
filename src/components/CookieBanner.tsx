"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";

export type CookieConsent = "accepted" | "declined" | null;

export const COOKIE_CONSENT_KEY = "outfevibe_cookie_consent";

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent) || null;
}

export function setCookieConsent(value: "accepted" | "declined") {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  // Dispatch event so GoogleAnalytics component can react immediately
  window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: value }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if no decision has been made yet
    const existing = getCookieConsent();
    if (!existing) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    setCookieConsent("declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[9999]"
        >
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl shadow-black/60">

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d4af7f]/10 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-4 h-4 text-[#d4af7f]" />
                </div>
                <p className="text-sm font-semibold text-white">We use cookies</p>
              </div>
              <button
                onClick={handleDecline}
                className="text-neutral-600 hover:text-neutral-400 transition flex-shrink-0 mt-0.5"
                aria-label="Decline and close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              We use cookies to improve your experience, analyse traffic via{" "}
              <span className="text-neutral-300">Google Analytics</span>, and power
              affiliate links from partners like Amazon, Meesho, Ajio, Flipkart, and Myntra.
              Essential cookies (login, preferences) always run.{" "}
              <a
                href="/contact"
                className="text-[#d4af7f] hover:underline"
              >
                Learn more
              </a>
            </p>

            {/* What's always on */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <p className="text-xs text-neutral-500">
                <span className="text-green-400 font-medium">Always on:</span>{" "}
                Supabase auth &amp; session cookies — essential for the app to work.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-xs font-semibold text-neutral-400 hover:border-neutral-600 hover:text-white transition"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black text-xs font-bold hover:opacity-90 transition"
              >
                Accept All
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
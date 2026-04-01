"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X } from "lucide-react";
import { useAuth } from "@/context/authContext";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const DISMISSED_KEY = "outfevibe_push_dismissed";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

export default function PushPermission() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false); // ← INSIDE component
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  // Mount guard — prevents SSR crash
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) return;

    const permission = Notification.permission;
    if (permission === "granted") { setStatus("granted"); return; }
    if (permission === "denied") { setStatus("denied"); return; }

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const t = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(t);
  }, [mounted]);

  // Don't render anything on server
  if (!mounted) return null;

  const handleAllow = async () => {
    setStatus("loading");
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setShow(false);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: user?.id || null,
        }),
      });

      setStatus("granted");
      setShow(false);
    } catch (err) {
      console.error("Push subscription error:", err);
      setStatus("denied");
      setShow(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShow(false);
  };

  if (status === "granted") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-400">
        <Bell className="w-3.5 h-3.5" fill="currentColor" />
        <span>Notifications on</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-24 md:max-w-sm z-[9998]"
        >
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d4af7f]/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-[#d4af7f]" />
                </div>
                <p className="text-sm font-semibold text-white">Stay in the loop</p>
              </div>
              <button onClick={handleDismiss} className="text-neutral-600 hover:text-neutral-400 transition flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Get notified about weekly style drops, new features, festival campaigns,
              and your style milestones. No spam — only the good stuff.
            </p>

            <div className="space-y-1.5 mb-4">
              {[
                "🔥 Weekly trending outfit drops",
                "✨ New features & launches",
                "🎯 Style persona updates",
                "🎪 Festival & seasonal campaigns",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-xs font-semibold text-neutral-400 hover:border-neutral-600 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <BellOff className="w-3.5 h-3.5" />
                Not now
              </button>
              <button
                onClick={handleAllow}
                disabled={status === "loading"}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black text-xs font-bold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                {status === "loading" ? "Enabling..." : "Allow"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Helper hook ──
export function useNotify() {
  const { user } = useAuth();

  const sendPush = async (type: string, payload?: string, userId?: string) => {
    try {
      await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload, userId: userId || user?.id }),
      });
    } catch (err) {
      console.error("Push notify error:", err);
    }
  };

  const sendEmail = async (type: string, to: string, payload?: string) => {
    try {
      await fetch("/api/notify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, to, payload }),
      });
    } catch (err) {
      console.error("Email notify error:", err);
    }
  };

  return { sendPush, sendEmail };
}
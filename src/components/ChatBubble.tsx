"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  role:      "bot" | "user";
  children:  React.ReactNode;
  /**
   * Pass `true` once the user has answered this bot message.
   * The bot bubble (question + chips) will fade out, leaving only
   * the user's reply bubble visible — matching the screenshot behaviour.
   */
  answered?: boolean;
}

export function ChatBubble({ role, children, answered = false }: ChatBubbleProps) {
  const { user } = useAuth();
  const avatar   = user?.user_metadata?.avatar_url || null;
  const initials = (() => {
    const name =
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name     ||
      user?.user_metadata?.name          ||
      user?.email?.split("@")[0]         ||
      "U";
    return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  })();

  // ── USER bubble ───────────────────────────────────────────────────────────
  if (role === "user") {
    return (
      <div className="flex justify-end items-end gap-2 mb-4">
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[78%] text-sm font-semibold shadow-lg"
          style={{
            background: "linear-gradient(135deg,#d4af7f,#b8860b)",
            color:      "#000",
            boxShadow:  "0 4px 20px rgba(212,175,127,0.25)",
          }}
        >
          {children}
        </motion.div>

        {/* Profile pic or initials */}
        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border-2 border-[#d4af7f]/40">
          {avatar ? (
            <img src={avatar} alt="you" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800">
              <span className="text-[10px] font-bold text-[#d4af7f]">{initials}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── BOT bubble ────────────────────────────────────────────────────────────
  // When `answered` becomes true, the entire bot turn (question + chip options)
  // fades out smoothly. Only the user's reply remains visible.
  return (
    <AnimatePresence>
      {!answered && (
        <motion.div
          key="bot-bubble"
          initial={{ opacity: 0, x: -12, scale: 0.95 }}
          animate={{ opacity: 1,  x: 0,   scale: 1   }}
          exit={{
            opacity: 0,
            scale:   0.96,
            y:       -6,
            transition: { duration: 0.25, ease: "easeIn" },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex items-start gap-2 mb-4"
        >
          {/* Outfevibe logo avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden border border-[#d4af7f]/30"
            style={{ background: "#111111" }}
          >
            <img
              src="/outfevibe_logo.png"
              alt="Outfevibe"
              className="w-6 h-6 object-contain"
            />
          </div>

          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] text-sm shadow-sm"
            style={{
              background:  "#161616",
              border:      "1px solid #2a2a2a",
              color:       "#e5e5e5",
              lineHeight:  "1.6",
            }}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#d4af7f]/30"
        style={{ background: "#111111" }}
      >
        <img src="/outfevibe_logo.png" alt="Outfevibe" className="w-6 h-6 object-contain" />
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm"
        style={{ background: "#161616", border: "1px solid #2a2a2a" }}
      >
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full inline-block animate-bounce"
              style={{ background: "#d4af7f", animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
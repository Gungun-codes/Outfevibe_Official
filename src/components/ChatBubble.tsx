"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: "bot" | "user";
  children: React.ReactNode;
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end items-end gap-2 mb-4">
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%] text-sm font-semibold shadow-md"
          style={{ background: "linear-gradient(135deg,#e91e8c,#9c27b0)", color: "#fff" }}
        >
          {children}
        </motion.div>
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{ background: "linear-gradient(135deg,#f3e8ff,#fce7f3)" }}>
          <svg className="w-4 h-4" style={{ color: "#9c27b0" }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ background: "linear-gradient(135deg,#e91e8c,#9c27b0)" }}>
        <span className="text-white text-xs">✨</span>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -12, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] text-sm text-gray-700 shadow-sm border border-purple-50"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ background: "linear-gradient(135deg,#e91e8c,#9c27b0)" }}>
        <span className="text-white text-xs">✨</span>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-purple-50">
        <div className="flex gap-1.5 items-center">
          <span className="dot1 w-2 h-2 rounded-full bg-purple-400 inline-block" />
          <span className="dot2 w-2 h-2 rounded-full bg-purple-400 inline-block" />
          <span className="dot3 w-2 h-2 rounded-full bg-purple-400 inline-block" />
        </div>
      </div>
    </div>
  );
}
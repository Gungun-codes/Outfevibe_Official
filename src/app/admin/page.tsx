"use client";
import { useState } from "react";

// Temporary protection — replace with proper auth later
if (typeof window !== "undefined" && !window.location.search.includes("key=outfevibe2026")) {
  window.location.href = "/";
}

export default function AdminPage() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const trigger = async (type: string, payload = "") => {
    setSending(true);
    const res = await fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });
    const data = await res.json();
    setResult(`Sent to ${data.sent} users`);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 space-y-4">
      <h1 className="text-2xl font-bold text-[#d4af7f]">Outfevibe Admin</h1>
      <p className="text-sm text-neutral-500">Trigger push + email notifications manually</p>

      {[
        { label: "Weekly Style Drop 🔥", type: "weekly_style_drop" },
        { label: "New Trending Outfits 👗", type: "new_trending" },
        { label: "Eid Campaign ✨", type: "festival_campaign", payload: "Eid" },
        { label: "New Feature: Virtual Wardrobe", type: "new_feature", payload: "Virtual Wardrobe" },
      ].map((item) => (
        <button
          key={item.type}
          onClick={() => trigger(item.type, item.payload)}
          disabled={sending}
          className="block w-full max-w-sm px-6 py-3 rounded-xl bg-[#111] border border-[#2a2a2a] hover:border-[#d4af7f] text-left text-sm transition disabled:opacity-50"
        >
          {item.label}
        </button>
      ))}

      {result && <p className="text-green-400 text-sm">{result}</p>}
    </div>
  );
}
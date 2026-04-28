"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Card {
  title?: string;
  image?: string;
  link?: string;
  shopLink?: string;
  price?: string;
  brand?: string;
  badge?: string;
  [key: string]: any;
}

interface Props {
  cards: Card[];
  darkMode: boolean;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

// Visible cards per viewport
function useVisibleCards() {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setVisible(4);
      else if (window.innerWidth >= 768) setVisible(2);
      else setVisible(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return visible;
}

export default function TrendingCarousel({ cards, darkMode, activeIndex, setActiveIndex }: Props) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const autoRef      = useRef<NodeJS.Timeout | null>(null);
  const pausedRef    = useRef(false);
  const dragStartX   = useRef<number | null>(null);
  const visibleCards = useVisibleCards();

  const total    = cards.length;
  const maxIndex = Math.max(0, total - visibleCards);

  // ── auto-scroll ──────────────────────────────────────────────────────────
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 2800);
  }, [maxIndex, setActiveIndex]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto, cards]);

  // ── scroll track when activeIndex changes ────────────────────────────────
  useEffect(() => {
    if (!trackRef.current) return;
    const card  = trackRef.current.children[0] as HTMLElement;
    if (!card) return;
    const gap   = 20;
    const width = card.offsetWidth + gap;
    trackRef.current.scrollTo({ left: activeIndex * width, behavior: "smooth" });
  }, [activeIndex]);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, maxIndex));
    setActiveIndex(clamped);
    startAuto();
  };

  // ── drag / swipe ─────────────────────────────────────────────────────────
  const onDragStart = (x: number) => { dragStartX.current = x; pausedRef.current = true; };
  const onDragEnd   = (x: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    dragStartX.current = null;
    setTimeout(() => { pausedRef.current = false; }, 1200);
  };

  // ── dots — one per "page" ────────────────────────────────────────────────
  const pages    = maxIndex + 1;
  const dotIndex = Math.min(activeIndex, pages - 1);

  if (!cards.length) {
    return (
      <div className={`text-center py-16 ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}>
        No outfits found for this selection.
      </div>
    );
  }

  return (
    <div className="mt-8 select-none">
      {/* ── Track ── */}
      <div
        ref={trackRef}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e)   => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e)   => onDragEnd(e.changedTouches[0].clientX)}
        style={{
          display:              "flex",
          gap:                  "20px",
          overflowX:            "hidden",
          scrollSnapType:       "x mandatory",
          WebkitOverflowScrolling: "touch",
          cursor:               "grab",
          paddingBottom:        "4px",
        }}
      >
        {cards.map((card, i) => (
          <TrendingCard key={i} card={card} darkMode={darkMode} visibleCards={visibleCards} />
        ))}
      </div>

      {/* ── Dots + arrows ── */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Prev arrow */}
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition text-sm
            ${darkMode ? "border-neutral-700 text-neutral-400 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-20" : "border-neutral-300 text-neutral-500 hover:border-yellow-500 disabled:opacity-20"}`}
        >‹</button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width:      i === dotIndex ? 24 : 8,
                height:     8,
                background: i === dotIndex
                  ? (darkMode ? "#d4af7f" : "#d4af7f")
                  : (darkMode ? "#333" : "#ddd"),
              }}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex >= maxIndex}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition text-sm
            ${darkMode ? "border-neutral-700 text-neutral-400 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-20" : "border-neutral-300 text-neutral-500 hover:border-yellow-500 disabled:opacity-20"}`}
        >›</button>
      </div>
    </div>
  );
}

// ── Individual card ──────────────────────────────────────────────────────────
function TrendingCard({ card, darkMode, visibleCards }: { card: Card; darkMode: boolean; visibleCards: number }) {
  const [liked,  setLiked]  = useState(false);
  const [hovered,setHovered] = useState(false);

  const shopUrl = card.link || card.shopLink || "#";
  const title   = card.title   || "Outfit";
  const image   = card.image   || "/outfits/party_01.jpg";
  const price   = card.price   || "";
  const brand   = card.brand   || "";
  const badge   = card.badge   || (card.categories?.includes("general_trending") ? "Trending" : "");

  // Width per card: fill viewport divided by visibleCards with gaps
  const cardWidth = `calc((100% - ${(visibleCards - 1) * 20}px) / ${visibleCards})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        minWidth:    cardWidth,
        maxWidth:    cardWidth,
        flexShrink:  0,
        scrollSnapAlign: "start",
        borderRadius: 20,
        overflow:    "hidden",
        border:      `1px solid ${hovered ? "rgba(212,175,127,0.5)" : (darkMode ? "#222" : "#e5e5e5")}`,
        background:  darkMode ? "#111" : "#fafafa",
        transition:  "border-color 0.2s",
        position:    "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={image}
          alt={title}
          draggable={false}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
        }} />

        {/* Badge */}
        {badge && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#d4af7f", color: "#000",
            fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
            letterSpacing: "0.05em",
          }}>{badge}</div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, transition: "transform 0.2s",
            transform: liked ? "scale(1.2)" : "scale(1)",
          }}
        >
          {liked ? "❤️" : "🤍"}
        </button>

        {/* Price on image bottom */}
        {price && (
          <div style={{
            position: "absolute", bottom: 10, left: 12,
            color: "#d4af7f", fontWeight: 700, fontSize: 15,
          }}>{price}</div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "12px 14px 14px" }}>
        {brand && (
          <p style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
            {brand}
          </p>
        )}
        <p style={{
          fontSize: 13, fontWeight: 600,
          color: darkMode ? "#f0f0f0" : "#111",
          lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          marginBottom: 10,
        }}>{title}</p>

        {/* Shop button */}
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "8px 0",
            background: hovered ? "#d4af7f" : "transparent",
            color: hovered ? "#000" : "#d4af7f",
            border: "1px solid #d4af7f",
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            textDecoration: "none", transition: "all 0.2s",
            letterSpacing: "0.03em",
          }}
        >
          🛍️ Shop Now
        </a>
      </div>
    </motion.div>
  );
}
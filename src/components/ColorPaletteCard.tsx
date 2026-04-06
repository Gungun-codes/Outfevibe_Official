"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Gender = "male" | "female";

interface PaletteColor {
  hex: string;
  name: string;
  desc: string;
}

interface StyleGuide {
  dos: string[];
  donts: string[];
  western: string[];
  indian: string[];
}

// ── Color palettes per skin tone ──────────────────────────────────────────────
const SKIN_PALETTES: Record<string, PaletteColor[]> = {
  Fair: [
    { hex: "#E8C5B8", name: "Nude Blush",    desc: "Your natural tone" },
    { hex: "#7EC8E3", name: "Sky Blue",       desc: "Cool contrast"     },
    { hex: "#C8A2C8", name: "Lilac",          desc: "Soft romance"      },
    { hex: "#F4A7B9", name: "Rose Pink",      desc: "Fresh flush"       },
    { hex: "#90EE90", name: "Sage Green",     desc: "Earthy calm"       },
    { hex: "#FFD700", name: "Butter Gold",    desc: "Warm glow"         },
  ],
  Light: [
    { hex: "#F5CBA7", name: "Peach",          desc: "Warm glow"         },
    { hex: "#AED6F1", name: "Cornflower",     desc: "Cool lift"         },
    { hex: "#A8D8EA", name: "Ice Blue",       desc: "Crisp contrast"    },
    { hex: "#F9E4B7", name: "Champagne",      desc: "Subtle radiance"   },
    { hex: "#D7BDE2", name: "Wisteria",       desc: "Dreamy depth"      },
    { hex: "#82E0AA", name: "Mint",           desc: "Fresh energy"      },
  ],
  Medium: [
    { hex: "#F08080", name: "Coral",          desc: "Warm flush"        },
    { hex: "#87CEEB", name: "Sky Blue",       desc: "Fresh contrast"    },
    { hex: "#98FFD5", name: "Mint",           desc: "Cool glow"         },
    { hex: "#FFB6C1", name: "Blush Pink",     desc: "Soft femininity"   },
    { hex: "#F5E6C8", name: "Champagne",      desc: "Subtle radiance"   },
    { hex: "#008080", name: "Teal",           desc: "Rich depth"        },
  ],
  Tan: [
    { hex: "#E74C3C", name: "Brick Red",      desc: "Bold contrast"     },
    { hex: "#F39C12", name: "Amber",          desc: "Sun-kissed glow"   },
    { hex: "#1ABC9C", name: "Turquoise",      desc: "Fresh pop"         },
    { hex: "#F9CA24", name: "Marigold",       desc: "Festive warmth"    },
    { hex: "#6C5CE7", name: "Royal Purple",   desc: "Regal depth"       },
    { hex: "#FDCB6E", name: "Golden Yellow",  desc: "Natural radiance"  },
  ],
  Wheatish: [
    { hex: "#C0392B", name: "Deep Red",       desc: "Power contrast"    },
    { hex: "#D4AF37", name: "Gold",           desc: "Heritage warmth"   },
    { hex: "#27AE60", name: "Forest Green",   desc: "Earthy richness"   },
    { hex: "#E67E22", name: "Burnt Orange",   desc: "Autumn glow"       },
    { hex: "#8E44AD", name: "Aubergine",      desc: "Luxe depth"        },
    { hex: "#2ECC71", name: "Emerald",        desc: "Fresh lift"        },
  ],
  Dusky: [
    { hex: "#FF6B6B", name: "Poppy",          desc: "Vivid contrast"    },
    { hex: "#FFE66D", name: "Sunflower",      desc: "Bright lift"       },
    { hex: "#4ECDC4", name: "Aqua",           desc: "Cool freshness"    },
    { hex: "#FF8B94", name: "Flamingo",       desc: "Warm pop"          },
    { hex: "#A8E6CF", name: "Pale Mint",      desc: "Light contrast"    },
    { hex: "#C3A6FF", name: "Soft Violet",    desc: "Dreamy tone"       },
  ],
  Deep: [
    { hex: "#FFFFFF", name: "Pure White",     desc: "Crisp contrast"    },
    { hex: "#FFD700", name: "Gold",           desc: "Radiant warmth"    },
    { hex: "#FF4500", name: "Vermillion",     desc: "Bold statement"    },
    { hex: "#00CED1", name: "Dark Turquoise", desc: "Vivid freshness"   },
    { hex: "#FF69B4", name: "Hot Pink",       desc: "Electric pop"      },
    { hex: "#7CFC00", name: "Lime",           desc: "Electric lift"     },
  ],
  Dark: [
    { hex: "#FFFACD", name: "Lemon Chiffon",  desc: "Bright pop"        },
    { hex: "#FF6347", name: "Tomato",         desc: "Vivid warmth"      },
    { hex: "#00FA9A", name: "Spring Green",   desc: "Bold lift"         },
    { hex: "#FF1493", name: "Deep Pink",      desc: "Electric glow"     },
    { hex: "#FFD700", name: "Gold",           desc: "Luminous warmth"   },
    { hex: "#00BFFF", name: "Deep Sky Blue",  desc: "Cool contrast"     },
  ],
};

// ── Style tips per body shape — MIXED Indian + Western ───────────────────────
const BODY_STYLE_GUIDES: Record<string, Record<Gender, StyleGuide>> = {
  Hourglass: {
    female: {
      dos: [
        "Wrap dresses and belted silhouettes that trace your waist",
        "Fitted kurtas with churidar or straight-cut pants",
        "Body-con co-ords, mermaid cuts, and tucked-in blouses",
      ],
      donts: [
        "Boxy, shapeless tops that hide your natural waist",
        "Heavily embellished dupattas that add bulk at the hips",
      ],
      western: ["Wrap midi dress", "Belted blazer + straight jeans", "Bodycon co-ord set", "Crop top + high-waist trousers"],
      indian:  ["Anarkali suit", "Saree with fitted blouse", "Sharara set", "Embroidered fitted kurta + churidar"],
    },
    male: {
      dos: [
        "Fitted shirts and tapered trousers that follow your frame",
        "Structured sherwanis that define the shoulder-to-waist line",
      ],
      donts: [
        "Oversized kurtas that mask your proportions",
        "Drop-crotch or extremely baggy bottoms",
      ],
      western: ["Fitted Oxford shirt + chinos", "Structured blazer", "Slim-fit suit", "Tapered joggers + polo"],
      indian:  ["Fitted bandhgala", "Slim sherwani", "Tailored kurta + churidar", "Modi jacket + kurta"],
    },
  },

  Rectangle: {
    female: {
      dos: [
        "Ruffles, peplums, and tiered skirts to create curves",
        "Lehengas with flared skirts and embellished blouses",
        "Belted outfits, wrap tops, and colour-blocked looks",
      ],
      donts: [
        "Straight-cut kurtas with no shaping or cinching",
        "Boxy, flat-front trousers worn without a statement belt",
      ],
      western: ["Peplum top + flared skirt", "Colour-block dress", "Ruffled blouse + wide-leg pants", "Wrap dress"],
      indian:  ["Lehenga choli", "Peplum kurta + palazzo", "Anarkali with flared hem", "Embellished A-line kurta"],
    },
    male: {
      dos: [
        "Layered outfits — jackets and waistcoats add dimension",
        "Structured nehru jackets over kurtas for definition",
      ],
      donts: [
        "Plain, single-layer outfits with no visual interest",
        "Baggy fits that make the frame look even more linear",
      ],
      western: ["Layered jacket + tee + chinos", "Bomber over fitted shirt", "Structured blazer", "Waistcoat + shirt"],
      indian:  ["Nehru jacket + kurta + churidar", "Indo-western jacket set", "Layered sherwani", "Embroidered kurta + dhoti"],
    },
  },

  Pear: {
    female: {
      dos: [
        "Bold tops, off-shoulder styles, and embellished blouses",
        "A-line lehengas, flared skirts, and palazzo pants",
        "Boat-neck and statement-shoulder tops to draw the eye up",
      ],
      donts: [
        "Tight pencil skirts or anything that clings to the hips",
        "Heavily embellished bottoms — they amplify width",
      ],
      western: ["Off-shoulder top + palazzo", "A-line midi skirt", "Ruffled shoulder blouse + straight jeans", "Wrap top + flared pants"],
      indian:  ["Anarkali suit", "Embellished blouse + A-line lehenga", "Flared skirt + boat-neck kurti", "Sharara with detailed dupatta at shoulder"],
    },
    male: {
      dos: [
        "Bold upper-body prints and structured shoulders",
        "Kurtas with embroidery on the chest and shoulders",
      ],
      donts: [
        "Tight bottoms that emphasise wider hips",
        "Plain tops with loud printed trousers",
      ],
      western: ["Graphic tee + straight-fit pants", "Structured jacket + plain chinos", "Bold stripe shirt + dark jeans"],
      indian:  ["Embroidered chest kurta + straight pyjama", "Nehru jacket + plain kurta", "Printed kurta + solid dhoti-pants"],
    },
  },

  Apple: {
    female: {
      dos: [
        "Empire-waist dresses and A-line silhouettes",
        "Long flowy kaftans, anarkalis, and drape sarees",
        "V-necks and deep scoop necks to elongate the torso",
      ],
      donts: [
        "Tight-fitting tops that define the midsection",
        "Cropped tops or high-waisted styles that cut at the widest point",
      ],
      western: ["Empire-waist maxi", "Flowy tunic + wide-leg pants", "Wrap dress", "V-neck blouse + straight trousers"],
      indian:  ["Anarkali suit", "Long kaftan kurta", "Drape saree (Nivi style)", "Floor-length churidar + tunic"],
    },
    male: {
      dos: [
        "Vertical-stripe shirts and monochrome outfits to elongate",
        "Long kurtas that skim the waist without clinging",
      ],
      donts: [
        "Horizontal stripes or bulky fabrics across the torso",
        "Cropped jackets that end at the widest point",
      ],
      western: ["Monochrome shirt + trousers", "Vertical-stripe Oxford + chinos", "Long cardigan over tee", "Slim blazer"],
      indian:  ["Long straight-cut kurta + churidar", "Bandi jacket over solid kurta", "Printed long kurta + pajama"],
    },
  },

  "Inverted Triangle": {
    female: {
      dos: [
        "Full skirts, wide-leg pants, and ruffled hemlines",
        "Lehengas with heavy embellishment on the skirt",
        "Simple tops that don't add shoulder width",
      ],
      donts: [
        "Off-shoulder or puffed-sleeve tops that widen the shoulder",
        "Strapless and halter necks that emphasise the upper body",
      ],
      western: ["Simple tee + flared maxi skirt", "Scoop-neck top + wide-leg palazzo", "A-line skirt co-ord", "Plain blouse + ruffled midi"],
      indian:  ["Plain blouse + heavy lehenga skirt", "Simple top + gharara", "Minimal kurta + flared palazzo", "Embellished bottom anarkali"],
    },
    male: {
      dos: [
        "Straight or relaxed-fit trousers to balance the upper body",
        "Minimal-shoulder kurtas and simple shirts",
      ],
      donts: [
        "Padded or structured blazers that add shoulder bulk",
        "Tapered trousers that make the top look even heavier",
      ],
      western: ["Plain tee + relaxed chinos", "Simple shirt + straight-cut pants", "Minimal hoodie + wide-leg trousers"],
      indian:  ["Simple kurta + straight pyjama", "Long plain kurta + wide dhoti", "Minimal bandhgala + straight pants"],
    },
  },
};

// ── Fallback guide ────────────────────────────────────────────────────────────
const DEFAULT_GUIDE: StyleGuide = {
  dos:     ["Well-fitted silhouettes that suit your proportions", "Mix of Indian and western staples"],
  donts:   ["Ill-fitting or overly baggy clothes", "Clashing prints without a colour anchor"],
  western: ["Straight-fit jeans + tucked shirt", "Midi dress", "Co-ord set", "Tailored blazer"],
  indian:  ["Straight-cut kurta + churidar", "Saree / lehenga", "Anarkali suit", "Nehru jacket set"],
};

// ── Tab pill ──────────────────────────────────────────────────────────────────
function TabPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 relative"
      style={{
        background: active ? "linear-gradient(135deg,#d4af7f,#b8860b)" : "#1a1a1a",
        color:      active ? "#000" : "#888",
        border:     active ? "1px solid transparent" : "1px solid #2a2a2a",
      }}
    >
      {label}
    </button>
  );
}

// ── Outfit chip ───────────────────────────────────────────────────────────────
function OutfitChip({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 320, damping: 24 }}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 hover:border-[#d4af7f]/60 cursor-default"
      style={{ background: "#111111", borderColor: "#2a2a2a", color: "#c9b896" }}
    >
      {label}
    </motion.span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface ColorPaletteCardProps {
  bodyShape: string;
  skinTone:  string;
  gender:    Gender;
  onContinue: () => void;
}

export function ColorPaletteCard({ bodyShape, skinTone, gender, onContinue }: ColorPaletteCardProps) {
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [outfitTab,     setOutfitTab]     = useState<"western" | "indian">("western");
  const [clicked,       setClicked]       = useState(false);

  const palette = SKIN_PALETTES[skinTone] ?? SKIN_PALETTES["Medium"];
  const guide   = BODY_STYLE_GUIDES[bodyShape]?.[gender] ?? DEFAULT_GUIDE;

  const handleContinue = () => {
    if (clicked) return;
    setClicked(true);
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="space-y-4 w-full"
    >

      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" style={{ color: "#d4af7f" }} />
        <p className="text-sm font-bold text-white">Your Style Profile</p>
      </div>

      {/* ── Colour palette ── */}
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 p-4">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">
          Flattering colours for {skinTone} skin
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {palette.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => setSelectedColor(i === selectedColor ? null : i)}
              className="rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none"
              style={{
                borderColor: selectedColor === i ? "#d4af7f" : "transparent",
                transform:   selectedColor === i ? "scale(1.04)" : "scale(1)",
              }}
            >
              {/* Swatch */}
              <div style={{ background: c.hex, height: "52px" }} />
              {/* Label */}
              <div className="bg-[#161616] px-2 py-1.5 text-left">
                <p className="text-[11px] font-bold text-neutral-200 leading-tight">{c.name}</p>
                <p className="text-[9px] text-neutral-500 leading-tight">{c.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Style tips ── */}
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 p-4 space-y-3">
        <p className="text-[10px] font-bold text-[#d4af7f] uppercase tracking-widest">
          Style tips for {bodyShape}
        </p>

        {/* Do's */}
        <div className="space-y-1.5">
          {guide.dos.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-2.5"
            >
              <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(74,222,128,0.12)" }}>
                <svg width="9" height="9" viewBox="0 0 9 9">
                  <polyline points="1.5,4.5 3.5,6.5 7.5,2" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>

        {/* Don'ts */}
        <div className="space-y-1.5 pt-1 border-t border-neutral-800/70">
          {guide.donts.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="flex items-start gap-2.5"
            >
              <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(248,113,113,0.12)" }}>
                <svg width="9" height="9" viewBox="0 0 9 9">
                  <line x1="2" y1="2" x2="7" y2="7" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="7" y1="2" x2="2" y2="7" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Recommended outfits — TABBED Indian + Western ── */}
      <div className="bg-[#111111] rounded-2xl border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            Recommended outfits
          </p>
          <div className="flex gap-1.5">
            <TabPill label="Western"  active={outfitTab === "western"} onClick={() => setOutfitTab("western")} />
            <TabPill label="Indian"   active={outfitTab === "indian"}  onClick={() => setOutfitTab("indian")}  />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={outfitTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex flex-wrap gap-2"
          >
            {guide[outfitTab].map((outfit, i) => (
              <OutfitChip key={outfit} label={outfit} delay={i * 0.055} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA ── */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        onClick={handleContinue}
        disabled={clicked}
        className="w-full py-3.5 rounded-full font-bold text-sm text-black relative overflow-hidden transition-opacity disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">Find My Outfits →</span>
        {/* shimmer */}
        <motion.span
          className="absolute inset-y-0 w-1/3 skew-x-[-15deg]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)" }}
          animate={{ left: ["-40%", "130%"] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2, ease: "linear" }}
        />
      </motion.button>

    </motion.div>
  );
}
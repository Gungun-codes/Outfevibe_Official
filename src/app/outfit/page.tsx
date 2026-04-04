"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { BudgetSlider } from "@/components/BudgetSlider";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { OutfitResultCard } from "@/components/OutfitResultCard";
import { OutfitResultCard2 } from "@/components/OutfitResultCard2";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { ColorPaletteCard } from "@/components/ColorPaletteCard";
import { useAnalysisLimit } from "@/app/hooks/useAnalysisLimit";
import { OutfitResult, OCCASIONS } from "@/lib/type";

// ── Occasion vibes map ────────────────────────────────────────────────────────
const OCCASION_VIBES: Record<string, { Female: string[]; Male: string[] }> = {
  College:  { Female: ["Casual Cool","Street Style","Minimal","Boho"],       Male: ["Street Style","Casual Cool","Minimal","Sporty"] },
  Work:     { Female: ["Power Dressing","Smart Casual","Minimal","Classic"],  Male: ["Business Formal","Smart Casual","Classic","Minimal"] },
  Date:     { Female: ["Romantic","Chic","Minimal","Trendy"],                 Male: ["Smart Casual","Classic","Minimal","Trendy"] },
  Party:    { Female: ["Glam","Edgy","Bold","Chic"],                          Male: ["Edgy","Bold","Smart Casual","Trendy"] },
  Wedding:  { Female: ["Glam","Traditional","Ethnic Chic","Regal"],           Male: ["Traditional","Regal","Festive Formal","Ethnic Smart"] },
  Festive:  { Female: ["Traditional","Ethnic Chic","Glam","Minimal"],         Male: ["Traditional","Ethnic Smart","Classic","Bold"] },
};

function getVibes(occasion: string, gender: string): string[] {
  const map = OCCASION_VIBES[occasion];
  if (!map) return ["Classic","Minimal","Trendy","Bold"];
  return map[gender as "Female" | "Male"] ?? map.Female;
}

function toGenderProp(g: string): "male" | "female" {
  return g.toLowerCase() === "male" ? "male" : "female";
}

// ── SimpleOutfit type (outfits.json) ──────────────────────────────────────────
interface SimpleOutfit {
  id: number;
  title: string;
  gender: string;
  occasions: string[];
  mood: string[];
  budget: string;
  persona: string[];
  body_shapes: string[];
  skin_tones: string[];
  image: string;
  affiliateLink: string;
  categories?: string[];
  priority?: number;
}

// ── Filtering helpers ─────────────────────────────────────────────────────────
function scoreOutfit(o: SimpleOutfit, bs: string, st: string) {
  let s = 0;
  if (bs && o.body_shapes?.some((b) => b.toLowerCase() === bs.toLowerCase())) s += 3;
  if (st && o.skin_tones?.some((x) => x.toLowerCase() === st.toLowerCase()))  s += 2;
  s += (o.priority === 1 ? 2 : o.priority === 2 ? 1 : 0);
  return s;
}

function filterQuick(all: SimpleOutfit[], gender: string, bs: string, st: string): SimpleOutfit[] {
  const g = gender.toLowerCase();
  const scored = all
    .filter((o) => o.gender === g)
    .map((o) => ({ ...o, _s: scoreOutfit(o, bs, st) }))
    .sort((a, b) => b._s - a._s);
  const top6 = scored.slice(0, 6).sort(() => Math.random() - 0.5);
  return top6.slice(0, 2);
}

function filterRefined(
  all: SimpleOutfit[], gender: string, occasion: string,
  bs: string, st: string, budgetLabel: string
): SimpleOutfit[] {
  const g   = gender.toLowerCase();
  const occ = occasion.toLowerCase();
  const scored = all
    .filter((o) =>
      o.gender === g &&
      o.occasions?.some((x) => x.toLowerCase() === occ) &&
      (!budgetLabel || o.budget === budgetLabel)
    )
    .map((o) => ({ ...o, _s: scoreOutfit(o, bs, st) }))
    .sort((a, b) => b._s - a._s);
  const top8 = scored.slice(0, 8).sort(() => Math.random() - 0.5);
  return top8.slice(0, 2);
}

// ── Message type ──────────────────────────────────────────────────────────────
interface Msg {
  id:        string;
  role:      "bot" | "user";
  content:   React.ReactNode;
  answered?: boolean;
}

let _n = 0;
const uid = () => `m${++_n}_${Date.now()}`;
let _booted = false;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const [msgs,          setMsgs]         = useState<Msg[]>([]);
  const [typing,        setTyping]        = useState(false);
  const [analysing,     setAnalysing]     = useState(false);
  const [analyseImgUrl, setAnalyseImgUrl] = useState("");
  const [allOutfits,    setAllOutfits]    = useState<SimpleOutfit[]>([]);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const camRef      = useRef<HTMLInputElement>(null);
  const genderRef   = useRef("");
  const occasionRef = useRef("");
  const analysisRef = useRef<{ body_shape: string; skin_tone: string } | null>(null);
  const outfitsRef  = useRef<SimpleOutfit[]>([]);

  const pushBotRef  = useRef<((c: React.ReactNode, d?: number) => Promise<string>) | null>(null);
  const pushUserRef = useRef<((c: React.ReactNode) => void) | null>(null);

  const auth = useAuth();
  const user = auth?.user ?? null;
  const { checkLimit, incrementUsage } = useAnalysisLimit(user?.id);

  // Keep outfitsRef in sync so callbacks always see latest data
  useEffect(() => { outfitsRef.current = allOutfits; }, [allOutfits]);

  // Load outfits.json
  useEffect(() => {
    fetch("/outfits.json")
      .then((r) => r.json())
      .then((d: SimpleOutfit[]) => setAllOutfits(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [msgs, typing, analysing]);

  const markAnswered = useCallback((id: string) =>
    setMsgs((p) => p.map((m) => m.id === id ? { ...m, answered: true } : m)), []);

  const pushUser = useCallback(
    (content: React.ReactNode) =>
      setMsgs((p) => [...p, { id: uid(), role: "user", content }]), []);

  const pushBot = useCallback(
    (content: React.ReactNode, delay = 700): Promise<string> =>
      new Promise((res) => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          const id = uid();
          setMsgs((p) => [...p, { id, role: "bot", content }]);
          res(id);
        }, delay);
      }), []);

  useEffect(() => { pushBotRef.current  = pushBot;  }, [pushBot]);
  useEffect(() => { pushUserRef.current = pushUser; }, [pushUser]);

  // ── Quick outfit flow (after color tips, no occasion asked) ───────────────
  const showQuickOutfits = useCallback((
    pb: typeof pushBot, pu: typeof pushUser,
    gender: string, bs: string, st: string,
  ) => {
    const run = async () => {
      const quick = filterQuick(outfitsRef.current, gender, bs, st);
      await pb(
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-sm font-semibold text-white mb-1">Quick picks for you! 🛍️</p>
          <p className="text-xs text-neutral-500 mb-3">Based on your body shape &amp; skin tone</p>
          <OutfitResultCard2
            outfits={quick}
            bodyShape={bs}
            skinTone={st}
            onGetRefined={() => runOccasionFlow(pb, pu, gender, bs, st)}
          />
        </motion.div>,
        600
      );
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Occasion → vibe → budget → refined outfits ────────────────────────────
  const runOccasionFlow = useCallback((
    pb: typeof pushBot, pu: typeof pushUser,
    gender: string, bs: string, st: string,
  ) => {
    const run = async () => {
      const occId = await pb(
        <div>
          <p className="mb-3 font-semibold">What&apos;s the occasion? 🎉</p>
          <ChipSelector options={OCCASIONS} onSelect={async (occ) => {
            markAnswered(occId);
            pu(occ);
            occasionRef.current = occ;

            const vibeId = await pb(
              <div>
                <p className="mb-3 font-semibold">What&apos;s your vibe? ✨</p>
                <ChipSelector options={getVibes(occ, gender)} onSelect={async (vibe) => {
                  markAnswered(vibeId);
                  pu(vibe);

                  const budId = await pb(
                    <div>
                      <p className="mb-3 font-semibold">What&apos;s your budget? 💰</p>
                      <BudgetSlider occasion={occ} onConfirm={async (budgetRange) => {
                        markAnswered(budId);
                        pu(`Up to ₹${budgetRange.max.toLocaleString("en-IN")}`);

                        // Loading spinner
                        const loadId = uid();
                        setMsgs((p) => [...p, {
                          id: loadId, role: "bot",
                          content: (
                            <div className="bg-[#111111] rounded-2xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
                              <div className="w-8 h-8 rounded-full animate-spin"
                                style={{ border: "3px solid #d4af7f", borderTopColor: "transparent" }} />
                              <p className="text-sm font-semibold text-[#d4af7f]">Finding {occ} outfits...</p>
                              <div className="flex gap-1">
                                {[0,1,2].map((i) => (
                                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                              </div>
                            </div>
                          ),
                        }]);

                        await new Promise((r) => setTimeout(r, 900));
                        const refined = filterRefined(outfitsRef.current, gender, occ, bs, st, budgetRange.label);

                        setMsgs((p) => p.map((m) =>
                          m.id === loadId
                            ? { ...m, content: <OutfitResultCard2 outfits={refined} occasion={occ} bodyShape={bs} skinTone={st} /> }
                            : m
                        ));

                        // Try item-level API too (optional)
                        try {
                          const res = await fetch("/api/outfits", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ gender, occasion: occ, vibe, body_shape: bs, skin_tone: st, budget: budgetRange.label }),
                          });
                          if (res.ok) {
                            const data: OutfitResult & { success: boolean } = await res.json();
                            if (data.success) {
                              await pb(
                                <div>
                                  <p className="text-xs text-neutral-500 mb-2">🔍 Item-level breakdown:</p>
                                  <OutfitResultCard result={data} platform="Curated" />
                                </div>,
                                400
                              );
                            }
                          }
                        } catch { /* API optional */ }

                        await pb(
                          <EndCard
                            onStartOver={handleStartOver}
                            onTryAnother={async () => {
                              const { allowed, used, limit } = await checkLimit();
                              if (!allowed) { await pb(<LimitCard used={used} limit={limit} user={user} />, 300); return; }
                              runOccasionFlow(pb, pu, gender, bs, st);
                            }}
                            bodyShape={bs}
                            skinTone={st}
                          />,
                          700
                        );
                      }} />
                    </div>,
                    600
                  );
                }} />
              </div>,
              600
            );
          }} />
        </div>,
        500
      );
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markAnswered]);

  // ── Boot ──────────────────────────────────────────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("users_profile")
          .select("body_shape, skin_tone, gender")
          .eq("id", user.id)
          .single();

        const name = user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || "there";
        const firstName = name.split(" ")[0];

        if (profile?.body_shape && profile?.skin_tone) {
          analysisRef.current = { body_shape: profile.body_shape, skin_tone: profile.skin_tone };

          await pb(
            <div>
              <p className="font-bold text-white mb-1 text-base">Welcome back, {firstName}! 👋</p>
              <p className="text-neutral-400 text-sm">We remember your style profile.</p>
              <div className="flex items-center gap-2 mt-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2 w-fit">
                <span className="text-[#d4af7f] text-xs font-bold">{profile.body_shape}</span>
                <span className="text-neutral-700">·</span>
                <span className="text-[#d4af7f] text-xs font-bold">{profile.skin_tone} skin</span>
              </div>
            </div>, 800
          );

          await pb(
            <ReturningUserPrompt
              bodyShape={profile.body_shape}
              skinTone={profile.skin_tone}
              onUseProfile={() => {
                pu("Use my saved profile ✓");
                (async () => {
                  const gId = await pb(
                    <div>
                      <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                      <ChipSelector options={["Female","Male"]} onSelect={(g) => {
                        markAnswered(gId);
                        pu(g);
                        genderRef.current = g;
                        runOccasionFlow(pb, pu, g, profile.body_shape, profile.skin_tone);
                      }} />
                    </div>, 400
                  );
                })();
              }}
              onStyleSomeoneElse={async () => {
                pu("Style someone else");
                analysisRef.current = null;
                await pb("Sure! Let's start fresh 📸", 400);
                const gId = await pb(
                  <div>
                    <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                    <ChipSelector options={["Female","Male"]} onSelect={async (g) => {
                      markAnswered(gId);
                      pu(g);
                      genderRef.current = g;
                      await pb(
                        <UploadPromptMsg
                          onCamera={() => camRef.current?.click()}
                          onUpload={() => fileRef.current?.click()}
                          onSkip={async () => {
                            pu("Skip photo");
                            await pb("No worries! 😊", 400);
                            runOccasionFlow(pb, pu, g, "", "");
                          }}
                        />, 600
                      );
                    }} />
                  </div>, 600
                );
              }}
            />, 600
          );
          return;
        }
      } catch { /* fall through */ }
    }

    await pb(
      <div>
        <p className="font-bold text-white mb-1 text-base">Hey! I&apos;m your AI Stylist 👋</p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you.
          I can analyse your body type &amp; skin tone for better recommendations.
        </p>
        <p className="text-[#d4af7f] text-xs mt-2 font-medium">Let&apos;s get started!</p>
      </div>, 900
    );

    const gId = await pb(
      <div>
        <p className="font-semibold text-white mb-3">First — who are we styling today? 👗</p>
        <ChipSelector options={["Female","Male"]} onSelect={async (gender) => {
          markAnswered(gId);
          pu(gender);
          genderRef.current = gender;
          await pb(
            <UploadPromptMsg
              onCamera={() => camRef.current?.click()}
              onUpload={() => fileRef.current?.click()}
              onSkip={async () => {
                pu("Skip photo");
                await pb("No worries! I'll still find amazing outfits for you 😊", 500);
                runOccasionFlow(pb, pu, gender, "", "");
              }}
            />, 800
          );
        }} />
      </div>, 1000
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, markAnswered, runOccasionFlow]);

  // ── Start over ────────────────────────────────────────────────────────────
  const handleStartOver = useCallback(async () => {
    const { allowed, used, limit } = await checkLimit();
    if (!allowed) { await pushBot(<LimitCard used={used} limit={limit} user={user} />, 300); return; }
    _n = 0;
    genderRef.current   = "";
    occasionRef.current = "";
    analysisRef.current = null;
    setAnalysing(false);
    setMsgs([]);
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser, checkLimit, user]);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      pu(<img src={url} alt="you" className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-[#d4af7f]/40" />);
      const { allowed, used, limit } = await checkLimit();
      if (!allowed) { await pb(<LimitCard used={used} limit={limit} user={user} />, 400); return; }
      if (!user) {
        await pb(
          <div className="space-y-3">
            <p className="font-semibold text-white">Great photo! 📸</p>
            <p className="text-sm text-neutral-400 leading-relaxed">Sign in to save your style analysis.</p>
            <div className="flex gap-2 flex-wrap">
              <a href="/login" className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-black"
                style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In</a>
              <a href="/signup" className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
                Create Account</a>
            </div>
            <button onClick={() => { setAnalyseImgUrl(url); setAnalysing(true); }}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline block">
              ▷ Continue without account
            </button>
          </div>, 600
        );
        return;
      }
      setAnalyseImgUrl(url);
      setAnalysing(true);
    };
    reader.readAsDataURL(file);
  }, [checkLimit, user]);

  // ── Analysis done ─────────────────────────────────────────────────────────
  const onAnalysisDone = useCallback(async (result: { body_shape: string; skin_tone: string; person_detected: boolean }) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    const shape = result.body_shape;
    const tone  = result.skin_tone;
    const gender = genderRef.current || "Female";
    const genderProp = toGenderProp(gender);
    analysisRef.current = { body_shape: shape, skin_tone: tone };

    const editId = await pb(
      <div>
        <p className="mb-1 text-sm font-medium">Here&apos;s what I found! ✨</p>
        <p className="text-xs text-neutral-500 mb-3">If anything looks off, correct it below.</p>
        <AnalysisEditor bodyShape={shape} skinTone={tone} onConfirm={async (s, t) => {
          markAnswered(editId);
          analysisRef.current = { body_shape: s, skin_tone: t };
          pu(`${s} · ${t} skin ✓`);
          await incrementUsage();

          const palId = await pb(
            <ColorPaletteCard
              bodyShape={s}
              skinTone={t}
              gender={genderProp}
              onContinue={async () => {
                markAnswered(palId);
                // ── Show quick outfits from outfits.json right after color tips ──
                showQuickOutfits(pb, pu, gender, s, t);
              }}
            />, 500
          );
        }} />
      </div>, 600
    );
  }, [incrementUsage, markAnswered, showQuickOutfits]);

  // ── Analysis error ────────────────────────────────────────────────────────
  const onAnalysisError = useCallback(async (message: string) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;
    await pb(
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4">
        <p className="text-sm font-bold text-red-400 mb-1">📷 Oops!</p>
        <p className="text-sm text-red-300/80 leading-relaxed">{message}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#111111] border border-red-800/50 text-red-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-950/30 transition">
            📁 Try another photo
          </button>
          <button onClick={async () => {
            pu("I'll skip the photo");
            await pb("No worries! 😊", 400);
            runOccasionFlow(pb, pu, genderRef.current, "", "");
          }} className="flex items-center gap-1.5 bg-[#111111] border border-neutral-800 text-neutral-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1a1a1a] transition">
            ▷ Skip and continue
          </button>
        </div>
      </div>, 400
    );
  }, [runOccasionFlow]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto relative" style={{ minHeight: "100dvh", background: "#0a0a0a" }}>
      <header className="flex items-center justify-center px-4 py-4 bg-[#0a0a0a] z-10 border-b border-neutral-800 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Steal the{" "}
          <span className="italic" style={{
            background: "linear-gradient(135deg,#d4af7f,#b8860b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Look</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: "none", background: "#0a0a0a", minHeight: "0" }}>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <ChatBubble role={m.role} answered={m.answered}>{m.content}</ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      <AnimatePresence>
        {analysing && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
              <AnalysisScreen imageUrl={analyseImgUrl} onDone={onAnalysisDone} onError={onAnalysisError} durationMs={6000} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LimitCard({ used, limit, user }: { used: number; limit: number; user: any }) {
  return (
    <div className="rounded-2xl border border-[#d4af7f]/20 bg-[#1a1400] p-4 space-y-3">
      <p className="text-sm font-bold text-[#d4af7f]">⚡ Daily limit reached</p>
      <p className="text-sm text-neutral-400 leading-relaxed">
        You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> analyses today.
        {!user ? " Sign in to get more." : " Come back tomorrow! 🌅"}
      </p>
      {!user && (
        <div className="flex gap-2 flex-wrap">
          <a href="/login" className="px-4 py-2 rounded-full text-sm font-bold text-black" style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In for More</a>
          <a href="/signup" className="px-4 py-2 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">Create Account</a>
        </div>
      )}
    </div>
  );
}

function EndCard({ onStartOver, onTryAnother, bodyShape, skinTone }: {
  onStartOver: () => void; onTryAnother: () => void; bodyShape: string; skinTone: string;
}) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    const profile = [bodyShape && `${bodyShape} body shape`, skinTone && `${skinTone} skin tone`].filter(Boolean).join(" & ");
    const text = `✨ ${profile} — check yours!\n\nI used Outfevibe's AI Stylist 🛍️\n\noutfevibe.com/outfit`;
    try {
      if (navigator.share) await navigator.share({ title: "My Outfevibe Style", text, url: "https://www.outfevibe.com/outfit" });
      else { await navigator.clipboard.writeText(text); alert("Copied! 📋"); }
    } catch {}
    setSharing(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-neutral-200 font-semibold text-sm">Hope you love this look! 🛍️</p>
      <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-4">
        {!feedbackSent ? (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Rate this recommendation</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
                  onClick={() => { setRating(star); setFeedbackSent(true); }}
                  className="text-2xl transition-transform hover:scale-125">
                  <span style={{ color: star <= (hovered || rating) ? "#d4af7f" : "#2a2a2a" }}>★</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[#d4af7f]">{"★".repeat(rating)}{"☆".repeat(5-rating)}</span>
            <p className="text-xs text-neutral-400 ml-1">Thanks! 🙏</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onTryAnother}
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-black"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
          <RotateCcw className="w-4 h-4" /> Try Another Style
        </button>
        <button onClick={handleShare} disabled={sharing}
          className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
          📤 {sharing ? "Sharing..." : "Share My Style"}
        </button>
        <a href="/#feedback"
          className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
          💬 Give Feedback
        </a>
        <button onClick={onStartOver}
          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors w-full mt-1">
          <RotateCcw className="w-3 h-3" /> Start completely over
        </button>
      </div>
    </div>
  );
}

function ReturningUserPrompt({ bodyShape, skinTone, onUseProfile, onStyleSomeoneElse }: {
  bodyShape: string; skinTone: string; onUseProfile: () => void; onStyleSomeoneElse: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-300">What would you like to do?</p>
      <div className="flex flex-col gap-2">
        <button onClick={() => { setChosen("profile"); onUseProfile(); }} disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-black text-left"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", opacity: chosen && chosen !== "profile" ? 0.4 : 1 }}>
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-black">Use my saved profile</p>
            <p className="text-[11px] font-normal opacity-70">{bodyShape} · {skinTone} skin</p>
          </div>
        </button>
        <button onClick={() => { setChosen("else"); onStyleSomeoneElse(); }} disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-neutral-300 text-left hover:bg-[#222]"
          style={{ opacity: chosen && chosen !== "else" ? 0.4 : 1 }}>
          <span className="text-lg">👥</span>
          <div>
            <p>Style someone else</p>
            <p className="text-[11px] font-normal text-neutral-600">Upload a new photo</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function UploadPromptMsg({ onCamera, onUpload, onSkip }: { onCamera: () => void; onUpload: () => void; onSkip: () => void }) {
  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-neutral-200">
        Want to share a photo? I&apos;ll analyse your body shape &amp; skin tone 📸
      </p>
      <div className="mb-3 rounded-xl bg-[#1a1500] border border-[#d4af7f]/20 px-3 py-2.5 flex gap-2 items-start">
        <span className="text-sm mt-0.5">💡</span>
        <p className="text-xs text-neutral-400 leading-relaxed">
          For best results, upload a <span className="text-[#d4af7f] font-semibold">full-body photo</span> with a{" "}
          <span className="text-[#d4af7f] font-semibold">plain background</span>.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={onCamera}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
          <Camera className="w-4 h-4 text-pink-500" /> Take Photo
        </button>
        <button onClick={onUpload}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all">
          <Upload className="w-4 h-4 text-purple-500" /> Upload
        </button>
      </div>
      <button onClick={onSkip}
        className="mt-3 flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline">
        ▷ Skip for now
      </button>
    </div>
  );
}
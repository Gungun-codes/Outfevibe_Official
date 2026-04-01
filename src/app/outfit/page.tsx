"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { OutfitResultCard } from "@/components/OutfitResultCard";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";

import { ColorPaletteCard } from "@/components/ColorPaletteCard";
import { useAnalysisLimit } from "@/app/hooks/useAnalysisLimit";
import { OutfitResult, OCCASIONS, PLATFORMS } from "@/lib/type";

// ── Occasion-aware Vibes ──────────────────────────────────────────────────────
const OCCASION_VIBES: Record<string, { Female: string[]; Male: string[] }> = {
  College: {
    Female: ["Casual Cool", "Preppy", "Street Style", "Boho", "Minimal", "Trendy"],
    Male:   ["Street Style", "Casual Cool", "Minimal", "Preppy", "Sporty", "Trendy"],
  },
  Party: {
    Female: ["Glam", "Edgy", "Trendy", "Bold", "Romantic", "Chic"],
    Male:   ["Edgy", "Bold", "Smart Casual", "Trendy", "Minimal", "Classic"],
  },
  Date: {
    Female: ["Romantic", "Chic", "Minimal", "Boho", "Trendy", "Soft Glam"],
    Male:   ["Smart Casual", "Classic", "Minimal", "Trendy", "Romantic", "Edgy"],
  },
  Festive: {
    Female: ["Traditional", "Ethnic Chic", "Boho", "Glam", "Bold", "Minimal"],
    Male:   ["Traditional", "Ethnic Smart", "Classic", "Bold", "Festive Formal", "Minimal"],
  },
  Wedding: {
    Female: ["Glam", "Traditional", "Ethnic Chic", "Romantic", "Bold", "Regal"],
    Male:   ["Traditional", "Regal", "Festive Formal", "Classic", "Ethnic Smart", "Bold"],
  },
  Work: {
    Female: ["Power Dressing", "Smart Casual", "Minimal", "Classic", "Chic", "Business Formal"],
    Male:   ["Business Formal", "Smart Casual", "Classic", "Minimal", "Power Dressing", "Corporate Chic"],
  },
};

const DEFAULT_VIBES = {
  Female: ["Classic", "Boho", "Trendy", "Minimal", "Edgy", "Romantic", "Street Style", "Smart Casual"],
  Male:   ["Classic", "Street Style", "Minimal", "Trendy", "Edgy", "Smart Casual"],
};

function getVibesForOccasion(occasion: string, gender: string): string[] {
  const map = OCCASION_VIBES[occasion];
  if (!map) return DEFAULT_VIBES[gender as "Female" | "Male"] ?? DEFAULT_VIBES.Female;
  return map[gender as "Female" | "Male"] ?? map.Female;
}
function toGenderProp(g: string): "male" | "female" {
  return g.toLowerCase() === "male" ? "male" : "female";
}

// ── Message type ──────────────────────────────────────────────────────────────
interface Msg {
  id:        string;
  role:      "bot" | "user";
  content:   React.ReactNode;
  /**
   * answered = true  → chips inside this bubble hide, replaced by a badge.
   *                    The question text and any non-chip content stays visible.
   * answered = false → everything shows normally.
   *
   * IMPORTANT: Never set answered=true on analysis, palette, upload-prompt,
   * or result messages — only on plain chip-question bubbles.
   */
  answered?: boolean;
}

let _n = 0;
const uid = () => `m${++_n}_${Date.now()}`;
let _booted = false;

export default function Page() {
  const [msgs,          setMsgs]         = useState<Msg[]>([]);
  const [typing,        setTyping]        = useState(false);
  const [analysing,     setAnalysing]     = useState(false);
  const [analyseImgUrl, setAnalyseImgUrl] = useState("");

  const bottomRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const camRef      = useRef<HTMLInputElement>(null);
  const genderRef   = useRef("");
  const occasionRef = useRef("");
  const analysisRef = useRef<{ body_shape: string; skin_tone: string } | null>(null);

  const pushBotRef  = useRef<((content: React.ReactNode, delay?: number) => Promise<string>) | null>(null);
  const pushUserRef = useRef<((content: React.ReactNode) => void) | null>(null);

  const auth = useAuth();
  const user = auth?.user ?? null;
  const { checkLimit, incrementUsage } = useAnalysisLimit(user?.id);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [msgs, typing, analysing]);

  /**
   * markAnswered — call ONLY on chip-question bot messages.
   * This hides the chips and shows a selection badge instead.
   * The question text itself stays visible.
   * Do NOT call this on analysis / palette / result / upload messages.
   */
  const markAnswered = useCallback((msgId: string) => {
    setMsgs((p) => p.map((m) => m.id === msgId ? { ...m, answered: true } : m));
  }, []);

  const pushUser = useCallback(
    (content: React.ReactNode) =>
      setMsgs((p) => [...p, { id: uid(), role: "user", content }]),
    []
  );

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
      }),
    []
  );

  useEffect(() => { pushBotRef.current  = pushBot;  }, [pushBot]);
  useEffect(() => { pushUserRef.current = pushUser; }, [pushUser]);

  // ── Outfit flow ───────────────────────────────────────────────────────────
  const runOutfitFlow = useCallback((
    pb: typeof pushBot,
    pu: typeof pushUser,
    gender: string,
  ) => {
    const flow = async () => {
      // ── Occasion question (chip-question → markAnswered when answered) ──
      const occBotId = await pb(
        <div>
          <p className="mb-3">What&apos;s the occasion? 🎉</p>
          <ChipSelector
            options={OCCASIONS}
            onSelect={async (occ) => {
              markAnswered(occBotId);          // ✅ hide occasion chips, keep question
              pu(occ);
              occasionRef.current = occ;

              const vibes = getVibesForOccasion(occ, gender);

              // ── Vibe question ──────────────────────────────────────────
              const vibeBotId = await pb(
                <div>
                  <p className="mb-3">Love it! What&apos;s your vibe? ✨</p>
                  <ChipSelector
                    options={vibes}
                    onSelect={async (vibe) => {
                      markAnswered(vibeBotId); // ✅ hide vibe chips, keep question
                      pu(vibe);

                      // ── Platform question ───────────────────────────────
                      const platBotId = await pb(
                        <div>
                          <p className="mb-3">Where would you like to shop? 🛍️</p>
                          <ChipSelector
                            options={PLATFORMS}
                            onSelect={async (platform) => {
                              markAnswered(platBotId); // ✅ hide platform chips, keep question
                              pu(platform);

                              // ── Fetching message (no chips → no markAnswered needed) ──
                              await pb(
                                <div>
                                  <p className="font-semibold">Finding your perfect outfit! ✨</p>
                                  <p className="text-neutral-500 text-xs mt-0.5">Curating looks just for you...</p>
                                </div>,
                                400
                              );

                              const loadId = uid();
                              setMsgs((p) => [
                                ...p,
                                {
                                  id:   loadId,
                                  role: "bot",
                                  content: (
                                    <div className="bg-[#111111] rounded-2xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
                                      <div className="w-8 h-8 rounded-full animate-spin"
                                        style={{ border: "3px solid #d4af7f", borderTopColor: "transparent" }} />
                                      <p className="text-sm font-semibold text-[#d4af7f]">Curating {platform} outfits...</p>
                                      <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                      </div>
                                    </div>
                                  ),
                                },
                              ]);

                              try {
                                const res = await fetch("/api/outfits", {
                                  method:  "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    gender,
                                    occasion:   occasionRef.current,
                                    vibe,
                                    platform,
                                    body_shape: analysisRef.current?.body_shape,
                                    skin_tone:  analysisRef.current?.skin_tone,
                                  }),
                                });
                                const data: OutfitResult & { success: boolean } = await res.json();
                                if (!data.success) throw new Error("No outfits found");

                                setMsgs((p) =>
                                  p.map((m) =>
                                    m.id === loadId
                                      ? { ...m, content: <OutfitResultCard result={data} platform={platform} /> }
                                      : m
                                  )
                                );

                                // EndCard has no chips → no markAnswered needed
                                await pb(
                                  <EndCard
                                    onStartOver={handleStartOver}
                                    onTryAnother={async () => {
                                      const { allowed, used, limit } = await checkLimit();
                                      if (!allowed) {
                                        await pb(<LimitCard used={used} limit={limit} user={user} />, 300);
                                        return;
                                      }
                                      runOutfitFlow(pb, pu, gender);
                                    }}
                                    result={data}
                                    platform={platform}
                                    bodyShape={analysisRef.current?.body_shape ?? ""}
                                    skinTone={analysisRef.current?.skin_tone   ?? ""}
                                  />,
                                  800
                                );
                              } catch {
                                setMsgs((p) =>
                                  p.map((m) =>
                                    m.id === loadId
                                      ? { ...m, content: <p className="text-red-400 text-sm">Couldn&apos;t load outfits. Try again.</p> }
                                      : m
                                  )
                                );
                              }
                            }}
                          />
                        </div>,
                        600
                      );
                    }}
                  />
                </div>,
                600
              );
            }}
          />
        </div>,
        500
      );
    };
    flow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markAnswered]);

  // ── Boot ───────────────────────────────────────────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("users_profile")
          .select("body_shape, skin_tone, gender")
          .eq("id", user.id)
          .single();

        const name =
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name     ||
          user.user_metadata?.name          ||
          "there";
        const firstName = name.split(" ")[0];

        if (profile?.body_shape && profile?.skin_tone) {
          analysisRef.current = { body_shape: profile.body_shape, skin_tone: profile.skin_tone };

          // Welcome card — no chips, no markAnswered needed
          await pb(
            <div>
              <p className="font-bold text-white mb-1 text-base">Welcome back, {firstName}! 👋</p>
              <p className="text-neutral-400 text-sm leading-relaxed">We remember your style profile.</p>
              <div className="flex items-center gap-2 mt-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2 w-fit">
                <span className="text-[#d4af7f] text-xs font-bold">{profile.body_shape}</span>
                <span className="text-neutral-700">·</span>
                <span className="text-[#d4af7f] text-xs font-bold">{profile.skin_tone} skin</span>
              </div>
            </div>,
            800
          );

          // ReturningUserPrompt — has internal buttons (not ChipSelector chips)
          // so we don't need markAnswered; ReturningUserPrompt disables itself internally
          const retBotId = await pb(
            <ReturningUserPrompt
              bodyShape={profile.body_shape}
              skinTone={profile.skin_tone}
              onUseProfile={() => {
                // No markAnswered here — ReturningUserPrompt manages its own disabled state
                pu("Use my saved profile ✓");
                const askGender = async () => {
                  const gBotId = await pb(
                    <div>
                      <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                      <ChipSelector
                        options={["Female", "Male"]}
                        onSelect={(g) => {
                          markAnswered(gBotId); // ✅ chip question
                          pu(g);
                          genderRef.current = g;
                          runOutfitFlow(pb, pu, g);
                        }}
                      />
                    </div>,
                    400
                  );
                };
                askGender();
              }}
              onStyleSomeoneElse={async () => {
                pu("Style someone else");
                analysisRef.current = null;
                await pb("Sure! Let's start fresh 📸", 400);

                const gBotId = await pb(
                  <div>
                    <p className="font-semibold text-white mb-3">Who are we styling? 👗</p>
                    <ChipSelector
                      options={["Female", "Male"]}
                      onSelect={async (g) => {
                        markAnswered(gBotId); // ✅ chip question
                        pu(g);
                        genderRef.current = g;

                        // Upload prompt — NOT a chip question, no markAnswered
                        await pb(
                          <UploadPromptMsg
                            onCamera={() => camRef.current?.click()}
                            onUpload={() => fileRef.current?.click()}
                            onSkip={async () => {
                              pu("Skip photo");
                              await pb("No worries! 😊", 400);
                              runOutfitFlow(pb, pu, g);
                            }}
                          />,
                          600
                        );
                      }}
                    />
                  </div>,
                  600
                );
              }}
            />,
            600
          );
          // Note: retBotId is obtained but we don't call markAnswered on it —
          // ReturningUserPrompt disables its own buttons internally.
          void retBotId;
          return;
        }
      } catch { /* fall through */ }
    }

    // ── Fresh user greeting — no chips, no markAnswered ────────────────────
    await pb(
      <div>
        <p className="font-bold text-white mb-1 text-base">Hey! I&apos;m your AI Stylist 👋</p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you.
          I can analyse your body type &amp; skin tone for better recommendations.
        </p>
        <p className="text-[#d4af7f] text-xs mt-2 font-medium">Let&apos;s get started!</p>
      </div>,
      900
    );

    // ── Gender question — chip question → markAnswered ─────────────────────
    const gBotId = await pb(
      <div>
        <p className="font-semibold text-white mb-3">First — who are we styling today? 👗</p>
        <ChipSelector
          options={["Female", "Male"]}
          onSelect={async (gender) => {
            markAnswered(gBotId); // ✅ chip question
            pu(gender);
            genderRef.current = gender;


            // Upload prompt — NOT a chip question, never markAnswered
            await pb(
              <UploadPromptMsg
                onCamera={() => camRef.current?.click()}
                onUpload={() => fileRef.current?.click()}
                onSkip={async () => {
                  pu("Skip photo");
                  await pb("No worries! I'll still find amazing outfits for you 😊", 500);
                  runOutfitFlow(pb, pu, gender);
                }}
              />,
              800
            );
          }}
        />
      </div>,
      1000
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, runOutfitFlow, markAnswered]);

  // ── Start over ─────────────────────────────────────────────────────────────
  const handleStartOver = useCallback(async () => {
    const { allowed, used, limit } = await checkLimit();
    if (!allowed) {
      await pushBot(<LimitCard used={used} limit={limit} user={user} />, 300);
      return;
    }
    _n = 0;
    genderRef.current   = "";
    occasionRef.current = "";
    analysisRef.current = null;
    setAnalysing(false);
    setMsgs([]);
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser, checkLimit, user]);

  // ── One-time init ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  // ── File upload ────────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      pu(
        <img src={url} alt="you"
          className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-[#d4af7f]/40" />
      );

      const { allowed, used, limit } = await checkLimit();
      if (!allowed) {
        await pb(<LimitCard used={used} limit={limit} user={user} />, 400);
        return;
      }

      if (!user) {
        // Sign-in prompt — no chips, no markAnswered
        await pb(
          <div className="space-y-3">
            <p className="font-semibold text-white">Great photo! 📸</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Sign in to save your style analysis and get personalised recommendations.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-black"
                style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In</a>
              <a href="/signup"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
                Create Account</a>
            </div>
            <button onClick={() => { setAnalyseImgUrl(url); setAnalysing(true); }}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline block">
              ▷ Continue without account
            </button>
          </div>,
          600
        );
        return;
      }

      setAnalyseImgUrl(url);
      setAnalysing(true);
    };
    reader.readAsDataURL(file);
  }, [checkLimit, user]);

  // ── onAnalysisDone ─────────────────────────────────────────────────────────
  // Analysis result + palette are NEVER marked as answered — they stay fully visible.
  const onAnalysisDone = useCallback(async (result: {
    body_shape: string;
    skin_tone:  string;
    person_detected: boolean;
  }) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;

    const shape      = result.body_shape;
    const tone       = result.skin_tone;
    const gender     = genderRef.current || "Female";
    const genderProp = toGenderProp(gender);
    analysisRef.current = { body_shape: shape, skin_tone: tone };

    // Analysis editor bubble — contains AnalysisEditor (not a ChipSelector).
    // We use a ref trick to call markAnswered on it after the user confirms,
    // but ONLY to hide the editor buttons — the analysis summary stays visible.
    const analysisBotId = await pb(
      <div>
        <p className="mb-1 text-sm font-medium">Here&apos;s what I found! ✨</p>
        <p className="text-xs text-neutral-500 mb-3">If anything looks off, correct it below.</p>
        <AnalysisEditor
          bodyShape={shape}
          skinTone={tone}
          onConfirm={async (s, t) => {
            // We mark this bubble answered so the editor's confirm button hides —
            // but AnalysisEditor should show a confirmed state, not disappear.
            markAnswered(analysisBotId);
            analysisRef.current = { body_shape: s, skin_tone: t };
            pu(`${s} · ${t} skin ✓`);
            await incrementUsage();

            // Color palette — NOT marked answered, stays fully visible forever
            const paletteBotId = await pb(
              <ColorPaletteCard
                bodyShape={s}
                skinTone={t}
                gender={genderProp}
                onContinue={() => {
                  // We don't markAnswered the palette bubble —
                  // it stays visible in the chat history.
                  analysisRef.current = { body_shape: s, skin_tone: t };
                  runOutfitFlow(pb, pu, gender);
                }}
              />,
              500
            );
            // Intentionally unused — palette never gets markAnswered
            void paletteBotId;
          }}
        />
      </div>,
      600
    );
  }, [incrementUsage, runOutfitFlow, markAnswered]);

  // ── onAnalysisError ────────────────────────────────────────────────────────
  const onAnalysisError = useCallback(async (message: string) => {
    setAnalysing(false);
    const pb = pushBotRef.current!;
    const pu = pushUserRef.current!;

    // Error card — no chips, no markAnswered
    await pb(
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4">
        <p className="text-sm font-bold text-red-400 mb-1">📷 Oops!</p>
        <p className="text-sm text-red-300/80 leading-relaxed">{message}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#111111] border border-red-800/50 text-red-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-950/30 transition">
            📁 Try another photo
          </button>
          <button
            onClick={async () => {
              pu("I'll skip the photo");
              await pb("No worries! I'll still find great outfits for you 😊", 400);
              runOutfitFlow(pb, pu, genderRef.current);
            }}
            className="flex items-center gap-1.5 bg-[#111111] border border-neutral-800 text-neutral-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1a1a1a] transition">
            ▷ Skip and continue
          </button>
        </div>
      </div>,
      400
    );
  }, [runOutfitFlow]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto relative"
      style={{ minHeight: "100dvh", background: "#0a0a0a" }}>
      <header className="flex items-center justify-center px-4 py-4 bg-[#0a0a0a] z-10 border-b border-neutral-800 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Steal the{" "}
          <span className="italic" style={{
            background: "linear-gradient(135deg,#d4af7f,#b8860b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
          }}>
            Look
          </span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollbarWidth: "none", background: "#0a0a0a", minHeight: "0" }}>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}>
              <ChatBubble role={m.role} answered={m.answered}>
                {m.content}
              </ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      <AnimatePresence>
        {analysing && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
              <AnalysisScreen imageUrl={analyseImgUrl} onDone={onAnalysisDone}
                onError={onAnalysisError} durationMs={6000} />
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

// ── LimitCard ──────────────────────────────────────────────────────────────────
function LimitCard({ used, limit, user }: { used: number; limit: number; user: any }) {
  return (
    <div className="rounded-2xl border border-[#d4af7f]/20 bg-[#1a1400] p-4 space-y-3">
      <p className="text-sm font-bold text-[#d4af7f]">⚡ Daily limit reached</p>
      <p className="text-sm text-neutral-400 leading-relaxed">
        You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> analyses today.
        {!user ? " Sign in to get more daily analyses." : " Come back tomorrow for more! 🌅"}
      </p>
      {!user && (
        <div className="flex gap-2 flex-wrap">
          <a href="/login" className="px-4 py-2 rounded-full text-sm font-bold text-black"
            style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>Sign In for More</a>
          <a href="/signup"
            className="px-4 py-2 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
            Create Account</a>
        </div>
      )}
    </div>
  );
}

// ── EndCard ────────────────────────────────────────────────────────────────────
function EndCard({ onStartOver, onTryAnother, result, platform, bodyShape, skinTone }: {
  onStartOver: () => void; onTryAnother: () => void;
  result: OutfitResult; platform: string; bodyShape: string; skinTone: string;
}) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {

    setSharing(true);
    const profile = [bodyShape && `${bodyShape} body shape`, skinTone && `${skinTone} skin tone`]
      .filter(Boolean).join(" & ");
    const text = `✨ ${profile} — check yours!\n\nI used Outfevibe's AI Stylist to find my perfect look for ${result.look_name} 🛍️\n\nDiscover your style → outfevibe.com/outfit`;
    try {
      if (navigator.share) await navigator.share({ title: "My Outfevibe Style Profile", text, url: "https://www.outfevibe.com/outfit" });
      else { await navigator.clipboard.writeText(text); alert("Copied to clipboard! 📋"); }
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
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-black transition-all"
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

// ── ReturningUserPrompt ────────────────────────────────────────────────────────
function ReturningUserPrompt({ bodyShape, skinTone, onUseProfile, onStyleSomeoneElse }: {
  bodyShape: string; skinTone: string;
  onUseProfile: () => void; onStyleSomeoneElse: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-300 leading-relaxed">What would you like to do?</p>
      <div className="flex flex-col gap-2">
        <button onClick={() => { setChosen("profile"); onUseProfile(); }} disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-black text-left transition-all"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)", opacity: chosen && chosen !== "profile" ? 0.4 : 1 }}>
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-black">Use my saved profile</p>
            <p className="text-[11px] font-normal opacity-70">{bodyShape} · {skinTone} skin — skip the analysis</p>
          </div>
        </button>
        <button onClick={() => { setChosen("else"); onStyleSomeoneElse(); }} disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-neutral-300 text-left hover:bg-[#222]"
          style={{ opacity: chosen && chosen !== "else" ? 0.4 : 1 }}>
          <span className="text-lg">👥</span>
          <div>
            <p>Style someone else</p>
            <p className="text-[11px] font-normal text-neutral-600">Upload a new photo for a different person</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── UploadPromptMsg ────────────────────────────────────────────────────────────
function UploadPromptMsg({ onCamera, onUpload, onSkip }: {
  onCamera: () => void; onUpload: () => void; onSkip: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-neutral-200">
        Want to share a photo? I&apos;ll analyse your body shape &amp; skin tone for better recommendations 📸
      </p>
      <div className="mb-3 rounded-xl bg-[#1a1500] border border-[#d4af7f]/20 px-3 py-2.5 flex gap-2 items-start">
        <span className="text-sm mt-0.5">💡</span>
        <p className="text-xs text-neutral-400 leading-relaxed">
          For best results, upload a{" "}
          <span className="text-[#d4af7f] font-semibold">full-body photo</span> with a{" "}
          <span className="text-[#d4af7f] font-semibold">plain background</span> — this helps detect your body shape &amp; skin tone accurately.
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
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { OutfitResultCard } from "@/components/OutfitResultCard"; // ✅ updated import
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase"; // ✅ for sign-in gate
import { ColorPaletteCard } from "@/components/ColorPaletteCard"; // ✅ palette
import { useAnalysisLimit } from "@/app/hooks/useAnalysisLimit"; // ✅ usage limit
import {
  OutfitResult,
  OCCASIONS,
  VIBES,
  PLATFORMS,
  BODY_SHAPES,
  SKIN_TONES,
} from "@/lib/type";

interface Msg {
  id: string;
  role: "bot" | "user";
  content: React.ReactNode;
}

// ── module-level singletons ────────────────────────────────────────────────────
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

  // ✅ Auth — used for sign-in gate after image upload
  const auth = useAuth();
  const user = auth?.user ?? null;

  // ✅ Analysis usage limiter
  const { checkLimit, incrementUsage, GUEST_LIMIT, USER_LIMIT } = useAnalysisLimit(user?.id);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [msgs, typing, analysing]);

  // ── core push helpers ──────────────────────────────────────────────────────
  const pushUser = useCallback((content: React.ReactNode) =>
    setMsgs((p) => [...p, { id: uid(), role: "user", content }]), []);

  const pushBot = useCallback(
    (content: React.ReactNode, delay = 700): Promise<void> =>
      new Promise((res) => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMsgs((p) => [...p, { id: uid(), role: "bot", content }]);
          res();
        }, delay);
      }),
    []
  );

  // ── main styling flow ──────────────────────────────────────────────────────
  const runFlow = useCallback((pb: typeof pushBot, pu: typeof pushUser, hasPhoto = false) => {
    const flow = async () => {
      await pb(
        <div>
          <div className="mb-3">
            {hasPhoto ? (
              <>
                <p className="font-semibold text-white">Who is in the photo? 📸</p>
                <p className="text-xs text-neutral-500 mt-1">
                  💡 Select the gender of the{" "}
                  <span className="font-semibold text-[#d4af7f]">person in the image</span>{" "}
                  for accurate recommendations.
                </p>
              </>
            ) : (
              <p className="font-semibold text-white">Who are we styling today? 👗</p>
            )}
          </div>
          <ChipSelector
            options={["Female", "Male"]}
            onSelect={async (gender) => {
              pu(gender);
              genderRef.current = gender;
              await pb(
                <div>
                  <p className="mb-3">Great choice! What&apos;s the occasion? 🎉</p>
                  <ChipSelector
                    options={OCCASIONS}
                    onSelect={async (occ) => {
                      pu(occ);
                      occasionRef.current = occ;
                      await pb(
                        <div>
                          <p className="mb-3">Love it! What&apos;s your vibe today? ✨</p>
                          <ChipSelector
                            options={VIBES[gender] ?? VIBES["Female"]}
                            onSelect={async (vibe) => {
                              pu(vibe);
                              await pb(
                                <div>
                                  <p className="mb-3">Almost there! Where would you like to shop? 🛍️</p>
                                  <ChipSelector
                                    options={PLATFORMS}
                                    multi
                                    actionLabel="✨ Find My Outfits"
                                    onSelect={async (raw) => {
                                      const plats = raw.split(",").filter(Boolean);
                                      pu(plats.join(", "));
                                      const target = plats[0] ?? "Myntra";

                                      await pb(
                                        <div>
                                          <p className="font-semibold">Finding your perfect outfit! ✨</p>
                                          <p className="text-neutral-500 text-xs mt-0.5">Curating looks just for you…</p>
                                        </div>,
                                        400
                                      );

                                      // ── Loading card ──────────────────────
                                      const loadId = uid();
                                      setMsgs((p) => [...p, {
                                        id: loadId,
                                        role: "bot",
                                        content: (
                                          <div className="bg-[#111111] rounded-2xl p-6 flex flex-col items-center gap-3 border border-neutral-800">
                                            <div
                                              className="w-8 h-8 rounded-full animate-spin"
                                              style={{ border: "3px solid #d4af7f", borderTopColor: "transparent" }}
                                            />
                                            <p className="text-sm font-semibold text-[#d4af7f]">
                                              Curating {target} outfits…
                                            </p>
                                            <div className="flex gap-1">
                                              {[0, 1, 2].map((i) => (
                                                <span
                                                  key={i}
                                                  className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-bounce"
                                                  style={{ animationDelay: `${i * 0.15}s` }}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        ),
                                      }]);

                                      // ── Fetch outfits from JSON ───────────
                                      try {
                                        const res = await fetch("/api/outfits", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({
                                            gender:     genderRef.current,
                                            occasion:   occasionRef.current,
                                            vibe,
                                            platform:   target,
                                            body_shape: analysisRef.current?.body_shape,
                                            skin_tone:  analysisRef.current?.skin_tone,
                                          }),
                                        });

                                        const data: OutfitResult & { success: boolean } = await res.json();
                                        if (!data.success) throw new Error("No outfits found");

                                        // Replace loading card with real results
                                        setMsgs((p) => p.map((m) =>
                                          m.id === loadId
                                            ? { ...m, content: <OutfitResultCard result={data} platform={target} /> }
                                            : m
                                        ));

                                        await pb(
                                          <EndCard
                                            onStartOver={handleStartOver}
                                            onTryAnother={async () => {
                                              // ✅ Check limit before allowing restyle
                                              const { allowed, used, limit } = await checkLimit();
                                              if (!allowed) {
                                                await pb(
                                                  <div className="rounded-2xl border border-[#d4af7f]/20 bg-[#1a1400] p-4 space-y-3">
                                                    <p className="text-sm font-bold text-[#d4af7f]">⚡ Daily limit reached</p>
                                                    <p className="text-sm text-neutral-400 leading-relaxed">
                                                      You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> analyses today.
                                                      {!user ? " Sign in for more." : " Come back tomorrow! 🌅"}
                                                    </p>
                                                    {!user && (
                                                      <a href="/login"
                                                        className="inline-block px-4 py-2 rounded-full text-sm font-bold text-black"
                                                        style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
                                                        Sign In for More
                                                      </a>
                                                    )}
                                                  </div>,
                                                  300
                                                );
                                                return;
                                              }
                                              runFlow(pb, pu, !!analysisRef.current);
                                            }}
                                            result={data}
                                            platform={target}
                                            bodyShape={analysisRef.current?.body_shape ?? ""}
                                            skinTone={analysisRef.current?.skin_tone ?? ""}
                                          />,
                                          800
                                        );
                                      } catch {
                                        setMsgs((p) => p.map((m) =>
                                          m.id === loadId
                                            ? { ...m, content: <p className="text-red-400 text-sm">Couldn&apos;t load outfits. Try again.</p> }
                                            : m
                                        ));
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
                600
              );
            }}
          />
        </div>,
        500
      );
    };
    flow();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── boot sequence — checks profile first ────────────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {

    // ✅ If logged in, check if they already have body shape + skin tone saved
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("users_profile")
          .select("body_shape, skin_tone, gender")
          .eq("id", user.id)
          .single();

        const name = user.user_metadata?.display_name
          || user.user_metadata?.full_name
          || user.user_metadata?.name
          || "there";
        const firstName = name.split(" ")[0];

        if (profile?.body_shape && profile?.skin_tone) {
          // ✅ Returning user with saved profile
          analysisRef.current = {
            body_shape: profile.body_shape,
            skin_tone:  profile.skin_tone,
          };

          await pb(
            <div>
              <p className="font-bold text-white mb-1 text-base">
                Welcome back, {firstName}! 👋
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                We remember your style profile.
              </p>
              {/* Profile pill */}
              <div className="flex items-center gap-2 mt-3 bg-[#1a1a1a] border border-neutral-800 rounded-xl px-3 py-2 w-fit">
                <span className="text-[#d4af7f] text-xs font-bold">
                  {profile.body_shape}
                </span>
                <span className="text-neutral-700">·</span>
                <span className="text-[#d4af7f] text-xs font-bold">
                  {profile.skin_tone} skin
                </span>
              </div>
            </div>,
            800
          );

          await pb(
            <ReturningUserPrompt
              bodyShape={profile.body_shape}
              skinTone={profile.skin_tone}
              onUseProfile={() => {
                pu("Use my saved profile ✓");
                runFlow(pb, pu, false); // skip photo, use saved data
              }}
              onStyleSomeoneElse={async () => {
                pu("Style someone else");
                analysisRef.current = null; // clear saved profile
                await pb("Sure! Let's start fresh 📸", 400);
                const skip = async () => {
                  pu("Skip photo");
                  await pb("No worries! 😊", 400);
                  runFlow(pb, pu, false);
                };
                await pb(
                  <UploadPromptMsg
                    onCamera={() => camRef.current?.click()}
                    onUpload={() => fileRef.current?.click()}
                    onSkip={skip}
                  />,
                  600
                );
              }}
            />,
            600
          );
          return; // ✅ Don't show normal welcome
        }
      } catch {
        // profile fetch failed — fall through to normal boot
      }
    }

    // ── Normal first-time boot ────────────────────────────────────────────────
    await pb(
      <div>
        <p className="font-bold text-white mb-1 text-base">Hey! I&apos;m your AI Stylist 👋</p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you. I can
          analyse your body type &amp; skin tone from your photo for better recommendations.
        </p>
        <p className="text-[#d4af7f] text-xs mt-2 font-medium">Let&apos;s get started!</p>
      </div>,
      900
    );

    const skip = async () => {
      pu("I'll skip the photo for now");
      await pb("No worries! I'll still find amazing outfits for you 😊", 500);
      runFlow(pb, pu, false);
    };

    await pb(
      <UploadPromptMsg
        onCamera={() => camRef.current?.click()}
        onUpload={() => fileRef.current?.click()}
        onSkip={skip}
      />,
      1200
    );
  }, [user, runFlow]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── start over ────────────────────────────────────────────────────────────
  const handleStartOver = useCallback(async () => {
    // ✅ Check limit before allowing a new full session
    const { allowed, used, limit } = await checkLimit();
    if (!allowed) {
      // Show limit message in current chat instead of resetting
      await pushBot(
        <div className="rounded-2xl border border-[#d4af7f]/20 bg-[#1a1400] p-4 space-y-3">
          <p className="text-sm font-bold text-[#d4af7f]">⚡ Daily limit reached</p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> analyses today.
            {!user
              ? " Sign in to get more daily analyses."
              : " Come back tomorrow for more! 🌅"}
          </p>
          {!user && (
            <div className="flex gap-2 flex-wrap">
              <a href="/login"
                className="px-4 py-2 rounded-full text-sm font-bold text-black"
                style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
                Sign In for More
              </a>
              <a href="/signup"
                className="px-4 py-2 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
                Create Account
              </a>
            </div>
          )}
        </div>,
        300
      );
      return; // ✅ Don't reset — just show the message
    }
    _n = 0;
    genderRef.current   = "";
    occasionRef.current = "";
    analysisRef.current = null;
    setAnalysing(false);
    setMsgs([]);
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser, checkLimit, pushBot, user]);

  // ── one-time init ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  // ── file upload → limit check → sign-in gate → analysis overlay ──────────
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;

      // ✅ Show uploaded image in chat first
      pushUser(
        <img src={url} alt="you" className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-[#d4af7f]/40" />
      );

      // ✅ Check daily analysis limit FIRST
      const { allowed, used, limit } = await checkLimit();
      if (!allowed) {
        await pushBot(
          <div className="rounded-2xl border border-[#d4af7f]/20 bg-[#1a1400] p-4 space-y-3">
            <p className="text-sm font-bold text-[#d4af7f]">⚡ Daily limit reached</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              You&apos;ve used <span className="text-white font-semibold">{used}/{limit}</span> free analyses today.
              {!user
                ? " Sign in for more daily analyses."
                : " Come back tomorrow for fresh analyses! 🌅"}
            </p>
            {!user && (
              <div className="flex gap-2 flex-wrap">
                <a href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-black"
                  style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}>
                  Sign In for More
                </a>
                <a href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#d4af7f] border border-[#d4af7f]/30 bg-[#1a1a1a]">
                  Create Account
                </a>
              </div>
            )}
          </div>,
          400
        );
        return;
      }

      // ✅ If not logged in — show sign-in prompt before analysis
      if (!user) {
        await pushBot(
          <div className="space-y-3">
            <p className="font-semibold text-white">Great photo! 📸</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              To save your style analysis and get personalised recommendations, please sign in first.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-black transition-all"
                style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-[#d4af7f] transition-all border border-[#d4af7f]/30 bg-[#1a1a1a] hover:bg-[#222]"
              >
                Create Account
              </a>
            </div>
            <button
              onClick={async () => {
                // ✅ Continue without account — proceed to analysis
                setAnalyseImgUrl(url);
                setAnalysing(true); // ✅ count only after full analysis completes
              }}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline block"
            >
              ▷ Continue without account
            </button>
          </div>,
          600
        );
        return; // ✅ Stop here — wait for user action
      }

      // ✅ Already signed in — go straight to analysis
      setAnalyseImgUrl(url);
      setAnalysing(true); // ✅ count only after full analysis completes
    };
    reader.readAsDataURL(file);
  }, [pushUser, pushBot, user]);

  // ── onAnalysisDone — receives real MediaPipe results ────────────────────
  const onAnalysisDone = useCallback(async (
    result: { body_shape: string; skin_tone: string; person_detected: boolean }
  ) => {
    setAnalysing(false);

    const shape = result.body_shape;
    const tone  = result.skin_tone;
    analysisRef.current = { body_shape: shape, skin_tone: tone };

    await pushBot(
      <div>
        <p className="mb-1 text-sm font-medium">Here&apos;s what I found! ✨</p>
        <p className="text-xs text-neutral-500 mb-3">If anything looks off, correct it below.</p>
        <AnalysisEditor
          bodyShape={shape}
          skinTone={tone}
          onConfirm={async (s, t) => {
            analysisRef.current = { body_shape: s, skin_tone: t };
            pushUser(`${s} · ${t} skin ✓`);

            // ✅ Count usage only after successful analysis confirmed
            await incrementUsage();

            // ✅ Show colour palette after body+skin confirmed
            await pushBot(
              <ColorPaletteCard
                bodyShape={s}
                skinTone={t}
                onContinue={() => runFlow(pushBot, pushUser, true)} // photo was uploaded
              />,
              500
            );
          }}
        />
      </div>,
      600
    );
  }, [pushBot, pushUser, runFlow]);

  // ── ✅ onAnalysisError — no person detected in image ─────────────────────
  const onAnalysisError = useCallback(async (message: string) => {
    setAnalysing(false);
    await pushBot(
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4">
        <p className="text-sm font-bold text-red-400 mb-1">📷 Oops!</p>
        <p className="text-sm text-red-300/80 leading-relaxed">{message}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#111111] border border-red-800/50 text-red-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-950/30 transition"
          >
            📁 Try another photo
          </button>
          <button
            onClick={async () => {
              pushUser("I'll skip the photo");
              await pushBot("No worries! I'll still find great outfits for you 😊", 400);
              runFlow(pushBot, pushUser, false);
            }}
            className="flex items-center gap-1.5 bg-[#111111] border border-neutral-800 text-neutral-400 rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1a1a1a] transition"
          >
            ▷ Skip and continue
          </button>
        </div>
      </div>,
      400
    );
  }, [pushBot, pushUser, runFlow]);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto relative" style={{ minHeight: "100dvh", background: "#0a0a0a" }}>

      {/* Header */}
      <header className="flex items-center justify-center px-4 py-4 bg-[#0a0a0a] z-10 border-b border-neutral-800 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Steal the{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg,#d4af7f,#b8860b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Look
          </span>
        </h1>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: "none", background: "#0a0a0a", minHeight: "0" }}>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ChatBubble role={m.role}>{m.content}</ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      {/* ✅ Analysis overlay — passes result back via onDone */}
      <AnimatePresence>
        {analysing && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <div className="w-full max-w-sm">
              <AnalysisScreen
                imageUrl={analyseImgUrl}
                onDone={onAnalysisDone}
                onError={onAnalysisError}  // ✅ handles non-person images
                durationMs={6000}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}


// ── End card — feedback, try another style, share, save ──────────────────────
function EndCard({
  onStartOver,
  onTryAnother,
  result,
  platform,
  bodyShape,
  skinTone,
}: {
  onStartOver: () => void;
  onTryAnother: () => void;
  result: OutfitResult;
  platform: string;
  bodyShape: string;
  skinTone: string;
}) {
  const { user } = useAuth();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating]             = useState(0);
  const [hovered, setHovered]           = useState(0);
  const [sharing, setSharing]           = useState(false);
  const [saved, setSaved]               = useState(false);
  const [likedItems, setLikedItems]     = useState<Set<number>>(new Set());

  // ── Custom share message with body shape + skin tone ─────────────────────
  const handleShare = async () => {
    setSharing(true);
    const bodyLine = bodyShape ? `I have a ${bodyShape} body shape` : "I discovered my body shape";
    const toneLine = skinTone  ? `${skinTone} skin tone` : "";
    const profile  = [bodyLine, toneLine].filter(Boolean).join(" & ");

    const text = `✨ ${profile} — check yours!

I used Outfevibe's AI Stylist to find my perfect look for ${result.look_name} 🛍️

Discover your style → outfevibe.com/outfit`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Outfevibe Style Profile",
          text,
          url: "https://www.outfevibe.com/outfit",
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard! Paste and share 📋");
      }
    } catch {}
    setSharing(false);
  };

  // ── Star rating ───────────────────────────────────────────────────────────
  const handleRating = (r: number) => {
    setRating(r);
    setFeedbackSent(true);
  };

  // ── Like individual outfit item ───────────────────────────────────────────
  const toggleLike = (idx: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // ── Save entire look + analysis to profile ────────────────────────────────
  const handleSaveToProfile = async () => {
    if (!user || saved) return;
    try {
      // Save body analysis
      await supabase.from("users_profile").update({
        body_shape: bodyShape || null,
        skin_tone:  skinTone  || null,
      }).eq("id", user.id);

      // Save liked outfits
      const likedList = result.items
        .filter((_, i) => likedItems.has(i))
        .map((item: any) => ({
          user_id:      user.id,
          outfit_title: item.name,
          outfit_image: item.image,
          outfit_link:  item.affiliateLink,
          interaction:  "liked",
        }));

      if (likedList.length > 0) {
        await supabase.from("saved_outfits").upsert(likedList, { onConflict: "user_id,outfit_title" });
      }

      setSaved(true);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-neutral-200 font-semibold text-sm">Hope you love this look! 🛍️</p>

      {/* ── Like individual items ── */}
      {result.items && result.items.length > 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Like items to save them
          </p>
          <div className="space-y-2">
            {result.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-800 flex-shrink-0" />
                )}
                <p className="text-xs text-neutral-300 flex-1 line-clamp-1">{item.name}</p>
                <button
                  onClick={() => toggleLike(i)}
                  className="text-xl transition-transform hover:scale-125 flex-shrink-0"
                >
                  <span style={{ color: likedItems.has(i) ? "#ef4444" : "#2a2a2a" }}>
                    {likedItems.has(i) ? "♥" : "♡"}
                  </span>
                </button>
              </div>
            ))}
          </div>
          {user && likedItems.size > 0 && (
            <button
              onClick={handleSaveToProfile}
              disabled={saved}
              className="mt-3 w-full rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-2 transition-all border"
              style={saved
                ? { background: "#1a1a1a", borderColor: "#2a2a2a", color: "#d4af7f" }
                : { background: "linear-gradient(135deg,#d4af7f,#b8860b)", borderColor: "transparent", color: "#000" }
              }
            >
              {saved ? "✓ Saved to profile" : `Save ${likedItems.size} liked item${likedItems.size > 1 ? "s" : ""} →`}
            </button>
          )}
        </div>
      )}

      {/* ── Star rating ── */}
      <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-4">
        {!feedbackSent ? (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Rate this recommendation
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleRating(star)}
                  className="text-2xl transition-transform hover:scale-125"
                >
                  <span style={{ color: star <= (hovered || rating) ? "#d4af7f" : "#2a2a2a" }}>★</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[#d4af7f]">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
            <p className="text-xs text-neutral-400 ml-1">Thanks! 🙏</p>
          </div>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onTryAnother}
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-black transition-all"
          style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
        >
          <RotateCcw className="w-4 h-4" /> Try Another Style
        </button>

        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
        >
          📤 {sharing ? "Sharing…" : "Share My Style"}
        </button>

        <button
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors w-full mt-1"
        >
          <RotateCcw className="w-3 h-3" /> Start completely over
        </button>
      </div>
    </div>
  );
}

// ── Returning user prompt ─────────────────────────────────────────────────────
function ReturningUserPrompt({
  bodyShape,
  skinTone,
  onUseProfile,
  onStyleSomeoneElse,
}: {
  bodyShape: string;
  skinTone: string;
  onUseProfile: () => void;
  onStyleSomeoneElse: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-300 leading-relaxed">
        What would you like to do?
      </p>
      <div className="flex flex-col gap-2">

        {/* Use saved profile */}
        <button
          onClick={() => { setChosen("profile"); onUseProfile(); }}
          disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-black text-left transition-all"
          style={{
            background: chosen === "profile"
              ? "linear-gradient(135deg,#d4af7f,#b8860b)"
              : chosen
              ? "#1a1a1a"
              : "linear-gradient(135deg,#d4af7f,#b8860b)",
            opacity: chosen && chosen !== "profile" ? 0.4 : 1,
          }}
        >
          <span className="text-lg">⚡</span>
          <div>
            <p className={chosen === "profile" ? "text-black" : "text-black"}>
              Use my saved profile
            </p>
            <p className="text-[11px] font-normal opacity-70">
              {bodyShape} · {skinTone} skin — skip the analysis
            </p>
          </div>
        </button>

        {/* Style someone else */}
        <button
          onClick={() => { setChosen("else"); onStyleSomeoneElse(); }}
          disabled={!!chosen}
          className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-neutral-300 text-left transition-all hover:bg-[#222]"
          style={{ opacity: chosen && chosen !== "else" ? 0.4 : 1 }}
        >
          <span className="text-lg">👥</span>
          <div>
            <p>Style someone else</p>
            <p className="text-[11px] font-normal text-neutral-600">
              Upload a new photo for a different person
            </p>
          </div>
        </button>

      </div>
    </div>
  );
}

// ── Upload prompt component ────────────────────────────────────────────────────
function UploadPromptMsg({
  onCamera,
  onUpload,
  onSkip,
}: {
  onCamera: () => void;
  onUpload: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-neutral-200">
        First, want to share a photo? It helps me understand your body
        shape &amp; skin tone for better recommendations 📸
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onCamera}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
        >
          <Camera className="w-4 h-4 text-pink-500" /> Take Photo
        </button>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
        >
          <Upload className="w-4 h-4 text-purple-500" /> Upload
        </button>
      </div>
      <button
        onClick={onSkip}
        className="mt-3 flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors underline-offset-2 hover:underline"
      >
        ▷ Skip for now
      </button>
    </div>
  );
}
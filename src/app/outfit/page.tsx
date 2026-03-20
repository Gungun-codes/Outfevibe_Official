"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { OutfitResultCard } from "@/components/OutfitResultCard"; // ✅ updated import
import { useAuth } from "@/context/authContext"; // ✅ for sign-in gate
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
  const runFlow = useCallback((pb: typeof pushBot, pu: typeof pushUser) => {
    const flow = async () => {
      await pb(
        <div>
          <div className="mb-3">
              <p className="font-semibold text-white">Who is in the photo? 📸</p>
              <p className="text-xs text-neutral-500 mt-1">
                💡 Select the gender of the <span className="font-semibold text-[#d4af7f]">person in the image</span> for accurate outfit recommendations.
              </p>
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
                                          <div className="flex flex-col gap-2">
                                            <p className="text-neutral-200 font-medium">Hope you love this look! 🛍️ Want to explore another style?</p>
                                            <button
                                              onClick={handleStartOver}
                                              className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#d4af7f]/30 text-[#d4af7f] rounded-full px-4 py-2 text-sm font-semibold w-fit transition-all"
                                            >
                                              <RotateCcw className="w-4 h-4" /> Start Over
                                            </button>
                                          </div>,
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

  // ── boot sequence ──────────────────────────────────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {
    await pb(
      <div>
        <p className="font-bold text-white mb-1 text-base">Hey! I'm your AI Stylist 👋</p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you. I can
          analyse your body type &amp; skin tone from your photo for better recommendations.
        </p>
        <p className="text-[#d4af7f] text-xs mt-2 font-medium">Let's get started!</p>
      </div>,
      900
    );

    const skip = async () => {
      pu("I'll skip the photo for now");
      await pb("No worries! I'll still find amazing outfits for you 😊", 500);
      runFlow(pb, pu);
    };

    await pb(
      <UploadPromptMsg
        onCamera={() => camRef.current?.click()}
        onUpload={() => fileRef.current?.click()}
        onSkip={skip}
      />,
      1200
    );
  }, [runFlow]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── start over ────────────────────────────────────────────────────────────
  const handleStartOver = useCallback(() => {
    _n = 0;
    genderRef.current   = "";
    occasionRef.current = "";
    analysisRef.current = null;
    setAnalysing(false);
    setMsgs([]);
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser]);

  // ── one-time init ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  // ── file upload → sign-in gate → analysis overlay ───────────────────────
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;

      // ✅ Show uploaded image in chat first
      pushUser(
        <img src={url} alt="you" className="w-28 h-36 object-cover rounded-2xl shadow-md border-2 border-[#d4af7f]/40" />
      );

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
              onClick={() => {
                // ✅ Continue without account — proceed to analysis
                setAnalyseImgUrl(url);
                setAnalysing(true);
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
      setAnalysing(true);
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
            await pushBot("Perfect! I'll keep that in mind. ✨", 500);
            runFlow(pushBot, pushUser);
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
              runFlow(pushBot, pushUser);
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
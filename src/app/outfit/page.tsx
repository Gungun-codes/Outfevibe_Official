"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCcw } from "lucide-react";
import { ChatBubble, TypingIndicator } from "@/components/ChatBubble";
import { ChipSelector } from "@/components/ChipSelector";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { AnalysisScreen } from "@/components/AnalysisScreen";
import { OutfitResultCard } from "@/components/OutfitCard";
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

// ─── module-level singletons (survive React Strict Mode double-invoke) ───────
let _n = 0;
const uid = () => `m${++_n}_${Date.now()}`;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// ONE flag: the welcome sequence must fire exactly once per page load
let _booted = false;

// ─── component ────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [msgs, typing, analysing]);

  // ── core push helpers ─────────────────────────────────────────────────────
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

  // ── styling flow: gender → occasion → vibe → platform → outfits ──────────
  const runFlow = useCallback((pb: typeof pushBot, pu: typeof pushUser) => {
    // Defined inline so pb/pu are always the stable refs from this render
    const flow = async () => {
      await pb(
        <div>
          <p className="mb-3">Now let&apos;s personalize! Who are we styling today? 👗🎁</p>
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
                                          <p className="text-gray-400 text-xs mt-0.5">Here&apos;s my top pick for you:</p>
                                        </div>,
                                        400
                                      );

                                      const loadId = uid();
                                      setMsgs((p) => [...p, {
                                        id: loadId,
                                        role: "bot",
                                        content: (
                                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 flex flex-col items-center gap-3 border border-purple-100">
                                            <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "3px solid #e91e8c", borderTopColor: "transparent" }} />
                                            <p className="text-sm font-semibold text-purple-700">Curating {target} outfit…</p>
                                            <div className="flex gap-1">
                                              {[0,1,2].map((i) => (
                                                <span key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                              ))}
                                            </div>
                                          </div>
                                        ),
                                      }]);

                                      try {
                                        const res = await fetch("/api/outfits", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({
                                            gender: genderRef.current,
                                            occasion: occasionRef.current,
                                            vibe, platform: target,
                                            body_shape: analysisRef.current?.body_shape,
                                            skin_tone:  analysisRef.current?.skin_tone,
                                          }),
                                        });
                                        const data: OutfitResult & { success: boolean } = await res.json();
                                        if (!data.success) throw new Error();

                                        setMsgs((p) => p.map((m) =>
                                          m.id === loadId
                                            ? { ...m, content: <OutfitResultCard result={data} platform={target} /> }
                                            : m
                                        ));

                                        await pb(
                                          <div className="flex flex-col gap-2">
                                            <p>Hope you love this look! 🛍️ Want to explore another style?</p>
                                            <button
                                              onClick={handleStartOver}
                                              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium w-fit"
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

  // ── boot sequence (welcome + upload prompt) ───────────────────────────────
  const boot = useCallback(async (pb: typeof pushBot, pu: typeof pushUser) => {
    // ─── WELCOME — single message ───────────────────────────────────────────
    await pb(
      <div>
        <p className="font-semibold text-gray-900 mb-1">Hey! I&apos;m your AI Stylist 👋</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          I&apos;ll help you find the perfect outfit tailored just for you. I can
          analyse your body type &amp; skin tone to give you the most flattering
          recommendations.
        </p>
        <p className="text-gray-400 text-xs mt-2">Let&apos;s get started!</p>
      </div>,
      900
    );

    // ─── UPLOAD PROMPT — single message ────────────────────────────────────
    // We define skip here so it closes over pb/pu correctly
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
    // small delay so setMsgs([]) completes, then boot again
    setTimeout(() => boot(pushBot, pushUser), 120);
  }, [boot, pushBot, pushUser]);

  // ── one-time init — guarded by module-level flag ──────────────────────────
  useEffect(() => {
    if (_booted) return;
    _booted = true;
    boot(pushBot, pushUser);
  }, [boot, pushBot, pushUser]);

  // ── file upload → analysis overlay ───────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      pushUser(<img src={url} alt="you" className="w-28 h-36 object-cover rounded-2xl shadow-md" />);
      setAnalyseImgUrl(url);
      setAnalysing(true);
    };
    reader.readAsDataURL(file);
  }, [pushUser]);

  const onAnalysisDone = useCallback(async () => {
    setAnalysing(false);
    const shape = pick(BODY_SHAPES);
    const tone  = pick(SKIN_TONES);
    analysisRef.current = { body_shape: shape, skin_tone: tone };

    await pushBot(
      <div>
        <p className="mb-1 text-sm font-medium">Here&apos;s what I found! ✨</p>
        <p className="text-xs text-gray-400 mb-3">If anything looks off, correct it below.</p>
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

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-[#faf5ff] relative">
      {/* Header */}
      <header className="flex items-center justify-center px-4 py-4 bg-white/90 backdrop-blur border-b border-purple-50 shadow-sm z-10">
        <h1 className="text-xl font-bold tracking-tight">
          Steal the{" "}
          <span className="gradient-text font-display italic">Look</span>
        </h1>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
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

      {/* Analysis fullscreen overlay */}
      <AnimatePresence>
        {analysing && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-20 bg-[#faf5ff]/95 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <div className="w-full max-w-sm">
              <AnalysisScreen imageUrl={analyseImgUrl} onDone={onAnalysisDone} durationMs={5000} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

// ─── tiny presentational component for the upload prompt ─────────────────────
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
      <p className="mb-3 text-sm leading-relaxed">
        First, want to share a photo of yourself? It helps me understand your body
        shape &amp; skin tone for better recommendations 📸
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onCamera}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all"
        >
          <Camera className="w-4 h-4 text-pink-500" /> Take Photo
        </button>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all"
        >
          <Upload className="w-4 h-4 text-purple-500" /> Upload
        </button>
      </div>
      <button
        onClick={onSkip}
        className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ▷ Skip for now
      </button>
    </div>
  );
}
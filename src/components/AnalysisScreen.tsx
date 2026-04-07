"use client";

import "@/lib/supress-tflite-log";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Validating your photo…",         icon: "🔍", pct: 15 },
  { label: "Detecting person in image…",     icon: "🤖", pct: 30 },
  { label: "Sampling skin undertones…",      icon: "🎨", pct: 50 },
  { label: "Analysing body proportions…",    icon: "📐", pct: 70 },
  { label: "Classifying your body shape…",   icon: "✨", pct: 88 },
  { label: "Finalising your profile…",       icon: "💫", pct: 97 },
];

interface AnalysisResult {
  body_shape:      string;
  skin_tone:       string;
  person_detected: boolean;
}

interface Props {
  imageUrl:   string;
  onDone:     (result: AnalysisResult) => void;
  onError?:   (message: string) => void;
  durationMs?: number;
}

export function AnalysisScreen({ imageUrl, onDone, onError, durationMs = 6000 }: Props) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doneRef = useRef(false);
  const callDone = (result: AnalysisResult) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone(result);
  };

  useEffect(() => {
    let cancelled   = false;
    let progressInt: ReturnType<typeof setInterval>;

    const run = async () => {
      try {
        // Animate progress smoothly in background
        const start = Date.now();
        progressInt = setInterval(() => {
          const elapsed = Date.now() - start;
          const pct = Math.min((elapsed / durationMs) * 90, 90);
          setProgress(pct);
        }, 80);

        // ── Step through visual steps ─────────────────────────────────
        setStepIdx(0); setProgress(10);
        await sleep(400);

        setStepIdx(1); setProgress(25);
        await sleep(300);

        // ── Convert imageUrl (data URL) to File/Blob ──────────────────
        const blob = await dataUrlToBlob(imageUrl);

        setStepIdx(2); setProgress(40);

        // ── Call backend API ──────────────────────────────────────────
        const formData = new FormData();
        formData.append("image", blob, "photo.jpg");

        const res = await fetch("/api/analyze", {
          method: "POST",
          body:   formData,
        });

        if (cancelled) return;

        setStepIdx(3); setProgress(65);
        await sleep(300);

        const data = await res.json();

        if (cancelled) return;

        setStepIdx(4); setProgress(85);
        await sleep(400);

        if (!res.ok || !data.success) {
          // Backend said no person detected or validation failed
          clearInterval(progressInt);
          setErrorMsg(data.error ?? "Analysis failed.");
          onError?.(data.error ?? "Could not analyse the image. Please try again.");
          return;
        }

        setStepIdx(5); setProgress(97);
        await sleep(500);

        if (cancelled) return;

        clearInterval(progressInt);
        setProgress(100);

        callDone({
          body_shape:      data.body_shape      ?? "Rectangle",
          skin_tone:       data.skin_tone       ?? "Medium",
          person_detected: data.person_detected ?? true,
        });

      } catch (err: unknown) {
        clearInterval(progressInt);
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Analysis failed.";
          console.error("[AnalysisScreen]", msg);
          setErrorMsg("Analysis failed. Falling back to manual selection.");
          // Graceful fallback — open the editor with defaults
          callDone({ body_shape: "Rectangle", skin_tone: "Medium", person_detected: false });
        }
      }
    };

    run();

    // Safety fallback — if API hangs for 30s
    const safetyTimer = setTimeout(() => {
      if (!doneRef.current) {
        clearInterval(progressInt);
        callDone({ body_shape: "Rectangle", skin_tone: "Medium", person_detected: false });
      }
    }, 30_000);

    return () => {
      cancelled = true;
      clearInterval(progressInt);
      clearTimeout(safetyTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const current = STEPS[Math.min(stepIdx, STEPS.length - 1)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-[#111111]"
    >
      {/* Image preview with scan effect */}
      <div className="relative w-full h-52 overflow-hidden bg-neutral-900">
        <img src={imageUrl} alt="analysing" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5"
          style={{
            background:  "linear-gradient(90deg, transparent, #d4af7f, transparent)",
            boxShadow:   "0 0 12px 3px rgba(212,175,127,0.6)",
          }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />

        {/* Corner brackets */}
        {["top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 border-[#d4af7f] ${cls} rounded-sm`} />
        ))}

        {/* Active badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#d4af7f]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-pulse inline-block" />
          AI VISION ACTIVE
        </div>
      </div>

      {/* Progress panel */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="text-lg">{current.icon}</span>
            <span className="text-sm font-medium text-neutral-300">
              {errorMsg ?? current.label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width:      `${progress}%`,
              background: "linear-gradient(90deg,#d4af7f,#b8860b)",
            }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <p className="text-right text-xs text-neutral-600 mt-1">{Math.round(progress)}%</p>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={
                i <= stepIdx
                  ? { background: "#d4af7f", width: "16px" }
                  : { background: "#2a2a2a", width:  "6px" }
              }
            />
          ))}
        </div>

        <p className="text-center text-[10px] text-neutral-700 mt-3 font-medium tracking-wide">
          Powered by Outfevibe Vision API
        </p>
      </div>
    </motion.div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  // If it's already a blob URL or http URL
  if (dataUrl.startsWith("blob:") || dataUrl.startsWith("http")) {
    const res = await fetch(dataUrl);
    return res.blob();
  }

  // data URL → Blob
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
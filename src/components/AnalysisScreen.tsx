"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/lib/supress-tflite-log";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const STEPS = [
  { label: "Loading AI vision model…",      icon: "🤖", pct: 10 },
  { label: "Detecting body landmarks…",     icon: "📐", pct: 28 },
  { label: "Calculating body proportions…", icon: "📏", pct: 48 },
  { label: "Sampling skin undertones…",     icon: "🎨", pct: 65 },
  { label: "Classifying body shape…",       icon: "✨", pct: 82 },
  { label: "Finalising your profile…",      icon: "💫", pct: 97 },
];

let _landmarkerPromise: Promise<any> | null = null;

function getPoseLandmarker(): Promise<any> {
  if (!_landmarkerPromise) {
    _landmarkerPromise = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      return PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "CPU",
        },
        runningMode:                   "IMAGE",
        numPoses:                      1,
        minPoseDetectionConfidence:    0.3,
        minPosePresenceConfidence:     0.3,
        minTrackingConfidence:         0.3,
      });
    })().catch((e) => { _landmarkerPromise = null; throw e; });
  }
  return _landmarkerPromise;
}

function getCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext("2d", { willReadFrequently: true });
}

function rgbToSkinTone(r: number, g: number, b: number): string {
  const br = (r * 299 + g * 587 + b * 114) / 1000;
  if (br > 210) return "Fair";
  if (br > 185) return "Light";
  if (br > 155) return "Medium";
  if (br > 125) return "Tan";
  if (br > 90)  return "Deep";
  return "Dark";
}

// ── Strict person detection ───────────────────────────────────────────────────
// Two-pass check:
//   Pass 1: skin pixel ratio — must be ≥ 8% (raised from 4%)
//   Pass 2: colour diversity — real photos have high variance, text images are flat
// Text screenshots fail both: near-zero skin pixels AND very low colour variance.
function hasPersonInImage(img: HTMLImageElement, canvas: HTMLCanvasElement): boolean {
  const ctx = getCtx(canvas);
  if (!ctx) return true;

  canvas.width  = Math.min(img.naturalWidth  || img.width,  400);
  canvas.height = Math.min(img.naturalHeight || img.height, 400);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let skinPixels = 0, totalPixels = 0;
  let rSum = 0, gSum = 0, bSum = 0;
  let rSumSq = 0, gSumSq = 0, bSumSq = 0;

  for (let i = 0; i < data.length; i += 8) { // sample every 2nd pixel for perf
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a < 128) continue;
    totalPixels++;

    rSum += r; gSum += g; bSum += b;
    rSumSq += r*r; gSumSq += g*g; bSumSq += b*b;

    const br  = (r*299 + g*587 + b*114) / 1000;
    const sat = Math.max(r,g,b) - Math.min(r,g,b);
    // Skin heuristic: warm, not grey, not too dark/light
    if (br > 60 && br < 240 && sat > 20 && r > g && r > b && r - b > 15 && r - g > 5)
      skinPixels++;
  }

  if (totalPixels < 100) return false;

  const skinRatio = skinPixels / totalPixels;

  // ── Pass 1: skin ratio must be ≥ 8% ─────────────────────────────────────
  // Text images score ~0-2%, product images ~1-3%, person photos ≥ 8%
  if (skinRatio < 0.08) {
    console.log("[PersonDetect] Rejected — skinRatio:", skinRatio.toFixed(3));
    return false;
  }

  // ── Pass 2: colour variance — real photos are visually complex ───────────
  // Variance = E[X²] - E[X]². Low variance = flat/monotone image (text, logos).
  const n = totalPixels;
  const rVar = (rSumSq / n) - Math.pow(rSum / n, 2);
  const gVar = (gSumSq / n) - Math.pow(gSum / n, 2);
  const bVar = (bSumSq / n) - Math.pow(bSum / n, 2);
  const totalVariance = rVar + gVar + bVar;

  // Text screenshots typically have variance < 500 (mostly white + black text)
  // Real photos of people typically have variance > 1500
  if (totalVariance < 800) {
    console.log("[PersonDetect] Rejected — low variance:", totalVariance.toFixed(0));
    return false;
  }

  console.log("[PersonDetect] ✅ Passed — skinRatio:", skinRatio.toFixed(3), "variance:", totalVariance.toFixed(0));
  return true;
}

function sampleSkinTone(img: HTMLImageElement, canvas: HTMLCanvasElement): string {
  const ctx = getCtx(canvas);
  if (!ctx) return "Medium";
  const W = img.naturalWidth  || img.width  || 800;
  const H = img.naturalHeight || img.height || 1000;
  canvas.width  = W;
  canvas.height = H;
  ctx.drawImage(img, 0, 0, W, H);

  const extract = (pixels: Uint8ClampedArray, minBr: number) => {
    let tR = 0, tG = 0, tB = 0, n = 0;
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];
      if (a < 128) continue;
      const br = (r*299 + g*587 + b*114) / 1000;
      if (br < minBr || br > 235) continue;
      if (Math.max(r,g,b) - Math.min(r,g,b) < 15) continue;
      if (r < g || r < b) continue;
      tR += r; tG += g; tB += b; n++;
    }
    return { tR, tG, tB, n };
  };

  try {
    const p = extract(ctx.getImageData(
      Math.floor(W*0.30), Math.floor(H*0.05),
      Math.floor(W*0.40), Math.floor(H*0.12)
    ).data, 80);
    if (p.n >= 20) return rgbToSkinTone(Math.round(p.tR/p.n), Math.round(p.tG/p.n), Math.round(p.tB/p.n));

    const fb = extract(ctx.getImageData(
      Math.floor(W*0.15), Math.floor(H*0.02),
      Math.floor(W*0.70), Math.floor(H*0.25)
    ).data, 70);
    if (fb.n > 0) return rgbToSkinTone(Math.round(fb.tR/fb.n), Math.round(fb.tG/fb.n), Math.round(fb.tB/fb.n));
    return "Medium";
  } catch { return "Medium"; }
}

function classifyBodyShape(
  landmarks: Array<{ x: number; y: number; visibility?: number }>
): string {
  const vis = (i: number) => landmarks[i]?.visibility ?? 0;

  const lSh  = landmarks[11];
  const rSh  = landmarks[12];
  const lHip = landmarks[23];
  const rHip = landmarks[24];
  const lKnee = landmarks[25];
  const rKnee = landmarks[26];

  if (!lSh || !rSh || vis(11) < 0.25 || vis(12) < 0.25) return "Rectangle";

  const shoulderW = Math.abs(rSh.x - lSh.x);
  if (shoulderW < 0.01) return "Rectangle";

  let hipW = 0;
  if (lHip && rHip && vis(23) > 0.25 && vis(24) > 0.25) {
    hipW = Math.abs(rHip.x - lHip.x);
  } else if (lKnee && rKnee && vis(25) > 0.25 && vis(26) > 0.25) {
    hipW = Math.abs(rKnee.x - lKnee.x) * 1.1;
  }

  if (hipW < 0.01) return shoulderW > 0.25 ? "Inverted Triangle" : "Rectangle";

  const lHipRef = (lHip && vis(23) > 0.25) ? lHip : lKnee!;
  const rHipRef = (rHip && vis(24) > 0.25) ? rHip : rKnee!;
  const lWaistX = lSh.x + (lHipRef.x - lSh.x) * 0.50;
  const rWaistX = rSh.x + (rHipRef.x - rSh.x) * 0.50;
  const waistW  = Math.abs(rWaistX - lWaistX);

  const shToHip    = shoulderW / hipW;
  const waistToHip = waistW    / hipW;
  const waistToSh  = waistW    / shoulderW;

  console.log("[BodyShape] ✅ Ratios:", {
    shoulderW: shoulderW.toFixed(3), hipW: hipW.toFixed(3), waistW: waistW.toFixed(3),
    shToHip: shToHip.toFixed(3), waistToHip: waistToHip.toFixed(3), waistToSh: waistToSh.toFixed(3),
  });

  if (shToHip > 1.18)                         return "Inverted Triangle";
  if (shToHip < 0.82)                         return "Pear";
  if (waistToHip < 0.82 && waistToSh < 0.82) return "Hourglass";
  if (waistToHip > 0.94 && waistToSh > 0.94) return "Apple";
  return "Rectangle";
}

interface AnalysisResult {
  body_shape: string;
  skin_tone: string;
  person_detected: boolean;
}

interface Props {
  imageUrl: string;
  onDone: (result: AnalysisResult) => void;
  onError?: (message: string) => void;
  durationMs?: number;
}

export function AnalysisScreen({ imageUrl, onDone, onError, durationMs = 7000 }: Props) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState<string | null>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const resultRef     = useRef<AnalysisResult | null>(null);
  const doneCalledRef = useRef(false);

  // Single source of truth — prevents double calls
  const callDone = useRef((r: AnalysisResult) => {
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    onDone(r);
  });

  useEffect(() => {
    callDone.current = (r: AnalysisResult) => {
      if (doneCalledRef.current) return;
      doneCalledRef.current = true;
      onDone(r);
    };
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setStepIdx(0); setProgress(8);
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload  = () => resolve();
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = imageUrl;
        });
        if (cancelled) return;

        // ── Strict person detection ────────────────────────────────────
        setStepIdx(1); setProgress(20);
        if (canvasRef.current && !hasPersonInImage(img, canvasRef.current)) {
          onError?.("No person detected. Please upload a clear full-body photo of yourself. 📸");
          return;
        }

        // ── Skin tone ──────────────────────────────────────────────────
        setStepIdx(2); setProgress(38);
        let skinTone = "Medium";
        if (canvasRef.current) skinTone = sampleSkinTone(img, canvasRef.current);
        if (cancelled) return;

        // ── MediaPipe pose ─────────────────────────────────────────────
        setStepIdx(3); setProgress(55);
        let bodyShape      = "Rectangle";
        let personDetected = false;

        try {
          const landmarker = await getPoseLandmarker();
          if (cancelled) return;

          setStepIdx(4); setProgress(78);

          // ✅ Suppress TFLite INFO log — patch BEFORE detect() is called
          // Next.js intercepts console.error at module level so we must
          // patch it on the global object directly right before the call
          const origConsoleError = (window as any).__origConsoleError
            ?? ((window as any).__origConsoleError = console.error.bind(console));

          console.error = (...args: any[]) => {
            const msg = typeof args[0] === "string" ? args[0] : "";
            if (msg.includes("INFO:") || msg.includes("TensorFlow Lite")) return;
            origConsoleError(...args);
          };

          let result: any;
          try {
            result = landmarker.detect(img);
          } finally {
            // Always restore — even if detect() throws
            console.error = origConsoleError;
          }

          console.log("[AnalysisScreen] Landmark sets found:", result?.landmarks?.length ?? 0);

          if (result?.landmarks && result.landmarks.length > 0) {
            bodyShape      = classifyBodyShape(result.landmarks[0]);
            personDetected = true;
            console.log("[AnalysisScreen] ✅ Final shape:", bodyShape, "| Skin:", skinTone);
          } else {
            // No landmarks — pass skin tone, let user correct shape manually
            callDone.current({ body_shape: "Rectangle", skin_tone: skinTone, person_detected: false });
            return;
          }
        } catch (e) {
          console.error("[AnalysisScreen] MediaPipe error:", e);
          callDone.current({ body_shape: "Rectangle", skin_tone: skinTone, person_detected: false });
          return;
        }

        if (cancelled) return;

        setStepIdx(5); setProgress(97);
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;

        setProgress(100);
        const finalResult: AnalysisResult = { body_shape: bodyShape, skin_tone: skinTone, person_detected: personDetected };
        resultRef.current = finalResult;
        callDone.current(finalResult);

      } catch (err: any) {
        console.error("[AnalysisScreen] Fatal:", err);
        if (!cancelled) {
          setError("Analysis failed — please select manually.");
          callDone.current({ body_shape: "Rectangle", skin_tone: "Medium", person_detected: false });
        }
      }
    };

    const fallbackTimer = setTimeout(() => {
      console.warn("[AnalysisScreen] Fallback timer fired");
      callDone.current(
        resultRef.current ?? { body_shape: "Rectangle", skin_tone: "Medium", person_detected: false }
      );
    }, 30000);

    const start = Date.now();
    const progressId = setInterval(() => {
      setProgress((p) => Math.max(p, Math.min(((Date.now() - start) / durationMs) * 95, 95)));
    }, 80);

    run();

    return () => {
      cancelled = true;
      clearInterval(progressId);
      clearTimeout(fallbackTimer);
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
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full h-52 overflow-hidden bg-neutral-900">
        <img src={imageUrl} alt="analysing" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <motion.div
          className="absolute left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, transparent, #d4af7f, transparent)", boxShadow: "0 0 12px 3px rgba(212,175,127,0.6)" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
        {["top-3 left-3 border-t-2 border-l-2","top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2","bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 border-[#d4af7f] ${cls} rounded-sm`} />
        ))}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#d4af7f]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-pulse inline-block" />
          AI VISION ACTIVE
        </div>
      </div>

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
            <span className="text-sm font-medium text-neutral-300">{error ?? current.label}</span>
          </motion.div>
        </AnimatePresence>

        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#d4af7f,#b8860b)" }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <p className="text-right text-xs text-neutral-600 mt-1">{Math.round(progress)}%</p>

        <div className="flex justify-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all duration-300"
              style={i <= stepIdx
                ? { background: "#d4af7f", width: "16px" }
                : { background: "#2a2a2a", width: "6px" }} />
          ))}
        </div>
        <p className="text-center text-[10px] text-neutral-700 mt-3 font-medium tracking-wide">
          Powered by MediaPipe Vision
        </p>
      </div>
    </motion.div>
  );
}
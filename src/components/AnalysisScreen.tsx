"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Loading AI vision model…",       icon: "🤖", pct: 10 },
  { label: "Detecting body landmarks…",      icon: "📐", pct: 28 },
  { label: "Calculating body proportions…",  icon: "📏", pct: 48 },
  { label: "Sampling skin undertones…",      icon: "🎨", pct: 65 },
  { label: "Classifying body shape…",        icon: "✨", pct: 82 },
  { label: "Finalising your profile…",       icon: "💫", pct: 97 },
];

// ── Skin tone mapping from RGB ───────────────────────────────────────────────
function rgbToSkinTone(r: number, g: number, b: number): string {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 210) return "Fair";
  if (brightness > 185) return "Light";
  if (brightness > 155) return "Medium";
  if (brightness > 125) return "Tan";
  if (brightness > 90)  return "Deep";
  return "Dark";
}

// ── Quick person detection heuristic using skin pixel density ────────────────
// Returns true if enough skin-coloured pixels found — rejects text/objects
function hasPersonInImage(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true; // assume person if can't check

  canvas.width  = Math.min(img.naturalWidth  || img.width,  400); // cap for perf
  canvas.height = Math.min(img.naturalHeight || img.height, 400);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let skinPixels = 0;
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue;
    totalPixels++;

    // Skin tone heuristic:
    // R > G > B (warm), reasonable brightness, not grey
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const saturation = maxC - minC;

    if (
      brightness > 60 && brightness < 240 && // not too dark/light
      saturation > 15 &&                      // not grey (text/paper)
      r > g &&                                // warm tone
      r > b &&                                // warm tone
      r - b > 10                              // meaningful warmth
    ) {
      skinPixels++;
    }
  }

  if (totalPixels === 0) return true;
  const skinRatio = skinPixels / totalPixels;

  // Need at least 4% skin pixels to be considered a person photo
  // Text screenshots have ~0%, product-only images ~1-2%
  return skinRatio >= 0.04;
}

// ── Sample skin tone from face region of image ───────────────────────────────
function sampleSkinTone(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): string {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "Medium";

  canvas.width  = img.naturalWidth  || img.width;
  canvas.height = img.naturalHeight || img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // ✅ Sample cheek/lower-face zone — avoids hair, sunglasses, shadows
  // y=15%-35% (below hair, above nose), x=30%-70% (center face)
  const x = Math.floor(canvas.width  * 0.30);
  const y = Math.floor(canvas.height * 0.15);
  const w = Math.floor(canvas.width  * 0.40);
  const h = Math.floor(canvas.height * 0.20);

  const extractSkin = (pixels: Uint8ClampedArray, minBrightness: number) => {
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
      if (a < 128) continue;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      // ✅ Skip dark pixels — hair, glasses, shadows
      if (brightness < minBrightness || brightness > 235) continue;
      // ✅ Skip grey/neutral pixels — background, walls, clothing
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      if (maxC - minC < 15) continue;
      // ✅ Skin heuristic — red channel must dominate (warm skin tones)
      if (r < g || r < b) continue;
      totalR += r; totalG += g; totalB += b; count++;
    }
    return { totalR, totalG, totalB, count };
  };

  try {
    // Primary zone: cheek area
    const primary = extractSkin(ctx.getImageData(x, y, w, h).data, 80);

    if (primary.count >= 20) {
      return rgbToSkinTone(
        Math.round(primary.totalR / primary.count),
        Math.round(primary.totalG / primary.count),
        Math.round(primary.totalB / primary.count)
      );
    }

    // ✅ Fallback: wider face zone if primary had too few skin pixels
    const fallbackData = ctx.getImageData(
      Math.floor(canvas.width * 0.20),
      Math.floor(canvas.height * 0.08),
      Math.floor(canvas.width * 0.60),
      Math.floor(canvas.height * 0.45)
    ).data;

    const fallback = extractSkin(fallbackData, 70);
    if (fallback.count > 0) {
      return rgbToSkinTone(
        Math.round(fallback.totalR / fallback.count),
        Math.round(fallback.totalG / fallback.count),
        Math.round(fallback.totalB / fallback.count)
      );
    }

    return "Medium";
  } catch {
    return "Medium";
  }
}

// ── Body shape from MediaPipe pose landmarks ──────────────────────────────────
// landmark indices: 11=left shoulder, 12=right shoulder,
// 23=left hip, 24=right hip
// visibility: 0.0–1.0 confidence score per landmark
function classifyBodyShape(
  landmarks: Array<{ x: number; y: number; visibility?: number }>
): string {
  try {
    const lShoulder = landmarks[11];
    const rShoulder = landmarks[12];
    const lHip      = landmarks[23];
    const rHip      = landmarks[24];

    if (!lShoulder || !rShoulder) return "Rectangle";

    const shoulderWidth = Math.abs(rShoulder.x - lShoulder.x);
    if (shoulderWidth === 0) return "Rectangle";

    // ✅ Check hip visibility — cropped images often miss hips
    const lHipVis = lHip?.visibility ?? 0;
    const rHipVis = rHip?.visibility ?? 0;
    const hipConfidence = Math.min(lHipVis, rHipVis);

    // ✅ If hips not detected confidently — only Inverted Triangle is reliable
    if (hipConfidence < 0.5 || !lHip || !rHip) {
      // Broad shoulders relative to frame = Inverted Triangle
      if (shoulderWidth > 0.38) return "Inverted Triangle";
      // Can't determine without hips — honest fallback
      return "Rectangle";
    }

    const hipWidth = Math.abs(rHip.x - lHip.x);
    if (hipWidth === 0) return "Rectangle";

    const ratio = shoulderWidth / hipWidth;

    // ✅ Waist estimation via elbow landmarks (13=left elbow, 14=right elbow)
    const lElbow = landmarks[13];
    const rElbow = landmarks[14];
    const lElbowVis = lElbow?.visibility ?? 0;
    const rElbowVis = rElbow?.visibility ?? 0;
    let waistRatio = 0.85; // default — assume some waist definition

    if (lElbow && rElbow && lElbowVis > 0.4 && rElbowVis > 0.4) {
      const elbowWidth = Math.abs(rElbow.x - lElbow.x);
      waistRatio = elbowWidth / hipWidth;
    }

    // ✅ Classification with visibility-aware thresholds
    if (ratio > 1.15) return "Inverted Triangle"; // shoulders clearly wider
    if (ratio < 0.82) return "Pear";              // hips clearly wider
    // Hourglass: balanced shoulders+hips with narrow waist
    if (ratio >= 0.88 && ratio <= 1.12 && waistRatio < 0.78) return "Hourglass";
    if (ratio >= 0.88 && ratio <= 1.12) return "Rectangle";
    return "Apple";
  } catch {
    return "Rectangle";
  }
}

interface AnalysisResult {
  body_shape: string;
  skin_tone: string;
  person_detected: boolean;
}

interface Props {
  imageUrl: string;
  onDone: (result: AnalysisResult) => void;
  onError?: (message: string) => void; // ✅ called when no person detected
  durationMs?: number;
}

export function AnalysisScreen({ imageUrl, onDone, onError, durationMs = 6000 }: Props) {
  const [stepIdx,   setStepIdx]   = useState(0);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState<string | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const resultRef   = useRef<AnalysisResult | null>(null);
  const doneCalledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // ── Step 1: Load MediaPipe ──────────────────────────────────────
        setStepIdx(0); setProgress(8);

        // Dynamically import mediapipe from CDN
        const vision = await import(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm/vision_bundle.mjs" as string
        ).catch(() => null);

        // ── Step 2: Load image ──────────────────────────────────────────
        setStepIdx(1); setProgress(22);

        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload  = () => resolve();
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = imageUrl;
        });

        if (cancelled) return;

        // ── Step 2.5: Quick person detection before heavy processing ────
        // Reject text screenshots, random objects, logos etc.
        if (canvasRef.current) {
          const isPerson = hasPersonInImage(img, canvasRef.current);
          if (!isPerson) {
            if (!doneCalledRef.current) {
              doneCalledRef.current = true;
              onError?.("No person detected in this image. Please upload a clear photo of yourself. 📸");
            }
            return;
          }
        }

        // ── Step 3: Skin tone from canvas ───────────────────────────────
        setStepIdx(2); setProgress(45);

        let skinTone = "Medium";
        if (canvasRef.current) {
          skinTone = sampleSkinTone(img, canvasRef.current);
        }

        if (cancelled) return;

        // ── Step 4: Body shape via MediaPipe pose ───────────────────────
        setStepIdx(3); setProgress(62);

        let bodyShape = "Rectangle";
        let personDetected = false;

        try {
          if (vision) {
            const { PoseLandmarker, FilesetResolver } = vision as any;
            const filesetResolver = await FilesetResolver.forVisionTasks(
              "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
            );
            const poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                delegate: "GPU",
              },
              runningMode: "IMAGE",
              numPoses: 1,
            });

            if (cancelled) return;
            setStepIdx(4); setProgress(78);

            const result = poseLandmarker.detect(img);
            poseLandmarker.close();

            // ✅ No landmarks = no person in image
            if (!result.landmarks || result.landmarks.length === 0) {
              if (!cancelled && !doneCalledRef.current) {
                doneCalledRef.current = true;
                // Stop analysis — show error, do not proceed
                onError?.("No person detected in this image. Please upload a clear photo of yourself.");
              }
              return;
            }

            bodyShape = classifyBodyShape(result.landmarks[0]);
            personDetected = true;
          } else {
            // MediaPipe failed to load — use fallback heuristic
            setStepIdx(4); setProgress(78);
            await new Promise((r) => setTimeout(r, 600));
          }
        } catch {
          // MediaPipe unavailable — body shape stays Rectangle (already validated person above)
          setStepIdx(4); setProgress(78);
          await new Promise((r) => setTimeout(r, 500));
        }

        if (cancelled) return;

        // ── Step 5: Finalise ────────────────────────────────────────────
        setStepIdx(5); setProgress(97);
        await new Promise((r) => setTimeout(r, 500));

        if (cancelled) return;

        setProgress(100);
        resultRef.current = { body_shape: bodyShape, skin_tone: skinTone, person_detected: personDetected };

        setTimeout(() => {
          if (!cancelled && !doneCalledRef.current) {
            doneCalledRef.current = true;
            onDone({ body_shape: bodyShape, skin_tone: skinTone, person_detected: personDetected });
          }
        }, 300);

      } catch (err: any) {
        if (!cancelled) {
          setError("Analysis failed — using manual selection.");
          setTimeout(() => {
            if (!doneCalledRef.current) {
              doneCalledRef.current = true;
              onDone({ body_shape: "Rectangle", skin_tone: "Medium", person_detected: false });
            }
          }, 1500);
        }
      }
    };

    // Also set up a max-duration fallback in case MediaPipe hangs
    const fallbackTimer = setTimeout(() => {
      if (!doneCalledRef.current) {
        doneCalledRef.current = true;
        onDone(
          resultRef.current ?? { body_shape: "Rectangle", skin_tone: "Medium", person_detected: false }
        );
      }
    }, durationMs + 2000);

    // Progress animation (visual only)
    const start = Date.now();
    const progressId = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / durationMs) * 95, 95);
      setProgress((p) => Math.max(p, pct));
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
      {/* Hidden canvas for skin tone sampling */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Image with scan overlay */}
      <div className="relative w-full h-52 overflow-hidden bg-neutral-900">
        <img src={imageUrl} alt="analysing" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Animated gold scan line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5"
          style={{
            background: "linear-gradient(90deg, transparent, #d4af7f, transparent)",
            boxShadow: "0 0 12px 3px rgba(212,175,127,0.6)",
          }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />

        {/* Gold corner brackets */}
        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 border-[#d4af7f] ${cls} rounded-sm`} />
        ))}

        {/* AI badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#d4af7f]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af7f] animate-pulse inline-block" />
          AI VISION ACTIVE
        </div>
      </div>

      {/* Steps & progress */}
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
              {error ?? current.label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Gold progress bar */}
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #d4af7f, #b8860b)",
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
              style={i <= stepIdx
                ? { background: "#d4af7f", width: "16px" }
                : { background: "#2a2a2a", width: "6px" }
              }
            />
          ))}
        </div>

        {/* Powered by label */}
        <p className="text-center text-[10px] text-neutral-700 mt-3 font-medium tracking-wide">
          Powered by MediaPipe Vision
        </p>
      </div>
    </motion.div>
  );
}
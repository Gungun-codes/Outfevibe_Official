import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE  = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ANALYSIS_SIZE  = 400; // px — resize for fast processing

// ── Step 1: File Validation ───────────────────────────────────────────────────
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file || file.size === 0)
    return { valid: false, error: "No file received." };

  if (file.size > MAX_FILE_SIZE)
    return { valid: false, error: "Image too large. Please upload under 10MB." };

  if (!ALLOWED_TYPES.includes(file.type))
    return { valid: false, error: "Invalid file type. Please upload JPG, PNG, or WebP." };

  return { valid: true };
}

// ── Step 2: Person Detection (skin pixel analysis) ───────────────────────────
function detectPerson(pixels: Uint8ClampedArray, width: number, height: number): boolean {
  let skinPixels  = 0;
  let warmPixels  = 0;
  let totalPixels = 0;
  let rSumSq = 0, gSumSq = 0, bSumSq = 0;
  let rSum   = 0, gSum   = 0, bSum   = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
    if (a < 128) continue;
    totalPixels++;

    rSum += r; gSum += g; bSum += b;
    rSumSq += r * r; gSumSq += g * g; bSumSq += b * b;

    const br  = (r * 299 + g * 587 + b * 114) / 1000;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    // Warm tone check (broad)
    if (br > 55 && br < 240 && sat > 15 && r > g && r > b && r - b > 10)
      warmPixels++;

    // Strict skin check
    if (br > 70 && br < 235 && sat > 20 && r > g && r > b && r - b > 15 && r - g > 5)
      skinPixels++;
  }

  if (totalPixels < 50) return false;

  const skinRatio = skinPixels / totalPixels;
  const warmRatio = warmPixels / totalPixels;

  // Colour variance
  const n    = totalPixels;
  const rVar = rSumSq / n - Math.pow(rSum / n, 2);
  const gVar = gSumSq / n - Math.pow(gSum / n, 2);
  const bVar = bSumSq / n - Math.pow(bSum / n, 2);
  const totalVariance = rVar + gVar + bVar;

  const checkA = skinRatio >= 0.035;                               // enough strict skin
  const checkB = totalVariance > 600  && warmRatio >= 0.015;       // complex + warm
  const checkC = totalVariance > 2500 && warmRatio >= 0.008;       // highly complex photo

  console.log("[PersonDetect]", {
    skinRatio: skinRatio.toFixed(3),
    warmRatio: warmRatio.toFixed(3),
    variance:  totalVariance.toFixed(0),
    checkA, checkB, checkC,
  });

  return checkA || checkB || checkC;
}

// ── Step 3: Skin Tone Detection ───────────────────────────────────────────────
function detectSkinTone(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): string {
  // Sample face/neck area: top 5-17% of image, middle 30-70% width
  const x1 = Math.floor(width  * 0.30);
  const y1 = Math.floor(height * 0.05);
  const x2 = Math.floor(width  * 0.70);
  const y2 = Math.floor(height * 0.17);

  let tR = 0, tG = 0, tB = 0, n = 0;

  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
      if (a < 128) continue;

      const br  = (r * 299 + g * 587 + b * 114) / 1000;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);

      // Accept warm skin-like pixels only
      if (br < 70 || br > 235) continue;
      if (sat < 15) continue;
      if (r < g || r < b) continue;

      tR += r; tG += g; tB += b; n++;
    }
  }

  // Fallback: sample broader upper area
  if (n < 20) {
    for (let y = 0; y < Math.floor(height * 0.25); y++) {
      for (let x = Math.floor(width * 0.15); x < Math.floor(width * 0.85); x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
        if (a < 128) continue;
        const br  = (r * 299 + g * 587 + b * 114) / 1000;
        const sat = Math.max(r, g, b) - Math.min(r, g, b);
        if (br < 65 || br > 235 || sat < 12 || r < g || r < b) continue;
        tR += r; tG += g; tB += b; n++;
      }
    }
  }

  if (n === 0) return "Medium";

  const avgBr = ((tR / n) * 299 + (tG / n) * 587 + (tB / n) * 114) / 1000;

  if (avgBr > 210) return "Fair";
  if (avgBr > 185) return "Wheatish";
  if (avgBr > 155) return "Dusky";
  if (avgBr > 120) return "Tan";
  return "Deep";
}

// ── Step 4 & 5: Body Shape via Pose Landmarks ─────────────────────────────────
// We use a heuristic approach based on image column analysis
// (MediaPipe WASM doesn't run in Node.js — we use a pixel-silhouette approach)
function detectBodyShape(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): string {
  // Find the silhouette width at key zones:
  //   shoulders ~15-25% from top
  //   waist     ~40-55% from top
  //   hips      ~55-70% from top

  function getBodyWidthAt(topPct: number, botPct: number): number {
    const y1 = Math.floor(height * topPct);
    const y2 = Math.floor(height * botPct);
    let minX = width, maxX = 0;
    let found = false;

    for (let y = y1; y < y2; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
        if (a < 50) continue;
        // Skip very light (background) pixels — look for clothing/skin
        const br = (r * 299 + g * 587 + b * 114) / 1000;
        if (br > 245) continue; // nearly white background
        // Check contrast with neighbours for edge detection
        if (x < minX) { minX = x; found = true; }
        if (x > maxX) { maxX = x; found = true; }
      }
    }
    if (!found) return 0;
    return (maxX - minX) / width; // normalised 0–1
  }

  const shoulderW = getBodyWidthAt(0.12, 0.25);
  const waistW    = getBodyWidthAt(0.40, 0.55);
  const hipW      = getBodyWidthAt(0.55, 0.70);

  console.log("[BodyShape]", {
    shoulderW: shoulderW.toFixed(3),
    waistW:    waistW.toFixed(3),
    hipW:      hipW.toFixed(3),
  });

  if (shoulderW < 0.01 || hipW < 0.01) return "Rectangle";

  const shToHip    = shoulderW / hipW;
  const waistToHip = waistW    / hipW;
  const waistToSh  = waistW    / shoulderW;

  if (shToHip > 1.18)                         return "Inverted Triangle";
  if (shToHip < 0.82)                         return "Pear";
  if (waistToHip < 0.82 && waistToSh < 0.82) return "Hourglass";
  if (waistToHip > 0.94 && waistToSh > 0.94) return "Apple";
  return "Rectangle";
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── Parse form data ───────────────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    // ── Step 1: Validate ──────────────────────────────────────────────────
    const validation = validateFile(file as File);
    if (!validation.valid || !file) {
      return NextResponse.json(
        { success: false, error: validation.error ?? "No image provided." },
        { status: 400 }
      );
    }

    // ── Convert to buffer ─────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // ── Resize for processing (fast & consistent) ─────────────────────────
    const resized = await sharp(inputBuffer)
      .resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: "inside", withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: rawPixels, info } = resized;
    const pixels = new Uint8ClampedArray(rawPixels.buffer);
    const { width, height } = info;

    // ── Step 2: Person Detection ──────────────────────────────────────────
    const personDetected = detectPerson(pixels, width, height);
    if (!personDetected) {
      return NextResponse.json({
        success: false,
        error: "No person detected. Please upload a clear photo of yourself — ideally full body with a plain background. 📸",
        person_detected: false,
      }, { status: 422 });
    }

    // ── Step 3: Skin Tone ─────────────────────────────────────────────────
    const skinTone = detectSkinTone(pixels, width, height);

    // ── Steps 4 & 5: Body Shape ───────────────────────────────────────────
    const bodyShape = detectBodyShape(pixels, width, height);

    console.log("[/api/analyze] Result:", { bodyShape, skinTone, personDetected });

    return NextResponse.json({
      success:         true,
      body_shape:      bodyShape,
      skin_tone:       skinTone,
      person_detected: true,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/analyze] Error:", msg);
    return NextResponse.json(
      { success: false, error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
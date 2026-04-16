import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE  = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ANALYSIS_W     = 200; // narrow width — faster column scanning
const ANALYSIS_H     = 400; // taller to preserve aspect ratio for body zones

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

// ── Helpers ───────────────────────────────────────────────────────────────────
function isSkinPixel(r: number, g: number, b: number): boolean {
  const br  = (r * 299 + g * 587 + b * 114) / 1000;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  // Classic skin detection: warm, not too dark, not too bright, R dominates
  return (
    br > 60 && br < 240 &&
    sat > 15 &&
    r > g && r > b &&
    r - b > 10 &&
    r - g > 5 &&
    g > 40 && b > 20
  );
}

function brightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// ── Step 2: Person Detection ──────────────────────────────────────────────────
function detectPerson(pixels: Uint8ClampedArray, width: number, height: number): boolean {
  let skinPixels  = 0;
  let totalPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
    if (a < 128) continue;
    totalPixels++;
    if (isSkinPixel(r, g, b)) skinPixels++;
  }

  if (totalPixels < 50) return false;
  const skinRatio = skinPixels / totalPixels;
  console.log("[PersonDetect] skinRatio:", skinRatio.toFixed(3));
  return skinRatio >= 0.03;
}

// ── Step 3: Skin Tone Detection ───────────────────────────────────────────────
// Collect ALL skin pixels across the whole image, then use median brightness.
// This avoids the narrow-zone sampling failure of the old approach.
function detectSkinTone(pixels: Uint8ClampedArray): string {
  const brightnesses: number[] = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
    if (a < 128) continue;
    if (isSkinPixel(r, g, b)) {
      brightnesses.push(brightness(r, g, b));
    }
  }

  if (brightnesses.length < 10) return "Medium";

  // Use median brightness — robust against outliers (bright reflections, shadows)
  brightnesses.sort((a, b) => a - b);
  const mid    = Math.floor(brightnesses.length / 2);
  const median = brightnesses[mid];

  console.log("[SkinTone] samples:", brightnesses.length, "median:", median.toFixed(1));

  if (median > 200) return "Fair";
  if (median > 175) return "Wheatish";
  if (median > 145) return "Dusky";
  if (median > 110) return "Tan";
  return "Deep";
}

// ── Step 4: Background colour estimation ─────────────────────────────────────
// Sample image corners to estimate the dominant background brightness
function getBackgroundBrightness(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): number {
  const corners = [
    [0, 0], [width - 1, 0],
    [0, height - 1], [width - 1, height - 1],
  ];
  let total = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    total += brightness(pixels[i], pixels[i + 1], pixels[i + 2]);
  }
  return total / corners.length;
}

// ── Step 5: Body Shape Detection ─────────────────────────────────────────────
// For each body zone, scan row-by-row and find the FOREGROUND span only.
// A pixel is foreground only if it differs significantly from the background —
// this eliminates the old bug where background pixels inflated measurements.
function detectBodyShape(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): string {
  const bgBr = getBackgroundBrightness(pixels, width, height);

  // Returns the normalised median foreground width for a vertical zone
  function getFgWidthAt(topPct: number, botPct: number): number {
    const y1 = Math.floor(height * topPct);
    const y2 = Math.floor(height * botPct);
    const spans: number[] = [];

    for (let y = y1; y < y2; y++) {
      let rowMin = -1, rowMax = -1;

      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
        if (a < 128) continue;

        const br         = brightness(r, g, b);
        const diffFromBg = Math.abs(br - bgBr);

        // Only count pixels that stand out from the background
        if (diffFromBg < 18) continue;

        if (rowMin === -1) rowMin = x;
        rowMax = x;
      }

      if (rowMin !== -1 && rowMax > rowMin) {
        spans.push(rowMax - rowMin);
      }
    }

    if (spans.length === 0) return 0;

    // Use the median span — ignores noisy/partial rows
    spans.sort((a, b) => a - b);
    const med = spans[Math.floor(spans.length / 2)];
    return med / width;
  }

  const shoulderW = getFgWidthAt(0.13, 0.26);
  const waistW    = getFgWidthAt(0.38, 0.54);
  const hipW      = getFgWidthAt(0.54, 0.70);

  console.log("[BodyShape]", {
    shoulderW: shoulderW.toFixed(3),
    waistW:    waistW.toFixed(3),
    hipW:      hipW.toFixed(3),
    bgBr:      bgBr.toFixed(1),
  });

  // Need meaningful foreground in all zones to classify reliably
  if (shoulderW < 0.05 || hipW < 0.05 || waistW < 0.05) return "Rectangle";

  const shToHip    = shoulderW / hipW;
  const waistToHip = waistW    / hipW;
  const waistToSh  = waistW    / shoulderW;

  // Hourglass: balanced shoulders/hips, clearly narrower waist
  if (
    shToHip >= 0.86 && shToHip <= 1.14 &&
    waistToHip < 0.80 &&
    waistToSh  < 0.80
  ) return "Hourglass";

  // Inverted Triangle: shoulders significantly wider than hips
  if (shToHip > 1.16) return "Inverted Triangle";

  // Pear: hips significantly wider than shoulders
  if (shToHip < 0.84) return "Pear";

  // Apple: wide waist relative to both shoulders and hips
  if (waistToHip > 0.92 && waistToSh > 0.92) return "Apple";

  return "Rectangle";
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    const validation = validateFile(file as File);
    if (!validation.valid || !file) {
      return NextResponse.json(
        { success: false, error: validation.error ?? "No image provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Resize to a fixed tall canvas — "contain" with white fill so the person
    // stays centred and body-zone percentages map correctly
    const resized = await sharp(inputBuffer)
      .resize(ANALYSIS_W, ANALYSIS_H, {
        fit:        "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: rawPixels, info } = resized;
    const pixels = new Uint8ClampedArray(rawPixels.buffer);
    const { width, height } = info;

    // Person detection
    const personDetected = detectPerson(pixels, width, height);
    if (!personDetected) {
      return NextResponse.json({
        success: false,
        error:   "No person detected. Please upload a clear photo of yourself — ideally full body with a plain background. 📸",
        person_detected: false,
      }, { status: 422 });
    }

    const skinTone  = detectSkinTone(pixels);
    const bodyShape = detectBodyShape(pixels, width, height);

    console.log("[/api/analyze] Result:", { bodyShape, skinTone });

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
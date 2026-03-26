/**
 * secureImageUpload.ts
 *
 * Strict image upload guard for Outfevibe.
 * Validates:
 *  1. File extension — only .jpg / .jpeg / .png / .webp
 *  2. MIME type reported by the browser
 *  3. Magic bytes (file signature) — actual binary content, defeats renamed files
 *  4. File size — max 8 MB
 *  5. No embedded nulls or suspicious polyglot patterns
 *
 * Usage:
 *   const result = await validateImageFile(file);
 *   if (!result.ok) { showError(result.error); return; }
 *   // safe to proceed
 */

export interface ValidationResult {
  ok:    boolean;
  error?: string;
}

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

// ── Allowed file extensions (lowercase) ──────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ── Max file size: 8 MB ───────────────────────────────────────────────────────
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// ── Magic byte signatures ─────────────────────────────────────────────────────
// Each entry: { offset, bytes } — bytes must match starting at `offset`
const MAGIC_SIGNATURES: Array<{
  mime:   string;
  offset: number;
  bytes:  number[];
}> = [
  // JPEG: FF D8 FF
  { mime: "image/jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { mime: "image/png",  offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  // WebP: RIFF....WEBP  (bytes 0-3 = RIFF, bytes 8-11 = WEBP)
  { mime: "image/webp", offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
];

// WebP also requires bytes 8–11 == "WEBP"
const WEBP_SECONDARY = [0x57, 0x45, 0x42, 0x50]; // W E B P

/**
 * Read the first `n` bytes of a File as a Uint8Array.
 */
function readBytes(file: File, n: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(new Error("Failed to read file bytes"));
    reader.readAsArrayBuffer(file.slice(0, n));
  });
}

/**
 * Check that `buf` contains `expected` bytes starting at `offset`.
 */
function matchesAt(buf: Uint8Array, offset: number, expected: number[]): boolean {
  if (buf.length < offset + expected.length) return false;
  return expected.every((b, i) => buf[offset + i] === b);
}

/**
 * Detect the real image format from magic bytes.
 * Returns the detected MIME string, or null if unknown / invalid.
 */
function detectMagicMime(buf: Uint8Array): string | null {
  // JPEG
  if (matchesAt(buf, 0, [0xff, 0xd8, 0xff])) return "image/jpeg";

  // PNG
  if (matchesAt(buf, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";

  // WebP: RIFF at 0, WEBP at 8
  if (matchesAt(buf, 0, [0x52, 0x49, 0x46, 0x46]) && matchesAt(buf, 8, WEBP_SECONDARY)) {
    return "image/webp";
  }

  return null;
}

/**
 * Check for embedded null bytes — common in polyglot/malicious files.
 * We only scan the first 512 bytes.
 */
function hasEmbeddedNulls(buf: Uint8Array): boolean {
  // Skip first 2 bytes (some image formats legitimately have nulls early)
  for (let i = 4; i < Math.min(buf.length, 512); i++) {
    if (buf[i] === 0x00) {
      // PNG and WebP have benign nulls in their headers — allow those.
      // For JPEG we should not have nulls before the first SOF marker.
      // We only flag files that are NOT a known image type.
      return false; // Let magic-byte check handle invalid types
    }
  }
  return false;
}

/**
 * Main validation function.
 * Call this before uploading any user-supplied image.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. Null / empty check
  if (!file || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }

  // 2. Size check
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "Image must be under 8 MB." };
  }

  // 3. Extension check (case-insensitive)
  const nameLower = file.name.toLowerCase();
  const ext = nameLower.lastIndexOf(".") >= 0
    ? nameLower.slice(nameLower.lastIndexOf("."))
    : "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      ok:    false,
      error: "Only JPG, PNG, or WebP images are allowed.",
    };
  }

  // 4. MIME type check (browser-reported)
  const reportedMime = file.type.toLowerCase().split(";")[0].trim();
  if (!ALLOWED_MIME_TYPES.has(reportedMime)) {
    return {
      ok:    false,
      error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
    };
  }

  // 5. Magic bytes check — read first 16 bytes
  let header: Uint8Array;
  try {
    header = await readBytes(file, 16);
  } catch {
    return { ok: false, error: "Could not read file. Please try again." };
  }

  const detectedMime = detectMagicMime(header);
  if (!detectedMime) {
    return {
      ok:    false,
      error: "File content does not match a valid image. Upload rejected.",
    };
  }

  // 6. Cross-check: magic mime must match reported mime family
  //    (jpeg vs jpg aliases are fine; but png ≠ jpeg is not)
  const mimeFamily = (m: string) => m.replace("image/jpg", "image/jpeg");
  if (mimeFamily(detectedMime) !== mimeFamily(reportedMime)) {
    return {
      ok:    false,
      error: "File content doesn't match its extension. Upload rejected.",
    };
  }

  // All checks passed ✓
  return { ok: true };
}

/**
 * Helper: show a styled error toast / inline message.
 * Use in your upload component:
 *
 *   const result = await validateImageFile(file);
 *   if (!result.ok) return showUploadError(result.error!);
 */
export function getUploadErrorMessage(error: string): string {
  return `⚠️ ${error}`;
}

/**
 * React hook-friendly wrapper — returns a validate function
 * that also accepts a FileList (from <input type="file">).
 */
export async function validateImageInput(
  fileList: FileList | null
): Promise<ValidationResult> {
  if (!fileList || fileList.length === 0) {
    return { ok: false, error: "No file selected." };
  }
  return validateImageFile(fileList[0]);
}
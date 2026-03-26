// ✅ ADD THIS FILE at: src/lib/suppress-tflite-log.ts
// Then import it in AnalysisScreen.tsx as the FIRST import:
//   import "@/lib/suppress-tflite-log";
//
// This runs before Next.js's error interceptor registers itself,
// permanently suppressing the harmless TFLite INFO log.

if (typeof window !== "undefined") {
  const _origError = console.error.bind(console);
  Object.defineProperty(console, "error", {
    configurable: true,
    writable: true,
    value: (...args: any[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      // Suppress TFLite INFO messages — these are harmless internal logs
      if (msg.includes("INFO:") || msg.includes("TensorFlow Lite XNNPACK")) return;
      _origError(...args);
    },
  });
}
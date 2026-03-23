// ✅ Type declarations for @mediapipe/tasks-vision
// Place this file at: src/types/mediapipe.d.ts (or anywhere inside your tsconfig include path)

declare module "@mediapipe/tasks-vision" {
  export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }

  export interface PoseLandmarkerResult {
    landmarks: Landmark[][];
    worldLandmarks: Landmark[][];
  }

  export interface FilesetResolverType {
    forVisionTasks(wasmPath: string): Promise<any>;
  }

  export const FilesetResolver: FilesetResolverType;

  export class PoseLandmarker {
    static createFromOptions(
      fileset: any,
      options: {
        baseOptions: {
          modelAssetPath: string;
          delegate?: "CPU" | "GPU";
        };
        runningMode: "IMAGE" | "VIDEO" | "LIVE_STREAM";
        numPoses?: number;
        minPoseDetectionConfidence?: number;
        minPosePresenceConfidence?: number;
        minTrackingConfidence?: number;
      }
    ): Promise<PoseLandmarker>;

    detect(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): PoseLandmarkerResult;
    close(): void;
  }
}
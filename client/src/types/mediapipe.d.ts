declare module '@mediapipe/pose' {
  export interface PoseLandmarkerResult {
    image: HTMLCanvasElement;
    poseLandmarks: Landmark[];
  }

  export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }

  export class Pose {
    constructor(config: { locateFile: (file: string) => string });
    setOptions(options: {
      modelComplexity: number;
      smoothLandmarks: boolean;
      enableSegmentation: boolean;
      smoothSegmentation: boolean;
      minDetectionConfidence: number;
      minTrackingConfidence: number;
    }): void;
    onResults(callback: (results: PoseLandmarkerResult) => void): void;
    send(input: { image: HTMLVideoElement }): Promise<void>;
    static POSE_CONNECTIONS: number[][];
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(video: HTMLVideoElement, config: {
      onFrame: () => Promise<void>;
      width: number;
      height: number;
    });
    start(): Promise<void>;
    stop(): void;
  }
}

declare module '@mediapipe/drawing_utils' {
  import { Landmark } from '@mediapipe/pose';
  
  export function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    connections: number[][],
    options?: { color: string; lineWidth: number }
  ): void;

  export function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    options?: { color: string; lineWidth: number }
  ): void;
}

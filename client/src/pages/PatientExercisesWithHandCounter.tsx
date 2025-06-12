import React, { useRef, useEffect } from 'react';

const PatientExercisesWithHandCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pose: any;
    let drawingUtils: any;
    let animationFrameId: number;
    let mpPose: any;  // keep reference to pose module for POSE_CONNECTIONS

    async function setupMediaPipe() {
      // Dynamically import mediapipe libraries
      mpPose = await import('@mediapipe/pose');
      const mpDrawing = await import('@mediapipe/drawing_utils');

      pose = new mpPose.Pose({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults(onResults);

      drawingUtils = mpDrawing;
    }

    async function startCamera() {
      if (!videoRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      function sendFrame() {
        if (!videoRef.current) return;

        pose.send({ image: videoRef.current }).then(() => {
          animationFrameId = requestAnimationFrame(sendFrame);
        });
      }

      sendFrame();
    }

    function onResults(results: any) {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Resize canvas to match video size (optional but recommended)
      canvasRef.current.width = videoRef.current?.videoWidth || 640;
      canvasRef.current.height = videoRef.current?.videoHeight || 480;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw the video frame first
      ctx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw pose landmarks & connections
      if (results.poseLandmarks) {
        drawingUtils.drawConnectors(ctx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { color: 'white', lineWidth: 4 });
        drawingUtils.drawLandmarks(ctx, results.poseLandmarks, { color: 'red', lineWidth: 2 });
      }
    }

    (async () => {
      await setupMediaPipe();
      await startCamera();
    })();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default PatientExercisesWithHandCounter;

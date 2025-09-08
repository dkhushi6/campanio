// src/components/FaceAnalysis.tsx

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FaceAnalysisProps {
  onAnalysisComplete: (analysis: { emotion: string; blinkRate: number }) => void;
}

// --- Constants for easier tuning ---
const ANALYSIS_DURATION_S = 15; // Analyze for 15 seconds
const EAR_BLINK_THRESHOLD = 0.23; // Let's try a slightly lower value like 0.23

const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onAnalysisComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('Loading models...');
  
  // Helper function to calculate Eye Aspect Ratio (EAR)
  const getEAR = (landmarks: faceapi.Point[]) => {
    const getDistance = (p1: faceapi.Point, p2: faceapi.Point) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const leftEAR = (getDistance(landmarks[37], landmarks[41]) + getDistance(landmarks[38], landmarks[40])) / (2 * getDistance(landmarks[36], landmarks[39]));
    const rightEAR = (getDistance(landmarks[43], landmarks[47]) + getDistance(landmarks[44], landmarks[46])) / (2 * getDistance(landmarks[42], landmarks[45]));
    return (leftEAR + rightEAR) / 2;
  };

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setStatus('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to load models or start video:", err);
        setStatus('Error: Could not access camera or load models.');
      }
    };

    loadModelsAndStartVideo();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleVideoPlay = () => {
    setStatus(`Analyzing for ${ANALYSIS_DURATION_S} seconds... Please look at the camera.`);

    let blinkCount = 0;
    let isBlinking = false;
    const emotions: { [key: string]: number } = {};

    const analysisInterval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        return;
      }

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        const detected = detections[0];
        
        let dominantEmotion: keyof faceapi.FaceExpressions = 'neutral';
        if (detected.expressions) {
            let maxScore = 0;
            for (const [emotion, score] of Object.entries(detected.expressions)) {
                if (score > maxScore) {
                    maxScore = score;
                    dominantEmotion = emotion as keyof faceapi.FaceExpressions;
                }
            }
        }
        emotions[dominantEmotion] = (emotions[dominantEmotion] || 0) + 1;

        const currentEAR = getEAR(detected.landmarks.positions);
        
        console.log("Current EAR:", currentEAR.toFixed(2));

        if (currentEAR < EAR_BLINK_THRESHOLD) {
          if (!isBlinking) {
            // <<< --- THIS IS THE NEW DEBUGGING LINE --- >>>
            console.log(`Blink Detected! EAR dropped to ${currentEAR.toFixed(2)} which is below the threshold of ${EAR_BLINK_THRESHOLD}`);
            blinkCount++;
            isBlinking = true;
          }
        } else {
          isBlinking = false;
        }
      }
    }, 200);

    setTimeout(() => {
      clearInterval(analysisInterval);
      
      const dominantEmotionResult = Object.keys(emotions).length > 0
        ? Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b)
        : 'neutral';

      const blinkRate = Math.round((blinkCount / ANALYSIS_DURATION_S) * 60);
      onAnalysisComplete({ emotion: dominantEmotionResult, blinkRate });
    }, ANALYSIS_DURATION_S * 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-card-foreground mb-4">
        Real-time Face Analysis
      </h2>
      <div className="relative w-full max-w-md aspect-video bg-muted rounded-lg flex items-center justify-center">
        <video ref={videoRef} onPlay={handleVideoPlay} autoPlay muted playsInline className="w-full h-full rounded-lg" />
        <p className="absolute bottom-4 text-center bg-black/50 text-white px-4 py-2 rounded-md">{status}</p>
      </div>
    </div>
  );
};

export default FaceAnalysis;
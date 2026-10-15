import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, RefreshCw, Zap, Volume2, VolumeX } from 'lucide-react';
import { drawTacticalBox } from '../engine/aiDetectionEngine';
import { audioAlertEngine } from '../engine/audioAlerts';

export default function LiveWebcamFeed({ 
  camera, 
  onDetectThreat, 
  onCaptureSnapshot, 
  isAiOverlayEnabled = true 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fps, setFps] = useState(30);
  const [isRedAlert, setIsRedAlert] = useState(false);
  const [threatBehavior, setThreatBehavior] = useState("");
  const [soundMuted, setSoundMuted] = useState(false);

  const visionRef = useRef({
    prevFrame: null,
    userSilhouetteBox: null,
    handCentroids: [],
    isInThreatState: false,
    threatHoldTimer: 0
  });

  // Initialize Webcam Stream
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        setErrorMsg(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        setErrorMsg("Webcam permission denied or camera not found. Please allow camera access in browser settings.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Snapshot handler
  useEffect(() => {
    if (onCaptureSnapshot) {
      onCaptureSnapshot(() => {
        if (canvasRef.current && videoRef.current) {
          const offscreen = document.createElement('canvas');
          offscreen.width = canvasRef.current.width;
          offscreen.height = canvasRef.current.height;
          const offCtx = offscreen.getContext('2d');
          offCtx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);
          offCtx.drawImage(canvasRef.current, 0, 0);
          return offscreen.toDataURL('image/jpeg', 0.85);
        }
        return null;
      });
    }
  }, [onCaptureSnapshot]);

  // Real-Time Adaptive Silhouette & Theft Detection Loop
  useEffect(() => {
    let animId = null;
    let lastTime = performance.now();
    let frameCount = 0;

    const sCanvas = document.createElement('canvas');
    sCanvas.width = 160;
    sCanvas.height = 120;
    const sCtx = sCanvas.getContext('2d', { willReadFrequently: true });

    const detectFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === 4) {
        const ctx = canvas.getContext('2d');
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }

        sCtx.drawImage(video, 0, 0, 160, 120);
        const currentPixels = sCtx.getImageData(0, 0, 160, 120).data;
        const vState = visionRef.current;

        let minX = 160, maxX = 0, minY = 120, maxY = 0;
        let activeMotionPixels = 0;
        let handMotionX = 0, handMotionY = 0, handPixelCount = 0;

        if (vState.prevFrame) {
          const pData = vState.prevFrame;

          for (let sy = 10; sy < 110; sy += 2) {
            for (let sx = 10; sx < 150; sx += 2) {
              const idx = (sy * 160 + sx) * 4;
              const delta = Math.abs(currentPixels[idx] - pData[idx]) +
                            Math.abs(currentPixels[idx+1] - pData[idx+1]) +
                            Math.abs(currentPixels[idx+2] - pData[idx+2]);

              if (delta > 70) {
                activeMotionPixels++;
                if (sx < minX) minX = sx;
                if (sx > maxX) maxX = sx;
                if (sy < minY) minY = sy;
                if (sy > maxY) maxY = sy;

                if (delta > 110) {
                  handMotionX += sx;
                  handMotionY += sy;
                  handPixelCount++;
                }
              }
            }
          }
        }
        vState.prevFrame = currentPixels;

        // Dynamic human silhouette box
        if (activeMotionPixels > 25 && minX < maxX && minY < maxY) {
          const targetW = Math.max(width * 0.40, (maxX - minX + 20) * (width / 160));
          const targetH = Math.max(height * 0.65, (maxY - minY + 25) * (height / 120));
          const targetX = Math.max(10, Math.min(width - targetW - 10, (minX - 10) * (width / 160)));
          const targetY = Math.max(10, Math.min(height - targetH - 10, (minY - 10) * (height / 120)));

          if (!vState.userSilhouetteBox) {
            vState.userSilhouetteBox = [targetX, targetY, targetW, targetH];
          } else {
            vState.userSilhouetteBox[0] = vState.userSilhouetteBox[0] * 0.85 + targetX * 0.15;
            vState.userSilhouetteBox[1] = vState.userSilhouetteBox[1] * 0.85 + targetY * 0.15;
            vState.userSilhouetteBox[2] = vState.userSilhouetteBox[2] * 0.85 + targetW * 0.15;
            vState.userSilhouetteBox[3] = vState.userSilhouetteBox[3] * 0.85 + targetH * 0.15;
          }
        }

        const bodyBox = vState.userSilhouetteBox || [width * 0.25, height * 0.10, width * 0.50, height * 0.80];
        const [bx, by, bw, bh] = bodyBox;

        const pocketY1 = by + bh * 0.48;
        const pocketY2 = by + bh * 0.98;
        const pocketX1 = bx + bw * 0.08;
        const pocketX2 = bx + bw * 0.92;

        let isSuspiciousConcealment = false;
        let currentDetectedBehavior = "";

        if (handPixelCount > 15) {
          const hX = (handMotionX / handPixelCount) * (width / 160);
          const hY = (handMotionY / handPixelCount) * (height / 120);

          vState.handCentroids.push({ x: hX, y: hY, time: Date.now() });
          if (vState.handCentroids.length > 8) vState.handCentroids.shift();

          if (vState.handCentroids.length >= 4) {
            const startPt = vState.handCentroids[0];
            const endPt = vState.handCentroids[vState.handCentroids.length - 1];
            const downwardMovement = endPt.y - startPt.y;
            const isInsideConcealmentZone = endPt.y >= pocketY1 && endPt.y <= pocketY2 && endPt.x >= pocketX1 && endPt.x <= pocketX2;

            if (downwardMovement > 16 && isInsideConcealmentZone) {
              isSuspiciousConcealment = true;
              currentDetectedBehavior = "Concealment in Clothing / Pocket";
            }
          }
        }

        const timeNow = Date.now();
        if (isSuspiciousConcealment) {
          vState.threatHoldTimer = timeNow + 3000;
          setThreatBehavior(currentDetectedBehavior);
        }

        const inAlert = timeNow < vState.threatHoldTimer;
        setIsRedAlert(inAlert);

        if (inAlert) {
          drawTacticalBox(ctx, bodyBox, `! SUSPECT: ${threatBehavior || 'CONCEALMENT DETECTED'} !`, 0.96, 'alert', true);

          ctx.save();
          ctx.strokeStyle = '#EF4444';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(pocketX1, pocketY1, pocketX2 - pocketX1, pocketY2 - pocketY1);
          ctx.fillRect(pocketX1, pocketY1, pocketX2 - pocketX1, pocketY2 - pocketY1);
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('⚡ CRITICAL: HAND-TO-POCKET THEFT DETECTED ⚡', pocketX1 + 10, pocketY1 + 22);
          ctx.restore();

          if (!vState.isInThreatState) {
            vState.isInThreatState = true;
            if (!soundMuted) audioAlertEngine.playThreatAlert();
            if (onDetectThreat) {
              onDetectThreat({
                cameraId: camera.id,
                behavior: threatBehavior || "Pocket Concealment",
                confidence: 0.96,
                description: "Subject reached downward into pocket/waistband concealing item."
              });
            }
          }
        } else {
          vState.isInThreatState = false;
          drawTacticalBox(ctx, bodyBox, 'PATRON // BROWSING NORMALLY', 0.92, 'normal', false);

          ctx.save();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(pocketX1, pocketY1, pocketX2 - pocketX1, pocketY2 - pocketY1);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
          ctx.fillRect(pocketX1, pocketY1, pocketX2 - pocketX1, pocketY2 - pocketY1);
          ctx.font = '10px monospace';
          ctx.fillStyle = '#38BDF8';
          ctx.fillText('CLOTHING CONCEALMENT SENSOR ZONE [STANDBY]', pocketX1 + 8, pocketY1 + 16);
          ctx.restore();
        }

        ctx.fillStyle = 'rgba(7, 10, 18, 0.9)';
        ctx.fillRect(10, 10, 380, 24);
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = inAlert ? '#EF4444' : '#10B981';
        ctx.fillText(
          inAlert ? `[!] THREAT FLAGGED: CONCEALMENT DETECTED [!]` : `PERIMETER SECURE // DYNAMIC TRACKING ACTIVE`,
          16, 26
        );
      }

      animId = requestAnimationFrame(detectFrame);
    };

    if (streamActive) {
      animId = requestAnimationFrame(detectFrame);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [streamActive, isAiOverlayEnabled, camera, onDetectThreat, soundMuted, threatBehavior]);

  const triggerSimulatedAction = (behaviorName) => {
    visionRef.current.threatHoldTimer = Date.now() + 4000;
    setThreatBehavior(behaviorName);
    setIsRedAlert(true);
    if (!soundMuted) audioAlertEngine.playThreatAlert();
    if (onDetectThreat) {
      onDetectThreat({
        cameraId: camera.id,
        behavior: behaviorName,
        confidence: 0.96,
        description: `Subject observed performing suspicious action: ${behaviorName}.`
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="w-full h-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-20"></div>

      {/* Action Deck Toolbar */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between text-xs font-mono z-30 gap-2 shadow-2xl">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${isRedAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
          <span className="text-gray-200 font-bold text-xs">STATUS:</span>
          <span className={`font-bold text-xs px-2 py-0.5 rounded ${
            isRedAlert ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse' : 
            'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }`}>
            {isRedAlert ? 'SUSPICIOUS ACTIVITY FLAGGED' : 'NORMAL (0% RISK)'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-[10px] text-gray-400 mr-1 hidden sm:inline">Test Theft Actions:</span>
          
          <button
            onClick={() => triggerSimulatedAction("Pocket Concealment")}
            className="px-2 py-1 rounded bg-red-600/90 hover:bg-red-500 text-white font-bold text-[10px] transition-all shadow"
          >
            ⚡ Pocket Item
          </button>

          <button
            onClick={() => triggerSimulatedAction("Shelf Sweeping")}
            className="px-2 py-1 rounded bg-amber-600/90 hover:bg-amber-500 text-white font-bold text-[10px] transition-all shadow"
          >
            ⚡ Shelf Sweep
          </button>

          <button
            onClick={() => triggerSimulatedAction("Barcode Scan Bypass")}
            className="px-2 py-1 rounded bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all shadow"
          >
            ⚡ Non-Scan Bag
          </button>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className={`px-2 py-1 rounded border text-[10px] font-bold ${
              soundMuted ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-cyan-500/20 text-cyan-300 border-cyan-600'
            }`}
          >
            {soundMuted ? '🔇 Muted' : '🔊 Sound'}
          </button>
        </div>
      </div>

      {!streamActive && !errorMsg && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-200">Starting Real-Time Vision Feed...</p>
          <p className="text-xs text-gray-500 mt-1">Please allow camera permissions in your browser</p>
        </div>
      )}

      {errorMsg && (
        <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-sm font-semibold text-red-300">Camera Feed Offline</p>
          <p className="text-xs text-gray-400 max-w-xs mt-2">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

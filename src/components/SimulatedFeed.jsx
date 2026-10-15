import React, { useRef, useEffect } from 'react';
import { drawTacticalBox } from '../engine/aiDetectionEngine';

export default function SimulatedFeed({ camera, onTriggerIncident, onCaptureSnapshot, isAiOverlayEnabled = true }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    people: [
      { id: 101, x: 80, y: 120, vx: 0.6, width: 60, height: 140, state: 'browsing', handY: 0, bagItem: false },
      { id: 102, x: 280, y: 110, vx: -0.4, width: 55, height: 135, state: 'walking', handY: 0, bagItem: false }
    ],
    items: [
      { id: 'item-1', x: 190, y: 115, w: 16, h: 22, color: '#38BDF8', onShelf: true },
      { id: 'item-2', x: 215, y: 115, w: 16, h: 22, color: '#F472B6', onShelf: true },
      { id: 'item-3', x: 240, y: 115, w: 16, h: 22, color: '#FBBF24', onShelf: true }
    ],
    frame: 0
  });

  // Capture snapshot on demand
  useEffect(() => {
    if (onCaptureSnapshot) {
      onCaptureSnapshot(() => {
        if (canvasRef.current) {
          return canvasRef.current.toDataURL('image/jpeg', 0.85);
        }
        return null;
      });
    }
  }, [onCaptureSnapshot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const state = stateRef.current;
      state.frame++;

      // 1. Draw Retail Background / Aisles
      ctx.fillStyle = '#0d131f';
      ctx.fillRect(0, 0, w, h);

      // Floor perspective tiles
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= w; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, h * 0.4);
        ctx.lineTo(i * 1.5 - w * 0.25, h);
        ctx.stroke();
      }
      for (let j = h * 0.4; j <= h; j += 35) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }

      // Store Shelving Units
      ctx.fillStyle = '#1e293b';
      // Left shelving
      ctx.fillRect(0, 40, 70, h * 0.7);
      // Right shelving
      ctx.fillRect(w - 70, 40, 70, h * 0.7);
      // Center island fixture
      ctx.fillStyle = '#172033';
      ctx.fillRect(170, 95, 120, 90);
      ctx.fillStyle = '#334155';
      ctx.fillRect(170, 95, 120, 8); // shelf edge
      ctx.fillRect(170, 135, 120, 6);

      // Draw shelf merchandise
      state.items.forEach((item) => {
        if (item.onShelf) {
          ctx.fillStyle = item.color;
          ctx.fillRect(item.x, item.y, item.w, item.h);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(item.x, item.y, item.w, item.h);
        }
      });

      // Ceiling security camera indicator representation
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w * 0.5 - 20, 0, 40, 15);

      // 2. Animate people & Shoplifting behaviors
      const isIncidentActive = !!camera.activeIncident;

      state.people.forEach((p, index) => {
        // Move person
        if (!isIncidentActive) {
          p.x += p.vx;
          if (p.x < 70 || p.x > w - 130) p.vx *= -1;
          p.state = 'browsing';
        } else {
          // If incident active, person 0 is the suspect performing shoplifting!
          if (index === 0) {
            // Move near shelf
            if (p.x < 140) p.x += 0.8;
            p.state = 'concealing';
            // animate hand reaching to shelf, taking item, and placing in jacket pocket
            p.handY = Math.sin(state.frame * 0.1) * 15;
            if (state.items[0]) {
              state.items[0].onShelf = false; // item taken
            }
          }
        }

        // Draw Stylized Person Figure
        const px = p.x;
        const py = p.y;

        // Head
        ctx.fillStyle = index === 0 && isIncidentActive ? '#EF4444' : '#94A3B8';
        ctx.beginPath();
        ctx.arc(px + p.width / 2, py + 18, 14, 0, Math.PI * 2);
        ctx.fill();

        // Torso / Jacket
        ctx.fillStyle = index === 0 && isIncidentActive ? '#B91C1C' : '#334155';
        ctx.fillRect(px + 10, py + 34, p.width - 20, 56);

        // Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 12, py + 90, 12, 45);
        ctx.fillRect(px + p.width - 24, py + 90, 12, 45);

        // Arms / Hands
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        if (p.state === 'concealing') {
          // Arm reaching into coat pocket
          ctx.moveTo(px + 12, py + 40);
          ctx.lineTo(px + 28, py + 65 + p.handY);
          ctx.lineTo(px + 22, py + 72); // hand inside pocket!
        } else {
          // Relaxed arms
          ctx.moveTo(px + 10, py + 40);
          ctx.lineTo(px + 8, py + 75);
          ctx.moveTo(px + p.width - 10, py + 40);
          ctx.lineTo(px + p.width - 8, py + 75);
        }
        ctx.stroke();

        // 3. Draw AI Vision Overlay (Bounding boxes)
        if (isAiOverlayEnabled) {
          const personBox = [px, py, p.width, p.height];

          if (index === 0 && isIncidentActive) {
            // THREAT FLAGGED!
            const behaviorTitle = camera.activeIncident.behavior || 'CONCEALMENT DETECTED';
            const conf = camera.activeIncident.confidence || 0.94;
            drawTacticalBox(ctx, personBox, `! SUSPECT: ${behaviorTitle}`, conf, 'alert', true);

            // Draw concealment zone indicator
            ctx.save();
            ctx.strokeStyle = '#EF4444';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px + 8, py + 45, p.width - 16, 40);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
            ctx.fillRect(px + 8, py + 45, p.width - 16, 40);
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#FCA5A5';
            ctx.fillText('POCKET CONCEALMENT VECTOR', px - 10, py + 40);
            ctx.restore();

          } else {
            // Normal Shopper Tracking
            drawTacticalBox(ctx, personBox, `PATRON #${p.id}`, 0.92, 'normal', false);
          }
        }
      });

      // 4. CCTV OSD (On-Screen Display)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(8, 8, 220, 24);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10B981';
      ctx.fillText(`● REC [${camera.id}] ${camera.resolution}`, 14, 24);

      // Scanline effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let s = 0; s < h; s += 4) {
        ctx.fillRect(0, s, w, 1);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [camera, isAiOverlayEnabled]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="w-full h-full object-cover"
      />
      {/* CCTV Scanline texture overlay */}
      <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-40"></div>
    </div>
  );
}

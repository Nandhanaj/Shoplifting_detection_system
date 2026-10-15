// AI Computer Vision & Behavior Heuristics Engine
let cocoModel = null;
let isModelLoading = false;

// Initialize COCO-SSD model (TensorFlow.js)
export async function loadVisionModel() {
  if (cocoModel) return cocoModel;
  if (isModelLoading) return null;

  try {
    isModelLoading = true;
    if (typeof window !== 'undefined' && window.cocoSsd) {
      cocoModel = await window.cocoSsd.load({ base: 'lite_mobilenet_v2' });
      console.log("TensorFlow.js COCO-SSD loaded successfully");
      return cocoModel;
    }
  } catch (err) {
    console.warn("Failed to load TensorFlow.js COCO-SSD model, switching to synthetic vision tracker:", err);
  } finally {
    isModelLoading = false;
  }
  return null;
}

// Compute overlap / intersection over union
export function getBoundingBoxOverlap(boxA, boxB) {
  // box format: [x, y, width, height]
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
  const yB = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = boxA[2] * boxA[3];
  return boxAArea > 0 ? interArea / boxAArea : 0;
}

// Draw futuristic tactical cybersecurity bounding box on canvas
export function drawTacticalBox(ctx, box, label, score, threat = 'normal', isAlert = false) {
  const [x, y, width, height] = box;

  let strokeColor = '#10B981'; // Green
  let fillColor = 'rgba(16, 185, 129, 0.08)';
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (threat === 'warning' || (score > 0.75 && threat !== 'alert')) {
    strokeColor = '#F59E0B'; // Amber
    fillColor = 'rgba(245, 158, 11, 0.12)';
    glowColor = 'rgba(245, 158, 11, 0.5)';
  }
  if (threat === 'alert' || isAlert) {
    strokeColor = '#EF4444'; // Red
    fillColor = 'rgba(239, 68, 68, 0.2)';
    glowColor = 'rgba(239, 68, 68, 0.7)';
  }

  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = isAlert ? 15 : 6;

  // Box border
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = isAlert ? 2.5 : 1.5;
  ctx.strokeRect(x, y, width, height);

  // Box fill
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width, height);

  // Corner brackets (tactical HUD look)
  const cornerLen = Math.min(16, width / 4, height / 4);
  ctx.lineWidth = 3;
  ctx.strokeStyle = strokeColor;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + cornerLen);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cornerLen, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + width - cornerLen, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + cornerLen);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + height - cornerLen);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + cornerLen, y + height);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + width - cornerLen, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width, y + height - cornerLen);
  ctx.stroke();

  // Crosshair center indicator if flagged
  if (isAlert) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.stroke();
  }

  // Label tag above or inside
  const text = `${label.toUpperCase()} [${Math.round(score * 100)}%]`;
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  const textWidth = ctx.measureText(text).width;
  const tagHeight = 18;
  const tagY = Math.max(0, y - tagHeight);

  ctx.fillStyle = strokeColor;
  ctx.fillRect(x, tagY, textWidth + 12, tagHeight);

  ctx.fillStyle = '#070A12';
  ctx.fillText(text, x + 6, tagY + 13);

  ctx.restore();
}

// Analyze potential shoplifting behaviors across frame sequence
export function analyzeBehaviorPatterns(personBox, detectedObjects = [], history = {}) {
  // If a held object (phone, bottle, cup, handbag, backpack, book) overlaps significantly with person torso / lower pocket
  const suspectItems = detectedObjects.filter(obj => 
    ['cell phone', 'bottle', 'cup', 'book', 'handbag', 'backpack', 'umbrella'].includes(obj.class.toLowerCase())
  );

  let isConcealing = false;
  let concealmentConfidence = 0.85;

  if (personBox && suspectItems.length > 0) {
    const [px, py, pw, ph] = personBox;
    // Lower half of person (pocket / jacket area)
    const pocketZone = [px, py + ph * 0.45, pw, ph * 0.55];

    for (const item of suspectItems) {
      const overlap = getBoundingBoxOverlap(item.bbox, pocketZone);
      if (overlap > 0.35) {
        isConcealing = true;
        concealmentConfidence = Math.min(0.98, 0.78 + (overlap * 0.2));
        break;
      }
    }
  }

  return {
    isConcealing,
    confidence: concealmentConfidence,
    detectedItemsCount: suspectItems.length
  };
}

/**
 * Simplified 2D canvas face renderer.
 * Placeholder art — replace with real character assets later.
 * Accepts pure EmotionParams only (no DOM reads).
 */

/** @typedef {import('../engine/types.js').EmotionParams} EmotionParams */

/**
 * @param {PointDeltaLike|undefined} delta
 * @returns {{ x: number, y: number }}
 */
function deltaToXY(delta) {
  if (!delta || typeof delta !== 'object') return { x: 0, y: 0 };
  const x = (delta.r ?? 0) - (delta.l ?? 0);
  const y = (delta.u ?? 0) - (delta.d ?? 0);
  return { x, y };
}

/** @typedef {{ u?: number, d?: number, l?: number, r?: number }} PointDeltaLike */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {EmotionParams} params
 * @param {{ width?: number, height?: number, label?: string }} [meta]
 */
export function draw(ctx, params, meta = {}) {
  const w = meta.width ?? ctx.canvas.width;
  const h = meta.height ?? ctx.canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) * 0.35;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0f1419';
  ctx.fillRect(0, 0, w, h);

  // head
  ctx.fillStyle = '#d7c4b0';
  ctx.beginPath();
  ctx.ellipse(cx, cy, scale * 0.78, scale * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();

  const browL = deltaToXY(/** @type {PointDeltaLike} */ (params['EB-L2'] || params['EB-L1']));
  const browR = deltaToXY(/** @type {PointDeltaLike} */ (params['EB-R2'] || params['EB-R1']));
  const eyeUpL = deltaToXY(/** @type {PointDeltaLike} */ (params['EY-L-UP']));
  const eyeLowL = deltaToXY(/** @type {PointDeltaLike} */ (params['EY-L-LOW']));
  const eyeUpR = deltaToXY(/** @type {PointDeltaLike} */ (params['EY-R-UP']));
  const eyeLowR = deltaToXY(/** @type {PointDeltaLike} */ (params['EY-R-LOW']));
  const mouthL = deltaToXY(/** @type {PointDeltaLike} */ (params['MO-L']));
  const mouthR = deltaToXY(/** @type {PointDeltaLike} */ (params['MO-R']));
  const mouthCtr = deltaToXY(/** @type {PointDeltaLike} */ (params['MO-CTR']));
  const cheekL = deltaToXY(/** @type {PointDeltaLike} */ (params['CH-L']));

  const amp = scale * 0.22;

  // brows
  ctx.strokeStyle = '#2a2118';
  ctx.lineWidth = Math.max(2, scale * 0.04);
  ctx.lineCap = 'round';
  drawBrow(ctx, cx - scale * 0.28, cy - scale * 0.28 + browL.y * amp, -1, browL);
  drawBrow(ctx, cx + scale * 0.28, cy - scale * 0.28 + browR.y * amp, 1, browR);

  // eyes
  const openL = 1 + eyeUpL.y * 0.8 - eyeLowL.y * 0.5;
  const openR = 1 + eyeUpR.y * 0.8 - eyeLowR.y * 0.5;
  drawEye(
    ctx,
    cx - scale * 0.28,
    cy - scale * 0.08,
    scale * 0.14,
    Math.max(0.25, openL),
    params.pupilLX ?? 0,
    params.pupilLY ?? 0,
  );
  drawEye(
    ctx,
    cx + scale * 0.28,
    cy - scale * 0.08,
    scale * 0.14,
    Math.max(0.25, openR),
    params.pupilRX ?? 0,
    params.pupilRY ?? 0,
  );

  // cheeks (Duchenne marker hint)
  if (cheekL.y > 0.05) {
    ctx.fillStyle = `rgba(232, 120, 120, ${Math.min(0.45, cheekL.y * 0.4)})`;
    ctx.beginPath();
    ctx.ellipse(cx - scale * 0.32, cy + scale * 0.12 - cheekL.y * amp * 0.3, scale * 0.12, scale * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + scale * 0.32, cy + scale * 0.12 - cheekL.y * amp * 0.3, scale * 0.12, scale * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // nose
  ctx.strokeStyle = '#8a6f5a';
  ctx.lineWidth = Math.max(1.5, scale * 0.025);
  ctx.beginPath();
  ctx.moveTo(cx, cy - scale * 0.02);
  ctx.lineTo(cx - scale * 0.05, cy + scale * 0.18);
  ctx.lineTo(cx + scale * 0.05, cy + scale * 0.18);
  ctx.stroke();

  // mouth
  const mlX = cx - scale * 0.22 + mouthL.x * amp;
  const mlY = cy + scale * 0.38 - mouthL.y * amp;
  const mrX = cx + scale * 0.22 + mouthR.x * amp;
  const mrY = cy + scale * 0.38 - mouthR.y * amp;
  const open = Math.max(0, -mouthCtr.y) * amp * 0.9;

  ctx.strokeStyle = '#5a3d36';
  ctx.fillStyle = '#8b3a3a';
  ctx.lineWidth = Math.max(2, scale * 0.035);
  ctx.beginPath();
  ctx.moveTo(mlX, mlY);
  ctx.quadraticCurveTo(cx, cy + scale * 0.38 - mouthCtr.y * amp + open * 0.2, mrX, mrY);
  if (open > 1) {
    ctx.quadraticCurveTo(cx, cy + scale * 0.38 + open, mlX, mlY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.stroke();

  if (meta.label) {
    ctx.fillStyle = '#9aa7b5';
    ctx.font = `${Math.max(12, scale * 0.12)}px ui-sans-serif, system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText(meta.label, cx, h - 16);
  }
}

function drawBrow(ctx, x, y, side, delta) {
  const tilt = (delta.y ?? 0) * 8 + (side < 0 ? (delta.x ?? 0) * 6 : -(delta.x ?? 0) * 6);
  ctx.beginPath();
  ctx.moveTo(x - 22 * side, y + tilt);
  ctx.quadraticCurveTo(x, y - 4 - Math.abs(delta.y ?? 0) * 6, x + 22 * side, y - tilt * 0.3);
  ctx.stroke();
}

function drawEye(ctx, x, y, r, openFactor, px, py) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.7 * openFactor, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a2118';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const pupilR = r * 0.35;
  ctx.fillStyle = '#1a1410';
  ctx.beginPath();
  ctx.arc(x + px * r * 0.35, y - py * r * 0.35, pupilR, 0, Math.PI * 2);
  ctx.fill();
}

export default { draw };

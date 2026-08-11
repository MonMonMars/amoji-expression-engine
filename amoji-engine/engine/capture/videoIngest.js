/**
 * Video / YouTube ingest helpers (authoring only).
 * Face quality gates + clip job planning for capture-bake.
 * Likeness/IP: bake abstract curves only — never ship source identity.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { expressionEnergy } from './captureBake.js';
import { mediaPipeResultToFrame } from './mediapipeArkit.js';

export const YT_CAPTURE_PROTOCOL = 'amoji.capture.yt.v1';

/** MediaPipe landmark indices (Face Mesh 478 / 468 subset). */
export const LM = {
  nose: 1,
  chin: 152,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftMouth: 61,
  rightMouth: 291,
  forehead: 10,
};

/**
 * @param {Array<{ x: number, y: number, z?: number }>} landmarks
 */
export function landmarkBounds(landmarks) {
  if (!landmarks?.length) return null;
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  for (const p of landmarks) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);
  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    area: width * height,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

/**
 * Score face suitability for expression capture (0..1).
 * @param {Array<{ x: number, y: number, z?: number }>} landmarks
 * @param {{
 *   minArea?: number,
 *   maxYaw?: number,
 *   requireCentered?: boolean,
 * }} [opts]
 */
export function scoreFaceQuality(landmarks, opts = {}) {
  const minArea = opts.minArea ?? 0.035;
  const maxYaw = opts.maxYaw ?? 0.45;
  const bounds = landmarkBounds(landmarks);
  if (!bounds) {
    return { score: 0, pass: false, reasons: ['no_face'], bounds: null };
  }

  /** @type {string[]} */
  const reasons = [];
  let score = 1;

  if (bounds.area < minArea) {
    reasons.push('face_too_small');
    score *= Math.max(0.05, bounds.area / minArea);
  }

  const le = landmarks[LM.leftEyeOuter];
  const re = landmarks[LM.rightEyeOuter];
  const nose = landmarks[LM.nose];
  if (!le || !re || !nose) {
    reasons.push('missing_anchors');
    score *= 0.2;
  } else {
    const eyeDist = Math.hypot(re.x - le.x, re.y - le.y);
    const midX = (le.x + re.x) / 2;
    const yaw = (nose.x - midX) / Math.max(1e-4, eyeDist);
    const absYaw = Math.abs(yaw);
    if (absYaw > maxYaw) {
      reasons.push('too_profile');
      score *= Math.max(0.05, 1 - (absYaw - maxYaw));
    }
    // Eyes should be roughly horizontal
    const roll = Math.abs(re.y - le.y) / Math.max(1e-4, eyeDist);
    if (roll > 0.35) {
      reasons.push('too_tilted');
      score *= Math.max(0.15, 1 - roll);
    }
    // Nose roughly between eyes vertically for frontal
    if (opts.requireCentered !== false) {
      const edge = Math.min(bounds.cx, 1 - bounds.cx);
      if (edge < 0.12) {
        reasons.push('face_near_edge');
        score *= 0.5;
      }
    }
  }

  // Aspect: very wide/tall crops often mean partial face
  const aspect = bounds.width / Math.max(1e-4, bounds.height);
  if (aspect < 0.45 || aspect > 1.35) {
    reasons.push('odd_aspect');
    score *= 0.7;
  }

  score = Math.max(0, Math.min(1, score));
  const pass = score >= 0.55 && !reasons.includes('no_face') && !reasons.includes('too_profile');
  return {
    score: Number(score.toFixed(4)),
    pass,
    reasons,
    bounds,
  };
}

/**
 * Filter tracked frames by face quality + optional energy floor.
 * @param {Array<{
 *   t: number,
 *   blendShapes?: object,
 *   landmarks?: Array<{x:number,y:number,z?:number}>,
 *   quality?: ReturnType<typeof scoreFaceQuality>,
 * }>} frames
 * @param {{
 *   minQuality?: number,
 *   minEnergy?: number,
 *   minArea?: number,
 * }} [opts]
 */
export function filterCaptureFrames(frames, opts = {}) {
  const minQuality = opts.minQuality ?? 0.55;
  const minEnergy = opts.minEnergy ?? 0;
  /** @type {typeof frames} */
  const kept = [];
  /** @type {Array<{ t: number, reasons: string[] }>} */
  const dropped = [];

  for (const f of frames) {
    let quality = f.quality;
    if (!quality && f.landmarks) {
      quality = scoreFaceQuality(f.landmarks, { minArea: opts.minArea });
    }
    const energy = f.blendShapes ? expressionEnergy(f.blendShapes) : 0;
    const q = quality?.score ?? (f.landmarks ? 0 : 1);
    const passQ = q >= minQuality && (quality ? !!quality.pass : true);
    const passE = energy >= minEnergy;
    if (passQ && passE) {
      kept.push({ ...f, quality, energy });
    } else {
      dropped.push({
        t: f.t,
        reasons: [
          ...(quality?.reasons || []),
          !passE ? 'low_energy' : null,
          !passQ ? 'low_quality' : null,
        ].filter(Boolean),
      });
    }
  }

  return applyComplianceGate(
    {
      kind: 'yt_frame_filter',
      kept,
      dropped,
      keptCount: kept.length,
      droppedCount: dropped.length,
      keepRatio: frames.length ? kept.length / frames.length : 0,
    },
    {},
  );
}

/**
 * Build a capture take from accepted MediaPipe-like results.
 * @param {Array<object>} results — { t, faceBlendshapes?, faceLandmarks?, blendShapes? }
 * @param {{ emotion?: string, fps?: number, subject?: string, filter?: object }} [opts]
 */
export function resultsToFilteredTake(results, opts = {}) {
  const fps = opts.fps || 30;
  /** @type {object[]} */
  const staged = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const t = typeof r.t === 'number' ? r.t : i / fps;
    const landmarks = r.faceLandmarks?.[0] || r.landmarks || null;
    const quality = landmarks ? scoreFaceQuality(landmarks) : { score: 1, pass: true, reasons: [] };
    const frame = mediaPipeResultToFrame(r, {
      t,
      frame: i,
      fps,
      subject: opts.subject || 'YtCapture',
    });
    staged.push({
      t,
      blendShapes: frame.blendShapes,
      landmarks,
      quality,
      energy: frame.energy,
      protocol: frame.protocol,
      source: frame.source,
    });
  }

  const filtered = filterCaptureFrames(staged, opts.filter || {});
  const frames = filtered.kept.map((f, i) => ({
    protocol: f.protocol,
    subject: opts.subject || 'YtCapture',
    frame: i,
    fps,
    t: f.t,
    blendShapes: f.blendShapes,
    quality: f.quality?.score,
    energy: f.energy,
  }));

  // Re-base time to 0 for bake
  if (frames.length) {
    const t0 = frames[0].t;
    for (const f of frames) f.t = Number((f.t - t0).toFixed(4));
  }

  return applyComplianceGate(
    {
      kind: 'capture_take',
      protocol: YT_CAPTURE_PROTOCOL,
      emotion: opts.emotion || null,
      subject: opts.subject || 'YtCapture',
      fps,
      frameCount: frames.length,
      durationSec: frames.length ? frames[frames.length - 1].t - frames[0].t : 0,
      filter: {
        keptCount: filtered.keptCount,
        droppedCount: filtered.droppedCount,
        keepRatio: filtered.keepRatio,
      },
      frames,
      note: 'YouTube/local video authoring capture — bake curves only; do not ship likeness or source video.',
    },
    {},
  );
}

/**
 * Plan a clip job for CLI / batch UI.
 * @param {{
 *   source: string,
 *   emotion: string,
 *   startSec?: number,
 *   durationSec?: number,
 *   fps?: number,
 *   label?: string,
 * }} opts
 */
export function buildClipJob(opts) {
  if (!opts?.source || !opts?.emotion) {
    throw new Error('buildClipJob requires source and emotion');
  }
  return applyComplianceGate(
    {
      kind: 'yt_clip_job',
      protocol: YT_CAPTURE_PROTOCOL,
      source: opts.source,
      emotion: opts.emotion,
      startSec: opts.startSec ?? 0,
      durationSec: opts.durationSec ?? 8,
      fps: opts.fps ?? 24,
      label: opts.label || opts.emotion,
      authoringOnly: true,
      legalNote:
        'Respect YouTube ToS and copyright. Use as expression-method reference only — no celebrity likeness in product.',
    },
    {},
  );
}

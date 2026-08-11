/**
 * Layer B — Neck / shoulder / breathing (Alba Emoting body effector).
 * Unified by accessoryMuscleActivation (SCM/scalenes dual role).
 */
import bodyData from '../../data/body/emotion-neck-shoulder.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const BODY_NEUTRAL = bodyData.neutral;
export const BODY_BY_EMOTION = bodyData.byEmotion;
export const THREAT_FREEZE = bodyData.threatFreeze;
export const GAZE_COMBO = bodyData.gazeCombo;

/** Extreme-band body posture mix cap (intensity can go to 2). */
export const DISNEY_EXTREME_BODY_MIX_CAP = 1.5;
/** How strongly neck follows head/chest Extreme scale. */
export const DISNEY_EXTREME_NECK_SCALE_BLEND = 0.75;

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Extreme-aware body mix from intensity (caps above 1 for cartoon posture).
 * @param {number} intensity
 * @returns {number}
 */
export function disneyExtremeBodyMix(intensity) {
  const t = Math.max(0, Math.min(2.0, Number(intensity) || 0));
  return Math.min(DISNEY_EXTREME_BODY_MIX_CAP, t);
}

/**
 * Compact Extreme neck-scale / body-mix flash label.
 * @param {{
 *   enabled?: boolean,
 *   bodyOn?: boolean,
 *   neckBlend?: number,
 *   bodyMix?: number,
 *   bodyInt?: number,
 * }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeNeckLabel(opts = {}) {
  const neck =
    typeof opts.neckBlend === 'number' && Number.isFinite(opts.neckBlend)
      ? opts.neckBlend
      : DISNEY_EXTREME_NECK_SCALE_BLEND;
  if (!opts.enabled || !opts.bodyOn) {
    return `neck ${neck.toFixed(2)} · body mix (off)`;
  }
  const mix =
    typeof opts.bodyMix === 'number' && Number.isFinite(opts.bodyMix)
      ? opts.bodyMix
      : typeof opts.bodyInt === 'number'
        ? disneyExtremeBodyMix(opts.bodyInt)
        : null;
  const mixBit =
    mix != null ? ` · mix ${mix.toFixed(2)}` : '';
  const intBit =
    typeof opts.bodyInt === 'number' && Number.isFinite(opts.bodyInt)
      ? ` @ ${opts.bodyInt.toFixed(2)}`
      : '';
  return `neck ${neck.toFixed(2)}${mixBit}${intBit}`;
}

/**
 * Sample body-mix curve across 0..maxT for Extreme UI.
 * @param {{
 *   steps?: number,
 *   maxT?: number,
 *   markerT?: number,
 * }} [opts]
 * @returns {{
 *   points: { t: number, y: number }[],
 *   marker: { t: number, y: number }|null,
 *   cap: number,
 *   maxY: number,
 *   maxT: number,
 * }}
 */
export function sampleDisneyExtremeBodyMixCurve(opts = {}) {
  const steps = Math.max(2, Math.floor(opts.steps ?? 33));
  const maxT =
    typeof opts.maxT === 'number' && opts.maxT > 0 ? opts.maxT : 2;
  /** @type {{ t: number, y: number }[]} */
  const points = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * maxT;
    points.push({ t, y: disneyExtremeBodyMix(t) });
  }
  /** @type {{ t: number, y: number }|null} */
  let marker = null;
  if (typeof opts.markerT === 'number' && Number.isFinite(opts.markerT)) {
    const t = Math.max(0, Math.min(maxT, opts.markerT));
    marker = { t, y: disneyExtremeBodyMix(t) };
  }
  let maxY = DISNEY_EXTREME_BODY_MIX_CAP;
  for (const p of points) if (p.y > maxY) maxY = p.y;
  if (marker && marker.y > maxY) maxY = marker.y;
  return {
    points,
    marker,
    cap: DISNEY_EXTREME_BODY_MIX_CAP,
    maxY,
    maxT,
  };
}

/**
 * Compact label for Extreme body-mix readout.
 * @param {{
 *   enabled?: boolean,
 *   bodyOn?: boolean,
 *   markerT?: number,
 * }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBodyMixLabel(opts = {}) {
  const cap = DISNEY_EXTREME_BODY_MIX_CAP;
  const neck = DISNEY_EXTREME_NECK_SCALE_BLEND;
  if (!opts.enabled || !opts.bodyOn) {
    return `body mix · cap ${cap.toFixed(2)} · neck ${neck.toFixed(2)} (off)`;
  }
  if (typeof opts.markerT === 'number' && Number.isFinite(opts.markerT)) {
    const t = Math.max(0, Math.min(2, opts.markerT));
    return `mix ${disneyExtremeBodyMix(t).toFixed(2)} @ ${t.toFixed(2)} · cap ${cap.toFixed(2)} · neck ${neck.toFixed(2)}`;
  }
  return `body mix · cap ${cap.toFixed(2)} · neck ${neck.toFixed(2)}`;
}

/**
 * Clipboard bundle: body mix label + SVG (multiline).
 * @param {{
 *   enabled?: boolean,
 *   bodyOn?: boolean,
 *   markerT?: number,
 *   width?: number,
 *   height?: number,
 * }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBodyMixBundle(opts = {}) {
  const label = formatDisneyExtremeBodyMixLabel(opts);
  const spark = buildDisneyExtremeBodyMixSparkSvg({
    markerT: opts.bodyOn ? opts.markerT : undefined,
    width: opts.width ?? 280,
    height: opts.height ?? 56,
  });
  return `${label}\n${spark.svg}`;
}

/**
 * Inline SVG sparkline for Extreme body-mix (linear to cap, then flat).
 * @param {{
 *   width?: number,
 *   height?: number,
 *   steps?: number,
 *   maxT?: number,
 *   markerT?: number,
 *   stroke?: string,
 *   markerStroke?: string,
 *   fill?: string,
 *   capGuide?: string,
 * }} [opts]
 * @returns {{ svg: string, empty: boolean, sample: ReturnType<typeof sampleDisneyExtremeBodyMixCurve> }}
 */
export function buildDisneyExtremeBodyMixSparkSvg(opts = {}) {
  const width = opts.width ?? 140;
  const height = opts.height ?? 28;
  const sample = sampleDisneyExtremeBodyMixCurve(opts);
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const stroke = opts.stroke || '#9ddea6';
  const markerStroke = opts.markerStroke || '#ffb454';
  const fill = opts.fill || 'rgba(157,222,166,0.14)';
  const capGuide = opts.capGuide || 'rgba(255,255,255,0.18)';
  const maxY = Math.max(sample.maxY, 1e-6);
  const coords = sample.points.map((p) => ({
    x: pad + (p.t / sample.maxT) * w,
    y: pad + (1 - p.y / maxY) * h,
  }));
  const poly = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${pad},${pad + h} ${poly} ${pad + w},${pad + h}`;
  const capT = Math.min(sample.maxT, DISNEY_EXTREME_BODY_MIX_CAP);
  const capX = pad + (capT / sample.maxT) * w;
  let markerSvg = '';
  if (sample.marker) {
    const mx = pad + (sample.marker.t / sample.maxT) * w;
    const my = pad + (1 - sample.marker.y / maxY) * h;
    markerSvg = `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="2.4" fill="${markerStroke}" stroke="#0b1218" stroke-width="0.8"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Disney Extreme body mix curve"><rect width="100%" height="100%" fill="transparent"/><line x1="${capX.toFixed(1)}" y1="${pad}" x2="${capX.toFixed(1)}" y2="${pad + h}" stroke="${capGuide}" stroke-width="1" stroke-dasharray="2 2"/><polygon points="${area}" fill="${fill}" stroke="none"/><polyline points="${poly}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>${markerSvg}</svg>`;
  return { svg, empty: false, sample };
}

/**
 * Cross-layer read: head pitch × gaze lock → affective label.
 * @param {number} headTiltVertical -1..1
 * @param {{ lookX?: number, lookY?: number, gazeLock?: number }} gaze
 * @returns {'angry_challenge'|'sad_submissive'|'proud'|'neutral'}
 */
export function classifyHeadGazeCombo(headTiltVertical, gaze = {}) {
  const pitch = headTiltVertical ?? 0;
  const lock =
    typeof gaze.gazeLock === 'number'
      ? gaze.gazeLock
      : 1 - Math.min(1, Math.hypot(gaze.lookX ?? 0, gaze.lookY ?? 0));
  const avoid = 1 - lock;

  if (pitch < -0.15) {
    if (lock >= GAZE_COMBO.angryGazeLockThreshold) return 'angry_challenge';
    if (avoid >= GAZE_COMBO.avoidThreshold) return 'sad_submissive';
  }
  if (pitch > 0.2 && lock >= 0.4) return 'proud';
  return 'neutral';
}

/**
 * Evaluate Layer B for emotion (+ optional gaze for angry lock rule).
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {{
 *   lookX?: number,
 *   lookY?: number,
 *   gazeLock?: number,
 *   threat?: boolean,
 *   sigh?: boolean,
 * }} [opts]
 */
export function evaluateBody(emotion, intensity = 1, opts = {}) {
  const base = { ...BODY_NEUTRAL };
  let emoKey = emotion;
  const raw = BODY_BY_EMOTION[emotion] || BODY_BY_EMOTION.neutral;
  const t = Math.max(0, Math.min(2.0, intensity));
  // Allow extra-extreme tiers to extrapolate posture beyond the normal band.
  const mix = disneyExtremeBodyMix(t);

  /** @type {Record<string, unknown>} */
  let target = { ...raw };

  // Angry head-down only reads as anger when gaze is locked; else remap toward sad.
  if (raw.requiresGazeLock) {
    const combo = classifyHeadGazeCombo(
      lerp(base.headTiltVertical, raw.headTiltVertical, mix),
      opts,
    );
    if (combo === 'sad_submissive') {
      emoKey = 'sad';
      target = { ...BODY_BY_EMOTION.sad };
    }
  }

  const body = {
    headTiltLateral: lerp(base.headTiltLateral, target.headTiltLateral ?? 0, mix),
    headTiltVertical: lerp(base.headTiltVertical, target.headTiltVertical ?? 0, mix),
    headTiltSpeed: mix > 0.25 ? target.headTiltSpeed || base.headTiltSpeed : base.headTiltSpeed,
    shoulderRoundness: lerp(base.shoulderRoundness, target.shoulderRoundness ?? 0, mix),
    chestExpansion: lerp(base.chestExpansion, target.chestExpansion ?? 0, mix),
    accessoryMuscleActivation: lerp(
      base.accessoryMuscleActivation,
      target.accessoryMuscleActivation ?? 0,
      mix,
    ),
    breathingRate: lerp(base.breathingRate, target.breathingRate ?? 1, mix),
    breathingDepth: mix > 0.3 ? target.breathingDepth || base.breathingDepth : base.breathingDepth,
    breathingRegularity:
      mix > 0.3
        ? target.breathingRegularity || base.breathingRegularity
        : base.breathingRegularity,
    inhaleBias: lerp(base.inhaleBias, target.inhaleBias ?? 0.5, mix),
  };

  if (opts.sigh) {
    body.accessoryMuscleActivation = Math.min(1, body.accessoryMuscleActivation + 0.45);
    body.inhaleBias = Math.min(0.35, body.inhaleBias * 0.6);
    body.breathingDepth = 'deep';
  }

  if (opts.threat) {
    body.accessoryMuscleActivation = Math.min(
      1,
      body.accessoryMuscleActivation + THREAT_FREEZE.accessoryBoost,
    );
  }

  // Derived (document 18)
  const ama = body.accessoryMuscleActivation;
  const derived = {
    neckVisibleTension: ama,
    shoulderMicroLift: ama * body.breathingRate,
    breathingMode: ama > 0.5 ? 'accessory' : 'diaphragm',
    // Trapezium coupling: head-down pulls static shoulder height up a bit
    shoulderHeight: Math.max(0, Math.min(1, ama * 0.85 + Math.max(0, -body.headTiltVertical) * 0.25)),
  };

  const gazeLabel = classifyHeadGazeCombo(body.headTiltVertical, opts);

  return applyComplianceGate(
    {
      kind: 'body',
      emotion: emoKey,
      intensity: t,
      body: { ...body, ...derived },
      gazeCombo: gazeLabel,
      note:
        gazeLabel === 'angry_challenge'
          ? 'head-down + gaze lock → anger'
          : gazeLabel === 'sad_submissive'
            ? 'head-down + gaze avoid → sad/submissive'
            : null,
    },
    {},
  );
}

/**
 * Sample breath + posture channels for animation (seconds).
 * @param {ReturnType<typeof evaluateBody>['body']} body
 * @param {number} timeSec
 * @param {{ threatFreezeT?: number }} [opts] remaining freeze seconds
 */
export function sampleBodyPose(body, timeSec, opts = {}) {
  const rate = body.breathingRate || 1;
  const depthMul =
    body.breathingDepth === 'deep' ? 1.25 : body.breathingDepth === 'shallow' ? 0.55 : 1;
  let phase = timeSec * rate * Math.PI * 2 * 0.35; // ~21 bpm at rate 1
  if (body.breathingRegularity === 'irregular') {
    phase += Math.sin(timeSec * 3.1) * 0.35 + Math.sin(timeSec * 5.7) * 0.15;
  } else if (body.breathingRegularity === 'held') {
    phase = Math.min(phase % (Math.PI * 2), Math.PI * 0.9);
  }

  // Asymmetric inhale/exhale via inhaleBias
  const bias = body.inhaleBias ?? 0.5;
  const cycle = ((phase / (Math.PI * 2)) % 1 + 1) % 1;
  const inhale = cycle < bias;
  const local = inhale ? cycle / Math.max(bias, 1e-3) : (cycle - bias) / Math.max(1 - bias, 1e-3);
  const breathWave = inhale
    ? Math.sin(local * Math.PI * 0.5)
    : Math.cos(local * Math.PI * 0.5);

  const chest = breathWave * 0.04 * depthMul * (0.5 + Math.abs(body.chestExpansion));
  const shoulderBreath =
    breathWave * 0.012 * (body.shoulderMicroLift || 0) * (body.breathingMode === 'accessory' ? 1.4 : 0.6);

  let swayMul = 1;
  if ((opts.threatFreezeT ?? 0) > 0) {
    swayMul = THREAT_FREEZE.swayMul;
  }

  return {
    headPitch: body.headTiltVertical * 0.35,
    headRoll: body.headTiltLateral * 0.4,
    neckPitch: body.headTiltVertical * 0.12 + body.neckVisibleTension * 0.04,
    clavicleLift: body.shoulderHeight * 0.18 + shoulderBreath,
    clavicleRound: body.shoulderRoundness * 0.12,
    chestScale: 1 + chest + body.chestExpansion * 0.03,
    spineBend: -body.shoulderRoundness * 0.08 + (body.chestExpansion < 0 ? body.chestExpansion * 0.06 : 0),
    swayMul,
    breathWave,
  };
}

/**
 * Apply Layer B sample onto Sakura bones (head/neck/spine/clavicle).
 * @param {Record<string, { rotation: { x: number, y: number, z: number }, scale?: { setScalar?: Function, x?: number, y?: number, z?: number } }>} boneMap
 * @param {Record<string, { x: number, y: number, z: number }>} restRotations
 * @param {ReturnType<typeof sampleBodyPose>} sample
 * @param {number} [alpha=1]
 */
export function applyBodyBones(boneMap, restRotations, sample, alpha = 1) {
  const a = Math.max(0, Math.min(1, alpha));
  const set = (name, dx, dy, dz) => {
    const bone = boneMap[name];
    const rest = restRotations[name];
    if (!bone || !rest) return;
    bone.rotation.x = rest.x + dx * a;
    bone.rotation.y = rest.y + dy * a;
    bone.rotation.z = rest.z + dz * a;
  };

  set('head', sample.headPitch, 0, sample.headRoll);
  set('neck', sample.neckPitch, 0, sample.headRoll * 0.35);
  set('spine03', sample.spineBend, 0, 0);
  set('clavicle_L', -sample.clavicleLift, sample.clavicleRound, sample.clavicleLift * 0.5);
  set('clavicle_R', -sample.clavicleLift, -sample.clavicleRound, -sample.clavicleLift * 0.5);

  const spine = boneMap.spine02;
  if (spine?.scale?.setScalar) {
    spine.scale.setScalar(sample.chestScale);
  }

  // Extreme tiers: also scale head + neck for "cartoon swell" feel.
  // This stays proportional and only applies when bones support scaling.
  const head = boneMap.head;
  if (head?.scale?.setScalar) {
    head.scale.setScalar(sample.chestScale);
  }
  const neck = boneMap.neck;
  if (neck?.scale?.setScalar) {
    // Follow head Extreme swell with a readable neck blend.
    neck.scale.setScalar(
      1 + (sample.chestScale - 1) * DISNEY_EXTREME_NECK_SCALE_BLEND,
    );
  }
}

/**
 * Stateful Layer B with threat freeze timer + paralinguistic hooks.
 */
export class BodyController {
  constructor() {
    this.threatFreezeT = 0;
    this.sighT = 0;
    this.time = 0;
  }

  /** Sudden threat — freeze sway briefly. */
  triggerThreat() {
    this.threatFreezeT = THREAT_FREEZE.durationSec;
  }

  /** Paralinguistic sigh tag from TTS. */
  triggerSigh() {
    this.sighT = 1.2;
  }

  /**
   * @param {number} dt
   * @param {{ emotion: string, intensity?: number, lookX?: number, lookY?: number, gazeLock?: number }} ctx
   */
  tick(dt, ctx) {
    this.time += dt;
    if (this.threatFreezeT > 0) this.threatFreezeT = Math.max(0, this.threatFreezeT - dt);
    if (this.sighT > 0) this.sighT = Math.max(0, this.sighT - dt);

    const evaluated = evaluateBody(ctx.emotion, ctx.intensity ?? 0.7, {
      lookX: ctx.lookX,
      lookY: ctx.lookY,
      gazeLock: ctx.gazeLock,
      threat: this.threatFreezeT > 0,
      sigh: this.sighT > 0,
    });
    const pose = sampleBodyPose(evaluated.body, this.time, {
      threatFreezeT: this.threatFreezeT,
    });
    return { ...evaluated, pose, threatFreezeT: this.threatFreezeT, sighT: this.sighT };
  }
}

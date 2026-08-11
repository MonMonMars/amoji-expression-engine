/**
 * Capture → Bake (authoring only).
 * Ingest Live Link / ARKit time series from video takes → onset/apex/offset
 * timing + intensity-sculpt morph fragments for the pure-generation engine.
 *
 * NOT a runtime biometric path. Bake offline; ship JSON recipes only.
 */
import mappingData from '../../data/arkit/arkit-mapping.json' with { type: 'json' };
import { ARKIT_CHANNELS, emptyArkitWeights } from '../export/arkitExporter.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const CAPTURE_PROTOCOL = 'amoji.capture.arkit.take.v1';
export const BAKE_PROTOCOL = 'amoji.capture.bake.v1';

/** Channels that are gaze/look — excluded from expression energy. */
export const GAZE_CHANNELS = new Set(
  ARKIT_CHANNELS.filter((c) => c.startsWith('eyeLook')),
);

/** Blink channels — tracked separately for temporal blink bake. */
export const BLINK_CHANNELS = ['eyeBlinkLeft', 'eyeBlinkRight'];

/**
 * Build reverse table: Expression_* ← ARKit contributions.
 * @param {typeof mappingData} [mapping]
 */
export function buildArkitToExpression(mapping = mappingData) {
  /** @type {Record<string, Array<{ source: string, weight: number }>>} */
  const inverse = {};
  for (const [morph, routes] of Object.entries(mapping.expressionToArkit || {})) {
    for (const { target, weight } of routes) {
      if (!inverse[target]) inverse[target] = [];
      inverse[target].push({ source: morph, weight });
    }
  }
  return inverse;
}

/**
 * Invert one ARKit frame → approximate Expression_* morph weights.
 * @param {Record<string, number>} arkit
 * @param {{ mapping?: typeof mappingData, eps?: number }} [opts]
 */
export function arkitToMorphWeights(arkit, opts = {}) {
  const mapping = opts.mapping || mappingData;
  const eps = opts.eps ?? 0.02;
  /** @type {Record<string, { num: number, den: number }>} */
  const acc = {};
  for (const [morph, routes] of Object.entries(mapping.expressionToArkit || {})) {
    let num = 0;
    let den = 0;
    for (const { target, weight } of routes) {
      const v = Number(arkit[target] ?? 0);
      if (v <= 0 || weight <= 0) continue;
      num += v * weight;
      den += weight;
    }
    if (den > 0) {
      const value = Math.min(1, num / den);
      if (value >= eps) acc[morph] = { num: value, den: 1 };
    }
  }
  /** @type {Record<string, number>} */
  const out = {};
  for (const [morph, { num }] of Object.entries(acc)) {
    out[morph] = Number(num.toFixed(4));
  }
  return out;
}

/**
 * Invert ARKit → M1–M21 soft activations (authoring hint, not perimeter-capped).
 * @param {Record<string, number>} arkit
 * @param {{ mapping?: typeof mappingData, eps?: number }} [opts]
 */
export function arkitToMuscleHints(arkit, opts = {}) {
  const mapping = opts.mapping || mappingData;
  const eps = opts.eps ?? 0.02;
  /** @type {Record<string, number>} */
  const out = {};
  for (const [muscle, routes] of Object.entries(mapping.muscleToArkit || {})) {
    let num = 0;
    let den = 0;
    for (const { target, weight } of routes) {
      const v = Number(arkit[target] ?? 0);
      if (v <= 0 || weight <= 0) continue;
      num += v * weight;
      den += weight;
    }
    if (den > 0) {
      const value = Math.min(1, num / den);
      if (value >= eps) out[muscle] = Number(value.toFixed(4));
    }
  }
  return out;
}

/**
 * Normalize one raw frame into { t, blendShapes }.
 * Accepts Live Link publisher frames or flat ARKit dumps.
 * @param {object} raw
 * @param {number} index
 * @param {number} fps
 */
export function normalizeCaptureFrame(raw, index = 0, fps = 60) {
  const blend =
    raw.blendShapes ||
    raw.blendshapes ||
    raw.arkit ||
    raw.shapes ||
    (raw.jawOpen != null || raw.mouthSmileLeft != null ? raw : null);
  if (!blend || typeof blend !== 'object') {
    throw new Error(`Frame ${index}: missing blendShapes`);
  }
  const weights = emptyArkitWeights();
  for (const c of ARKIT_CHANNELS) {
    const v = blend[c];
    weights[c] = typeof v === 'number' ? Math.max(0, Math.min(1, v)) : 0;
  }
  let t =
    typeof raw.t === 'number'
      ? raw.t
      : typeof raw.time === 'number'
        ? raw.time
        : typeof raw.timestampMs === 'number' && typeof raw._takeStartMs === 'number'
          ? (raw.timestampMs - raw._takeStartMs) / 1000
          : index / fps;
  if (typeof raw.frame === 'number' && raw.t == null && raw.time == null) {
    t = raw.frame / (raw.fps || fps);
  }
  return { t: Number(t), frame: raw.frame ?? index, blendShapes: weights };
}

/**
 * Parse a capture take from NDJSON string, JSON array, or { frames: [] }.
 * @param {string|object|object[]} input
 * @param {{ fps?: number, emotion?: string }} [opts]
 */
export function parseCaptureTake(input, opts = {}) {
  const fps = opts.fps || 60;
  let framesRaw = [];
  let meta = {};

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('[')) {
      framesRaw = JSON.parse(trimmed);
    } else if (trimmed.startsWith('{')) {
      // single object or NDJSON?
      if (trimmed.includes('\n')) {
        framesRaw = trimmed
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => JSON.parse(l));
      } else {
        const obj = JSON.parse(trimmed);
        if (Array.isArray(obj.frames)) {
          framesRaw = obj.frames;
          meta = { ...obj };
          delete meta.frames;
        } else if (obj.blendShapes || obj.arkit) {
          framesRaw = [obj];
        } else {
          throw new Error('Unrecognized capture JSON object');
        }
      }
    } else {
      // NDJSON
      framesRaw = trimmed
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => JSON.parse(l));
    }
  } else if (Array.isArray(input)) {
    framesRaw = input;
  } else if (input && typeof input === 'object') {
    if (Array.isArray(input.frames)) {
      framesRaw = input.frames;
      meta = { ...input };
      delete meta.frames;
    } else {
      framesRaw = [input];
    }
  }

  if (!framesRaw.length) {
    throw new Error('Capture take has no frames');
  }

  const takeStart = framesRaw[0]?.timestampMs;
  const frames = framesRaw.map((raw, i) =>
    normalizeCaptureFrame(
      takeStart != null ? { ...raw, _takeStartMs: takeStart } : raw,
      i,
      fps,
    ),
  );

  // Ensure monotonically increasing t
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].t <= frames[i - 1].t) {
      frames[i].t = frames[i - 1].t + 1 / fps;
    }
  }

  return applyComplianceGate(
    {
      kind: 'capture_take',
      protocol: CAPTURE_PROTOCOL,
      emotion: opts.emotion || meta.emotion || null,
      fps: meta.fps || framesRaw[0]?.fps || fps,
      subject: meta.subject || framesRaw[0]?.subject || null,
      frameCount: frames.length,
      durationSec: frames[frames.length - 1].t - frames[0].t,
      frames,
      note: 'Authoring capture only — do not feed biometric streams into runtime engine.',
    },
    {},
  );
}

/**
 * Expression energy (exclude gaze; soft-weight blink).
 * Mean of *active* channels so sparse faces aren't diluted by zeros.
 * @param {Record<string, number>} blendShapes
 */
export function expressionEnergy(blendShapes) {
  let sum = 0;
  let n = 0;
  const activeEps = 0.02;
  for (const c of ARKIT_CHANNELS) {
    if (GAZE_CHANNELS.has(c)) continue;
    const v = blendShapes[c] || 0;
    if (v < activeEps && !BLINK_CHANNELS.includes(c)) continue;
    const w = BLINK_CHANNELS.includes(c) ? 0.25 : 1;
    if (v < activeEps) continue;
    sum += v * w;
    n += w;
  }
  // Fallback: if nothing active, use soft mean of face (non-gaze) for silence detection
  if (n < 1e-6) {
    let s = 0;
    let c = 0;
    for (const ch of ARKIT_CHANNELS) {
      if (GAZE_CHANNELS.has(ch)) continue;
      s += blendShapes[ch] || 0;
      c += 1;
    }
    return c > 0 ? s / c : 0;
  }
  return sum / n;
}

/**
 * Detect onset / apex / offset on an energy curve.
 * @param {Array<{ t: number, energy: number }>} series
 * @param {{
 *   onsetThreshold?: number,
 *   offsetThreshold?: number,
 *   minApex?: number,
 * }} [opts]
 */
export function detectTemporalEnvelope(series, opts = {}) {
  if (!series.length) {
    return { onsetSec: 0, apexSec: 0, offsetSec: 0, peakEnergy: 0, valid: false };
  }
  const onsetTh = opts.onsetThreshold ?? 0.08;
  const offsetTh = opts.offsetThreshold ?? 0.06;
  const minApex = opts.minApex ?? 0.12;

  let peakIdx = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i].energy > series[peakIdx].energy) peakIdx = i;
  }
  const peakEnergy = series[peakIdx].energy;
  const t0 = series[0].t;

  if (peakEnergy < minApex) {
    return {
      onsetSec: 0,
      apexSec: series[peakIdx].t - t0,
      offsetSec: series[series.length - 1].t - t0,
      peakEnergy,
      valid: false,
      reason: 'peak_below_min',
    };
  }

  let onsetIdx = 0;
  for (let i = 0; i <= peakIdx; i++) {
    if (series[i].energy >= onsetTh) {
      onsetIdx = i;
      break;
    }
  }

  let offsetIdx = series.length - 1;
  for (let i = peakIdx; i < series.length; i++) {
    if (series[i].energy <= offsetTh) {
      offsetIdx = i;
      break;
    }
  }

  return {
    onsetSec: Number((series[onsetIdx].t - t0).toFixed(4)),
    apexSec: Number((series[peakIdx].t - t0).toFixed(4)),
    offsetSec: Number((series[offsetIdx].t - t0).toFixed(4)),
    durationSec: Number((series[offsetIdx].t - series[onsetIdx].t).toFixed(4)),
    peakEnergy: Number(peakEnergy.toFixed(4)),
    onsetIdx,
    apexIdx: peakIdx,
    offsetIdx,
    valid: true,
  };
}

/**
 * Pick frame index nearest to absolute time t.
 * @param {Array<{ t: number }>} frames
 * @param {number} t
 */
export function frameNearTime(frames, t) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < frames.length; i++) {
    const d = Math.abs(frames[i].t - t);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/**
 * Sample morph weights at subtle / medium / peak along the take.
 * subtle ≈ 25% of rise, medium ≈ 55%, peak = apex.
 * @param {ReturnType<typeof parseCaptureTake>} take
 * @param {ReturnType<typeof detectTemporalEnvelope>} envelope
 */
export function sampleIntensityTiers(take, envelope) {
  const frames = take.frames;
  const t0 = frames[0].t;
  const onsetT = t0 + (envelope.onsetSec ?? 0);
  const apexT = t0 + (envelope.apexSec ?? 0);
  const rise = Math.max(1e-3, apexT - onsetT);

  const targets = {
    subtle: onsetT + rise * 0.25,
    medium: onsetT + rise * 0.55,
    peak: apexT,
  };

  /** @type {Record<string, { t: number, morphs: Record<string, number>, muscles: Record<string, number>, energy: number }>} */
  const tiers = {};
  for (const [tier, t] of Object.entries(targets)) {
    const idx = frameNearTime(frames, t);
    const bs = frames[idx].blendShapes;
    tiers[tier] = {
      t: Number((frames[idx].t - t0).toFixed(4)),
      morphs: arkitToMorphWeights(bs),
      muscles: arkitToMuscleHints(bs),
      energy: Number(expressionEnergy(bs).toFixed(4)),
    };
  }
  return tiers;
}

/**
 * Detect blink events from eyeBlink channels (for temporal bake hints).
 * @param {ReturnType<typeof parseCaptureTake>} take
 * @param {{ threshold?: number, minGapSec?: number }} [opts]
 */
export function detectBlinks(take, opts = {}) {
  const th = opts.threshold ?? 0.45;
  const minGap = opts.minGapSec ?? 0.18;
  const frames = take.frames;
  const t0 = frames[0].t;
  /** @type {Array<{ t: number, peak: number, durationSec: number }>} */
  const blinks = [];
  let inBlink = false;
  let start = 0;
  let peak = 0;

  for (let i = 0; i < frames.length; i++) {
    const v =
      ((frames[i].blendShapes.eyeBlinkLeft || 0) +
        (frames[i].blendShapes.eyeBlinkRight || 0)) /
      2;
    if (!inBlink && v >= th) {
      inBlink = true;
      start = frames[i].t;
      peak = v;
    } else if (inBlink) {
      peak = Math.max(peak, v);
      if (v < th * 0.55) {
        const dur = frames[i].t - start;
        const last = blinks[blinks.length - 1];
        if (!last || start - (t0 + last.t) >= minGap) {
          blinks.push({
            t: Number((start - t0).toFixed(4)),
            peak: Number(peak.toFixed(4)),
            durationSec: Number(dur.toFixed(4)),
          });
        }
        inBlink = false;
      }
    }
  }
  return blinks;
}

/**
 * Full bake: take → intensity sculpt fragment + temporal envelope.
 * @param {string|object|object[]} input
 * @param {{
 *   emotion: string,
 *   fps?: number,
 *   onsetThreshold?: number,
 *   offsetThreshold?: number,
 *   morphEps?: number,
 * }} opts
 */
export function bakeCaptureTake(input, opts) {
  if (!opts?.emotion) {
    throw new Error('bakeCaptureTake requires opts.emotion');
  }
  const take = parseCaptureTake(input, { fps: opts.fps, emotion: opts.emotion });
  const energySeries = take.frames.map((f) => ({
    t: f.t,
    energy: expressionEnergy(f.blendShapes),
  }));
  const envelope = detectTemporalEnvelope(energySeries, {
    onsetThreshold: opts.onsetThreshold,
    offsetThreshold: opts.offsetThreshold,
  });
  const tiers = sampleIntensityTiers(take, envelope);
  const blinks = detectBlinks(take);

  /** Intensity sculpt fragment — merge into data/emotions/intensity-sculpt-recipes.json */
  const recipeFragment = {
    [opts.emotion]: {
      subtle: tiers.subtle.morphs,
      medium: tiers.medium.morphs,
      peak: tiers.peak.morphs,
    },
  };

  /** Temporal envelope for Step-Out / attack timing authoring */
  const temporal = {
    emotion: opts.emotion,
    onsetSec: envelope.onsetSec,
    apexSec: envelope.apexSec,
    offsetSec: envelope.offsetSec,
    durationSec: envelope.durationSec ?? envelope.offsetSec - envelope.onsetSec,
    peakEnergy: envelope.peakEnergy,
    valid: envelope.valid,
    // Suggested Step-Out duration ≈ 60% of offset tail after apex
    suggestedStepOutSec: Number(
      Math.max(0.25, (envelope.offsetSec - envelope.apexSec) * 0.85 || 0.45).toFixed(3),
    ),
    blinks,
    meanBlinkIntervalSec:
      blinks.length >= 2
        ? Number(
            (
              (blinks[blinks.length - 1].t - blinks[0].t) /
              (blinks.length - 1)
            ).toFixed(3),
          )
        : null,
  };

  return applyComplianceGate(
    {
      kind: 'capture_bake',
      protocol: BAKE_PROTOCOL,
      emotion: opts.emotion,
      authoringOnly: true,
      take: {
        frameCount: take.frameCount,
        durationSec: take.durationSec,
        fps: take.fps,
        subject: take.subject,
      },
      envelope: temporal,
      tiers,
      recipeFragment,
      muscleHintsAtPeak: tiers.peak.muscles,
      // subsampled energy for HUD / plots (max ~120 pts)
      energyCurve: downsampleSeries(energySeries, 120),
      note: 'Review & hand-tune before merging into intensity-sculpt-recipes.json. Timing is essential — do not flatten to a still.',
    },
    {},
  );
}

/**
 * @param {Array<{ t: number, energy: number }>} series
 * @param {number} maxPts
 */
function downsampleSeries(series, maxPts) {
  if (series.length <= maxPts) {
    return series.map((p) => ({
      t: Number((p.t - series[0].t).toFixed(4)),
      energy: Number(p.energy.toFixed(4)),
    }));
  }
  const out = [];
  const step = (series.length - 1) / (maxPts - 1);
  for (let i = 0; i < maxPts; i++) {
    const idx = Math.round(i * step);
    out.push({
      t: Number((series[idx].t - series[0].t).toFixed(4)),
      energy: Number(series[idx].energy.toFixed(4)),
    });
  }
  return out;
}

/**
 * Merge a baked recipe fragment into an existing sculpt recipes object (immutable).
 * @param {object} existingRecipesFile — full intensity-sculpt-recipes.json shape
 * @param {Record<string, object>} fragment — bake.recipeFragment
 * @param {{ overwrite?: boolean }} [opts]
 */
export function mergeRecipeFragment(existingRecipesFile, fragment, opts = {}) {
  const recipes = { ...(existingRecipesFile.recipes || {}) };
  for (const [emotion, tiers] of Object.entries(fragment)) {
    if (recipes[emotion] && !opts.overwrite) {
      throw new Error(
        `Emotion "${emotion}" already exists — pass overwrite:true to replace`,
      );
    }
    recipes[emotion] = tiers;
  }
  return {
    ...existingRecipesFile,
    recipes,
    _bakedAt: new Date().toISOString(),
  };
}

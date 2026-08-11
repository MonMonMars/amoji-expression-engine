/**
 * Smile typology (Niedenthal reward / affiliative / dominance) + laughter
 * as an independent state with head-dominant → torso/shoulder PD derivation.
 */
import smileData from '../../data/emotions/smile-types.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { getPersona } from './idleMode.js';

export const SMILE_TYPES = smileData.types;
export const SMILE_MORPH_RECIPES = smileData.morphRecipes;
export const PERSONA_DEFAULT_SMILE = smileData.personaDefaultSmile;
export const PERSONA_LAUGH_ALLOWED = smileData.personaLaughAllowed;
export const LAUGHTER_INTENSITY_GATE = smileData.laughterIntensityGate;
export const CONTAGION_HALF_LIFE_SEC = smileData.contagionHalfLifeSec;
export const LAUGH_BODY = smileData.laughBody;
export const YOUTHFUL_SMILE_BIAS = smileData.youthfulSmileBias || {
  squintCapSmile: 0.32,
  squintCapLaugh: 0.26,
  squintOpenRelief: 0.85,
  cheekAttenuationOpen: 0.42,
  openBoostLaugh: 0.1,
};

/** Morph channels that drive crow's-feet / orbital squeeze (Pixar: keep subtle). */
export const SMILE_SQUINT_KEYS = [
  'Expressions_eyeSquintL_max',
  'Expressions_eyeSquintR_max',
];

/** Cheek-corner pull — stacks with squint to deepen nasolabial folds. */
export const SMILE_CHEEK_KEYS = [
  'Expressions_mouthSmile_max',
  'Expressions_mouthSmileL_max',
  'Expressions_mouthSmileR_max',
];

/** Jaw / open-smile channels — prefer these for big laugh instead of cheek squeeze. */
export const SMILE_OPEN_KEYS = [
  'Expressions_mouthSmileOpen_max',
  'Expressions_mouthSmileOpen2_max',
  'Expressions_mouthOpenLarge_max',
  'Expressions_mouthOpen_max',
  'Expressions_mouthOpenHalf_max',
];

/**
 * @param {string} [personaId]
 * @returns {'reward'|'affiliative'|'dominance'}
 */
export function defaultSmileForPersona(personaId) {
  const id = personaId || 'companion';
  return PERSONA_DEFAULT_SMILE[id] || 'reward';
}

/**
 * @param {string} [personaId]
 */
export function personaAllowsLaugh(personaId) {
  const id = personaId || 'companion';
  if (id in PERSONA_LAUGH_ALLOWED) return !!PERSONA_LAUGH_ALLOWED[id];
  const p = getPersona(id);
  return (p.playfulness ?? 0.4) > 0.45;
}

/**
 * Contagion freshness 0..1 — repeats decay toward canned response.
 * @param {number} consecutiveCount
 * @param {number} [sinceLastSec=0]
 */
export function contagionFreshness(consecutiveCount, sinceLastSec = 0) {
  const n = Math.max(0, consecutiveCount);
  const recover = 1 - Math.exp(-Math.max(0, sinceLastSec) / CONTAGION_HALF_LIFE_SEC);
  const decay = Math.exp(-n * 0.45);
  return Math.max(0.12, Math.min(1, decay + recover * 0.35 * (1 - decay)));
}

/**
 * Mouth-openness 0..1 from morph weights (drives squint relief + cheek attenuation).
 * @param {Record<string, number>} morphs
 */
export function mouthOpennessFromMorphs(morphs) {
  let open = 0;
  for (const k of SMILE_OPEN_KEYS) {
    open = Math.max(open, morphs[k] || 0);
  }
  return open;
}

/**
 * Pixar-style post-process: cap orbital squint / nasolabial drivers while keeping jaw open.
 * More mouth openness → less eye squint & cheek stack (face points stay forward, not pulled back).
 * @param {Record<string, number>} morphs
 * @param {{ kind?: 'smile'|'laughter', intensity?: number }} [opts]
 */
export function applyYouthfulSmileBias(morphs, opts = {}) {
  if (!morphs || !Object.keys(morphs).length) return morphs || {};
  const kind = opts.kind || 'smile';
  const cfg = YOUTHFUL_SMILE_BIAS;
  const open = mouthOpennessFromMorphs(morphs);
  /** @type {Record<string, number>} */
  const out = { ...morphs };

  const squintCap = kind === 'laughter' ? cfg.squintCapLaugh : cfg.squintCapSmile;
  const openRelief = 1 - open * (cfg.squintOpenRelief ?? 0.85);
  const effCap = squintCap * Math.max(0.3, openRelief);
  for (const k of SMILE_SQUINT_KEYS) {
    if (out[k] != null) out[k] = Math.min(out[k], effCap);
  }

  const cheekAtten = 1 - open * (cfg.cheekAttenuationOpen ?? 0.42);
  for (const k of SMILE_CHEEK_KEYS) {
    if (out[k] != null) out[k] *= Math.max(0.5, cheekAtten);
  }

  if (kind === 'laughter') {
    const boost = (cfg.openBoostLaugh ?? 0.1) * Math.max(0, Math.min(1.25, opts.intensity ?? 1));
    if (out.Expressions_mouthOpenLarge_max != null) {
      out.Expressions_mouthOpenLarge_max = Math.min(1, out.Expressions_mouthOpenLarge_max + boost);
    }
    if (out.Expressions_mouthSmileOpen_max != null) {
      out.Expressions_mouthSmileOpen_max = Math.min(1, out.Expressions_mouthSmileOpen_max + boost * 0.55);
    }
  }

  return out;
}

/**
 * Merge happy-family base emotion sculpt with smile typology — avoid double-stacking
 * wrinkle-prone channels (Math.max was pushing squint/cheek past recipe intent).
 * @param {Record<string, number>} base
 * @param {Record<string, number>} overlay smile / laughter morphs
 * @param {{ kind?: 'smile'|'laughter', intensity?: number }} [opts]
 */
export function mergeHappyFamilyMorphs(base, overlay, opts = {}) {
  /** @type {Record<string, number>} */
  const out = { ...(base || {}) };
  if (!overlay || !Object.keys(overlay).length) {
    return applyYouthfulSmileBias(out, opts);
  }

  const owned = new Set([...SMILE_SQUINT_KEYS, ...SMILE_CHEEK_KEYS]);
  const openSet = new Set(SMILE_OPEN_KEYS);
  for (const [k, v] of Object.entries(overlay)) {
    if (owned.has(k)) out[k] = v;
    else if (openSet.has(k)) out[k] = Math.max(out[k] || 0, v);
    else out[k] = Math.max(out[k] || 0, v);
  }
  return applyYouthfulSmileBias(out, opts);
}

/**
 * Scale a morph recipe by intensity.
 * @param {Record<string, number>} recipe
 * @param {number} intensity
 * @param {string[]} [available]
 * @param {{ kind?: 'smile'|'laughter' }} [biasOpts]
 */
export function scaleSmileRecipe(recipe, intensity = 1, available, biasOpts) {
  const t = Math.max(0, Math.min(1.25, intensity));
  const allow = available ? new Set(available) : null;
  /** @type {Record<string, number>} */
  const out = {};
  for (const [k, v] of Object.entries(recipe || {})) {
    if (allow && !allow.has(k)) continue;
    out[k] = Math.min(1, Number(v) * t);
  }
  return applyYouthfulSmileBias(out, { ...biasOpts, intensity: t });
}

/**
 * Evaluate a smile subtype (not full laughter).
 * @param {'reward'|'affiliative'|'dominance'|string} smileType
 * @param {number} [intensity=0.7]
 * @param {{ personaId?: string, availableMorphs?: string[] }} [opts]
 */
export function evaluateSmile(smileType, intensity = 0.7, opts = {}) {
  let type = smileType;
  if (!SMILE_TYPES[type] || type === 'laughter') {
    type = defaultSmileForPersona(opts.personaId);
  }
  const def = SMILE_TYPES[type];
  const recipe = SMILE_MORPH_RECIPES[type] || SMILE_MORPH_RECIPES.reward;
  const morphs = scaleSmileRecipe(recipe, intensity, opts.availableMorphs, { kind: 'smile' });

  return applyComplianceGate(
    {
      kind: 'smile',
      smileType: type,
      label: def.label,
      duchenne: !!def.duchenne,
      symmetric: !!def.symmetric,
      facs: def.facs,
      social: def.social,
      intensity,
      morphs,
      personaId: opts.personaId || null,
    },
    {},
  );
}

/**
 * Resolve which smile to use when emotion is happy / smile_open.
 * @param {{
 *   emotion: string,
 *   intensity?: number,
 *   smileType?: string | null,
 *   personaId?: string,
 *   forceLaugh?: boolean,
 * }} opts
 */
export function resolveHappyFamily(opts) {
  const emotion = opts.emotion || 'happy';
  const intensity = opts.intensity ?? 0.7;
  const personaId = opts.personaId || 'companion';
  const requested = opts.smileType || defaultSmileForPersona(personaId);

  const isHappyFamily = emotion === 'happy' || emotion === 'smile_open';
  if (!isHappyFamily && !opts.forceLaugh) {
    return { mode: 'emotion', emotion, smileType: null, laugh: false };
  }

  const wantsLaugh =
    opts.forceLaugh ||
    requested === 'laughter' ||
    (intensity >= LAUGHTER_INTENSITY_GATE &&
      requested === 'reward' &&
      emotion === 'smile_open');

  if (wantsLaugh) {
    if (!personaAllowsLaugh(personaId) && !opts.forceLaugh) {
      return {
        mode: 'smile',
        emotion,
        smileType: 'affiliative',
        laugh: false,
        note: 'persona blocks laughter → affiliative fallback',
      };
    }
    return { mode: 'laughter', emotion, smileType: 'laughter', laugh: true };
  }

  return { mode: 'smile', emotion, smileType: requested, laugh: false };
}

/**
 * Simple PD step toward target (head → torso derivation).
 * @param {number} current
 * @param {number} target
 * @param {number} velocity
 * @param {number} dt
 * @param {{ kp?: number, kd?: number }} [gains]
 */
export function pdStep(current, target, velocity, dt, gains = {}) {
  const kp = gains.kp ?? LAUGH_BODY.pdKp;
  const kd = gains.kd ?? LAUGH_BODY.pdKd;
  const err = target - current;
  const acc = kp * err - kd * velocity;
  const v = velocity + acc * dt;
  const x = current + v * dt;
  return { value: x, velocity: v };
}

/**
 * Sample laugh body from head-dominant oscillation + PD-derived torso/shoulders.
 * @param {number} timeSec
 * @param {{
 *   intensity?: number,
 *   freshness?: number,
 *   velocity?: number,
 *   state?: { torso: number, shoulder: number, vTorso: number, vShoulder: number },
 *   dt?: number,
 * }} [opts]
 */
export function sampleLaughBody(timeSec, opts = {}) {
  const intensity = Math.max(0, Math.min(1.25, opts.intensity ?? 1));
  const freshness = Math.max(0.12, Math.min(1, opts.freshness ?? 1));
  const velScale = opts.velocity ?? 1;
  const hz = LAUGH_BODY.headBobHz * velScale;
  const amp = LAUGH_BODY.headBobAmp * intensity * freshness;
  const head = Math.sin(timeSec * Math.PI * 2 * hz) * amp;
  // Pulse breath — bursty, not just fast accessory breathing
  const pulse =
    Math.max(0, Math.sin(timeSec * Math.PI * 2 * hz)) *
    LAUGH_BODY.pulseBreathAmp *
    intensity *
    freshness;

  const dt = opts.dt ?? 1 / 60;
  const state = opts.state || { torso: 0, shoulder: 0, vTorso: 0, vShoulder: 0 };
  const torsoTarget = head * LAUGH_BODY.torsoGain;
  const shoulderTarget = head * LAUGH_BODY.shoulderGain + pulse * 0.15;
  const torso = pdStep(state.torso, torsoTarget, state.vTorso, dt);
  const shoulder = pdStep(state.shoulder, shoulderTarget, state.vShoulder, dt);

  return {
    headPitch: head,
    headRoll: head * 0.15,
    torsoBend: torso.value,
    shoulderShake: shoulder.value,
    pulseBreath: pulse,
    state: {
      torso: torso.value,
      shoulder: shoulder.value,
      vTorso: torso.velocity,
      vShoulder: shoulder.velocity,
    },
    intensity,
    freshness,
  };
}

/**
 * Full laughter evaluation: face morphs + body sample.
 * @param {number} intensity
 * @param {{
 *   timeSec?: number,
 *   consecutive?: number,
 *   sinceLastSec?: number,
 *   personaId?: string,
 *   availableMorphs?: string[],
 *   dt?: number,
 *   pdState?: object,
 *   velocity?: number,
 * }} [opts]
 */
export function evaluateLaugh(intensity = 1, opts = {}) {
  const personaId = opts.personaId || 'companion';
  const allowed = personaAllowsLaugh(personaId);
  const freshness = contagionFreshness(opts.consecutive ?? 0, opts.sinceLastSec ?? 0);
  const effIntensity = intensity * freshness * (allowed ? 1 : 0.35);
  const morphs = scaleSmileRecipe(SMILE_MORPH_RECIPES.laughter, effIntensity, opts.availableMorphs, {
    kind: 'laughter',
  });
  const body = sampleLaughBody(opts.timeSec ?? 0, {
    intensity: effIntensity,
    freshness,
    velocity: opts.velocity ?? 1,
    state: opts.pdState,
    dt: opts.dt,
  });

  return applyComplianceGate(
    {
      kind: 'laughter',
      smileType: 'laughter',
      label: SMILE_TYPES.laughter.label,
      intensity: effIntensity,
      requestedIntensity: intensity,
      freshness,
      allowed,
      morphs,
      body,
      personaId,
      note: allowed ? null : 'persona restricts laughter intensity',
    },
    {},
  );
}

/**
 * Morph weights for happy-family resolution (smile subtype or laughter).
 * @param {{
 *   emotion: string,
 *   intensity?: number,
 *   smileType?: string | null,
 *   personaId?: string,
 *   forceLaugh?: boolean,
 *   availableMorphs?: string[],
 * }} opts
 */
export function happyFamilyMorphWeights(opts) {
  const resolved = resolveHappyFamily(opts);
  if (resolved.mode === 'laughter') {
    return evaluateLaugh(opts.intensity ?? 1, {
      personaId: opts.personaId,
      availableMorphs: opts.availableMorphs,
      consecutive: 0,
    });
  }
  if (resolved.mode === 'smile') {
    return evaluateSmile(resolved.smileType, opts.intensity ?? 0.7, {
      personaId: opts.personaId,
      availableMorphs: opts.availableMorphs,
    });
  }
  return null;
}

/**
 * Apply laugh body sample onto Sakura bones (additive on rest).
 * @param {Record<string, { rotation: { x: number, y: number, z: number } }>} boneMap
 * @param {Record<string, { x: number, y: number, z: number }>} restRotations
 * @param {ReturnType<typeof sampleLaughBody>} body
 * @param {number} [alpha=1]
 */
export function applyLaughBones(boneMap, restRotations, body, alpha = 1) {
  const a = Math.max(0, Math.min(1, alpha));
  const add = (name, dx, dy, dz) => {
    const bone = boneMap[name];
    const rest = restRotations[name];
    if (!bone || !rest) return;
    bone.rotation.x = rest.x + dx * a;
    bone.rotation.y = rest.y + dy * a;
    bone.rotation.z = rest.z + dz * a;
  };
  // Head-dominant
  add('head', body.headPitch, 0, body.headRoll);
  add('neck', body.headPitch * 0.45, 0, body.headRoll * 0.3);
  // PD-derived torso / shoulders
  add('spine03', body.torsoBend, 0, 0);
  add('spine02', body.torsoBend * 0.6, 0, 0);
  add('clavicle_L', -body.shoulderShake, body.shoulderShake * 0.4, body.pulseBreath * 0.1);
  add('clavicle_R', -body.shoulderShake, -body.shoulderShake * 0.4, -body.pulseBreath * 0.1);
}

/**
 * Stateful laughter / smile controller for Face Live.
 */
export class SmileLaughController {
  /**
   * @param {{ personaId?: string, smileType?: string }} [opts]
   */
  constructor(opts = {}) {
    this.personaId = opts.personaId || 'companion';
    this.smileType = opts.smileType || defaultSmileForPersona(this.personaId);
    this.laughing = false;
    this.laughIntensity = 1;
    this.consecutive = 0;
    this.sinceLast = 999;
    this.time = 0;
    this.pdState = { torso: 0, shoulder: 0, vTorso: 0, vShoulder: 0 };
  }

  /** @param {string} personaId */
  setPersona(personaId) {
    this.personaId = personaId;
    if (!this.laughing) {
      this.smileType = defaultSmileForPersona(personaId);
    }
  }

  /** @param {string} type */
  setSmileType(type) {
    if (SMILE_TYPES[type]) this.smileType = type;
  }

  /**
   * @param {number} [intensity=1]
   */
  startLaugh(intensity = 1) {
    if (this.sinceLast < 1.2) this.consecutive += 1;
    else this.consecutive = 0;
    this.sinceLast = 0;
    this.laughing = true;
    this.laughIntensity = intensity;
    this.smileType = 'laughter';
  }

  stopLaugh() {
    this.laughing = false;
    this.smileType = defaultSmileForPersona(this.personaId);
  }

  /**
   * @param {number} dt
   * @param {{ emotion?: string, intensity?: number, availableMorphs?: string[] }} [ctx]
   */
  tick(dt, ctx = {}) {
    this.time += dt;
    this.sinceLast += dt;
    const emotion = ctx.emotion || 'happy';
    const intensity = ctx.intensity ?? 0.7;

    if (this.laughing) {
      const out = evaluateLaugh(this.laughIntensity, {
        timeSec: this.time,
        consecutive: this.consecutive,
        sinceLastSec: 0,
        personaId: this.personaId,
        availableMorphs: ctx.availableMorphs,
        dt,
        pdState: this.pdState,
      });
      this.pdState = out.body.state;
      return { ...out, active: true };
    }

    const resolved = resolveHappyFamily({
      emotion,
      intensity,
      smileType: this.smileType,
      personaId: this.personaId,
    });

    if (resolved.laugh) {
      this.startLaugh(intensity);
      return this.tick(0, ctx);
    }

    if (resolved.mode === 'smile') {
      const smile = evaluateSmile(resolved.smileType, intensity, {
        personaId: this.personaId,
        availableMorphs: ctx.availableMorphs,
      });
      return { ...smile, active: true, body: null };
    }

    return {
      kind: 'smile',
      active: false,
      smileType: null,
      morphs: {},
      body: null,
    };
  }
}

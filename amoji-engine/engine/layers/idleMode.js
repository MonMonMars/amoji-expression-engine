/**
 * Layer I — Idle Mode: breath ladder, persona signatures, 90s variant rotation.
 */
import catalog from '../../data/personas/catalog.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const PERSONAS = catalog.personas;
export const AROUSAL_LADDER = catalog.arousalLadder;
export const VARIANT_ROTATE_SEC = catalog.variantRotateSec;

/**
 * @param {string} personaId
 */
export function getPersona(personaId) {
  return PERSONAS[personaId] || PERSONAS.companion;
}

/**
 * Resolve breath params for persona + arousal band.
 * @param {string} personaId
 * @param {'calm'|'alert'|'tense'|'exhausted'} [arousal='calm']
 */
export function resolveBreath(personaId, arousal = 'calm') {
  const p = getPersona(personaId);
  const ladder = AROUSAL_LADDER[arousal] || AROUSAL_LADDER.calm;
  const [bpmLo, bpmHi] = p.bpm;
  const bpmBase = (bpmLo + bpmHi) / 2;
  const bpm = bpmBase * ladder.bpmMul;
  return {
    personaId,
    arousal,
    bpm,
    breathDepth: p.breathDepth * ladder.depthMul,
    breathRegularity: p.breathRegularity,
    accessoryMuscleActivation: ladder.accessory,
    shoulderMicroLift: ladder.accessory * (bpm / 20),
    saccadeAmp: p.saccadeAmp,
    headDrift: p.headDrift,
    playfulness: p.playfulness,
  };
}

/**
 * Pick idle variant by elapsed time (90s rule).
 * @param {string} personaId
 * @param {number} elapsedSec
 */
export function pickIdleVariant(personaId, elapsedSec) {
  const p = getPersona(personaId);
  const variants = p.variants || ['breath'];
  const idx = Math.floor(Math.max(0, elapsedSec) / VARIANT_ROTATE_SEC) % variants.length;
  return {
    variant: variants[idx],
    index: idx,
    rotateSec: VARIANT_ROTATE_SEC,
    nextSwitchIn: VARIANT_ROTATE_SEC - (elapsedSec % VARIANT_ROTATE_SEC),
  };
}

/**
 * Evaluate idle pose offsets at time t (seconds).
 * Returns abstract channels Face Live / renderers can apply.
 * @param {number} t
 * @param {{
 *   personaId?: string,
 *   arousal?: 'calm'|'alert'|'tense'|'exhausted',
 *   elapsedForVariants?: number,
 * }} [opts]
 */
export function evaluateIdle(t, opts = {}) {
  const personaId = opts.personaId || 'companion';
  const arousal = opts.arousal || 'calm';
  const elapsed = opts.elapsedForVariants ?? t;
  const breath = resolveBreath(personaId, arousal);
  const variantInfo = pickIdleVariant(personaId, elapsed);
  const variant = variantInfo.variant;

  const bpm = breath.bpm;
  const phase = (t * bpm) / 60; // breath cycles
  // irregularity: jitter phase
  const irreg = (1 - breath.breathRegularity) * Math.sin(t * 1.7) * 0.15;
  const inhale = Math.sin((phase + irreg) * Math.PI * 2);

  let chest = inhale * 0.012 * breath.breathDepth; // ~1.2cm scale proxy
  let shoulder = Math.max(0, inhale) * 0.008 * breath.shoulderMicroLift;
  let headY = inhale * 0.003 * breath.headDrift;
  let headYaw = 0;
  let lookX = 0;
  let lookY = 0;
  let softSmile = 0;

  switch (variant) {
    case 'lookAround':
      lookX = Math.sin(t * 0.35) * breath.saccadeAmp;
      lookY = Math.sin(t * 0.22 + 1.2) * breath.saccadeAmp * 0.5;
      headYaw = lookX * 0.35;
      break;
    case 'headBob':
      headY += Math.sin(t * 0.9) * 0.006 * breath.playfulness;
      break;
    case 'microShift':
      headYaw = Math.sin(t * 0.15) * 0.04;
      chest *= 0.85;
      break;
    case 'softSmile':
      softSmile = 0.12 * breath.playfulness;
      break;
    case 'softAttend':
      lookY = 0.05;
      softSmile = 0.06;
      break;
    case 'still':
      chest *= 0.55;
      shoulder *= 0.4;
      break;
    case 'breath':
    default:
      break;
  }

  const raw = {
    kind: 'idle',
    personaId,
    arousal,
    variant: variantInfo.variant,
    variantIndex: variantInfo.index,
    nextVariantIn: variantInfo.nextSwitchIn,
    breath,
    channels: {
      chest,
      shoulder,
      headY,
      headYaw,
      lookX,
      lookY,
      softSmile,
      scalePulse: 1 + chest * 0.15,
    },
  };

  return applyComplianceGate(raw, {});
}

/**
 * Stateful idle clock for realtime loops.
 */
export class IdleController {
  /**
   * @param {{ personaId?: string, arousal?: string }} [opts]
   */
  constructor(opts = {}) {
    this.personaId = opts.personaId || 'companion';
    this.arousal = opts.arousal || 'calm';
    this.elapsed = 0;
  }

  setPersona(id) {
    this.personaId = id;
  }

  setArousal(band) {
    this.arousal = band;
  }

  /**
   * @param {number} dt
   */
  tick(dt) {
    this.elapsed += dt;
    return evaluateIdle(this.elapsed, {
      personaId: this.personaId,
      arousal: /** @type {any} */ (this.arousal),
      elapsedForVariants: this.elapsed,
    });
  }
}

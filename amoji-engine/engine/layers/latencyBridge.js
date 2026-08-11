/**
 * Layer T — Latency Bridging: tiered gaze / fillers / adaptors while waiting on AI.
 */
import fillerData from '../../data/fillers/filler-pools.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { getPersona } from './idleMode.js';

export const LATENCY_THRESHOLDS = fillerData.thresholdsSec;
export const FILLER_POOLS = fillerData.pools;

/**
 * @param {number} elapsedSec
 * @returns {'none'|'gaze'|'pensive'|'secondary'}
 */
export function latencyTier(elapsedSec) {
  const t = Math.max(0, elapsedSec);
  if (t < LATENCY_THRESHOLDS.none) return 'none';
  if (t < LATENCY_THRESHOLDS.gaze) return 'gaze';
  if (t < LATENCY_THRESHOLDS.pensive) return 'pensive';
  return 'secondary';
}

/**
 * @param {string} personaId
 * @param {'pensive'|'secondary'|'ack'} kind
 * @param {{ used?: Set<string>, contextHint?: string }} [opts]
 */
export function pickFiller(personaId, kind, opts = {}) {
  const poolKey = FILLER_POOLS[personaId]
    ? personaId
    : personaId === 'home' || personaId === 'education'
      ? 'companion'
      : 'default';
  const pool = FILLER_POOLS[poolKey] || FILLER_POOLS.default;
  let list = pool[kind] || FILLER_POOLS.default[kind] || [];
  const used = opts.used;
  if (used && used.size) {
    const fresh = list.filter((f) => !used.has(f.zh));
    if (fresh.length) list = fresh;
  }
  const pick = list[Math.floor(Math.random() * list.length)] || { zh: '⋯', en: '...' };
  if (used) used.add(pick.zh);

  let textZh = pick.zh;
  let textEn = pick.en;
  if (opts.contextHint && kind === 'pensive') {
    const hint = String(opts.contextHint).slice(0, 18);
    textZh = `等我睇下「${hint}」⋯`;
    textEn = `Let me check “${hint}”...`;
  }
  return { ...pick, zh: textZh, en: textEn, kind, personaId: poolKey };
}

/**
 * Active improvisation within persona bounds (never overrides a ready script line).
 * @param {{
 *   stimulus: 'interrupt'|'noise'|'touch'|'unknown',
 *   mood?: string,
 *   personaId?: string,
 * }} opts
 */
export function improviseReaction(opts) {
  const persona = getPersona(opts.personaId || 'companion');
  const play = persona.playfulness ?? 0.4;
  const stimulus = opts.stimulus || 'unknown';
  /** @type {{ emotion: string, intensity: number, adaptor: string, note: string }} */
  let reaction = {
    emotion: 'surprised',
    intensity: 0.25 + play * 0.2,
    adaptor: 'headTurn',
    note: 'micro acknowledge',
  };
  if (stimulus === 'interrupt') {
    reaction = {
      emotion: play > 0.5 ? 'happy' : 'thinking',
      intensity: 0.2 + play * 0.15,
      adaptor: 'headTurn',
      note: 'yield floor briefly',
    };
  } else if (stimulus === 'noise') {
    reaction = {
      emotion: 'fear',
      intensity: 0.15 + (1 - (persona.breathRegularity ?? 0.8)) * 0.2,
      adaptor: 'napeTouch',
      note: 'orient to sound',
    };
  } else if (stimulus === 'touch') {
    reaction = {
      emotion: 'surprised',
      intensity: 0.3,
      adaptor: 'chinTouch',
      note: 'startle then soften',
    };
  }
  if (opts.mood === 'sad' || opts.mood === 'fear') {
    reaction.intensity *= 0.7;
  }
  return applyComplianceGate(
    { kind: 'improvised_reaction', stimulus, ...reaction, personaId: opts.personaId },
    {},
  );
}

/**
 * Stateful wait clock for AI latency demos.
 */
export class LatencyBridge {
  /**
   * @param {{ personaId?: string, lang?: 'zh'|'en' }} [opts]
   */
  constructor(opts = {}) {
    this.personaId = opts.personaId || 'companion';
    this.lang = opts.lang || 'zh';
    this.elapsed = 0;
    this.active = false;
    this.tier = 'none';
    this.filler = null;
    this.secondaryFiller = null;
    this.adaptor = null;
    this.usedFillers = new Set();
    this.recovering = false;
    this.recoverT = 0;
    this.contextHint = '';
  }

  /**
   * @param {{ contextHint?: string }} [opts]
   */
  start(opts = {}) {
    this.active = true;
    this.elapsed = 0;
    this.tier = 'none';
    this.filler = null;
    this.secondaryFiller = null;
    this.adaptor = null;
    this.recovering = false;
    this.recoverT = 0;
    this.contextHint = opts.contextHint || '';
  }

  /** AI response arrived — brief focused-idle recovery before new emotion. */
  resolve() {
    if (!this.active && !this.recovering) return;
    this.active = false;
    this.recovering = true;
    this.recoverT = 0;
  }

  /**
   * @param {number} dt
   */
  tick(dt) {
    if (this.recovering) {
      this.recoverT += dt;
      const done = this.recoverT >= (fillerData.recoveryMs || 280) / 1000;
      if (done) this.recovering = false;
      return applyComplianceGate(
        {
          kind: 'latency',
          phase: 'recovery',
          tier: 'none',
          lookY: 0.05,
          lookX: 0,
          pupilDilate: 0,
          filler: null,
          adaptor: null,
          emotionHint: 'neutral',
          intensityHint: 0.15,
          recovering: !done,
        },
        {},
      );
    }

    if (!this.active) {
      return applyComplianceGate(
        {
          kind: 'latency',
          phase: 'idle',
          tier: 'none',
          lookY: 0,
          lookX: 0,
          pupilDilate: 0,
          filler: null,
          adaptor: null,
          emotionHint: null,
          intensityHint: 0,
          recovering: false,
        },
        {},
      );
    }

    this.elapsed += dt;
    const tier = latencyTier(this.elapsed);
    this.tier = tier;

    let lookY = 0;
    let lookX = 0;
    let pupilDilate = 0;
    if (tier === 'gaze' || tier === 'pensive' || tier === 'secondary') {
      lookY = 0.12 + Math.min(0.35, this.elapsed * 0.08);
      lookX = Math.sin(this.elapsed * 0.7) * 0.15;
      pupilDilate = Math.min(0.35, Math.max(0, this.elapsed - 0.3) * 0.08);
    }

    if (tier === 'pensive' && !this.filler) {
      this.filler = pickFiller(this.personaId, 'pensive', {
        used: this.usedFillers,
        contextHint: this.contextHint,
      });
      this.adaptor =
        fillerData.adaptors[Math.floor(Math.random() * fillerData.adaptors.length)];
    }
    if (tier === 'secondary' && !this.secondaryFiller) {
      this.secondaryFiller = pickFiller(this.personaId, 'secondary', {
        used: this.usedFillers,
      });
    }

    const spoken =
      tier === 'secondary'
        ? this.secondaryFiller
        : tier === 'pensive'
          ? this.filler
          : null;

    return applyComplianceGate(
      {
        kind: 'latency',
        phase: 'waiting',
        tier,
        elapsed: this.elapsed,
        lookY,
        lookX,
        pupilDilate,
        filler: spoken
          ? { ...spoken, text: this.lang === 'en' ? spoken.en : spoken.zh }
          : null,
        adaptor: this.adaptor,
        emotionHint: tier === 'none' ? null : 'thinking',
        intensityHint: tier === 'none' ? 0 : Math.min(0.7, 0.25 + this.elapsed * 0.12),
        recovering: false,
      },
      {},
    );
  }
}

/**
 * Layer D — Actor's Discretion Engine.
 * Continuity (given circumstances), passive mood leak bridge, active improvisation.
 * Improvisation NEVER overrides an arrived script line — only fills gaps.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { getPersona } from './idleMode.js';
import { improviseReaction } from './latencyBridge.js';
import { moodSignatureLeak } from './moodEngine.js';

export const CONTINUITY_DECAY_HALF_LIFE_SEC = 2.8;
export const IMPROV_COOLDOWN_SEC = 1.6;

/**
 * Personality profile used to bound improvisation (from persona catalog).
 * @param {string} [personaId]
 */
export function personalityProfile(personaId) {
  const p = getPersona(personaId || 'companion');
  return {
    personaId: personaId || 'companion',
    playfulness: p.playfulness ?? 0.4,
    assertiveness: p.assertiveness ?? 0.4,
    emotionalStability: p.emotionalStability ?? 0.7,
    defensiveness: p.defensiveness ?? 0.3,
    easterEggsAllowed: !!p.easterEggsAllowed,
  };
}

/**
 * Emotional continuity: blend previous residual into the new line unless Step-Out.
 * @param {{
 *   emotion: string,
 *   intensity: number,
 *   previous?: { emotion: string, intensity: number } | null,
 *   stepOutBefore?: boolean,
 *   personaId?: string,
 * }} opts
 */
export function applyContinuity(opts) {
  const stepOut = !!opts.stepOutBefore;
  const profile = personalityProfile(opts.personaId);
  if (stepOut || !opts.previous) {
    return applyComplianceGate(
      {
        kind: 'continuity',
        emotion: opts.emotion,
        intensity: opts.intensity,
        residual: null,
        steppedOut: stepOut,
        blend: 0,
      },
      {},
    );
  }

  // Assertive personas keep more residue; stable personas blend smoother/lower
  const retain =
    0.25 + profile.assertiveness * 0.35 - (profile.emotionalStability - 0.5) * 0.1;
  const blend = Math.max(0.12, Math.min(0.55, retain));
  const same = opts.previous.emotion === opts.emotion;
  const residualIntensity = opts.previous.intensity * blend * (same ? 0.85 : 1);
  const intensity = Math.min(
    1.25,
    opts.intensity * (1 - blend * 0.25) + (same ? residualIntensity * 0.35 : 0),
  );

  return applyComplianceGate(
    {
      kind: 'continuity',
      emotion: opts.emotion,
      intensity,
      residual: {
        emotion: opts.previous.emotion,
        intensity: residualIntensity,
      },
      steppedOut: false,
      blend,
    },
    {},
  );
}

/**
 * Passive leakage: mood signature continuously under dialogue emotion.
 * @param {string} moodId
 * @param {number} baseline
 * @param {string[]} [availableMorphs]
 */
export function passiveMoodLeak(moodId, baseline = 0.3, availableMorphs) {
  const morphs = moodSignatureLeak(moodId, baseline * 0.55, availableMorphs);
  return applyComplianceGate(
    {
      kind: 'passive_leak',
      mood: moodId,
      baseline,
      morphs,
    },
    {},
  );
}

/**
 * Decide whether a gap exists for improvisation (no pending script).
 * @param {{
 *   allowImprovisation?: boolean,
 *   scriptPending?: boolean,
 *   gapSec?: number,
 *   personaId?: string,
 * }} opts
 */
export function canImprovise(opts = {}) {
  if (opts.allowImprovisation === false) return false;
  if (opts.scriptPending) return false; // director has the floor
  const profile = personalityProfile(opts.personaId);
  const minGap = 0.35 + (1 - profile.assertiveness) * 0.9;
  return (opts.gapSec ?? 0) >= minGap;
}

/**
 * Active improvisation — fills gaps only; capped by personality.
 * @param {{
 *   stimulus: string,
 *   mood?: string,
 *   personaId?: string,
 *   allowImprovisation?: boolean,
 *   scriptPending?: boolean,
 *   gapSec?: number,
 * }} opts
 */
export function discretionaryImprovise(opts) {
  if (!canImprovise(opts)) {
    return applyComplianceGate(
      {
        kind: 'improvised_reaction',
        blocked: true,
        reason: opts.scriptPending
          ? 'script_pending_has_priority'
          : opts.allowImprovisation === false
            ? 'improvisation_disabled'
            : 'gap_too_short',
        stimulus: opts.stimulus,
      },
      {},
    );
  }

  const profile = personalityProfile(opts.personaId);
  const raw = improviseReaction({
    stimulus: opts.stimulus,
    mood: opts.mood,
    personaId: opts.personaId,
  });

  // Cap intensity by stability / defensiveness
  const cap =
    0.15 +
    profile.playfulness * 0.25 +
    profile.assertiveness * 0.15 -
    profile.emotionalStability * 0.08;
  const intensity = Math.min(raw.intensity, Math.max(0.12, cap));
  // Defensive personas prefer thinking/fear over playful happy on interrupt
  let emotion = raw.emotion;
  if (profile.defensiveness > 0.4 && opts.stimulus === 'interrupt' && emotion === 'happy') {
    emotion = 'thinking';
  }

  return applyComplianceGate(
    {
      ...raw,
      emotion,
      intensity,
      blocked: false,
      profile,
      note: `${raw.note} (Layer D bounded)`,
    },
    {},
  );
}

/**
 * Stateful Layer D controller.
 */
export class DiscretionController {
  /**
   * @param {{ personaId?: string, allowImprovisation?: boolean }} [opts]
   */
  constructor(opts = {}) {
    this.personaId = opts.personaId || 'companion';
    this.allowImprovisation = opts.allowImprovisation !== false;
    this.autoImprovise = !!opts.autoImprovise;
    this.autoStimulus = opts.autoStimulus || 'noise';
    this.previous = null;
    this.scriptPending = false;
    this.gapSec = 0;
    this.improvCool = 0;
    this.lastImprov = null;
    this.lastContinuity = null;
  }

  /** @param {string} personaId */
  setPersona(personaId) {
    this.personaId = personaId;
  }

  /** Director delivered / is delivering a line. */
  markScriptPending(pending = true) {
    this.scriptPending = !!pending;
    if (pending) this.gapSec = 0;
  }

  /**
   * Ingest a new script line emotion (applies continuity).
   * @param {{
   *   emotion: string,
   *   intensity: number,
   *   stepOutBefore?: boolean,
   * }} line
   */
  ingestLine(line) {
    const cont = applyContinuity({
      emotion: line.emotion,
      intensity: line.intensity,
      previous: this.previous,
      stepOutBefore: line.stepOutBefore,
      personaId: this.personaId,
    });
    this.previous = {
      emotion: cont.emotion,
      intensity: cont.intensity,
    };
    this.lastContinuity = cont;
    this.scriptPending = false;
    this.gapSec = 0;
    return cont;
  }

  /** Clear emotional continuity residue (hard cut). */
  clearContinuity() {
    this.previous = null;
    this.lastContinuity = null;
  }

  /**
   * @param {boolean} on
   * @param {string} [stimulus]
   */
  setAutoImprovise(on, stimulus) {
    this.autoImprovise = !!on;
    if (stimulus) this.autoStimulus = stimulus;
  }

  /**
   * Seconds of gap required before improvisation is allowed.
   */
  minGapSec() {
    const profile = personalityProfile(this.personaId);
    return 0.35 + (1 - profile.assertiveness) * 0.9;
  }

  /**
   * @param {number} dt
   * @param {{ mood?: string, availableMorphs?: string[], moodBaseline?: number }} [ctx]
   */
  tick(dt, ctx = {}) {
    if (!this.scriptPending) this.gapSec += dt;
    else this.gapSec = 0;
    if (this.improvCool > 0) this.improvCool = Math.max(0, this.improvCool - dt);

    const leak = ctx.mood
      ? passiveMoodLeak(ctx.mood, ctx.moodBaseline ?? 0.3, ctx.availableMorphs)
      : { morphs: {} };

    const ready = canImprovise({
      allowImprovisation: this.allowImprovisation,
      scriptPending: this.scriptPending,
      gapSec: this.gapSec,
      personaId: this.personaId,
    });

    /** @type {object|null} */
    let autoReaction = null;
    if (this.autoImprovise && ready && this.improvCool <= 0) {
      autoReaction = this.tryImprovise(this.autoStimulus, { mood: ctx.mood });
      if (autoReaction?.blocked) autoReaction = null;
    }

    const minGap = this.minGapSec();
    return applyComplianceGate(
      {
        kind: 'discretion_state',
        personaId: this.personaId,
        profile: personalityProfile(this.personaId),
        gapSec: this.gapSec,
        minGapSec: minGap,
        gapProgress: Math.min(1, this.gapSec / Math.max(1e-3, minGap)),
        scriptPending: this.scriptPending,
        allowImprovisation: this.allowImprovisation,
        autoImprovise: this.autoImprovise,
        autoStimulus: this.autoStimulus,
        canImprovise: ready,
        previous: this.previous,
        continuity: this.lastContinuity,
        leakMorphs: leak.morphs || {},
        leakCount: Object.keys(leak.morphs || {}).length,
        lastImprov: this.lastImprov,
        improvCool: this.improvCool,
        autoReaction,
      },
      {},
    );
  }

  /**
   * Try improvisation on stimulus — blocked if script pending or cooldown.
   * @param {string} stimulus
   * @param {{ mood?: string }} [opts]
   */
  tryImprovise(stimulus, opts = {}) {
    if (this.improvCool > 0) {
      return applyComplianceGate(
        {
          kind: 'improvised_reaction',
          blocked: true,
          reason: 'cooldown',
          stimulus,
        },
        {},
      );
    }
    const reaction = discretionaryImprovise({
      stimulus,
      mood: opts.mood,
      personaId: this.personaId,
      allowImprovisation: this.allowImprovisation,
      scriptPending: this.scriptPending,
      gapSec: this.gapSec,
    });
    if (!reaction.blocked) {
      this.lastImprov = reaction;
      this.improvCool = IMPROV_COOLDOWN_SEC * (1.2 - personalityProfile(this.personaId).assertiveness * 0.4);
      this.gapSec = 0;
    }
    return reaction;
  }
}

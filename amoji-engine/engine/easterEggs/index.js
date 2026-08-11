/**
 * Easter Eggs — cultural/performance myths, isolated from scientific layers.
 * Default OFF. Locked off for corporate / care / education personas.
 * NEVER use for real lie detection or credibility judgment.
 */
import catalog from '../../data/easterEggs/catalog.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { getPersona } from '../layers/idleMode.js';

export const EASTER_EGG_DISCLAIMER = catalog.disclaimer;
export const EASTER_EGGS = catalog.eggs;

/**
 * @param {string} personaId
 */
export function personaAllowsEasterEggs(personaId) {
  const p = getPersona(personaId || 'companion');
  return !!p.easterEggsAllowed;
}

/**
 * @param {string} eggId
 */
export function getEasterEgg(eggId) {
  return EASTER_EGGS[eggId] || null;
}

/**
 * List eggs with enablement resolved for persona.
 * @param {string} [personaId]
 * @param {Record<string, boolean>} [overrides]
 */
export function listEasterEggs(personaId = 'companion', overrides = {}) {
  const allowed = personaAllowsEasterEggs(personaId);
  return Object.values(EASTER_EGGS).map((egg) => {
    const userOn = overrides[egg.id] ?? egg.enabledDefault;
    const enabled = allowed && !!userOn;
    return {
      id: egg.id,
      label: egg.label,
      enabled,
      lockedOff: !allowed,
      disclaimer: egg.disclaimer,
      debunkedBy: egg.debunkedBy,
    };
  });
}

/**
 * Resolve a staging cue if egg is enabled — returns null when off/locked.
 * @param {string} eggId
 * @param {string} behaviorKey
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function resolveEasterEgg(eggId, behaviorKey, opts = {}) {
  const egg = getEasterEgg(eggId);
  if (!egg) {
    return applyComplianceGate(
      { kind: 'easter_egg', error: 'unknown_egg', eggId },
      {},
    );
  }
  const personaId = opts.personaId || 'companion';
  const allowed = personaAllowsEasterEggs(personaId);
  const enabled = allowed && (opts.enabled ?? egg.enabledDefault);
  if (!enabled) {
    return applyComplianceGate(
      {
        kind: 'easter_egg',
        eggId,
        enabled: false,
        lockedOff: !allowed,
        disclaimer: EASTER_EGG_DISCLAIMER,
        behavior: null,
      },
      {},
    );
  }
  const behavior = egg.behaviors?.[behaviorKey] || null;
  return applyComplianceGate(
    {
      kind: 'easter_egg',
      eggId,
      enabled: true,
      lockedOff: false,
      disclaimer: egg.disclaimer,
      catalogDisclaimer: EASTER_EGG_DISCLAIMER,
      behaviorKey,
      behavior,
      scientific: false,
    },
    {},
  );
}

/**
 * NLP gaze myth helper — only when explicitly enabled.
 * @param {'constructing_or_evasive'|'recalling_memory'} kind
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function nlpGazeCue(kind, opts = {}) {
  return resolveEasterEgg('nlpGazeConvention', kind, opts);
}

/**
 * Nose-touch "tell" myth — adaptor cue only.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function noseTouchCue(opts = {}) {
  return resolveEasterEgg('noseTouchTell', 'perform_tell', opts);
}

/**
 * Gaze aversion = guilt myth.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function gazeAversionCue(opts = {}) {
  return resolveEasterEgg('gazeAversionGuilt', 'stage_avert', opts);
}

/**
 * Crossed arms = closed-off myth.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function crossedArmsCue(opts = {}) {
  return resolveEasterEgg('crossedArmsClosed', 'stage_cross', opts);
}

/**
 * Chin-touch = deep thought myth.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function chinTouchThinkingCue(opts = {}) {
  return resolveEasterEgg('chinTouchThinking', 'stage_think', opts);
}

/**
 * Nape-touch = anxiety tell myth.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function napeTouchAnxietyCue(opts = {}) {
  return resolveEasterEgg('napeTouchAnxietyTell', 'stage_nervous', opts);
}

/**
 * Open palms = honesty myth.
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 */
export function openPalmHonestyCue(opts = {}) {
  return resolveEasterEgg('openPalmHonesty', 'stage_sincere', opts);
}

/**
 * Apply enabled egg behavior → runtime cue deltas for Face Live / gesture layers.
 * Returns null behavior fields when egg is off/locked/ui-only.
 *
 * @param {string} eggId
 * @param {string} behaviorKey
 * @param {{ personaId?: string, enabled?: boolean }} [opts]
 * @returns {ReturnType<typeof resolveEasterEgg> & {
 *   lookX: number|null,
 *   lookY: number|null,
 *   gaze: string|null,
 *   adaptor: string|null,
 *   pose: string|null,
 *   applied: boolean,
 * }}
 */
export function applyEasterEggCue(eggId, behaviorKey, opts = {}) {
  const resolved = resolveEasterEgg(eggId, behaviorKey, opts);
  const b = resolved.behavior || null;
  const lookX = typeof b?.lookX === 'number' ? b.lookX : null;
  const lookY = typeof b?.lookY === 'number' ? b.lookY : null;
  const gaze = typeof b?.gaze === 'string' ? b.gaze : null;
  const adaptor = typeof b?.adaptor === 'string' ? b.adaptor : null;
  const pose = typeof b?.pose === 'string' ? b.pose : null;
  const applied = !!(
    resolved.enabled &&
    b &&
    (lookX != null || lookY != null || gaze || adaptor || pose)
  );
  return applyComplianceGate(
    {
      ...resolved,
      lookX,
      lookY,
      gaze,
      adaptor,
      pose,
      applied,
    },
    {},
  );
}

/**
 * Merge several enabled egg overrides into one staging cue bag.
 * Later eggs overwrite earlier look/gaze when both set.
 *
 * @param {Array<{ eggId: string, behaviorKey: string, enabled?: boolean }>} selections
 * @param {{ personaId?: string }} [opts]
 */
export function mergeEasterEggCues(selections, opts = {}) {
  /** @type {{ lookX: number|null, lookY: number|null, gaze: string|null, adaptor: string|null, pose: string|null, active: string[] }} */
  const out = {
    lookX: null,
    lookY: null,
    gaze: null,
    adaptor: null,
    pose: null,
    active: [],
  };
  for (const sel of selections || []) {
    if (!sel?.eggId || !sel?.behaviorKey) continue;
    const cue = applyEasterEggCue(sel.eggId, sel.behaviorKey, {
      personaId: opts.personaId,
      enabled: sel.enabled,
    });
    if (!cue.applied) continue;
    out.active.push(sel.eggId);
    if (cue.lookX != null) out.lookX = cue.lookX;
    if (cue.lookY != null) out.lookY = cue.lookY;
    if (cue.gaze) out.gaze = cue.gaze;
    if (cue.adaptor) out.adaptor = cue.adaptor;
    if (cue.pose) out.pose = cue.pose;
  }
  return applyComplianceGate(
    {
      kind: 'easter_egg_merge',
      scientific: false,
      disclaimer: EASTER_EGG_DISCLAIMER,
      ...out,
    },
    {},
  );
}

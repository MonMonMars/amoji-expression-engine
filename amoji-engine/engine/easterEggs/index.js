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

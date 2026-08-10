/**
 * Crisis intervention module (Phase 0 shell — logic in Phase 6).
 * Highest priority: can fully override engine output.
 * Detection logic is confidential and must be designed carefully to limit false positives/negatives.
 */
export class CrisisInterventionModule {
  /** @param {Record<string, unknown>} [config] */
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * @param {string} [_userText]
   * @returns {{ triggered: boolean, kind?: string }}
   */
  scanForDistressSignals(_userText = '') {
    return { triggered: false };
  }

  /**
   * @param {{ triggered: boolean, kind?: string }} detectedCrisis
   * @returns {import('../types.js').EngineOutput}
   */
  overrideResponse(detectedCrisis) {
    return {
      kind: 'crisis_override',
      emotion: 'concerned',
      intensity: 0.4,
      params: null,
      meta: { crisis: detectedCrisis, compliance: 'crisis_intervention' },
    };
  }
}

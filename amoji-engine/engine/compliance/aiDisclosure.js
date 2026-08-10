/**
 * AI identity disclosure module (Phase 0 shell — logic in Phase 6).
 * Required by EU AI Act Art.50 / CN anthropomorphic AI rules / product ethics.
 */
export class AIDisclosureModule {
  /** @param {Record<string, unknown>} [config] */
  constructor(config = {}) {
    this.config = config;
  }

  /** @param {import('../types.js').UserContext} [_userContext] */
  onSessionStart(_userContext) {
    /* Phase 6 */
  }

  /**
   * @param {number} _sessionDuration
   * @param {boolean} [_isMinor]
   */
  onPeriodicCheck(_sessionDuration, _isMinor = false) {
    /* Phase 6 */
  }
}

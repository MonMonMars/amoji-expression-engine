/**
 * Prefs deep-link landing toast — summarize #flp= hash restore for Face Live.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  normalizeFaceLivePrefs,
  summarizeDisneyExtremePrefs,
} from './faceLivePrefs.js';
import { evaluatePrefsLinkExpiry } from './prefsLinkExpiry.js';
import { formatProbeToastFeedbackSummary } from './probeToastFeedback.js';

export const PREFS_LANDING_DISMISS_MS = 4200;

/**
 * Human-readable one-line summary of restored prefs.
 * @param {object} prefs
 */
export function formatPrefsLandingSummary(prefs) {
  const p = normalizeFaceLivePrefs(prefs);
  const extreme = summarizeDisneyExtremePrefs(p);
  const bits = [
    p.emotion,
    typeof p.intensity === 'number' ? `i${p.intensity.toFixed(2)}` : null,
    extreme !== 'X off' ? extreme : null,
    p.fingerPresetId ? `✋${p.fingerPresetId}` : null,
    p.chassisId ? p.chassisId : null,
    p.ttsPresetId && p.ttsPresetId !== 'mock' ? `tts:${p.ttsPresetId}` : null,
    formatProbeToastFeedbackSummary(p),
  ].filter(Boolean);
  return bits.join(' · ') || 'defaults';
}

/**
 * Build a landing toast payload from hash-load result.
 * @param {{ ok?: boolean, prefs?: object, error?: string }} hashResult
 * @param {{ dismissMs?: number, now?: number, ttlMs?: number }} [opts]
 */
export function describePrefsDeepLink(hashResult, opts = {}) {
  const dismissMs = opts.dismissMs ?? PREFS_LANDING_DISMISS_MS;
  if (!hashResult || !hashResult.ok || !hashResult.prefs) {
    return applyComplianceGate(
      {
        kind: 'prefs_landing_toast',
        show: false,
        reason: hashResult?.error || 'no_flp',
        dismissMs,
      },
      {},
    );
  }
  const prefs = normalizeFaceLivePrefs(hashResult.prefs);
  const summary = formatPrefsLandingSummary(prefs);
  const expiry = evaluatePrefsLinkExpiry(prefs, {
    now: opts.now,
    ttlMs: opts.ttlMs,
  });
  const detail = expiry.hint ? `${summary} · ${expiry.hint}` : summary;
  return applyComplianceGate(
    {
      kind: 'prefs_landing_toast',
      show: true,
      tone: expiry.expired ? 'warn' : 'ok',
      title: expiry.expired ? 'Prefs from link (expired)' : 'Prefs from link',
      detail,
      message: `prefs · from link · ${detail}`,
      prefs,
      dismissMs,
      expired: !!expiry.expired,
      expiryHint: expiry.hint,
      revokeHint: expiry.revokeHint,
    },
    {},
  );
}

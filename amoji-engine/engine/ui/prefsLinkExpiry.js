/**
 * Prefs share link TTL / revoke hints for Face Live deep-links.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { normalizeFaceLivePrefs } from './faceLivePrefs.js';

/** Default share freshness window (7 days). Soft hint only — not crypto revoke. */
export const PREFS_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Stamp prefs for sharing (sharedAt).
 * @param {object} prefs
 * @param {{ now?: number, ttlMs?: number }} [opts]
 */
export function stampPrefsForShare(prefs, opts = {}) {
  const now = opts.now ?? Date.now();
  const ttlMs = opts.ttlMs ?? PREFS_LINK_TTL_MS;
  const base = normalizeFaceLivePrefs(prefs);
  return {
    ...base,
    sharedAt: now,
    expiresAt: now + ttlMs,
  };
}

/**
 * Evaluate soft expiry for a deep-linked prefs payload.
 * @param {object} prefs
 * @param {{ now?: number, ttlMs?: number }} [opts]
 */
export function evaluatePrefsLinkExpiry(prefs, opts = {}) {
  const now = opts.now ?? Date.now();
  const ttlMs = opts.ttlMs ?? PREFS_LINK_TTL_MS;
  const p = normalizeFaceLivePrefs(prefs || {});
  const sharedAt =
    typeof p.sharedAt === 'number'
      ? p.sharedAt
      : typeof p.updatedAt === 'number'
        ? p.updatedAt
        : null;
  const expiresAt =
    typeof p.expiresAt === 'number'
      ? p.expiresAt
      : sharedAt != null
        ? sharedAt + ttlMs
        : null;

  if (sharedAt == null && expiresAt == null) {
    return applyComplianceGate(
      {
        kind: 'prefs_link_expiry',
        tracked: false,
        expired: false,
        hint: 'untracked link · re-share to stamp expiry',
        revokeHint: 'Clear #flp= from the URL to drop this deep-link',
        ageMs: null,
        expiresAt: null,
        remainingMs: null,
      },
      {},
    );
  }

  const ageMs = sharedAt != null ? Math.max(0, now - sharedAt) : null;
  const remainingMs = expiresAt != null ? expiresAt - now : null;
  const expired = remainingMs != null ? remainingMs <= 0 : false;
  let hint;
  if (expired) {
    hint = 'link expired · re-export a fresh share';
  } else if (remainingMs != null) {
    const hrs = remainingMs / 3600000;
    hint =
      hrs >= 48
        ? `fresh · ~${Math.round(hrs / 24)}d left`
        : hrs >= 1
          ? `fresh · ~${Math.round(hrs)}h left`
          : `fresh · ~${Math.max(1, Math.round(remainingMs / 60000))}m left`;
  } else {
    hint = 'fresh';
  }

  return applyComplianceGate(
    {
      kind: 'prefs_link_expiry',
      tracked: true,
      expired,
      hint,
      revokeHint: 'Clear #flp= from the URL to drop this deep-link',
      ageMs,
      expiresAt,
      remainingMs,
      sharedAt,
      ttlMs,
    },
    {},
  );
}

/**
 * Describe a URL revoke action (strip hash). Soft — local tab only.
 * @param {{ href?: string, hash?: string }} [loc]
 */
export function describePrefsLinkRevoke(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  const hasFlp = hash.includes('flp=');
  const base =
    loc.href ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return applyComplianceGate(
    {
      kind: 'prefs_link_revoke',
      canRevoke: hasFlp,
      nextUrl: base || (hasFlp ? '#' : ''),
      message: hasFlp
        ? 'prefs · deep-link cleared from URL'
        : 'prefs · no #flp= to clear',
    },
    {},
  );
}

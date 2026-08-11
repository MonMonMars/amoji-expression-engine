/**
 * Prefs share audit log — local session history of share/QR/revoke actions.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { normalizeFaceLivePrefs } from './faceLivePrefs.js';
import { formatPrefsLandingSummary } from './prefsLandingToast.js';

export const PREFS_SHARE_AUDIT_MAX = 20;
export const PREFS_SHARE_AUDIT_KEY = 'amoji.faceLive.prefsShareAudit.v1';

/**
 * @param {object} entry
 * @param {{ now?: number }} [opts]
 */
export function normalizeShareAuditEntry(entry, opts = {}) {
  const now = opts.now ?? Date.now();
  const action = entry?.action || 'share';
  const prefs = entry?.prefs ? normalizeFaceLivePrefs(entry.prefs) : null;
  return {
    id: entry?.id || `share-${now}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    at: typeof entry?.at === 'number' ? entry.at : now,
    hash: entry?.hash || null,
    shortUrl: entry?.shortUrl || null,
    expiryHint: entry?.expiryHint || null,
    expired: !!entry?.expired,
    summary: entry?.summary || (prefs ? formatPrefsLandingSummary(prefs) : '—'),
    emotion: prefs?.emotion || entry?.emotion || null,
  };
}

/**
 * Format audit entries for a compact status / pre dump.
 * @param {object[]} entries
 * @param {{ limit?: number }} [opts]
 */
export function formatShareAuditLog(entries, opts = {}) {
  const limit = opts.limit ?? 8;
  const list = (Array.isArray(entries) ? entries : []).slice(-limit);
  if (!list.length) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_format',
        text: 'share audit · empty',
        lines: [],
        count: 0,
      },
      {},
    );
  }
  const lines = list.map((e) => {
    const t = new Date(e.at).toISOString().slice(11, 19);
    return `${t} · ${e.action} · ${e.summary}${e.expiryHint ? ` · ${e.expiryHint}` : ''}`;
  });
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_format',
      text: `share audit · ${list.length}`,
      lines,
      count: list.length,
    },
    {},
  );
}

/**
 * Create an in-memory (optional localStorage) share audit log.
 * @param {{
 *   max?: number,
 *   storage?: Storage|null,
 *   memory?: boolean,
 *   persist?: boolean,
 * }} [opts]
 */
export function createPrefsShareAudit(opts = {}) {
  const max = Math.max(4, opts.max ?? PREFS_SHARE_AUDIT_MAX);
  const persist = opts.persist !== false && !opts.memory;
  /** @type {ReturnType<typeof normalizeShareAuditEntry>[]} */
  let entries = [];

  const resolveStorage = () => {
    if (opts.memory) return null;
    if (opts.storage) return opts.storage;
    if (typeof localStorage !== 'undefined') return localStorage;
    return null;
  };

  const load = () => {
    const storage = resolveStorage();
    if (!storage || !persist) return;
    try {
      const raw = storage.getItem(PREFS_SHARE_AUDIT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        entries = parsed.map((e) => normalizeShareAuditEntry(e));
      }
    } catch {
      entries = [];
    }
  };

  const save = () => {
    const storage = resolveStorage();
    if (!storage || !persist) return;
    try {
      storage.setItem(PREFS_SHARE_AUDIT_KEY, JSON.stringify(entries.slice(-max)));
    } catch {
      /* quota */
    }
  };

  load();

  return {
    get entries() {
      return entries.slice();
    },
    get size() {
      return entries.length;
    },
    clear() {
      entries = [];
      save();
      return applyComplianceGate(
        { kind: 'prefs_share_audit', action: 'clear', ok: true, count: 0 },
        {},
      );
    },
    /**
     * @param {'share'|'qr'|'revoke'|'import'|'export'} action
     * @param {object} [payload]
     */
    record(action, payload = {}) {
      const entry = normalizeShareAuditEntry(
        {
          action,
          hash: payload.hash,
          shortUrl: payload.shortUrl,
          expiryHint: payload.expiryHint,
          expired: payload.expired,
          prefs: payload.prefs,
          summary: payload.summary,
          at: payload.at,
        },
        { now: payload.now },
      );
      entries.push(entry);
      while (entries.length > max) entries.shift();
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit',
          action: 'record',
          ok: true,
          entry,
          count: entries.length,
        },
        {},
      );
    },
    format(fmtOpts = {}) {
      return formatShareAuditLog(entries, fmtOpts);
    },
  };
}

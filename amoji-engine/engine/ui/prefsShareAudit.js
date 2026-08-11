/**
 * Prefs share audit log — local session history of share/QR/revoke actions.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { normalizeFaceLivePrefs } from './faceLivePrefs.js';
import { formatPrefsLandingSummary } from './prefsLandingToast.js';
import { formatProbeToastFeedbackSummary } from './probeToastFeedback.js';

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
  const toastFeedbackSummary =
    entry?.toastFeedbackSummary ||
    (prefs ? formatProbeToastFeedbackSummary(prefs) : null);
  return {
    id: entry?.id || `share-${now}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    at: typeof entry?.at === 'number' ? entry.at : now,
    hash: entry?.hash || null,
    shortUrl: entry?.shortUrl || null,
    expiryHint: entry?.expiryHint || null,
    expired: !!entry?.expired,
    toastFeedbackSummary,
    toastInHash: entry?.toastInHash ?? !!toastFeedbackSummary,
    summary: entry?.summary || (prefs ? formatPrefsLandingSummary(prefs) : '—'),
    emotion: prefs?.emotion || entry?.emotion || null,
  };
}

/**
 * Format audit entries for a compact status / pre dump.
 * @param {object[]} entries
 * @param {{
 *   limit?: number,
 *   action?: string|null,
 *   query?: string|null,
 *   regex?: boolean,
 *   fromMs?: number|null,
 *   toMs?: number|null,
 *   rangePreset?: string|null,
 *   now?: number,
 * }} [opts]
 */
export function formatShareAuditLog(entries, opts = {}) {
  const limit = opts.limit ?? 8;
  const filtered = filterShareAuditEntries(entries, opts);
  const list = filtered.slice(-limit);
  const q = opts.query && String(opts.query).trim() ? String(opts.query).trim() : null;
  const range = resolveAuditDateRange(opts);
  if (!list.length) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_format',
        text: q
          ? `share audit · no match “${q}”`
          : opts.action
            ? `share audit · no ${opts.action}`
            : range.active
              ? 'share audit · none in range'
              : 'share audit · empty',
        lines: [],
        count: 0,
        filter: opts.action || null,
        query: q,
        regex: !!opts.regex,
        range,
        total: Array.isArray(entries) ? entries.length : 0,
      },
      {},
    );
  }
  const lines = list.map((e) => {
    const t = new Date(e.at).toISOString().slice(11, 19);
    return `${t} · ${e.action} · ${e.summary}${e.expiryHint ? ` · ${e.expiryHint}` : ''}`;
  });
  const labelBits = [`share audit · ${list.length}`];
  if (filtered.length !== list.length || opts.action || q || range.active) {
    labelBits[0] = `share audit · ${list.length}/${filtered.length}`;
  }
  if (opts.action && opts.action !== 'all') labelBits.push(String(opts.action));
  if (q) labelBits.push(opts.regex ? `/${q}/` : `“${q}”`);
  if (opts.toastInHashOnly) labelBits.push('toast hash');
  if (range.label) labelBits.push(range.label);
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_format',
      text: labelBits.join(' · '),
      lines,
      count: list.length,
      filter: opts.action || null,
      query: q,
      regex: !!opts.regex,
      range,
      total: Array.isArray(entries) ? entries.length : list.length,
    },
    {},
  );
}

/**
 * Resolve from/to window from explicit ms or preset (`1h`/`24h`/`7d`/`all`).
 * @param {{
 *   fromMs?: number|null,
 *   toMs?: number|null,
 *   rangePreset?: string|null,
 *   now?: number,
 * }} [opts]
 */
export function resolveAuditDateRange(opts = {}) {
  const now = opts.now ?? Date.now();
  let fromMs =
    typeof opts.fromMs === 'number' && Number.isFinite(opts.fromMs) ? opts.fromMs : null;
  let toMs =
    typeof opts.toMs === 'number' && Number.isFinite(opts.toMs) ? opts.toMs : null;
  let label = null;
  const preset = opts.rangePreset && opts.rangePreset !== 'all' ? opts.rangePreset : null;
  if (preset && fromMs == null) {
    const map = {
      '1h': 3600000,
      '24h': 86400000,
      '7d': 7 * 86400000,
    };
    if (map[preset]) {
      fromMs = now - map[preset];
      toMs = toMs ?? now;
      label = preset;
    }
  }
  const active = fromMs != null || toMs != null;
  if (active && !label) label = 'range';
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_range',
      active,
      fromMs,
      toMs: active ? toMs ?? now : null,
      label,
      preset: preset || null,
    },
    {},
  );
}

/**
 * Filter audit entries by action, query (substring or regex), and date range.
 * @param {object[]} entries
 * @param {{
 *   action?: string|null,
 *   query?: string|null,
 *   regex?: boolean,
 *   fromMs?: number|null,
 *   toMs?: number|null,
 *   rangePreset?: string|null,
 *   now?: number,
 *   toastInHashOnly?: boolean,
 * }} [opts]
 */
export function filterShareAuditEntries(entries, opts = {}) {
  const list = (Array.isArray(entries) ? entries : []).map((e) =>
    normalizeShareAuditEntry(e),
  );
  const action = opts.action && opts.action !== 'all' ? String(opts.action) : null;
  const qRaw = opts.query && String(opts.query).trim() ? String(opts.query).trim() : null;
  const range = resolveAuditDateRange(opts);
  /** @type {RegExp|null} */
  let re = null;
  if (qRaw && opts.regex) {
    try {
      const m = qRaw.match(/^\/(.+)\/([a-z]*)$/i);
      re = m ? new RegExp(m[1], m[2] || 'i') : new RegExp(qRaw, 'i');
    } catch {
      re = null;
    }
  }
  const q = qRaw && !opts.regex ? qRaw.toLowerCase() : null;
  return list.filter((e) => {
    if (action && e.action !== action) return false;
    if (opts.toastInHashOnly && !e.toastInHash) return false;
    if (range.active) {
      if (range.fromMs != null && e.at < range.fromMs) return false;
      if (range.toMs != null && e.at > range.toMs) return false;
    }
    if (!qRaw) return true;
    const hay = [
      e.action,
      e.summary,
      e.emotion,
      e.hash,
      e.shortUrl,
      e.expiryHint,
      e.toastFeedbackSummary,
    ]
      .filter(Boolean)
      .join(' ');
    if (opts.regex) {
      if (!re) return false;
      return re.test(hay);
    }
    return hay.toLowerCase().includes(q);
  });
}

/**
 * List known audit action keys for UI filters.
 */
export function listShareAuditActions(entries) {
  const set = new Set();
  for (const e of Array.isArray(entries) ? entries : []) {
    if (e?.action) set.add(e.action);
  }
  return ['all', ...Array.from(set).sort()];
}

/**
 * Export audit log as pretty JSON (download-friendly).
 * @param {object[]} entries
 * @param {{ now?: number, toastInHashOnly?: boolean }} [opts]
 */
export function exportShareAuditJson(entries, opts = {}) {
  let list = (Array.isArray(entries) ? entries : []).map((e) =>
    normalizeShareAuditEntry(e),
  );
  const toastInHashOnly = !!opts.toastInHashOnly;
  if (toastInHashOnly) {
    list = filterShareAuditEntries(list, { toastInHashOnly: true });
  }
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit',
    version: 1,
    exportedAt: new Date(opts.now ?? Date.now()).toISOString(),
    count: list.length,
    toastInHashOnly,
    entries: list,
  };
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_export',
      ok: true,
      json: JSON.stringify(payload, null, 2),
      count: list.length,
      toastInHashOnly,
      total: Array.isArray(entries) ? entries.length : 0,
      payload,
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
          toastFeedbackSummary: payload.toastFeedbackSummary,
          toastInHash: payload.toastInHash,
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
    filter(actionOrOpts, maybeQuery) {
      if (actionOrOpts && typeof actionOrOpts === 'object') {
        return filterShareAuditEntries(entries, actionOrOpts);
      }
      return filterShareAuditEntries(entries, {
        action: actionOrOpts,
        query: maybeQuery,
      });
    },
    actions() {
      return listShareAuditActions(entries);
    },
    exportJson(exportOpts = {}) {
      return exportShareAuditJson(entries, exportOpts);
    },
  };
}

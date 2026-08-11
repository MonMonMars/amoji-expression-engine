/**
 * Saved filter views for Face Live share audit log.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const AUDIT_SAVED_VIEWS_KEY = 'amoji.faceLive.prefsShareAudit.views.v1';
export const AUDIT_SAVED_VIEWS_MAX = 12;

/**
 * @param {object} raw
 * @param {{ now?: number }} [opts]
 */
export function normalizeAuditSavedView(raw, opts = {}) {
  const now = opts.now ?? Date.now();
  const name = String(raw?.name || '').trim() || 'Untitled';
  return {
    id: raw?.id || `view-${now}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    action: raw?.action && raw.action !== 'all' ? String(raw.action) : 'all',
    query: raw?.query != null ? String(raw.query) : '',
    regex: !!raw?.regex,
    rangePreset: raw?.rangePreset || 'all',
    savedAt: typeof raw?.savedAt === 'number' ? raw.savedAt : now,
  };
}

/**
 * Snapshot current audit UI filters into a saved view payload.
 * @param {object} filters
 * @param {{ name?: string, now?: number }} [opts]
 */
export function snapshotAuditView(filters = {}, opts = {}) {
  return normalizeAuditSavedView(
    {
      name: opts.name,
      action: filters.action,
      query: filters.query,
      regex: filters.regex,
      rangePreset: filters.rangePreset,
    },
    { now: opts.now },
  );
}

/**
 * Create a persisted (or memory) saved-views store.
 * @param {{
 *   max?: number,
 *   storage?: Storage|null,
 *   memory?: boolean,
 *   persist?: boolean,
 * }} [opts]
 */
export function createAuditSavedViews(opts = {}) {
  const max = Math.max(2, opts.max ?? AUDIT_SAVED_VIEWS_MAX);
  const persist = opts.persist !== false && !opts.memory;
  /** @type {ReturnType<typeof normalizeAuditSavedView>[]} */
  let views = [];

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
      const raw = storage.getItem(AUDIT_SAVED_VIEWS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        views = parsed.map((v) => normalizeAuditSavedView(v));
      }
    } catch {
      views = [];
    }
  };

  const save = () => {
    const storage = resolveStorage();
    if (!storage || !persist) return;
    try {
      storage.setItem(AUDIT_SAVED_VIEWS_KEY, JSON.stringify(views.slice(-max)));
    } catch {
      /* quota */
    }
  };

  load();

  return {
    get views() {
      return views.slice();
    },
    get size() {
      return views.length;
    },
    list() {
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'list',
          ok: true,
          views: views.slice(),
          count: views.length,
        },
        {},
      );
    },
    save(filters, saveOpts = {}) {
      const view = snapshotAuditView(filters, saveOpts);
      const idx = views.findIndex(
        (v) => v.name.toLowerCase() === view.name.toLowerCase(),
      );
      if (idx >= 0) views[idx] = { ...view, id: views[idx].id };
      else views.push(view);
      while (views.length > max) views.shift();
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'save',
          ok: true,
          view,
          count: views.length,
        },
        {},
      );
    },
    get(idOrName) {
      const key = String(idOrName || '');
      const view =
        views.find((v) => v.id === key) ||
        views.find((v) => v.name.toLowerCase() === key.toLowerCase()) ||
        null;
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'get',
          ok: !!view,
          view,
        },
        {},
      );
    },
    remove(idOrName) {
      const key = String(idOrName || '');
      const before = views.length;
      views = views.filter(
        (v) => v.id !== key && v.name.toLowerCase() !== key.toLowerCase(),
      );
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'remove',
          ok: views.length < before,
          count: views.length,
        },
        {},
      );
    },
    clear() {
      views = [];
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'clear',
          ok: true,
          count: 0,
        },
        {},
      );
    },
  };
}

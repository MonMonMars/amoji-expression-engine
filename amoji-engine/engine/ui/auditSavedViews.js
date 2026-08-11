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
 * Export saved views as a portable JSON document.
 * @param {object[]} views
 * @param {{ now?: number }} [opts]
 */
export function exportAuditSavedViewsJson(views, opts = {}) {
  const list = (Array.isArray(views) ? views : []).map((v) =>
    normalizeAuditSavedView(v),
  );
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    version: 1,
    exportedAt: new Date(opts.now ?? Date.now()).toISOString(),
    count: list.length,
    views: list,
  };
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_export',
      ok: true,
      json: JSON.stringify(payload, null, 2),
      count: list.length,
      payload,
    },
    {},
  );
}

/**
 * Import saved views from JSON text or object.
 * @param {string|object} raw
 * @param {{ max?: number, now?: number, merge?: boolean }} [opts]
 */
export function importAuditSavedViewsJson(raw, opts = {}) {
  const max = Math.max(2, opts.max ?? AUDIT_SAVED_VIEWS_MAX);
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views_import',
          ok: false,
          reason: 'invalid_json',
          views: [],
          count: 0,
        },
        {},
      );
    }
  }
  const listRaw = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.views)
      ? parsed.views
      : null;
  if (!listRaw) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import',
        ok: false,
        reason: 'no_views',
        views: [],
        count: 0,
      },
      {},
    );
  }
  const views = listRaw
    .map((v) => normalizeAuditSavedView(v, { now: opts.now }))
    .slice(-max);
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import',
      ok: true,
      views,
      count: views.length,
      merge: !!opts.merge,
    },
    {},
  );
}

/**
 * Rename a saved view payload (pure).
 * @param {object} view
 * @param {string} newName
 * @param {{ now?: number }} [opts]
 */
export function renameAuditSavedView(view, newName, opts = {}) {
  const name = String(newName || '').trim();
  if (!view || !view.id) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_rename',
        ok: false,
        reason: 'missing_view',
        view: null,
      },
      {},
    );
  }
  if (!name) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_rename',
        ok: false,
        reason: 'empty_name',
        view: normalizeAuditSavedView(view, { now: opts.now }),
      },
      {},
    );
  }
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_rename',
      ok: true,
      view: normalizeAuditSavedView(
        { ...view, name, savedAt: opts.now ?? Date.now() },
        { now: opts.now },
      ),
      previousName: view.name || null,
    },
    {},
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
    rename(idOrName, newName, renameOpts = {}) {
      const key = String(idOrName || '');
      const idx = views.findIndex(
        (v) =>
          v.id === key || v.name.toLowerCase() === key.toLowerCase(),
      );
      if (idx < 0) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'rename',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      const name = String(newName || '').trim();
      if (!name) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'rename',
            ok: false,
            reason: 'empty_name',
            view: views[idx],
          },
          {},
        );
      }
      const clash = views.findIndex(
        (v, i) =>
          i !== idx && v.name.toLowerCase() === name.toLowerCase(),
      );
      if (clash >= 0) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'rename',
            ok: false,
            reason: 'name_taken',
            view: views[idx],
          },
          {},
        );
      }
      const renamed = renameAuditSavedView(views[idx], name, {
        now: renameOpts.now,
      });
      if (!renamed.ok) return renamed;
      views[idx] = renamed.view;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'rename',
          ok: true,
          view: views[idx],
          previousName: renamed.previousName,
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
    exportJson(exportOpts = {}) {
      return exportAuditSavedViewsJson(views, exportOpts);
    },
    importJson(raw, importOpts = {}) {
      const imported = importAuditSavedViewsJson(raw, {
        max,
        now: importOpts.now,
        merge: importOpts.merge,
      });
      if (!imported.ok) return imported;
      if (importOpts.merge) {
        for (const v of imported.views) {
          const idx = views.findIndex(
            (x) => x.name.toLowerCase() === v.name.toLowerCase(),
          );
          if (idx >= 0) views[idx] = { ...v, id: views[idx].id };
          else views.push(v);
        }
        while (views.length > max) views.shift();
      } else {
        views = imported.views.slice(-max);
      }
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views_import',
          ok: true,
          views: views.slice(),
          count: views.length,
          merge: !!importOpts.merge,
        },
        {},
      );
    },
  };
}

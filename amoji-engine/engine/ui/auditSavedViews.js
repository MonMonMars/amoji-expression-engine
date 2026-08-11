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
  const folder = String(raw?.folder || '').trim();
  return {
    id: raw?.id || `view-${now}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    folder,
    starred: !!raw?.starred,
    action: raw?.action && raw.action !== 'all' ? String(raw.action) : 'all',
    query: raw?.query != null ? String(raw.query) : '',
    regex: !!raw?.regex,
    rangePreset: raw?.rangePreset || 'all',
    toastInHashOnly: !!raw?.toastInHashOnly,
    savedAt: typeof raw?.savedAt === 'number' ? raw.savedAt : now,
  };
}

/**
 * Snapshot current audit UI filters into a saved view payload.
 * @param {object} filters
 * @param {{ name?: string, folder?: string, starred?: boolean, now?: number }} [opts]
 */
export function snapshotAuditView(filters = {}, opts = {}) {
  return normalizeAuditSavedView(
    {
      name: opts.name,
      folder: opts.folder ?? filters.folder,
      starred: opts.starred ?? filters.starred,
      action: filters.action,
      query: filters.query,
      regex: filters.regex,
      rangePreset: filters.rangePreset,
      toastInHashOnly: filters.toastInHashOnly,
    },
    { now: opts.now },
  );
}

/**
 * Sort views with starred favorites first (stable within groups).
 * @param {object[]} views
 */
export function sortAuditViewsByStar(views) {
  const list = Array.isArray(views) ? views.slice() : [];
  list.sort((a, b) => {
    const sa = a?.starred ? 1 : 0;
    const sb = b?.starred ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return 0;
  });
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_star',
      ok: true,
      views: list,
      starredCount: list.filter((v) => v.starred).length,
      count: list.length,
    },
    {},
  );
}

/**
 * Clear starred flags for every view in a named folder (pure).
 * Requires a non-empty folder; empty folder → missing_folder.
 * @param {object[]} views
 * @param {string} folder
 * @param {{ now?: number }} [opts]
 */
export function clearStarsInFolder(views, folder, opts = {}) {
  const list = Array.isArray(views) ? views.slice() : [];
  const folderName = String(folder || '').trim();
  if (!folderName) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_clear_stars',
        ok: false,
        reason: 'missing_folder',
        views: list,
        changed: 0,
        folder: null,
      },
      {},
    );
  }
  let changed = 0;
  const next = list.map((v) => {
    const vFolder = String(v?.folder || '').trim() || 'Inbox';
    if (vFolder !== folderName) return v;
    if (!v?.starred) return v;
    changed += 1;
    return normalizeAuditSavedView(
      { ...v, starred: false, savedAt: opts.now ?? Date.now() },
      { now: opts.now },
    );
  });
  const sorted = sortAuditViewsByStar(next).views;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_clear_stars',
      ok: true,
      views: sorted,
      changed,
      folder: folderName,
      count: sorted.length,
      starredCount: sorted.filter((v) => v.starred).length,
    },
    {},
  );
}

/**
 * Remove unstarred views (optional folder scope).
 * @param {object[]} views
 * @param {{ folder?: string|null }} [opts]
 */
export function pruneUnstarredViews(views, opts = {}) {
  const list = Array.isArray(views) ? views.slice() : [];
  const folderFilter =
    opts.folder != null && String(opts.folder).trim() !== ''
      ? String(opts.folder).trim()
      : null;
  const kept = [];
  let removed = 0;
  for (const v of list) {
    if (v?.starred) {
      kept.push(v);
      continue;
    }
    if (folderFilter) {
      const vFolder = String(v?.folder || '').trim() || 'Inbox';
      if (vFolder !== folderFilter) {
        kept.push(v);
        continue;
      }
    }
    removed += 1;
  }
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_prune_unstarred',
      ok: true,
      views: kept,
      removed,
      folder: folderFilter,
      count: kept.length,
      starredCount: kept.filter((v) => v.starred).length,
    },
    {},
  );
}

/**
 * Filter views by starred-only and/or folder.
 * @param {object[]} views
 * @param {{ starredOnly?: boolean, folder?: string|null, toastInHashOnly?: boolean }} [opts]
 */
export function filterAuditSavedViews(views, opts = {}) {
  const list = Array.isArray(views) ? views.slice() : [];
  const folderFilter =
    opts.folder != null && String(opts.folder).trim() !== ''
      ? String(opts.folder).trim()
      : null;
  const filtered = list.filter((v) => {
    if (opts.starredOnly && !v.starred) return false;
    if (opts.toastInHashOnly && !v.toastInHashOnly) return false;
    if (folderFilter) {
      const vFolder = String(v.folder || '').trim() || 'Inbox';
      if (vFolder !== folderFilter) return false;
    }
    return true;
  });
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_filter',
      ok: true,
      views: filtered,
      count: filtered.length,
      total: list.length,
      starredOnly: !!opts.starredOnly,
      toastInHashOnly: !!opts.toastInHashOnly,
      folder: folderFilter,
    },
    {},
  );
}

/**
 * Reorder views by moving one id to a new index.
 * @param {object[]} views
 * @param {string} idOrName
 * @param {number} toIndex
 */
export function reorderAuditSavedViews(views, idOrName, toIndex) {
  const list = Array.isArray(views) ? views.slice() : [];
  const key = String(idOrName || '');
  const from = list.findIndex(
    (v) => v.id === key || v.name?.toLowerCase() === key.toLowerCase(),
  );
  if (from < 0) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_reorder',
        ok: false,
        reason: 'not_found',
        views: list,
        fromIndex: -1,
        toIndex: null,
      },
      {},
    );
  }
  const target = Math.max(0, Math.min(list.length - 1, Number(toIndex) || 0));
  if (from === target) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_reorder',
        ok: true,
        views: list,
        fromIndex: from,
        toIndex: target,
        moved: false,
      },
      {},
    );
  }
  const [item] = list.splice(from, 1);
  list.splice(target, 0, item);
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_reorder',
      ok: true,
      views: list,
      fromIndex: from,
      toIndex: target,
      moved: true,
      view: item,
    },
    {},
  );
}

/**
 * Apply an explicit id order (e.g. after drag-and-drop).
 * @param {object[]} views
 * @param {string[]} orderedIds
 */
export function applyAuditViewsOrder(views, orderedIds) {
  const list = Array.isArray(views) ? views.slice() : [];
  const ids = Array.isArray(orderedIds) ? orderedIds.map(String) : [];
  if (!ids.length) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_reorder',
        ok: false,
        reason: 'empty_order',
        views: list,
      },
      {},
    );
  }
  const byId = new Map(list.map((v) => [v.id, v]));
  const next = [];
  for (const id of ids) {
    if (byId.has(id)) {
      next.push(byId.get(id));
      byId.delete(id);
    }
  }
  for (const v of list) {
    if (byId.has(v.id)) next.push(v);
  }
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_reorder',
      ok: true,
      views: next,
      count: next.length,
      moved: true,
    },
    {},
  );
}

/**
 * Group saved views by folder (empty folder → "Inbox").
 * @param {object[]} views
 */
export function groupAuditViewsByFolder(views) {
  /** @type {Map<string, object[]>} */
  const map = new Map();
  for (const v of Array.isArray(views) ? views : []) {
    const key = String(v?.folder || '').trim() || 'Inbox';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(v);
  }
  const folders = [...map.keys()].sort((a, b) => {
    if (a === 'Inbox') return -1;
    if (b === 'Inbox') return 1;
    return a.localeCompare(b);
  });
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_folders',
      ok: true,
      folders: folders.map((name) => ({
        name,
        views: map.get(name) || [],
        count: (map.get(name) || []).length,
      })),
      folderNames: folders,
      count: folders.length,
    },
    {},
  );
}

/**
 * Export saved views as a portable JSON document.
 * @param {object[]} views
 * @param {{ now?: number, starredOnly?: boolean, folder?: string|null, toastInHashOnly?: boolean }} [opts]
 */
export function exportAuditSavedViewsJson(views, opts = {}) {
  let list = (Array.isArray(views) ? views : []).map((v) =>
    normalizeAuditSavedView(v),
  );
  const starredOnly = !!opts.starredOnly;
  const toastInHashOnly = !!opts.toastInHashOnly;
  const folderFilter =
    opts.folder != null && String(opts.folder).trim() !== ''
      ? String(opts.folder).trim()
      : null;
  if (starredOnly) list = list.filter((v) => v.starred);
  if (toastInHashOnly) list = list.filter((v) => v.toastInHashOnly);
  if (folderFilter) {
    list = list.filter((v) => {
      const vFolder = String(v.folder || '').trim() || 'Inbox';
      return vFolder === folderFilter;
    });
  }
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    version: 1,
    exportedAt: new Date(opts.now ?? Date.now()).toISOString(),
    count: list.length,
    starredOnly,
    toastInHashOnly,
    folder: folderFilter,
    views: list,
  };
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_export',
      ok: true,
      json: JSON.stringify(payload, null, 2),
      count: list.length,
      starredOnly,
      toastInHashOnly,
      folder: folderFilter,
      total: Array.isArray(views) ? views.length : 0,
      payload,
    },
    {},
  );
}

/**
 * Resolve merge filters for import — inherit starred+folder from export payload when present.
 * @param {object|string} raw parsed or JSON text
 * @param {{
 *   mergeStarredOnly?: boolean,
 *   mergeStarredOnlyExplicit?: boolean,
 *   folder?: string|null,
 *   folderExplicit?: boolean,
 *   toastInHashOnly?: boolean,
 *   toastInHashOnlyExplicit?: boolean,
 *   inheritExportMeta?: boolean,
 * }} [opts]
 */
export function resolveAuditViewsImportFilters(raw, opts = {}) {
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views_import_filters',
          ok: false,
          reason: 'invalid_json',
          mergeStarredOnly: !!opts.mergeStarredOnly,
          folder: null,
          fromExportMeta: false,
        },
        {},
      );
    }
  }
  const payload =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  const fromExportMeta =
    payload.kind === 'amoji.faceLive.prefsShareAudit.views' &&
    (!!payload.starredOnly || !!payload.folder || !!payload.toastInHashOnly);
  const inherit = opts.inheritExportMeta !== false;

  let mergeStarredOnly = !!opts.mergeStarredOnly;
  let toastInHashOnly = !!opts.toastInHashOnly;
  let folder =
    opts.folder != null && String(opts.folder).trim() !== ''
      ? String(opts.folder).trim()
      : null;

  if (inherit && fromExportMeta) {
    if (payload.starredOnly && !opts.mergeStarredOnlyExplicit && !opts.folderExplicit) {
      mergeStarredOnly = true;
    }
    if (payload.toastInHashOnly && !opts.toastInHashOnlyExplicit && !opts.folderExplicit) {
      toastInHashOnly = true;
    }
    if (payload.folder && !opts.folderExplicit && !folder) {
      folder = String(payload.folder).trim();
    }
  }

  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_filters',
      ok: true,
      mergeStarredOnly,
      toastInHashOnly,
      folder,
      fromExportMeta,
      exportStarredOnly: !!payload.starredOnly,
      exportToastInHashOnly: !!payload.toastInHashOnly,
      exportFolder: payload.folder || null,
    },
    {},
  );
}

/**
 * Human-readable hint for import filters inherited from export metadata.
 * @param {object|string} raw
 * @param {{
 *   mergeStarredOnly?: boolean,
 *   mergeStarredOnlyExplicit?: boolean,
 *   toastInHashOnly?: boolean,
 *   toastInHashOnlyExplicit?: boolean,
 *   folder?: string|null,
 *   folderExplicit?: boolean,
 *   inheritExportMeta?: boolean,
 * }} [opts]
 */
export function formatAuditViewsImportInheritHint(raw, opts = {}) {
  const filters = resolveAuditViewsImportFilters(raw, opts);
  if (!filters.ok) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import_hint',
        ok: false,
        hint: null,
        reason: filters.reason || 'invalid',
      },
      {},
    );
  }
  /** @type {string[]} */
  const inherited = [];
  if (
    filters.fromExportMeta &&
    filters.mergeStarredOnly &&
    filters.exportStarredOnly &&
    !opts.mergeStarredOnlyExplicit
  ) {
    inherited.push('starred');
  }
  if (
    filters.fromExportMeta &&
    filters.toastInHashOnly &&
    filters.exportToastInHashOnly &&
    !opts.toastInHashOnlyExplicit
  ) {
    inherited.push('toast hash');
  }
  if (
    filters.fromExportMeta &&
    filters.folder &&
    filters.exportFolder &&
    !opts.folderExplicit
  ) {
    inherited.push(`folder ${filters.folder}`);
  }
  const hint =
    inherited.length > 0
      ? `Inherit from export: ${inherited.join(' · ')}`
      : filters.fromExportMeta
        ? 'Export metadata detected (no extra filters to inherit)'
        : null;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_hint',
      ok: true,
      hint,
      inherited,
      fromExportMeta: filters.fromExportMeta,
      filters,
    },
    {},
  );
}

/**
 * Short label for drag-drop import preview (view count + toast hash summary).
 * @param {object|string} raw
 * @param {{
 *   mergeStarredOnly?: boolean,
 *   mergeStarredOnlyExplicit?: boolean,
 *   toastInHashOnly?: boolean,
 *   toastInHashOnlyExplicit?: boolean,
 *   folder?: string|null,
 *   folderExplicit?: boolean,
 *   inheritExportMeta?: boolean,
 *   filename?: string|null,
 * }} [opts]
 */
export function summarizeAuditViewsImportPreview(raw, opts = {}) {
  const imported = importAuditSavedViewsJson(raw, { merge: false });
  if (!imported.ok) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import_preview',
        ok: false,
        reason: imported.reason || 'invalid',
        label: null,
        count: 0,
      },
      {},
    );
  }
  const views = imported.views || [];
  const toastHashCount = views.filter((v) => v.toastInHashOnly).length;
  const hinted = formatAuditViewsImportInheritHint(raw, opts);
  const count = views.length;
  const countLabel =
    count === 0
      ? 'empty'
      : `${count} view${count === 1 ? '' : 's'}${
          toastHashCount ? ` · ${toastHashCount} toast hash` : ''
        }`;
  const filename = opts.filename ? String(opts.filename).trim() : null;
  const label = filename ? `${filename} · ${countLabel}` : countLabel;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_preview',
      ok: true,
      label,
      count,
      toastHashCount,
      filename,
      hint: hinted.ok ? hinted.hint : null,
      fromExportMeta: hinted.fromExportMeta,
    },
    {},
  );
}

/**
 * Simulate import merge/replace/append stats without mutating stored views.
 * @param {object[]} existing
 * @param {object|string} raw
 * @param {{
 *   replace?: boolean,
 *   appendOnly?: boolean,
 *   mergeStarredOnly?: boolean,
 *   mergeStarredOnlyExplicit?: boolean,
 *   toastInHashOnly?: boolean,
 *   toastInHashOnlyExplicit?: boolean,
 *   folder?: string|null,
 *   folderExplicit?: boolean,
 *   inheritExportMeta?: boolean,
 *   max?: number,
 *   now?: number,
 *   shiftMerge?: boolean,
 * }} [opts]
 */
export function previewAuditViewsImportDryRun(existing, raw, opts = {}) {
  const filters = resolveAuditViewsImportFilters(raw, opts);
  if (!filters.ok) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import_dry_run',
        ok: false,
        reason: filters.reason || 'invalid',
        dryRun: true,
        added: 0,
        updated: 0,
        skipped: 0,
        label: null,
      },
      {},
    );
  }
  const imported = importAuditSavedViewsJson(raw, { merge: false });
  if (!imported.ok) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import_dry_run',
        ok: false,
        reason: imported.reason || 'invalid',
        dryRun: true,
        added: 0,
        updated: 0,
        skipped: 0,
        label: null,
      },
      {},
    );
  }
  const replace = !!opts.replace;
  const appendOnly = !!opts.appendOnly;
  const mergeStarredOnly = filters.mergeStarredOnly;
  const toastInHashOnly = filters.toastInHashOnly;
  const folder = filters.folder;
  const incoming = imported.views || [];
  if (replace) {
    let kept = 0;
    let skipped = 0;
    for (const v of incoming) {
      if (mergeStarredOnly && !v.starred) {
        skipped += 1;
        continue;
      }
      if (toastInHashOnly && !v.toastInHashOnly) {
        skipped += 1;
        continue;
      }
      if (folder) {
        const vFolder = String(v.folder || '').trim() || 'Inbox';
        if (vFolder !== folder) {
          skipped += 1;
          continue;
        }
      }
      kept += 1;
    }
    const label = `dry-run replace · ${kept} view${kept === 1 ? '' : 's'} · skip ${skipped}`;
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_views_import_dry_run',
        ok: true,
        dryRun: true,
        replace: true,
        appendOnly: false,
        added: kept,
        updated: 0,
        skipped,
        count: kept,
        label,
        mergeStarredOnly,
        toastInHashOnly,
        folder,
      },
      {},
    );
  }
  const merged = mergeAuditSavedViewsImport(existing, incoming, {
    mergeStarredOnly,
    toastInHashOnly,
    folder,
    max: opts.max,
    now: opts.now,
    appendOnly,
  });
  const mode = appendOnly ? 'append' : 'merge';
  const mergeHint = formatAuditViewsImportDryRunMergeHint(raw, {
    ...opts,
    replace,
    appendOnly,
    shiftMerge: !!opts.shiftMerge,
  });
  let label = `dry-run ${mode} · +${merged.added} · ~${merged.updated} · skip ${merged.skipped}`;
  if (mergeHint.ok && mergeHint.hint && opts.shiftMerge) {
    label = `${label} · ${mergeHint.hint}`;
  }
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_dry_run',
      ok: true,
      dryRun: true,
      replace: false,
      appendOnly,
      added: merged.added,
      updated: merged.updated,
      skipped: merged.skipped,
      count: incoming.length,
      label,
      hint: mergeHint.ok ? mergeHint.hint : null,
      shiftMerge: !!opts.shiftMerge,
      mergeStarredOnly,
      toastInHashOnly,
      folder,
    },
    {},
  );
}

/**
 * Merge-mode dry-run hint (Meta+Shift) combining mode label + inherit hint.
 * @param {object|string} raw
 * @param {{
 *   replace?: boolean,
 *   appendOnly?: boolean,
 *   shiftMerge?: boolean,
 *   mergeStarredOnly?: boolean,
 *   mergeStarredOnlyExplicit?: boolean,
 *   toastInHashOnly?: boolean,
 *   toastInHashOnlyExplicit?: boolean,
 *   folder?: string|null,
 *   folderExplicit?: boolean,
 *   inheritExportMeta?: boolean,
 * }} [opts]
 */
export function formatAuditViewsImportDryRunMergeHint(raw, opts = {}) {
  const inherit = formatAuditViewsImportInheritHint(raw, opts);
  const mode = opts.replace
    ? 'Alt replace'
    : opts.appendOnly
      ? 'Ctrl append'
      : opts.shiftMerge
        ? 'Shift merge'
        : 'Merge';
  /** @type {string[]} */
  const parts = [`${mode} dry-run`];
  if (inherit.ok && inherit.hint) parts.push(inherit.hint);
  const hint = parts.join(' · ');
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_dry_run_hint',
      ok: inherit.ok,
      hint,
      shiftMerge: !!opts.shiftMerge,
      inherited: inherit.ok ? inherit.inherited : [],
      fromExportMeta: inherit.ok ? inherit.fromExportMeta : false,
    },
    {},
  );
}

/**
 * Whether a drag-drop should auto-import (Shift+drop merge, Alt+drop replace, Ctrl+drop append).
 * Meta+drop dry-runs without importing.
 * @param {{ shiftKey?: boolean, altKey?: boolean, ctrlKey?: boolean, metaKey?: boolean }} [opts]
 */
export function shouldAutoImportAuditViewsOnDrop(opts = {}) {
  const replace = !!opts.altKey;
  const appendOnly = !!opts.ctrlKey && !replace;
  const merge = !replace && (!!opts.shiftKey || appendOnly);
  const dryRun = !!opts.metaKey;
  const autoImport = (replace || merge) && !dryRun;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import_drop',
      ok: true,
      autoImport,
      dryRun,
      replace,
      merge,
      appendOnly,
      shiftKey: !!opts.shiftKey,
      altKey: !!opts.altKey,
      ctrlKey: !!opts.ctrlKey,
      metaKey: !!opts.metaKey,
    },
    {},
  );
}

/**
 * Merge imported views into an existing list.
 * @param {object[]} existing
 * @param {object[]} incoming
 * @param {{
 *   mergeStarredOnly?: boolean,
 *   toastInHashOnly?: boolean,
 *   folder?: string|null,
 *   max?: number,
 *   now?: number,
 *   appendOnly?: boolean,
 * }} [opts]
 */
export function mergeAuditSavedViewsImport(existing, incoming, opts = {}) {
  const list = Array.isArray(existing) ? existing.slice() : [];
  const incomingList = (Array.isArray(incoming) ? incoming : []).map((v) =>
    normalizeAuditSavedView(v, { now: opts.now }),
  );
  const mergeStarredOnly = !!opts.mergeStarredOnly;
  const toastInHashOnly = !!opts.toastInHashOnly;
  const appendOnly = !!opts.appendOnly;
  const folderFilter =
    opts.folder != null && String(opts.folder).trim() !== ''
      ? String(opts.folder).trim()
      : null;
  let added = 0;
  let updated = 0;
  let skipped = 0;
  for (const v of incomingList) {
    if (mergeStarredOnly && !v.starred) {
      skipped += 1;
      continue;
    }
    if (toastInHashOnly && !v.toastInHashOnly) {
      skipped += 1;
      continue;
    }
    if (folderFilter) {
      const vFolder = String(v.folder || '').trim() || 'Inbox';
      if (vFolder !== folderFilter) {
        skipped += 1;
        continue;
      }
    }
    const idx = list.findIndex(
      (x) => x.name.toLowerCase() === v.name.toLowerCase(),
    );
    if (idx >= 0) {
      if (appendOnly) {
        skipped += 1;
        continue;
      }
      list[idx] = { ...v, id: list[idx].id };
      updated += 1;
    } else {
      list.push(v);
      added += 1;
    }
  }
  const max = Math.max(2, opts.max ?? AUDIT_SAVED_VIEWS_MAX);
  while (list.length > max) list.shift();
  const views = sortAuditViewsByStar(list).views;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_merge',
      ok: true,
      views,
      added,
      updated,
      skipped,
      mergeStarredOnly,
      toastInHashOnly,
      appendOnly,
      folder: folderFilter,
      count: views.length,
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
  const payload =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  const fromExportMeta =
    payload.kind === 'amoji.faceLive.prefsShareAudit.views' &&
    (!!payload.starredOnly || !!payload.folder || !!payload.toastInHashOnly);
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_views_import',
      ok: true,
      views,
      count: views.length,
      merge: !!opts.merge,
      mergeStarredOnly: !!opts.mergeStarredOnly,
      toastInHashOnly: !!payload.toastInHashOnly,
      folder: payload.folder || null,
      starredOnly: !!payload.starredOnly,
      fromExportMeta,
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
 * Build a unique duplicate name for a saved view.
 * @param {string} baseName
 * @param {string[]} existingNames
 */
export function nextDuplicateViewName(baseName, existingNames = []) {
  const base = String(baseName || '').trim() || 'Untitled';
  const set = new Set(
    (existingNames || []).map((n) => String(n || '').toLowerCase()),
  );
  let candidate = `${base} copy`;
  if (!set.has(candidate.toLowerCase())) return candidate;
  let n = 2;
  while (set.has(`${base} copy ${n}`.toLowerCase())) n += 1;
  return `${base} copy ${n}`;
}

/**
 * Compact a saved view for URL hash sharing.
 * @param {object} view
 */
export function compactAuditViewForShare(view) {
  const v = normalizeAuditSavedView(view || {});
  /** @type {Record<string, unknown>} */
  const out = {};
  if (v.name && v.name !== 'Untitled') out.n = v.name;
  if (v.folder) out.f = v.folder;
  if (v.starred) out.s = 1;
  if (v.action && v.action !== 'all') out.a = v.action;
  if (v.query) out.q = v.query;
  if (v.regex) out.r = 1;
  if (v.rangePreset && v.rangePreset !== 'all') out.p = v.rangePreset;
  if (v.toastInHashOnly) out.t = 1;
  return out;
}

/**
 * Expand a compact share payload back into a saved view shape.
 * @param {object} compact
 * @param {{ now?: number }} [opts]
 */
export function expandAuditViewFromShare(compact, opts = {}) {
  return normalizeAuditSavedView(
    {
      name: compact?.n || compact?.name,
      folder: compact?.f || compact?.folder,
      starred: compact?.s ?? compact?.starred,
      action: compact?.a || compact?.action,
      query: compact?.q ?? compact?.query,
      regex: compact?.r ?? compact?.regex,
      rangePreset: compact?.p || compact?.rangePreset,
      toastInHashOnly: compact?.t ?? compact?.toastInHashOnly,
    },
    { now: opts.now },
  );
}

/**
 * Encode saved view → `#flv=…` base64url JSON.
 * @param {object} view
 */
export function encodeAuditViewHash(view) {
  const compact = compactAuditViewForShare(view);
  const json = JSON.stringify(compact);
  const b64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(json, 'utf8').toString('base64url')
      : btoa(unescape(encodeURIComponent(json)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/g, '');
  return `flv=${b64}`;
}

/**
 * Decode `#flv=…` payload → saved view.
 * @param {string} hashOrQuery
 * @param {{ now?: number }} [opts]
 */
export function decodeAuditViewHash(hashOrQuery, opts = {}) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_view_hash',
        ok: false,
        reason: 'empty',
        view: null,
      },
      {},
    );
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(/(?:^|&)?flv=([^&]+)/);
  if (!m) {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_view_hash',
        ok: false,
        reason: 'no_flv',
        view: null,
      },
      {},
    );
  }
  raw = m[1];
  try {
    const pad = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(b64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    const view = expandAuditViewFromShare(obj, { now: opts.now });
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_view_hash',
        ok: true,
        view,
        hash: `flv=${m[1]}`,
      },
      {},
    );
  } catch {
    return applyComplianceGate(
      {
        kind: 'prefs_share_audit_view_hash',
        ok: false,
        reason: 'invalid',
        view: null,
      },
      {},
    );
  }
}

/**
 * Build a shareable Face Live URL for one audit saved view.
 * @param {object} view
 * @param {{
 *   origin?: string,
 *   path?: string,
 *   baseUrl?: string,
 *   now?: number,
 * }} [opts]
 */
export function buildAuditViewShareSnapshot(view, opts = {}) {
  const normalized = normalizeAuditSavedView(view || {}, { now: opts.now });
  const hash = encodeAuditViewHash(normalized);
  const path = opts.path || '/prototypes/face-live.html';
  const origin =
    opts.origin ||
    (typeof location !== 'undefined' ? location.origin : '') ||
    '';
  const shortUrl = origin ? `${origin}${path}#${hash}` : `${path}#${hash}`;
  const base =
    opts.baseUrl ||
    (origin ? `${origin}${path}` : path) ||
    path;
  return applyComplianceGate(
    {
      kind: 'prefs_share_audit_view_share',
      ok: true,
      view: normalized,
      hash,
      shortUrl,
      url: `${String(base).split('#')[0]}#${hash}`,
      copyText: shortUrl,
      summary: `${normalized.name} · ${normalized.action}${normalized.query ? ` · ${normalized.query}` : ''}`,
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
      if (idx >= 0) {
        views[idx] = {
          ...view,
          id: views[idx].id,
          folder:
            saveOpts.folder != null || filters.folder != null
              ? view.folder
              : views[idx].folder || view.folder,
        };
      } else views.push(view);
      while (views.length > max) views.shift();
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'save',
          ok: true,
          view: idx >= 0 ? views[idx] : view,
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
    duplicate(idOrName, dupOpts = {}) {
      const key = String(idOrName || '');
      const src =
        views.find((v) => v.id === key) ||
        views.find((v) => v.name.toLowerCase() === key.toLowerCase()) ||
        null;
      if (!src) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'duplicate',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      const requested = String(dupOpts.name || '').trim();
      const name = nextDuplicateViewName(
        requested || src.name,
        views.map((v) => v.name),
      );
      // When user supplied a free name, prefer it if unique.
      const uniqueRequested =
        requested &&
        !views.some((v) => v.name.toLowerCase() === requested.toLowerCase())
          ? requested
          : name;
      const saved = this.save(
        {
          action: src.action,
          query: src.query,
          regex: src.regex,
          rangePreset: src.rangePreset,
          folder: dupOpts.folder != null ? dupOpts.folder : src.folder,
          starred: false,
        },
        {
          name: uniqueRequested,
          folder: dupOpts.folder != null ? dupOpts.folder : src.folder,
          starred: false,
          now: dupOpts.now,
        },
      );
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'duplicate',
          ok: saved.ok,
          view: saved.view,
          sourceId: src.id,
          count: views.length,
        },
        {},
      );
    },
    setFolder(idOrName, folderName, folderOpts = {}) {
      const key = String(idOrName || '');
      const idx = views.findIndex(
        (v) =>
          v.id === key || v.name.toLowerCase() === key.toLowerCase(),
      );
      if (idx < 0) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'set_folder',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      const folder = String(folderName || '').trim();
      views[idx] = normalizeAuditSavedView(
        { ...views[idx], folder, savedAt: folderOpts.now ?? Date.now() },
        { now: folderOpts.now },
      );
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'set_folder',
          ok: true,
          view: views[idx],
          folder: views[idx].folder,
          count: views.length,
        },
        {},
      );
    },
    setStarred(idOrName, starred, starOpts = {}) {
      const key = String(idOrName || '');
      const idx = views.findIndex(
        (v) =>
          v.id === key || v.name.toLowerCase() === key.toLowerCase(),
      );
      if (idx < 0) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'set_starred',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      const id = views[idx].id;
      views[idx] = normalizeAuditSavedView(
        {
          ...views[idx],
          starred: !!starred,
          savedAt: starOpts.now ?? Date.now(),
        },
        { now: starOpts.now },
      );
      views = sortAuditViewsByStar(views).views;
      save();
      const view = views.find((v) => v.id === id) || null;
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'set_starred',
          ok: true,
          view,
          starred: !!view?.starred,
          count: views.length,
        },
        {},
      );
    },
    toggleStar(idOrName, starOpts = {}) {
      const got = this.get(idOrName);
      if (!got.ok || !got.view) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'toggle_star',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      return this.setStarred(got.view.id, !got.view.starred, starOpts);
    },
    /**
     * Star or unstar many views (optional id list; default = all / folder).
     * @param {boolean} starred
     * @param {{ ids?: string[], folder?: string|null, now?: number }} [bulkOpts]
     */
    bulkStar(starred, bulkOpts = {}) {
      const want = !!starred;
      const idSet = Array.isArray(bulkOpts.ids)
        ? new Set(bulkOpts.ids.map(String))
        : null;
      const folderFilter =
        bulkOpts.folder != null && String(bulkOpts.folder).trim() !== ''
          ? String(bulkOpts.folder).trim()
          : null;
      let changed = 0;
      views = views.map((v) => {
        if (idSet && !idSet.has(v.id) && !idSet.has(v.name)) return v;
        if (folderFilter) {
          const vFolder = String(v.folder || '').trim() || 'Inbox';
          if (vFolder !== folderFilter) return v;
        }
        if (!!v.starred === want) return v;
        changed += 1;
        return normalizeAuditSavedView(
          { ...v, starred: want, savedAt: bulkOpts.now ?? Date.now() },
          { now: bulkOpts.now },
        );
      });
      views = sortAuditViewsByStar(views).views;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'bulk_star',
          ok: true,
          starred: want,
          changed,
          count: views.length,
          starredCount: views.filter((v) => v.starred).length,
        },
        {},
      );
    },
    starAll(bulkOpts = {}) {
      return this.bulkStar(true, bulkOpts);
    },
    unstarAll(bulkOpts = {}) {
      return this.bulkStar(false, bulkOpts);
    },
    /**
     * Clear stars only inside a named folder (folder required).
     * @param {string} folder
     * @param {{ now?: number }} [clearOpts]
     */
    clearStarsInFolder(folder, clearOpts = {}) {
      const cleared = clearStarsInFolder(views, folder, clearOpts);
      if (!cleared.ok) return cleared;
      views = cleared.views;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'clear_stars_in_folder',
          ok: true,
          folder: cleared.folder,
          changed: cleared.changed,
          count: views.length,
          starredCount: views.filter((v) => v.starred).length,
          views: views.slice(),
        },
        {},
      );
    },
    /**
     * Delete unstarred views (optional folder scope).
     * @param {{ folder?: string|null }} [pruneOpts]
     */
    pruneUnstarred(pruneOpts = {}) {
      const pruned = pruneUnstarredViews(views, pruneOpts);
      if (!pruned.ok) return pruned;
      const removed = pruned.removed;
      views = pruned.views;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'prune_unstarred',
          ok: true,
          removed,
          folder: pruned.folder,
          count: views.length,
          starredCount: views.filter((v) => v.starred).length,
          views: views.slice(),
        },
        {},
      );
    },
    folders() {
      return groupAuditViewsByFolder(views);
    },
    move(idOrName, delta) {
      const key = String(idOrName || '');
      const from = views.findIndex(
        (v) =>
          v.id === key || v.name.toLowerCase() === key.toLowerCase(),
      );
      if (from < 0) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views',
            action: 'move',
            ok: false,
            reason: 'not_found',
            view: null,
          },
          {},
        );
      }
      const to = from + (Number(delta) || 0);
      const reordered = reorderAuditSavedViews(views, views[from].id, to);
      if (!reordered.ok) return reordered;
      views = reordered.views;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'move',
          ok: true,
          view: reordered.view || views[to],
          fromIndex: reordered.fromIndex,
          toIndex: reordered.toIndex,
          moved: !!reordered.moved,
          count: views.length,
        },
        {},
      );
    },
    reorder(orderedIds) {
      const applied = applyAuditViewsOrder(views, orderedIds);
      if (!applied.ok) return applied;
      views = applied.views;
      save();
      return applyComplianceGate(
        {
          kind: 'prefs_share_audit_views',
          action: 'reorder',
          ok: true,
          views: views.slice(),
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
    exportStarred(exportOpts = {}) {
      return exportAuditSavedViewsJson(views, {
        ...exportOpts,
        starredOnly: true,
      });
    },
    exportFolder(folderName, exportOpts = {}) {
      const folder = String(folderName || '').trim();
      if (!folder) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views_export',
            ok: false,
            reason: 'missing_folder',
            count: 0,
            folder: null,
          },
          {},
        );
      }
      return exportAuditSavedViewsJson(views, {
        ...exportOpts,
        folder,
      });
    },
    exportStarredFolder(folderName, exportOpts = {}) {
      const folder = String(folderName || '').trim();
      if (!folder) {
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views_export',
            ok: false,
            reason: 'missing_folder',
            count: 0,
            folder: null,
            starredOnly: true,
          },
          {},
        );
      }
      return exportAuditSavedViewsJson(views, {
        ...exportOpts,
        starredOnly: true,
        folder,
      });
    },
    exportToastHash(exportOpts = {}) {
      return exportAuditSavedViewsJson(views, {
        ...exportOpts,
        toastInHashOnly: true,
      });
    },
    importJson(raw, importOpts = {}) {
      const filters = resolveAuditViewsImportFilters(raw, {
        mergeStarredOnly: importOpts.mergeStarredOnly,
        mergeStarredOnlyExplicit: importOpts.mergeStarredOnlyExplicit,
        toastInHashOnly: importOpts.toastInHashOnly,
        toastInHashOnlyExplicit: importOpts.toastInHashOnlyExplicit,
        folder: importOpts.folder,
        folderExplicit: importOpts.folderExplicit,
        inheritExportMeta: importOpts.inheritExportMeta,
      });
      if (!filters.ok) return filters;

      const mergeStarredOnly = filters.mergeStarredOnly;
      const toastInHashOnly = filters.toastInHashOnly;
      const folder = filters.folder;

      const imported = importAuditSavedViewsJson(raw, {
        max,
        now: importOpts.now,
        merge: importOpts.merge,
        mergeStarredOnly,
      });
      if (!imported.ok) return imported;
      if (importOpts.merge) {
        const merged = mergeAuditSavedViewsImport(views, imported.views, {
          mergeStarredOnly,
          toastInHashOnly,
          folder,
          max,
          now: importOpts.now,
          appendOnly: !!importOpts.appendOnly,
        });
        views = merged.views;
        save();
        return applyComplianceGate(
          {
            kind: 'prefs_share_audit_views_import',
            ok: true,
            views: views.slice(),
            count: views.length,
            merge: true,
            mergeStarredOnly,
            toastInHashOnly,
            appendOnly: !!importOpts.appendOnly,
            folder,
            fromExportMeta: filters.fromExportMeta,
            added: merged.added,
            updated: merged.updated,
            skipped: merged.skipped,
          },
          {},
        );
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
          mergeStarredOnly,
          toastInHashOnly,
          folder,
          fromExportMeta: filters.fromExportMeta,
        },
        {},
      );
    },
  };
}

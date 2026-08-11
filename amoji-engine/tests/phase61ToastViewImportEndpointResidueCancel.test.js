import { describe, expect, it } from 'vitest';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
  mergeAuditSavedViewsImport,
  resolveAuditViewsImportFilters,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 61 toast hash view import filter', () => {
  it('inherits toastInHashOnly filter from export payload metadata', () => {
    const payload = exportAuditSavedViewsJson(
      [
        { name: 'Toast QR', toastInHashOnly: true, action: 'qr' },
        { name: 'Plain share', toastInHashOnly: false, action: 'share' },
      ],
      { toastInHashOnly: true },
    );

    const filters = resolveAuditViewsImportFilters(payload.payload, {
      inheritExportMeta: true,
    });
    expect(filters.ok).toBe(true);
    expect(filters.toastInHashOnly).toBe(true);
    expect(filters.fromExportMeta).toBe(true);
    expect(filters.exportToastInHashOnly).toBe(true);

    const store = createAuditSavedViews({ memory: true });
    const imported = store.importJson(payload.json, { merge: true, inheritExportMeta: true });
    expect(imported.ok).toBe(true);
    expect(imported.toastInHashOnly).toBe(true);
    expect(imported.fromExportMeta).toBe(true);
    expect(imported.count).toBe(1);
    expect(store.get('Toast QR').view?.toastInHashOnly).toBe(true);
  });

  it('respects explicit toast hash override over export metadata', () => {
    const payload = exportAuditSavedViewsJson(
      [{ name: 'Toast QR', toastInHashOnly: true, action: 'qr' }],
      { toastInHashOnly: true },
    );
    const filters = resolveAuditViewsImportFilters(payload.payload, {
      inheritExportMeta: true,
      toastInHashOnlyExplicit: true,
      toastInHashOnly: false,
    });
    expect(filters.toastInHashOnly).toBe(false);
  });

  it('skips non-toast views when merge toastInHashOnly is active', () => {
    const merged = mergeAuditSavedViewsImport(
      [{ name: 'Existing', toastInHashOnly: false, action: 'share' }],
      [
        { name: 'Toast A', toastInHashOnly: true, action: 'qr' },
        { name: 'Plain B', toastInHashOnly: false, action: 'share' },
      ],
      { toastInHashOnly: true },
    );
    expect(merged.added).toBe(1);
    expect(merged.skipped).toBe(1);
    expect(merged.toastInHashOnly).toBe(true);
    expect(merged.views.some((v) => v.name === 'Toast A')).toBe(true);
    expect(merged.views.some((v) => v.name === 'Plain B')).toBe(false);
  });
});

describe('Phase 61 cancel on TTS endpoint and deliver residue', () => {
  it('supports tts_endpoint_pick and deliver_residue_pick cancel reasons', () => {
    for (const reason of ['tts_endpoint_pick', 'deliver_residue_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

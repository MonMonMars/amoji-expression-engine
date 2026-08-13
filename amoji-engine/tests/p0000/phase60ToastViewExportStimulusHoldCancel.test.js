import { describe, expect, it } from 'vitest';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
  filterAuditSavedViews,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 60 toast hash view export filter', () => {
  it('filters and exports saved views with toastInHashOnly', () => {
    const views = [
      { name: 'Toast QR', toastInHashOnly: true, action: 'qr' },
      { name: 'All shares', toastInHashOnly: false, action: 'share' },
      { name: 'Toast share', toastInHashOnly: true, action: 'share', starred: true },
    ];
    const filtered = filterAuditSavedViews(views, { toastInHashOnly: true });
    expect(filtered.count).toBe(2);
    expect(filtered.toastInHashOnly).toBe(true);

    const exported = exportAuditSavedViewsJson(views, { toastInHashOnly: true });
    expect(exported.toastInHashOnly).toBe(true);
    expect(exported.count).toBe(2);
    expect(exported.total).toBe(3);
    expect(exported.payload.views.every((v) => v.toastInHashOnly)).toBe(true);
  });

  it('exportToastHash on store returns toast-hash views only', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save(
      { action: 'share', toastInHashOnly: true },
      { name: 'Hash share' },
    );
    store.save({ action: 'qr' }, { name: 'Plain QR' });
    const exported = store.exportToastHash();
    expect(exported.count).toBe(1);
    expect(exported.payload.views[0].name).toBe('Hash share');
  });
});

describe('Phase 60 cancel on stimulus and script hold release', () => {
  it('supports stimulus_pick and script_hold_release_pick', () => {
    for (const reason of ['stimulus_pick', 'script_hold_release_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

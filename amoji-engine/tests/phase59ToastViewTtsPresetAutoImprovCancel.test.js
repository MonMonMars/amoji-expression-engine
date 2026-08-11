import { describe, expect, it } from 'vitest';
import {
  normalizeAuditSavedView,
  snapshotAuditView,
  compactAuditViewForShare,
  expandAuditViewFromShare,
  encodeAuditViewHash,
  decodeAuditViewHash,
  createAuditSavedViews,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 59 toast hash saved views', () => {
  it('round-trips toastInHashOnly in saved views and #flv= hash', () => {
    const view = snapshotAuditView(
      {
        action: 'share',
        query: 'toast',
        regex: false,
        rangePreset: '24h',
        toastInHashOnly: true,
      },
      { name: 'Toast shares' },
    );
    expect(view.toastInHashOnly).toBe(true);

    const compact = compactAuditViewForShare(view);
    expect(compact.t).toBe(1);

    const expanded = expandAuditViewFromShare(compact);
    expect(expanded.toastInHashOnly).toBe(true);

    const hash = encodeAuditViewHash(view);
    const decoded = decodeAuditViewHash(`#${hash}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.view?.toastInHashOnly).toBe(true);
  });

  it('persists toastInHashOnly through audit saved views store', () => {
    const store = createAuditSavedViews({ memory: true });
    const saved = store.save(
      {
        action: 'qr',
        query: '',
        regex: false,
        rangePreset: 'all',
        toastInHashOnly: true,
      },
      { name: 'QR toast hash' },
    );
    expect(saved.view?.toastInHashOnly).toBe(true);
    expect(store.get('QR toast hash').view?.toastInHashOnly).toBe(true);
    expect(normalizeAuditSavedView({}).toastInHashOnly).toBe(false);
  });
});

describe('Phase 59 cancel on TTS preset and disc auto-improv', () => {
  it('supports tts_preset_pick and auto_improv_pick cancel reasons', () => {
    for (const reason of ['tts_preset_pick', 'auto_improv_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  cycleProbeToastFocusIndex,
  resolveProbeToastFocusTrap,
} from '../engine/ui/probeToastFocusTrap.js';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
  importAuditSavedViewsJson,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 39 probe toast focus trap', () => {
  it('cycles Tab / Shift+Tab indices', () => {
    expect(cycleProbeToastFocusIndex(3, 0, false)).toBe(1);
    expect(cycleProbeToastFocusIndex(3, 2, false)).toBe(0);
    expect(cycleProbeToastFocusIndex(3, 0, true)).toBe(2);
    expect(cycleProbeToastFocusIndex(0, 0, false)).toBe(0);
  });

  it('resolves Tab trap when toast is visible', () => {
    const tab = resolveProbeToastFocusTrap(
      { key: 'Tab', shiftKey: false },
      { visible: true, focusableCount: 3, activeIndex: 1 },
    );
    expect(tab.ok).toBe(true);
    expect(tab.trap).toBe(true);
    expect(tab.nextIndex).toBe(2);

    const shift = resolveProbeToastFocusTrap(
      { key: 'Tab', shiftKey: true },
      { visible: true, focusableCount: 3, activeIndex: 0 },
    );
    expect(shift.nextIndex).toBe(2);
    expect(resolveProbeToastFocusTrap({ key: 'Tab' }, { visible: false }).ok).toBe(
      false,
    );
    expect(
      resolveProbeToastFocusTrap({ key: 'c' }, { visible: true, focusableCount: 3 })
        .trap,
    ).toBe(false);
  });
});

describe('Phase 39 audit saved views export/import', () => {
  it('exports and imports named views', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save(
      { action: 'share', query: 'fear', regex: true, rangePreset: '24h' },
      { name: 'Fear' },
    );
    store.save(
      { action: 'qr', query: '', regex: false, rangePreset: '1h' },
      { name: 'QR' },
    );
    const exported = store.exportJson({ now: 1_700_000_000_000 });
    expect(exported.ok).toBe(true);
    expect(exported.count).toBe(2);
    expect(exported.payload.kind).toBe('amoji.faceLive.prefsShareAudit.views');

    const roundTrip = importAuditSavedViewsJson(exported.json);
    expect(roundTrip.ok).toBe(true);
    expect(roundTrip.count).toBe(2);

    const other = createAuditSavedViews({ memory: true });
    const merged = other.importJson(exported.json, { merge: true });
    expect(merged.ok).toBe(true);
    expect(other.size).toBe(2);
    expect(other.get('Fear').view?.query).toBe('fear');

    expect(importAuditSavedViewsJson('{bad').ok).toBe(false);
    expect(exportAuditSavedViewsJson([]).count).toBe(0);
  });
});

describe('Phase 39 cancel on mood change', () => {
  it('supports mood_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprise', emblemId: 'ok' },
      { reason: 'mood_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('mood_pick');
  });
});

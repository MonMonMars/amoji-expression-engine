import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_ACTIONS,
  resolveProbeToastShortcut,
  describeHealthProbeToast,
  formatHealthProbeDetail,
} from '../engine/tts/ttsHealthHistory.js';
import {
  createAuditSavedViews,
  snapshotAuditView,
  normalizeAuditSavedView,
  AUDIT_SAVED_VIEWS_MAX,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 38 probe toast shortcuts', () => {
  it('binds c / r / Escape on PROBE_TOAST_ACTIONS', () => {
    const shortcuts = Object.fromEntries(
      PROBE_TOAST_ACTIONS.map((a) => [a.id, a.shortcut]),
    );
    expect(shortcuts.copy).toBe('c');
    expect(shortcuts.reprobe).toBe('r');
    expect(shortcuts.dismiss).toBe('Escape');
  });

  it('resolves keyboard shortcuts when toast is visible', () => {
    expect(resolveProbeToastShortcut({ key: 'c' }, { visible: true }).action).toBe(
      'copy',
    );
    expect(resolveProbeToastShortcut({ key: 'R' }, { visible: true }).action).toBe(
      'reprobe',
    );
    expect(
      resolveProbeToastShortcut({ key: 'Escape' }, { visible: true }).action,
    ).toBe('dismiss');
    expect(resolveProbeToastShortcut({ key: 'c' }, { visible: false }).ok).toBe(
      false,
    );
    expect(
      resolveProbeToastShortcut({ key: 'c', metaKey: true }, { visible: true })
        .ok,
    ).toBe(false);
    expect(resolveProbeToastShortcut({ key: 'x' }, { visible: true }).ok).toBe(
      false,
    );
  });

  it('includes shortcuts on toast action payloads', () => {
    const detail = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 9,
      message: 'up',
      at: Date.now(),
    });
    const toast = describeHealthProbeToast(detail);
    expect(toast.actions.every((a) => a.shortcut)).toBe(true);
  });
});

describe('Phase 38 audit saved views', () => {
  it('snapshots and persists named filter views', () => {
    const store = createAuditSavedViews({ memory: true });
    const snap = snapshotAuditView(
      {
        action: 'share',
        query: 'fear',
        regex: true,
        rangePreset: '24h',
      },
      { name: 'Fear shares' },
    );
    expect(snap.name).toBe('Fear shares');
    expect(snap.regex).toBe(true);

    const saved = store.save(
      {
        action: 'qr',
        query: 'happy',
        regex: false,
        rangePreset: '1h',
      },
      { name: 'QR happy' },
    );
    expect(saved.ok).toBe(true);
    expect(store.size).toBe(1);
    expect(store.get('QR happy').view?.action).toBe('qr');
    expect(store.get(saved.view.id).ok).toBe(true);

    store.save(
      { action: 'export', query: '', regex: false, rangePreset: 'all' },
      { name: 'QR happy' },
    );
    expect(store.size).toBe(1);
    expect(store.get('QR happy').view?.action).toBe('export');

    expect(normalizeAuditSavedView({}).name).toBe('Untitled');
    expect(AUDIT_SAVED_VIEWS_MAX).toBeGreaterThanOrEqual(8);
  });

  it('removes and clears views', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'A' });
    store.save({ action: 'qr' }, { name: 'B' });
    expect(store.remove('A').ok).toBe(true);
    expect(store.size).toBe(1);
    expect(store.clear().count).toBe(0);
  });
});

describe('Phase 38 cancel on persona change', () => {
  it('supports persona_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'persona_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('persona_pick');
  });
});

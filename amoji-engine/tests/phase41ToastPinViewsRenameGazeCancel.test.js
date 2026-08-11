import { describe, expect, it, vi } from 'vitest';
import {
  PROBE_TOAST_ACTIONS,
  resolveProbeToastAction,
  resolveProbeToastShortcut,
} from '../engine/tts/ttsHealthHistory.js';
import { createProbeToastDismissTimer } from '../engine/ui/probeToastDismiss.js';
import {
  createAuditSavedViews,
  renameAuditSavedView,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 41 probe toast sticky pin', () => {
  it('includes pin action and shortcut p', () => {
    expect(PROBE_TOAST_ACTIONS.map((a) => a.id)).toContain('pin');
    expect(resolveProbeToastShortcut({ key: 'p' }, { visible: true }).action).toBe(
      'pin',
    );
    expect(resolveProbeToastAction('pin', { pinned: false }).pin).toBe(true);
    expect(resolveProbeToastAction('pin', { pinned: true }).unpin).toBe(true);
  });

  it('pins dismiss timer so auto-expire stops', () => {
    vi.useFakeTimers();
    let expired = 0;
    const timer = createProbeToastDismissTimer({
      dismissMs: 500,
      onExpire: () => {
        expired += 1;
      },
    });
    timer.start(500);
    expect(timer.pin().pinned).toBe(true);
    vi.advanceTimersByTime(2000);
    expect(expired).toBe(0);
    expect(timer.pinned).toBe(true);
    timer.unpin();
    vi.advanceTimersByTime(500);
    expect(expired).toBe(1);
    vi.useRealTimers();
  });
});

describe('Phase 41 audit views rename', () => {
  it('renames a selected saved view', () => {
    const store = createAuditSavedViews({ memory: true });
    const saved = store.save({ action: 'share', query: 'fear' }, { name: 'Old' });
    const renamed = store.rename(saved.view.id, 'Fear shares');
    expect(renamed.ok).toBe(true);
    expect(renamed.previousName).toBe('Old');
    expect(store.get('Fear shares').ok).toBe(true);
    expect(store.rename(saved.view.id, '').ok).toBe(false);
    store.save({ action: 'qr' }, { name: 'Taken' });
    expect(store.rename(saved.view.id, 'Taken').reason).toBe('name_taken');
    expect(renameAuditSavedView(saved.view, 'Pure').ok).toBe(true);
  });
});

describe('Phase 41 cancel on gaze mode', () => {
  it('supports gaze_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'stopPalm' },
      { reason: 'gaze_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('gaze_pick');
  });
});

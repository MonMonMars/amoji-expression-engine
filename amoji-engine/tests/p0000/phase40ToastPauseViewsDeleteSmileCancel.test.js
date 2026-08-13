import { describe, expect, it, vi } from 'vitest';
import {
  resolveProbeToastHoverPause,
  computeProbeToastRemainingMs,
  createProbeToastDismissTimer,
} from '../../engine/ui/probeToastDismiss.js';
import { createAuditSavedViews } from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 40 probe toast pause-on-hover', () => {
  it('resolves hover pause / resume', () => {
    const pause = resolveProbeToastHoverPause('pointerenter', { visible: true });
    expect(pause.ok).toBe(true);
    expect(pause.pause).toBe(true);
    const resume = resolveProbeToastHoverPause('mouseleave', {
      visible: true,
      paused: true,
    });
    expect(resume.resume).toBe(true);
    expect(resolveProbeToastHoverPause('click', { visible: true }).ok).toBe(false);
    expect(resolveProbeToastHoverPause('pointerenter', { visible: false }).ok).toBe(
      false,
    );
  });

  it('pauses and resumes dismiss timer remaining ms', () => {
    vi.useFakeTimers();
    let now = 1_000;
    let expired = 0;
    const timer = createProbeToastDismissTimer({
      dismissMs: 1000,
      now: () => now,
      onExpire: () => {
        expired += 1;
      },
    });
    timer.start(1000);
    now = 1_400;
    expect(computeProbeToastRemainingMs({ remainingMs: 1000, startedAt: 1000, now: 1400 })).toBe(
      600,
    );
    const paused = timer.pause();
    expect(paused.paused).toBe(true);
    expect(paused.remainingMs).toBe(600);
    now = 2_000;
    timer.resume();
    vi.advanceTimersByTime(600);
    expect(expired).toBe(1);
    expect(timer.active).toBe(false);
    vi.useRealTimers();
  });
});

describe('Phase 40 audit views delete', () => {
  it('removes a selected named view', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'Keep' });
    const doomed = store.save({ action: 'qr' }, { name: 'Doomed' });
    expect(store.remove(doomed.view.id).ok).toBe(true);
    expect(store.size).toBe(1);
    expect(store.get('Doomed').ok).toBe(false);
    expect(store.get('Keep').ok).toBe(true);
  });
});

describe('Phase 40 cancel on smile/laugh mode', () => {
  it('supports smile_pick and laugh_pick cancel reasons', () => {
    expect(
      cancelCompoundEmblemLifecycle(
        { compoundId: 'happy_surprise', emblemId: 'ok' },
        { reason: 'smile_pick' },
      ).reason,
    ).toBe('smile_pick');
    expect(
      cancelCompoundEmblemLifecycle(
        { compoundId: 'happy_surprise', emblemId: 'ok' },
        { reason: 'laugh_pick' },
      ).cancelled,
    ).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_HAPTIC_PATTERN,
  createProbeToastHaptic,
  resolveProbeToastHaptic,
} from '../engine/ui/probeToastHaptic.js';
import {
  createAuditSavedViews,
  mergeAuditSavedViewsImport,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 52 probe toast haptic stub', () => {
  it('resolves tone patterns and vibrates via stub', () => {
    const ok = resolveProbeToastHaptic({ tone: 'ok', event: 'show' });
    expect(ok.vibrate).toBe(true);
    expect(ok.pattern).toBe(PROBE_TOAST_HAPTIC_PATTERN.ok);
    const warn = resolveProbeToastHaptic({ tone: 'warn' });
    expect(Array.isArray(warn.pattern)).toBe(true);

    const calls = [];
    const player = createProbeToastHaptic({
      enabled: true,
      vibrate: (pattern) => {
        calls.push(pattern);
        return true;
      },
    });
    const played = player.play({ tone: 'bad' });
    expect(played.vibrated).toBe(true);
    expect(calls[0]).toEqual(PROBE_TOAST_HAPTIC_PATTERN.bad);

    const noApi = createProbeToastHaptic({ enabled: true, vibrate: null });
    expect(noApi.play({ tone: 'ok' }).reason).toBe('no_vibrate_api');
  });
});

describe('Phase 52 audit views import merge starred', () => {
  it('merges only starred views when flagged', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'Keep' });
    store.toggleStar('Keep');

    const payload = {
      kind: 'amoji.faceLive.prefsShareAudit.views',
      version: 1,
      views: [
        { name: 'Keep', action: 'qr', starred: true },
        { name: 'Skip', action: 'export', starred: false },
        { name: 'NewStar', action: 'share', starred: true, folder: 'Ops' },
      ],
    };

    const merged = store.importJson(payload, {
      merge: true,
      mergeStarredOnly: true,
    });
    expect(merged.ok).toBe(true);
    expect(merged.skipped).toBe(1);
    expect(merged.added).toBe(1);
    expect(merged.updated).toBe(1);
    expect(store.size).toBe(2);
    expect(store.get('Keep').view?.action).toBe('qr');
    expect(store.get('NewStar').view?.folder).toBe('Ops');
    expect(store.get('Skip').ok).toBe(false);

    const pure = mergeAuditSavedViewsImport(
      [{ name: 'A', starred: true, action: 'share' }],
      [
        { name: 'A', starred: true, action: 'qr' },
        { name: 'B', starred: false, action: 'export' },
      ],
      { mergeStarredOnly: true },
    );
    expect(pure.updated).toBe(1);
    expect(pure.skipped).toBe(1);
    expect(pure.views).toHaveLength(1);
    expect(pure.views[0].action).toBe('qr');
  });
});

describe('Phase 52 cancel on robot slew', () => {
  it('supports robotslew_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'robotslew_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('robotslew_pick');
  });
});

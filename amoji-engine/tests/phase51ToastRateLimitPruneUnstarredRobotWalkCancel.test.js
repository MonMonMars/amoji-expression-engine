import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_SOUND_MIN_INTERVAL_MS,
  createProbeToastSound,
  resolveProbeToastSound,
  resolveProbeToastSoundRateLimit,
} from '../engine/ui/probeToastSound.js';
import {
  createAuditSavedViews,
  pruneUnstarredViews,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 51 probe toast cue rate-limit', () => {
  it('blocks cues inside min interval', () => {
    expect(PROBE_TOAST_SOUND_MIN_INTERVAL_MS).toBeGreaterThan(0);
    const blocked = resolveProbeToastSoundRateLimit({
      lastPlayedAt: 1000,
      now: 1500,
      minIntervalMs: 1200,
    });
    expect(blocked.rateLimited).toBe(true);
    expect(blocked.reason).toBe('rate_limit');
    expect(blocked.retryAfterMs).toBe(700);

    const allowed = resolveProbeToastSound({
      tone: 'ok',
      lastPlayedAt: 1000,
      now: 2300,
      minIntervalMs: 1200,
    });
    expect(allowed.play).toBe(true);

    let t = 5000;
    const player = createProbeToastSound({
      enabled: true,
      AudioContext: null,
      minIntervalMs: 400,
      now: () => t,
    });
    const first = player.play({ tone: 'ok' });
    expect(first.reason).toBe('no_audio_context');
    expect(player.lastPlayedAt).toBe(5000);
    const second = player.play({ tone: 'ok' });
    expect(second.play).toBe(false);
    expect(second.reason).toBe('rate_limit');
    t += 500;
    const third = player.play({ tone: 'ok' });
    expect(third.reason).toBe('no_audio_context');
    expect(player.lastPlayedAt).toBe(5500);
  });
});

describe('Phase 51 audit views prune unstarred', () => {
  it('removes unstarred views with optional folder scope', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    store.save({ action: 'qr', folder: 'Ops' }, { name: 'B', folder: 'Ops' });
    store.save({ action: 'export', folder: 'Lab' }, { name: 'C', folder: 'Lab' });
    store.toggleStar('B');
    store.toggleStar('C');

    const ops = store.pruneUnstarred({ folder: 'Ops' });
    expect(ops.removed).toBe(1);
    expect(store.views.map((v) => v.name).sort()).toEqual(['B', 'C']);

    const all = store.pruneUnstarred();
    expect(all.removed).toBe(0);
    expect(store.views.map((v) => v.name).sort()).toEqual(['B', 'C']);

    const pure = pruneUnstarredViews(
      [
        { name: 'X', starred: false },
        { name: 'Y', starred: true },
      ],
      {},
    );
    expect(pure.removed).toBe(1);
    expect(pure.views).toHaveLength(1);
    expect(pure.views[0].name).toBe('Y');
  });
});

describe('Phase 51 cancel on robot walk', () => {
  it('supports robotwalk_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'robotwalk_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('robotwalk_pick');
  });
});

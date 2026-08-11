import { describe, expect, it } from 'vitest';
import {
  clampProbeToastVolume,
  createProbeToastSound,
  resolveProbeToastSound,
} from '../engine/ui/probeToastSound.js';
import {
  clearStarsInFolder,
  createAuditSavedViews,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 49 probe toast volume slider', () => {
  it('clamps and applies volume to cue gain', () => {
    expect(clampProbeToastVolume(1.5)).toBe(1);
    expect(clampProbeToastVolume(-0.2)).toBe(0);
    expect(clampProbeToastVolume('nope', 0.5)).toBe(0.5);
    const half = resolveProbeToastSound({ volume: 0.5, tone: 'ok' });
    expect(half.play).toBe(true);
    expect(half.volume).toBe(0.5);
    expect(half.gain).toBeCloseTo(0.0175, 4);
    const silent = resolveProbeToastSound({ volume: 0, tone: 'ok' });
    expect(silent.play).toBe(false);
    expect(silent.reason).toBe('volume');
    const player = createProbeToastSound({
      enabled: true,
      AudioContext: null,
      volume: 0.8,
    });
    expect(player.volume).toBe(0.8);
    expect(player.setVolume(0.25).volume).toBe(0.25);
    expect(player.play({ tone: 'warn' }).gain).toBeCloseTo(0.00875, 4);
  });
});

describe('Phase 49 audit views clear stars in folder', () => {
  it('requires a folder and clears only that folder’s stars', () => {
    const missing = clearStarsInFolder(
      [{ name: 'A', starred: true, folder: 'Ops' }],
      '',
    );
    expect(missing.ok).toBe(false);
    expect(missing.reason).toBe('missing_folder');

    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    store.save({ action: 'qr', folder: 'Ops' }, { name: 'B', folder: 'Ops' });
    store.save({ action: 'export', folder: 'Lab' }, { name: 'C', folder: 'Lab' });
    store.starAll();
    expect(store.views.filter((v) => v.starred).length).toBe(3);

    const cleared = store.clearStarsInFolder('Ops');
    expect(cleared.ok).toBe(true);
    expect(cleared.changed).toBe(2);
    expect(cleared.folder).toBe('Ops');
    const byName = Object.fromEntries(store.views.map((v) => [v.name, v]));
    expect(byName.A.starred).toBe(false);
    expect(byName.B.starred).toBe(false);
    expect(byName.C.starred).toBe(true);

    const again = store.clearStarsInFolder('');
    expect(again.ok).toBe(false);
    expect(again.reason).toBe('missing_folder');
  });
});

describe('Phase 49 cancel on improv', () => {
  it('supports improv_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'improv_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('improv_pick');
  });
});

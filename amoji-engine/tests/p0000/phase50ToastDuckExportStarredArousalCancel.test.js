import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_SOUND_DUCK_FACTOR,
  createProbeToastSound,
  effectiveProbeToastVolume,
  resolveProbeToastSound,
} from '../../engine/ui/probeToastSound.js';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 50 probe toast duck on pin', () => {
  it('ducks effective volume while pinned', () => {
    expect(effectiveProbeToastVolume({ volume: 1, ducked: true })).toBeCloseTo(
      PROBE_TOAST_SOUND_DUCK_FACTOR,
      4,
    );
    const ducked = resolveProbeToastSound({
      volume: 1,
      ducked: true,
      tone: 'ok',
    });
    expect(ducked.play).toBe(true);
    expect(ducked.ducked).toBe(true);
    expect(ducked.baseVolume).toBe(1);
    expect(ducked.volume).toBeCloseTo(PROBE_TOAST_SOUND_DUCK_FACTOR, 4);
    expect(ducked.gain).toBeCloseTo(0.035 * PROBE_TOAST_SOUND_DUCK_FACTOR, 4);

    const player = createProbeToastSound({
      enabled: true,
      AudioContext: null,
      volume: 1,
    });
    expect(player.ducked).toBe(false);
    player.duck();
    expect(player.ducked).toBe(true);
    expect(player.play({ tone: 'warn' }).volume).toBeCloseTo(
      PROBE_TOAST_SOUND_DUCK_FACTOR,
      4,
    );
    player.unduck();
    expect(player.ducked).toBe(false);
    expect(player.play({ tone: 'warn' }).volume).toBe(1);
  });
});

describe('Phase 50 audit views export starred-only', () => {
  it('exports only starred views', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'A' });
    store.save({ action: 'qr' }, { name: 'B' });
    store.save({ action: 'export' }, { name: 'C' });
    store.toggleStar('B');
    store.toggleStar('C');

    const all = store.exportJson({ now: 1_700_000_000_000 });
    expect(all.count).toBe(3);
    expect(all.starredOnly).toBe(false);

    const starred = store.exportStarred({ now: 1_700_000_000_000 });
    expect(starred.ok).toBe(true);
    expect(starred.starredOnly).toBe(true);
    expect(starred.count).toBe(2);
    expect(starred.payload.views.map((v) => v.name).sort()).toEqual(['B', 'C']);
    expect(starred.payload.starredOnly).toBe(true);

    const empty = exportAuditSavedViewsJson(
      [{ name: 'X', starred: false }],
      { starredOnly: true },
    );
    expect(empty.count).toBe(0);
    expect(empty.starredOnly).toBe(true);
  });
});

describe('Phase 50 cancel on arousal', () => {
  it('supports arousal_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'arousal_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('arousal_pick');
  });
});

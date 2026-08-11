import { describe, expect, it } from 'vitest';
import {
  resolveProbeToastSound,
  createProbeToastSound,
  PROBE_TOAST_SOUND_FREQ,
} from '../engine/ui/probeToastSound.js';
import { createAuditSavedViews } from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 47 probe toast sound cue', () => {
  it('resolves tone frequencies and respects mute/disable', () => {
    expect(resolveProbeToastSound({ tone: 'ok' }).frequencyHz).toBe(
      PROBE_TOAST_SOUND_FREQ.ok,
    );
    expect(resolveProbeToastSound({ tone: 'bad' }).play).toBe(true);
    expect(resolveProbeToastSound({ enabled: false }).play).toBe(false);
    expect(resolveProbeToastSound({ muted: true }).reason).toBe('muted');
    const player = createProbeToastSound({
      enabled: true,
      AudioContext: null,
    });
    expect(player.play({ tone: 'warn' }).reason).toBe('no_audio_context');
    player.setMuted(true);
    expect(player.play({ tone: 'ok' }).play).toBe(false);
  });
});

describe('Phase 47 audit views bulk star', () => {
  it('stars and unstars many views, optionally by folder', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    store.save({ action: 'qr', folder: 'Ops' }, { name: 'B', folder: 'Ops' });
    store.save({ action: 'export' }, { name: 'C' });
    const starred = store.starAll({ folder: 'Ops' });
    expect(starred.changed).toBe(2);
    expect(store.get('A').view.starred).toBe(true);
    expect(store.get('C').view.starred).toBe(false);
    const all = store.starAll();
    expect(all.changed).toBe(1);
    expect(store.unstarAll().changed).toBe(3);
    expect(store.views.every((v) => !v.starred)).toBe(true);
  });
});

describe('Phase 47 cancel on step-out', () => {
  it('supports stepout_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprise', emblemId: 'wave' },
      { reason: 'stepout_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('stepout_pick');
  });
});

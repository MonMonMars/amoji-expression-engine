import { describe, expect, it } from 'vitest';
import { createLinkedProbeToastMute } from '../../engine/ui/probeToastFeedback.js';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

function stubPlayer() {
  let muted = false;
  return {
    get muted() {
      return muted;
    },
    setMuted(on) {
      muted = !!on;
      return { muted };
    },
    toggleMute() {
      muted = !muted;
      return { muted };
    },
  };
}

describe('Phase 54 linked probe toast mute', () => {
  it('links sound and haptic mute when enabled', () => {
    const sound = stubPlayer();
    const haptic = stubPlayer();
    const linked = createLinkedProbeToastMute(sound, haptic, { linked: true });
    linked.toggleSoundMute();
    expect(linked.soundMuted).toBe(true);
    expect(linked.hapticMuted).toBe(true);
    linked.setLinked(false);
    linked.toggleHapticMute();
    expect(linked.hapticMuted).toBe(false);
    expect(linked.soundMuted).toBe(true);
    linked.toggleSoundMute();
    expect(linked.soundMuted).toBe(false);
    expect(linked.hapticMuted).toBe(false);
  });
});

describe('Phase 54 audit views export folder filter', () => {
  it('exports only views in the requested folder', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    store.save({ action: 'qr', folder: 'Ops' }, { name: 'B', folder: 'Ops' });
    store.save({ action: 'export', folder: 'Lab' }, { name: 'C', folder: 'Lab' });

    const exported = store.exportFolder('Ops', { now: 1_700_000_000_000 });
    expect(exported.ok).toBe(true);
    expect(exported.folder).toBe('Ops');
    expect(exported.count).toBe(2);
    expect(exported.payload.views.map((v) => v.name).sort()).toEqual(['A', 'B']);

    const missing = store.exportFolder('');
    expect(missing.ok).toBe(false);
    expect(missing.reason).toBe('missing_folder');

    const empty = exportAuditSavedViewsJson(
      [{ name: 'X', folder: 'Lab' }],
      { folder: 'Ops' },
    );
    expect(empty.count).toBe(0);
    expect(empty.folder).toBe('Ops');
  });
});

describe('Phase 54 cancel on threat and sigh', () => {
  it('supports threat_pick and sigh_pick cancel reasons', () => {
    for (const reason of ['threat_pick', 'sigh_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

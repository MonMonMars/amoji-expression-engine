import { describe, expect, it } from 'vitest';
import {
  defaultFaceLivePrefs,
  normalizeFaceLivePrefs,
  saveFaceLivePrefs,
  loadFaceLivePrefs,
  clearFaceLivePrefs,
} from '../engine/ui/faceLivePrefs.js';
import {
  createAuditSavedViews,
  exportAuditSavedViewsJson,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 55 toast feedback prefs persist', () => {
  it('normalizes and round-trips probe toast feedback fields', () => {
    const defaults = defaultFaceLivePrefs();
    expect(defaults.probeToastLinkMute).toBe(true);
    expect(defaults.probeToastVolume).toBe(1);

    const n = normalizeFaceLivePrefs({
      probeToastSoundMuted: true,
      probeToastHapticMuted: false,
      probeToastLinkMute: false,
      probeToastVolume: 1.5,
    });
    expect(n.probeToastSoundMuted).toBe(true);
    expect(n.probeToastLinkMute).toBe(false);
    expect(n.probeToastVolume).toBe(1);

    clearFaceLivePrefs({ memory: true });
    saveFaceLivePrefs(
      {
        probeToastSoundMuted: true,
        probeToastHapticMuted: true,
        probeToastLinkMute: true,
        probeToastVolume: 0.4,
      },
      { memory: true },
    );
    const loaded = loadFaceLivePrefs({ memory: true });
    expect(loaded.prefs.probeToastSoundMuted).toBe(true);
    expect(loaded.prefs.probeToastVolume).toBe(0.4);
    clearFaceLivePrefs({ memory: true });
  });
});

describe('Phase 55 audit views export starred+folder', () => {
  it('exports starred views within a folder only', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    store.save({ action: 'qr', folder: 'Ops' }, { name: 'B', folder: 'Ops' });
    store.save({ action: 'export', folder: 'Lab' }, { name: 'C', folder: 'Lab' });
    store.toggleStar('A');
    store.toggleStar('C');

    const exported = store.exportStarredFolder('Ops', {
      now: 1_700_000_000_000,
    });
    expect(exported.ok).toBe(true);
    expect(exported.starredOnly).toBe(true);
    expect(exported.folder).toBe('Ops');
    expect(exported.count).toBe(1);
    expect(exported.payload.views[0].name).toBe('A');

    const pure = exportAuditSavedViewsJson(
      [
        { name: 'S1', starred: true, folder: 'Ops' },
        { name: 'S2', starred: true, folder: 'Lab' },
        { name: 'U', starred: false, folder: 'Ops' },
      ],
      { starredOnly: true, folder: 'Ops' },
    );
    expect(pure.count).toBe(1);
    expect(pure.payload.views[0].name).toBe('S1');
  });
});

describe('Phase 55 cancel on turn segment', () => {
  it('supports turn_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'turn_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('turn_pick');
  });
});

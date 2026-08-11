import { describe, expect, it } from 'vitest';
import { createProbeToastSound } from '../engine/ui/probeToastSound.js';
import {
  createAuditSavedViews,
  filterAuditSavedViews,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 48 probe toast mute toggle', () => {
  it('toggles mute on the toast sound player', () => {
    const player = createProbeToastSound({
      enabled: true,
      AudioContext: null,
    });
    expect(player.muted).toBe(false);
    expect(player.toggleMute().muted).toBe(true);
    expect(player.play({ tone: 'ok' }).play).toBe(false);
    expect(player.toggleMute().muted).toBe(false);
  });
});

describe('Phase 48 audit views star-only filter', () => {
  it('filters to starred views only', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'A' });
    store.save({ action: 'qr' }, { name: 'B' });
    store.toggleStar('B');
    const all = filterAuditSavedViews(store.views, { starredOnly: false });
    expect(all.count).toBe(2);
    const starred = filterAuditSavedViews(store.views, { starredOnly: true });
    expect(starred.count).toBe(1);
    expect(starred.views[0].name).toBe('B');
    store.save(
      { action: 'export', folder: 'Ops' },
      { name: 'C', folder: 'Ops' },
    );
    store.toggleStar('C');
    const opsStarred = filterAuditSavedViews(store.views, {
      starredOnly: true,
      folder: 'Ops',
    });
    expect(opsStarred.count).toBe(1);
    expect(opsStarred.views[0].name).toBe('C');
  });
});

describe('Phase 48 cancel on mood leak', () => {
  it('supports leak_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'leak_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('leak_pick');
  });
});

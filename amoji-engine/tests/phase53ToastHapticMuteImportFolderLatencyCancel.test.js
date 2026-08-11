import { describe, expect, it } from 'vitest';
import {
  createProbeToastHaptic,
  resolveProbeToastHaptic,
} from '../engine/ui/probeToastHaptic.js';
import {
  createAuditSavedViews,
  mergeAuditSavedViewsImport,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 53 probe toast haptic mute', () => {
  it('toggles mute and blocks vibration', () => {
    expect(resolveProbeToastHaptic({ muted: true }).reason).toBe('muted');
    const calls = [];
    const player = createProbeToastHaptic({
      enabled: true,
      vibrate: (pattern) => {
        calls.push(pattern);
        return true;
      },
    });
    expect(player.muted).toBe(false);
    expect(player.toggleMute().muted).toBe(true);
    expect(player.play({ tone: 'ok' }).vibrate).toBe(false);
    expect(player.play({ tone: 'ok' }).reason).toBe('muted');
    expect(calls).toHaveLength(0);
    player.toggleMute();
    expect(player.play({ tone: 'ok' }).vibrated).toBe(true);
    expect(calls).toHaveLength(1);
  });
});

describe('Phase 53 audit views import folder filter', () => {
  it('merges only views matching the folder filter', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });

    const payload = {
      kind: 'amoji.faceLive.prefsShareAudit.views',
      version: 1,
      views: [
        { name: 'A', action: 'qr', folder: 'Ops', starred: true },
        { name: 'B', action: 'export', folder: 'Ops' },
        { name: 'C', action: 'share', folder: 'Lab' },
      ],
    };

    const merged = store.importJson(payload, {
      merge: true,
      folder: 'Ops',
    });
    expect(merged.ok).toBe(true);
    expect(merged.folder).toBe('Ops');
    expect(merged.added).toBe(1);
    expect(merged.updated).toBe(1);
    expect(merged.skipped).toBe(1);
    expect(store.size).toBe(2);
    expect(store.get('A').view?.action).toBe('qr');
    expect(store.get('B').ok).toBe(true);
    expect(store.get('C').ok).toBe(false);

    const pure = mergeAuditSavedViewsImport(
      [{ name: 'X', folder: 'Ops', action: 'share' }],
      [
        { name: 'X', folder: 'Ops', action: 'qr', starred: true },
        { name: 'Y', folder: 'Lab', action: 'export', starred: true },
      ],
      { folder: 'Ops', mergeStarredOnly: true },
    );
    expect(pure.updated).toBe(1);
    expect(pure.skipped).toBe(1);
    expect(pure.folder).toBe('Ops');
    expect(pure.views).toHaveLength(1);
    expect(pure.views[0].action).toBe('qr');
  });
});

describe('Phase 53 cancel on latency', () => {
  it('supports latency_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'selfHug' },
      { reason: 'latency_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('latency_pick');
  });
});

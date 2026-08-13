import { describe, expect, it } from 'vitest';
import {
  createGatewayHealthHistory,
  describeProbeToastSlaBadge,
  summarizeHealthHistory,
} from '../../engine/tts/ttsHealthHistory.js';
import {
  createAuditSavedViews,
  groupAuditViewsByFolder,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 44 probe toast SLA badge', () => {
  it('formats an SLA badge from history summary', () => {
    const hist = createGatewayHealthHistory();
    hist.push({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 12,
      message: 'up',
      at: 1_000,
    });
    hist.push({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 18,
      message: 'up',
      at: 2_000,
    });
    const sla = hist.summarize({ now: 2_000 });
    const badge = describeProbeToastSlaBadge(sla);
    expect(badge.show).toBe(true);
    expect(badge.text).toContain('SLA');
    expect(badge.text).toContain('%');
    expect(describeProbeToastSlaBadge(null).show).toBe(false);
    expect(
      describeProbeToastSlaBadge(summarizeHealthHistory([])).show,
    ).toBe(false);
  });
});

describe('Phase 44 audit views folders', () => {
  it('groups and moves views between folders', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save(
      { action: 'share', query: 'fear', folder: 'Ops' },
      { name: 'Fear', folder: 'Ops' },
    );
    store.save({ action: 'qr' }, { name: 'Loose' });
    const grouped = store.folders();
    expect(grouped.folderNames).toEqual(expect.arrayContaining(['Inbox', 'Ops']));
    expect(groupAuditViewsByFolder(store.views).count).toBeGreaterThanOrEqual(2);
    const moved = store.setFolder('Loose', 'Ops');
    expect(moved.ok).toBe(true);
    expect(moved.view.folder).toBe('Ops');
    const inbox = store.folders().folders.find((f) => f.name === 'Inbox');
    expect(inbox?.count || 0).toBe(0);
  });
});

describe('Phase 44 cancel on spin/cycle', () => {
  it('supports spin_pick and cycle_pick cancel reasons', () => {
    expect(
      cancelCompoundEmblemLifecycle(
        { compoundId: 'happy_surprise', emblemId: 'wave' },
        { reason: 'spin_pick' },
      ).reason,
    ).toBe('spin_pick');
    expect(
      cancelCompoundEmblemLifecycle(
        { compoundId: 'happy_surprise', emblemId: 'wave' },
        { reason: 'cycle_pick' },
      ).cancelled,
    ).toBe(true);
  });
});

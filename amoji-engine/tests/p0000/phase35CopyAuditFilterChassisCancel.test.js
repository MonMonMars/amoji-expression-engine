import { describe, expect, it } from 'vitest';
import {
  buildHealthProbeCopyPayload,
  formatHealthProbeDetail,
} from '../../engine/tts/ttsHealthHistory.js';
import {
  filterShareAuditEntries,
  formatShareAuditLog,
  listShareAuditActions,
  createPrefsShareAudit,
} from '../../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 35 probe detail copy', () => {
  it('builds clipboard payload from detail object', () => {
    const detail = formatHealthProbeDetail(
      {
        ok: true,
        status: 'up',
        tone: 'ok',
        latencyMs: 33,
        httpStatus: 200,
        message: 'up · 200',
        at: 1_700_000_000_000,
      },
      { index: 0, total: 1 },
    );
    const payload = buildHealthProbeCopyPayload(detail);
    expect(payload.ok).toBe(true);
    expect(payload.copyText).toContain('latency');
    expect(payload.copyText).toContain('up');
  });

  it('rejects empty / placeholder text', () => {
    expect(buildHealthProbeCopyPayload('probe · click sparkline').ok).toBe(false);
    expect(buildHealthProbeCopyPayload(null).ok).toBe(false);
    expect(buildHealthProbeCopyPayload({ ok: false, lines: [] }).ok).toBe(false);
  });
});

describe('Phase 35 audit clear/filter', () => {
  it('filters by action and lists actions', () => {
    const entries = [
      { action: 'share', at: 1, summary: 'a' },
      { action: 'qr', at: 2, summary: 'b' },
      { action: 'share', at: 3, summary: 'c' },
      { action: 'revoke', at: 4, summary: 'd' },
    ];
    expect(filterShareAuditEntries(entries, { action: 'share' })).toHaveLength(2);
    expect(filterShareAuditEntries(entries, { action: 'all' })).toHaveLength(4);
    expect(listShareAuditActions(entries)).toEqual([
      'all',
      'qr',
      'revoke',
      'share',
    ]);
    const fmt = formatShareAuditLog(entries, { action: 'qr', limit: 6 });
    expect(fmt.count).toBe(1);
    expect(fmt.filter).toBe('qr');
    expect(fmt.lines[0]).toMatch(/qr/);
  });

  it('clears audit store', () => {
    const audit = createPrefsShareAudit({ memory: true });
    audit.record('share', { now: 1, summary: 'x' });
    expect(audit.size).toBe(1);
    audit.clear();
    expect(audit.size).toBe(0);
    expect(audit.format().count).toBe(0);
  });
});

describe('Phase 35 cancel on chassis/pack pick', () => {
  it('supports chassis_pick and pack_pick reasons', () => {
    const a = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprised', emblemId: 'wave' },
      { reason: 'chassis_pick' },
    );
    expect(a.cancelled).toBe(true);
    expect(a.reason).toBe('chassis_pick');
    const b = cancelCompoundEmblemLifecycle(
      { compoundId: 'sad_angry', emblemId: 'stopPalm' },
      { reason: 'pack_pick' },
    );
    expect(b.reason).toBe('pack_pick');
    expect(b.clearCompound).toBe(true);
  });
});

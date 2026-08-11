import { describe, expect, it } from 'vitest';
import {
  resolveSparklineProbeAt,
  formatHealthProbeDetail,
  createGatewayHealthHistory,
} from '../engine/tts/ttsHealthHistory.js';
import {
  exportShareAuditJson,
  createPrefsShareAudit,
} from '../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 34 sparkline probe detail', () => {
  it('resolves nearest probe by x ratio', () => {
    const samples = [
      { ok: true, status: 'up', latencyMs: 20, message: 'a', at: 1 },
      { ok: true, status: 'up', latencyMs: 40, message: 'b', at: 2 },
      { ok: false, status: 'down', latencyMs: 90, message: 'c', at: 3 },
    ];
    const left = resolveSparklineProbeAt(samples, 0);
    expect(left.ok).toBe(true);
    expect(left.index).toBe(0);
    expect(left.sample.message).toBe('a');
    const right = resolveSparklineProbeAt(samples, 1);
    expect(right.index).toBe(2);
    expect(right.sample.ok).toBe(false);
  });

  it('formats probe detail lines via history.probeDetail', () => {
    const hist = createGatewayHealthHistory();
    hist.push({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 42,
      httpStatus: 200,
      message: 'up · 200 · 42ms',
    });
    hist.push({
      ok: false,
      status: 'down',
      tone: 'bad',
      latencyMs: 120,
      httpStatus: 500,
      message: 'down · 500',
    });
    const detail = hist.probeDetail(1);
    expect(detail.ok).toBe(true);
    expect(detail.lines.join('\n')).toMatch(/down/);
    expect(detail.lines.join('\n')).toMatch(/latency/);
    expect(formatHealthProbeDetail(null).ok).toBe(false);
  });
});

describe('Phase 34 audit export JSON', () => {
  it('exports pretty JSON payload', () => {
    const audit = createPrefsShareAudit({ memory: true });
    audit.record('share', {
      now: 1_700_000_000_000,
      prefs: { emotion: 'sad' },
      hash: 'flp=x',
    });
    const exported = audit.exportJson({ now: 1_700_000_100_000 });
    expect(exported.ok).toBe(true);
    expect(exported.count).toBe(1);
    expect(exported.json).toContain('amoji.faceLive.prefsShareAudit');
    const parsed = JSON.parse(exported.json);
    expect(parsed.entries[0].action).toBe('share');
    expect(exportShareAuditJson([]).count).toBe(0);
  });
});

describe('Phase 34 cancel on finger preset pick', () => {
  it('supports finger_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'angry_disgust', emblemId: 'stopPalm' },
      { reason: 'finger_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('finger_pick');
    expect(out.clearCompound).toBe(true);
  });
});

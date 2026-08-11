import { describe, expect, it } from 'vitest';
import {
  buildHealthSparklineSeries,
  buildHealthSparklineSvg,
  createGatewayHealthHistory,
} from '../engine/tts/ttsHealthHistory.js';
import {
  createPrefsShareAudit,
  formatShareAuditLog,
  normalizeShareAuditEntry,
} from '../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 33 SLA sparkline HUD', () => {
  it('builds normalized series and SVG sparkline', () => {
    const samples = [
      { ok: true, status: 'up', latencyMs: 40, at: 1 },
      { ok: true, status: 'up', latencyMs: 80, at: 2 },
      { ok: false, status: 'down', latencyMs: 200, at: 3 },
    ];
    const series = buildHealthSparklineSeries(samples);
    expect(series.count).toBe(3);
    expect(series.points[0].ok).toBe(true);
    expect(series.points[2].ok).toBe(false);
    expect(series.maxLatencyMs).toBe(200);

    const svg = buildHealthSparklineSvg(samples, { width: 100, height: 24 });
    expect(svg.empty).toBe(false);
    expect(svg.svg).toContain('<svg');
    expect(svg.svg).toContain('<line');
    expect(svg.polyline).toBeTruthy();
  });

  it('renders empty sparkline and history.sparkline()', () => {
    expect(buildHealthSparklineSvg([]).empty).toBe(true);
    const hist = createGatewayHealthHistory();
    hist.push({ ok: true, status: 'up', latencyMs: 30, message: 'up' });
    const spark = hist.sparkline({ width: 80, height: 20 });
    expect(spark.count).toBe(1);
    expect(spark.svg).toContain('circle');
  });
});

describe('Phase 33 prefs share audit log', () => {
  it('records share/qr/revoke and formats lines', () => {
    const audit = createPrefsShareAudit({ memory: true, persist: false });
    audit.record('share', {
      now: 1_700_000_000_000,
      prefs: { emotion: 'fear', fingerPresetId: 'self-hug' },
      hash: 'flp=abc',
      expiryHint: 'fresh · ~7d left',
    });
    audit.record('qr', {
      now: 1_700_000_001_000,
      prefs: { emotion: 'happy' },
      hash: 'flp=def',
    });
    audit.record('revoke', {
      now: 1_700_000_002_000,
      summary: 'deep-link cleared',
    });
    expect(audit.size).toBe(3);
    const fmt = formatShareAuditLog(audit.entries, { limit: 3 });
    expect(fmt.count).toBe(3);
    expect(fmt.lines[0]).toMatch(/share/);
    expect(fmt.lines[2]).toMatch(/revoke/);
    expect(normalizeShareAuditEntry({ action: 'export' }).action).toBe('export');
  });

  it('caps history length', () => {
    const audit = createPrefsShareAudit({ memory: true, max: 4 });
    for (let i = 0; i < 6; i++) {
      audit.record('share', {
        now: 1000 + i,
        summary: `n${i}`,
      });
    }
    expect(audit.size).toBe(4);
    expect(audit.entries[0].summary).toBe('n2');
  });
});

describe('Phase 33 cancel on emblem pick', () => {
  it('supports emblem_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprised', emblemId: 'wave' },
      { reason: 'emblem_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('emblem_pick');
    expect(out.clearEmblem).toBe(true);
  });
});

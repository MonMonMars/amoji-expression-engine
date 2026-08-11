import { describe, expect, it } from 'vitest';
import {
  describeHealthProbeToast,
  resolveProbeToastAction,
  formatHealthProbeDetail,
  PROBE_TOAST_ACTIONS,
} from '../engine/tts/ttsHealthHistory.js';
import {
  filterShareAuditEntries,
  formatShareAuditLog,
  resolveAuditDateRange,
} from '../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 37 probe toast actions', () => {
  it('includes copy/reprobe/dismiss actions', () => {
    const detail = formatHealthProbeDetail({
      ok: false,
      status: 'down',
      tone: 'bad',
      latencyMs: 200,
      message: 'down · 500',
      at: Date.now(),
    });
    const toast = describeHealthProbeToast(detail);
    expect(toast.show).toBe(true);
    expect(toast.actions.map((a) => a.id)).toEqual(
      PROBE_TOAST_ACTIONS.map((a) => a.id),
    );
  });

  it('resolves toast action intents', () => {
    const detail = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 12,
      message: 'up',
      at: Date.now(),
    });
    const copy = resolveProbeToastAction('copy', { detail });
    expect(copy.ok).toBe(true);
    expect(copy.copy.ok).toBe(true);
    expect(resolveProbeToastAction('reprobe').reprobe).toBe(true);
    expect(resolveProbeToastAction('dismiss').dismiss).toBe(true);
    expect(resolveProbeToastAction('nope').ok).toBe(false);
  });
});

describe('Phase 37 audit regex / date range', () => {
  it('filters with regex and range presets', () => {
    const now = 2_000_000_000_000;
    const entries = [
      { action: 'share', at: now - 30 * 60 * 1000, summary: 'fear · self-hug' },
      { action: 'qr', at: now - 2 * 3600 * 1000, summary: 'happy · rest' },
      { action: 'revoke', at: now - 3 * 86400000, summary: 'deep-link cleared' },
    ];
    expect(
      filterShareAuditEntries(entries, {
        query: 'fear|happy',
        regex: true,
        now,
      }),
    ).toHaveLength(2);
    expect(
      filterShareAuditEntries(entries, {
        rangePreset: '1h',
        now,
      }),
    ).toHaveLength(1);
    expect(
      filterShareAuditEntries(entries, {
        rangePreset: '24h',
        now,
      }),
    ).toHaveLength(2);
    const range = resolveAuditDateRange({ rangePreset: '7d', now });
    expect(range.active).toBe(true);
    expect(range.label).toBe('7d');
    const fmt = formatShareAuditLog(entries, {
      query: '^share',
      regex: true,
      rangePreset: '7d',
      now,
    });
    expect(fmt.count).toBe(1);
    expect(fmt.regex).toBe(true);
  });
});

describe('Phase 37 cancel on surface level', () => {
  it('supports surface_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'angry_disgust', emblemId: 'stopPalm' },
      { reason: 'surface_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('surface_pick');
  });
});

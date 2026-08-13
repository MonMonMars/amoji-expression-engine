import { describe, expect, it } from 'vitest';
import {
  describeHealthProbeToast,
  formatHealthProbeDetail,
  PROBE_DETAIL_TOAST_DISMISS_MS,
} from '../../engine/tts/ttsHealthHistory.js';
import {
  filterShareAuditEntries,
  formatShareAuditLog,
} from '../../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 36 probe detail toast', () => {
  it('describes a showable toast from probe detail', () => {
    const detail = formatHealthProbeDetail(
      {
        ok: true,
        status: 'up',
        tone: 'ok',
        latencyMs: 28,
        message: 'up · 200 · 28ms',
        at: Date.now(),
      },
      { index: 1, total: 3 },
    );
    const toast = describeHealthProbeToast(detail);
    expect(toast.show).toBe(true);
    expect(toast.title).toMatch(/up/i);
    expect(toast.detail).toMatch(/latency/i);
    expect(toast.dismissMs).toBe(PROBE_DETAIL_TOAST_DISMISS_MS);
  });

  it('hides toast when probe missing', () => {
    expect(describeHealthProbeToast(null).show).toBe(false);
    expect(describeHealthProbeToast({ ok: false }).show).toBe(false);
  });
});

describe('Phase 36 audit search', () => {
  it('filters entries by free-text query', () => {
    const entries = [
      { action: 'share', at: 1, summary: 'fear · self-hug', emotion: 'fear' },
      { action: 'qr', at: 2, summary: 'happy · rest', emotion: 'happy' },
      { action: 'revoke', at: 3, summary: 'deep-link cleared' },
    ];
    expect(filterShareAuditEntries(entries, { query: 'fear' })).toHaveLength(1);
    expect(filterShareAuditEntries(entries, { query: 'QR' })).toHaveLength(1);
    expect(
      filterShareAuditEntries(entries, { action: 'share', query: 'happy' }),
    ).toHaveLength(0);
    const fmt = formatShareAuditLog(entries, { query: 'cleared', limit: 6 });
    expect(fmt.count).toBe(1);
    expect(fmt.query).toBe('cleared');
    expect(fmt.text).toMatch(/cleared/);
  });
});

describe('Phase 36 cancel on Live Link remap', () => {
  it('supports remap_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'point' },
      { reason: 'remap_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('remap_pick');
    expect(out.clearCompound).toBe(true);
  });
});

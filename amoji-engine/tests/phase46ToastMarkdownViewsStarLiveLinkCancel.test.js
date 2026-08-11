import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_ACTIONS,
  resolveProbeToastAction,
  resolveProbeToastShortcut,
  formatHealthProbeDetail,
  buildHealthProbeMarkdownPayload,
} from '../engine/tts/ttsHealthHistory.js';
import {
  createAuditSavedViews,
  sortAuditViewsByStar,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 46 probe toast copy-as-markdown', () => {
  it('exposes markdown action and builds MD payload', () => {
    expect(PROBE_TOAST_ACTIONS.map((a) => a.id)).toContain('markdown');
    expect(resolveProbeToastShortcut({ key: 'm' }, { visible: true }).action).toBe(
      'markdown',
    );
    const detail = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 14,
      message: 'ok',
      at: 1_700_000_000_000,
    });
    const md = buildHealthProbeMarkdownPayload(detail, {
      sla: { uptimePct: 100, latencyP50Ms: 14 },
    });
    expect(md.ok).toBe(true);
    expect(md.copyText).toContain('## ');
    expect(md.copyText).toContain('**Latency:**');
    expect(md.copyText).toContain('```');
    const action = resolveProbeToastAction('markdown', { detail });
    expect(action.ok).toBe(true);
    expect(action.markdown).toBe(true);
    expect(action.copy.ok).toBe(true);
  });
});

describe('Phase 46 audit views star favorites', () => {
  it('stars views and sorts favorites first', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'A' });
    store.save({ action: 'qr' }, { name: 'B' });
    store.save({ action: 'export' }, { name: 'C' });
    expect(store.toggleStar('B').view.starred).toBe(true);
    expect(store.views[0].name).toBe('B');
    expect(store.views[0].starred).toBe(true);
    expect(store.toggleStar('B').view.starred).toBe(false);
    const sorted = sortAuditViewsByStar([
      { id: '1', name: 'x', starred: false },
      { id: '2', name: 'y', starred: true },
    ]);
    expect(sorted.views[0].name).toBe('y');
  });
});

describe('Phase 46 cancel on Live Link toggle', () => {
  it('supports livelink_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'angry_disgust', emblemId: 'stopPalm' },
      { reason: 'livelink_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('livelink_pick');
  });
});

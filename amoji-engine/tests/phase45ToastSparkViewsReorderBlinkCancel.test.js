import { describe, expect, it } from 'vitest';
import {
  createGatewayHealthHistory,
  buildProbeToastSparkMini,
} from '../engine/tts/ttsHealthHistory.js';
import {
  createAuditSavedViews,
  reorderAuditSavedViews,
  applyAuditViewsOrder,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 45 probe toast latency spark mini', () => {
  it('builds a compact toast sparkline', () => {
    const hist = createGatewayHealthHistory();
    hist.push({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 10,
      message: 'up',
      at: 1,
    });
    hist.push({
      ok: false,
      status: 'down',
      tone: 'bad',
      latencyMs: 40,
      message: 'down',
      at: 2,
    });
    const mini = buildProbeToastSparkMini(hist.samples, {
      width: 72,
      height: 16,
    });
    expect(mini.show).toBe(true);
    expect(mini.svg).toContain('<svg');
    expect(mini.width).toBe(72);
    expect(buildProbeToastSparkMini([]).show).toBe(false);
  });
});

describe('Phase 45 audit views drag reorder', () => {
  it('reorders views by move and by id list', () => {
    const store = createAuditSavedViews({ memory: true });
    const a = store.save({ action: 'share' }, { name: 'A' }).view;
    const b = store.save({ action: 'qr' }, { name: 'B' }).view;
    const c = store.save({ action: 'export' }, { name: 'C' }).view;
    expect(store.views.map((v) => v.name)).toEqual(['A', 'B', 'C']);
    expect(store.move(b.id, -1).moved).toBe(true);
    expect(store.views.map((v) => v.name)).toEqual(['B', 'A', 'C']);
    const applied = applyAuditViewsOrder(store.views, [c.id, b.id, a.id]);
    expect(applied.views.map((v) => v.name)).toEqual(['C', 'B', 'A']);
    store.reorder([c.id, a.id, b.id]);
    expect(store.views.map((v) => v.name)).toEqual(['C', 'A', 'B']);
    expect(reorderAuditSavedViews(store.views, 'missing', 0).ok).toBe(false);
  });
});

describe('Phase 45 cancel on blink', () => {
  it('supports blink_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprise', emblemId: 'ok' },
      { reason: 'blink_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('blink_pick');
  });
});

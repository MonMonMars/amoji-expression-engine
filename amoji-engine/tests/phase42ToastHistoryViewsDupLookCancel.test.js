import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_ACTIONS,
  resolveProbeToastAction,
  resolveProbeToastShortcut,
  formatHealthProbeDetail,
} from '../engine/tts/ttsHealthHistory.js';
import { createProbeToastHistory } from '../engine/ui/probeToastHistory.js';
import {
  createAuditSavedViews,
  nextDuplicateViewName,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 42 probe toast history stack', () => {
  it('exposes prev/next actions and shortcuts', () => {
    expect(PROBE_TOAST_ACTIONS.map((a) => a.id)).toEqual(
      expect.arrayContaining(['prev', 'next']),
    );
    expect(resolveProbeToastShortcut({ key: '[' }, { visible: true }).action).toBe(
      'prev',
    );
    expect(resolveProbeToastShortcut({ key: ']' }, { visible: true }).action).toBe(
      'next',
    );
    expect(
      resolveProbeToastAction('prev', { canBack: true }).history,
    ).toBe('prev');
    expect(resolveProbeToastAction('next', { canForward: false }).ok).toBe(false);
  });

  it('navigates back/forward through probe details', () => {
    const hist = createProbeToastHistory({ max: 4 });
    const a = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 10,
      message: 'a',
      at: 1,
    });
    const b = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 20,
      message: 'b',
      at: 2,
    });
    const c = formatHealthProbeDetail({
      ok: false,
      status: 'down',
      tone: 'bad',
      latencyMs: 30,
      message: 'c',
      at: 3,
    });
    hist.push(a);
    hist.push(b);
    hist.push(c);
    expect(hist.size).toBe(3);
    expect(hist.back().detail.sample.message).toBe('b');
    expect(hist.canBack).toBe(true);
    expect(hist.back().detail.sample.message).toBe('a');
    expect(hist.back().ok).toBe(false);
    expect(hist.forward().detail.sample.message).toBe('b');
    expect(hist.forward().detail.sample.message).toBe('c');
    expect(hist.forward().ok).toBe(false);
  });
});

describe('Phase 42 audit views duplicate', () => {
  it('duplicates a saved view with a unique name', () => {
    expect(nextDuplicateViewName('Fear', ['Fear', 'Fear copy'])).toBe(
      'Fear copy 2',
    );
    const store = createAuditSavedViews({ memory: true });
    const saved = store.save(
      { action: 'share', query: 'fear', regex: true, rangePreset: '24h' },
      { name: 'Fear' },
    );
    const dup = store.duplicate(saved.view.id);
    expect(dup.ok).toBe(true);
    expect(dup.view.name).toBe('Fear copy');
    expect(dup.view.query).toBe('fear');
    expect(store.size).toBe(2);
    const again = store.duplicate(saved.view.id);
    expect(again.view.name).toBe('Fear copy 2');
  });
});

describe('Phase 42 cancel on look-at track', () => {
  it('supports look_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprise', emblemId: 'wave' },
      { reason: 'look_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('look_pick');
  });
});

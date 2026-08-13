import { describe, expect, it } from 'vitest';
import {
  PROBE_TOAST_ACTIONS,
  resolveProbeToastAction,
  resolveProbeToastShortcut,
  formatHealthProbeDetail,
} from '../../engine/tts/ttsHealthHistory.js';
import { createProbeToastHistory } from '../../engine/ui/probeToastHistory.js';
import { compareProbeToastDetails } from '../../engine/ui/probeToastCompare.js';
import {
  buildAuditViewShareSnapshot,
  decodeAuditViewHash,
  encodeAuditViewHash,
  createAuditSavedViews,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 43 probe toast compare mode', () => {
  it('exposes compare action and shortcut', () => {
    expect(PROBE_TOAST_ACTIONS.map((a) => a.id)).toContain('compare');
    expect(resolveProbeToastShortcut({ key: '=' }, { visible: true }).action).toBe(
      'compare',
    );
    expect(
      resolveProbeToastAction('compare', { canCompare: true, compareOn: false })
        .compareOn,
    ).toBe(true);
    expect(
      resolveProbeToastAction('compare', { canCompare: false, compareOn: false })
        .ok,
    ).toBe(false);
  });

  it('diffs current vs previous probe latency/status', () => {
    const hist = createProbeToastHistory();
    const older = formatHealthProbeDetail({
      ok: true,
      status: 'up',
      tone: 'ok',
      latencyMs: 20,
      message: 'older',
      at: 1,
    });
    const newer = formatHealthProbeDetail({
      ok: false,
      status: 'down',
      tone: 'bad',
      latencyMs: 45,
      message: 'newer',
      at: 2,
    });
    hist.push(older);
    hist.push(newer);
    expect(hist.canCompare).toBe(true);
    const cmp = compareProbeToastDetails(
      hist.current.detail,
      hist.previous.detail,
    );
    expect(cmp.ok).toBe(true);
    expect(cmp.deltaMs).toBe(25);
    expect(cmp.okChanged).toBe(true);
    expect(cmp.detail).toContain('+25ms');
  });
});

describe('Phase 43 audit views share snapshot', () => {
  it('encodes and decodes #flv= view links', () => {
    const store = createAuditSavedViews({ memory: true });
    const saved = store.save(
      { action: 'share', query: 'fear', regex: true, rangePreset: '24h' },
      { name: 'Fear' },
    );
    const snap = buildAuditViewShareSnapshot(saved.view, {
      origin: 'https://example.test',
      path: '/prototypes/face-live.html',
    });
    expect(snap.ok).toBe(true);
    expect(snap.hash.startsWith('flv=')).toBe(true);
    expect(snap.copyText).toContain('#flv=');
    const round = decodeAuditViewHash(snap.hash);
    expect(round.ok).toBe(true);
    expect(round.view.name).toBe('Fear');
    expect(round.view.query).toBe('fear');
    expect(round.view.regex).toBe(true);
    expect(encodeAuditViewHash(saved.view)).toBe(snap.hash);
  });
});

describe('Phase 43 cancel on idle toggle', () => {
  it('supports idle_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'angry_disgust', emblemId: 'fist' },
      { reason: 'idle_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('idle_pick');
  });
});

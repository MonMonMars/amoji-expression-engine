import { describe, expect, it } from 'vitest';
import {
  createPrefsShareAudit,
  exportShareAuditJson,
  filterShareAuditEntries,
} from '../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 58 audit toast hash export filter', () => {
  it('filters and exports only toast-in-hash audit entries', () => {
    const entries = [
      {
        action: 'share',
        summary: 'happy',
        toastInHash: true,
        toastFeedbackSummary: 'toast sound off',
      },
      { action: 'qr', summary: 'sad', toastInHash: false },
      {
        action: 'share',
        summary: 'fear',
        toastInHash: true,
        toastFeedbackSummary: 'vol 50%',
      },
    ];
    const filtered = filterShareAuditEntries(entries, { toastInHashOnly: true });
    expect(filtered).toHaveLength(2);
    expect(filtered.every((e) => e.toastInHash)).toBe(true);

    const exported = exportShareAuditJson(entries, { toastInHashOnly: true });
    expect(exported.toastInHashOnly).toBe(true);
    expect(exported.count).toBe(2);
    expect(exported.total).toBe(3);
    expect(exported.payload.toastInHashOnly).toBe(true);
    expect(exported.payload.entries).toHaveLength(2);
  });

  it('persists toast-in-hash fields through audit store record', () => {
    const store = createPrefsShareAudit({ memory: true });
    store.record('share', {
      hash: 'flp=abc',
      prefs: { emotion: 'happy', probeToastSoundMuted: true },
      toastFeedbackSummary: 'toast sound off',
      toastInHash: true,
    });
    const exported = store.exportJson({ toastInHashOnly: true });
    expect(exported.count).toBe(1);
    expect(exported.payload.entries[0].toastInHash).toBe(true);
  });
});

describe('Phase 58 cancel on TTS synth/http and script hold/clear', () => {
  it('supports tts_synth_pick, tts_http_pick, script_hold_pick, clear_pick', () => {
    for (const reason of [
      'tts_synth_pick',
      'tts_http_pick',
      'script_hold_pick',
      'clear_pick',
    ]) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

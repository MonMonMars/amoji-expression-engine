import { describe, expect, it } from 'vitest';
import {
  buildPrefsShareBundle,
  buildShareBundleAuditPayload,
} from '../engine/ui/prefsShareLink.js';
import {
  createPrefsShareAudit,
  filterShareAuditEntries,
} from '../engine/ui/prefsShareAudit.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 57 share bundle audit toast hash', () => {
  it('includes toast feedback metadata in bundle and audit payload', () => {
    const bundle = buildPrefsShareBundle(
      {
        emotion: 'happy',
        probeToastSoundMuted: true,
        probeToastVolume: 0.4,
      },
      { origin: 'http://localhost:5174' },
    );
    expect(bundle.toastInHash).toBe(true);
    expect(bundle.toastFeedbackSummary).toContain('toast sound off');
    expect(bundle.toastHashKeys).toContain('probeToastSoundMuted');
    expect(bundle.toastHashKeys).toContain('probeToastVolume');

    const audit = buildShareBundleAuditPayload(bundle);
    expect(audit.toastInHash).toBe(true);
    expect(audit.toastFeedbackSummary).toContain('vol 40%');
    expect(audit.hash).toBe(bundle.hash);
  });

  it('records and filters audit entries by toast feedback summary', () => {
    const store = createPrefsShareAudit({ memory: true });
    store.record('share', {
      hash: 'flp=abc',
      shortUrl: 'http://x/#flp=abc',
      prefs: { emotion: 'happy', probeToastHapticMuted: true },
      toastFeedbackSummary: 'haptic off',
      toastInHash: true,
    });
    const hits = filterShareAuditEntries(store.entries, { query: 'haptic off' });
    expect(hits).toHaveLength(1);
    expect(hits[0].toastInHash).toBe(true);
    expect(hits[0].toastFeedbackSummary).toBe('haptic off');
  });
});

describe('Phase 57 cancel on TTS stop/fixture and script deliver', () => {
  it('supports tts_stop_pick, tts_fixture_pick, and deliver_pick', () => {
    for (const reason of ['tts_stop_pick', 'tts_fixture_pick', 'deliver_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

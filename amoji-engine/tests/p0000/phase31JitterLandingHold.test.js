import { describe, expect, it } from 'vitest';
import {
  applyHealthPollJitter,
  computeHealthPollInterval,
} from '../../engine/tts/ttsHealth.js';
import {
  describePrefsDeepLink,
  formatPrefsLandingSummary,
  PREFS_LANDING_DISMISS_MS,
} from '../../engine/ui/prefsLandingToast.js';
import {
  compoundEmblemLifecycle,
  COMPOUND_EMBLEM_HOLD_SEC,
  COMPOUND_EMBLEM_RELEASE_SEC,
} from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 31 health poll jitter', () => {
  it('applies deterministic ±jitter around base delay', () => {
    const base = computeHealthPollInterval(1, { baseMs: 8000 });
    expect(base).toBe(16000);
    const low = applyHealthPollJitter(base, { ratio: 0.15, random: () => 0 });
    const mid = applyHealthPollJitter(base, { ratio: 0.15, random: () => 0.5 });
    const high = applyHealthPollJitter(base, { ratio: 0.15, random: () => 1 });
    expect(low).toBe(Math.round(16000 * 0.85));
    expect(mid).toBe(16000);
    expect(high).toBe(Math.round(16000 * 1.15));
  });

  it('respects minMs floor', () => {
    expect(applyHealthPollJitter(100, { ratio: 0.5, random: () => 0, minMs: 500 })).toBe(
      500,
    );
  });
});

describe('Phase 31 prefs deep-link landing toast', () => {
  it('formats a compact prefs summary', () => {
    const s = formatPrefsLandingSummary({
      emotion: 'fear',
      intensity: 0.85,
      fingerPresetId: 'self-hug',
      chassisId: 'desktop-buddy',
      ttsPresetId: 'gateway-step',
    });
    expect(s).toContain('fear');
    expect(s).toContain('self-hug');
    expect(s).toContain('gateway-step');
  });

  it('describes a showable toast from hash result', () => {
    const toast = describePrefsDeepLink({
      ok: true,
      prefs: { emotion: 'angry', fingerPresetId: 'fists' },
    });
    expect(toast.show).toBe(true);
    expect(toast.title).toBe('Prefs from link');
    expect(toast.detail).toContain('angry');
    expect(toast.dismissMs).toBe(PREFS_LANDING_DISMISS_MS);
  });

  it('hides toast when hash missing', () => {
    const toast = describePrefsDeepLink({ ok: false, error: 'no_flp' });
    expect(toast.show).toBe(false);
    expect(toast.reason).toBe('no_flp');
  });
});

describe('Phase 31 compound emblem hold/release', () => {
  it('walks crossfade → hold → release → done with clearEmblem', () => {
    const a = compoundEmblemLifecycle('happy_surprised', 0.8, 0);
    expect(a.ok).toBe(true);
    expect(a.phase).toBe('crossfade');
    expect(a.emblemId).toBe('wave');
    expect(a.clearEmblem).toBeFalsy();

    const holdAt = a.crossfadeSec + COMPOUND_EMBLEM_HOLD_SEC * 0.5;
    const b = compoundEmblemLifecycle('happy_surprised', 0.8, holdAt);
    expect(b.phase).toBe('hold');
    expect(b.fingerPresetId).toBe('wave');

    const relAt = a.crossfadeSec + a.holdSec + COMPOUND_EMBLEM_RELEASE_SEC * 0.5;
    const c = compoundEmblemLifecycle('happy_surprised', 0.8, relAt);
    expect(c.phase).toBe('release');

    const d = compoundEmblemLifecycle('happy_surprised', 0.8, a.totalSec + 0.01);
    expect(d.phase).toBe('done');
    expect(d.clearEmblem).toBe(true);
    expect(d.scientific).toBe(false);
  });

  it('skips emblem hold for compounds without emblem mapping', () => {
    const life = compoundEmblemLifecycle('sad_fear', 0.7, 0);
    expect(life.ok).toBe(true);
    expect(life.emblemId).toBe(null);
    expect(life.holdSec).toBe(0);
    const mid = compoundEmblemLifecycle('sad_fear', 0.7, life.crossfadeSec + 0.01);
    // no hold → goes to release/done quickly
    expect(['release', 'done', 'crossfade']).toContain(mid.phase);
  });
});

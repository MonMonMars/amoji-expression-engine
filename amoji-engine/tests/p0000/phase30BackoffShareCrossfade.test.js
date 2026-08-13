import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  computeHealthPollInterval,
  startGatewayHealthPoll,
  stopGatewayHealthPoll,
} from '../../engine/tts/ttsHealth.js';
import {
  buildPrefsShortLink,
  buildPrefsQrImageUrl,
  buildPrefsQrFingerprintSvg,
  buildPrefsShareBundle,
} from '../../engine/ui/prefsShareLink.js';
import {
  COMPOUND_TO_EMBLEM,
  emblemForCompound,
  crossfadeEase,
  lerpGesture,
  crossfadeCompoundToEmblem,
} from '../../engine/export/compoundEmblemCrossfade.js';

afterEach(() => {
  stopGatewayHealthPoll();
  vi.useRealTimers();
});

describe('Phase 30 health poll backoff', () => {
  it('computes exponential intervals capped at max', () => {
    expect(computeHealthPollInterval(0, { baseMs: 8000 })).toBe(8000);
    expect(computeHealthPollInterval(1, { baseMs: 8000 })).toBe(16000);
    expect(computeHealthPollInterval(2, { baseMs: 8000 })).toBe(32000);
    expect(
      computeHealthPollInterval(8, { baseMs: 8000, maxMs: 60000 }),
    ).toBe(60000);
  });

  it('backs off after consecutive failures then resets on success', async () => {
    vi.useFakeTimers();
    let status = 500;
    const fetchImpl = vi.fn(async () => ({ status }));
    const onResult = vi.fn();
    startGatewayHealthPoll({
      endpoint: 'https://tts.example.com/v1/tts/step',
      intervalMs: 4000,
      maxIntervalMs: 60000,
      jitterRatio: 0,
      fetchImpl,
      onResult,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(onResult.mock.calls[0][0].ok).toBe(false);
    expect(onResult.mock.calls[0][0].consecutiveFailures).toBe(1);
    expect(onResult.mock.calls[0][0].nextPollMs).toBe(8000);

    await vi.advanceTimersByTimeAsync(8000);
    expect(onResult.mock.calls.at(-1)[0].consecutiveFailures).toBe(2);
    expect(onResult.mock.calls.at(-1)[0].nextPollMs).toBe(16000);

    status = 200;
    await vi.advanceTimersByTimeAsync(16000);
    const last = onResult.mock.calls.at(-1)[0];
    expect(last.ok).toBe(true);
    expect(last.consecutiveFailures).toBe(0);
    expect(last.nextPollMs).toBe(4000);
  });
});

describe('Phase 30 prefs short-link + QR helpers', () => {
  it('builds short link with path#flp=', () => {
    const short = buildPrefsShortLink(
      { emotion: 'fear', fingerPresetId: 'self-hug' },
      { origin: 'http://127.0.0.1:5174', path: '/prototypes/face-live' },
    );
    expect(short.shortUrl).toMatch(
      /^http:\/\/127\.0\.0\.1:5174\/prototypes\/face-live#flp=/,
    );
    expect(short.copyText).toBe(short.shortUrl);
    expect(short.compactKeyCount).toBeGreaterThan(0);
  });

  it('builds QR image URL and offline fingerprint SVG', () => {
    const img = buildPrefsQrImageUrl('http://x/#flp=abc', { size: 120 });
    expect(img.url).toContain('api.qrserver.com');
    expect(img.url).toContain(encodeURIComponent('http://x/#flp=abc'));

    const fp = buildPrefsQrFingerprintSvg('http://x/#flp=abc', { size: 64 });
    expect(fp.scannable).toBe(false);
    expect(fp.svg).toContain('<svg');
    expect(fp.svg).toContain('rect');
  });

  it('bundles short link + QR fields', () => {
    const bundle = buildPrefsShareBundle(
      { emotion: 'angry' },
      { origin: 'http://localhost:5174' },
    );
    expect(bundle.shortUrl).toContain('#flp=');
    expect(bundle.qrImageUrl).toContain('create-qr-code');
    expect(bundle.qrFingerprintSvg).toContain('svg');
  });
});

describe('Phase 30 compound→emblem crossfade', () => {
  it('maps compounds to emblems', () => {
    expect(emblemForCompound('happy_surprised')).toBe('wave');
    expect(emblemForCompound('sad_fear')).toBe(null);
    expect(COMPOUND_TO_EMBLEM.angry_disgust).toBe('stopPalm');
  });

  it('eases and lerps gestures across t', () => {
    expect(crossfadeEase(0)).toBe(0);
    expect(crossfadeEase(1)).toBe(1);
    expect(crossfadeEase(0.5)).toBeCloseTo(0.5, 5);
    const g = lerpGesture({ fist: 0, handOpen: 1 }, { fist: 1, handOpen: 0 }, 0.5);
    expect(g.fist).toBeCloseTo(0.5, 5);
    expect(g.handOpen).toBeCloseTo(0.5, 5);
  });

  it('crossfades happy_surprised toward wave emblem', () => {
    const a = crossfadeCompoundToEmblem('happy_surprised', 0.8, 0);
    const b = crossfadeCompoundToEmblem('happy_surprised', 0.8, 1);
    expect(a.ok).toBe(true);
    expect(a.emblemId).toBe('wave');
    expect(a.ease).toBe(0);
    expect(b.ease).toBe(1);
    expect(b.fingerPresetId).toBe('wave');
    expect(b.emblemSynced).toBe(true);
    expect(a.scientific).toBe(false);
  });

  it('rejects unknown compounds', () => {
    expect(crossfadeCompoundToEmblem('nope', 0.5, 0.2).ok).toBe(false);
  });
});

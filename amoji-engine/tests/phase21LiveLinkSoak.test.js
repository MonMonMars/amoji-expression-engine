import { describe, expect, it, vi } from 'vitest';
import {
  syntheticArkitAt,
  SoakStats,
  soakPublisher,
  soakHttp,
  assertLiveLinkFrameShape,
} from '../engine/export/liveLinkSoak.js';
import { LiveLinkPublisher } from '../engine/export/liveLinkFace.js';

describe('syntheticArkitAt', () => {
  it('returns clamped jaw/smile/blink channels', () => {
    const a = syntheticArkitAt(0.25);
    expect(a.jawOpen).toBeGreaterThanOrEqual(0);
    expect(a.jawOpen).toBeLessThanOrEqual(1);
    expect(a.mouthSmileLeft).toBeGreaterThanOrEqual(0);
    expect(typeof a.eyeBlinkLeft).toBe('number');
  });
});

describe('soakPublisher', () => {
  it('publishes expected frames and reports ok', () => {
    const pub = new LiveLinkPublisher({ fps: 30 });
    let t = 1000;
    const out = soakPublisher({
      durationSec: 0.5,
      fps: 30,
      publisher: pub,
      now: () => {
        t += 1;
        return t;
      },
    });
    expect(out.published).toBe(15);
    expect(out.expected).toBe(15);
    expect(out.ok).toBe(true);
    expect(pub.frameIndex).toBe(15);
    expect(assertLiveLinkFrameShape(out.lastFrame)).toBe(true);
  });
});

describe('SoakStats', () => {
  it('computes p95 latency', () => {
    const s = new SoakStats();
    s.startedAt = 0;
    s.endedAt = 1000;
    s.expected = 10;
    for (let i = 1; i <= 10; i++) s.record({ latencyMs: i });
    const sum = s.summary();
    expect(sum.p95LatencyMs).toBeGreaterThanOrEqual(9);
    expect(sum.published).toBe(10);
  });
});

describe('soakHttp', () => {
  it('posts synthetic frames via fetchImpl', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true }));
    const out = await soakHttp({
      durationSec: 0.2,
      fps: 10,
      fetchImpl,
      url: 'http://example/publish',
    });
    expect(fetchImpl).toHaveBeenCalled();
    expect(out.published).toBe(2);
    expect(out.errors).toBe(0);
  });
});

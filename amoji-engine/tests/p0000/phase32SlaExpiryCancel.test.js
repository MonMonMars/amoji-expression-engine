import { describe, expect, it } from 'vitest';
import {
  createGatewayHealthHistory,
  summarizeHealthHistory,
  formatHealthSlaChip,
} from '../../engine/tts/ttsHealthHistory.js';
import {
  stampPrefsForShare,
  evaluatePrefsLinkExpiry,
  describePrefsLinkRevoke,
  PREFS_LINK_TTL_MS,
} from '../../engine/ui/prefsLinkExpiry.js';
import { describePrefsDeepLink } from '../../engine/ui/prefsLandingToast.js';
import { buildPrefsShortLink } from '../../engine/ui/prefsShareLink.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 32 gateway SLA history', () => {
  it('tracks uptime and p50 latency', () => {
    const hist = createGatewayHealthHistory({ max: 10 });
    const t0 = 1_000_000;
    hist.push(
      { ok: true, status: 'up', tone: 'ok', latencyMs: 40, message: 'up · 200' },
      { now: t0 },
    );
    hist.push(
      { ok: true, status: 'up', tone: 'ok', latencyMs: 60, message: 'up · 200' },
      { now: t0 + 1000 },
    );
    hist.push(
      {
        ok: false,
        status: 'down',
        tone: 'bad',
        latencyMs: 200,
        message: 'down · 500',
      },
      { now: t0 + 2000 },
    );
    const sla = hist.summarize({ now: t0 + 3000 });
    expect(sla.sampleCount).toBe(3);
    expect(sla.uptimePct).toBeCloseTo(66.7, 0);
    expect(sla.latencyP50Ms).toBe(60);
    expect(sla.streak).toBe(-1);

    const chip = formatHealthSlaChip(
      { ok: true, status: 'up', tone: 'ok', message: 'up · 200 · 40ms' },
      sla,
    );
    expect(chip.text).toContain('gateway ·');
    expect(chip.text).toContain('%');
    expect(chip.text).toContain('p50');
  });

  it('ignores no_endpoint samples for SLA', () => {
    const sla = summarizeHealthHistory([
      { ok: false, status: 'no_endpoint', at: Date.now() },
    ]);
    expect(sla.sampleCount).toBe(0);
    expect(formatHealthSlaChip({ status: 'no_endpoint' }).text).toBe(
      'gateway · idle',
    );
  });
});

describe('Phase 32 prefs link expiry / revoke', () => {
  it('stamps sharedAt/expiresAt and reports freshness', () => {
    const now = 1_700_000_000_000;
    const stamped = stampPrefsForShare({ emotion: 'fear' }, { now, ttlMs: 3600000 });
    expect(stamped.sharedAt).toBe(now);
    expect(stamped.expiresAt).toBe(now + 3600000);
    const fresh = evaluatePrefsLinkExpiry(stamped, { now: now + 60_000, ttlMs: 3600000 });
    expect(fresh.expired).toBe(false);
    expect(fresh.hint).toMatch(/fresh/);
    const old = evaluatePrefsLinkExpiry(stamped, {
      now: now + 3600000 + 1,
      ttlMs: 3600000,
    });
    expect(old.expired).toBe(true);
    expect(old.hint).toMatch(/expired/);
  });

  it('embeds expiry into share + landing toast', () => {
    const now = 2_000_000_000_000;
    const short = buildPrefsShortLink(
      { emotion: 'happy' },
      { origin: 'http://localhost:5174', now, ttlMs: PREFS_LINK_TTL_MS },
    );
    expect(short.expiryHint).toMatch(/fresh/);
    expect(short.prefs.sharedAt).toBe(now);

    const toast = describePrefsDeepLink(
      {
        ok: true,
        prefs: stampPrefsForShare(
          { emotion: 'angry' },
          { now: now - PREFS_LINK_TTL_MS - 1000 },
        ),
      },
      { now },
    );
    expect(toast.expired).toBe(true);
    expect(toast.title).toMatch(/expired/i);
    expect(toast.revokeHint).toMatch(/#flp=/);
  });

  it('describes revoke when hash present', () => {
    const yes = describePrefsLinkRevoke({
      hash: '#flp=abc',
      href: 'http://x/prototypes/face-live',
    });
    expect(yes.canRevoke).toBe(true);
    expect(yes.nextUrl).toBe('http://x/prototypes/face-live');
    expect(describePrefsLinkRevoke({ hash: '' }).canRevoke).toBe(false);
  });
});

describe('Phase 32 cancel compound lifecycle', () => {
  it('cancels active lifecycle and requests emblem clear', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'happy_surprised', emblemId: 'wave' },
      { reason: 'emotion_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.clearEmblem).toBe(true);
    expect(out.clearCompound).toBe(true);
    expect(out.reason).toBe('emotion_pick');
  });

  it('no-ops when idle', () => {
    const out = cancelCompoundEmblemLifecycle(null);
    expect(out.cancelled).toBe(false);
    expect(out.clearEmblem).toBe(false);
  });
});

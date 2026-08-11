/**
 * Gateway health SLA history — rolling probe samples for Face Live chip.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const GATEWAY_HEALTH_HISTORY_MAX = 24;

/**
 * @param {object} sample
 * @param {{ now?: number }} [opts]
 */
export function normalizeHealthSample(sample, opts = {}) {
  const now = opts.now ?? Date.now();
  if (!sample || typeof sample !== 'object') {
    return {
      ok: false,
      status: 'empty',
      tone: 'warn',
      latencyMs: null,
      at: now,
    };
  }
  return {
    ok: !!sample.ok,
    status: sample.status || (sample.ok ? 'up' : 'down'),
    tone: sample.tone || (sample.ok ? 'ok' : 'bad'),
    latencyMs:
      typeof sample.latencyMs === 'number' && Number.isFinite(sample.latencyMs)
        ? sample.latencyMs
        : null,
    httpStatus: sample.httpStatus ?? null,
    message: sample.message || '',
    at: sample.at || now,
  };
}

/**
 * Summarize rolling health samples into an SLA snapshot.
 * @param {object[]} samples
 * @param {{ windowMs?: number, now?: number }} [opts]
 */
export function summarizeHealthHistory(samples, opts = {}) {
  const list = Array.isArray(samples) ? samples.map((s) => normalizeHealthSample(s)) : [];
  const now = opts.now ?? Date.now();
  const windowMs = opts.windowMs ?? 5 * 60 * 1000;
  const inWindow = list.filter((s) => now - s.at <= windowMs);
  const usable = inWindow.length ? inWindow : list;
  const counted = usable.filter((s) => s.status !== 'no_endpoint' && s.status !== 'empty');
  const ups = counted.filter((s) => s.ok);
  const latencies = counted
    .map((s) => s.latencyMs)
    .filter((n) => typeof n === 'number')
    .sort((a, b) => a - b);
  const uptime =
    counted.length === 0 ? null : Math.round((ups.length / counted.length) * 1000) / 10;
  const p50 =
    latencies.length === 0
      ? null
      : latencies[Math.floor((latencies.length - 1) * 0.5)];
  let streak = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    const s = list[i];
    if (s.status === 'no_endpoint' || s.status === 'empty') continue;
    if (s.ok) {
      if (streak >= 0) streak += 1;
      else break;
    } else {
      if (streak <= 0) streak -= 1;
      else break;
    }
  }
  const latest = list.length ? list[list.length - 1] : null;
  const tone =
    uptime == null
      ? 'warn'
      : uptime >= 95
        ? 'ok'
        : uptime >= 80
          ? 'warn'
          : 'bad';
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_sla',
      sampleCount: counted.length,
      totalSamples: list.length,
      uptimePct: uptime,
      latencyP50Ms: p50,
      streak,
      tone,
      latest,
      windowMs,
    },
    {},
  );
}

/**
 * Format chip text from latest probe + SLA summary.
 * @param {object} [latest]
 * @param {object} [sla]
 */
export function formatHealthSlaChip(latest, sla) {
  if (!latest || latest.status === 'no_endpoint') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_chip',
        text: 'gateway · idle',
        tone: '',
      },
      {},
    );
  }
  const base = latest.message || (latest.ok ? 'up' : 'down');
  const bits = [`gateway · ${base}`];
  if (sla && typeof sla.uptimePct === 'number' && sla.sampleCount > 0) {
    bits.push(`${sla.uptimePct}%`);
  }
  if (sla && typeof sla.latencyP50Ms === 'number') {
    bits.push(`p50 ${Math.round(sla.latencyP50Ms)}ms`);
  }
  if (sla && sla.streak) {
    bits.push(sla.streak > 0 ? `↑${sla.streak}` : `↓${Math.abs(sla.streak)}`);
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_chip',
      text: bits.join(' · '),
      tone: latest.tone || sla?.tone || '',
      sla,
      latest,
    },
    {},
  );
}

/**
 * Create a mutable rolling history buffer.
 * @param {{ max?: number }} [opts]
 */
export function createGatewayHealthHistory(opts = {}) {
  const max = Math.max(4, opts.max ?? GATEWAY_HEALTH_HISTORY_MAX);
  /** @type {ReturnType<typeof normalizeHealthSample>[]} */
  const samples = [];
  return {
    get samples() {
      return samples.slice();
    },
    get size() {
      return samples.length;
    },
    clear() {
      samples.length = 0;
      return applyComplianceGate(
        { kind: 'tts_gateway_health_history', action: 'clear', ok: true },
        {},
      );
    },
    push(result, pushOpts = {}) {
      if (result?.status === 'no_endpoint') {
        return summarizeHealthHistory(samples, pushOpts);
      }
      samples.push(normalizeHealthSample(result, pushOpts));
      while (samples.length > max) samples.shift();
      return summarizeHealthHistory(samples, pushOpts);
    },
    summarize(sumOpts = {}) {
      return summarizeHealthHistory(samples, sumOpts);
    },
    formatChip(latest) {
      const sla = summarizeHealthHistory(samples);
      return formatHealthSlaChip(latest || sla.latest, sla);
    },
  };
}

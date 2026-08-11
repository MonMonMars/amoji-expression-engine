/**
 * TTS gateway health probe — lightweight check for Face Live chip.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { resolveTtsConfig } from './ttsConfig.js';

/**
 * Derive a health URL from a synthesize endpoint.
 * Tries /health on same origin path parent, else endpoint itself with GET.
 * @param {string} endpoint
 */
export function healthUrlForEndpoint(endpoint) {
  if (!endpoint) return null;
  try {
    const u = new URL(endpoint, 'http://127.0.0.1');
    // …/v1/tts/step → …/health or …/v1/health
    const parts = u.pathname.replace(/\/$/, '').split('/');
    parts[parts.length - 1] = 'health';
    u.pathname = parts.join('/') || '/health';
    u.search = '';
    u.hash = '';
    // If endpoint was relative-looking without host, URL may be wrong — require absolute
    if (!/^https?:/i.test(endpoint)) {
      return endpoint.replace(/\/[^/]*$/, '/health');
    }
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Probe TTS gateway / endpoint health.
 * @param {{
 *   endpoint?: string,
 *   token?: string,
 *   fetchImpl?: typeof fetch,
 *   timeoutMs?: number,
 * }} [opts]
 */
export async function probeTtsGateway(opts = {}) {
  const cfg = resolveTtsConfig({
    browser: {
      endpoint: opts.endpoint || '',
      token: opts.token || '',
    },
    env: {},
  });
  const endpoint = opts.endpoint || cfg.endpoint;
  if (!endpoint) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health',
        ok: false,
        status: 'no_endpoint',
        tone: 'warn',
        message: 'no endpoint',
      },
      {},
    );
  }

  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  if (!fetchImpl) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health',
        ok: false,
        status: 'no_fetch',
        tone: 'bad',
        message: 'fetch unavailable',
        endpoint,
      },
      {},
    );
  }

  const healthUrl = healthUrlForEndpoint(endpoint) || endpoint;
  const headers = {};
  const authToken =
    opts.token ||
    (typeof globalThis !== 'undefined' ? globalThis.__AMOJI_TTS__?.token : null) ||
    null;
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const timeoutMs = opts.timeoutMs ?? 2500;
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  const t0 = Date.now();

  try {
    let res = await fetchImpl(healthUrl, {
      method: 'GET',
      headers,
      signal: ctrl?.signal,
    });
    // Some gateways only allow POST on /synthesize — treat 404 on /health as unreachable path, try OPTIONS on endpoint
    if (res.status === 404 && healthUrl !== endpoint) {
      res = await fetchImpl(endpoint, {
        method: 'OPTIONS',
        headers,
        signal: ctrl?.signal,
      });
    }
    const latencyMs = Date.now() - t0;
    const ok = res.status >= 200 && res.status < 500 && res.status !== 404;
    // 401 means reachable but auth required — still "up"
    const up = res.status === 401 || res.status === 403 || (res.status >= 200 && res.status < 400);
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health',
        ok: up,
        status: up ? 'up' : 'down',
        tone: up ? (res.status === 401 || res.status === 403 ? 'warn' : 'ok') : 'bad',
        httpStatus: res.status,
        latencyMs,
        endpoint,
        probedUrl: healthUrl,
        message: up
          ? res.status === 401 || res.status === 403
            ? `up · auth ${res.status}`
            : `up · ${res.status} · ${latencyMs}ms`
          : `down · ${res.status}`,
      },
      {},
    );
  } catch (err) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health',
        ok: false,
        status: 'error',
        tone: 'bad',
        endpoint,
        probedUrl: healthUrl,
        latencyMs: Date.now() - t0,
        message: String(err?.message || err || 'probe failed'),
      },
      {},
    );
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** @type {ReturnType<typeof setInterval>|null} */
let activePollTimer = null;
/** @type {number} */
let activePollGen = 0;

/**
 * Stop any active gateway health poll started by {@link startGatewayHealthPoll}.
 */
export function stopGatewayHealthPoll() {
  if (activePollTimer != null) {
    clearInterval(activePollTimer);
    activePollTimer = null;
  }
  activePollGen += 1;
  return applyComplianceGate(
    { kind: 'tts_gateway_health_poll', action: 'stop', ok: true },
    {},
  );
}

/**
 * Poll TTS gateway health on an interval. Replaces any previous poll.
 * When endpoint is empty, stops and optionally notifies idle.
 *
 * @param {{
 *   getEndpoint?: () => string,
 *   endpoint?: string,
 *   intervalMs?: number,
 *   token?: string,
 *   fetchImpl?: typeof fetch,
 *   timeoutMs?: number,
 *   onResult?: (result: object) => void,
 *   immediate?: boolean,
 * }} [opts]
 */
export function startGatewayHealthPoll(opts = {}) {
  stopGatewayHealthPoll();
  const intervalMs = Math.max(2000, opts.intervalMs ?? 8000);
  const gen = activePollGen;
  const resolveEndpoint = () => {
    if (typeof opts.getEndpoint === 'function') {
      return String(opts.getEndpoint() || '').trim();
    }
    return String(opts.endpoint || '').trim();
  };

  const tick = async () => {
    if (gen !== activePollGen) return;
    const endpoint = resolveEndpoint();
    if (!endpoint) {
      opts.onResult?.(
        applyComplianceGate(
          {
            kind: 'tts_gateway_health',
            ok: false,
            status: 'no_endpoint',
            tone: 'warn',
            message: 'no endpoint',
          },
          {},
        ),
      );
      return;
    }
    const result = await probeTtsGateway({
      endpoint,
      token: opts.token,
      fetchImpl: opts.fetchImpl,
      timeoutMs: opts.timeoutMs,
    });
    if (gen !== activePollGen) return;
    opts.onResult?.(result);
  };

  if (opts.immediate !== false) {
    void tick();
  }
  activePollTimer = setInterval(() => {
    void tick();
  }, intervalMs);

  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_poll',
      action: 'start',
      ok: true,
      intervalMs,
      stop: stopGatewayHealthPoll,
    },
    {},
  );
}

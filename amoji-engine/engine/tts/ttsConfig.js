/**
 * TTS provider config — env / browser globals → createTtsProvider.
 * No secrets in repo. When endpoint missing → mock.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { createTtsProvider, DEFAULT_TTS_ENDPOINT } from './ttsProvider.js';

export const TTS_CONFIG_KEYS = [
  'AMOJI_TTS_ENDPOINT',
  'AMOJI_TTS_PROVIDER',
  'AMOJI_TTS_TOKEN',
  'AMOJI_TTS_TYPE',
];

/**
 * Read config from Node env and/or browser `__AMOJI_TTS__` / localStorage.
 * @param {{
 *   env?: Record<string, string|undefined>,
 *   browser?: { endpoint?: string, provider?: string, token?: string, type?: string } | null,
 * }} [sources]
 */
export function resolveTtsConfig(sources = {}) {
  const env =
    sources.env ||
    (typeof process !== 'undefined' ? process.env : {}) ||
    {};
  const browser =
    sources.browser !== undefined
      ? sources.browser
      : typeof globalThis !== 'undefined'
        ? globalThis.__AMOJI_TTS__ || null
        : null;

  const endpoint =
    browser?.endpoint ||
    env.AMOJI_TTS_ENDPOINT ||
    DEFAULT_TTS_ENDPOINT ||
    '';
  const provider =
    browser?.provider || env.AMOJI_TTS_PROVIDER || 'auto';
  const token = browser?.token || env.AMOJI_TTS_TOKEN || '';
  const typeHint = browser?.type || env.AMOJI_TTS_TYPE || '';

  const type =
    typeHint === 'http' || typeHint === 'mock'
      ? typeHint
      : endpoint
        ? 'http'
        : 'mock';

  /** @type {Record<string, string>} */
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return applyComplianceGate(
    {
      kind: 'tts_config',
      type,
      endpoint: endpoint || null,
      provider,
      hasToken: !!token,
      headers,
      readyForHttp: type === 'http' && !!endpoint,
    },
    {},
  );
}

/**
 * Build provider from resolved config (mock if no endpoint).
 * @param {ReturnType<typeof resolveTtsConfig> | object} [cfgOrSources]
 * @param {{ fetchImpl?: typeof fetch, fixture?: string, audioUrl?: string }} [opts]
 */
export function createTtsProviderFromConfig(cfgOrSources = {}, opts = {}) {
  const cfg =
    cfgOrSources?.kind === 'tts_config'
      ? cfgOrSources
      : resolveTtsConfig(cfgOrSources);

  if (cfg.readyForHttp && cfg.endpoint) {
    return createTtsProvider({
      type: 'http',
      endpoint: cfg.endpoint,
      provider: cfg.provider,
      headers: cfg.headers,
      fetchImpl: opts.fetchImpl,
    });
  }
  return createTtsProvider({
    type: 'mock',
    fixture: opts.fixture || 'stepAudioEditX',
    audioUrl: opts.audioUrl || '/data/tts/fixtures/hello-mama.wav',
  });
}

/**
 * Persist browser config on `globalThis.__AMOJI_TTS__` (Face Live).
 * Does not write secrets to disk.
 * @param {{ endpoint?: string, provider?: string, token?: string, type?: string }} partial
 */
export function setBrowserTtsConfig(partial = {}) {
  const prev =
    typeof globalThis !== 'undefined' && globalThis.__AMOJI_TTS__
      ? { ...globalThis.__AMOJI_TTS__ }
      : {};
  const next = {
    ...prev,
    ...partial,
  };
  if (typeof globalThis !== 'undefined') {
    globalThis.__AMOJI_TTS__ = next;
  }
  return resolveTtsConfig({ browser: next });
}

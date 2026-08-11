/**
 * Production TTS provider presets — templates for Face Live / env wiring.
 */
import presetsData from '../../data/tts/provider-presets.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { resolveTtsConfig, setBrowserTtsConfig, createTtsProviderFromConfig } from './ttsConfig.js';

export const TTS_PRESET_CATALOG = presetsData;
export const DEFAULT_TTS_PRESET = presetsData.defaultPreset || 'mock';
export const TTS_GATEWAY_ENV_KEY = presetsData.gatewayEnvKey || 'AMOJI_TTS_GATEWAY';

/**
 * Expand ${VAR} and $VAR in endpoint templates from env/browser.
 * @param {string} template
 * @param {Record<string, string|undefined>} [vars]
 */
export function expandEndpointTemplate(template, vars = {}) {
  if (!template) return '';
  return String(template).replace(/\$\{([A-Z0-9_]+)\}|\$([A-Z0-9_]+)/g, (_, a, b) => {
    const key = a || b;
    const v = vars[key];
    return v != null && String(v).length ? String(v).replace(/\/$/, '') : '';
  });
}

/**
 * @param {{ env?: Record<string, string|undefined>, browser?: object|null }} [sources]
 */
export function resolveGatewayBase(sources = {}) {
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
  return (
    browser?.gateway ||
    env[TTS_GATEWAY_ENV_KEY] ||
    env.AMOJI_TTS_GATEWAY ||
    ''
  );
}

/**
 * @returns {Array<{ id: string, label: string, provider: string, type: string, endpoint: string, description: string, auth: string, gateway?: boolean }>}
 */
export function listTtsPresets() {
  return Object.values(presetsData.presets).map((p) => ({
    id: p.id,
    label: p.label,
    provider: p.provider,
    type: p.type,
    endpoint: p.endpoint || '',
    description: p.description,
    auth: p.auth || 'none',
    fixtureKey: p.fixtureKey || null,
    gateway: !!p.gateway,
  }));
}

/**
 * @param {string} [presetId]
 */
export function getTtsPreset(presetId) {
  const id = presetId || DEFAULT_TTS_PRESET;
  return presetsData.presets[id] || null;
}

/**
 * Apply preset into browser/env-shaped config (does not invent tokens).
 * @param {string} presetId
 * @param {{
 *   token?: string,
 *   endpointOverride?: string,
 *   persistBrowser?: boolean,
 *   env?: Record<string, string|undefined>,
 *   gateway?: string,
 * }} [opts]
 */
export function applyTtsPreset(presetId, opts = {}) {
  const preset = getTtsPreset(presetId);
  if (!preset) {
    return applyComplianceGate(
      { kind: 'tts_preset', error: 'unknown_preset', presetId },
      {},
    );
  }

  const env = opts.env || (typeof process !== 'undefined' ? process.env : {}) || {};
  const gateway =
    opts.gateway ||
    resolveGatewayBase({
      env,
      browser:
        typeof globalThis !== 'undefined' ? globalThis.__AMOJI_TTS__ || null : null,
    });

  const vars = {
    ...env,
    [TTS_GATEWAY_ENV_KEY]: gateway,
    AMOJI_TTS_GATEWAY: gateway,
  };

  let endpoint =
    opts.endpointOverride ??
    expandEndpointTemplate(preset.endpoint || '', vars);

  // Gateway presets without a base stay empty → not readyForHttp
  if (preset.gateway && !gateway && !opts.endpointOverride) {
    endpoint = '';
  }

  const partial = {
    type: preset.type || (endpoint ? 'http' : 'mock'),
    endpoint,
    provider: preset.provider || 'auto',
  };
  if (gateway) partial.gateway = gateway;
  if (opts.token) partial.token = opts.token;
  else if (preset.defaultTokenHint && preset.id === 'local-smoke') {
    partial.token = preset.defaultTokenHint;
  } else if (env.AMOJI_TTS_TOKEN) {
    partial.token = env.AMOJI_TTS_TOKEN;
  }

  let cfg;
  if (opts.persistBrowser !== false && typeof globalThis !== 'undefined') {
    cfg = setBrowserTtsConfig(partial);
  } else {
    cfg = resolveTtsConfig({ browser: partial, env: {} });
  }

  return applyComplianceGate(
    {
      kind: 'tts_preset',
      presetId: preset.id,
      label: preset.label,
      fixtureKey: preset.fixtureKey || null,
      auth: preset.auth || 'none',
      gateway: !!preset.gateway,
      gatewayBase: gateway || null,
      endpointTemplate: preset.endpoint || '',
      config: cfg,
      providerReady: cfg.type === 'mock' || cfg.readyForHttp,
      needsGateway: !!preset.gateway && !gateway && !opts.endpointOverride,
    },
    {},
  );
}

/**
 * Create a provider from a preset id.
 * @param {string} presetId
 * @param {{ token?: string, endpointOverride?: string, fetchImpl?: typeof fetch, persistBrowser?: boolean, env?: object, gateway?: string }} [opts]
 */
export function createTtsProviderFromPreset(presetId, opts = {}) {
  const applied = applyTtsPreset(presetId, opts);
  if (applied.error) return null;
  return createTtsProviderFromConfig(applied.config, {
    fetchImpl: opts.fetchImpl,
    fixture: applied.fixtureKey || undefined,
  });
}

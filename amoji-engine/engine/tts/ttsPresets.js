/**
 * Production TTS provider presets — templates for Face Live / env wiring.
 */
import presetsData from '../../data/tts/provider-presets.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { resolveTtsConfig, setBrowserTtsConfig, createTtsProviderFromConfig } from './ttsConfig.js';

export const TTS_PRESET_CATALOG = presetsData;
export const DEFAULT_TTS_PRESET = presetsData.defaultPreset || 'mock';

/**
 * @returns {Array<{ id: string, label: string, provider: string, type: string, endpoint: string, description: string, auth: string }>}
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
 * @param {{ token?: string, endpointOverride?: string, persistBrowser?: boolean }} [opts]
 */
export function applyTtsPreset(presetId, opts = {}) {
  const preset = getTtsPreset(presetId);
  if (!preset) {
    return applyComplianceGate(
      { kind: 'tts_preset', error: 'unknown_preset', presetId },
      {},
    );
  }
  const endpoint = opts.endpointOverride ?? preset.endpoint ?? '';
  const partial = {
    type: preset.type || (endpoint ? 'http' : 'mock'),
    endpoint,
    provider: preset.provider || 'auto',
  };
  if (opts.token) partial.token = opts.token;
  else if (preset.defaultTokenHint && !opts.token && preset.id === 'local-smoke') {
    partial.token = preset.defaultTokenHint;
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
      config: cfg,
      providerReady: cfg.type === 'mock' || cfg.readyForHttp,
    },
    {},
  );
}

/**
 * Create a provider from a preset id.
 * @param {string} presetId
 * @param {{ token?: string, endpointOverride?: string, fetchImpl?: typeof fetch, persistBrowser?: boolean }} [opts]
 */
export function createTtsProviderFromPreset(presetId, opts = {}) {
  const applied = applyTtsPreset(presetId, opts);
  if (applied.error) return null;
  return createTtsProviderFromConfig(applied.config, {
    fetchImpl: opts.fetchImpl,
    fixture: applied.fixtureKey || undefined,
  });
}

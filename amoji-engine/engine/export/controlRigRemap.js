/**
 * UE Control Rig / morph remap — ARKit 52 ↔ custom morph target names.
 */
import remapData from '../../data/ue/control-rig-arkit-remap.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { ARKIT_CHANNELS, emptyArkitWeights } from './arkitExporter.js';

export const CONTROL_RIG_REMAP_CATALOG = remapData;
export const DEFAULT_REMAP_PROFILE = 'sakura-expression';

/**
 * @returns {Array<{ id: string, label: string, description: string }>}
 */
export function listRemapProfiles() {
  return Object.values(remapData.profiles).map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
    mappedCount: Object.keys(p.map || {}).length,
  }));
}

/**
 * @param {string} [profileId]
 */
export function getRemapProfile(profileId) {
  const id = profileId || DEFAULT_REMAP_PROFILE;
  return remapData.profiles[id] || null;
}

/**
 * Invert arkit→morph map to morph→arkit (first wins on collisions).
 * @param {Record<string, string>} map
 */
export function invertRemap(map) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [arkit, morph] of Object.entries(map || {})) {
    if (!out[morph]) out[morph] = arkit;
  }
  return out;
}

/**
 * Remap ARKit blendShapes → custom morph weights.
 * Unmapped channels keep ARKit names when keepUnmapped=true.
 *
 * @param {Record<string, number>} arkitWeights
 * @param {{ profileId?: string, keepUnmapped?: boolean }} [opts]
 */
export function remapArkitToMorphs(arkitWeights, opts = {}) {
  const profile = getRemapProfile(opts.profileId);
  if (!profile) {
    return applyComplianceGate(
      { kind: 'control_rig_remap', error: 'unknown_profile', profileId: opts.profileId },
      {},
    );
  }
  const keepUnmapped = opts.keepUnmapped !== false;
  const map = profile.map || {};
  /** @type {Record<string, number>} */
  const morphs = {};
  let mapped = 0;
  let passthrough = 0;
  for (const [ch, value] of Object.entries(arkitWeights || {})) {
    if (typeof value !== 'number') continue;
    const target = map[ch];
    if (target) {
      morphs[target] = (morphs[target] || 0) + value;
      mapped += 1;
    } else if (keepUnmapped) {
      morphs[ch] = value;
      passthrough += 1;
    }
  }
  return applyComplianceGate(
    {
      kind: 'control_rig_remap',
      profileId: profile.id,
      direction: 'arkit_to_morph',
      mapped,
      passthrough,
      morphs,
    },
    {},
  );
}

/**
 * Remap custom morph weights → ARKit blendShapes (inverse sample map).
 * @param {Record<string, number>} morphWeights
 * @param {{ profileId?: string }} [opts]
 */
export function remapMorphsToArkit(morphWeights, opts = {}) {
  const profile = getRemapProfile(opts.profileId);
  if (!profile) {
    return applyComplianceGate(
      { kind: 'control_rig_remap', error: 'unknown_profile', profileId: opts.profileId },
      {},
    );
  }
  const inv = invertRemap(profile.map || {});
  const blendShapes = emptyArkitWeights();
  let mapped = 0;
  for (const [morph, value] of Object.entries(morphWeights || {})) {
    if (typeof value !== 'number') continue;
    const arkit = inv[morph] || (ARKIT_CHANNELS.includes(morph) ? morph : null);
    if (!arkit) continue;
    blendShapes[arkit] = Math.max(0, Math.min(1, (blendShapes[arkit] || 0) + value));
    mapped += 1;
  }
  return applyComplianceGate(
    {
      kind: 'control_rig_remap',
      profileId: profile.id,
      direction: 'morph_to_arkit',
      mapped,
      blendShapes,
    },
    {},
  );
}

/**
 * Remap a full Live Link frame's blendShapes in place (returns new frame object).
 * @param {object} frame
 * @param {{ profileId?: string, keepUnmapped?: boolean }} [opts]
 */
export function remapLiveLinkFrame(frame, opts = {}) {
  const remapped = remapArkitToMorphs(frame?.blendShapes || {}, opts);
  if (remapped.error) return remapped;
  return applyComplianceGate(
    {
      ...frame,
      kind: 'livelink_remapped',
      remapProfile: remapped.profileId,
      blendShapes: remapped.morphs,
      morphs: remapped.morphs,
      mapped: remapped.mapped,
    },
    {},
  );
}

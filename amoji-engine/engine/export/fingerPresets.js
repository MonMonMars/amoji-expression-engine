/**
 * Gesture → finger presets for robot hand/finger packs.
 */
import presetsData from '../../data/gestures/finger-presets.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { articulateFingers } from './fingerArticulation.js';

export const FINGER_PRESET_CATALOG = presetsData;
export const DEFAULT_FINGER_PRESET = presetsData.defaultPreset || 'rest';

/**
 * @returns {Array<{ id: string, label: string, description: string }>}
 */
export function listFingerPresets() {
  return Object.values(presetsData.presets).map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
  }));
}

/**
 * @param {string} [presetId]
 */
export function getFingerPreset(presetId) {
  const id = presetId || DEFAULT_FINGER_PRESET;
  return presetsData.presets[id] || null;
}

/**
 * Resolve preset → gesture bag (+ optional articulated digit joints).
 * @param {string} presetId
 * @param {{ articulate?: boolean }} [opts]
 */
export function resolveFingerPreset(presetId, opts = {}) {
  const preset = getFingerPreset(presetId);
  if (!preset) {
    return applyComplianceGate(
      { kind: 'finger_preset', error: 'unknown_preset', presetId },
      {},
    );
  }
  const gesture = { ...(preset.gesture || {}) };
  const digits = opts.articulate === false ? null : articulateFingers(gesture);
  return applyComplianceGate(
    {
      kind: 'finger_preset',
      presetId: preset.id,
      label: preset.label,
      gesture,
      digits,
    },
    {},
  );
}

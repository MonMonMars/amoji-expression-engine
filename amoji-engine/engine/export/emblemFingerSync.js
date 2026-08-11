/**
 * Emblem / affect / adaptor ↔ finger preset sync for Face Live / robot hands.
 */
import syncData from '../../data/gestures/emblem-finger-sync.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { resolveFingerPreset } from './fingerPresets.js';

export const EMBLEM_FINGER_SYNC = syncData;
export const EMBLEM_TO_FINGER = syncData.emblemToFinger || {};
export const FINGER_TO_EMBLEM = syncData.fingerToEmblem || {};
export const AFFECT_TO_FINGER = syncData.affectToFinger || {};
export const ADAPTOR_TO_FINGER = syncData.adaptorToFinger || {};

/**
 * @param {string|null|undefined} emblemId
 * @returns {string|null}
 */
export function fingerPresetForEmblem(emblemId) {
  if (!emblemId) return null;
  return EMBLEM_TO_FINGER[emblemId] || null;
}

/**
 * @param {string|null|undefined} fingerPresetId
 * @returns {string|null}
 */
export function emblemForFingerPreset(fingerPresetId) {
  if (!fingerPresetId) return null;
  return FINGER_TO_EMBLEM[fingerPresetId] || null;
}

/**
 * @param {string|null|undefined} emotion
 * @returns {string|null}
 */
export function fingerPresetForAffect(emotion) {
  if (!emotion) return null;
  return AFFECT_TO_FINGER[emotion] || null;
}

/**
 * @param {string|null|undefined} adaptorId
 * @returns {string|null}
 */
export function fingerPresetForAdaptor(adaptorId) {
  if (!adaptorId) return null;
  return ADAPTOR_TO_FINGER[adaptorId] || null;
}

/**
 * Resolve emblem → finger preset + gesture bag.
 * @param {string} emblemId
 * @param {{ articulate?: boolean }} [opts]
 */
export function syncEmblemToFinger(emblemId, opts = {}) {
  const fingerPresetId = fingerPresetForEmblem(emblemId);
  if (!fingerPresetId) {
    return applyComplianceGate(
      {
        kind: 'emblem_finger_sync',
        emblemId,
        fingerPresetId: null,
        synced: false,
        reason: 'no_mapping',
      },
      {},
    );
  }
  const resolved = resolveFingerPreset(fingerPresetId, {
    articulate: opts.articulate !== false,
  });
  return applyComplianceGate(
    {
      kind: 'emblem_finger_sync',
      emblemId,
      fingerPresetId,
      synced: !resolved.error,
      gesture: resolved.gesture || null,
      digits: resolved.digits || null,
      label: resolved.label || fingerPresetId,
    },
    {},
  );
}

/**
 * Suggest emblem when user picks a finger preset (optional UI hint).
 * @param {string} fingerPresetId
 */
export function syncFingerToEmblem(fingerPresetId) {
  const emblemId = emblemForFingerPreset(fingerPresetId);
  return applyComplianceGate(
    {
      kind: 'finger_emblem_sync',
      fingerPresetId,
      emblemId,
      synced: !!emblemId,
    },
    {},
  );
}

/**
 * Emotion affect display → finger preset.
 * @param {string} emotion
 * @param {{ articulate?: boolean }} [opts]
 */
export function syncAffectToFinger(emotion, opts = {}) {
  const fingerPresetId = fingerPresetForAffect(emotion);
  if (!fingerPresetId) {
    return applyComplianceGate(
      {
        kind: 'affect_finger_sync',
        emotion,
        fingerPresetId: null,
        synced: false,
        reason: 'no_mapping',
      },
      {},
    );
  }
  const resolved = resolveFingerPreset(fingerPresetId, {
    articulate: opts.articulate !== false,
  });
  return applyComplianceGate(
    {
      kind: 'affect_finger_sync',
      emotion,
      fingerPresetId,
      synced: !resolved.error,
      gesture: resolved.gesture || null,
      digits: resolved.digits || null,
      label: resolved.label || fingerPresetId,
    },
    {},
  );
}

/**
 * Adaptor id → finger preset.
 * @param {string} adaptorId
 * @param {{ articulate?: boolean }} [opts]
 */
export function syncAdaptorToFinger(adaptorId, opts = {}) {
  const fingerPresetId = fingerPresetForAdaptor(adaptorId);
  if (!fingerPresetId) {
    return applyComplianceGate(
      {
        kind: 'adaptor_finger_sync',
        adaptorId,
        fingerPresetId: null,
        synced: false,
        reason: 'no_mapping',
      },
      {},
    );
  }
  const resolved = resolveFingerPreset(fingerPresetId, {
    articulate: opts.articulate !== false,
  });
  return applyComplianceGate(
    {
      kind: 'adaptor_finger_sync',
      adaptorId,
      fingerPresetId,
      synced: !resolved.error,
      gesture: resolved.gesture || null,
      digits: resolved.digits || null,
      label: resolved.label || fingerPresetId,
    },
    {},
  );
}

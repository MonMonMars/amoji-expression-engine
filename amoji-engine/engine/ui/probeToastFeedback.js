/**
 * Linked sound + haptic mute for Face Live probe toast feedback.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Pair sound/haptic players with optional linked mute.
 * @param {{
 *   muted?: boolean,
 *   setMuted?: (on: boolean) => unknown,
 *   toggleMute?: () => unknown,
 * }} sound
 * @param {{
 *   muted?: boolean,
 *   setMuted?: (on: boolean) => unknown,
 *   toggleMute?: () => unknown,
 * }} haptic
 * @param {{ linked?: boolean }} [opts]
 */
export function createLinkedProbeToastMute(sound, haptic, opts = {}) {
  let linked = opts.linked !== false;

  const gate = (action, extra = {}) =>
    applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_feedback',
        action,
        ok: true,
        linked,
        soundMuted: !!sound?.muted,
        hapticMuted: !!haptic?.muted,
        ...extra,
      },
      {},
    );

  return {
    get linked() {
      return linked;
    },
    get muted() {
      return !!(sound?.muted || haptic?.muted);
    },
    get soundMuted() {
      return !!sound?.muted;
    },
    get hapticMuted() {
      return !!haptic?.muted;
    },
    setLinked(on) {
      linked = !!on;
      if (linked && sound && haptic) {
        haptic.setMuted?.(!!sound.muted);
      }
      return gate('set_linked', { linked });
    },
    setMuted(on) {
      const muted = !!on;
      sound?.setMuted?.(muted);
      if (linked) haptic?.setMuted?.(muted);
      return gate('set_muted', { muted });
    },
    toggleMute() {
      const next = !sound?.muted;
      sound?.setMuted?.(next);
      if (linked) haptic?.setMuted?.(next);
      else haptic?.toggleMute?.();
      return gate('toggle_mute', { muted: !!sound?.muted });
    },
    toggleSoundMute() {
      sound?.toggleMute?.();
      if (linked) haptic?.setMuted?.(!!sound?.muted);
      return gate('toggle_sound_mute', { muted: !!sound?.muted });
    },
    toggleHapticMute() {
      haptic?.toggleMute?.();
      if (linked) sound?.setMuted?.(!!haptic?.muted);
      return gate('toggle_haptic_mute', { muted: !!haptic?.muted });
    },
  };
}

/**
 * One-line summary of probe toast feedback prefs (non-default only).
 * @param {object} prefs
 */
export function formatProbeToastFeedbackSummary(prefs) {
  if (!prefs || typeof prefs !== 'object') return null;
  const bits = [];
  if (prefs.probeToastSoundMuted) bits.push('toast sound off');
  if (prefs.probeToastHapticMuted) bits.push('haptic off');
  if (prefs.probeToastLinkMute === false) bits.push('mute unlinked');
  if (
    typeof prefs.probeToastVolume === 'number' &&
    Math.abs(prefs.probeToastVolume - 1) > 0.001
  ) {
    bits.push(`vol ${Math.round(prefs.probeToastVolume * 100)}%`);
  }
  return bits.length ? bits.join(', ') : null;
}

/**
 * Apply stored probe toast feedback prefs onto live players.
 * @param {object} prefs
 * @param {{ sound?: object, haptic?: object, feedback?: object }} players
 */
export function applyProbeToastFeedbackFromPrefs(prefs, players = {}) {
  const p = prefs || {};
  const { sound, haptic, feedback } = players;
  if (feedback?.setLinked) {
    feedback.setLinked(p.probeToastLinkMute !== false);
  }
  if (sound?.setMuted && p.probeToastSoundMuted) {
    sound.setMuted(true);
  }
  if (haptic?.setMuted && p.probeToastHapticMuted) {
    haptic.setMuted(true);
  }
  if (feedback?.linked && sound && haptic) {
    haptic.setMuted?.(!!sound.muted);
  }
  if (typeof p.probeToastVolume === 'number' && sound?.setVolume) {
    sound.setVolume(Math.max(0, Math.min(1, p.probeToastVolume)));
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_feedback',
      action: 'restore_from_prefs',
      ok: true,
      soundMuted: !!sound?.muted,
      hapticMuted: !!haptic?.muted,
      linked: feedback?.linked !== false,
      volume: typeof sound?.volume === 'number' ? sound.volume : null,
    },
    {},
  );
}

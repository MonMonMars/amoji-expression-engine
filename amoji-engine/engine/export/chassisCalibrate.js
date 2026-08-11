/**
 * Chassis-specific calibration for robot driver packs.
 * Applies scale / offset / invert / deadzone / regional gains, plus slew limiting.
 */
import chassisData from '../../data/robots/chassis.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const CHASSIS_CATALOG = chassisData;
export const CHASSIS = chassisData.chassis;
export const DEFAULT_CHASSIS = chassisData.defaultChassis;
export const REGION_GAIN_MAP = chassisData.regionGainMap;

/**
 * @param {string} [chassisId]
 */
export function getChassis(chassisId) {
  const id = chassisId || DEFAULT_CHASSIS;
  return CHASSIS[id] || null;
}

/**
 * @returns {Array<{ id: string, label: string, packId: string, productLine: string }>}
 */
export function listChassis() {
  return Object.values(CHASSIS).map((c) => ({
    id: c.id,
    label: c.label,
    packId: c.packId,
    productLine: c.productLine,
    description: c.description,
  }));
}

/**
 * Resolve chassis → pack (override packId if chassis provided).
 * @param {string} [packId]
 * @param {string} [chassisId]
 */
export function resolvePackForChassis(packId, chassisId) {
  if (chassisId) {
    const chassis = getChassis(chassisId);
    if (chassis) return chassis.packId;
  }
  return packId;
}

/**
 * Apply deadzone around rest (or 0).
 * @param {number} v
 * @param {number} deadzone
 * @param {number} rest
 */
export function applyDeadzone(v, deadzone, rest = 0) {
  if (!deadzone || deadzone <= 0) return v;
  const d = v - rest;
  if (Math.abs(d) < deadzone) return rest;
  const sign = d < 0 ? -1 : 1;
  return rest + sign * (Math.abs(d) - deadzone);
}

/**
 * Calibrate one joint target (before clamp).
 * @param {number} raw
 * @param {object} jointSpec — pack joint
 * @param {object} [calib] — chassis joint calib
 * @param {number} [regionGain=1]
 */
export function calibrateJointValue(raw, jointSpec, calib = {}, regionGain = 1) {
  const rest = jointSpec?.rest ?? 0;
  let v = Number(raw);
  if (Number.isNaN(v)) v = rest;

  const scale = (calib.scale ?? 1) * regionGain;
  const offset = calib.offset ?? 0;
  if (calib.invert) v = rest - (v - rest);

  v = rest + (v - rest) * scale + offset;
  v = applyDeadzone(v, calib.deadzone ?? 0, rest);
  return v;
}

/**
 * Region gain from chassis gains + joint region.
 * @param {object} chassis
 * @param {string} [region]
 */
export function regionGainFor(chassis, region) {
  const gains = chassis.gains || {};
  const key = REGION_GAIN_MAP[region] || 'expression';
  return gains[key] ?? 1;
}

/**
 * Calibrate a full raw joint map for a chassis.
 * @param {string} chassisId
 * @param {Record<string, number>} rawJoints
 * @param {{ joints: Record<string, object>, id?: string } | null} pack
 */
export function calibrateRawJoints(chassisId, rawJoints, pack) {
  const chassis = getChassis(chassisId);
  if (!chassis) {
    return applyComplianceGate(
      { kind: 'chassis_calib', error: 'unknown_chassis', chassisId, joints: rawJoints },
      {},
    );
  }
  if (!pack?.joints) {
    return applyComplianceGate(
      { kind: 'chassis_calib', error: 'pack_required', packId: chassis.packId },
      {},
    );
  }

  /** @type {Record<string, number>} */
  const out = {};
  const jointCalib = chassis.joints || {};
  for (const [id, raw] of Object.entries(rawJoints)) {
    const spec = pack.joints[id] || { rest: 0 };
    const calib = jointCalib[id] || {};
    const gain = regionGainFor(chassis, spec.region);
    out[id] = calibrateJointValue(raw, spec, calib, gain);
  }

  return applyComplianceGate(
    {
      kind: 'chassis_calib',
      chassisId: chassis.id,
      packId: pack.id || chassis.packId,
      joints: out,
    },
    {},
  );
}

/**
 * Slew-limit joint motion toward targets (hardware-safe).
 */
export class ChassisSlewLimiter {
  /**
   * @param {string} [chassisId]
   */
  constructor(chassisId = DEFAULT_CHASSIS) {
    this.chassisId = chassisId;
    /** @type {Record<string, number>} */
    this.state = {};
  }

  /**
   * @param {string} chassisId
   */
  setChassis(chassisId) {
    this.chassisId = chassisId;
    this.state = {};
  }

  reset() {
    this.state = {};
  }

  /**
   * @param {Record<string, { value: number, min?: number, max?: number }|number>} joints
   * @param {number} dtSec
   * @returns {Record<string, number>}
   */
  step(joints, dtSec) {
    const chassis = getChassis(this.chassisId);
    const calibMap = chassis?.joints || {};
    const dt = Math.max(1e-4, dtSec);
    /** @type {Record<string, number>} */
    const out = {};

    for (const [id, j] of Object.entries(joints)) {
      const target = typeof j === 'number' ? j : j.value;
      const prev = this.state[id] ?? target;
      const calib = calibMap[id] || {};
      const maxDelta =
        typeof calib.maxDeltaPerSec === 'number'
          ? calib.maxDeltaPerSec * dt
          : Infinity;
      let next = target;
      const delta = target - prev;
      if (Math.abs(delta) > maxDelta) {
        next = prev + Math.sign(delta) * maxDelta;
      }
      // Respect pack limits if present on joint objects
      if (typeof j === 'object' && j && typeof j.min === 'number' && typeof j.max === 'number') {
        next = Math.min(j.max, Math.max(j.min, next));
      }
      this.state[id] = next;
      out[id] = Number(next.toFixed(4));
    }
    return out;
  }
}

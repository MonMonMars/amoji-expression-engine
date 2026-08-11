import perimeterData from '../../data/muscles/emotion-perimeter-table.json' with { type: 'json' };

const { table: MUSCLE_PERIMETER_TABLE, emotions: PERIMETER_EMOTIONS } = perimeterData;

/**
 * Cap a raw muscle activation by the emotion-specific perimeter.
 * @param {number} rawValue
 * @param {string} muscleId e.g. "M1"
 * @param {string} emotionId e.g. "blaming"
 * @returns {number}
 */
export function applyMusclePerimeter(rawValue, muscleId, emotionId) {
  const row = MUSCLE_PERIMETER_TABLE[muscleId];
  if (!row) {
    throw new Error(`Unknown muscleId: ${muscleId}`);
  }
  const cap = row[emotionId];
  if (cap == null) {
    throw new Error(`Unknown emotionId for perimeter: ${emotionId}`);
  }
  // Bidirectional magnitude cap: [-cap, +cap]
  const v = Number(rawValue);
  if (Number.isNaN(v)) return 0;
  if (v > cap) return cap;
  if (v < -cap) return -cap;
  return v;
}

/**
 * @param {string} muscleId
 * @param {string} emotionId
 * @returns {number}
 */
export function getMusclePerimeterCap(muscleId, emotionId) {
  const row = MUSCLE_PERIMETER_TABLE[muscleId];
  if (!row || row[emotionId] == null) {
    throw new Error(`Missing perimeter for ${muscleId}/${emotionId}`);
  }
  return row[emotionId];
}

export { MUSCLE_PERIMETER_TABLE, PERIMETER_EMOTIONS };

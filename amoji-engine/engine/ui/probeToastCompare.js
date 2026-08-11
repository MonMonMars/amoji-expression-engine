/**
 * Compare two Face Live probe toast details (current vs previous).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * @param {object|null} detail
 */
function sampleOf(detail) {
  return detail?.sample || null;
}

/**
 * Diff two probe details for compare-mode toast copy.
 * @param {object|null} current
 * @param {object|null} other
 */
export function compareProbeToastDetails(current, other) {
  const a = sampleOf(current);
  const b = sampleOf(other);
  if (!a || !b) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_compare',
        ok: false,
        reason: !a ? 'no_current' : 'no_other',
        compare: false,
        lines: [],
        title: 'Compare',
        detail: 'need two probes',
      },
      {},
    );
  }
  const latA = typeof a.latencyMs === 'number' ? a.latencyMs : null;
  const latB = typeof b.latencyMs === 'number' ? b.latencyMs : null;
  const deltaMs =
    latA != null && latB != null ? Math.round(latA - latB) : null;
  const statusChanged = (a.status || '') !== (b.status || '');
  const okChanged = !!a.ok !== !!b.ok;
  const lines = [
    `now ${a.ok ? 'up' : 'down'} · was ${b.ok ? 'up' : 'down'}`,
    deltaMs != null
      ? `Δ latency ${deltaMs >= 0 ? '+' : ''}${deltaMs}ms (${Math.round(latB)} → ${Math.round(latA)})`
      : 'Δ latency —',
    statusChanged
      ? `status ${b.status || '—'} → ${a.status || '—'}`
      : `status ${a.status || '—'} (same)`,
    a.message || b.message || null,
  ].filter(Boolean);
  const detail =
    deltaMs != null
      ? `Δ ${deltaMs >= 0 ? '+' : ''}${deltaMs}ms · ${b.ok ? 'up' : 'down'}→${a.ok ? 'up' : 'down'}`
      : `${b.ok ? 'up' : 'down'}→${a.ok ? 'up' : 'down'}`;
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_compare',
      ok: true,
      compare: true,
      title: 'Compare',
      detail,
      lines,
      deltaMs,
      statusChanged,
      okChanged,
      current: a,
      other: b,
      copyText: lines.join('\n'),
    },
    {},
  );
}

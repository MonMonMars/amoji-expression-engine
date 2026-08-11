/**
 * Gateway health SLA history — rolling probe samples for Face Live chip.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const GATEWAY_HEALTH_HISTORY_MAX = 24;

/**
 * @param {object} sample
 * @param {{ now?: number }} [opts]
 */
export function normalizeHealthSample(sample, opts = {}) {
  const now = opts.now ?? Date.now();
  if (!sample || typeof sample !== 'object') {
    return {
      ok: false,
      status: 'empty',
      tone: 'warn',
      latencyMs: null,
      at: now,
    };
  }
  return {
    ok: !!sample.ok,
    status: sample.status || (sample.ok ? 'up' : 'down'),
    tone: sample.tone || (sample.ok ? 'ok' : 'bad'),
    latencyMs:
      typeof sample.latencyMs === 'number' && Number.isFinite(sample.latencyMs)
        ? sample.latencyMs
        : null,
    httpStatus: sample.httpStatus ?? null,
    message: sample.message || '',
    at: sample.at || now,
  };
}

/**
 * Summarize rolling health samples into an SLA snapshot.
 * @param {object[]} samples
 * @param {{ windowMs?: number, now?: number }} [opts]
 */
export function summarizeHealthHistory(samples, opts = {}) {
  const list = Array.isArray(samples) ? samples.map((s) => normalizeHealthSample(s)) : [];
  const now = opts.now ?? Date.now();
  const windowMs = opts.windowMs ?? 5 * 60 * 1000;
  const inWindow = list.filter((s) => now - s.at <= windowMs);
  const usable = inWindow.length ? inWindow : list;
  const counted = usable.filter((s) => s.status !== 'no_endpoint' && s.status !== 'empty');
  const ups = counted.filter((s) => s.ok);
  const latencies = counted
    .map((s) => s.latencyMs)
    .filter((n) => typeof n === 'number')
    .sort((a, b) => a - b);
  const uptime =
    counted.length === 0 ? null : Math.round((ups.length / counted.length) * 1000) / 10;
  const p50 =
    latencies.length === 0
      ? null
      : latencies[Math.floor((latencies.length - 1) * 0.5)];
  let streak = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    const s = list[i];
    if (s.status === 'no_endpoint' || s.status === 'empty') continue;
    if (s.ok) {
      if (streak >= 0) streak += 1;
      else break;
    } else {
      if (streak <= 0) streak -= 1;
      else break;
    }
  }
  const latest = list.length ? list[list.length - 1] : null;
  const tone =
    uptime == null
      ? 'warn'
      : uptime >= 95
        ? 'ok'
        : uptime >= 80
          ? 'warn'
          : 'bad';
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_sla',
      sampleCount: counted.length,
      totalSamples: list.length,
      uptimePct: uptime,
      latencyP50Ms: p50,
      streak,
      tone,
      latest,
      windowMs,
    },
    {},
  );
}

/**
 * Format chip text from latest probe + SLA summary.
 * @param {object} [latest]
 * @param {object} [sla]
 */
export function formatHealthSlaChip(latest, sla) {
  if (!latest || latest.status === 'no_endpoint') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_chip',
        text: 'gateway · idle',
        tone: '',
      },
      {},
    );
  }
  const base = latest.message || (latest.ok ? 'up' : 'down');
  const bits = [`gateway · ${base}`];
  if (sla && typeof sla.uptimePct === 'number' && sla.sampleCount > 0) {
    bits.push(`${sla.uptimePct}%`);
  }
  if (sla && typeof sla.latencyP50Ms === 'number') {
    bits.push(`p50 ${Math.round(sla.latencyP50Ms)}ms`);
  }
  if (sla && sla.streak) {
    bits.push(sla.streak > 0 ? `↑${sla.streak}` : `↓${Math.abs(sla.streak)}`);
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_chip',
      text: bits.join(' · '),
      tone: latest.tone || sla?.tone || '',
      sla,
      latest,
    },
    {},
  );
}

/**
 * Build sparkline points (0..1 normalized latency; ok flag) from samples.
 * @param {object[]} samples
 * @param {{ maxPoints?: number }} [opts]
 */
export function buildHealthSparklineSeries(samples, opts = {}) {
  const maxPoints = Math.max(4, opts.maxPoints ?? 24);
  const list = (Array.isArray(samples) ? samples : [])
    .map((s) => normalizeHealthSample(s))
    .filter((s) => s.status !== 'no_endpoint' && s.status !== 'empty')
    .slice(-maxPoints);
  const latencies = list
    .map((s) => s.latencyMs)
    .filter((n) => typeof n === 'number');
  const maxLat = latencies.length ? Math.max(...latencies, 1) : 1;
  const points = list.map((s, i) => {
    const x = list.length <= 1 ? 0.5 : i / (list.length - 1);
    const raw =
      typeof s.latencyMs === 'number' ? s.latencyMs / maxLat : s.ok ? 0.25 : 0.85;
    const y = Math.max(0, Math.min(1, raw));
    return { x, y, ok: !!s.ok, latencyMs: s.latencyMs, at: s.at };
  });
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_sparkline_series',
      points,
      count: points.length,
      maxLatencyMs: latencies.length ? maxLat : null,
    },
    {},
  );
}

/**
 * Render an inline SVG sparkline for SLA HUD.
 * @param {object[]} samples
 * @param {{
 *   width?: number,
 *   height?: number,
 *   maxPoints?: number,
 *   strokeOk?: string,
 *   strokeBad?: string,
 *   fill?: string,
 * }} [opts]
 */
export function buildHealthSparklineSvg(samples, opts = {}) {
  const width = opts.width ?? 120;
  const height = opts.height ?? 28;
  const series = buildHealthSparklineSeries(samples, {
    maxPoints: opts.maxPoints,
  });
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const strokeOk = opts.strokeOk || '#5ee0a8';
  const strokeBad = opts.strokeBad || '#ff6b6b';
  const fill = opts.fill || 'rgba(94,224,168,0.12)';

  if (!series.points.length) {
    const empty = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="gateway SLA sparkline empty"><rect width="100%" height="100%" fill="transparent"/><text x="${width / 2}" y="${height / 2 + 3}" text-anchor="middle" fill="#8fa3b5" font-size="9" font-family="sans-serif">—</text></svg>`;
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_sparkline',
        svg: empty,
        empty: true,
        count: 0,
      },
      {},
    );
  }

  const coords = series.points.map((p) => ({
    x: pad + p.x * w,
    y: pad + (1 - p.y) * h,
    ok: p.ok,
  }));
  const poly = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${pad},${pad + h} ${poly} ${pad + w},${pad + h}`;
  const segments = [];
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1];
    const b = coords[i];
    const ok = a.ok && b.ok;
    segments.push(
      `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${ok ? strokeOk : strokeBad}" stroke-width="1.6" stroke-linecap="round"/>`,
    );
  }
  const dots = coords
    .map(
      (c) =>
        `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="1.6" fill="${c.ok ? strokeOk : strokeBad}"/>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="gateway SLA sparkline"><polygon points="${area}" fill="${fill}" stroke="none"/>${segments.join('')}${dots}</svg>`;
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_sparkline',
      svg,
      empty: false,
      count: series.count,
      maxLatencyMs: series.maxLatencyMs,
      polyline: poly,
    },
    {},
  );
}

/**
 * Resolve which probe sample was clicked on a sparkline (x ratio 0..1).
 * @param {object[]} samples
 * @param {number} xRatio
 * @param {{ maxPoints?: number }} [opts]
 */
export function resolveSparklineProbeAt(samples, xRatio, opts = {}) {
  const series = buildHealthSparklineSeries(samples, opts);
  if (!series.points.length) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_pick',
        ok: false,
        error: 'empty',
        index: -1,
        sample: null,
      },
      {},
    );
  }
  const x = Math.max(0, Math.min(1, Number(xRatio) || 0));
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < series.points.length; i++) {
    const d = Math.abs(series.points[i].x - x);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  const list = (Array.isArray(samples) ? samples : [])
    .map((s) => normalizeHealthSample(s))
    .filter((s) => s.status !== 'no_endpoint' && s.status !== 'empty')
    .slice(-(opts.maxPoints ?? 24));
  const sample = list[best] || null;
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_pick',
      ok: !!sample,
      index: best,
      xRatio: x,
      sample,
      point: series.points[best] || null,
    },
    {},
  );
}

/**
 * Human-readable probe detail lines for Face Live HUD.
 * @param {object|null|undefined} sample
 * @param {{ sla?: object, index?: number, total?: number }} [opts]
 */
export function formatHealthProbeDetail(sample, opts = {}) {
  if (!sample || sample.status === 'no_endpoint' || sample.status === 'empty') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_detail',
        ok: false,
        text: 'probe · none',
        lines: [],
        copyText: '',
      },
      {},
    );
  }
  const when =
    typeof sample.at === 'number'
      ? new Date(sample.at).toISOString().slice(11, 19)
      : '—';
  const lines = [
    `probe ${typeof opts.index === 'number' ? `#${opts.index + 1}` : ''}`.trim() +
      (opts.total ? `/${opts.total}` : ''),
    `${sample.ok ? 'up' : 'down'} · ${sample.status || '—'} · ${sample.tone || ''}`,
    typeof sample.latencyMs === 'number'
      ? `latency ${Math.round(sample.latencyMs)}ms`
      : 'latency —',
    sample.httpStatus != null ? `http ${sample.httpStatus}` : null,
    `at ${when}`,
    sample.message || null,
  ].filter(Boolean);
  if (opts.sla && typeof opts.sla.uptimePct === 'number') {
    lines.push(
      `sla ${opts.sla.uptimePct}%` +
        (opts.sla.latencyP50Ms != null
          ? ` · p50 ${Math.round(opts.sla.latencyP50Ms)}ms`
          : ''),
    );
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_detail',
      ok: true,
      text: lines[0],
      lines,
      sample,
      copyText: lines.join('\n'),
    },
    {},
  );
}

/**
 * Build a clipboard-ready payload from probe detail (or raw lines).
 * @param {{ ok?: boolean, lines?: string[], copyText?: string, text?: string }|string|null} detail
 */
export function buildHealthProbeCopyPayload(detail) {
  if (!detail) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_copy',
        ok: false,
        copyText: '',
        message: 'nothing to copy',
      },
      {},
    );
  }
  if (typeof detail === 'string') {
    const text = detail.trim();
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_copy',
        ok: !!text && text !== 'probe · click sparkline' && text !== 'probe · none',
        copyText: text,
        message: text ? 'probe detail ready' : 'nothing to copy',
      },
      {},
    );
  }
  const copyText =
    detail.copyText ||
    (Array.isArray(detail.lines) && detail.lines.length
      ? detail.lines.join('\n')
      : detail.text || '');
  const ok =
    detail.ok !== false &&
    !!copyText &&
    copyText !== 'probe · none' &&
    copyText !== 'probe · click sparkline';
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_copy',
      ok,
      copyText: ok ? copyText : '',
      message: ok ? 'probe detail ready' : 'nothing to copy',
    },
    {},
  );
}

export const PROBE_DETAIL_TOAST_DISMISS_MS = 3800;

/** Default toast action ids for Face Live probe toast. */
export const PROBE_TOAST_ACTIONS = [
  { id: 'prev', label: 'Prev', shortcut: '[' },
  { id: 'next', label: 'Next', shortcut: ']' },
  { id: 'compare', label: 'Compare', shortcut: '=' },
  { id: 'copy', label: 'Copy', shortcut: 'c' },
  { id: 'reprobe', label: 'Re-probe', shortcut: 'r' },
  { id: 'pin', label: 'Pin', shortcut: 'p' },
  { id: 'dismiss', label: 'Dismiss', shortcut: 'Escape' },
];

/**
 * Map a keyboard event to a probe toast action id.
 * @param {{ key?: string, code?: string, metaKey?: boolean, ctrlKey?: boolean, altKey?: boolean }|string|null} ev
 * @param {{ visible?: boolean }} [opts]
 */
export function resolveProbeToastShortcut(ev, opts = {}) {
  if (opts.visible === false) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_shortcut',
        ok: false,
        reason: 'toast_hidden',
        action: null,
      },
      {},
    );
  }
  const key = typeof ev === 'string' ? ev : ev?.key || '';
  const code = typeof ev === 'object' && ev ? ev.code || '' : '';
  if (typeof ev === 'object' && ev && (ev.metaKey || ev.ctrlKey || ev.altKey)) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_shortcut',
        ok: false,
        reason: 'modifier',
        action: null,
      },
      {},
    );
  }
  const k = String(key);
  let action = null;
  if (k === 'Escape' || code === 'Escape') action = 'dismiss';
  else if (k === 'c' || k === 'C') action = 'copy';
  else if (k === 'r' || k === 'R') action = 'reprobe';
  else if (k === 'p' || k === 'P') action = 'pin';
  else if (k === '[') action = 'prev';
  else if (k === ']') action = 'next';
  else if (k === '=' || k === '+') action = 'compare';
  if (!action) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_shortcut',
        ok: false,
        reason: 'unbound',
        action: null,
        key: k || null,
      },
      {},
    );
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_shortcut',
      ok: true,
      action,
      key: k || null,
    },
    {},
  );
}
/**
 * Build a toast payload when a sparkline probe is inspected.
 * @param {{ ok?: boolean, lines?: string[], text?: string, sample?: object }|null} detail
 * @param {{ dismissMs?: number, actions?: Array<{ id: string, label: string }> }} [opts]
 */
export function describeHealthProbeToast(detail, opts = {}) {
  const dismissMs = opts.dismissMs ?? PROBE_DETAIL_TOAST_DISMISS_MS;
  const actions = Array.isArray(opts.actions) ? opts.actions : PROBE_TOAST_ACTIONS;
  if (!detail || detail.ok === false) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast',
        show: false,
        reason: 'no_probe',
        dismissMs,
        actions: [],
      },
      {},
    );
  }
  const lines = Array.isArray(detail.lines) ? detail.lines : [];
  const sample = detail.sample || null;
  const title = sample?.ok
    ? 'Probe up'
    : sample
      ? 'Probe down'
      : 'Probe detail';
  const detailLine =
    lines.find((l) => /^latency/i.test(l)) ||
    lines[1] ||
    lines[0] ||
    detail.text ||
    'probe';
  const tone = sample?.tone || (sample?.ok ? 'ok' : 'bad');
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast',
      show: true,
      tone,
      title,
      detail: detailLine,
      message: `${title} · ${detailLine}`,
      lines,
      dismissMs,
      actions,
      canCopy: true,
      canReprobe: true,
    },
    {},
  );
}

/**
 * Resolve a probe toast action id → next UI intent.
 * @param {string} actionId
 * @param {{ detail?: object|null }} [ctx]
 */
export function resolveProbeToastAction(actionId, ctx = {}) {
  const id = String(actionId || '');
  if (id === 'prev' || id === 'next') {
    const can =
      id === 'prev' ? !!ctx.canBack : !!ctx.canForward;
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: can,
        action: id,
        copy: null,
        dismiss: false,
        reprobe: false,
        pin: false,
        unpin: false,
        history: id,
        compare: false,
        reason: can ? null : id === 'prev' ? 'at_start' : 'at_end',
      },
      {},
    );
  }
  if (id === 'compare') {
    const can = !!ctx.canCompare;
    const on = !!ctx.compareOn;
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: can || on,
        action: 'compare',
        copy: null,
        dismiss: false,
        reprobe: false,
        pin: false,
        unpin: false,
        history: null,
        compare: true,
        compareOn: !on,
        reason: can || on ? null : 'need_previous',
      },
      {},
    );
  }
  if (id === 'copy') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: true,
        action: 'copy',
        copy: buildHealthProbeCopyPayload(ctx.detail || null),
        dismiss: false,
        reprobe: false,
        pin: false,
        unpin: false,
        history: null,
        compare: false,
      },
      {},
    );
  }
  if (id === 'reprobe') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: true,
        action: 'reprobe',
        copy: null,
        dismiss: true,
        reprobe: true,
        pin: false,
        unpin: false,
        history: null,
        compare: false,
      },
      {},
    );
  }
  if (id === 'pin') {
    const pinned = !!ctx.pinned;
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: true,
        action: 'pin',
        copy: null,
        dismiss: false,
        reprobe: false,
        pin: !pinned,
        unpin: pinned,
        sticky: !pinned,
        history: null,
        compare: false,
      },
      {},
    );
  }
  if (id === 'dismiss') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_action',
        ok: true,
        action: 'dismiss',
        copy: null,
        dismiss: true,
        reprobe: false,
        pin: false,
        unpin: false,
        history: null,
        compare: false,
      },
      {},
    );
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_action',
      ok: false,
      action: id || null,
      error: 'unknown_action',
      dismiss: false,
      reprobe: false,
      pin: false,
      unpin: false,
      history: null,
      compare: false,
    },
    {},
  );
}

/**
 * Create a mutable rolling history buffer.
 * @param {{ max?: number }} [opts]
 */
export function createGatewayHealthHistory(opts = {}) {
  const max = Math.max(4, opts.max ?? GATEWAY_HEALTH_HISTORY_MAX);
  /** @type {ReturnType<typeof normalizeHealthSample>[]} */
  const samples = [];
  return {
    get samples() {
      return samples.slice();
    },
    get size() {
      return samples.length;
    },
    clear() {
      samples.length = 0;
      return applyComplianceGate(
        { kind: 'tts_gateway_health_history', action: 'clear', ok: true },
        {},
      );
    },
    push(result, pushOpts = {}) {
      if (result?.status === 'no_endpoint') {
        return summarizeHealthHistory(samples, pushOpts);
      }
      samples.push(normalizeHealthSample(result, pushOpts));
      while (samples.length > max) samples.shift();
      return summarizeHealthHistory(samples, pushOpts);
    },
    summarize(sumOpts = {}) {
      return summarizeHealthHistory(samples, sumOpts);
    },
    formatChip(latest) {
      const sla = summarizeHealthHistory(samples);
      return formatHealthSlaChip(latest || sla.latest, sla);
    },
    sparkline(sparkOpts = {}) {
      return buildHealthSparklineSvg(samples, sparkOpts);
    },
    probeAt(xRatio, pickOpts = {}) {
      return resolveSparklineProbeAt(samples, xRatio, pickOpts);
    },
    probeDetail(xRatio, detailOpts = {}) {
      const pick = resolveSparklineProbeAt(samples, xRatio, detailOpts);
      const sla = summarizeHealthHistory(samples);
      return formatHealthProbeDetail(pick.sample, {
        sla,
        index: pick.index,
        total: pick.ok
          ? samples.filter(
              (s) => s.status !== 'no_endpoint' && s.status !== 'empty',
            ).length
          : 0,
      });
    },
  };
}

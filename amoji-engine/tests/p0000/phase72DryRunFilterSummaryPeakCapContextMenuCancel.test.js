import { describe, expect, it } from 'vitest';
import {
  formatAuditViewsImportDryRunFilterSummary,
  previewAuditViewsImportDryRun,
} from '../../engine/ui/auditSavedViews.js';
import {
  CONTINUITY_RESIDUAL_PULSE_PEAK_CAP,
  continuityResidualDeliverPulseClass,
  continuityResidualPulsePeakHud,
} from '../../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 72 Meta dry-run filter summary', () => {
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    starredOnly: true,
    folder: 'Archive',
    views: [{ name: 'View', action: 'share', starred: true, folder: 'Archive' }],
  };

  it('summarizes active import filters', () => {
    const summary = formatAuditViewsImportDryRunFilterSummary(
      JSON.stringify(payload),
      { inheritExportMeta: true },
    );
    expect(summary.ok).toBe(true);
    expect(summary.summary).toContain('filters');
    expect(summary.summary).toContain('starred');
    expect(summary.summary).toContain('folder Archive');
    expect(summary.filters).toContain('starred');
  });

  it('appends filter summary to dry-run label', () => {
    const dry = previewAuditViewsImportDryRun([], JSON.stringify(payload), {
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.filterSummary).toContain('starred');
    expect(dry.label).toContain('filters');
  });

  it('reports filters none when no filters active', () => {
    const summary = formatAuditViewsImportDryRunFilterSummary(
      JSON.stringify({ views: [{ name: 'Plain', action: 'share' }] }),
      { inheritExportMeta: true },
    );
    expect(summary.ok).toBe(true);
    expect(summary.summary).toBe('filters none');
  });
});

describe('Phase 72 residual pulse peak cap HUD', () => {
  it('reports peak cap label when brightness is clamped', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'angry', intensity: 0.95 },
    });
    expect(pulse.ok).toBe(true);
    expect(pulse.peakCapped).toBe(true);
    expect(pulse.peak).toBe(CONTINUITY_RESIDUAL_PULSE_PEAK_CAP);

    const hud = continuityResidualPulsePeakHud(pulse);
    expect(hud.ok).toBe(true);
    expect(hud.peakCapped).toBe(true);
    expect(hud.label).toContain('peak cap');
    expect(hud.label).toContain('2.0');
  });

  it('reports uncapped peak below cap', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'sad', intensity: 0.2 },
    });
    expect(pulse.peakCapped).toBe(false);
    const hud = continuityResidualPulsePeakHud(pulse);
    expect(hud.ok).toBe(true);
    expect(hud.peakCapped).toBe(false);
    expect(hud.label).toContain('peak 1.');
  });
});

describe('Phase 72 cancel on TTS endpoint context menu', () => {
  it('supports tts_endpoint_context_menu_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_context_menu_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_context_menu_pick');
  });
});

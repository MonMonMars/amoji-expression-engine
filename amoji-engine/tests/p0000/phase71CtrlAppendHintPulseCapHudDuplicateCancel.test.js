import { describe, expect, it } from 'vitest';
import {
  formatAuditViewsImportDryRunMergeHint,
  previewAuditViewsImportDryRun,
} from '../../engine/ui/auditSavedViews.js';
import {
  CONTINUITY_RESIDUAL_PULSE_DURATION_CAP_SEC,
  continuityResidualDeliverPulseClass,
  continuityResidualPulseDurationHud,
} from '../../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 71 Meta+Ctrl dry-run append hint', () => {
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    starredOnly: true,
    views: [
      { name: 'Existing', action: 'share', starred: true },
      { name: 'New view', action: 'export', starred: true },
    ],
  };

  it('append hint includes Ctrl append dry-run and inherit hint', () => {
    const hint = formatAuditViewsImportDryRunMergeHint(JSON.stringify(payload), {
      appendOnly: true,
      ctrlAppend: true,
      inheritExportMeta: true,
    });
    expect(hint.ok).toBe(true);
    expect(hint.ctrlAppend).toBe(true);
    expect(hint.hint).toContain('Ctrl append dry-run');
    expect(hint.hint).toContain('starred');
  });

  it('dry-run label appends append hint on Meta+Ctrl', () => {
    const existing = [{ name: 'Existing', action: 'share', id: 'a' }];
    const dry = previewAuditViewsImportDryRun(existing, JSON.stringify(payload), {
      appendOnly: true,
      ctrlAppend: true,
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.ctrlAppend).toBe(true);
    expect(dry.hint).toContain('Ctrl append dry-run');
    expect(dry.label).toContain('Ctrl append dry-run');
  });
});

describe('Phase 71 residual pulse duration cap HUD', () => {
  it('reports cap label when duration is clamped', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'angry', intensity: 0.95 },
    });
    expect(pulse.ok).toBe(true);
    expect(pulse.durationCapped).toBe(true);
    expect(pulse.durationSec).toBe(CONTINUITY_RESIDUAL_PULSE_DURATION_CAP_SEC);

    const hud = continuityResidualPulseDurationHud(pulse);
    expect(hud.ok).toBe(true);
    expect(hud.durationCapped).toBe(true);
    expect(hud.label).toContain('pulse cap');
    expect(hud.label).toContain('1.0s');
  });

  it('reports uncapped duration below cap', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'sad', intensity: 0.2 },
    });
    expect(pulse.durationCapped).toBe(false);
    const hud = continuityResidualPulseDurationHud(pulse);
    expect(hud.ok).toBe(true);
    expect(hud.durationCapped).toBe(false);
    expect(hud.label).toContain('pulse 0.');
  });
});

describe('Phase 71 cancel on TTS endpoint duplicate', () => {
  it('supports tts_endpoint_duplicate_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_duplicate_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_duplicate_pick');
  });
});

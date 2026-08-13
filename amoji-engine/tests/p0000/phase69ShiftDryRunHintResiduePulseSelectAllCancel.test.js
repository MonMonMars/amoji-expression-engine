import { describe, expect, it } from 'vitest';
import {
  formatAuditViewsImportDryRunMergeHint,
  previewAuditViewsImportDryRun,
} from '../../engine/ui/auditSavedViews.js';
import { continuityResidualDeliverPulseClass } from '../../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 69 Meta+Shift dry-run merge hint', () => {
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    starredOnly: true,
    folder: 'Archive',
    views: [{ name: 'Starred view', action: 'share', starred: true, folder: 'Archive' }],
  };

  it('merge hint includes Shift merge dry-run and inherit hint', () => {
    const hint = formatAuditViewsImportDryRunMergeHint(JSON.stringify(payload), {
      shiftMerge: true,
      inheritExportMeta: true,
    });
    expect(hint.ok).toBe(true);
    expect(hint.shiftMerge).toBe(true);
    expect(hint.hint).toContain('Shift merge dry-run');
    expect(hint.hint).toContain('Inherit from export');
    expect(hint.hint).toContain('starred');
    expect(hint.hint).toContain('folder Archive');
  });

  it('dry-run label appends merge hint on Meta+Shift', () => {
    const dry = previewAuditViewsImportDryRun([], JSON.stringify(payload), {
      shiftMerge: true,
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.shiftMerge).toBe(true);
    expect(dry.hint).toContain('Shift merge dry-run');
    expect(dry.label).toContain('Shift merge dry-run');
  });
});

describe('Phase 69 residual pulse on residue deliver', () => {
  it('returns pulse-residue class when continuity has residual', () => {
    const withResidue = continuityResidualDeliverPulseClass({
      residual: { emotion: 'sad', intensity: 0.4 },
    });
    expect(withResidue.ok).toBe(true);
    expect(withResidue.pulseClass).toBe('pulse-residue');
    expect(withResidue.emotion).toBe('sad');

    const clean = continuityResidualDeliverPulseClass({
      emotion: 'happy',
      intensity: 0.8,
      residual: null,
    });
    expect(clean.ok).toBe(false);
    expect(clean.pulseClass).toBeNull();
  });
});

describe('Phase 69 cancel on TTS endpoint select-all', () => {
  it('supports tts_endpoint_select_all_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_select_all_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_select_all_pick');
  });
});

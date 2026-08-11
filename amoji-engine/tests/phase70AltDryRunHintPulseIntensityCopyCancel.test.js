import { describe, expect, it } from 'vitest';
import {
  formatAuditViewsImportDryRunMergeHint,
  previewAuditViewsImportDryRun,
} from '../engine/ui/auditSavedViews.js';
import {
  CONTINUITY_RESIDUAL_PULSE_PEAK,
  continuityResidualDeliverPulseClass,
} from '../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 70 Meta+Alt dry-run replace hint', () => {
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    toastInHashOnly: true,
    views: [{ name: 'Toast view', action: 'share', toastInHashOnly: true }],
  };

  it('replace hint includes Alt replace dry-run and inherit hint', () => {
    const hint = formatAuditViewsImportDryRunMergeHint(JSON.stringify(payload), {
      replace: true,
      altReplace: true,
      inheritExportMeta: true,
    });
    expect(hint.ok).toBe(true);
    expect(hint.altReplace).toBe(true);
    expect(hint.hint).toContain('Alt replace dry-run');
    expect(hint.hint).toContain('toast hash');
  });

  it('dry-run label appends replace hint on Meta+Alt', () => {
    const dry = previewAuditViewsImportDryRun([], JSON.stringify(payload), {
      replace: true,
      altReplace: true,
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.altReplace).toBe(true);
    expect(dry.hint).toContain('Alt replace dry-run');
    expect(dry.label).toContain('Alt replace dry-run');
  });
});

describe('Phase 70 residual pulse intensity by emotion', () => {
  it('scales peak and duration by emotion and intensity', () => {
    const angry = continuityResidualDeliverPulseClass({
      residual: { emotion: 'angry', intensity: 0.5 },
    });
    expect(angry.ok).toBe(true);
    expect(angry.peak).toBeGreaterThan(CONTINUITY_RESIDUAL_PULSE_PEAK.sad);
    expect(angry.durationSec).toBeGreaterThan(0.55);

    const sad = continuityResidualDeliverPulseClass({
      residual: { emotion: 'sad', intensity: 0.5 },
    });
    expect(sad.peak).toBeLessThan(angry.peak);
  });
});

describe('Phase 70 cancel on TTS endpoint copy', () => {
  it('supports tts_endpoint_copy_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_copy_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_copy_pick');
  });
});

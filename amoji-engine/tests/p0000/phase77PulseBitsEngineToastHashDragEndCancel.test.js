import { describe, expect, it } from 'vitest';
import {
  continuityResidualDeliverPulseClass,
  resolveContinuityResidualPulseBits,
} from '../../engine/layers/discretion.js';
import { previewAuditViewsImportDryRun } from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 77 resolveContinuityResidualPulseBits engine helper', () => {
  it('returns combined pulse label bits from deliver pulse', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'fear', intensity: 0.88 },
    });
    const bits = resolveContinuityResidualPulseBits(pulse);
    expect(bits.ok).toBe(true);
    expect(bits.label).toContain('pulse');
    expect(bits.label).toContain('peak');
  });
});

describe('Phase 77 dry-run skip breakdown toast hash', () => {
  it('shows toast hash breakdown on Meta dry-run with toastInHashOnly filter', () => {
    const payload = {
      kind: 'amoji.faceLive.prefsShareAudit.views',
      toastInHashOnly: true,
      views: [
        { name: 'HashView', action: 'export', toastInHashOnly: true },
        { name: 'PlainView', action: 'export', toastInHashOnly: false },
      ],
    };

    const dry = previewAuditViewsImportDryRun([], JSON.stringify(payload), {
      toastInHashOnly: true,
      inheritExportMeta: true,
    });

    expect(dry.ok).toBe(true);
    expect(dry.skipped).toBe(1);
    expect(dry.label).toContain('toast hash 1');
  });
});

describe('Phase 77 cancel on TTS endpoint drag-end', () => {
  it('supports tts_endpoint_drag_end_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_drag_end_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_drag_end_pick');
  });
});

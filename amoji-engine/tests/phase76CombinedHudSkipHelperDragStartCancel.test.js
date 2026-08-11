import { describe, expect, it } from 'vitest';
import {
  formatAuditViewsImportDryRunSkipBreakdown,
} from '../engine/ui/auditSavedViews.js';
import {
  continuityResidualDeliverPulseClass,
  continuityResidualPulseCombinedHud,
} from '../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 76 dry-run skip breakdown helper', () => {
  it('formats parenthetical skip breakdown from counts', () => {
    const breakdown = formatAuditViewsImportDryRunSkipBreakdown({
      skippedByStarredOnly: 2,
      skippedByAppendOnlyClash: 1,
    });
    expect(breakdown.ok).toBe(true);
    expect(breakdown.suffix).toBe(' (starred 2 · name clashes 1)');
    expect(breakdown.label).toBe('starred 2 · name clashes 1');
  });
});

describe('Phase 76 continuity pulse combined HUD', () => {
  it('joins duration and peak labels', () => {
    const pulse = continuityResidualDeliverPulseClass({
      residual: { emotion: 'angry', intensity: 0.95 },
    });
    const combined = continuityResidualPulseCombinedHud(pulse);
    expect(combined.ok).toBe(true);
    expect(combined.label).toContain('pulse');
    expect(combined.label).toContain('peak');
    expect(combined.parts.length).toBe(2);
  });
});

describe('Phase 76 cancel on TTS endpoint drag-start', () => {
  it('supports tts_endpoint_drag_start_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_drag_start_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_drag_start_pick');
  });
});

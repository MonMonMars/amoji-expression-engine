import { describe, expect, it } from 'vitest';
import {
  applyContinuity,
  resetContinuityResidualPeak,
} from '../engine/layers/discretion.js';
import { shouldAutoImportAuditViewsOnDrop } from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 66 Alt-drop replace import', () => {
  it('replace on Alt+drop and merge on Shift+drop only', () => {
    const alt = shouldAutoImportAuditViewsOnDrop({ altKey: true });
    expect(alt.autoImport).toBe(true);
    expect(alt.replace).toBe(true);
    expect(alt.merge).toBe(false);

    const shift = shouldAutoImportAuditViewsOnDrop({ shiftKey: true });
    expect(shift.autoImport).toBe(true);
    expect(shift.replace).toBe(false);
    expect(shift.merge).toBe(true);

    expect(shouldAutoImportAuditViewsOnDrop({}).autoImport).toBe(false);
  });

  it('Alt takes precedence over Shift for replace', () => {
    const both = shouldAutoImportAuditViewsOnDrop({ shiftKey: true, altKey: true });
    expect(both.replace).toBe(true);
    expect(both.merge).toBe(false);
  });
});

describe('Phase 66 residual peak reset on deliver', () => {
  it('resets peak to zero when continuity has no residual', () => {
    const cleared = resetContinuityResidualPeak({ residual: null });
    expect(cleared.peak).toBe(0);
    expect(cleared.hasResidual).toBe(false);
  });

  it('seeds peak from continuity residual on deliver', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.5 },
      personaId: 'companion',
    });
    const reset = resetContinuityResidualPeak(cont);
    expect(reset.hasResidual).toBe(true);
    expect(reset.peak).toBeCloseTo(cont.residual.intensity, 5);
    expect(reset.emotion).toBe('sad');
  });
});

describe('Phase 66 cancel on TTS endpoint Tab blur', () => {
  it('supports tts_endpoint_tab_blur_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_tab_blur_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_tab_blur_pick');
  });
});

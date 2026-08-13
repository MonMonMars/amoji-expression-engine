import { describe, expect, it } from 'vitest';
import {
  exportAuditSavedViewsJson,
  formatAuditViewsImportInheritHint,
} from '../../engine/ui/auditSavedViews.js';
import {
  applyContinuity,
  hasContinuityResidual,
} from '../../engine/layers/discretion.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 62 toast hash import inherit hint', () => {
  it('formats inherited toast hash filter hint from export metadata', () => {
    const payload = exportAuditSavedViewsJson(
      [{ name: 'Toast QR', toastInHashOnly: true, action: 'qr' }],
      { toastInHashOnly: true },
    );
    const hinted = formatAuditViewsImportInheritHint(payload.payload, {
      inheritExportMeta: true,
    });
    expect(hinted.ok).toBe(true);
    expect(hinted.fromExportMeta).toBe(true);
    expect(hinted.inherited).toContain('toast hash');
    expect(hinted.hint).toContain('toast hash');
  });

  it('suppresses inherited toast hash hint when UI override is explicit', () => {
    const payload = exportAuditSavedViewsJson(
      [{ name: 'Toast QR', toastInHashOnly: true, action: 'qr' }],
      { toastInHashOnly: true },
    );
    const hinted = formatAuditViewsImportInheritHint(payload.payload, {
      inheritExportMeta: true,
      toastInHashOnlyExplicit: true,
      toastInHashOnly: false,
    });
    expect(hinted.inherited).not.toContain('toast hash');
  });
});

describe('Phase 62 continuity residual detection', () => {
  it('detects residual above intensity threshold', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.6 },
      personaId: 'companion',
    });
    expect(hasContinuityResidual(cont)).toBe(true);
    expect(hasContinuityResidual({ residual: null })).toBe(false);
    expect(
      hasContinuityResidual({
        residual: { emotion: 'sad', intensity: 0.01 },
      }),
    ).toBe(false);
  });
});

describe('Phase 62 cancel on TTS endpoint blur/input and continuity residual', () => {
  it('supports tts_endpoint_blur_pick, tts_endpoint_input_pick, continuity_residual_pick', () => {
    for (const reason of [
      'tts_endpoint_blur_pick',
      'tts_endpoint_input_pick',
      'continuity_residual_pick',
    ]) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

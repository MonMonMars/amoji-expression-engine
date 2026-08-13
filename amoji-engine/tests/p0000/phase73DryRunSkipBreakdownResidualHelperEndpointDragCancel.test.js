import { describe, expect, it } from 'vitest';
import {
  previewAuditViewsImportDryRun,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 73 Meta dry-run skip breakdown', () => {
  it('appends filtered skip breakdown (e.g. starred-only)', () => {
    const payload = {
      kind: 'amoji.faceLive.prefsShareAudit.views',
      starredOnly: true,
      views: [
        { name: 'A', action: 'export', starred: false },
        { name: 'B', action: 'export', starred: true },
      ],
    };

    const dry = previewAuditViewsImportDryRun(
      [],
      JSON.stringify(payload),
      { inheritExportMeta: true },
    );
    expect(dry.ok).toBe(true);
    expect(dry.label).toContain('skip 1');
    expect(dry.label).toContain('(starred 1)');
    expect(dry.label).toContain('filters starred');
  });
});

describe('Phase 73 cancel on TTS endpoint drag/drop', () => {
  it('supports tts_endpoint_drag_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_drag_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_drag_pick');
  });
});


import { describe, expect, it } from 'vitest';
import { previewAuditViewsImportDryRun } from '../../engine/ui/auditSavedViews.js';

describe('Phase 75 dry-run skip breakdown name clashes', () => {
  it('shows name clashes breakdown on Meta+Ctrl append dry-run', () => {
    const payload = {
      kind: 'amoji.faceLive.prefsShareAudit.views',
      starredOnly: true,
      views: [{ name: 'Same', action: 'export', starred: true }],
    };

    const existing = [
      { id: 'x', name: 'Same', action: 'share', starred: true },
    ];

    const dry = previewAuditViewsImportDryRun(existing, JSON.stringify(payload), {
      appendOnly: true,
      ctrlAppend: true,
      inheritExportMeta: true,
    });

    expect(dry.ok).toBe(true);
    expect(dry.appendOnly).toBe(true);
    expect(dry.skipped).toBe(1);
    expect(dry.label).toContain('name clashes 1');
  });
});


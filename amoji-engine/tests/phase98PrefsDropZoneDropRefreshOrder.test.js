import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 98 prefs dropzone drop refresh order', () => {
  it('calls refreshAuditImportDropZone before refreshAuditImportInheritHint', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropAnchor = "prefsAuditImportViewsDropZone.addEventListener('drop'";
    const dropIdx = src.indexOf(dropAnchor);
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    // Search forward within the drop handler (avoid brittle "first });" slicing).
    const refreshDropZoneIdx = src.indexOf(
      'refreshAuditImportDropZone();',
      dropIdx,
    );
    const refreshInheritIdx = src.indexOf(
      'refreshAuditImportInheritHint();',
      refreshDropZoneIdx,
    );

    expect(refreshDropZoneIdx).toBeGreaterThanOrEqual(0);
    expect(refreshInheritIdx).toBeGreaterThanOrEqual(0);
    expect(refreshDropZoneIdx).toBeLessThan(refreshInheritIdx);
  });
});


import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 99 prefs drop sets preview text before refresh', () => {
  it('sets prefsAuditImportPreviewText before refreshAuditImportDropZone', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropAnchor = "prefsAuditImportViewsDropZone.addEventListener('drop'";
    const dropIdx = src.indexOf(dropAnchor);
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const previewTextIdx = src.indexOf(
      'prefsAuditImportPreviewText = text;',
      dropIdx,
    );
    expect(previewTextIdx).toBeGreaterThanOrEqual(0);

    const refreshDropZoneIdx = src.indexOf(
      'refreshAuditImportDropZone();',
      previewTextIdx,
    );
    expect(refreshDropZoneIdx).toBeGreaterThan(previewTextIdx);
  });
});


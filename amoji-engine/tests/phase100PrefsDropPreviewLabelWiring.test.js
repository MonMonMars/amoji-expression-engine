import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 100 prefs drop preview label wiring', () => {
  it('sets prefsAuditImportPreviewLabel before refreshing dropzone + inherit hint', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropAnchor = "prefsAuditImportViewsDropZone.addEventListener('drop'";
    const dropIdx = src.indexOf(dropAnchor);
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const labelIdx = src.indexOf(
      'prefsAuditImportPreviewLabel = preview.ok ? preview.label : file.name;',
      dropIdx,
    );
    expect(labelIdx).toBeGreaterThanOrEqual(0);

    const refreshDropZoneIdx = src.indexOf(
      'refreshAuditImportDropZone();',
      labelIdx,
    );
    expect(refreshDropZoneIdx).toBeGreaterThanOrEqual(0);

    const refreshInheritIdx = src.indexOf(
      'refreshAuditImportInheritHint();',
      refreshDropZoneIdx,
    );
    expect(refreshInheritIdx).toBeGreaterThanOrEqual(0);

    expect(labelIdx).toBeLessThan(refreshDropZoneIdx);
    expect(refreshDropZoneIdx).toBeLessThan(refreshInheritIdx);
  });
});


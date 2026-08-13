import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 96 prefs dropzone inheritExportMeta wiring', () => {
  it('passes inheritExportMeta: true to previewAuditViewsImportDryRun on drop dry-run', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropIdx = src.indexOf(
      "prefsAuditImportViewsDropZone.addEventListener('drop'",
    );
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const previewIdx = src.indexOf(
      'previewAuditViewsImportDryRun(',
      dropIdx,
    );
    expect(previewIdx).toBeGreaterThan(dropIdx);

    const slice = src.slice(previewIdx, Math.min(src.length, previewIdx + 4000));
    expect(slice).toContain('inheritExportMeta: true');
  });
});


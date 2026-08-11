import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 101 prefs drop summarize inheritExportMeta', () => {
  it('calls summarizeAuditViewsImportPreview with inheritExportMeta: true', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropIdx = src.indexOf(
      "prefsAuditImportViewsDropZone.addEventListener('drop'",
    );
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const summarizeIdx = src.indexOf('summarizeAuditViewsImportPreview(', dropIdx);
    expect(summarizeIdx).toBeGreaterThan(dropIdx);

    const block = src.slice(summarizeIdx, Math.min(src.length, summarizeIdx + 1500));
    expect(block).toContain('inheritExportMeta: true');
  });
});


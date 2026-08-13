import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 94 prefs dropzone dragover sets copy dropEffect', () => {
  it('sets ev.dataTransfer.dropEffect = copy on dragover', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("prefsAuditImportViewsDropZone.addEventListener('dragover'");
    expect(src).toContain('ev.preventDefault();');
    expect(src).toContain("ev.dataTransfer.dropEffect = 'copy';");
  });
});


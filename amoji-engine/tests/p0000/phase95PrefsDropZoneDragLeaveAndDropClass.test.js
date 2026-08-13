import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 95 prefs dropzone dragleave/drop class management', () => {
  it('removes dragover class on dragleave and on drop', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragLeaveIdx = src.indexOf(
      "prefsAuditImportViewsDropZone.addEventListener('dragleave'",
    );
    expect(dragLeaveIdx).toBeGreaterThanOrEqual(0);
    const dragLeaveBlock = src.slice(dragLeaveIdx, src.indexOf('});', dragLeaveIdx));
    expect(dragLeaveBlock).toContain(
      "prefsAuditImportViewsDropZone.classList.remove('dragover')",
    );

    const dropIdx = src.indexOf(
      "prefsAuditImportViewsDropZone.addEventListener('drop'",
    );
    expect(dropIdx).toBeGreaterThanOrEqual(0);
    const dropBlock = src.slice(dropIdx, src.indexOf('});', dropIdx));
    expect(dropBlock).toContain('ev.preventDefault();');
    expect(dropBlock).toContain(
      "prefsAuditImportViewsDropZone.classList.remove('dragover')",
    );
  });
});


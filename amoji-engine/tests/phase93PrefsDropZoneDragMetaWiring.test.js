import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 93 prefs audit import dropzone drag/meta wiring', () => {
  it('prevents default on dragover + dragenter, and passes metaKey on drop', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragOverAnchor = "prefsAuditImportViewsDropZone.addEventListener('dragover'";
    const dragEnterAnchor =
      "prefsAuditImportViewsDropZone.addEventListener('dragenter'";
    const dropAnchor = "prefsAuditImportViewsDropZone.addEventListener('drop'";

    expect(src).toContain(dragOverAnchor);
    expect(src).toContain(dragEnterAnchor);
    expect(src).toContain(dropAnchor);

    // dragover
    const dragOverIdx = src.indexOf(dragOverAnchor);
    const dragEnterIdx = src.indexOf(dragEnterAnchor, dragOverIdx);
    const dragOverBlock = src.slice(dragOverIdx, dragEnterIdx);
    expect(dragOverBlock).toContain('ev.preventDefault();');

    // dragenter
    const dragEnterNextIdx = src.indexOf("prefsAuditImportViewsDropZone.addEventListener('dragleave'", dragEnterIdx);
    const dragEnterBlock =
      dragEnterNextIdx > dragEnterIdx ? src.slice(dragEnterIdx, dragEnterNextIdx) : src.slice(dragEnterIdx);
    expect(dragEnterBlock).toContain('ev.preventDefault();');
    expect(dragEnterBlock).toContain(
      "prefsAuditImportViewsDropZone.classList.add('dragover')",
    );

    // drop wiring
    const dropIdx = src.indexOf(dropAnchor);
    const shouldAutoImportIdx = src.indexOf('shouldAutoImportAuditViewsOnDrop', dropIdx);
    expect(shouldAutoImportIdx).toBeGreaterThan(dropIdx);
    const dropBlock = src.slice(dropIdx, shouldAutoImportIdx + 4000);
    expect(dropBlock).toContain('metaKey: ev.metaKey');
  });
});


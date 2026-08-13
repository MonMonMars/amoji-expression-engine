import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 97 prefs dropzone modifier wiring', () => {
  it('passes shift/alt/ctrl/meta keys into shouldAutoImportAuditViewsOnDrop', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropAnchor = "prefsAuditImportViewsDropZone.addEventListener('drop'";
    const dropIdx = src.indexOf(dropAnchor);
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const shouldAnchor = 'shouldAutoImportAuditViewsOnDrop({';
    const shouldIdx = src.indexOf(shouldAnchor, dropIdx);
    expect(shouldIdx).toBeGreaterThan(dropIdx);

    const block = src.slice(shouldIdx, Math.min(src.length, shouldIdx + 2500));
    expect(block).toContain('shiftKey: ev.shiftKey');
    expect(block).toContain('altKey: ev.altKey');
    expect(block).toContain('ctrlKey: ev.ctrlKey');
    expect(block).toContain('metaKey: ev.metaKey');
  });
});


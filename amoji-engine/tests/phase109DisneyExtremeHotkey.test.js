import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 109 Disney Extreme hotkey X', () => {
  it('resolves plain x/X and ignores typing/modifiers', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'x' })).toEqual({
      ok: true,
      action: 'toggle',
    });
    expect(resolveDisneyExtremeHotkey({ key: 'X' }).ok).toBe(true);
    expect(resolveDisneyExtremeHotkey({ key: 'x', ctrlKey: true }).ok).toBe(
      false,
    );
    expect(
      resolveDisneyExtremeHotkey(
        { key: 'x', target: { tagName: 'INPUT' } },
      ).reason,
    ).toBe('typing');
    expect(resolveDisneyExtremeHotkey({ key: '`' }).action).toBe(
      'showBaselineStacksCapacity',
    );
    expect(resolveDisneyExtremeHotkey({ key: '\\' }).ok).toBe(false);
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires X hotkey to master toggle', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('resolveDisneyExtremeHotkey');
    expect(src).toContain("disneyExtremeEl.checked = !disneyExtremeEl.checked");
    expect(src).toContain("disneyExtremeEl.dispatchEvent(new Event('change'))");
    expect(src).toContain('<kbd>X</kbd>');
  });
});

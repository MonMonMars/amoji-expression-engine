import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 116 Extreme B body-apply toggle', () => {
  it('resolves B as toggleBodyApply and documents it in help', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'b' })).toEqual({
      ok: true,
      action: 'toggleBodyApply',
    });
    expect(resolveDisneyExtremeHotkey({ key: 'B' }).action).toBe(
      'toggleBodyApply',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'b', ctrlKey: true }).ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('B body');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('- = body×');
  });

  it('Face Live wires B to body apply (enables Extreme if needed)', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'toggleBodyApply'");
    expect(src).toContain('disneyExtremeBodyEl.checked = !disneyExtremeBodyEl.checked');
    expect(src).toContain('<kbd>B</kbd>');
    expect(src).toContain('Apply to body/head <kbd>B</kbd>');
  });
});

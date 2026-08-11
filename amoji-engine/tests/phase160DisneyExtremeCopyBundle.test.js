import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 160 Extreme Shift+A copy bundle', () => {
  it('resolves Shift+A to copyBundle', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'a' }).action).toBe('showBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'A', shiftKey: true }).action,
    ).toBe('copyBundle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+A copy all');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires copy bundle button + hotkey', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyBundle"');
    expect(src).toContain('async function copyDisneyExtremeBundle()');
    expect(src).toContain("resolved.action === 'copyBundle'");
    expect(src).toContain('<kbd>⇧A</kbd>');
  });
});

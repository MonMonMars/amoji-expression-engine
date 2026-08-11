import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 165 Extreme J copy snapshot JSON', () => {
  it('resolves J to copySnapshotJson', () => {
    expect(matchDisneyExtremeHotkey('J')?.entry.id).toBe('copySnapshotJson');
    expect(resolveDisneyExtremeHotkey({ key: 'j' }).action).toBe(
      'copySnapshotJson',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('J json');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires JSON copy button + hotkey', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyJson"');
    expect(src).toContain('async function copyDisneyExtremeSnapshotJson()');
    expect(src).toContain("resolved.action === 'copySnapshotJson'");
    expect(src).toContain('serializeDisneyExtremeSnapshot');
    expect(src).toContain('copied · snapshot JSON');
    expect(src).toContain('<kbd>J</kbd>');
  });
});

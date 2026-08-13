import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 83 TTS dragover side effects', () => {
  it('calls persistPrefs and syncGatewayHealthPoll on dragover', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("addEventListener('dragover'");
    expect(src).toContain('persistPrefs();');
    expect(src).toContain('syncGatewayHealthPoll();');
  });
});


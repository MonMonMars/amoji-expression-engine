import { describe, expect, it } from 'vitest';
import {
  HUMAN_HEAD_REFS,
  getHumanHeadRef,
  remapRocketboxTextureUrl,
} from '../engine/layers/humanHeadCatalog.js';

describe('humanHeadCatalog', () => {
  it('lists sakura plus OSS face/head refs', () => {
    const ids = HUMAN_HEAD_REFS.map((h) => h.id);
    expect(ids).toContain('sakura');
    expect(ids).toContain('facecap');
    expect(ids).toContain('valid-asian-f1');
    expect(ids).toContain('rocketbox-f01-facial');
    expect(ids).toContain('rocketbox-f01-body');
    expect(ids).toContain('quaternius-mannequin-f');
    expect(ids).toContain('mpfb-fullbody');
    expect(ids).toContain('robot-expressive');
    expect(ids).toContain('xbot');
  });

  it('getHumanHeadRef falls back to sakura', () => {
    expect(getHumanHeadRef('nope').id).toBe('sakura');
    expect(getHumanHeadRef('valid-asian-f1').arkit52).toBe(true);
    expect(getHumanHeadRef('rocketbox-f01-facial').arkit52).toBe(true);
  });

  it('remaps Rocketbox TGA paths to in-repo PNGs', () => {
    const u = remapRocketboxTextureUrl(
      '..\\temp\\Humans\\with_opacity_version\\f001\\textures\\f001_head_color.tga',
    );
    expect(u).toMatch(/f001_head_color\.png$/);
    expect(u).toContain('/assets/reference/human-head/rocketbox/');
  });
});

import { describe, expect, it } from 'vitest';
import {
  TEX_LODS,
  texturePackUrls,
  classifyMaterial,
} from '../engine/layers/textureLod.js';

describe('textureLod', () => {
  it('lists three tex tiers', () => {
    expect(TEX_LODS).toEqual(['hi', 'mid', 'lo']);
  });

  it('builds pack urls under character root', () => {
    const u = texturePackUrls('/assets/characters/jp-female-v0', 'mid');
    expect(u.albedo).toBe('/assets/characters/jp-female-v0/lod/textures/mid/albedo.png');
    expect(u.sclera).toContain('/mid/sclera.png');
  });

  it('classifies MB-Lab material names', () => {
    expect(classifyMaterial('AmojiSakura_realistic_MBLab_skin3')).toBe('skin');
    expect(classifyMaterial('AmojiSakura_realistic_MBlab_eyelash')).toBe('eyelash');
    expect(classifyMaterial('AmojiSakura_realistic_MBlab_human_eyes')).toBe('sclera');
    expect(classifyMaterial('AmojiSakura_realistic_MBlab_human_teeth')).toBe('teeth');
    expect(classifyMaterial('cornea')).toBeNull();
  });
});

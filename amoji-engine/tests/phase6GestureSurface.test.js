import { describe, expect, it } from 'vitest';
import {
  resolveGestureLayer,
  sampleGesturePose,
  GestureController,
  GESTURE_EMBLEMS,
  GESTURE_PRIORITY,
  GAP_SEC_FOR_ADAPTOR,
  emblemSpeedBias,
  pickAdaptor,
} from '../engine/layers/gesture.js';
import {
  SURFACE_LEVEL_IDS,
  getSurfaceLevel,
  renderSurface,
  renderGlow,
  meshTexHintsForLevel,
  uncannyRiskTone,
} from '../engine/layers/surfaceRenderer.js';

describe('Layer G gesture stack', () => {
  it('ships Emblem→Adaptor priority order', () => {
    expect(GESTURE_PRIORITY).toEqual([
      'emblem',
      'illustrator',
      'regulator',
      'affect',
      'adaptor',
    ]);
    expect(Object.keys(GESTURE_EMBLEMS).length).toBeGreaterThanOrEqual(5);
  });

  it('Emblem is LOCKED and beats affect', () => {
    const g = resolveGestureLayer({
      emblem: 'wave',
      emotion: 'angry',
      intensity: 1,
      speaking: true,
    });
    expect(g.layer).toBe('emblem');
    expect(g.lock).toBe('LOCKED');
    expect(g.poseId).toBe('wave');
  });

  it('happy Emblem waves faster than sad', () => {
    expect(emblemSpeedBias('happy')).toBeGreaterThan(emblemSpeedBias('sad'));
  });

  it('Illustrator is CLAMPED — angry sharper than happy', () => {
    const angry = resolveGestureLayer({
      speaking: true,
      speechStress: 0.8,
      emotion: 'angry',
      intensity: 1,
    });
    const happy = resolveGestureLayer({
      speaking: true,
      speechStress: 0.8,
      emotion: 'happy',
      intensity: 1,
    });
    expect(angry.layer).toBe('illustrator');
    expect(angry.lock).toBe('CLAMPED');
    expect(angry.amplitude).toBeGreaterThan(happy.amplitude);
  });

  it('Regulator waiting beats affect', () => {
    const g = resolveGestureLayer({
      turnState: 'waiting',
      emotion: 'fear',
      intensity: 1,
    });
    expect(g.layer).toBe('regulator');
    expect(g.lock).toBe('CLAMPED');
  });

  it('Affect drives fear arms-cross when nothing higher', () => {
    const g = resolveGestureLayer({ emotion: 'fear', intensity: 1, gapSec: 0 });
    expect(g.layer).toBe('affect');
    expect(g.poseId).toBe('armsCrossChest');
  });

  it('Adaptor only after gap', () => {
    const early = resolveGestureLayer({
      emotion: 'neutral',
      intensity: 0.1,
      gapSec: 0.5,
      mood: 'embarrassed',
    });
    expect(early.layer).toBe('rest');

    const late = resolveGestureLayer({
      emotion: 'neutral',
      intensity: 0.1,
      gapSec: GAP_SEC_FOR_ADAPTOR + 0.5,
      mood: 'embarrassed',
      anxiety: 0.4,
    });
    expect(late.layer).toBe('adaptor');
    expect(['hairPlay', 'napeTouch', 'fidgetFingers']).toContain(late.id);
  });

  it('pickAdaptor prefers latency adaptor id', () => {
    expect(pickAdaptor('thinking', { preferred: 'chinTouch' })).toBe('chinTouch');
  });

  it('GestureController auto-clears emblem and opens adaptor gap', () => {
    const gc = new GestureController();
    gc.playEmblem('ok');
    let s = gc.tick(0.05, { emotion: 'happy', intensity: 0.8 });
    expect(s.layer).toBe('emblem');
    // expire emblem
    s = gc.tick(2.5, { emotion: 'happy', intensity: 0.8 });
    expect(gc.emblem).toBeNull();
    // accumulate gap with low affect (neutral low intensity)
    for (let i = 0; i < 40; i++) {
      s = gc.tick(0.2, { emotion: 'neutral', intensity: 0.05, mood: 'thinking' });
    }
    expect(s.gapSec).toBeGreaterThanOrEqual(GAP_SEC_FOR_ADAPTOR);
    expect(s.layer).toBe('adaptor');
  });

  it('sampleGesturePose adds wave phase and compliance meta', () => {
    const resolved = resolveGestureLayer({ emblem: 'wave', emotion: 'happy', intensity: 1 });
    const a = sampleGesturePose(resolved, 0);
    const b = sampleGesturePose(resolved, 0.3);
    expect(a.meta?.compliance).toBe('passed');
    expect(a.bones.hand_R).toBeTruthy();
    expect(a.bones.hand_R[1]).not.toBe(b.bones.hand_R[1]);
  });
});

describe('Surface Renderer levels', () => {
  it('defines levels 1–10', () => {
    expect(SURFACE_LEVEL_IDS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(getSurfaceLevel(8)?.uncannyRisk).toBe('peak');
    expect(getSurfaceLevel(1)?.supportsMorphs).toBe(false);
  });

  it('Level 1 glow maps intensity→brightness and valence→color', () => {
    const happy = renderGlow({ emotion: 'happy', intensity: 1 });
    const sad = renderGlow({ emotion: 'sad', intensity: 1 });
    expect(happy.brightness).toBeGreaterThan(0.7);
    expect(happy.color.h).not.toBe(sad.color.h);
    const blinked = renderGlow({ emotion: 'happy', intensity: 1, blink: 1 });
    expect(blinked.brightness).toBeLessThan(happy.brightness);
  });

  it('renderSurface returns mode per level with compliance', () => {
    const g1 = renderSurface(1, { emotion: 'angry', intensity: 0.8 });
    expect(g1.surface.mode).toBe('glow');
    expect(g1.meta?.compliance).toBe('passed');

    const g2 = renderSurface(2, { emotion: 'happy', intensity: 0.7 });
    expect(g2.surface.mode).toBe('pixel');
    expect(g2.surface.mouthCurve).toBeGreaterThan(0);

    const g6 = renderSurface(6, { emotion: 'happy', intensity: 0.7 });
    expect(g6.surface.mode).toBe('mesh');
    expect(g6.surface.meshHint).toBe('hi');
  });

  it('meshTexHintsForLevel maps Capcom-style packs', () => {
    expect(meshTexHintsForLevel(5)).toEqual({ meshHint: 'lo', texHint: 'lo' });
    expect(meshTexHintsForLevel(9).texHint).toBe('hi');
  });

  it('uncannyRiskTone flags peak', () => {
    expect(uncannyRiskTone('peak')).toBe('bad');
    expect(uncannyRiskTone('none')).toBe('ok');
  });
});

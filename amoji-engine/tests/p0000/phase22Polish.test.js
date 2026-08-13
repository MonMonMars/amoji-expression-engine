import { describe, expect, it } from 'vitest';
import {
  chinTouchThinkingCue,
  napeTouchAnxietyCue,
  openPalmHonestyCue,
  applyEasterEggCue,
  mergeEasterEggCues,
  listEasterEggs,
} from '../../engine/easterEggs/index.js';
import {
  listChassis,
  listChassisByProductLine,
  listChassisVariants,
  getChassis,
} from '../../engine/export/chassisCalibrate.js';
import { driveRobot } from '../../engine/export/robotDriver.js';
import { assertLiveLinkFrameShape, soakPublisher } from '../../engine/export/liveLinkSoak.js';

describe('Phase 22 easter staging eggs', () => {
  it('catalog includes chin / nape / palm myths', () => {
    const ids = listEasterEggs('companion').map((e) => e.id);
    expect(ids).toContain('chinTouchThinking');
    expect(ids).toContain('napeTouchAnxietyTell');
    expect(ids).toContain('openPalmHonesty');
  });

  it('helpers resolve adaptor / look staging cues', () => {
    expect(chinTouchThinkingCue({ personaId: 'companion', enabled: true }).behavior.adaptor).toBe(
      'chinTouch',
    );
    expect(napeTouchAnxietyCue({ personaId: 'home', enabled: true }).behavior.adaptor).toBe(
      'napeTouch',
    );
    const palm = openPalmHonestyCue({ personaId: 'companion', enabled: true });
    expect(palm.behavior.pose).toBe('rest');
    expect(palm.behavior.lookY).toBeGreaterThan(0);
  });

  it('merge applies nape look when enabled', () => {
    const merged = mergeEasterEggCues(
      [{ eggId: 'napeTouchAnxietyTell', behaviorKey: 'stage_nervous', enabled: true }],
      { personaId: 'companion' },
    );
    expect(merged.active).toContain('napeTouchAnxietyTell');
    expect(merged.adaptor).toBe('napeTouch');
    expect(merged.lookX).toBeGreaterThan(0);
  });

  it('locked for education persona', () => {
    const cue = applyEasterEggCue('chinTouchThinking', 'stage_think', {
      personaId: 'education',
      enabled: true,
    });
    expect(cue.applied).toBe(false);
    expect(cue.lockedOff).toBe(true);
  });
});

describe('Phase 22 chassis SKUs', () => {
  it('lists quiet desktop + demo humanoid variants', () => {
    const ids = listChassis().map((c) => c.id);
    expect(ids).toContain('desktop-buddy-quiet');
    expect(ids).toContain('lab-humanoid-demo');
    expect(getChassis('desktop-buddy-quiet').variantOf).toBe('desktop-buddy');
    expect(getChassis('lab-humanoid-demo').variantOf).toBe('lab-humanoid');
  });

  it('product-line and variant helpers', () => {
    const toys = listChassisByProductLine('toy-robot');
    expect(toys.some((c) => c.id === 'desktop-buddy-quiet')).toBe(true);
    const desk = listChassisVariants('desktop-buddy');
    expect(desk.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        'desktop-buddy',
        'desktop-buddy-expressive',
        'desktop-buddy-quiet',
      ]),
    );
  });

  it('quiet damps mouth vs base; demo boosts expression vs lab', () => {
    const base = getChassis('desktop-buddy');
    const quiet = getChassis('desktop-buddy-quiet');
    expect(quiet.gains.mouth).toBeLessThan(base.gains.mouth);
    const lab = getChassis('lab-humanoid');
    const demo = getChassis('lab-humanoid-demo');
    expect(demo.gains.expression).toBeGreaterThan(lab.gains.expression);
  });

  it('driveRobot accepts new SKUs', () => {
    const quiet = driveRobot('face-servo-12', {
      emotion: 'happy',
      intensity: 0.7,
      chassisId: 'desktop-buddy-quiet',
    });
    expect(quiet.chassisId).toBe('desktop-buddy-quiet');
    const demo = driveRobot('humanoid-stub', {
      emotion: 'happy',
      intensity: 0.7,
      chassisId: 'lab-humanoid-demo',
    });
    expect(demo.packId).toBe('humanoid-stub');
    expect(demo.chassisId).toBe('lab-humanoid-demo');
  });
});

describe('Phase 22 Live Link soak contract', () => {
  it('memory soak produces valid ARKit frames for Mac consumer', () => {
    const out = soakPublisher({ durationSec: 0.2, fps: 30 });
    expect(out.ok).toBe(true);
    expect(assertLiveLinkFrameShape(out.lastFrame)).toBe(true);
    expect(out.lastFrame.blendShapes.jawOpen).toBeGreaterThanOrEqual(0);
  });
});

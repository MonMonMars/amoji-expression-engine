import { describe, expect, it } from 'vitest';
import {
  applyEasterEggCue,
  mergeEasterEggCues,
  noseTouchCue,
  gazeAversionCue,
  crossedArmsCue,
  nlpGazeCue,
  personaAllowsEasterEggs,
} from '../../engine/easterEggs/index.js';

describe('applyEasterEggCue', () => {
  it('returns look deltas for NLP when enabled', () => {
    const cue = applyEasterEggCue('nlpGazeConvention', 'constructing_or_evasive', {
      personaId: 'companion',
      enabled: true,
    });
    expect(cue.applied).toBe(true);
    expect(cue.lookX).toBeGreaterThan(0);
    expect(cue.scientific).toBe(false);
  });

  it('stays off when locked for corporate', () => {
    expect(personaAllowsEasterEggs('corporate')).toBe(false);
    const cue = applyEasterEggCue('nlpGazeConvention', 'recalling_memory', {
      personaId: 'corporate',
      enabled: true,
    });
    expect(cue.applied).toBe(false);
    expect(cue.lockedOff).toBe(true);
  });

  it('maps adaptor / gaze / pose myths', () => {
    expect(noseTouchCue({ personaId: 'companion', enabled: true }).behavior.adaptor).toBe(
      'fingerTap',
    );
    expect(gazeAversionCue({ personaId: 'home', enabled: true }).behavior.gaze).toBe('avoid');
    expect(crossedArmsCue({ personaId: 'companion', enabled: true }).behavior.pose).toBe(
      'armsCrossChest',
    );
  });

  it('ui-only microexpression egg does not apply runtime cue', () => {
    const cue = applyEasterEggCue('microexpressionLieSpotter', 'ui_only', {
      personaId: 'companion',
      enabled: true,
    });
    expect(cue.enabled).toBe(true);
    expect(cue.applied).toBe(false);
  });
});

describe('mergeEasterEggCues', () => {
  it('merges multiple staging cues', () => {
    const merged = mergeEasterEggCues(
      [
        { eggId: 'nlpGazeConvention', behaviorKey: 'recalling_memory', enabled: true },
        { eggId: 'noseTouchTell', behaviorKey: 'perform_tell', enabled: true },
        { eggId: 'crossedArmsClosed', behaviorKey: 'stage_cross', enabled: true },
      ],
      { personaId: 'companion' },
    );
    expect(merged.active).toContain('nlpGazeConvention');
    expect(merged.active).toContain('noseTouchTell');
    expect(merged.lookX).toBeLessThan(0);
    expect(merged.adaptor).toBe('fingerTap');
    expect(merged.pose).toBe('armsCrossChest');
  });
});

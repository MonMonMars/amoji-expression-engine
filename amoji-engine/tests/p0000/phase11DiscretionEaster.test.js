import { describe, expect, it } from 'vitest';
import {
  personalityProfile,
  applyContinuity,
  passiveMoodLeak,
  canImprovise,
  discretionaryImprovise,
  DiscretionController,
} from '../../engine/layers/discretion.js';
import {
  EASTER_EGG_DISCLAIMER,
  listEasterEggs,
  resolveEasterEgg,
  nlpGazeCue,
  personaAllowsEasterEggs,
} from '../../engine/easterEggs/index.js';
import { performScript } from '../../engine/layers/scriptLine.js';

describe('Layer D Actor Discretion', () => {
  it('personality profiles differ by persona', () => {
    const c = personalityProfile('companion');
    const corp = personalityProfile('corporate');
    expect(c.assertiveness).toBeGreaterThan(corp.assertiveness);
    expect(c.playfulness).toBeGreaterThan(corp.playfulness);
    expect(corp.easterEggsAllowed).toBe(false);
  });

  it('continuity blends previous unless Step-Out', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.9 },
      personaId: 'companion',
    });
    expect(cont.residual?.emotion).toBe('sad');
    expect(cont.residual?.intensity).toBeGreaterThan(0);
    expect(cont.steppedOut).toBe(false);

    const cleared = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.9 },
      stepOutBefore: true,
    });
    expect(cleared.residual).toBeNull();
    expect(cleared.steppedOut).toBe(true);
  });

  it('passive mood leak returns morphs', () => {
    const leak = passiveMoodLeak('embarrassed', 0.4);
    expect(Object.keys(leak.morphs).length).toBeGreaterThan(0);
  });

  it('improv blocked when script pending', () => {
    expect(
      canImprovise({ scriptPending: true, gapSec: 5, personaId: 'companion' }),
    ).toBe(false);
    const blocked = discretionaryImprovise({
      stimulus: 'noise',
      scriptPending: true,
      gapSec: 5,
      personaId: 'companion',
    });
    expect(blocked.blocked).toBe(true);
    expect(blocked.reason).toBe('script_pending_has_priority');
  });

  it('improv fills gaps and is personality-capped', () => {
    const loud = discretionaryImprovise({
      stimulus: 'interrupt',
      gapSec: 3,
      personaId: 'companion',
    });
    const quiet = discretionaryImprovise({
      stimulus: 'interrupt',
      gapSec: 3,
      personaId: 'corporate',
    });
    expect(loud.blocked).toBe(false);
    expect(quiet.blocked).toBe(false);
    expect(loud.intensity).toBeGreaterThanOrEqual(quiet.intensity);
  });

  it('DiscretionController continuity across lines + improv cooldown', () => {
    const d = new DiscretionController({ personaId: 'companion' });
    const a = d.ingestLine({ emotion: 'sad', intensity: 0.7 });
    expect(a.residual).toBeNull();
    const b = d.ingestLine({ emotion: 'happy', intensity: 0.6 });
    expect(b.residual?.emotion).toBe('sad');

    d.markScriptPending(true);
    expect(d.tryImprovise('noise').blocked).toBe(true);
    d.markScriptPending(false);
    d.tick(2, { mood: 'anxious' });
    const r = d.tryImprovise('noise', { mood: 'anxious' });
    expect(r.blocked).toBe(false);
    expect(d.tryImprovise('noise').blocked).toBe(true); // cooldown
  });

  it('performScript attaches continuity from previousLine', () => {
    const perf = performScript(
      {
        text: 'hi',
        dialogue_emotion: { primary: 'happy', intensity: 0.7 },
        directions: { gaze: 'lock' },
      },
      { previousLine: { emotion: 'angry', intensity: 0.8 } },
    );
    expect(perf.continuity.residual?.emotion).toBe('angry');
  });
});

describe('easter eggs namespace', () => {
  it('ships disclaimer and defaults off', () => {
    expect(EASTER_EGG_DISCLAIMER).toMatch(/NOT scientific/i);
    const list = listEasterEggs('companion');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.every((e) => e.enabled === false)).toBe(true);
  });

  it('locks off for corporate/care/education', () => {
    expect(personaAllowsEasterEggs('corporate')).toBe(false);
    expect(personaAllowsEasterEggs('care')).toBe(false);
    expect(personaAllowsEasterEggs('education')).toBe(false);
    expect(personaAllowsEasterEggs('companion')).toBe(true);
    const locked = listEasterEggs('corporate', { nlpGazeConvention: true });
    expect(locked.find((e) => e.id === 'nlpGazeConvention')?.enabled).toBe(false);
    expect(locked.find((e) => e.id === 'nlpGazeConvention')?.lockedOff).toBe(true);
  });

  it('nlpGazeCue only when explicitly enabled on allowed persona', () => {
    const off = nlpGazeCue('recalling_memory', { personaId: 'companion' });
    expect(off.enabled).toBe(false);
    const on = nlpGazeCue('recalling_memory', {
      personaId: 'companion',
      enabled: true,
    });
    expect(on.enabled).toBe(true);
    expect(on.scientific).toBe(false);
    expect(on.behavior.lookX).toBeLessThan(0);
    expect(on.disclaimer).toBeTruthy();
  });

  it('resolveEasterEgg unknown is safe', () => {
    const u = resolveEasterEgg('not_real', 'x');
    expect(u.error).toBe('unknown_egg');
  });
});

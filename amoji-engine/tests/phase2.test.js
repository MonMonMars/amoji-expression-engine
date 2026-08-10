import { describe, expect, it } from 'vitest';
import {
  applyMusclePerimeter,
  getMusclePerimeterCap,
} from '../engine/layers/musclePerimeter.js';
import { charToViseme, textToVisemeSequence } from '../engine/layers/viseme.js';
import { resolveMouth } from '../engine/layers/resolveMouth.js';
import { evaluateEmotion } from '../engine/layers/emotionFormulas.js';
import { performSpeech } from '../engine/layers/performSpeech.js';
import muscles from '../data/muscles/m1-m21.json';
import visemes from '../data/visemes/preston-blair-10.json';

describe('muscle catalog', () => {
  it('defines M1–M21', () => {
    expect(muscles).toHaveLength(21);
    expect(muscles[0].id).toBe('M1');
    expect(muscles[20].id).toBe('M21');
  });
});

describe('muscle perimeter selective narrowing (blaming)', () => {
  it('M1 frontalis cap is lower for blaming than sad', () => {
    expect(getMusclePerimeterCap('M1', 'blaming')).toBeLessThan(
      getMusclePerimeterCap('M1', 'sad'),
    );
  });

  it('M13 levator anguli stays relatively high for blaming', () => {
    const m13Blaming = getMusclePerimeterCap('M13', 'blaming');
    expect(m13Blaming).toBeGreaterThan(getMusclePerimeterCap('M13', 'happy'));
    expect(m13Blaming).toBeGreaterThan(getMusclePerimeterCap('M13', 'sad'));
    expect(m13Blaming).toBeGreaterThan(getMusclePerimeterCap('M1', 'blaming'));
  });

  it('applyMusclePerimeter clamps to cap', () => {
    expect(applyMusclePerimeter(1.0, 'M1', 'blaming')).toBe(0.15);
    expect(applyMusclePerimeter(0.1, 'M1', 'blaming')).toBe(0.1);
  });
});

describe('viseme mapping', () => {
  it('maps bilabials to MBP', () => {
    expect(charToViseme('m')).toBe('MBP');
    expect(charToViseme('B')).toBe('MBP');
    expect(charToViseme('p')).toBe('MBP');
  });

  it('maps vowels and rest', () => {
    expect(charToViseme('a')).toBe('AI');
    expect(charToViseme('o')).toBe('O');
    expect(charToViseme(' ')).toBe('REST');
  });

  it('has 9 named Preston Blair entries (AI E O U FV L MBP CONS REST)', () => {
    expect(Object.keys(visemes.visemes).sort()).toEqual(
      ['AI', 'CONS', 'E', 'FV', 'L', 'MBP', 'O', 'REST', 'U'].sort(),
    );
  });
});

describe('resolveMouth override architecture', () => {
  it('MBP + happy t=1 locks jaw to 0 (no emotion leakage)', () => {
    const happy = evaluateEmotion('happy', 1).params;
    const mouth = resolveMouth('MBP', happy, 1);
    expect(mouth.jaw).toBe(0);
    expect(mouth.states.jaw).toBe('LOCKED');
    expect(mouth.states.width).toBe('LOCKED');
  });

  it('AI + angry keeps corner OPEN so anger mouth corners can show', () => {
    const angry = evaluateEmotion('angry', 1).params;
    const mouth = resolveMouth('AI', angry, 1);
    expect(mouth.states.corner).toBe('OPEN');
    // angry corners trend downward (negative channel)
    expect(mouth.corner).toBeLessThanOrEqual(0);
  });

  it('O width stays LOCKED against happy wide smile', () => {
    const happy = evaluateEmotion('happy', 1).params;
    const mouth = resolveMouth('O', happy, 1);
    expect(mouth.states.width).toBe('LOCKED');
    expect(mouth.width).toBe(0.75);
  });
});

describe('speech integration (upper/lower face separation)', () => {
  it('mama papa with happy keeps MBP frames fully closed', () => {
    const perf = performSpeech('mama papa', 'happy', 1);
    const mbpFrames = perf.frames.filter((f) => f.meta?.viseme === 'MBP');
    expect(mbpFrames.length).toBeGreaterThan(0);
    for (const f of mbpFrames) {
      expect(f.meta.mouth.jaw).toBe(0);
      expect(f.params.jawOpen).toBe(0);
    }
  });

  it('upper face (brows/eyes) stays emotion-driven across visemes', () => {
    const emotionOnly = evaluateEmotion('happy', 1).params;
    const perf = performSpeech('mama', 'happy', 1);
    for (const f of perf.frames) {
      expect(f.params['EY-L-LOW']).toEqual(emotionOnly['EY-L-LOW']);
      expect(f.params['CH-L']).toEqual(emotionOnly['CH-L']);
      expect(f.params['EB-L2']).toEqual(emotionOnly['EB-L2']);
      expect(f.meta.upperFaceFrom).toBe('emotion');
      expect(f.meta.compliance).toBe('passed');
    }
  });

  it('textToVisemeSequence length matches input', () => {
    expect(textToVisemeSequence('aa').map((x) => x.viseme)).toEqual(['AI', 'AI']);
    expect(textToVisemeSequence('hi').map((x) => x.viseme)).toEqual(['CONS', 'AI']);
  });
});

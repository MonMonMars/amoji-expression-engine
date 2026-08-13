import { describe, expect, it } from 'vitest';
import {
  DiscretionController,
  canImprovise,
} from '../../engine/layers/discretion.js';
import { SpeechPlayer } from '../../engine/tts/speechPlayer.js';
import { synthesizeTimingToneWav } from '../../engine/tts/demoAudio.js';

describe('Layer D UX depth', () => {
  it('exposes gap progress and minGapSec', () => {
    const d = new DiscretionController({ personaId: 'corporate' });
    d.tick(0.1);
    const s = d.tick(0.2);
    expect(s.minGapSec).toBeGreaterThan(0.5);
    expect(s.gapProgress).toBeGreaterThan(0);
    expect(s.gapProgress).toBeLessThan(1);
  });

  it('clearContinuity wipes residue', () => {
    const d = new DiscretionController({ personaId: 'companion' });
    d.ingestLine({ emotion: 'sad', intensity: 0.8 });
    d.ingestLine({ emotion: 'happy', intensity: 0.5 });
    expect(d.lastContinuity.residual).toBeTruthy();
    d.clearContinuity();
    expect(d.previous).toBeNull();
    const next = d.ingestLine({ emotion: 'angry', intensity: 0.6 });
    expect(next.residual).toBeNull();
  });

  it('autoImprovise fires once gap is ready', () => {
    const d = new DiscretionController({
      personaId: 'companion',
      autoImprovise: true,
      autoStimulus: 'noise',
    });
    d.tick(d.minGapSec() + 0.2, { mood: 'anxious' });
    // first tick after gap may fire inside tick
    const s = d.tick(0.05, { mood: 'anxious' });
    // either this tick or previous should have produced lastImprov
    expect(d.lastImprov || s.autoReaction).toBeTruthy();
    expect(d.improvCool).toBeGreaterThan(0);
  });

  it('script hold blocks canImprovise', () => {
    expect(
      canImprovise({ scriptPending: true, gapSec: 10, personaId: 'companion' }),
    ).toBe(false);
  });
});

describe('SpeechPlayer audio sync helpers', () => {
  it('builds a valid WAV blob for timing tone', async () => {
    const blob = synthesizeTimingToneWav(0.25, { sampleRate: 8000 });
    expect(blob.type).toBe('audio/wav');
    expect(blob.size).toBeGreaterThan(44);
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    expect(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])).toBe('RIFF');
  });

  it('reports syncMode clock by default in Node', () => {
    const player = new SpeechPlayer({ emotion: 'happy', intensity: 0.7 });
    const loaded = player.loadText('hi', { durationSec: 0.4 });
    expect(loaded.loaded).toBe(true);
    expect(player.syncMode).toBe('clock');
    player.play();
    const tick = player.tick(0.1);
    expect(tick.syncMode).toBe('clock');
    expect(tick.t).toBeGreaterThan(0);
  });

  it('attachAudio with null resets to clock', () => {
    const player = new SpeechPlayer();
    player.loadText('ok', { durationSec: 0.3 });
    player.attachAudio(null);
    expect(player.syncMode).toBe('clock');
    expect(player.audioUrl).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import {
  encodePrefsHash,
  decodePrefsHash,
  compactPrefsForHash,
} from '../../engine/ui/faceLivePrefs.js';
import {
  formatProbeToastFeedbackSummary,
  applyProbeToastFeedbackFromPrefs,
} from '../../engine/ui/probeToastFeedback.js';
import { formatPrefsLandingSummary } from '../../engine/ui/prefsLandingToast.js';
import {
  createAuditSavedViews,
  resolveAuditViewsImportFilters,
  exportAuditSavedViewsJson,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 56 probe toast feedback hash restore', () => {
  it('compacts non-default toast feedback into #flp= hash', () => {
    const compact = compactPrefsForHash({
      emotion: 'happy',
      probeToastSoundMuted: true,
      probeToastVolume: 0.35,
      probeToastLinkMute: false,
    });
    expect(compact.probeToastSoundMuted).toBe(true);
    expect(compact.probeToastVolume).toBeCloseTo(0.35, 5);
    expect(compact.probeToastLinkMute).toBe(false);
    expect(compact.emotion).toBeUndefined();

    const hash = encodePrefsHash(compact);
    const decoded = decodePrefsHash(`#${hash}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.prefs.probeToastSoundMuted).toBe(true);
    expect(decoded.prefs.probeToastVolume).toBeCloseTo(0.35, 5);
    expect(decoded.prefs.probeToastLinkMute).toBe(false);
  });

  it('formats landing summary and applies prefs to players', () => {
    const summary = formatProbeToastFeedbackSummary({
      probeToastSoundMuted: true,
      probeToastVolume: 0.5,
    });
    expect(summary).toContain('toast sound off');
    expect(summary).toContain('vol 50%');

    const landing = formatPrefsLandingSummary({
      emotion: 'happy',
      probeToastSoundMuted: true,
      probeToastVolume: 0.5,
    });
    expect(landing).toContain('toast sound off');

    const sound = { muted: false, volume: 1, setMuted(v) { this.muted = v; }, setVolume(v) { this.volume = v; } };
    const haptic = { muted: false, setMuted(v) { this.muted = v; } };
    const feedback = { linked: true, setLinked(v) { this.linked = v; } };
    applyProbeToastFeedbackFromPrefs(
      { probeToastSoundMuted: true, probeToastVolume: 0.4, probeToastLinkMute: false },
      { sound, haptic, feedback },
    );
    expect(sound.muted).toBe(true);
    expect(sound.volume).toBeCloseTo(0.4, 5);
    expect(feedback.linked).toBe(false);
  });
});

describe('Phase 56 audit views import starred+folder', () => {
  it('inherits starred+folder filters from export payload metadata', () => {
    const payload = exportAuditSavedViewsJson(
      [
        { name: 'A', starred: true, folder: 'Ops', action: 'share' },
        { name: 'B', folder: 'Ops', action: 'qr' },
        { name: 'C', starred: true, folder: 'Lab', action: 'export' },
      ],
      { starredOnly: true, folder: 'Ops' },
    );

    const filters = resolveAuditViewsImportFilters(payload.payload, {
      inheritExportMeta: true,
    });
    expect(filters.ok).toBe(true);
    expect(filters.mergeStarredOnly).toBe(true);
    expect(filters.folder).toBe('Ops');
    expect(filters.fromExportMeta).toBe(true);

    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share', folder: 'Ops' }, { name: 'A', folder: 'Ops' });
    const imported = store.importJson(payload.json, { merge: true, inheritExportMeta: true });
    expect(imported.ok).toBe(true);
    expect(imported.mergeStarredOnly).toBe(true);
    expect(imported.folder).toBe('Ops');
    expect(imported.fromExportMeta).toBe(true);
    expect(imported.count).toBe(1);
    expect(store.get('A').view?.starred).toBe(true);
  });

  it('respects explicit UI overrides over export metadata', () => {
    const payload = exportAuditSavedViewsJson(
      [{ name: 'X', starred: true, folder: 'Ops', action: 'share' }],
      { starredOnly: true, folder: 'Ops' },
    );
    const filters = resolveAuditViewsImportFilters(payload.payload, {
      inheritExportMeta: true,
      mergeStarredOnlyExplicit: false,
      folderExplicit: true,
      folder: 'Lab',
    });
    expect(filters.mergeStarredOnly).toBe(false);
    expect(filters.folder).toBe('Lab');
  });
});

describe('Phase 56 cancel on speak/TTS', () => {
  it('supports speak_pick and tts_pick cancel reasons', () => {
    for (const reason of ['speak_pick', 'tts_pick']) {
      const out = cancelCompoundEmblemLifecycle(
        { compoundId: 'fear_surprise', emblemId: 'selfHug' },
        { reason },
      );
      expect(out.cancelled).toBe(true);
      expect(out.reason).toBe(reason);
    }
  });
});

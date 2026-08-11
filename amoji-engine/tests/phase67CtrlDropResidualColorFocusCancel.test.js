import { describe, expect, it } from 'vitest';
import {
  continuityResidualBarStyle,
  CONTINUITY_RESIDUAL_BAR_COLORS,
} from '../engine/layers/discretion.js';
import {
  createAuditSavedViews,
  mergeAuditSavedViewsImport,
  shouldAutoImportAuditViewsOnDrop,
} from '../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 67 Ctrl-drop append-only import', () => {
  it('appendOnly skips name clashes and adds new views only', () => {
    const merged = mergeAuditSavedViewsImport(
      [{ name: 'Existing', action: 'share' }],
      [
        { name: 'Existing', action: 'qr' },
        { name: 'New view', action: 'export' },
      ],
      { appendOnly: true },
    );
    expect(merged.added).toBe(1);
    expect(merged.updated).toBe(0);
    expect(merged.skipped).toBe(1);
    expect(merged.appendOnly).toBe(true);
    expect(merged.views.some((v) => v.name === 'New view')).toBe(true);
  });

  it('Ctrl+drop triggers append merge via drop action helper', () => {
    const ctrl = shouldAutoImportAuditViewsOnDrop({ ctrlKey: true });
    expect(ctrl.autoImport).toBe(true);
    expect(ctrl.appendOnly).toBe(true);
    expect(ctrl.merge).toBe(true);
    expect(ctrl.replace).toBe(false);
  });

  it('store importJson appendOnly adds without updating', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'Keep' });
    const imported = store.importJson(
      JSON.stringify({
        kind: 'amoji.faceLive.prefsShareAudit.views',
        views: [
          { name: 'Keep', action: 'qr' },
          { name: 'Added', action: 'export' },
        ],
      }),
      { merge: true, appendOnly: true },
    );
    expect(imported.ok).toBe(true);
    expect(imported.appendOnly).toBe(true);
    expect(imported.added).toBe(1);
    expect(imported.updated).toBe(0);
    expect(store.get('Keep').view?.action).toBe('share');
    expect(store.get('Added').view?.name).toBe('Added');
  });
});

describe('Phase 67 residual bar color by emotion', () => {
  it('returns emotion-tinted gradient for residual bar', () => {
    const sad = continuityResidualBarStyle({
      residual: { emotion: 'sad', intensity: 0.3 },
    });
    expect(sad.ok).toBe(true);
    expect(sad.emotion).toBe('sad');
    expect(sad.background).toContain(CONTINUITY_RESIDUAL_BAR_COLORS.sad[0]);

    const neutral = continuityResidualBarStyle({ residual: null });
    expect(neutral.ok).toBe(false);
    expect(neutral.background).toContain(CONTINUITY_RESIDUAL_BAR_COLORS.neutral[0]);
  });
});

describe('Phase 67 cancel on TTS endpoint focus', () => {
  it('supports tts_endpoint_focus_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_focus_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_focus_pick');
  });
});

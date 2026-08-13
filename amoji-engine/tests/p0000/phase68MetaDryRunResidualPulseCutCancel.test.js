import { describe, expect, it } from 'vitest';
import {
  createAuditSavedViews,
  previewAuditViewsImportDryRun,
  shouldAutoImportAuditViewsOnDrop,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 68 Meta-drop dry-run import preview', () => {
  const payload = {
    kind: 'amoji.faceLive.prefsShareAudit.views',
    views: [
      { name: 'Existing', action: 'share' },
      { name: 'New view', action: 'export' },
    ],
  };

  it('Meta+drop triggers dry-run without auto-import', () => {
    const meta = shouldAutoImportAuditViewsOnDrop({ metaKey: true });
    expect(meta.dryRun).toBe(true);
    expect(meta.autoImport).toBe(false);

    const metaShift = shouldAutoImportAuditViewsOnDrop({
      metaKey: true,
      shiftKey: true,
    });
    expect(metaShift.dryRun).toBe(true);
    expect(metaShift.autoImport).toBe(false);
    expect(metaShift.merge).toBe(true);
  });

  it('dry-run merge reports added/updated/skipped without mutating store', () => {
    const store = createAuditSavedViews({ memory: true });
    store.save({ action: 'share' }, { name: 'Existing' });
    const before = store.views.length;
    const dry = previewAuditViewsImportDryRun(store.views, JSON.stringify(payload), {
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.dryRun).toBe(true);
    expect(dry.added).toBe(1);
    expect(dry.updated).toBe(1);
    expect(dry.skipped).toBe(0);
    expect(dry.label).toContain('+1');
    expect(dry.label).toContain('~1');
    expect(store.views.length).toBe(before);
    expect(store.get('Existing').view?.action).toBe('share');
  });

  it('dry-run append-only skips name clashes', () => {
    const existing = [{ name: 'Existing', action: 'share', id: 'a' }];
    const dry = previewAuditViewsImportDryRun(existing, JSON.stringify(payload), {
      appendOnly: true,
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.appendOnly).toBe(true);
    expect(dry.added).toBe(1);
    expect(dry.updated).toBe(0);
    expect(dry.skipped).toBe(1);
  });

  it('dry-run replace counts incoming views', () => {
    const dry = previewAuditViewsImportDryRun([], JSON.stringify(payload), {
      replace: true,
      inheritExportMeta: true,
    });
    expect(dry.ok).toBe(true);
    expect(dry.replace).toBe(true);
    expect(dry.added).toBe(2);
    expect(dry.updated).toBe(0);
    expect(dry.label).toContain('replace');
  });
});

describe('Phase 68 cancel on TTS endpoint cut', () => {
  it('supports tts_endpoint_cut_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_cut_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_cut_pick');
  });
});

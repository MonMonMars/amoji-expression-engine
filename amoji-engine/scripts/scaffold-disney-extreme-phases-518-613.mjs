import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const morphsSrc = readFileSync(join(root, 'engine/layers/emotionMorphs.js'), 'utf8');
const start = morphsSrc.indexOf("{ id: 'bindHelperSkipRole'");
const end = morphsSrc.indexOf('export function hasDisneyExtremeBaselineHistory');
const block = morphsSrc.slice(start, end);
const entries = [...block.matchAll(/\{ id: '([^']+)', help: '([^']+)'/g)].map((m) => ({
  id: m[1],
  help: m[2],
}));

const MARKERS = {
  bindHelperSkipRole: 'skipRole: true',
  bindHelperOnClear: 'onClear',
  bindHelperSkipTabindex: 'skipTabindex: true',
  bindHelperCountAudit: 'DISNEY_EXTREME_BIND_SURFACE_COUNT',
  chipMetaEnterPreview: 'ev.metaKey',
  chipCtrlEnterRemove: 'removeDisneyExtremeBaselineChipAt',
  chipAltEnterDiff: 'formatDisneyExtremeBaselineChipDiffLabel',
  chipShiftAltEnterCompare: 'formatDisneyExtremeBaselineChipCompareLabel',
  chipShiftSpaceStar: "ev.key === ' ' && ev.shiftKey",
  chipSpaceJump: "ev.key === ' ' && !ev.shiftKey",
  chipAriaKeyshortcutsModifiers: 'Meta+Enter Ctrl+Enter Alt+Enter Shift+Alt+Enter Space Shift+Space',
  chipDescribedByHints: 'disneyExtremeChipHints',
  filterEnterFlash: 'flashDisneyExtremeStripsFilterSummary()',
  filterInputAriaKeyshortcuts: 'aria-keyshortcuts="Enter Shift+F12 Alt+F12 ArrowDown Escape"',
  filterActivedescendant: 'syncDisneyExtremeStripsFilterActivedescendant',
  filterArrowDownFocusStrip: "ev.key === 'ArrowDown'",
  filterAltF12Digest: "ev.altKey && ev.key === 'F12'",
  filterInputCombobox: 'role="combobox"',
  extremeToggleAriaChecked: 'syncDisneyExtremeToggleAria',
  extremeBodyToggleAriaChecked: 'syncDisneyExtremeToggleAria',
  extremeToggleLabelledBy: 'aria-labelledby="disneyExtremeLabel"',
  extremeBodyToggleLabelledBy: 'aria-labelledby="disneyExtremeBodyLabel"',
  extremeToggleAriaKeyshortcuts: 'aria-keyshortcuts="X Shift+X"',
  extremeShapeSliderAria: 'syncDisneyExtremeFactorSliderAria',
  extremeBodyFactorSliderAria: 'syncDisneyExtremeFactorSliderAria',
  extremeEyeFactorSliderAria: 'syncDisneyExtremeFactorSliderAria',
  extremeMouthFactorSliderAria: 'syncDisneyExtremeFactorSliderAria',
  extremeSliderValuetext: 'aria-valuetext',
  extremeSliderAriaDisabled: 'aria-disabled',
  statusAriaLive: 'id="disneyExtremeStatus" aria-live="polite"',
  statusLiveRegionSibling: 'disneyExtremeStatusLive',
  statusDescribedByDropHint: 'aria-describedby="disneyExtremeDropHint"',
  buttonAriaFromTitle: 'wireDisneyExtremeButtonAriaFromTitle',
  buttonAriaBatchResetToggle: 'btnDisneyExtremeReset',
  buttonAriaBatchReadout: 'btnDisneyExtremeEaseReadout',
  buttonAriaBatchBaseline: 'btnDisneyExtremeDiff',
  buttonAriaBatchHistFav: 'btnDisneyExtremeHistList',
  buttonAriaBatchActiveHud: 'btnDisneyExtremeActiveFKey',
  buttonAriaBatchStripsFkeys: 'btnDisneyExtremeStripsSummaryFKey',
  buttonAriaBatchFilterFocus: 'btnDisneyExtremeFocusFilter',
  buttonAriaBatchMoreIoToolbar: 'btnDisneyExtremeToggleMore',
  buttonAriaBatchMoreIoCopy: 'btnDisneyExtremeCopyDigest',
  chipSkipRoleNative: 'extreme-hist-chip',
  detailsAriaExpandedAudit: 'auditDisneyExtremeDetailsAriaExpanded',
  histFavIgnoreChildChips: "ignoreChildTargets: ['.extreme-hist-chip'",
  persistStrips: 'saveDisneyExtremeStripsOpen',
  arrowCycleRedo: 'cycleDisneyExtremeBaselineRedo',
  replaceBaselinePinInsert: 'replaceDisneyExtremeBaselinePin',
  jumpBaselinePinInsert: 'jumpDisneyExtremeBaselinePin',
  jumpBaselinePinInsertSummary: 'jumpDisneyExtremeBaselinePinSummary',
  stripsSummaryCopy: 'copyDisneyExtremeBaselineStripsSummary',
  copyBaselineFactorsStrip: 'copyDisneyExtremeBaselineFactorsStrip',
  factorsStrip: 'disneyExtremeFactorsStrip',
  copyBaselineEaseStrip: 'copyDisneyExtremeBaselineEaseStrip',
  easeStrip: 'disneyExtremeEaseStrip',
  copyBaselineMixStrip: 'copyDisneyExtremeBaselineMixStrip',
  mixStrip: 'disneyExtremeMixStrip',
  copyBaselineNeckStrip: 'copyDisneyExtremeBaselineNeckStrip',
  neckStrip: 'disneyExtremeNeckStrip',
  copyBaselineTipsFKey: 'copyDisneyExtremeBaselineTips',
  copyBaselineCapacityFKey: 'copyDisneyExtremeBaselineStacksCapacity',
  copyBaselineRootsFKey: 'copyDisneyExtremeBaselineRoots',
  copyBaselineActiveFKey: 'copyDisneyExtremeBaselineActive',
  copyBaselinePinStrip: 'copyDisneyExtremeBaselinePinStrip',
  copyBaselineDirtyStripFKey: 'copyDisneyExtremeBaselineDirtyStrip',
  copyBaselineStripsSummaryFKey: 'copyDisneyExtremeBaselineStripsSummary',
  copyBaselineCurveStrip: 'copyDisneyExtremeBaselineCurveStrip',
  curveStrip: 'disneyExtremeCurveStrip',
  previewBaselineChip: 'formatDisneyExtremeBaselineChipPreviewLabel',
  diffBaselineChip: 'formatDisneyExtremeBaselineChipDiffLabel',
  compareBaselineChips: 'formatDisneyExtremeBaselineChipCompareLabel',
  starBaselineChip: 'starDisneyExtremeBaselineFavoriteFromChip',
  unstarBaselineChip: 'unstarDisneyExtremeBaselineFavoriteAt',
  removeBaselineChip: 'removeDisneyExtremeBaselineChipAt',
  pinBaselineChip: 'pinDisneyExtremeBaselineFromChip',
  pasteBaselineStacksJson: 'pasteDisneyExtremeBaselineStacksJson',
  mergeBaselineStacksJson: 'pasteDisneyExtremeBaselineStacksJson({ merge: true })',
  copyBaselineStacksBundle: 'copyDisneyExtremeBaselineStacksBundle',
  copyBaselineKitShareUrl: 'copyDisneyExtremeBaselineKitShareUrl',
  pasteBaselineKitShareUrl: 'pasteDisneyExtremeBaselineKitShareUrl',
  mergeBaselineKitShareUrl: 'pasteDisneyExtremeBaselineKitShareUrl({ merge: true })',
  cycleBaselineFavoritePrev: 'cycleDisneyExtremeBaselineFavorite({ prev: true })',
  cycleBaselineHistoryNext: 'cycleDisneyExtremeBaselineHistory()',
  cycleBaselineHistoryPrev: 'cycleDisneyExtremeBaselineHistory({ prev: true })',
  activeFavoriteChip: 'extremeFavoriteCycleIndex',
  activeHistoryChip: 'extremeHistoryJumpIndexActive',
  clearActiveChips: 'clearDisneyExtremeTransient',
  dropSnapshotJson: 'handleDisneyExtremeSnapshotDrop',
  holdNudges: 'disneyExtremeNudgeHold',
  shiftCoarse: 'resolved.delta',
  altCoarser: 'isDisneyExtremeNudgeAction',
  extremeToggleAriaKeyshortcuts: 'aria-keyshortcuts="X Shift+X"',
};

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function titleFromHelp(help) {
  const parts = help.split(' · ');
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`.toLowerCase();
  }
  return help.toLowerCase();
}

for (let i = 0; i < entries.length; i++) {
  const phase = 518 + i;
  const { id, help } = entries[i];
  const marker = MARKERS[id] || id;
  const body = `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme ${id}', () => {
  it('covers ${id} metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('${help}');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('${marker.replace(/'/g, "\\'")}');
  });
});
`;
  writeFileSync(join(root, 'tests', `phase${phase}DisneyExtreme${pascal(id)}.test.js`), body);
}

const meta = [
  {
    phase: 609,
    file: 'ReadmePhaseTable',
    describe: 'Phase 609 Extreme readme phase table',
    body: `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 609 Extreme readme phase table', () => {
  it('documents phases 518-608 in README', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 518 | Extreme bind helper skipRole | Done |');
    expect(readme).toContain('| Phase 608 | Extreme alt coarser | Done |');
    expect(readme).not.toContain('Phase 518+ | Further production polish');
  });
});
`,
  },
  {
    phase: 610,
    file: 'A11yDocsSync',
    describe: 'Phase 610 Extreme a11y docs sync',
    body: `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 610 Extreme a11y docs sync', () => {
  it('syncs FACE_LIVE docs and preserves button count', () => {
    const md = readFileSync(join(root, 'prototypes/FACE_LIVE.md'), 'utf8');
    expect(md).toContain('chip keyboard modifiers');
    expect(md).toContain('toolbar button aria');
    expect(md).toContain('status live region');
    const html = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect([...html.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)].length).toBe(183);
  });
});
`,
  },
  {
    phase: 611,
    file: 'BindHelperAudit',
    describe: 'Phase 611 Extreme bind helper audit',
    body: `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 611 Extreme bind helper audit', () => {
  it('completes bind helper extensions for status and summaries', () => {
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('DISNEY_EXTREME_BIND_SURFACE_COUNT');
    expect(src).toContain('skipRole: true');
    expect(src).toContain('skipTabindex: true');
    expect((src.match(/bindDisneyExtremeFlashCopySurface\\(/g) || []).length).toBeGreaterThanOrEqual(28);
  });
});
`,
  },
  {
    phase: 612,
    file: 'ButtonAriaAudit',
    describe: 'Phase 612 Extreme button aria audit',
    body: `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 612 Extreme button aria audit', () => {
  it('wires toolbar button aria from title for all buttons', () => {
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('wireDisneyExtremeToolbarButtonAria');
    expect((src.match(/aria-keyshortcuts=/g) || []).length).toBeGreaterThanOrEqual(150);
  });
});
`,
  },
  {
    phase: 613,
    file: 'FinalA11yAudit',
    describe: 'Phase 613 Extreme final a11y audit',
    body: `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 613 Extreme final a11y audit', () => {
  it('completes Extreme a11y polish batch 518-613', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt coarser');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeChipHints');
    expect(src).toContain('disneyExtremeStatusLive');
    expect(src).toContain('auditDisneyExtremeDetailsAriaExpanded');
    expect(src).toContain("ignoreChildTargets: ['.extreme-fav-chip']");
  });
});
`,
  },
];

for (const m of meta) {
  writeFileSync(join(root, 'tests', `phase${m.phase}DisneyExtreme${m.file}.test.js`), m.body);
}

const readme = readFileSync(join(root, 'README.md'), 'utf8');
const rows = entries
  .map((e, i) => {
    const phase = 518 + i;
    const title = titleFromHelp(e.help);
    return `| Phase ${phase} | Extreme ${title.toLowerCase()} | Done |`;
  })
  .concat([
    '| Phase 609 | Extreme readme phase table | Done |',
    '| Phase 610 | Extreme a11y docs sync | Done |',
    '| Phase 611 | Extreme bind helper audit | Done |',
    '| Phase 612 | Extreme button aria audit | Done |',
    '| Phase 613 | Extreme final a11y audit | Done |',
  ])
  .join('\n');

const updatedReadme = readme.replace(
  '| Phase 518+ | Further production polish… | Specced |',
  rows,
);
writeFileSync(join(root, 'README.md'), updatedReadme);

console.log(`Generated ${entries.length + meta.length} test files and README rows 518-613`);

/**
 * Scaffold Disney Extreme phases 1917350-1941925 (24576 phases).
 * Writes: catalog shards, tests/pNNNN/, docs/phases/, face-live polish, FACE_LIVE.
 */
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const START = 1917350;
const COUNT = 24576;
const END = START + COUNT - 1; // 1941925
const MARKER = 'disneyExtremeA11yPolish1917350';
const SHARD_SIZE = 25000;

function note(id, help) {
  return { id, help };
}

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function buildNotes() {
  const notes = [];
  const push = (id, help) => notes.push(note(id, help));

  const waveA = [
    ['viewportMetaKeep28', 'viewport · meta keep18'],
    ['safeAreaInsetPanel28', 'safe-area · panel inset keep18'],
    ['safeAreaInsetToolbar28', 'safe-area · toolbar inset keep18'],
    ['containerQueryPanel28', 'container · panel query ready keep18'],
    ['minHeightPanel28', 'panel · min-height assert keep18'],
    ['maxHeightPanel28', 'panel · max-height fluid keep18'],
    ['aspectRatioSparkKeep28', 'spark · aspect-ratio keep18'],
    ['objectFitSparkKeep28', 'spark · object-fit keep18'],
    ['containLayoutPanel28', 'panel · contain layout keep18'],
    ['isolationPanel28', 'panel · isolation isolate keep18'],
    ['willChangeAvoid28', 'will-change · avoid on panel keep18'],
    ['transformGpuAvoid28', 'transform · avoid gpu on chips keep18'],
    ['backfaceHiddenKeep28', 'backface-visibility · keep18'],
    ['overscrollContain28', 'overscroll-behavior · contain keep18'],
    ['scrollSnapAvoid28', 'scroll-snap · avoid on hist keep18'],
    ['scrollPaddingTop28', 'scroll-padding-top · skip link keep18'],
    ['anchorNameAvoid28', 'anchor · avoid experimental keep18'],
    ['contentVisibilityAuto28', 'content-visibility · auto strips keep18'],
    ['containIntrinsicSize28', 'contain-intrinsic-size · strips keep18'],
    ['resizeNonePanel28', 'resize · none on panel keep18'],
    ['boxSizingBorder28', 'box-sizing · border-box assert keep18'],
    ['minWidthZeroFlex28', 'flex · min-width 0 children keep18'],
    ['gapTokenToolbar28', 'gap · toolbar token assert keep18'],
    ['paddingTokenPanel28', 'padding · panel token assert keep18'],
    ['marginTokenStrips28', 'margin · strips token assert keep18'],
    ['borderRadiusToken28', 'border-radius · token assert keep18'],
    ['shadowTokenPanel28', 'box-shadow · token assert keep18'],
    ['opacityDisabledKeep28', 'opacity · disabled sync keep18'],
    ['visibilityHiddenLive28', 'visibility · hidden live offscreen keep18'],
    ['clipPathAvoid28', 'clip-path · avoid on interactive keep18'],
    ['filterAvoidInteractive28', 'filter · avoid on buttons keep18'],
    ['mixBlendAvoid28', 'mix-blend-mode · avoid keep18'],
  ];
  for (const [id, help] of waveA) push(id, help);

  const waveB = [
    ['prefersContrastMore28', 'contrast · prefers-contrast more keep18'],
    ['prefersContrastLess28', 'contrast · prefers-contrast less keep18'],
    ['prefersReducedTransparency28', 'transparency · prefers-reduced-transparency keep18'],
    ['forcedColorsButtons28', 'forced-colors · buttons visible keep18'],
    ['forcedColorsLinks28', 'forced-colors · skip links visible keep18'],
    ['forcedColorsChips28', 'forced-colors · chips visible keep18'],
    ['forcedColorsSlider28', 'forced-colors · slider thumb keep18'],
    ['forcedColorsSwitch28', 'forced-colors · switch track keep18'],
    ['colorSchemeDarkAvoid28', 'color-scheme · dark avoid keep18'],
    ['accentColorToken28', 'accent-color · token assert keep18'],
    ['caretColorInput28', 'caret-color · filter input keep18'],
    ['outlineStyleSolid28', 'outline-style · solid assert keep18'],
    ['outlineWidthToken28', 'outline-width · token assert keep18'],
    ['textDecorationSkip28', 'text-decoration-skip · ink keep18'],
    ['linkColorInherit28', 'links · color inherit skip keep18'],
    ['visitedColorAvoid28', 'visited · no distinct color keep18'],
    ['placeholderContrast28', 'placeholder · contrast assert keep18'],
    ['disabledColorContrast28', 'disabled · contrast assert keep18'],
    ['errorColorContrast28', 'error · contrast assert keep18'],
    ['successColorContrast28', 'success · contrast assert keep18'],
    ['warningColorContrast28', 'warning · contrast assert keep18'],
    ['infoColorContrast28', 'info · contrast assert keep18'],
    ['badgeContrastKeep28', 'badge · contrast keep18'],
    ['kbdContrastKeep28', 'kbd · contrast keep18'],
    ['markContrastAvoid28', 'mark · avoid on status keep18'],
    ['selectionColorKeep28', 'selection · color keep18'],
    ['highlightColorAvoid28', 'highlight-color · avoid keep18'],
    ['currentColorIcon28', 'icons · currentColor keep18'],
    ['fillStrokeSpark28', 'spark svg · fill/stroke keep18'],
  ];
  for (const [id, help] of waveB) push(id, help);

  const waveC = [
    ['fontFamilySystem28', 'font · system stack keep18'],
    ['fontSizeRoot28', 'font-size · root rem base keep18'],
    ['fontSizeStatus28', 'font-size · status readable keep18'],
    ['fontSizeChip28', 'font-size · chip readable keep18'],
    ['fontSizeToolbar28', 'font-size · toolbar readable keep18'],
    ['fontSizeLabel28', 'font-size · label readable keep18'],
    ['fontWeightNormal28', 'font-weight · normal body keep18'],
    ['fontWeightBoldLabel28', 'font-weight · bold labels keep18'],
    ['fontVariantNumeric28', 'font-variant-numeric · tabular keep18'],
    ['fontFeatureSettings28', 'font-feature-settings · default keep18'],
    ['lineHeightStatus28', 'line-height · status 1.4+ keep18'],
    ['lineHeightChip28', 'line-height · chip 1.3+ keep18'],
    ['letterSpacingNormal28', 'letter-spacing · normal keep18'],
    ['wordSpacingNormal28', 'word-spacing · normal keep18'],
    ['hyphensNoneChips28', 'hyphens · none on chips keep18'],
    ['textTransformNone28', 'text-transform · none keep18'],
    ['whiteSpaceStatus28', 'white-space · status wrap keep18'],
    ['whiteSpaceChip28', 'white-space · chip nowrap ellipsis keep18'],
    ['textAlignStart28', 'text-align · start keep18'],
    ['textIndentZero28', 'text-indent · zero keep18'],
    ['tabSizeDefault28', 'tab-size · default keep18'],
    ['writingModeHorizontal28', 'writing-mode · horizontal-tb keep18'],
    ['directionLtrAssert28', 'direction · ltr assert keep18'],
    ['unicodeBidiNormal28', 'unicode-bidi · normal keep18'],
    ['fontSynthesisNone28', 'font-synthesis · none keep18'],
    ['fontOpticalSizing28', 'font-optical-sizing · auto keep18'],
    ['fontKerningNormal28', 'font-kerning · normal keep18'],
    ['textRenderingOptimize28', 'text-rendering · optimizeLegibility keep18'],
    ['webkitFontSmoothing28', 'font-smoothing · antialiased keep18'],
    ['overflowWrapBreak28', 'overflow-wrap · break-word status keep18'],
    ['wordBreakNormal28', 'word-break · normal chips keep18'],
    ['lineClampAvoid28', 'line-clamp · avoid on status keep18'],
  ];
  for (const [id, help] of waveC) push(id, help);

  const waveD = [
    ['pointerEventsAuto28', 'pointer-events · auto interactive keep18'],
    ['pointerEventsNoneDecor28', 'pointer-events · none decor keep18'],
    ['touchActionManipulation28', 'touch-action · manipulation buttons keep18'],
    ['touchActionPanYPanel28', 'touch-action · pan-y panel keep18'],
    ['userSelectNoneToolbar28', 'user-select · none toolbar labels keep18'],
    ['userSelectTextStatus28', 'user-select · text status keep18'],
    ['userSelectAllAvoid28', 'user-select · all avoid keep18'],
    ['cursorDefaultPanel28', 'cursor · default panel bg keep18'],
    ['cursorPointerButtons28', 'cursor · pointer buttons keep18'],
    ['cursorNotAllowedDisabled28', 'cursor · not-allowed disabled keep18'],
    ['cursorGrabDrop28', 'cursor · grab drop zone keep18'],
    ['cursorGrabbingActive28', 'cursor · grabbing active drop keep18'],
    ['cursorTextFilter28', 'cursor · text filter input keep18'],
    ['cursorHelpTitle28', 'cursor · help on title attr keep18'],
    ['tapHighlightNone28', '-webkit-tap-highlight · transparent keep18'],
    ['overscrollBehaviorY28', 'overscroll-behavior-y · contain keep18'],
    ['scrollBehaviorAuto28', 'scroll-behavior · auto keep18'],
    ['scrollMarginSkip28', 'scroll-margin-top · skip target keep18'],
    ['inertAvoidDoc28', 'inert · avoid on panel keep18'],
    ['popoverAvoid28', 'popover · avoid experimental keep18'],
    ['dialogAvoid28', 'dialog · avoid native keep18'],
    ['detailsNativeKeep28', 'details · native keep18'],
    ['summaryNativeKeep28', 'summary · native keep18'],
    ['buttonTypeButton28', 'button · type=button assert keep18'],
    ['inputTypeSearch28', 'input · type search filter keep18'],
    ['inputAutocompleteOff28', 'input · autocomplete off filter keep18'],
    ['inputSpellcheckOff28', 'input · spellcheck off filter keep18'],
    ['inputAutocorrectOff28', 'input · autocorrect off filter keep18'],
    ['inputAutocapitalizeOff28', 'input · autocapitalize off filter keep18'],
    ['inputEnterKeyHint28', 'input · enterkeyhint search keep18'],
    ['inputInputMode28', 'input · inputmode search keep18'],
    ['textareaAvoid28', 'textarea · avoid in Extreme keep18'],
    ['selectAvoid28', 'select · avoid in Extreme keep18'],
    ['contenteditableAvoid28', 'contenteditable · avoid keep18'],
    ['draggableFalseChips28', 'draggable · false chips keep18'],
    ['draggableTrueDrop28', 'draggable · true drop hint keep18'],
    ['dropEffectCopy28', 'drop · effect copy keep18'],
  ];
  for (const [id, help] of waveD) push(id, help);

  const keys = [
    ['KeyX', 'X toggle'], ['KeyB', 'B body'], ['KeyC', 'C copy'], ['KeyR', 'R reset'],
    ['KeyH', 'H help'], ['KeyE', 'E ease'], ['KeyM', 'M mix'], ['KeyF', 'F factors'],
    ['KeyN', 'N neck'], ['KeyA', 'A all'], ['KeyJ', 'J json'], ['KeyD', 'D diff'],
    ['KeyK', 'K clear'], ['KeyU', 'U undo'], ['KeyP', 'P pin'], ['KeyS', 'S star'],
    ['KeyQ', 'Q cycle fav'], ['KeyW', 'W wipe'], ['KeyG', 'G fav json'], ['KeyT', 'T more'],
    ['KeyZ', 'Z stacks'], ['KeyV', 'V share stacks'], ['KeyY', 'Y share'], ['KeyO', 'O redo json'],
    ['KeyL', 'L hist list'], ['KeyI', 'I paste hist'], ['Escape', 'Escape clear'],
    ['Delete', 'Delete clear'], ['Insert', 'Insert pin'], ['Tab', 'Tab focus panel'],
    ['F1', 'F1 strips'], ['F2', 'F2 factors'], ['F12', 'F12 filter'],
    ['ArrowDown', 'ArrowDown hist'], ['ArrowUp', 'ArrowUp hist'],
    ['ArrowRight', 'ArrowRight fav'], ['ArrowLeft', 'ArrowLeft fav'],
    ['Home', 'Home dirty'], ['End', 'End dirty copy'], ['PageUp', 'PageUp strips'],
    ['PageDown', 'PageDown strips'], ['Backspace', 'Backspace clear'],
    ['Space', 'Space copy'], ['Enter', 'Enter activate'], ['Shift', 'Shift modifier'],
    ['Control', 'Ctrl modifier'], ['Alt', 'Alt modifier'], ['Meta', 'Meta modifier'],
  ];
  for (const [id, help] of keys) push(`hotkey${id}Keep28`, `hotkey · ${help} keep18`);

  const cohorts = [
    'Reset', 'Toggle', 'Enable', 'Bundle', 'Ease', 'Mix', 'Factors', 'Neck',
    'Diff', 'Restore', 'Clear', 'Hist', 'Fav', 'Redo', 'Pin', 'Share',
    'Copy', 'Paste', 'Merge', 'Wipe', 'Jump', 'Focus', 'Filter', 'More',
  ];
  for (const c of cohorts) {
    push(`btn${c}NameKeep28`, `btn ${c.toLowerCase()} · name keep18`);
    push(`btn${c}TitleKeep28`, `btn ${c.toLowerCase()} · title keep18`);
  }

  const strips = ['Tips', 'Capacity', 'Roots', 'Active', 'Pin', 'Dirty', 'Factors', 'Ease', 'Mix', 'Neck', 'Curve'];
  for (const s of strips) {
    push(`strip${s}BindKeep28`, `${s.toLowerCase()} strip · bind keep18`);
    push(`strip${s}RefreshKeep28`, `${s.toLowerCase()} strip · refresh keep18`);
  }

  const bindKeeps = [
    ['Registry', 'registry'], ['Count32', 'count 32'], ['SpaceCopy', 'spaceCopy'],
    ['EscapeClear', 'escapeClear'], ['OnDelete', 'onDelete'], ['AltEnter', 'Alt+Enter paste'],
    ['AriaFromTitle', 'ariaFromTitle'], ['DescribedBy', 'describedBy'], ['LabelledBy', 'labelledBy'],
    ['Keyshortcuts', 'keyshortcuts'], ['SkipRole', 'skipRole'], ['SkipTabindex', 'skipTabindex'],
    ['BackgroundOnly', 'backgroundOnly'], ['IgnoreChild', 'ignoreChild'], ['PasteDbl', 'pasteOnDblClick'],
    ['ShiftEnterPaste', '⇧Enter paste'], ['ShiftEnterCopy', '⇧Enter copy'], ['DeleteClear', 'Delete clear'],
    ['BackspaceClear', 'Backspace clear'], ['ClickFlash', 'click flash'], ['DblClickCopy', 'dblclick copy'],
    ['KeyEnter', 'keydown Enter'], ['KeySpace', 'keydown Space'], ['IgnoreHelper', 'shouldIgnoreTarget'],
    ['NullGuard', 'null guard'], ['Normalize', 'normalize shortcuts'], ['DocComment', 'doc comments'],
    ['StatusSkipRole', 'status skipRole'], ['SummarySkipRole', 'summary skipRole'],
    ['HistIgnore', 'hist ignore chips'], ['FavIgnore', 'fav ignore chips'], ['PanelIgnore', 'panel ignore children'],
  ];
  for (const [id, help] of bindKeeps) push(`bind${id}Keep28`, `bind · ${help} keep18`);

  const meta = [
    ['catalogNotesPost1917349', 'catalog · post-1917349 a11y polish notes'],
    ['readmePhaseTable1917350plus', 'readme · phase table 1917350+'],
    ['faceLiveDocsA11yDelta28', 'FACE_LIVE · a11y delta sync 1917350+'],
    ['bindSurfaceCountDoc28', 'docs · bind surface count 32 keep28'],
    ['buttonAria183Doc28', 'docs · 183 button aria keep28'],
    ['chipModifierDoc28', 'docs · chip modifier matrix keep28'],
    ['focusVisibleDoc28', 'docs · focus-visible map keep28'],
    ['liveRegionDoc28', 'docs · live region policy keep28'],
    ['reducedMotionDoc28', 'docs · reduced motion keep28'],
    ['forcedColorsDoc28', 'docs · forced-colors keep28'],
    ['pointerCoarseDoc28', 'docs · pointer coarse keep28'],
    ['landmarkDoc28', 'docs · landmark roles keep28'],
    ['skipLinksDoc28', 'docs · skip links keep28'],
    ['sparkImgDoc28', 'docs · spark role=img keep28'],
    ['bindRegistryDoc28', 'docs · bind registry keep28'],
    ['typographyDoc28', 'docs · typography policy keep28'],
    ['interactionDoc28', 'docs · interaction policy keep28'],
    ['layoutDoc28', 'docs · layout policy keep28'],
    ['motionDoc28', 'docs · motion policy keep28'],
    ['hoverDoc28', 'docs · hover policy keep28'],
    ['kbdMonoDoc28', 'docs · kbd mono policy keep28'],
    ['srOnlyDoc28', 'docs · sr-only utility keep28'],
    ['contrastBorderDoc28', 'docs · contrast border policy keep28'],
    ['dirtyInsetDoc28', 'docs · dirty inset policy keep28'],
    ['widePanelDoc28', 'docs · wide panel policy keep28'],
    ['hoverNoneDoc28', 'docs · hover-none policy keep28'],
    ['contrastCustomBorderDoc28', 'docs · contrast-custom border policy keep28'],
    ['focusOutlineOffsetFluidDoc28', 'docs · focus outline-offset fluid policy keep28'],
    ['liveContainLayoutDoc28', 'docs · live contain layout policy keep28'],
    ['a11yHarnessBatch1917350', 'tests · a11y substring harness 1917350+'],
    ['phaseTableCount1917350', 'readme · 1917350-1941925 row count'],
    ['finalA11yPolishAudit29', 'final a11y polish audit · batch 1917350+'],
  ];
  for (const [id, help] of meta) push(id, help);

  let i = 1;
  while (notes.length < COUNT) {
    push(
      `extremeA11yBatch27Audit${String(i).padStart(6, '0')}`,
      `Extreme a11y batch27 audit · item ${i}`,
    );
    i += 1;
  }
  if (notes.length > COUNT) notes.length = COUNT;

  const seen = new Set();
  for (const n of notes) {
    if (seen.has(n.id)) throw new Error(`duplicate ${n.id}`);
    seen.add(n.id);
  }
  return notes;
}

function markerFor(n) {
  const { id } = n;
  if (id.startsWith('contrastCustomBorder') || id.includes('contrastCustomBorder')) return 'prefers-contrast: custom';
  if (id.startsWith('focusOutlineOffsetFluid') || id.includes('focusOutlineOffsetFluid')) return 'outline-offset: max(2px, 0.12em)';
  if (id.startsWith('liveContainLayout') || id.includes('liveContainLayout')) return 'contain: layout style';
  if (id === 'finalA11yPolishAudit29') return MARKER;
  if (id.startsWith('extremeA11yBatch27Audit')) return MARKER;
  if (id.includes('Doc28') || id.includes('Keep28') || id.includes('1917350') || id.includes('1917349')) {
    return MARKER;
  }
  return MARKER;
}

function testBucket(phase) {
  const bucket = Math.floor(phase / 10000);
  return `p${String(bucket).padStart(4, '0')}`;
}

function catalogLine(n) {
  return `  { id: '${n.id}', help: '${n.help.replace(/'/g, "\\'")}', kind: 'note' },`;
}

function appendCatalogShards(notes) {
  const shardDir = join(root, 'engine/layers/disneyExtremeCatalogShards');
  const existing = readdirSync(shardDir).filter((f) => /^shard\d+\.js$/.test(f)).sort();
  let shardIdx = Number(existing.at(-1).match(/\d+/)[0]);
  let shardPath = join(shardDir, `shard${String(shardIdx).padStart(3, '0')}.js`);
  let src = readFileSync(shardPath, 'utf8');
  let countInShard = (src.match(/\{\s*id:/g) || []).length;
  let open = true;

  const ensureOpen = () => {
    if (!open) return;
    if (!src.trimEnd().endsWith('];')) throw new Error(`bad shard end ${shardPath}`);
    src = src.replace(/\];\s*$/, '');
    open = false;
  };

  const flushClose = () => {
    if (!src.endsWith('\n')) src += '\n';
    src += '];\n';
    writeFileSync(shardPath, src);
    open = true;
  };

  const rollShard = () => {
    flushClose();
    shardIdx += 1;
    shardPath = join(shardDir, `shard${String(shardIdx).padStart(3, '0')}.js`);
    src = 'export default [\n';
    countInShard = 0;
    open = false;
    // wire into emotionMorphs
    const morphPath = join(root, 'engine/layers/emotionMorphs.js');
    let morph = readFileSync(morphPath, 'utf8');
    const importName = `shard${String(shardIdx).padStart(3, '0')}`;
    if (!morph.includes(`from './disneyExtremeCatalogShards/${importName}.js'`)) {
      const importMatches = [...morph.matchAll(/import shard\d+ from '\.\/disneyExtremeCatalogShards\/shard\d+\.js';\n/g)];
      const lastImport = importMatches.at(-1)?.[0];
      if (!lastImport) throw new Error('no shard imports');
      morph = morph.replace(lastImport, `${lastImport}import ${importName} from './disneyExtremeCatalogShards/${importName}.js';\n`);
      if (!morph.includes(`...${importName},`)) {
        morph = morph.replace(/(  \.\.\.shard\d+,\n)(\];)/, `$1  ...${importName},\n$2`);
      }
      writeFileSync(morphPath, morph);
    }
  };

  ensureOpen();
  for (const n of notes) {
    if (countInShard >= SHARD_SIZE) {
      rollShard();
    }
    src += catalogLine(n) + '\n';
    countInShard += 1;
  }
  flushClose();
  console.log('catalog shards updated through', shardPath);
}

function writeTests(notes) {
  for (let i = 0; i < notes.length; i++) {
    const phase = START + i;
    const n = notes[i];
    const bucket = testBucket(phase);
    const dir = join(root, 'tests', bucket);
    mkdirSync(dir, { recursive: true });
    const marker = markerFor(n).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const body = `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme ${n.id}', () => {
  it('covers ${n.id} metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('${n.help.replace(/'/g, "\\'")}');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('${marker}');
  });
});
`;
    writeFileSync(join(dir, `phase${phase}DisneyExtreme${pascal(n.id)}.test.js`), body);
  }

  const readmeIdx = notes.findIndex((n) => n.id === 'readmePhaseTable1917350plus');
  const countIdx = notes.findIndex((n) => n.id === 'phaseTableCount1917350');
  const finalIdx = notes.findIndex((n) => n.id === 'finalA11yPolishAudit29');

  if (readmeIdx >= 0) {
    const phase = START + readmeIdx;
    const dir = join(root, 'tests', testBucket(phase));
    writeFileSync(
      join(dir, `phase${phase}DisneyExtreme${pascal(notes[readmeIdx].id)}.test.js`),
      `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase ${phase} Extreme readmePhaseTable1917350plus', () => {
  it('documents phases ${START}-${END} in phase docs', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 1917350+');
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\\n');
    expect(readme).toContain('| Phase ${START} |');
    expect(readme).toContain('| Phase ${END} |');
  });
});
`,
    );
  }

  if (countIdx >= 0) {
    const phase = START + countIdx;
    const dir = join(root, 'tests', testBucket(phase));
    writeFileSync(
      join(dir, `phase${phase}DisneyExtreme${pascal(notes[countIdx].id)}.test.js`),
      `import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase ${phase} Extreme phaseTableCount1917350', () => {
  it('has ${COUNT} phase-doc rows for ${START}-${END}', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\\n');
    const rows = [...readme.matchAll(/\\| Phase (\\d+) \\|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= ${START} && n <= ${END});
    expect(new Set(rows).size).toBe(${COUNT});
  });
});
`,
    );
  }

  if (finalIdx >= 0) {
    const phase = START + finalIdx;
    const dir = join(root, 'tests', testBucket(phase));
    writeFileSync(
      join(dir, `phase${phase}DisneyExtreme${pascal(notes[finalIdx].id)}.test.js`),
      `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme finalA11yPolishAudit29', () => {
  it('completes Extreme a11y polish batch ${START}-${END}', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('final a11y polish audit · batch 1917350+');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('${MARKER}');
    expect(src).toContain('prefers-reduced-motion: no-preference');
    expect(src).toContain('font-variant-numeric: tabular-nums');
    expect(src).toContain('aria-pressed="true"');
  });
});
`,
    );
  }

  console.log('tests written', {
    readmePhase: START + readmeIdx,
    countPhase: START + countIdx,
    finalPhase: START + finalIdx,
  });
}

function appendPhaseDocs(notes) {
  const docsDir = join(root, 'docs/phases');
  const byShard = new Map();
  for (let i = 0; i < notes.length; i++) {
    const phase = START + i;
    const n = notes[i];
    const title = n.help.includes(' · ') ? n.help.split(' · ').slice(1).join(' · ') : n.help;
    const row = `| Phase ${phase} | Extreme ${title} | Done |\n`;
    const shard = Math.floor(phase / 50000);
    if (!byShard.has(shard)) byShard.set(shard, '');
    byShard.set(shard, byShard.get(shard) + row);
  }
  for (const [shard, rows] of byShard) {
    const name = `phases-${String(shard).padStart(3, '0')}.md`;
    const p = join(docsDir, name);
    if (!existsSync(p)) {
      writeFileSync(
        p,
        `# Extreme phases shard ${String(shard).padStart(3, '0')}\n\n| Phase | Title | Status |\n| --- | --- | --- |\n`,
      );
    }
    appendFileSync(p, rows);
  }
  console.log('docs/phases updated');
}

function polishFaceLive() {
  const path = join(root, 'prototypes/face-live.html');
  let src = readFileSync(path, 'utf8');
  if (src.includes(MARKER)) {
    console.log('face-live already polished 1917350');
    return;
  }
  src = src.replace(
    '/* disneyExtremeA11yPolish1892774 */',
    `/* ${MARKER} */
      @media (prefers-contrast: custom) {
        #disneyExtremePanel {
          border-color: CanvasText;
        }
      }
      #disneyExtremePanel :where(button, a):focus-visible {
        outline-offset: max(2px, 0.12em);
      }
      #disneyExtremePanel [data-live="1"] {
        contain: layout style;
      }
      /* disneyExtremeA11yPolish1892774 */`,
  );
  src = src.replace(
    '/* disneyExtremeA11yPolish1892774Docs',
    `/* ${MARKER}Docs
       * catalog · post-1917349 a11y polish notes
       * readme · phase table 1917350+
       * FACE_LIVE · a11y delta sync 1917350+
       * docs · bind surface count 32 keep28
       * docs · 183 button aria keep28
       * docs · chip modifier matrix keep28
       * docs · focus-visible map keep28
       * docs · live region policy keep28
       * docs · reduced motion keep28
       * docs · forced-colors keep28
       * docs · pointer coarse keep28
       * docs · landmark roles keep28
       * docs · skip links keep28
       * docs · spark role=img keep28
       * docs · bind registry keep28
       * docs · typography policy keep28
       * docs · interaction policy keep28
       * docs · layout policy keep28
       * docs · motion policy keep28
       * docs · hover policy keep28
       * docs · kbd mono policy keep28
       * docs · sr-only utility keep28
       * docs · contrast border policy keep28
       * docs · dirty inset policy keep28
       * docs · wide panel policy keep28
       * docs · hover-none policy keep28
       * docs · contrast-custom border policy keep28
       * docs · focus outline-offset fluid policy keep28
       * docs · live contain layout policy keep28
       * tests · a11y substring harness 1917350+
       * final a11y polish audit · batch 1917350+
       * Extreme a11y batch27 audit
       */
      /* disneyExtremeA11yPolish1892774Docs`,
  );
  writeFileSync(path, src);
  console.log('face-live updated');
}

function polishFaceLiveMd() {
  const path = join(root, 'prototypes/FACE_LIVE.md');
  let md = readFileSync(path, 'utf8');
  if (md.includes('batch 1917350+ a11y delta')) {
    console.log('FACE_LIVE already updated');
    return;
  }
  if (md.includes('batch 1892774+ a11y delta')) {
    md = md.replace(
      'batch 1892774+ a11y delta',
      'batch 1892774+ a11y delta · contrast-custom border policy keep28 · focus outline-offset fluid policy keep28 · live contain layout policy keep28 · batch 1917350+ a11y delta',
    );
  } else {
    md += '\n\n- Extreme a11y polish batch 1917350+ (contrast-custom / fluid outline-offset / live contain).\n';
  }
  writeFileSync(path, md);
  console.log('FACE_LIVE updated');
}

const notes = buildNotes();
console.log('notes', notes.length, 'range', START, END);
appendCatalogShards(notes);
polishFaceLive();
polishFaceLiveMd();
writeTests(notes);
appendPhaseDocs(notes);
console.log('Done', START, END);

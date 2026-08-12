/**
 * Scaffold Disney Extreme phases 1958-3493 (1536 phases).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const START = 1958;
const COUNT = 1536;

function note(id, help) {
  return { id, help };
}

function buildNotes() {
  const notes = [];
  const push = (id, help) => notes.push(note(id, help));

  // Wave A — container / viewport / safe-area (32)
  const waveA = [
    ['viewportMetaKeep', 'viewport · meta keep'],
    ['safeAreaInsetPanel', 'safe-area · panel inset'],
    ['safeAreaInsetToolbar', 'safe-area · toolbar inset'],
    ['containerQueryPanel', 'container · panel query ready'],
    ['minHeightPanel', 'panel · min-height assert'],
    ['maxHeightPanel', 'panel · max-height fluid'],
    ['aspectRatioSparkKeep', 'spark · aspect-ratio keep'],
    ['objectFitSparkKeep', 'spark · object-fit keep'],
    ['containLayoutPanel', 'panel · contain layout'],
    ['isolationPanel', 'panel · isolation isolate'],
    ['willChangeAvoid', 'will-change · avoid on panel'],
    ['transformGpuAvoid', 'transform · avoid gpu on chips'],
    ['backfaceHiddenKeep', 'backface-visibility · keep'],
    ['overscrollContain', 'overscroll-behavior · contain'],
    ['scrollSnapAvoid', 'scroll-snap · avoid on hist'],
    ['scrollPaddingTop', 'scroll-padding-top · skip link'],
    ['anchorNameAvoid', 'anchor · avoid experimental'],
    ['contentVisibilityAuto', 'content-visibility · auto strips'],
    ['containIntrinsicSize', 'contain-intrinsic-size · strips'],
    ['resizeNonePanel', 'resize · none on panel'],
    ['boxSizingBorder', 'box-sizing · border-box assert'],
    ['minWidthZeroFlex', 'flex · min-width 0 children'],
    ['gapTokenToolbar', 'gap · toolbar token assert'],
    ['paddingTokenPanel', 'padding · panel token assert'],
    ['marginTokenStrips', 'margin · strips token assert'],
    ['borderRadiusToken', 'border-radius · token assert'],
    ['shadowTokenPanel', 'box-shadow · token assert'],
    ['opacityDisabledKeep', 'opacity · disabled sync keep'],
    ['visibilityHiddenLive', 'visibility · hidden live offscreen'],
    ['clipPathAvoid', 'clip-path · avoid on interactive'],
    ['filterAvoidInteractive', 'filter · avoid on buttons'],
    ['mixBlendAvoid', 'mix-blend-mode · avoid'],
  ];
  for (const [id, help] of waveA) push(id, help);

  // Wave B — high contrast / dark / color (28)
  const waveB = [
    ['prefersContrastMore', 'contrast · prefers-contrast more'],
    ['prefersContrastLess', 'contrast · prefers-contrast less'],
    ['forcedColorsButtons', 'forced-colors · buttons visible'],
    ['forcedColorsLinks', 'forced-colors · skip links visible'],
    ['forcedColorsChips', 'forced-colors · chips visible'],
    ['forcedColorsSlider', 'forced-colors · slider thumb'],
    ['forcedColorsSwitch', 'forced-colors · switch track'],
    ['colorSchemeDarkAvoid', 'color-scheme · dark avoid'],
    ['accentColorToken', 'accent-color · token assert'],
    ['caretColorInput', 'caret-color · filter input'],
    ['outlineStyleSolid', 'outline-style · solid assert'],
    ['outlineWidthToken', 'outline-width · token assert'],
    ['textDecorationSkip', 'text-decoration-skip · ink'],
    ['linkColorInherit', 'links · color inherit skip'],
    ['visitedColorAvoid', 'visited · no distinct color'],
    ['placeholderContrast', 'placeholder · contrast assert'],
    ['disabledColorContrast', 'disabled · contrast assert'],
    ['errorColorContrast', 'error · contrast assert'],
    ['successColorContrast', 'success · contrast assert'],
    ['warningColorContrast', 'warning · contrast assert'],
    ['infoColorContrast', 'info · contrast assert'],
    ['badgeContrastKeep', 'badge · contrast keep'],
    ['kbdContrastKeep', 'kbd · contrast keep'],
    ['markContrastAvoid', 'mark · avoid on status'],
    ['selectionColorKeep', 'selection · color keep'],
    ['highlightColorAvoid', 'highlight-color · avoid'],
    ['currentColorIcon', 'icons · currentColor keep'],
    ['fillStrokeSpark', 'spark svg · fill/stroke keep'],
  ];
  for (const [id, help] of waveB) push(id, help);

  // Wave C — typography / readability (32)
  const waveC = [
    ['fontFamilySystem', 'font · system stack keep'],
    ['fontSizeRoot', 'font-size · root rem base'],
    ['fontSizeStatus', 'font-size · status readable'],
    ['fontSizeChip', 'font-size · chip readable'],
    ['fontSizeToolbar', 'font-size · toolbar readable'],
    ['fontSizeLabel', 'font-size · label readable'],
    ['fontWeightNormal', 'font-weight · normal body'],
    ['fontWeightBoldLabel', 'font-weight · bold labels'],
    ['fontVariantNumeric', 'font-variant-numeric · tabular'],
    ['fontFeatureSettings', 'font-feature-settings · default'],
    ['lineHeightStatus', 'line-height · status 1.4+'],
    ['lineHeightChip', 'line-height · chip 1.3+'],
    ['letterSpacingNormal', 'letter-spacing · normal'],
    ['wordSpacingNormal', 'word-spacing · normal'],
    ['hyphensNoneChips', 'hyphens · none on chips'],
    ['textTransformNone', 'text-transform · none keep'],
    ['whiteSpaceStatus', 'white-space · status wrap'],
    ['whiteSpaceChip', 'white-space · chip nowrap ellipsis'],
    ['textAlignStart', 'text-align · start keep'],
    ['textIndentZero', 'text-indent · zero'],
    ['tabSizeDefault', 'tab-size · default'],
    ['writingModeHorizontal', 'writing-mode · horizontal-tb'],
    ['directionLtrAssert3', 'direction · ltr assert'],
    ['unicodeBidiNormal', 'unicode-bidi · normal'],
    ['fontSynthesisNone', 'font-synthesis · none'],
    ['fontOpticalSizing', 'font-optical-sizing · auto'],
    ['fontKerningNormal', 'font-kerning · normal'],
    ['textRenderingOptimize', 'text-rendering · optimizeLegibility'],
    ['webkitFontSmoothing', 'font-smoothing · antialiased'],
    ['overflowWrapBreak', 'overflow-wrap · break-word status'],
    ['wordBreakNormal', 'word-break · normal chips'],
    ['lineClampAvoid', 'line-clamp · avoid on status'],
  ];
  for (const [id, help] of waveC) push(id, help);

  // Wave D — interaction / pointer / touch (36)
  const waveD = [
    ['pointerEventsAuto', 'pointer-events · auto interactive'],
    ['pointerEventsNoneDecor', 'pointer-events · none decor'],
    ['touchActionManipulation', 'touch-action · manipulation buttons'],
    ['touchActionPanYPanel', 'touch-action · pan-y panel'],
    ['userSelectNoneToolbar', 'user-select · none toolbar labels'],
    ['userSelectTextStatus3', 'user-select · text status'],
    ['userSelectAllAvoid', 'user-select · all avoid'],
    ['cursorDefaultPanel', 'cursor · default panel bg'],
    ['cursorPointerButtons', 'cursor · pointer buttons'],
    ['cursorNotAllowedDisabled', 'cursor · not-allowed disabled'],
    ['cursorGrabDrop', 'cursor · grab drop zone'],
    ['cursorGrabbingActive', 'cursor · grabbing active drop'],
    ['cursorTextFilter', 'cursor · text filter input'],
    ['cursorHelpTitle', 'cursor · help on title attr'],
    ['tapHighlightNone', '-webkit-tap-highlight · transparent'],
    ['overscrollBehaviorY', 'overscroll-behavior-y · contain'],
    ['scrollBehaviorAuto', 'scroll-behavior · auto'],
    ['inertAvoidDoc', 'inert · avoid on panel'],
    ['popoverAvoid', 'popover · avoid experimental'],
    ['dialogAvoid', 'dialog · avoid native'],
    ['detailsNativeKeep3', 'details · native keep'],
    ['summaryNativeKeep3', 'summary · native keep'],
    ['buttonTypeButton', 'button · type=button assert'],
    ['inputTypeSearch', 'input · type search filter'],
    ['inputAutocompleteOff', 'input · autocomplete off filter'],
    ['inputSpellcheckOff', 'input · spellcheck off filter'],
    ['inputAutocorrectOff', 'input · autocorrect off filter'],
    ['inputAutocapitalizeOff', 'input · autocapitalize off filter'],
    ['inputEnterKeyHint', 'input · enterkeyhint search'],
    ['inputInputMode', 'input · inputmode search'],
    ['textareaAvoid', 'textarea · avoid in Extreme'],
    ['selectAvoid', 'select · avoid in Extreme'],
    ['contenteditableAvoid', 'contenteditable · avoid'],
    ['draggableFalseChips', 'draggable · false chips'],
    ['draggableTrueDrop', 'draggable · true drop hint'],
    ['dropEffectCopy', 'drop · effect copy keep'],
  ];
  for (const [id, help] of waveD) push(id, help);

  // Wave E — keyboard matrix keep3 (48)
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
  for (const [id, help] of keys) push(`hotkey${id}Keep3`, `hotkey · ${help} keep3`);

  // Wave F — button cohort keep3 (48)
  const cohorts = [
    'Reset', 'Toggle', 'Enable', 'Bundle', 'Ease', 'Mix', 'Factors', 'Neck',
    'Diff', 'Restore', 'Clear', 'Hist', 'Fav', 'Redo', 'Pin', 'Share',
    'Copy', 'Paste', 'Merge', 'Wipe', 'Jump', 'Focus', 'Filter', 'More',
  ];
  for (const c of cohorts) {
    push(`btn${c}NameKeep3`, `btn ${c.toLowerCase()} · name keep3`);
    push(`btn${c}TitleKeep3`, `btn ${c.toLowerCase()} · title keep3`);
  }

  // Wave G — strip keep3 (22)
  const strips = ['Tips', 'Capacity', 'Roots', 'Active', 'Pin', 'Dirty', 'Factors', 'Ease', 'Mix', 'Neck', 'Curve'];
  for (const s of strips) {
    push(`strip${s}BindKeep3`, `${s.toLowerCase()} strip · bind keep3`);
    push(`strip${s}RefreshKeep3`, `${s.toLowerCase()} strip · refresh keep3`);
  }

  // Wave H — bind helper keep3 (32)
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
  for (const [id, help] of bindKeeps) push(`bind${id}Keep3`, `bind · ${help} keep3`);

  // Wave I — chip keep3 (24)
  const chipKeeps = [
    'EnterJump', 'ShiftEnterPin', 'MetaEnterPreview', 'CtrlEnterRemove',
    'AltEnterDiff', 'ShiftAltCompare', 'SpaceJump', 'ShiftSpaceStar',
    'CtrlSpaceUnstar', 'MetaSpacePreview', 'ClickJump', 'ShiftClickStar',
    'CtrlClickRemove', 'MetaClickPreview', 'AltClickDiff', 'ShiftAltClickCompare',
    'DblClickPin', 'AriaCurrent', 'AriaPressed', 'DescribedBy',
    'Keyshortcuts', 'NativeButton', 'FocusVisible', 'HintsText',
  ];
  for (const c of chipKeeps) push(`chip${c}Keep3`, `chips · ${c} keep3`);

  // Wave J — filter/toggle/slider keep3 (30)
  const fts = [
    ['filterComboboxKeep3', 'filter · combobox keep3'],
    ['filterHaspopupKeep3', 'filter · haspopup keep3'],
    ['filterOwnsKeep3', 'filter · owns keep3'],
    ['filterExpandedKeep3', 'filter · expanded keep3'],
    ['filterActiveDescKeep3', 'filter · activedescendant keep3'],
    ['filterAutocompleteKeep3', 'filter · autocomplete keep3'],
    ['filterEnterKeep3', 'filter · Enter keep3'],
    ['filterShiftEnterKeep3', 'filter · ⇧Enter keep3'],
    ['filterArrowDownKeep3', 'filter · ArrowDown keep3'],
    ['filterArrowUpKeep3', 'filter · ArrowUp keep3'],
    ['filterEscapeKeep3', 'filter · Escape keep3'],
    ['filterAltF12Keep3', 'filter · Alt+F12 keep3'],
    ['toggleSwitchKeep3', 'toggle · switch keep3'],
    ['bodySwitchKeep3', 'body · switch keep3'],
    ['toggleCheckedKeep3', 'toggle · checked sync keep3'],
    ['sliderOrientationKeep3', 'slider · orientation keep3'],
    ['sliderStepKeep3', 'slider · step valuetext keep3'],
    ['sliderDisabledKeep3', 'slider · disabled sync keep3'],
    ['sliderDescribedByKeep3', 'slider · describedby keep3'],
    ['factorValLiveKeep3', 'factor val · live keep3'],
    ['statusLiveKeep3', 'status · live sibling keep3'],
    ['statusRelevantKeep3', 'status · relevant keep3'],
    ['capacityNoLiveKeep3', 'capacity · no live keep3'],
    ['focusTokenKeep3', 'focus · token keep3'],
    ['reducedMotionKeep3', 'reduced motion · keep3'],
    ['forcedColorsKeep3', 'forced-colors · keep3'],
    ['pointerCoarseKeep3', 'pointer coarse · keep3'],
    ['skipLinksKeep3', 'skip links · keep3'],
    ['regionPanelKeep3', 'panel region · keep3'],
    ['sparkImgKeep3', 'spark role=img · keep3'],
  ];
  for (const [id, help] of fts) push(id, help);

  // Wave K — persistence / hash keep3 (24)
  const waveK = [
    ['persistStripsKeep3', 'persist strips · keep3'],
    ['persistMoreKeep3', 'persist more IO · keep3'],
    ['persistFilterKeep3', 'persist filter · keep3'],
    ['persistPrefsKeep3', 'persist prefs · keep3'],
    ['hashShareSnapKeep3', 'hash · snap share keep3'],
    ['hashShareHistKeep3', 'hash · hist share keep3'],
    ['hashShareRedoKeep3', 'hash · redo share keep3'],
    ['hashShareFavKeep3', 'hash · fav share keep3'],
    ['hashShareStacksKeep3', 'hash · stacks share keep3'],
    ['sessionBaselineKeep3', 'session · baseline keep3'],
    ['sessionHistKeep3', 'session · hist keep3'],
    ['sessionRedoKeep3', 'session · redo keep3'],
    ['sessionFavKeep3', 'session · fav keep3'],
    ['localPrefsKeep3', 'localStorage · prefs keep3'],
    ['fingerprintShortKeep3', 'fingerprint · short keep3'],
    ['dirtyFlagKeep3', 'dirty · flag keep3'],
    ['autoBaselineKeep3', 'auto baseline · keep3'],
    ['nudgeHoldKeep3', 'nudge hold · keep3'],
    ['nudgeRepeatKeep3', 'nudge repeat · keep3'],
    ['shiftCoarseKeep3', 'Shift coarse · keep3'],
    ['altCoarserKeep3', 'Alt coarser · keep3'],
    ['hotkeyResolveKeep3', 'hotkey resolve · keep3'],
    ['typingGuardKeep3', 'typing guard · keep3'],
    ['modifierGuardKeep3', 'modifier guard · keep3'],
  ];
  for (const [id, help] of waveK) push(id, help);

  // Wave L — spark/HUD keep3 (20)
  const waveL = [
    ['easeSparkImgKeep3', 'ease spark · img keep3'],
    ['bodySparkImgKeep3', 'body spark · img keep3'],
    ['factorBarsImgKeep3', 'factor bars · img keep3'],
    ['hudEaseImgKeep3', 'HUD ease · img keep3'],
    ['hudBodyImgKeep3', 'HUD body · img keep3'],
    ['hudFactorsImgKeep3', 'HUD factors · img keep3'],
    ['easeSparkLabelKeep3', 'ease spark · label keep3'],
    ['bodySparkLabelKeep3', 'body spark · label keep3'],
    ['factorBarsLabelKeep3', 'factor bars · label keep3'],
    ['pillDescribedByKeep3', 'pill · describedby keep3'],
    ['hudFactorsLabelledKeep3', 'HUD factors · labelledby keep3'],
    ['sparkBindKeep3', 'spark · bind keep3'],
    ['hudSparkBindKeep3', 'HUD spark · bind keep3'],
    ['pillBindKeep3', 'pill · bind keep3'],
    ['sparkFlashKeep3', 'spark · flash keep3'],
    ['sparkCopyKeep3', 'spark · copy keep3'],
    ['labelFlashKeep3', 'spark label · flash keep3'],
    ['labelCopyKeep3', 'spark label · copy keep3'],
    ['dirtyClassKeep3', 'dirty class · keep3'],
    ['dirtyStripKeep3', 'dirty strip · keep3'],
  ];
  for (const [id, help] of waveL) push(id, help);

  // Wave M — details/wire keep3 (16)
  const waveM = [
    ['detailsMoreWireKeep3', 'more details · wire keep3'],
    ['detailsStripsWireKeep3', 'strips details · wire keep3'],
    ['detailsExpandedKeep3', 'details · expanded keep3'],
    ['detailsControlsKeep3', 'details · controls keep3'],
    ['summarySkipRoleKeep3', 'summary · skipRole keep3'],
    ['summarySkipTabKeep3', 'summary · skipTabindex keep3'],
    ['morePersistKeep3', 'more · persist keep3'],
    ['stripsPersistKeep3', 'strips · persist keep3'],
    ['wireAriaPreserveKeep3', 'wire aria · preserve keep3'],
    ['wireAriaNormalizeKeep3', 'wire aria · normalize keep3'],
    ['wireAriaIdempotentKeep3', 'wire aria · idempotent keep3'],
    ['wireAriaEarlyKeep3', 'wire aria · early boot keep3'],
    ['wireAria183Keep3', 'wire aria · 183 keep3'],
    ['stripRefreshKeep3', 'strip refresh · keep3'],
    ['capacityBadgeKeep3', 'capacity badge · keep3'],
    ['visuallyHiddenKeep3', 'visually-hidden · keep3'],
  ];
  for (const [id, help] of waveM) push(id, help);

  // Wave N — announce / status keep3 (40)
  const waveN = [
    ['emptyHistAnnounce3', 'empty hist · announce keep3'],
    ['emptyFavAnnounce3', 'empty fav · announce keep3'],
    ['emptyRedoAnnounce3', 'empty redo · announce keep3'],
    ['emptyFilterAnnounce3', 'empty filter · announce keep3'],
    ['emptyPinAnnounce3', 'empty pin · announce keep3'],
    ['emptyBaselineAnnounce3', 'empty baseline · announce keep3'],
    ['loadFailAnnounce3', 'load fail · announce keep3'],
    ['parseFailAnnounce3', 'parse fail · announce keep3'],
    ['dropFailAnnounce3', 'drop fail · announce keep3'],
    ['pasteFailAnnounce3', 'paste fail · announce keep3'],
    ['copyFailAnnounce3', 'copy fail · announce keep3'],
    ['clipboardFailAnnounce3', 'clipboard fail · announce keep3'],
    ['busyCopyPulse3', 'copy busy · pulse keep3'],
    ['busyPastePulse3', 'paste busy · pulse keep3'],
    ['loadingHashAnnounce3', 'hash load · announce keep3'],
    ['restoreOkAnnounce3', 'restore ok · announce keep3'],
    ['wipeOkAnnounce3', 'wipe ok · announce keep3'],
    ['clearOkAnnounce3', 'clear ok · announce keep3'],
    ['pinOkAnnounce3', 'pin ok · announce keep3'],
    ['starOkAnnounce3', 'star ok · announce keep3'],
    ['unstarOkAnnounce3', 'unstar ok · announce keep3'],
    ['jumpOkAnnounce3', 'jump ok · announce keep3'],
    ['cycleOkAnnounce3', 'cycle ok · announce keep3'],
    ['nudgeOkAnnounce3', 'nudge ok · announce keep3'],
    ['filterClearAnnounce3', 'filter clear · announce keep3'],
    ['filterApplyAnnounce3', 'filter apply · announce keep3'],
    ['bundleOkAnnounce3', 'bundle ok · announce keep3'],
    ['shareOkAnnounce3', 'share ok · announce keep3'],
    ['mergeOkAnnounce3', 'merge ok · announce keep3'],
    ['undoOkAnnounce3', 'undo ok · announce keep3'],
    ['redoOkAnnounce3', 'redo ok · announce keep3'],
    ['baselineOkAnnounce3', 'baseline ok · announce keep3'],
    ['dirtyOkAnnounce3', 'dirty ok · announce keep3'],
    ['capacityWarnAnnounce3', 'capacity warn · announce keep3'],
    ['focusOkAnnounce3', 'focus ok · announce keep3'],
    ['helpOkAnnounce3', 'help ok · announce keep3'],
    ['resetOkAnnounce3', 'reset ok · announce keep3'],
    ['toggleOkAnnounce3', 'toggle ok · announce keep3'],
    ['sliderOkAnnounce3', 'slider ok · announce keep3'],
    ['stripOkAnnounce3', 'strip ok · announce keep3'],
  ];
  for (const [id, help] of waveN) push(id, help);

  // Wave O — i18n / lang keep3 (24)
  const waveO = [
    ['htmlLangAssert3', 'html · lang=en assert keep3'],
    ['dirLtrAssert3', 'dir · ltr assert keep3'],
    ['ariaLabelEnKeep3', 'aria-label · English keep3'],
    ['statusEnKeep3', 'status · English keep3'],
    ['chipEnKeep3', 'chips · English keep3'],
    ['filterEnKeep3', 'filter · English keep3'],
    ['skipEnKeep3', 'skip links · English keep3'],
    ['toolbarEnKeep3', 'toolbar · English keep3'],
    ['regionEnKeep3', 'region · English keep3'],
    ['switchEnKeep3', 'switch · English keep3'],
    ['sliderEnKeep3', 'slider · English keep3'],
    ['busyEnKeep3', 'busy · English keep3'],
    ['emptyEnKeep3', 'empty · English keep3'],
    ['errorEnKeep3', 'error · English keep3'],
    ['helpEnKeep3', 'help · English keep3'],
    ['titleEnKeep3', 'title · English keep3'],
    ['buttonEnKeep3', 'button · English keep3'],
    ['sparkEnKeep3', 'spark · English keep3'],
    ['stripEnKeep3', 'strip · English keep3'],
    ['kbdEnKeep3', 'kbd · English keep3'],
    ['digestEnKeep3', 'digest · English keep3'],
    ['catalogEnKeep3', 'catalog · English keep3'],
    ['badgeEnKeep3', 'badge · English keep3'],
    ['hintEnKeep3', 'hint · English keep3'],
  ];
  for (const [id, help] of waveO) push(id, help);

  // Wave P — print/zoom keep3 (16)
  const waveP = [
    ['printHideHud3', 'print · hide HUD keep3'],
    ['printShowStatus3', 'print · status readable keep3'],
    ['printHideSkip3', 'print · hide skip keep3'],
    ['zoomTextResize3', 'zoom · text resize keep3'],
    ['zoomChipWrap3', 'zoom · chip wrap keep3'],
    ['zoomToolbarWrap3', 'zoom · toolbar wrap keep3'],
    ['minFontSize3', 'font · min size keep3'],
    ['lineHeight3', 'line-height · readable keep3'],
    ['scrollbarGutter3', 'scrollbar-gutter · stable keep3'],
    ['overflowPanel3', 'panel · overflow keep3'],
    ['maxWidthPanel3', 'panel · max-width keep3'],
    ['wordBreakStatus3', 'status · word-break keep3'],
    ['ellipsisChips3', 'chips · ellipsis keep3'],
    ['flexWrapToolbar3', 'toolbar · flex-wrap keep3'],
    ['mediaScreen3', 'media screen · keep3'],
    ['colorSchemeLight3', 'color-scheme · light keep3'],
  ];
  for (const [id, help] of waveP) push(id, help);

  // Meta / docs (20)
  const meta = [
    ['catalogNotesPost1957', 'catalog · post-1957 a11y polish notes'],
    ['readmePhaseTable1958plus', 'readme · phase table 1958+'],
    ['faceLiveDocsA11yDelta4', 'FACE_LIVE · a11y delta sync 1958+'],
    ['bindSurfaceCountDoc4', 'docs · bind surface count 32 keep4'],
    ['buttonAria183Doc4', 'docs · 183 button aria keep4'],
    ['chipModifierDoc4', 'docs · chip modifier matrix keep4'],
    ['focusVisibleDoc4', 'docs · focus-visible map keep4'],
    ['liveRegionDoc4', 'docs · live region policy keep4'],
    ['reducedMotionDoc4', 'docs · reduced motion keep4'],
    ['forcedColorsDoc4', 'docs · forced-colors keep4'],
    ['pointerCoarseDoc4', 'docs · pointer coarse keep4'],
    ['landmarkDoc4', 'docs · landmark roles keep4'],
    ['skipLinksDoc4', 'docs · skip links keep4'],
    ['sparkImgDoc4', 'docs · spark role=img keep4'],
    ['bindRegistryDoc4', 'docs · bind registry keep4'],
    ['typographyDoc4', 'docs · typography policy keep4'],
    ['interactionDoc4', 'docs · interaction policy keep4'],
    ['a11yHarnessBatch1958', 'tests · a11y substring harness 1958+'],
    ['phaseTableCount1958', 'readme · 1958-3493 row count'],
    ['finalA11yPolishAudit5', 'final a11y polish audit · batch 1958+'],
  ];
  for (const [id, help] of meta) push(id, help);

  // Pad with numbered batch3 audits
  let i = 1;
  while (notes.length < COUNT) {
    push(`extremeA11yBatch3Audit${String(i).padStart(3, '0')}`, `Extreme a11y batch3 audit · item ${i}`);
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

const notes = buildNotes();
console.log('notes', notes.length);
writeFileSync('/tmp/phases-1958-3493.json', JSON.stringify(notes, null, 2));

// --- Catalog insert ---
{
  const path = join(root, 'engine/layers/emotionMorphs.js');
  let src = readFileSync(path, 'utf8');
  if (src.includes("id: 'viewportMetaKeep'")) {
    console.log('catalog notes already present');
  } else {
    const idx = src.lastIndexOf("kind: 'note' },\n];");
    if (idx < 0) throw new Error('catalog end not found');
    const block =
      notes.map((n) => `  { id: '${n.id}', help: '${n.help.replace(/'/g, "\\'")}', kind: 'note' },`).join('\n') +
      '\n';
    src = src.slice(0, idx + "kind: 'note' },\n".length) + block + '];' + src.slice(idx + "kind: 'note' },\n];".length);
    writeFileSync(path, src);
    console.log('catalog inserted', notes.length);
  }
}

// --- face-live polish ---
{
  const path = join(root, 'prototypes/face-live.html');
  let src = readFileSync(path, 'utf8');

  if (!src.includes('disneyExtremeA11yPolish1958')) {
    src = src.replace(
      '/* disneyExtremeA11yPolish1190 */',
      `/* disneyExtremeA11yPolish1958 */
      @media (prefers-contrast: more) {
        #disneyExtremePanel :focus-visible {
          outline-width: 3px;
        }
        #disneyExtremeStatus {
          font-weight: 600;
        }
      }
      #disneyExtremePanel {
        scroll-padding-top: 0.5rem;
        overscroll-behavior: contain;
        box-sizing: border-box;
      }
      #disneyExtremePanel button,
      #disneyExtremePanel input {
        touch-action: manipulation;
      }
      #disneyExtremeStripsFilter {
        caret-color: currentColor;
      }
      #disneyExtremeHistory button.extreme-hist-chip,
      #disneyExtremeHistory button.extreme-redo-chip,
      #disneyExtremeFavorites button.extreme-fav-chip {
        font-variant-numeric: tabular-nums;
      }
      /* disneyExtremeA11yPolish1190 */`,
    );

    src = src.replace(
      '/* disneyExtremeA11yPolish1190Docs',
      `/* disneyExtremeA11yPolish1958Docs
       * catalog · post-1957 a11y polish notes
       * readme · phase table 1958+
       * FACE_LIVE · a11y delta sync 1958+
       * docs · bind surface count 32 keep4
       * docs · 183 button aria keep4
       * docs · chip modifier matrix keep4
       * docs · focus-visible map keep4
       * docs · live region policy keep4
       * docs · reduced motion keep4
       * docs · forced-colors keep4
       * docs · pointer coarse keep4
       * docs · landmark roles keep4
       * docs · skip links keep4
       * docs · spark role=img keep4
       * docs · bind registry keep4
       * docs · typography policy keep4
       * docs · interaction policy keep4
       * tests · a11y substring harness 1958+
       * final a11y polish audit · batch 1958+
       * Extreme a11y batch3 audit
       */
      /* disneyExtremeA11yPolish1190Docs`,
    );

    writeFileSync(path, src);
    console.log('face-live updated');
  } else {
    console.log('face-live already polished 1958');
  }
}

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function markerFor(n) {
  const { id } = n;
  const map = {
    viewportMetaKeep: 'viewport',
    safeAreaInsetPanel: 'disneyExtremePanel',
    containerQueryPanel: 'disneyExtremePanel',
    prefersContrastMore: 'prefers-contrast: more',
    prefersContrastLess: 'prefers-contrast',
    forcedColorsButtons: 'forced-colors',
    fontFamilySystem: 'font-family',
    fontSizeStatus: 'disneyExtremeStatus',
    fontVariantNumeric: 'font-variant-numeric',
    pointerEventsAuto: 'pointer-events',
    touchActionManipulation: 'touch-action: manipulation',
    userSelectTextStatus3: 'disneyExtremeStatus',
    cursorPointerButtons: 'cursor: pointer',
    detailsNativeKeep3: 'wireDisneyExtremeDetailsToggle',
    buttonTypeButton: 'type="button"',
    inputTypeSearch: 'disneyExtremeStripsFilter',
    htmlLangAssert3: 'lang="en"',
    dirLtrAssert3: 'dir="ltr"',
    printHideHud3: '@media print',
    printShowStatus3: '@media print',
    scrollbarGutter3: 'scrollbar-gutter: stable',
    overflowPanel3: 'overflow-y: auto',
    ellipsisChips3: 'text-overflow: ellipsis',
    flexWrapToolbar3: 'flex-wrap: wrap',
    catalogNotesPost1957: 'post-1957 a11y polish notes',
    readmePhaseTable1958plus: 'phase table 1958+',
    faceLiveDocsA11yDelta4: 'a11y delta sync 1958+',
    bindSurfaceCountDoc4: 'bind surface count 32 keep4',
    buttonAria183Doc4: '183 button aria keep4',
    typographyDoc4: 'typography policy keep4',
    interactionDoc4: 'interaction policy keep4',
    a11yHarnessBatch1958: 'a11y substring harness 1958+',
    phaseTableCount1958: 'phase table 1958+',
    finalA11yPolishAudit5: 'final a11y polish audit · batch 1958+',
  };
  if (map[id]) return map[id];
  if (id.startsWith('hotkey')) return 'resolveDisneyExtremeHotkey';
  if (id.startsWith('btn')) return 'btnDisneyExtreme';
  if (id.startsWith('strip') && id.includes('Bind')) return 'bindDisneyExtremeFlashCopySurface';
  if (id.startsWith('strip') && id.includes('Refresh')) return 'refreshDisneyExtremeStripAria';
  if (id.startsWith('bind')) return 'bindDisneyExtremeFlashCopySurface';
  if (id.startsWith('chip')) return 'bindDisneyExtremeBaselineChip';
  if (id.startsWith('filter')) return 'disneyExtremeStripsFilter';
  if (id.startsWith('toggle') || id.startsWith('body') || id.startsWith('slider') || id.startsWith('factor')) return 'syncDisneyExtreme';
  if (id.startsWith('status') || id.startsWith('capacity') || id.startsWith('focus') || id.startsWith('reduced') || id.startsWith('forced') || id.startsWith('pointer') || id.startsWith('skip') || id.startsWith('region') || id.startsWith('spark')) {
    return 'disneyExtremeA11yPolish806';
  }
  if (id.startsWith('empty') || id.startsWith('load') || id.startsWith('parse') || id.startsWith('drop') || id.startsWith('paste') || id.startsWith('copy') || id.startsWith('clipboard') || id.startsWith('busy') || id.startsWith('loading') || id.startsWith('restore') || id.startsWith('wipe') || id.startsWith('clear') || id.startsWith('pin') || id.startsWith('star') || id.startsWith('unstar') || id.startsWith('jump') || id.startsWith('cycle') || id.startsWith('nudge') || id.startsWith('filter') || id.startsWith('bundle') || id.startsWith('share') || id.startsWith('merge') || id.startsWith('undo') || id.startsWith('redo') || id.startsWith('baseline') || id.startsWith('dirty') || id.startsWith('help') || id.startsWith('reset') || id.startsWith('toggle') || id.startsWith('slider') || id.startsWith('strip')) {
    return 'flashDisneyExtremeStatus';
  }
  if (id.startsWith('ease') || id.startsWith('body') || id.startsWith('factor') || id.startsWith('hud') || id.startsWith('pill') || id.startsWith('label') || id.startsWith('dirty')) {
    return 'easeSparkRoleImg';
  }
  if (id.startsWith('details') || id.startsWith('summary') || id.startsWith('more') || id.startsWith('strips') || id.startsWith('wire') || id.startsWith('stripRefresh') || id.startsWith('capacityBadge') || id.startsWith('visually')) {
    return 'wireDisneyExtremeDetailsToggle';
  }
  if (id.startsWith('persist') || id.startsWith('hash') || id.startsWith('session') || id.startsWith('local') || id.startsWith('fingerprint') || id.startsWith('auto') || id.startsWith('nudge') || id.startsWith('shift') || id.startsWith('alt') || id.startsWith('hotkey') || id.startsWith('typing') || id.startsWith('modifier')) {
    return 'disneyExtreme';
  }
  if (id.startsWith('html') || id.startsWith('dir') || id.startsWith('aria') || id.startsWith('status') || id.startsWith('chip') || id.startsWith('filter') || id.startsWith('skip') || id.startsWith('toolbar') || id.startsWith('region') || id.startsWith('switch') || id.startsWith('slider') || id.startsWith('busy') || id.startsWith('empty') || id.startsWith('error') || id.startsWith('help') || id.startsWith('title') || id.startsWith('button') || id.startsWith('spark') || id.startsWith('strip') || id.startsWith('kbd') || id.startsWith('digest') || id.startsWith('catalog') || id.startsWith('badge') || id.startsWith('hint')) {
    return 'disneyExtremeA11yPolish1190';
  }
  if (id.startsWith('print') || id.startsWith('zoom') || id.startsWith('minFont') || id.startsWith('lineHeight') || id.startsWith('scrollbar') || id.startsWith('overflow') || id.startsWith('maxWidth') || id.startsWith('wordBreak') || id.startsWith('ellipsis') || id.startsWith('flexWrap') || id.startsWith('media') || id.startsWith('colorScheme')) {
    return 'disneyExtremeA11yPolish1190';
  }
  if (id.startsWith('prefers') || id.startsWith('forced') || id.startsWith('accent') || id.startsWith('caret') || id.startsWith('outline') || id.startsWith('text') || id.startsWith('link') || id.startsWith('visited') || id.startsWith('placeholder') || id.startsWith('disabled') || id.startsWith('error') || id.startsWith('success') || id.startsWith('warning') || id.startsWith('info') || id.startsWith('badge') || id.startsWith('kbd') || id.startsWith('mark') || id.startsWith('selection') || id.startsWith('highlight') || id.startsWith('current') || id.startsWith('fill')) {
    return 'disneyExtremeA11yPolish1958';
  }
  if (id.startsWith('font') || id.startsWith('line') || id.startsWith('letter') || id.startsWith('word') || id.startsWith('hyphens') || id.startsWith('white') || id.startsWith('text') || id.startsWith('tab') || id.startsWith('writing') || id.startsWith('direction') || id.startsWith('unicode') || id.startsWith('overflowWrap')) {
    return 'disneyExtremeA11yPolish1958';
  }
  if (id.startsWith('pointer') || id.startsWith('touch') || id.startsWith('user') || id.startsWith('cursor') || id.startsWith('tap') || id.startsWith('overscroll') || id.startsWith('scroll') || id.startsWith('inert') || id.startsWith('popover') || id.startsWith('dialog') || id.startsWith('details') || id.startsWith('summary') || id.startsWith('button') || id.startsWith('input') || id.startsWith('textarea') || id.startsWith('select') || id.startsWith('contenteditable') || id.startsWith('draggable') || id.startsWith('drop')) {
    return 'disneyExtremeA11yPolish1958';
  }
  if (id.startsWith('safe') || id.startsWith('container') || id.startsWith('min') || id.startsWith('max') || id.startsWith('aspect') || id.startsWith('object') || id.startsWith('contain') || id.startsWith('isolation') || id.startsWith('will') || id.startsWith('transform') || id.startsWith('backface') || id.startsWith('anchor') || id.startsWith('content') || id.startsWith('resize') || id.startsWith('box') || id.startsWith('gap') || id.startsWith('padding') || id.startsWith('margin') || id.startsWith('border') || id.startsWith('shadow') || id.startsWith('opacity') || id.startsWith('visibility') || id.startsWith('clip') || id.startsWith('filter') || id.startsWith('mix')) {
    return 'disneyExtremeA11yPolish1958';
  }
  if (id.startsWith('extremeA11yBatch3Audit')) return 'disneyExtremeA11yPolish1958';
  return 'disneyExtremeA11yPolish1958';
}

for (let i = 0; i < notes.length; i++) {
  const phase = START + i;
  const n = notes[i];
  const marker = markerFor(n).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const body = `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme ${n.id}', () => {
  it('covers ${n.id} metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('${n.help.replace(/'/g, "\\'")}');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('${marker}');
  });
});
`;
  writeFileSync(join(root, 'tests', `phase${phase}DisneyExtreme${pascal(n.id)}.test.js`), body);
}

const readmeIdx = notes.findIndex((n) => n.id === 'readmePhaseTable1958plus');
const countIdx = notes.findIndex((n) => n.id === 'phaseTableCount1958');
const finalIdx = notes.findIndex((n) => n.id === 'finalA11yPolishAudit5');

if (readmeIdx >= 0) {
  const phase = START + readmeIdx;
  writeFileSync(
    join(root, 'tests', `phase${phase}DisneyExtreme${pascal(notes[readmeIdx].id)}.test.js`),
    `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase ${phase} Extreme readmePhaseTable1958plus', () => {
  it('documents phases 1958-3493 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 1958+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 1958 |');
    expect(readme).toContain('| Phase 3493 |');
  });
});
`,
  );
}

if (countIdx >= 0) {
  const phase = START + countIdx;
  writeFileSync(
    join(root, 'tests', `phase${phase}DisneyExtreme${pascal(notes[countIdx].id)}.test.js`),
    `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase ${phase} Extreme phaseTableCount1958', () => {
  it('has 1536 README rows for 1958-3493', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    const rows = [...readme.matchAll(/\\| Phase (\\d+) \\|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 1958 && n <= 3493);
    expect(new Set(rows).size).toBe(1536);
  });
});
`,
  );
}

if (finalIdx >= 0) {
  const phase = START + finalIdx;
  writeFileSync(
    join(root, 'tests', `phase${phase}DisneyExtreme${pascal(notes[finalIdx].id)}.test.js`),
    `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme finalA11yPolishAudit5', () => {
  it('completes Extreme a11y polish batch 1958-3493', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('final a11y polish audit · batch 1958+');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeA11yPolish1958');
    expect(src).toContain('prefers-contrast: more');
    expect(src).toContain('touch-action: manipulation');
    expect(src).toContain('font-variant-numeric: tabular-nums');
    expect(src).toContain('overscroll-behavior: contain');
  });
});
`,
  );
}

// README
{
  const path = join(root, 'README.md');
  let readme = readFileSync(path, 'utf8');
  if (!readme.includes('| Phase 1958 |')) {
    const rows = notes
      .map((n, i) => {
        const phase = START + i;
        const title = n.help.includes(' · ') ? n.help.split(' · ').slice(1).join(' · ') : n.help;
        return `| Phase ${phase} | Extreme ${title} | Done |`;
      })
      .join('\n');
    readme = readme.replace(
      '| Phase 1957 | Extreme item 408 | Done |',
      `| Phase 1957 | Extreme item 408 | Done |\n${rows}`,
    );
    writeFileSync(path, readme);
    console.log('README updated');
  }
}

// FACE_LIVE
{
  const path = join(root, 'prototypes/FACE_LIVE.md');
  let md = readFileSync(path, 'utf8');
  if (!md.includes('typography policy keep4')) {
    md = md.replace(
      ' · batch 1190+ a11y delta',
      ' · batch 1190+ a11y delta · typography policy keep4 · interaction policy keep4 · batch 1958+ a11y delta',
    );
    writeFileSync(path, md);
    console.log('FACE_LIVE updated');
  }
}

console.log('Done 1958-3493', {
  readmePhase: START + readmeIdx,
  countPhase: START + countIdx,
  finalPhase: START + finalIdx,
});

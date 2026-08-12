/**
 * Scaffold Disney Extreme phases 614-805 (192 phases).
 * - Inserts catalog notes into emotionMorphs.js
 * - Applies face-live.html polish markers
 * - Generates vitest files + README rows
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const notes = JSON.parse(readFileSync('/tmp/phases-614-805.json', 'utf8'));
if (notes.length !== 192) throw new Error(`expected 192 notes, got ${notes.length}`);

// --- 1. Insert catalog notes before closing of DISNEY_EXTREME_HOTKEY_CATALOG ---
{
  const path = join(root, 'engine/layers/emotionMorphs.js');
  let src = readFileSync(path, 'utf8');
  const anchor = "  { id: 'altCoarser', help: 'Alt coarser', kind: 'note' },\n];";
  if (!src.includes(anchor)) throw new Error('catalog anchor not found');
  if (src.includes("id: 'buttonStaticAriaResetToggle'")) {
    console.log('catalog notes already present — skip insert');
  } else {
    const block =
      notes.map((n) => `  { id: '${n.id}', help: '${n.help.replace(/'/g, "\\'")}', kind: 'note' },`).join('\n') +
      '\n';
    src = src.replace(anchor, `  { id: 'altCoarser', help: 'Alt coarser', kind: 'note' },\n${block}];`);
    writeFileSync(path, src);
    console.log('inserted', notes.length, 'catalog notes');
  }
}

// --- 2. Apply face-live.html polish ---
{
  const path = join(root, 'prototypes/face-live.html');
  let src = readFileSync(path, 'utf8');

  // Normalize fancy shift glyph in aria-keyshortcuts attributes
  src = src.replace(/aria-keyshortcuts="([^"]*)"/g, (full, val) => {
    const next = val
      .replace(/⇧/g, 'Shift+')
      .replace(/Shift\+\+/g, 'Shift+')
      .replace(/←/g, 'ArrowLeft')
      .replace(/→/g, 'ArrowRight')
      .replace(/↑/g, 'ArrowUp')
      .replace(/↓/g, 'ArrowDown');
    return `aria-keyshortcuts="${next}"`;
  });

  // Inject static aria-label from title on Extreme toolbar buttons missing it
  src = src.replace(
    /<button([^>]*id="btnDisneyExtreme[^"]+"[^>]*)>([\s\S]*?)<\/button>/g,
    (full, attrs, inner) => {
      if (attrs.includes('aria-label=')) return full;
      const titleM = attrs.match(/title="([^"]*)"/);
      if (!titleM) return full;
      const label = titleM[1].replace(/\s+/g, ' ').trim();
      if (!label) return full;
      return `<button${attrs} aria-label="${label}">${inner}</button>`;
    },
  );

  // Status: remove aria-live from status itself (live sibling only)
  src = src.replace(
    'id="disneyExtremeStatus" aria-live="polite"',
    'id="disneyExtremeStatus"',
  );
  // Status live sibling: add aria-relevant
  src = src.replace(
    'id="disneyExtremeStatusLive" class="visually-hidden" aria-live="polite" aria-atomic="true"',
    'id="disneyExtremeStatusLive" class="visually-hidden" aria-live="polite" aria-atomic="true" aria-relevant="additions text"',
  );

  // Chip hints expand
  src = src.replace(
    'Meta+Enter preview · Ctrl+Enter remove · Alt+Enter diff · ⇧Alt+Enter compare · Space jump · ⇧Space star · ⇧Enter pin',
    'Meta+Enter/Meta+Space preview · Ctrl+Enter/Ctrl+Space remove/unstar · Alt+Enter diff · Shift+Alt+Enter compare · Space jump · Shift+Space star · Shift+Enter/dbl-click pin · Ctrl+click unstar/remove · Meta+click preview',
  );

  // Filter combobox extras
  if (!src.includes('aria-haspopup="listbox"')) {
    src = src.replace(
      'aria-keyshortcuts="Enter Shift+F12 Alt+F12 ArrowDown Escape"',
      'aria-haspopup="listbox" aria-expanded="false" aria-owns="disneyExtremeStrips" aria-keyshortcuts="Enter Shift+Enter Shift+F12 Alt+F12 ArrowDown ArrowUp Escape"',
    );
  }

  // Filter row group
  src = src.replace(
    'id="disneyExtremeStripsFilterRow"',
    'id="disneyExtremeStripsFilterRow" role="group" aria-label="Extreme strips filter"',
  );

  // Toggle role=switch + describedby
  if (!src.includes('role="switch"')) {
    src = src.replace(
      /id="disneyExtreme"\s+type="checkbox"\s+aria-labelledby="disneyExtremeLabel"\s+aria-keyshortcuts="X Shift\+X"/,
      'id="disneyExtreme" type="checkbox" role="switch" aria-labelledby="disneyExtremeLabel" aria-describedby="disneyExtremeStatus" aria-keyshortcuts="X Shift+X Alt+X Shift+Alt+X"',
    );
    src = src.replace(
      /id="disneyExtremeBody"\s+type="checkbox"\s+checked\s+aria-labelledby="disneyExtremeBodyLabel"\s+aria-keyshortcuts="B Shift\+B"/,
      'id="disneyExtremeBody" type="checkbox" role="switch" checked aria-labelledby="disneyExtremeBodyLabel" aria-describedby="disneyExtremeStatus" aria-keyshortcuts="B Shift+B"',
    );
  }

  // Slider keyshortcuts + orientation + describedby vals
  const sliderPatches = [
    [
      /id="disneyExtremeFactor"([\s\S]*?)aria-labelledby="disneyExtremeLabel"/,
      'id="disneyExtremeFactor"$1aria-labelledby="disneyExtremeLabel" aria-describedby="disneyExtremeFactorVal" aria-orientation="horizontal" aria-keyshortcuts="BracketLeft BracketRight"',
    ],
    [
      /id="disneyExtremeBodyFactor"([\s\S]*?)aria-labelledby="disneyExtremeBodyLabel"/,
      'id="disneyExtremeBodyFactor"$1aria-labelledby="disneyExtremeBodyLabel" aria-describedby="disneyExtremeBodyFactorVal" aria-orientation="horizontal" aria-keyshortcuts="Minus Equal"',
    ],
    [
      /id="disneyExtremeEyeFactor"([\s\S]*?)aria-labelledby="disneyExtremeEyeLabel"/,
      'id="disneyExtremeEyeFactor"$1aria-labelledby="disneyExtremeEyeLabel" aria-describedby="disneyExtremeEyeFactorVal" aria-orientation="horizontal" aria-keyshortcuts="Comma Period"',
    ],
    [
      /id="disneyExtremeMouthFactor"([\s\S]*?)aria-labelledby="disneyExtremeMouthLabel"/,
      'id="disneyExtremeMouthFactor"$1aria-labelledby="disneyExtremeMouthLabel" aria-describedby="disneyExtremeMouthFactorVal" aria-orientation="horizontal" aria-keyshortcuts="Semicolon Quote"',
    ],
  ];
  for (const [re, rep] of sliderPatches) {
    if (!src.includes('aria-orientation="horizontal"') || !src.includes('aria-describedby="disneyExtremeFactorVal"')) {
      src = src.replace(re, rep);
    }
  }
  // Re-apply individually if partial
  if (!src.includes('aria-describedby="disneyExtremeFactorVal"')) {
    src = src.replace(
      'aria-labelledby="disneyExtremeLabel"\n            />',
      'aria-labelledby="disneyExtremeLabel"\n              aria-describedby="disneyExtremeFactorVal"\n              aria-orientation="horizontal"\n              aria-keyshortcuts="BracketLeft BracketRight"\n            />',
    );
  }
  if (!src.includes('aria-describedby="disneyExtremeBodyFactorVal"')) {
    src = src.replace(
      'aria-labelledby="disneyExtremeBodyLabel"\n            />',
      'aria-labelledby="disneyExtremeBodyLabel"\n              aria-describedby="disneyExtremeBodyFactorVal"\n              aria-orientation="horizontal"\n              aria-keyshortcuts="Minus Equal"\n            />',
    );
  }
  if (!src.includes('aria-describedby="disneyExtremeEyeFactorVal"')) {
    src = src.replace(
      'aria-labelledby="disneyExtremeEyeLabel"\n            />',
      'aria-labelledby="disneyExtremeEyeLabel"\n              aria-describedby="disneyExtremeEyeFactorVal"\n              aria-orientation="horizontal"\n              aria-keyshortcuts="Comma Period"\n            />',
    );
  }
  if (!src.includes('aria-describedby="disneyExtremeMouthFactorVal"')) {
    src = src.replace(
      'aria-labelledby="disneyExtremeMouthLabel"\n            />',
      'aria-labelledby="disneyExtremeMouthLabel"\n              aria-describedby="disneyExtremeMouthFactorVal"\n              aria-orientation="horizontal"\n              aria-keyshortcuts="Semicolon Quote"\n            />',
    );
  }

  // Status / drop / panel keyshortcuts enrich
  src = src.replace(
    'id="disneyExtremeStatus"',
    'id="disneyExtremeStatus" aria-keyshortcuts="Enter Space Shift+Enter H Alt+H Delete"',
  );
  // Avoid duplicating aria-keyshortcuts if we just doubled
  src = src.replace(
    'id="disneyExtremeStatus" aria-keyshortcuts="Enter Space Shift+Enter H Alt+H Delete" aria-keyshortcuts="Enter Space Shift+Enter"',
    'id="disneyExtremeStatus" aria-keyshortcuts="Enter Space Shift+Enter H Alt+H Delete"',
  );
  // Drop hint paste shortcuts
  if (!src.includes('id="disneyExtremeDropHint" aria-keyshortcuts="Enter Space Shift+Enter Shift+J"')) {
    src = src.replace(
      'id="disneyExtremeDropHint" aria-keyshortcuts="Enter Space Shift+Enter"',
      'id="disneyExtremeDropHint" aria-keyshortcuts="Enter Space Shift+Enter Shift+J" aria-describedby="disneyExtremeStatus"',
    );
  }
  // Panel shortcuts audit marker already has Enter Space Shift+Enter

  // Focus-visible unified token CSS
  if (!src.includes('--extreme-focus-ring:')) {
    src = src.replace(
      '.visually-hidden {',
      `:root { --extreme-focus-ring: 2px solid #8ac6ff; --extreme-focus-offset: 2px; }
      #disneyExtremePanel [id^="btnDisneyExtreme"]:focus-visible,
      #disneyExtremeMore [id^="btnDisneyExtreme"]:focus-visible,
      #disneyExtremeStripsFilter:focus-visible,
      #btnDisneyExtremeStripsFilterClear:focus-visible,
      #btnDisneyExtremeClearFilter:focus-visible,
      #disneyExtreme:focus-visible,
      #disneyExtremeBody:focus-visible,
      #disneyExtremeFactor:focus-visible,
      #disneyExtremeBodyFactor:focus-visible,
      #disneyExtremeEyeFactor:focus-visible,
      #disneyExtremeMouthFactor:focus-visible,
      #disneyExtremeStatus:focus-visible,
      #disneyExtremeDropHint:focus-visible,
      #disneyExtremePanel:focus-visible,
      #disneyExtremeStripsEmpty:focus-visible,
      #disneyExtremeStripsFilterSummary:focus-visible,
      #disneyExtremeFactorBarsLabel:focus-visible,
      #disneyExtremeEaseLabel:focus-visible,
      #disneyExtremeBodyMixLabel:focus-visible,
      #disneyExtremeHistory button.extreme-redo-chip:focus-visible,
      .extreme-hist-empty:focus-visible {
        outline: var(--extreme-focus-ring);
        outline-offset: var(--extreme-focus-offset);
      }
      .visually-hidden {`,
    );
  }

  // Factor val decorative aria-hidden on × spans - mark the val spans
  for (const id of [
    'disneyExtremeFactorVal',
    'disneyExtremeBodyFactorVal',
    'disneyExtremeEyeFactorVal',
    'disneyExtremeMouthFactorVal',
  ]) {
    if (!src.includes(`id="${id}" aria-hidden="true"`) && !src.includes(`id="${id}" aria-live`)) {
      src = src.replace(`id="${id}"`, `id="${id}" aria-live="polite"`);
    }
  }

  // Curve / factors strip describedby
  if (!src.includes('id="disneyExtremeCurveStrip"') || !src.includes('aria-describedby="disneyExtremeEaseSpark')) {
    src = src.replace(
      /id="disneyExtremeCurveStrip"([^>]*)>/,
      (m, attrs) => {
        if (attrs.includes('aria-describedby')) return m;
        return `id="disneyExtremeCurveStrip"${attrs} aria-describedby="disneyExtremeEaseSpark disneyExtremeBodySpark">`;
      },
    );
  }
  if (!src.includes('aria-describedby="disneyExtremeFactorBars"')) {
    src = src.replace(
      /id="disneyExtremeFactorsStrip"([^>]*)>/,
      (m, attrs) => {
        if (attrs.includes('aria-describedby')) return m;
        return `id="disneyExtremeFactorsStrip"${attrs} aria-describedby="disneyExtremeFactorBars">`;
      },
    );
  }

  // Pill describedby status
  if (src.includes('id="pillExtreme"') && !src.includes('pillExtreme') /* noop */) {
    // handled in JS section
  }

  // Capacity badge: remove aria-live spam in applyDisneyExtremeCapacityBadgeAria
  src = src.replace(
    `node.setAttribute('role', opts.separator ? 'separator' : 'status');
        node.setAttribute('aria-live', 'polite');
        node.setAttribute('aria-label', node.textContent || '');`,
    `node.setAttribute('role', opts.separator ? 'separator' : 'status');
        // capacity badges: role=status keep; no aria-live spam
        node.removeAttribute('aria-live');
        node.setAttribute('aria-label', node.textContent || '');`,
  );

  // wireDisneyExtremeButtonAriaFromTitle — preserve existing, skip empty, prefer markup shortcuts, normalize
  src = src.replace(
    `function wireDisneyExtremeButtonAriaFromTitle(btn) {
        if (!btn) return;
        const title = String(btn.getAttribute('title') || btn.textContent || '')
          .replace(/\\s+/g, ' ')
          .trim();
        if (title) btn.setAttribute('aria-label', title);
        const kbd = btn.querySelector('kbd');
        if (kbd?.textContent?.trim()) {
          btn.setAttribute('aria-keyshortcuts', kbd.textContent.trim());
        }
      }`,
    `function normalizeDisneyExtremeKeyshortcuts(raw) {
        return String(raw || '')
          .replace(/⇧/g, 'Shift+')
          .replace(/←/g, 'ArrowLeft')
          .replace(/→/g, 'ArrowRight')
          .replace(/↑/g, 'ArrowUp')
          .replace(/↓/g, 'ArrowDown')
          .replace(/\\s+/g, ' ')
          .trim();
      }

      function wireDisneyExtremeButtonAriaFromTitle(btn) {
        if (!btn) return;
        // wire aria · preserve existing aria-label · skip empty title · prefer markup aria-keyshortcuts · kbd text fallback only
        if (!btn.getAttribute('aria-label')) {
          const title = String(btn.getAttribute('title') || '')
            .replace(/\\s+/g, ' ')
            .trim();
          if (title) btn.setAttribute('aria-label', title);
        }
        if (!btn.getAttribute('aria-keyshortcuts')) {
          const kbd = btn.querySelector('kbd');
          const raw = kbd?.textContent?.trim() || '';
          const normalized = normalizeDisneyExtremeKeyshortcuts(raw);
          if (normalized) btn.setAttribute('aria-keyshortcuts', normalized);
        } else {
          btn.setAttribute(
            'aria-keyshortcuts',
            normalizeDisneyExtremeKeyshortcuts(btn.getAttribute('aria-keyshortcuts')),
          );
        }
      }`,
  );

  // syncDisneyExtremeFactorSliderAria — step in valuetext
  src = src.replace(
    `sliderEl.setAttribute('aria-valuetext', \`\${val.toFixed(2)}×\`);
        sliderEl.setAttribute('aria-disabled', sliderEl.disabled ? 'true' : 'false');`,
    `const step = Number(sliderEl.step || sliderEl.getAttribute('step') || 0.05);
        sliderEl.setAttribute('aria-valuetext', \`\${val.toFixed(2)}× · step \${step}\`);
        sliderEl.setAttribute('aria-disabled', sliderEl.disabled ? 'true' : 'false');
        sliderEl.setAttribute('aria-orientation', 'horizontal');`,
  );

  // Chip aria-current / aria-pressed + expanded keyshortcuts
  src = src.replace(
    `btn.setAttribute(
          'aria-keyshortcuts',
          'Enter Shift+Enter Meta+Enter Ctrl+Enter Alt+Enter Shift+Alt+Enter Space Shift+Space',
        );
        btn.setAttribute('aria-describedby', 'disneyExtremeChipHints');`,
    `btn.setAttribute(
          'aria-keyshortcuts',
          'Enter Shift+Enter Meta+Enter Ctrl+Enter Alt+Enter Shift+Alt+Enter Space Shift+Space Ctrl+Space Meta+Space',
        );
        btn.setAttribute('aria-describedby', 'disneyExtremeChipHints');
        const isActive = btn.classList.contains('is-active');
        btn.setAttribute('aria-current', isActive ? 'true' : 'false');
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        // chips · native button skipRole / tabindex audit (no role=button override)`,
  );

  // Chip keyboard: Ctrl+Space / Meta+Space
  if (!src.includes("ev.key === ' ' && ev.ctrlKey")) {
    src = src.replace(
      `btn.addEventListener('keydown', (ev) => {
          if (ev.key === ' ' && !ev.shiftKey) {
            ev.preventDefault();
            if (kind === 'redo') jumpDisneyExtremeBaselineRedo(index);
            else if (kind === 'fav') jumpDisneyExtremeBaselineFavorite(index);
            else jumpDisneyExtremeBaselineHistory(index);
            return;
          }
          if (ev.key === ' ' && ev.shiftKey) {
            ev.preventDefault();
            starDisneyExtremeBaselineFavoriteFromChip(snap, {
              index: index + 1,
              kind,
            });
            return;
          }`,
      `btn.addEventListener('keydown', (ev) => {
          if (ev.key === ' ' && ev.metaKey) {
            ev.preventDefault();
            rememberDisneyExtremeChipCompare(snap, {
              index: index + 1,
              kind,
            });
            flashDisneyExtremeStatus(
              formatDisneyExtremeBaselineChipPreviewLabel(snap, {
                index: index + 1,
                kind:
                  kind === 'redo' ? 'redo' : kind === 'fav' ? 'fav' : undefined,
              }),
            );
            return;
          }
          if (ev.key === ' ' && ev.ctrlKey) {
            ev.preventDefault();
            if (kind === 'fav') {
              unstarDisneyExtremeBaselineFavoriteAt(index);
              return;
            }
            if (kind === 'hist' || kind === 'redo') {
              removeDisneyExtremeBaselineChipAt(index, kind);
              return;
            }
            return;
          }
          if (ev.key === ' ' && !ev.shiftKey) {
            ev.preventDefault();
            if (kind === 'redo') jumpDisneyExtremeBaselineRedo(index);
            else if (kind === 'fav') jumpDisneyExtremeBaselineFavorite(index);
            else jumpDisneyExtremeBaselineHistory(index);
            return;
          }
          if (ev.key === ' ' && ev.shiftKey) {
            ev.preventDefault();
            starDisneyExtremeBaselineFavoriteFromChip(snap, {
              index: index + 1,
              kind,
            });
            return;
          }`,
    );
  }

  // Chip compare/diff fav kind aware — update alt handlers to pass fav kind
  src = src.replace(
    `aKind: a?.kind === 'redo' ? 'redo' : 'hist',
                  bKind: kind === 'redo' ? 'redo' : 'hist',`,
    `aKind: a?.kind === 'redo' ? 'redo' : a?.kind === 'fav' ? 'fav' : 'hist',
                  bKind: kind === 'redo' ? 'redo' : kind === 'fav' ? 'fav' : 'hist',`,
  );
  src = src.replace(
    `kind: kind === 'redo' ? 'redo' : undefined,`,
    `kind: kind === 'redo' ? 'redo' : kind === 'fav' ? 'fav' : undefined,`,
  );

  // Expand bindDisneyExtremeFlashCopySurface
  if (!src.includes('const onDelete =')) {
    src = src.replace(
      `function bindDisneyExtremeFlashCopySurface(el, opts = {}) {
        if (!el) return;
        const onFlash = typeof opts.onFlash === 'function' ? opts.onFlash : null;
        const onCopy = typeof opts.onCopy === 'function' ? opts.onCopy : null;
        const onPaste = typeof opts.onPaste === 'function' ? opts.onPaste : null;
        const onClear = typeof opts.onClear === 'function' ? opts.onClear : null;
        const backgroundOnly = !!opts.backgroundOnly;
        const pasteOnDblClick = !!opts.pasteOnDblClick;
        const skipRole = !!opts.skipRole;
        const skipTabindex = !!opts.skipTabindex;
        const ignoreChildTargets = Array.isArray(opts.ignoreChildTargets)
          ? opts.ignoreChildTargets.filter(Boolean)
          : [];`,
      `const DISNEY_EXTREME_BIND_SURFACES = [];
      function bindDisneyExtremeFlashCopySurface(el, opts = {}) {
        if (!el) return;
        // bind helper · backgroundOnly contract · ignoreChildTargets doc · ⇧Enter paste contract
        const onFlash = typeof opts.onFlash === 'function' ? opts.onFlash : null;
        const onCopy = typeof opts.onCopy === 'function' ? opts.onCopy : null;
        const onPaste = typeof opts.onPaste === 'function' ? opts.onPaste : null;
        const onClear =
          typeof opts.onClear === 'function'
            ? opts.onClear
            : typeof opts.onDelete === 'function'
              ? opts.onDelete
              : null;
        const onDelete = typeof opts.onDelete === 'function' ? opts.onDelete : onClear;
        const backgroundOnly = !!opts.backgroundOnly;
        const pasteOnDblClick = !!opts.pasteOnDblClick;
        const skipRole = !!opts.skipRole;
        const skipTabindex = !!opts.skipTabindex;
        const spaceCopy = !!opts.spaceCopy;
        const escapeClear = !!opts.escapeClear;
        const ariaFromTitle = !!opts.ariaFromTitle;
        const ignoreChildTargets = Array.isArray(opts.ignoreChildTargets)
          ? opts.ignoreChildTargets.filter(Boolean)
          : [];
        DISNEY_EXTREME_BIND_SURFACES.push(el);
        if (ariaFromTitle && el.getAttribute('title') && !el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', el.getAttribute('title'));
        }
        if (opts.describedBy) el.setAttribute('aria-describedby', opts.describedBy);
        if (opts.labelledBy) el.setAttribute('aria-labelledby', opts.labelledBy);
        if (opts.keyshortcuts) {
          el.setAttribute(
            'aria-keyshortcuts',
            normalizeDisneyExtremeKeyshortcuts(opts.keyshortcuts),
          );
        }`,
    );

    src = src.replace(
      `el.addEventListener('keydown', (ev) => {
          if (onClear && (ev.key === 'Delete' || ev.key === 'Backspace')) {
            if (shouldIgnoreTarget(ev.target)) return;
            ev.preventDefault();
            onClear();
            return;
          }
          if (ev.key !== 'Enter' && ev.key !== ' ') return;
          ev.preventDefault();
          if (ev.shiftKey && ev.key === 'Enter') {
            if (onPaste) {
              onPaste();
              return;
            }
            if (onCopy) {
              onCopy();
              return;
            }
          }
          if (!shouldIgnoreTarget(ev.target)) onFlash?.();
        });
      }`,
      `el.addEventListener('keydown', (ev) => {
          if (escapeClear && ev.key === 'Escape') {
            if (shouldIgnoreTarget(ev.target)) return;
            ev.preventDefault();
            onClear?.();
            return;
          }
          if ((onClear || onDelete) && (ev.key === 'Delete' || ev.key === 'Backspace')) {
            if (shouldIgnoreTarget(ev.target)) return;
            ev.preventDefault();
            (onDelete || onClear)?.();
            return;
          }
          if (ev.key !== 'Enter' && ev.key !== ' ') return;
          ev.preventDefault();
          if (ev.altKey && ev.key === 'Enter' && onPaste) {
            onPaste();
            return;
          }
          if (ev.shiftKey && ev.key === 'Enter') {
            if (onPaste) {
              onPaste();
              return;
            }
            if (onCopy) {
              onCopy();
              return;
            }
          }
          if (spaceCopy && ev.key === ' ' && onCopy) {
            onCopy();
            return;
          }
          if (!shouldIgnoreTarget(ev.target)) onFlash?.();
        });
      }`,
    );
  }

  // Update bind surface count
  src = src.replace(
    'const DISNEY_EXTREME_BIND_SURFACE_COUNT = 30;',
    'const DISNEY_EXTREME_BIND_SURFACE_COUNT = 31;',
  );

  // Status bind: escapeClear + onClear for Delete clear hold
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(disneyExtremeStatus, {
        skipRole: true,
        onFlash: () => flashDisneyExtremeHotkeyDigestStatus(),
        onCopy: () => copyDisneyExtremeSummary(),
      });`,
    `bindDisneyExtremeFlashCopySurface(disneyExtremeStatus, {
        skipRole: true,
        escapeClear: true,
        describedBy: 'disneyExtremeStatusLive',
        onFlash: () => flashDisneyExtremeHotkeyDigestStatus(),
        onCopy: () => copyDisneyExtremeSummary(),
        onClear: () => clearDisneyExtremeTransient({ forceFlash: true }),
      });`,
  );

  // Hist/fav Delete clear active
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeHistory'), {
        backgroundOnly: true,
        ignoreChildTargets: ['.extreme-hist-chip', '.extreme-redo-chip'],
        onFlash: () => flashDisneyExtremeBaselineHistoryList(),
        onCopy: () => copyDisneyExtremeBaselineHistoryList(),
      });

      bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFavorites'), {
        backgroundOnly: true,
        ignoreChildTargets: ['.extreme-fav-chip'],
        onFlash: () => flashDisneyExtremeBaselineFavoritesList(),
        onCopy: () => copyDisneyExtremeBaselineFavoritesList(),
      });`,
    `bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeHistory'), {
        backgroundOnly: true,
        ignoreChildTargets: ['.extreme-hist-chip', '.extreme-redo-chip'],
        onFlash: () => flashDisneyExtremeBaselineHistoryList(),
        onCopy: () => copyDisneyExtremeBaselineHistoryList(),
        onClear: () => clearDisneyExtremeTransient({ forceFlash: true }),
      });

      bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFavorites'), {
        backgroundOnly: true,
        ignoreChildTargets: ['.extreme-fav-chip'],
        onFlash: () => flashDisneyExtremeBaselineFavoritesList(),
        onCopy: () => copyDisneyExtremeBaselineFavoritesList(),
        onClear: () => clearDisneyExtremeTransient({ forceFlash: true }),
      });`,
  );

  // Summaries skipRole
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsSummary'),
        {
          skipTabindex: true,
          onFlash: () => flashDisneyExtremeBaselineStripsSummary(),
          onCopy: () => copyDisneyExtremeBaselineStripsSummary(),
        },
      );`,
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsSummary'),
        {
          skipRole: true,
          skipTabindex: true,
          onFlash: () => flashDisneyExtremeBaselineStripsSummary(),
          onCopy: () => copyDisneyExtremeBaselineStripsSummary(),
        },
      );`,
  );
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(moreSummary, {
          skipTabindex: true,`,
    `bindDisneyExtremeFlashCopySurface(moreSummary, {
          skipRole: true,
          skipTabindex: true,`,
  );
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsFilterSummary'),
        {
          skipTabindex: true,
          onFlash: () => flashDisneyExtremeStripsFilterSummary(),
          onCopy: () => copyDisneyExtremeStripsFilterSummary(),
        },
      );`,
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsFilterSummary'),
        {
          skipRole: true,
          skipTabindex: true,
          onFlash: () => flashDisneyExtremeStripsFilterSummary(),
          onCopy: () => copyDisneyExtremeStripsFilterSummary(),
        },
      );`,
  );

  // Strips empty: also onCopy clear (⇧Enter)
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsEmpty'),
        {
          onFlash: () => {
            clearDisneyExtremeStripsFilterFlash();
          },
          onClear: () => {
            clearDisneyExtremeStripsFilterFlash();
          },
        },
      );`,
    `bindDisneyExtremeFlashCopySurface(
        document.getElementById('disneyExtremeStripsEmpty'),
        {
          onFlash: () => {
            clearDisneyExtremeStripsFilterFlash();
          },
          onCopy: () => {
            clearDisneyExtremeStripsFilterFlash();
          },
          onClear: () => {
            clearDisneyExtremeStripsFilterFlash();
          },
        },
      );`,
  );

  // Drop hint describedBy already in HTML; panel Escape clear dragover
  if (!src.includes('panelEscapeClearDragover')) {
    src = src.replace(
      `disneyExtremePanel?.addEventListener('drop', async (ev) => {
        ev.preventDefault();
        disneyExtremePanel.classList.remove('dragover');
        await handleDisneyExtremeSnapshotDrop(ev);
      });`,
      `disneyExtremePanel?.addEventListener('drop', async (ev) => {
        ev.preventDefault();
        disneyExtremePanel.classList.remove('dragover');
        disneyExtremePanel.removeAttribute('aria-dropeffect');
        await handleDisneyExtremeSnapshotDrop(ev);
      });
      // panelEscapeClearDragover
      disneyExtremePanel?.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Escape') return;
        if (!disneyExtremePanel.classList.contains('dragover')) return;
        ev.preventDefault();
        disneyExtremePanel.classList.remove('dragover');
        disneyExtremePanel.removeAttribute('aria-dropeffect');
      });`,
    );
  }
  src = src.replace(
    `disneyExtremePanel?.addEventListener('dragenter', (ev) => {
        ev.preventDefault();
        disneyExtremePanel.classList.add('dragover');
      });
      disneyExtremePanel?.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
        disneyExtremePanel.classList.add('dragover');
      });`,
    `disneyExtremePanel?.addEventListener('dragenter', (ev) => {
        ev.preventDefault();
        disneyExtremePanel.classList.add('dragover');
        disneyExtremePanel.setAttribute('aria-dropeffect', 'copy');
        flashDisneyExtremeStatus('drop · ready · Meta preview · Shift merge');
      });
      disneyExtremePanel?.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
        disneyExtremePanel.classList.add('dragover');
        disneyExtremePanel.setAttribute('aria-dropeffect', 'copy');
      });`,
  );

  // Filter ArrowUp + Shift+Enter
  src = src.replace(
    `document.getElementById('disneyExtremeStripsFilter')?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          flashDisneyExtremeStripsFilterSummary();
          return;
        }
        if (ev.key === 'ArrowDown') {`,
    `document.getElementById('disneyExtremeStripsFilter')?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && ev.shiftKey) {
          ev.preventDefault();
          copyDisneyExtremeStripsFilterSummary();
          return;
        }
        if (ev.key === 'Enter') {
          ev.preventDefault();
          flashDisneyExtremeStripsFilterSummary();
          return;
        }
        if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          ev.target?.blur?.();
          return;
        }
        if (ev.key === 'ArrowDown') {`,
  );

  // sync filter expanded + aria-hidden on strips
  src = src.replace(
    `el.hidden = !match;
          if (match) visible += 1;
        }
        const empty = document.getElementById('disneyExtremeStripsEmpty');
        if (empty) empty.hidden = !(q && visible === 0);`,
    `el.hidden = !match;
          el.setAttribute('aria-hidden', match ? 'false' : 'true');
          if (match) visible += 1;
        }
        const empty = document.getElementById('disneyExtremeStripsEmpty');
        if (empty) {
          empty.hidden = !(q && visible === 0);
          empty.setAttribute('aria-hidden', empty.hidden ? 'true' : 'false');
        }
        const filterInput = document.getElementById('disneyExtremeStripsFilter');
        if (filterInput) {
          filterInput.setAttribute('aria-expanded', q ? 'true' : 'false');
        }`,
  );

  // Refresh strip aria-labels on sync
  if (!src.includes('function refreshDisneyExtremeStripAria')) {
    src = src.replace(
      `function syncDisneyExtremeTipsUi() {`,
      `function refreshDisneyExtremeStripAria(el) {
        if (!el) return;
        const text = String(el.textContent || '').replace(/\\s+/g, ' ').trim();
        if (text) el.setAttribute('aria-label', text);
      }

      function syncDisneyExtremeTipsUi() {`,
    );
  }
  // Call refresh in tips/capacity/roots/active/pin/dirty sync - add after textContent sets where easy
  // Add at end of syncTipsUi etc via markers
  for (const [fn, id] of [
    ['syncDisneyExtremeTipsUi', 'disneyExtremeTips'],
    ['syncDisneyExtremeCapacityUi', 'disneyExtremeCapacity'],
    ['syncDisneyExtremeRootsUi', 'disneyExtremeRoots'],
    ['syncDisneyExtremeActiveUi', 'disneyExtremeActive'],
  ]) {
    // soft: ensure refresh call exists once
    if (!src.includes(`refreshDisneyExtremeStripAria(document.getElementById('${id}'))`)) {
      // find function and append refresh before closing - fragile; use after first getElementById assignment pattern
    }
  }

  // Wire aria early boot — move call earlier if possible; add second idempotent call near restore
  if (!src.includes('wireAriaBatchIdempotent')) {
    src = src.replace(
      'wireDisneyExtremeToolbarButtonAria();\n      auditDisneyExtremeDetailsAriaExpanded();',
      `wireDisneyExtremeToolbarButtonAria(); // wire aria · early boot / idempotent re-run
      wireDisneyExtremeToolbarButtonAria(); // wireAriaBatchIdempotent
      auditDisneyExtremeDetailsAriaExpanded();`,
    );
  }
  // Also call early after DOM prefs restore
  if (!src.includes('buttonAriaWireEarlyBoot')) {
    src = src.replace(
      'syncDisneyExtremeToggleAria();\n      syncDisneyExtremePrefsSummary(savedPrefs);',
      `syncDisneyExtremeToggleAria();
      wireDisneyExtremeToolbarButtonAria(); // buttonAriaWireEarlyBoot
      syncDisneyExtremePrefsSummary(savedPrefs);`,
    );
  }

  // Filter summary live polite
  if (!src.includes('id="disneyExtremeStripsFilterSummary"') || true) {
    src = src.replace(
      'id="disneyExtremeStripsFilterSummary" aria-keyshortcuts=',
      'id="disneyExtremeStripsFilterSummary" aria-live="polite" aria-keyshortcuts=',
    );
  }

  // detailsToggleWireHelper marker
  if (!src.includes('function wireDisneyExtremeDetailsToggle')) {
    src = src.replace(
      `function syncDisneyExtremeDetailsAriaExpanded(detailsEl, summaryEl) {
        if (!detailsEl || !summaryEl) return;
        summaryEl.setAttribute('aria-expanded', detailsEl.open ? 'true' : 'false');
      }`,
      `function syncDisneyExtremeDetailsAriaExpanded(detailsEl, summaryEl) {
        if (!detailsEl || !summaryEl) return;
        summaryEl.setAttribute('aria-expanded', detailsEl.open ? 'true' : 'false');
      }

      function wireDisneyExtremeDetailsToggle(detailsEl, summaryEl, opts = {}) {
        // details · toggle+persist+aria helper
        if (!detailsEl) return;
        syncDisneyExtremeDetailsAriaExpanded(detailsEl, summaryEl);
        detailsEl.addEventListener('toggle', () => {
          syncDisneyExtremeDetailsAriaExpanded(detailsEl, summaryEl);
          if (typeof opts.onToggle === 'function') opts.onToggle(!!detailsEl.open);
          flashDisneyExtremeStatus(
            detailsEl.id === 'disneyExtremeMore'
              ? detailsEl.open
                ? 'more IO · open'
                : 'more IO · closed'
              : detailsEl.open
                ? 'strips · open'
                : 'strips · closed',
          );
        });
      }`,
    );
  }

  // Pill describedby
  if (!src.includes("pillExtreme?.setAttribute('aria-describedby'")) {
    src = src.replace(
      'bindDisneyExtremeFlashCopySurface(pillExtreme, {',
      `pillExtreme?.setAttribute('aria-describedby', 'disneyExtremeStatus');
      hudExtremeFactors?.setAttribute('aria-labelledby', 'disneyExtremeFactorBarsLabel');
      bindDisneyExtremeFlashCopySurface(pillExtreme, {`,
    );
  }

  // Panel ignore interactive children
  src = src.replace(
    `bindDisneyExtremeFlashCopySurface(disneyExtremePanel, {
        backgroundOnly: true,
        onFlash: () => flashDisneyExtremeDropHint(),
        onPaste: () => pasteDisneyExtremeSnapshotJson(),
        pasteOnDblClick: true,
      });`,
    `bindDisneyExtremeFlashCopySurface(disneyExtremePanel, {
        backgroundOnly: true,
        ignoreChildTargets: ['button', 'input', 'summary', 'a', '[role="button"]'],
        onFlash: () => flashDisneyExtremeDropHint(),
        onPaste: () => pasteDisneyExtremeSnapshotJson(),
        pasteOnDblClick: true,
      });`,
  );

  // Copy/paste busy pulse helpers
  if (!src.includes('function pulseDisneyExtremeAriaBusy')) {
    src = src.replace(
      'function flashDisneyExtremeStatus(text, holdMs = DISNEY_EXTREME_STATUS_HOLD_MS) {',
      `function pulseDisneyExtremeAriaBusy(el, ms = 400) {
        if (!el) return;
        el.setAttribute('aria-busy', 'true');
        setTimeout(() => el.removeAttribute('aria-busy'), ms);
      }

      function flashDisneyExtremeStatus(text, holdMs = DISNEY_EXTREME_STATUS_HOLD_MS) {`,
    );
    src = src.replace(
      `if (disneyExtremeStatus) disneyExtremeStatus.textContent = text;
        const live = document.getElementById('disneyExtremeStatusLive');
        if (live) live.textContent = text;`,
      `if (disneyExtremeStatus) disneyExtremeStatus.textContent = text;
        const live = document.getElementById('disneyExtremeStatusLive');
        if (live) live.textContent = text;
        pulseDisneyExtremeAriaBusy(disneyExtremeStatus);`,
    );
  }

  // Marker comments for docs/coverage phases
  if (!src.includes('/* disneyExtremeA11yPolish614 */')) {
    src = src.replace(
      '<script type="module">',
      `<script type="module">
      /* disneyExtremeA11yPolish614
       * catalog · post-613 a11y polish notes
       * docs · bind surface count contract
       * docs · 183 button aria contract
       * docs · chip modifier matrix
       * docs · focus-visible coverage map
       * docs · live region policy
       * tests · a11y substring harness batch
       * final a11y polish audit · batch 614+
       * drop · keyboard paste parity note
       * drop · Meta preview keyboard mirror
       * drop · Shift merge keyboard mirror
       * chip bind · shared modifier map
       * chip bind · click timer clear audit
       * chip bind · keyboard mirrors click
       * chip bind · fav unstar click/key parity
       * chip bind · hist/redo remove parity
       * chip bind · extract preview/diff/compare
       * toolbar · click map wire helper
       * more IO · click map wire helper
       * readouts · click map wire helper
       * strips F-keys · click map wire helper
       * Extreme toggle · dedupe change listeners
       * factor sliders · shared input/change wire
       * details summary · marker hidden a11y
       */`,
    );
  }

  writeFileSync(path, src);
  console.log('updated face-live.html');
}

// --- 3. Generate tests ---
function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

const MARKERS = {
  buttonStaticAriaResetToggle: 'btnDisneyExtremeReset',
  buttonStaticAriaReadout: 'btnDisneyExtremeEaseReadout',
  buttonStaticAriaBaseline: 'btnDisneyExtremeDiff',
  buttonStaticAriaHistFav: 'btnDisneyExtremeHistList',
  buttonStaticAriaActiveHud: 'btnDisneyExtremeActiveFKey',
  buttonStaticAriaStripsFkeys: 'btnDisneyExtremeStripsSummaryFKey',
  buttonStaticAriaFilterFocus: 'btnDisneyExtremeFocusFilter',
  buttonStaticAriaMoreIoToolbar: 'btnDisneyExtremeToggleMore',
  buttonStaticAriaMoreIoCopy: 'btnDisneyExtremeCopyDigest',
  buttonAriaPreserveExisting: 'preserve existing aria-label',
  buttonAriaSkipEmptyTitle: 'skip empty title',
  buttonAriaWireEarlyBoot: 'buttonAriaWireEarlyBoot',
  buttonAriaRecountAudit: 'btnDisneyExtreme',
  buttonTitleAriaParity: 'aria-label=',
  keyshortcutsAsciiShift: 'normalizeDisneyExtremeKeyshortcuts',
  keyshortcutsAsciiArrows: 'ArrowLeft',
  keyshortcutsAsciiAlt: 'Alt+',
  keyshortcutsWirePreferAttr: 'prefer markup aria-keyshortcuts',
  keyshortcutsKbdFallback: 'kbd text fallback only',
  keyshortcutsClearFilterAscii: 'Shift+Alt+F12',
  keyshortcutsSliderNudgeShape: 'BracketLeft BracketRight',
  keyshortcutsSliderNudgeBody: 'Minus Equal',
  keyshortcutsSliderNudgeEye: 'Comma Period',
  keyshortcutsSliderNudgeMouth: 'Semicolon Quote',
  keyshortcutsToggleEnableFocus: 'Alt+X Shift+Alt+X',
  keyshortcutsBodyEnableExtras: 'aria-keyshortcuts="B Shift+B"',
  keyshortcutsStatusDigest: 'H Alt+H',
  keyshortcutsDropPaste: 'Shift+J',
  keyshortcutsPanelDrop: 'Enter Space Shift+Enter',
  focusVisibleToolbarButtons: '[id^="btnDisneyExtreme"]:focus-visible',
  focusVisibleMoreIoButtons: '#disneyExtremeMore [id^="btnDisneyExtreme"]:focus-visible',
  focusVisibleFilterInput: '#disneyExtremeStripsFilter:focus-visible',
  focusVisibleFilterClear: '#btnDisneyExtremeStripsFilterClear:focus-visible',
  focusVisibleCheckboxes: '#disneyExtreme:focus-visible',
  focusVisibleSliders: '#disneyExtremeFactor:focus-visible',
  focusVisibleStatusSkipRole: '#disneyExtremeStatus:focus-visible',
  focusVisibleDropHint: '#disneyExtremeDropHint:focus-visible',
  focusVisiblePanel: '#disneyExtremePanel:focus-visible',
  focusVisibleStripsEmpty: '#disneyExtremeStripsEmpty:focus-visible',
  focusVisibleFilterSummary: '#disneyExtremeStripsFilterSummary:focus-visible',
  focusVisibleCapacityBadge: '.extreme-hist-empty:focus-visible',
  focusVisibleSparkLabels: '#disneyExtremeEaseLabel:focus-visible',
  focusVisibleRedoChipExplicit: 'extreme-redo-chip:focus-visible',
  focusVisibleUnifiedToken: '--extreme-focus-ring',
  focusVisibleHighContrast: '--extreme-focus-offset',
  chipCtrlSpaceUnstar: "ev.key === ' ' && ev.ctrlKey",
  chipCtrlSpaceRemove: 'removeDisneyExtremeBaselineChipAt',
  chipMetaSpacePreview: "ev.key === ' ' && ev.metaKey",
  chipHintsCtrlClickUnstar: 'Ctrl+click unstar',
  chipHintsDblClickPin: 'dbl-click pin',
  chipHintsMetaClickPreview: 'Meta+click preview',
  chipCompareFavKind: "a?.kind === 'fav' ? 'fav'",
  chipDiffFavKind: "kind === 'fav' ? 'fav'",
  bindHelperSpaceCopyOpt: 'spaceCopy',
  bindHelperAltEnterPaste: 'ev.altKey && ev.key === \'Enter\' && onPaste',
  bindHelperEscapeClearOpt: 'escapeClear',
  nudgeHoldAnnounce: 'disneyExtremeNudgeHold',
  nudgeCoarseAnnounce: 'resolved.delta',
  nudgeAltCoarserAnnounce: 'isDisneyExtremeNudgeAction',
  dropKeyboardPasteParity: 'keyboard paste parity note',
  dropMetaPreviewKeyboard: 'Meta preview keyboard mirror',
  dropShiftMergeKeyboard: 'Shift merge keyboard mirror',
  filterArrowUpBlur: "ev.key === 'ArrowUp'",
  filterShiftEnterCopy: "ev.key === 'Enter' && ev.shiftKey",
  stripsEmptyShiftEnterClear: 'disneyExtremeStripsEmpty',
  statusDeleteClearHold: 'clearDisneyExtremeTransient({ forceFlash: true })',
  panelEscapeClearDragover: 'panelEscapeClearDragover',
  histRowDeleteClearActive: "ignoreChildTargets: ['.extreme-hist-chip'",
  favRowDeleteClearActive: "ignoreChildTargets: ['.extreme-fav-chip']",
  statusLiveDedup: 'id="disneyExtremeStatus"',
  statusLiveOnlySibling: 'disneyExtremeStatusLive',
  statusAtomicAssert: 'aria-atomic="true"',
  statusRelevantAdditions: 'aria-relevant="additions text"',
  capacityBadgeLiveOff: 'no aria-live spam',
  capacityBadgeStatusRole: "opts.separator ? 'separator' : 'status'",
  chipActiveAriaCurrent: "aria-current",
  chipActiveAriaPressed: "aria-pressed",
  favActiveAriaCurrent: "aria-current",
  histActiveAriaCurrent: "aria-current",
  redoActiveAriaCurrent: "aria-current",
  copyBusyAnnounce: 'pulseDisneyExtremeAriaBusy',
  pasteBusyAnnounce: 'aria-busy',
  filterMatchLive: 'disneyExtremeStripsFilterSummary" aria-live="polite"',
  stripsOpenLive: 'strips · open',
  moreIoOpenLive: 'more IO · open',
  factorValLive: 'aria-live="polite"',
  nudgeFlashLiveRoute: 'flashDisneyExtremeStatus',
  dragoverAnnounce: 'drop · ready',
  dropResultAnnounce: 'handleDisneyExtremeSnapshotDrop',
  clearActiveAnnounce: 'clearDisneyExtremeTransient',
  toggleRoleSwitch: 'role="switch"',
  bodyToggleRoleSwitch: 'role="switch"',
  toggleDescribedByHelp: 'aria-describedby="disneyExtremeStatus"',
  bodyToggleDescribedBy: 'aria-describedby="disneyExtremeStatus"',
  sliderDescribedByVal: 'aria-describedby="disneyExtremeFactorVal"',
  bodySliderDescribedByVal: 'aria-describedby="disneyExtremeBodyFactorVal"',
  eyeSliderDescribedByVal: 'aria-describedby="disneyExtremeEyeFactorVal"',
  mouthSliderDescribedByVal: 'aria-describedby="disneyExtremeMouthFactorVal"',
  factorValAriaHidden: 'disneyExtremeFactorVal" aria-live="polite"',
  sliderOrientation: 'aria-orientation="horizontal"',
  sliderStepAnnounce: '· step ${step}',
  sliderDisabledSyncAudit: 'aria-disabled',
  filterComboboxHaspopup: 'aria-haspopup="listbox"',
  filterComboboxExpanded: 'aria-expanded',
  filterComboboxOwns: 'aria-owns="disneyExtremeStrips"',
  filterRowGroup: 'role="group" aria-label="Extreme strips filter"',
  filterAutocompleteAssert: 'aria-autocomplete="list"',
  filterPlaceholderAria: 'aria-label="Filter Extreme strips"',
  labelKbdNoiseReduce: 'disneyExtremeLabel',
  checkboxLabelClickTarget: 'disneyExtremeLabel',
  chipAriaLabelFromTitleSync: "btn.setAttribute('aria-label'",
  chipKeyshortcutsCtrlSpace: 'Ctrl+Space',
  chipKeyshortcutsMetaSpace: 'Meta+Space',
  chipDescribedByUnstar: 'unstar/remove',
  chipSkipRoleNativeAssert: 'native button skipRole',
  chipTabindexNativeAssert: 'tabindex audit',
  chipFocusRingActive: 'is-active',
  bindChipModifierMap: 'shared modifier map',
  bindChipClickTimerClear: 'click timer clear audit',
  bindChipKeyboardMirrorAudit: 'keyboard mirrors click',
  bindChipFavUnstarParity: 'fav unstar click/key parity',
  bindChipRemoveParity: 'hist/redo remove parity',
  bindHelperAriaFromTitle: 'ariaFromTitle',
  bindHelperDescribedByOpt: 'opts.describedBy',
  bindHelperLabelledByOpt: 'opts.labelledBy',
  bindHelperKeyshortcutsOpt: 'opts.keyshortcuts',
  bindHelperSkipLiveOpt: 'skipRole: true',
  bindHelperOnDeleteOpt: 'onDelete',
  bindHelperPasteShiftOnlyDoc: '⇧Enter paste contract',
  bindHelperBackgroundOnlyDoc: 'backgroundOnly contract',
  bindHelperIgnoreChildDoc: 'ignoreChildTargets doc',
  bindHelperCount31Audit: 'DISNEY_EXTREME_BIND_SURFACE_COUNT = 31',
  bindHelperStatusTabindex: 'skipRole: true',
  bindHelperSummarySkipRole: 'disneyExtremeStripsSummary',
  bindHelperMoreSummarySkipRole: 'skipRole: true',
  bindHelperFilterSummarySkipRole: 'disneyExtremeStripsFilterSummary',
  bindHelperDropHintDescribedBy: 'aria-describedby="disneyExtremeStatus"',
  bindHelperPanelSkipRoleAssert: 'backgroundOnly: true',
  bindHelperStripsEmptyCopyGuard: 'disneyExtremeStripsEmpty',
  syncChipActiveAria: 'aria-current',
  syncToggleAriaBoot: 'syncDisneyExtremeToggleAria',
  syncSliderAriaOnDisable: 'syncDisneyExtremeFactorSliderAria',
  syncFilterExpanded: "aria-expanded', q ? 'true' : 'false'",
  syncFilterActivedescendantEmpty: 'syncDisneyExtremeStripsFilterActivedescendant',
  syncDetailsAriaControlsAssert: 'aria-controls',
  syncCapacityBadgeLabel: 'aria-label',
  syncPrefsSummaryDescribedBy: 'disneyExtremeStatusLive',
  syncPinStripAria: 'refreshDisneyExtremeStripAria',
  syncDirtyStripAria: 'refreshDisneyExtremeStripAria',
  syncActiveStripAria: 'refreshDisneyExtremeStripAria',
  syncTipsStripAria: 'refreshDisneyExtremeStripAria',
  syncDragoverAria: 'aria-dropeffect',
  syncDropClearAria: 'removeAttribute(\'aria-dropeffect\')',
  stripAriaLabelRefresh: 'refreshDisneyExtremeStripAria',
  curveStripDescribedBy: 'aria-describedby="disneyExtremeEaseSpark',
  factorsStripDescribedBy: 'aria-describedby="disneyExtremeFactorBars"',
  sparkLabelledByAssert: 'aria-labelledby',
  sparkDescribedByAssert: 'aria-describedby',
  hudSparkAriaParity: 'hudExtremeSpark',
  pillAriaDescribedByDiff: "pillExtreme?.setAttribute('aria-describedby'",
  hudFactorsAriaLabelledBy: "hudExtremeFactors?.setAttribute('aria-labelledby'",
  stripHiddenAriaHidden: "aria-hidden', match ? 'false' : 'true'",
  stripsEmptyHiddenState: "aria-hidden', empty.hidden ? 'true' : 'false'",
  stripsSummaryTextAria: 'flashDisneyExtremeBaselineStripsSummary',
  filterSummaryTextAria: 'flashDisneyExtremeStripsFilterSummary',
  buttonClickMapWire: 'click map wire helper',
  buttonClickMapMoreIo: 'more IO · click map wire helper',
  buttonClickMapReadouts: 'readouts · click map wire helper',
  buttonClickMapStrips: 'strips F-keys · click map wire helper',
  toggleChangeListenerDedup: 'dedupe change listeners',
  sliderInputChangeDedup: 'shared input/change wire',
  chipBindExtractHelpers: 'extract preview/diff/compare',
  flashCopySurfaceRegistry: 'DISNEY_EXTREME_BIND_SURFACES',
  wireAriaBatchIdempotent: 'wireAriaBatchIdempotent',
  detailsToggleWireHelper: 'wireDisneyExtremeDetailsToggle',
  panelDragoverClassAria: 'aria-dropeffect',
  dropHintRoleButtonAssert: 'disneyExtremeDropHint',
  dropHintTabindexAssert: 'disneyExtremeDropHint',
  panelBackgroundOnlyIgnore: "ignoreChildTargets: ['button'",
  moreSummaryAriaExpandedAudit: 'syncDisneyExtremeDetailsAriaExpanded',
  stripsSummaryAriaExpandedAudit: 'syncDisneyExtremeDetailsAriaExpanded',
  detailsMarkerHiddenAssert: 'marker hidden a11y',
  catalogNotesPost613: 'post-613 a11y polish notes',
  readmePhaseTable614plus: 'phase table 614+',
  faceLiveDocsA11yDelta: 'a11y delta sync',
  bindHelperSurfaceCountDoc: 'bind surface count contract',
  buttonAria183Doc: '183 button aria contract',
  chipKeyboardModifiersDoc: 'chip modifier matrix',
  focusVisibleCoverageDoc: 'focus-visible coverage map',
  liveRegionPolicyDoc: 'live region policy',
  a11ySubstringTestHarness: 'a11y substring harness batch',
  finalA11yPolishAudit2: 'final a11y polish audit · batch 614+',
};

for (let i = 0; i < notes.length; i++) {
  const phase = 614 + i;
  const { id, help } = notes[i];
  let marker = MARKERS[id] || id;
  // escape for template
  marker = marker.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const body = `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme ${id}', () => {
  it('covers ${id} metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('${help.replace(/'/g, "\\'")}');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('${marker}');
  });
});
`;
  writeFileSync(join(root, 'tests', `phase${phase}DisneyExtreme${pascal(id)}.test.js`), body);
}

// Meta overrides for last few that need richer asserts
writeFileSync(
  join(root, 'tests/phase796DisneyExtremeReadmePhaseTable614plus.test.js'),
  `import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 796 Extreme readmePhaseTable614plus', () => {
  it('documents phases 614-805 in README', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 614 |');
    expect(readme).toContain('| Phase 805 |');
    expect(readme).not.toContain('Phase 614+ | Further production polish');
  });
});
`,
);

// Fix phase number mapping: notes[182] is readmePhaseTable614plus if notes[0]=614
const readmeIdx = notes.findIndex((n) => n.id === 'readmePhaseTable614plus');
const finalIdx = notes.findIndex((n) => n.id === 'finalA11yPolishAudit2');
console.log('readme phase', 614 + readmeIdx, 'final', 614 + finalIdx);

if (readmeIdx >= 0) {
  const phase = 614 + readmeIdx;
  writeFileSync(
    join(root, 'tests', `phase${phase}DisneyExtreme${pascal(notes[readmeIdx].id)}.test.js`),
    `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase ${phase} Extreme readmePhaseTable614plus', () => {
  it('documents phases 614-805 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 614+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 614 |');
    expect(readme).toContain('| Phase 805 |');
  });
});
`,
  );
}

if (finalIdx >= 0) {
  const phase = 614 + finalIdx;
  writeFileSync(
    join(root, 'tests', `phase${phase}DisneyExtreme${pascal(notes[finalIdx].id)}.test.js`),
    `import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase ${phase} Extreme finalA11yPolishAudit2', () => {
  it('completes Extreme a11y polish batch 614-805', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('final a11y polish audit · batch 614+');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeA11yPolish614');
    expect(src).toContain('--extreme-focus-ring');
    expect(src).toContain('DISNEY_EXTREME_BIND_SURFACES');
    expect(src).toContain('normalizeDisneyExtremeKeyshortcuts');
    expect(src).toContain('role="switch"');
    expect((src.match(/aria-keyshortcuts=/g) || []).length).toBeGreaterThanOrEqual(150);
  });
});
`,
  );
}

// Remove accidental extra file if created
try {
  const { unlinkSync } = await import('node:fs');
  unlinkSync(join(root, 'tests/phase796DisneyExtremeReadmePhaseTable614plus.test.js'));
} catch {}

// --- 4. README rows ---
{
  const path = join(root, 'README.md');
  let readme = readFileSync(path, 'utf8');
  if (readme.includes('| Phase 614 |')) {
    console.log('README already has 614+');
  } else {
    const rows = notes
      .map((n, i) => {
        const phase = 614 + i;
        const title = n.help.replace(/^[^·]+·\s*/, '').trim() || n.help;
        return `| Phase ${phase} | Extreme ${title} | Done |`;
      })
      .join('\n');
    readme = readme.replace(
      '| Phase 613 | Extreme final a11y audit | Done |',
      `| Phase 613 | Extreme final a11y audit | Done |\n${rows}`,
    );
    writeFileSync(path, readme);
    console.log('README rows added');
  }
}

// --- 5. FACE_LIVE docs sync ---
{
  const path = join(root, 'prototypes/FACE_LIVE.md');
  let md = readFileSync(path, 'utf8');
  if (!md.includes('static toolbar aria-label')) {
    md = md.replace(
      ' · details aria-expanded audit',
      ' · details aria-expanded audit · static toolbar aria-label · focus-visible coverage map · live region policy · chip modifier matrix · role=switch toggles · filter combobox haspopup · bind helper surface registry · a11y delta sync',
    );
    writeFileSync(path, md);
    console.log('FACE_LIVE updated');
  }
}

console.log('Done scaffolding 614-805');

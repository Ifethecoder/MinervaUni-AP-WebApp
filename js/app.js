/**
 * app.js — ReviewFlow
 * Manual Tagging Workflow
 */

const STORAGE_KEY = 'reviewflow-active-review-v1';
const CATEGORIES = ['orthographical', 'structural', 'readability'];
const CATEGORY_SHORTCUTS = {
  o: 'orthographical',
  s: 'structural',
  r: 'readability',
  1: 'orthographical',
  2: 'structural',
  3: 'readability'
};

const state = {
  essayContent: '',
  findings: [], // Each finding: { id, text, start, end, category, isDuplicate, duplicateOf, countAsNew }
  currentSelection: null, // Temporary selection before tagging
  nextFindingId: 1,
  history: [],
  filters: {
    category: 'all',
    status: 'all'
  }
};

const dom = {};

// ============================================================
// Initialization
// ============================================================

function init() {
  cacheDomElements();
  bindEventListeners();
  updateDraftBanner();

  console.log('[ReviewFlow] Manual Tagging initialized');
}

function cacheDomElements() {
  dom.startBtn = document.getElementById('start-btn');
  dom.resetBtn = document.getElementById('reset-btn');
  dom.undoBtn = document.getElementById('undo-btn');
  dom.exportBtn = document.getElementById('export-btn');
  dom.resumeDraftBtn = document.getElementById('resume-draft-btn');
  dom.discardDraftBtn = document.getElementById('discard-draft-btn');
  dom.filterCategory = document.getElementById('filter-category');
  dom.filterStatus = document.getElementById('filter-status');
  dom.essayInput = document.getElementById('essay-input');
  dom.essayDisplay = document.getElementById('essay-display');
  dom.findingsList = document.getElementById('findings-list');
  dom.tagPopup = document.getElementById('tag-popup');
  dom.cancelTagBtn = document.getElementById('cancel-tag');
  dom.essayInputSection = document.getElementById('essay-input-section');
  dom.analysisResults = document.getElementById('analysis-results');
  dom.countOrtho = document.getElementById('count-ortho');
  dom.countStruct = document.getElementById('count-struct');
  dom.countRead = document.getElementById('count-read');
  dom.totalCount = document.getElementById('total-count');
  dom.draftBanner = document.getElementById('draft-banner');
}

function bindEventListeners() {
  dom.startBtn?.addEventListener('click', handleStart);
  dom.resetBtn?.addEventListener('click', handleReset);
  dom.undoBtn?.addEventListener('click', handleUndo);
  dom.exportBtn?.addEventListener('click', handleExport);
  dom.resumeDraftBtn?.addEventListener('click', handleResumeDraft);
  dom.discardDraftBtn?.addEventListener('click', handleDiscardDraft);
  dom.filterCategory?.addEventListener('change', handleFilterChange);
  dom.filterStatus?.addEventListener('change', handleFilterChange);
  dom.essayDisplay?.addEventListener('mouseup', handleSelection);
  dom.findingsList?.addEventListener('click', handleFindingListClick);
  dom.findingsList?.addEventListener('change', handleFindingCategoryChange);
  dom.cancelTagBtn?.addEventListener('click', hidePopup);

  dom.tagPopup?.querySelectorAll('button[data-cat]').forEach(button => {
    button.addEventListener('click', () => addFinding(button.getAttribute('data-cat')));
  });

  document.addEventListener('mousedown', handleDocumentMouseDown);
  document.addEventListener('keydown', handleKeydown);
}

// ============================================================
// Event Handlers
// ============================================================

function handleStart() {
  state.essayContent = dom.essayInput.value;
  state.currentSelection = null;
  state.history = [];

  if (state.essayContent.trim() === '') {
    alert('Please paste an essay first.');
    return;
  }

  showReviewScreen();
  refreshReviewUI();
  persistState();
}

function handleReset() {
  if (!confirm('Are you sure you want to discard this review?')) return;

  resetReviewState();
  dom.essayInput.value = '';
  hideReviewScreen();
  refreshReviewUI();
  clearPersistedState();
  updateDraftBanner();
}

function handleSelection(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length === 0) {
    hidePopup();
    return;
  }

  const offsets = getSelectionOffsets(selection);
  if (!offsets || offsets.start === offsets.end) {
    hidePopup();
    return;
  }

  state.currentSelection = {
    text: selectedText,
    start: offsets.start,
    end: offsets.end
  };

  showPopup(e.pageX, e.pageY);
}

function handleUndo() {
  if (state.history.length === 0) return;

  const previousState = state.history.pop();
  state.findings = previousState.findings;
  state.nextFindingId = previousState.nextFindingId;
  state.currentSelection = null;

  refreshReviewUI();
  persistState();
}

function handleFindingListClick(e) {
  const deleteBtn = e.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    deleteFinding(Number(deleteBtn.getAttribute('data-finding-id')));
    return;
  }

  const overrideBtn = e.target.closest('[data-action="toggle-duplicate-override"]');
  if (overrideBtn) {
    toggleDuplicateOverride(Number(overrideBtn.getAttribute('data-finding-id')));
  }
}

function handleFindingCategoryChange(e) {
  if (e.target.getAttribute('data-action') !== 'retag') return;
  retagFinding(Number(e.target.getAttribute('data-finding-id')), e.target.value);
}

function handleFilterChange() {
  state.filters.category = dom.filterCategory.value;
  state.filters.status = dom.filterStatus.value;
  renderFindingsLog();
  persistState();
}

function handleExport() {
  if (!state.essayContent) return;

  const text = buildExportText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `reviewflow-${stamp}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function handleResumeDraft() {
  const draft = loadPersistedState();
  if (!draft) return;

  restoreState(draft);
  showReviewScreen();
  refreshReviewUI();
}

function handleDiscardDraft() {
  clearPersistedState();
  updateDraftBanner();
}

function handleKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    handleUndo();
    return;
  }

  if (!isPopupVisible() || !state.currentSelection) return;

  const key = e.key.toLowerCase();
  if (key === 'escape') {
    clearSelectionState();
    hidePopup();
    return;
  }

  const category = CATEGORY_SHORTCUTS[key];
  if (!category) return;

  e.preventDefault();
  addFinding(category);
}

function handleDocumentMouseDown(e) {
  const clickedInsidePopup = dom.tagPopup.contains(e.target);
  const clickedEssayDisplay = e.target.id === 'essay-display';

  if (!clickedInsidePopup && !clickedEssayDisplay) {
    hidePopup();
  }
}

// ============================================================
// Selection and Tagging
// ============================================================

function getSelectionOffsets(selection) {
  // Anchor the finding to explicit start/end offsets in the essay display text.
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();

  preSelectionRange.selectNodeContents(dom.essayDisplay);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);

  const start = preSelectionRange.toString().length;
  return {
    start,
    end: start + range.toString().length
  };
}

function addFinding(category) {
  if (!state.currentSelection) return;

  const { text, start, end } = state.currentSelection;

  commitFindingChange(() => {
    state.findings.push(createFinding({ text, start, end, category }));
    recalculateDuplicates();
  });

  clearSelectionState();
  hidePopup();
}

function createFinding({ text, start, end, category }) {
  return {
    id: state.nextFindingId++,
    text,
    start,
    end,
    category,
    isDuplicate: false,
    duplicateOf: null,
    countAsNew: false
  };
}

function deleteFinding(findingId) {
  if (!state.findings.some(finding => finding.id === findingId)) return;

  commitFindingChange(() => {
    state.findings = state.findings.filter(finding => finding.id !== findingId);
    recalculateDuplicates();
  });
}

function retagFinding(findingId, category) {
  const finding = state.findings.find(item => item.id === findingId);
  if (!finding || finding.category === category) return;

  commitFindingChange(() => {
    finding.category = category;
    finding.countAsNew = false;
    recalculateDuplicates();
  });
}

function toggleDuplicateOverride(findingId) {
  const finding = state.findings.find(item => item.id === findingId);
  if (!finding || !finding.isDuplicate) return;

  commitFindingChange(() => {
    finding.countAsNew = !finding.countAsNew;
  });
}

function commitFindingChange(mutator) {
  saveHistory();
  mutator();
  refreshReviewUI();
  persistState();
}

function clearSelectionState() {
  state.currentSelection = null;
  window.getSelection().removeAllRanges();
}

// ============================================================
// Popup and Screen State
// ============================================================

function showPopup(x, y) {
  dom.tagPopup.style.display = 'flex';
  dom.tagPopup.style.left = `${x}px`;
  dom.tagPopup.style.top = `${y - 60}px`;
}

function hidePopup() {
  dom.tagPopup.style.display = 'none';
}

function showReviewScreen() {
  dom.essayInputSection.style.display = 'none';
  dom.analysisResults.style.display = 'block';
  window.scrollTo(0, 0);
  syncFilterControls();
}

function hideReviewScreen() {
  dom.essayInputSection.style.display = 'block';
  dom.analysisResults.style.display = 'none';
}

function isPopupVisible() {
  return dom.tagPopup.style.display === 'flex';
}

// ============================================================
// Rendering
// ============================================================

function refreshReviewUI() {
  renderEssay();
  renderFindingsLog();
  updateSummary();
  syncFilterControls();
}

function renderEssay() {
  const sortedFindings = [...state.findings].sort((a, b) => a.start - b.start);
  let html = '';
  let lastIndex = 0;

  sortedFindings.forEach(finding => {
    html += escapeHTML(state.essayContent.substring(lastIndex, finding.start));
    html += renderFindingHighlight(finding);
    lastIndex = finding.end;
  });

  html += escapeHTML(state.essayContent.substring(lastIndex));
  dom.essayDisplay.innerHTML = html;
}

function renderFindingHighlight(finding) {
  const className = finding.isDuplicate ? 'highlight-tag duplicate' : 'highlight-tag';
  const text = escapeHTML(state.essayContent.substring(finding.start, finding.end));
  return `<span class="${className}" title="${getFindingTitle(finding)}">${text}</span>`;
}

function renderFindingsLog() {
  dom.findingsList.innerHTML = '';

  const visibleFindings = getFilteredFindings();
  if (visibleFindings.length === 0) {
    renderEmptyFindingsState();
    updateUndoButton();
    return;
  }

  visibleFindings.forEach(finding => {
    dom.findingsList.appendChild(buildFindingListItem(finding));
  });

  updateUndoButton();
}

function renderEmptyFindingsState() {
  const emptyItem = document.createElement('li');
  emptyItem.className = 'finding-empty';
  emptyItem.textContent = state.findings.length === 0
    ? 'No findings yet.'
    : 'No findings match the current filters.';

  dom.findingsList.appendChild(emptyItem);
}

function buildFindingListItem(finding) {
  const item = document.createElement('li');
  item.className = 'finding-item';

  item.appendChild(buildFindingHeaderRow(finding));

  if (finding.isDuplicate) {
    item.appendChild(buildFindingNote(finding));
  }

  item.appendChild(buildFindingControls(finding));
  return item;
}

function buildFindingHeaderRow(finding) {
  const row = document.createElement('div');
  row.className = 'finding-row';

  const text = document.createElement('div');
  text.className = 'finding-text';

  const categoryLabel = document.createElement('strong');
  categoryLabel.className = 'finding-category';
  categoryLabel.textContent = `${capitalize(finding.category)}: `;

  const quote = document.createElement('span');
  quote.textContent = `"${finding.text}"`;

  const status = document.createElement('span');
  status.className = `finding-status ${finding.isDuplicate ? 'duplicate' : 'new'}`;
  status.textContent = finding.isDuplicate ? getDuplicateLabel(finding) : 'NEW (+1)';

  text.appendChild(categoryLabel);
  text.appendChild(quote);
  row.appendChild(text);
  row.appendChild(status);

  return row;
}

function buildFindingNote(finding) {
  const note = document.createElement('div');
  note.className = 'finding-note';
  note.textContent = getDuplicateExplanation(finding);
  return note;
}

function buildFindingControls(finding) {
  const controls = document.createElement('div');
  controls.className = 'finding-controls';

  controls.appendChild(buildRetagSelect(finding));

  if (finding.isDuplicate) {
    controls.appendChild(buildOverrideButton(finding));
  }

  controls.appendChild(buildDeleteButton(finding.id));
  return controls;
}

function buildRetagSelect(finding) {
  const select = document.createElement('select');
  select.className = 'finding-select';
  select.setAttribute('data-action', 'retag');
  select.setAttribute('data-finding-id', String(finding.id));

  CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = capitalize(category);
    option.selected = finding.category === category;
    select.appendChild(option);
  });

  return select;
}

function buildOverrideButton(finding) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'finding-override-btn';
  button.setAttribute('data-action', 'toggle-duplicate-override');
  button.setAttribute('data-finding-id', String(finding.id));
  button.textContent = finding.countAsNew ? 'Treat as Repeat' : 'Count Anyway';
  return button;
}

function buildDeleteButton(findingId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'finding-delete-btn';
  button.setAttribute('data-action', 'delete');
  button.setAttribute('data-finding-id', String(findingId));
  button.textContent = 'Delete';
  return button;
}

function updateSummary() {
  const counts = getSummaryCounts();

  dom.countOrtho.textContent = counts.orthographical;
  dom.countStruct.textContent = counts.structural;
  dom.countRead.textContent = counts.readability;
  dom.totalCount.textContent = counts.total;

  updateUndoButton();
}

function updateUndoButton() {
  if (!dom.undoBtn) return;
  dom.undoBtn.disabled = state.history.length === 0;
}

function syncFilterControls() {
  if (dom.filterCategory) dom.filterCategory.value = state.filters.category;
  if (dom.filterStatus) dom.filterStatus.value = state.filters.status;
}

// ============================================================
// Duplicate and Summary Logic
// ============================================================

function recalculateDuplicates() {
  const seenByCategory = {
    orthographical: new Map(),
    structural: new Map(),
    readability: new Map()
  };

  state.findings.forEach(finding => {
    const key = finding.text.trim().toLowerCase();
    const seenMap = seenByCategory[finding.category];
    const originalId = seenMap.get(key);

    if (originalId) {
      finding.isDuplicate = true;
      finding.duplicateOf = originalId;
      return;
    }

    finding.isDuplicate = false;
    finding.duplicateOf = null;
    finding.countAsNew = false;
    seenMap.set(key, finding.id);
  });
}

function getFilteredFindings() {
  return state.findings.filter(finding => {
    const categoryMatch = state.filters.category === 'all' || finding.category === state.filters.category;
    const statusMatch = state.filters.status === 'all' || getFindingStatus(finding) === state.filters.status;
    return categoryMatch && statusMatch;
  });
}

function getFindingStatus(finding) {
  if (finding.isDuplicate && finding.countAsNew) return 'override';
  if (finding.isDuplicate) return 'duplicate';
  return 'new';
}

function getSummaryCounts() {
  const counts = {
    orthographical: 0,
    structural: 0,
    readability: 0
  };

  state.findings.forEach(finding => {
    if (!finding.isDuplicate || finding.countAsNew) {
      counts[finding.category]++;
    }
  });

  return {
    ...counts,
    total: counts.orthographical + counts.structural + counts.readability
  };
}

function getDuplicateLabel(finding) {
  const originalIndex = state.findings.findIndex(item => item.id === finding.duplicateOf);

  if (finding.countAsNew) {
    return originalIndex >= 0 ? `OVERRIDE of #${originalIndex + 1} (+1)` : 'OVERRIDE (+1)';
  }

  return originalIndex >= 0 ? `REPEAT of #${originalIndex + 1} (0)` : 'REPEAT (0)';
}

function getFindingTitle(finding) {
  return finding.isDuplicate && !finding.countAsNew
    ? `${finding.category} (repeat)`
    : `${finding.category} (+1)`;
}

function getDuplicateExplanation(finding) {
  const originalIndex = state.findings.findIndex(item => item.id === finding.duplicateOf);
  const originalLabel = originalIndex >= 0 ? `finding #${originalIndex + 1}` : 'an earlier finding';

  return finding.countAsNew
    ? `Manually counted even though it matches ${originalLabel}.`
    : `Auto-marked as a repeat because it matches ${originalLabel} in the same category.`;
}

// ============================================================
// Persistence
// ============================================================

function saveHistory() {
  state.history.push({
    findings: cloneFindings(state.findings),
    nextFindingId: state.nextFindingId
  });
}

function persistState() {
  if (!state.essayContent) {
    clearPersistedState();
    return;
  }

  const payload = {
    essayContent: state.essayContent,
    findings: cloneFindings(state.findings),
    nextFindingId: state.nextFindingId,
    filters: { ...state.filters }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  updateDraftBanner();
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[ReviewFlow] Could not load saved draft', error);
    return null;
  }
}

function clearPersistedState() {
  localStorage.removeItem(STORAGE_KEY);
}

function restoreState(savedState) {
  resetReviewState();

  state.essayContent = savedState.essayContent || '';
  state.findings = Array.isArray(savedState.findings)
    ? savedState.findings.map(finding => ({ countAsNew: false, ...finding }))
    : [];
  state.nextFindingId = savedState.nextFindingId || 1;
  state.filters = {
    category: savedState.filters?.category || 'all',
    status: savedState.filters?.status || 'all'
  };

  recalculateDuplicates();
  dom.essayInput.value = state.essayContent;
  persistState();
  updateDraftBanner();
}

function updateDraftBanner() {
  if (!dom.draftBanner) return;
  dom.draftBanner.hidden = !loadPersistedState();
}

function resetReviewState() {
  state.essayContent = '';
  state.findings = [];
  state.currentSelection = null;
  state.nextFindingId = 1;
  state.history = [];
  state.filters = {
    category: 'all',
    status: 'all'
  };
}

// ============================================================
// Export and Utilities
// ============================================================

function buildExportText() {
  const counts = getSummaryCounts();
  const lines = [
    'ReviewFlow Export',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Summary',
    `Orthographical: ${counts.orthographical}`,
    `Structural: ${counts.structural}`,
    `Readability: ${counts.readability}`,
    `Total: ${counts.total}`,
    '',
    'Findings'
  ];

  state.findings.forEach((finding, index) => {
    lines.push(`${index + 1}. [${capitalize(finding.category)}] "${finding.text}" - ${getDuplicateLabel(finding)}`);
  });

  if (state.findings.length === 0) {
    lines.push('No findings recorded.');
  }

  return lines.join('\n');
}

function cloneFindings(findings) {
  return findings.map(finding => ({ ...finding }));
}

function escapeHTML(str) {
  const element = document.createElement('p');
  element.textContent = str;
  return element.innerHTML;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', init);

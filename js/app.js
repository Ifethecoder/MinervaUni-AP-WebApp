/**
 * app.js — ReviewFlow
 * Manual Tagging Workflow
 */

const STORAGE_KEY = 'reviewflow-active-review-v1';
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

// ============================================================
// Initialization
// ============================================================

function init() {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const undoBtn = document.getElementById('undo-btn');
  const exportBtn = document.getElementById('export-btn');
  const resumeDraftBtn = document.getElementById('resume-draft-btn');
  const discardDraftBtn = document.getElementById('discard-draft-btn');
  const filterCategory = document.getElementById('filter-category');
  const filterStatus = document.getElementById('filter-status');
  const essayDisplay = document.getElementById('essay-display');
  const findingsList = document.getElementById('findings-list');
  const tagPopup = document.getElementById('tag-popup');

  if (startBtn) startBtn.addEventListener('click', handleStart);
  if (resetBtn) resetBtn.addEventListener('click', handleReset);
  if (undoBtn) undoBtn.addEventListener('click', handleUndo);
  if (exportBtn) exportBtn.addEventListener('click', handleExport);
  if (resumeDraftBtn) resumeDraftBtn.addEventListener('click', handleResumeDraft);
  if (discardDraftBtn) discardDraftBtn.addEventListener('click', handleDiscardDraft);
  if (filterCategory) filterCategory.addEventListener('change', handleFilterChange);
  if (filterStatus) filterStatus.addEventListener('change', handleFilterChange);

  // Handle Selection
  if (essayDisplay) {
    essayDisplay.addEventListener('mouseup', handleSelection);
  }

  if (findingsList) {
    findingsList.addEventListener('click', handleFindingListClick);
    findingsList.addEventListener('change', handleFindingCategoryChange);
  }

  // Handle Tagging
  tagPopup.querySelectorAll('button[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-cat');
      addFinding(category);
    });
  });

  const cancelBtn = document.getElementById('cancel-tag');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hidePopup);
  }

  // Global click to hide popup
  document.addEventListener('mousedown', (e) => {
    if (!tagPopup.contains(e.target) && e.target.id !== 'essay-display') {
      hidePopup();
    }
  });

  document.addEventListener('keydown', handleKeydown);
  updateDraftBanner();

  console.log('[ReviewFlow] Manual Tagging initialized');
}

// ============================================================
// Event Handlers
// ============================================================

function handleStart() {
  const input = document.getElementById('essay-input');
  state.essayContent = input.value;
  state.currentSelection = null;
  state.history = [];

  if (state.essayContent.trim() === '') {
    alert('Please paste an essay first.');
    return;
  }

  renderEssay();
  renderFindingsLog(); // Clear log from previous session
  updateSummary(); // Reset counts from previous session
  updateUI();
  persistState();
  
  document.getElementById('essay-input-section').style.display = 'none';
  document.getElementById('analysis-results').style.display = 'block';
}

function handleReset() {
  if (confirm('Are you sure you want to discard this review?')) {
    resetReviewState();
    document.getElementById('essay-input').value = '';
    
    // Explicitly reset UI
    renderFindingsLog();
    updateSummary();
    
    document.getElementById('essay-input-section').style.display = 'block';
    document.getElementById('analysis-results').style.display = 'none';
    clearPersistedState();
    updateDraftBanner();
  }
}

function handleSelection(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
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
  } else {
    hidePopup();
  }
}

function getSelectionOffsets(selection) {
  // Anchor the finding to explicit start/end offsets in the essay display text.
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(document.getElementById('essay-display'));
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;
  return {
    start,
    end: start + range.toString().length
  };
}

// ============================================================
// Tagging Logic
// ============================================================

function addFinding(category) {
  if (!state.currentSelection) return;

  const { text, start, end } = state.currentSelection;
  saveHistory();

  state.findings.push({
    id: state.nextFindingId++,
    text,
    start,
    end,
    category,
    isDuplicate: false,
    duplicateOf: null,
    countAsNew: false
  });
  recalculateDuplicates();

  state.currentSelection = null;
  hidePopup();
  window.getSelection().removeAllRanges();

  renderEssay();
  renderFindingsLog();
  updateSummary();
  persistState();
}

function handleUndo() {
  if (state.history.length === 0) return;

  const previousState = state.history.pop();
  state.findings = previousState.findings;
  state.nextFindingId = previousState.nextFindingId;
  state.currentSelection = null;

  renderEssay();
  renderFindingsLog();
  updateSummary();
  persistState();
}

function handleFindingListClick(e) {
  const deleteBtn = e.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    const findingId = Number(deleteBtn.getAttribute('data-finding-id'));
    deleteFinding(findingId);
    return;
  }

  const overrideBtn = e.target.closest('[data-action="toggle-duplicate-override"]');
  if (!overrideBtn) return;

  const findingId = Number(overrideBtn.getAttribute('data-finding-id'));
  toggleDuplicateOverride(findingId);
}

function handleFindingCategoryChange(e) {
  if (e.target.getAttribute('data-action') !== 'retag') return;

  const findingId = Number(e.target.getAttribute('data-finding-id'));
  retagFinding(findingId, e.target.value);
}

function handleFilterChange() {
  state.filters.category = document.getElementById('filter-category').value;
  state.filters.status = document.getElementById('filter-status').value;
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
  document.getElementById('essay-input-section').style.display = 'none';
  document.getElementById('analysis-results').style.display = 'block';
  renderEssay();
  renderFindingsLog();
  updateSummary();
  syncFilterControls();
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
    hidePopup();
    state.currentSelection = null;
    window.getSelection().removeAllRanges();
    return;
  }

  const category = CATEGORY_SHORTCUTS[key];
  if (!category) return;

  e.preventDefault();
  addFinding(category);
}

function deleteFinding(findingId) {
  const findingExists = state.findings.some(f => f.id === findingId);
  if (!findingExists) return;

  saveHistory();
  state.findings = state.findings.filter(f => f.id !== findingId);
  recalculateDuplicates();

  renderEssay();
  renderFindingsLog();
  updateSummary();
  persistState();
}

function retagFinding(findingId, category) {
  const finding = state.findings.find(f => f.id === findingId);
  if (!finding || finding.category === category) return;

  saveHistory();
  finding.category = category;
  finding.countAsNew = false;
  recalculateDuplicates();

  renderEssay();
  renderFindingsLog();
  updateSummary();
  persistState();
}

function toggleDuplicateOverride(findingId) {
  const finding = state.findings.find(f => f.id === findingId);
  if (!finding || !finding.isDuplicate) return;

  saveHistory();
  finding.countAsNew = !finding.countAsNew;
  renderEssay();
  renderFindingsLog();
  updateSummary();
  persistState();
}

function showPopup(x, y) {
  const popup = document.getElementById('tag-popup');
  popup.style.display = 'flex';
  popup.style.left = `${x}px`;
  popup.style.top = `${y - 60}px`; // Show slightly above cursor
}

function hidePopup() {
  document.getElementById('tag-popup').style.display = 'none';
}

// ============================================================
// Rendering
// ============================================================

function renderEssay() {
  const display = document.getElementById('essay-display');
  const content = state.essayContent;

  let html = '';
  let lastIndex = 0;

  // Sort findings to process sequentially
  const sorted = [...state.findings].sort((a, b) => a.start - b.start);

  sorted.forEach(f => {
    html += escapeHTML(content.substring(lastIndex, f.start));
    const className = f.isDuplicate ? 'highlight-tag duplicate' : 'highlight-tag';
    html += `<span class="${className}" title="${getFindingTitle(f)}">${escapeHTML(content.substring(f.start, f.end))}</span>`;
    lastIndex = f.end;
  });

  html += escapeHTML(content.substring(lastIndex));
  display.innerHTML = html;
}

function renderFindingsLog() {
  const list = document.getElementById('findings-list');
  list.innerHTML = '';

  const visibleFindings = getFilteredFindings();

  if (visibleFindings.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'finding-empty';
    emptyItem.textContent = state.findings.length === 0
      ? 'No findings yet.'
      : 'No findings match the current filters.';
    list.appendChild(emptyItem);
    updateUndoButton();
    return;
  }

  visibleFindings.forEach(f => {
    const li = document.createElement('li');
    li.className = 'finding-item';

    const topRow = document.createElement('div');
    topRow.className = 'finding-row';

    const findingText = document.createElement('div');
    findingText.className = 'finding-text';

    const categoryLabel = document.createElement('strong');
    categoryLabel.className = 'finding-category';
    categoryLabel.textContent = `${capitalize(f.category)}: `;

    const findingQuote = document.createElement('span');
    findingQuote.textContent = `"${f.text}"`;

    findingText.appendChild(categoryLabel);
    findingText.appendChild(findingQuote);

    const findingStatus = document.createElement('span');
    findingStatus.className = `finding-status ${f.isDuplicate ? 'duplicate' : 'new'}`;
    findingStatus.textContent = f.isDuplicate ? getDuplicateLabel(f) : 'NEW (+1)';

    topRow.appendChild(findingText);
    topRow.appendChild(findingStatus);

    const controls = document.createElement('div');
    controls.className = 'finding-controls';

    const select = document.createElement('select');
    select.className = 'finding-select';
    select.setAttribute('data-action', 'retag');
    select.setAttribute('data-finding-id', String(f.id));

    ['orthographical', 'structural', 'readability'].forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = capitalize(category);
      option.selected = f.category === category;
      select.appendChild(option);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'finding-delete-btn';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-finding-id', String(f.id));
    deleteBtn.textContent = 'Delete';

    controls.appendChild(select);

    if (f.isDuplicate) {
      const overrideBtn = document.createElement('button');
      overrideBtn.type = 'button';
      overrideBtn.className = 'finding-override-btn';
      overrideBtn.setAttribute('data-action', 'toggle-duplicate-override');
      overrideBtn.setAttribute('data-finding-id', String(f.id));
      overrideBtn.textContent = f.countAsNew ? 'Treat as Repeat' : 'Count Anyway';
      controls.appendChild(overrideBtn);
    }

    controls.appendChild(deleteBtn);

    if (f.isDuplicate) {
      const note = document.createElement('div');
      note.className = 'finding-note';
      note.textContent = getDuplicateExplanation(f);
      li.appendChild(topRow);
      li.appendChild(note);
      li.appendChild(controls);
    } else {
      li.appendChild(topRow);
      li.appendChild(controls);
    }
    list.appendChild(li);
  });

  updateUndoButton();
}

function updateSummary() {
  const counts = getSummaryCounts();

  document.getElementById('count-ortho').textContent = counts.orthographical;
  document.getElementById('count-struct').textContent = counts.structural;
  document.getElementById('count-read').textContent = counts.readability;

  document.getElementById('total-count').textContent = counts.total;
  updateUndoButton();
}

function updateUI() {
  // Reset scroll and view state
  window.scrollTo(0, 0);
  syncFilterControls();
}

// ============================================================
// Utilities
// ============================================================

function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

function saveHistory() {
  state.history.push({
    findings: cloneFindings(state.findings),
    nextFindingId: state.nextFindingId
  });
}

function cloneFindings(findings) {
  return findings.map(f => ({ ...f }));
}

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
    } else {
      finding.isDuplicate = false;
      finding.duplicateOf = null;
      finding.countAsNew = false;
      seenMap.set(key, finding.id);
    }
  });
}

function getDuplicateLabel(finding) {
  const originalIndex = state.findings.findIndex(f => f.id === finding.duplicateOf);
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
  const originalIndex = state.findings.findIndex(f => f.id === finding.duplicateOf);
  const originalLabel = originalIndex >= 0 ? `finding #${originalIndex + 1}` : 'an earlier finding';
  return finding.countAsNew
    ? `Manually counted even though it matches ${originalLabel}.`
    : `Auto-marked as a repeat because it matches ${originalLabel} in the same category.`;
}

function updateUndoButton() {
  const undoBtn = document.getElementById('undo-btn');
  if (!undoBtn) return;
  undoBtn.disabled = state.history.length === 0;
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getFilteredFindings() {
  return state.findings.filter(finding => {
    const categoryMatch = state.filters.category === 'all' || finding.category === state.filters.category;
    const status = getFindingStatus(finding);
    const statusMatch = state.filters.status === 'all' || status === state.filters.status;
    return categoryMatch && statusMatch;
  });
}

function getFindingStatus(finding) {
  if (finding.isDuplicate && finding.countAsNew) return 'override';
  if (finding.isDuplicate) return 'duplicate';
  return 'new';
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
  state.findings = Array.isArray(savedState.findings) ? savedState.findings.map(f => ({
    countAsNew: false,
    ...f
  })) : [];
  state.nextFindingId = savedState.nextFindingId || 1;
  state.filters = {
    category: savedState.filters?.category || 'all',
    status: savedState.filters?.status || 'all'
  };

  recalculateDuplicates();
  document.getElementById('essay-input').value = state.essayContent;
  persistState();
  updateDraftBanner();
}

function updateDraftBanner() {
  const draftBanner = document.getElementById('draft-banner');
  if (!draftBanner) return;
  draftBanner.hidden = !loadPersistedState();
}

function syncFilterControls() {
  const filterCategory = document.getElementById('filter-category');
  const filterStatus = document.getElementById('filter-status');
  if (filterCategory) filterCategory.value = state.filters.category;
  if (filterStatus) filterStatus.value = state.filters.status;
}

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
    const status = getDuplicateLabel(finding);
    lines.push(`${index + 1}. [${capitalize(finding.category)}] "${finding.text}" - ${status}`);
  });

  if (state.findings.length === 0) {
    lines.push('No findings recorded.');
  }

  return lines.join('\n');
}

function getSummaryCounts() {
  const counts = {
    orthographical: 0,
    structural: 0,
    readability: 0
  };

  state.findings.forEach(f => {
    if (!f.isDuplicate || f.countAsNew) {
      counts[f.category]++;
    }
  });

  return {
    ...counts,
    total: counts.orthographical + counts.structural + counts.readability
  };
}

function isPopupVisible() {
  return document.getElementById('tag-popup').style.display === 'flex';
}

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', init);

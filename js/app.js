/**
 * app.js — ReviewFlow
 * Manual Tagging Workflow
 */

const state = {
  essayContent: '',
  findings: [], // Each finding: { text, index, category, isDuplicate }
  currentSelection: null // Temporary selection before tagging
};

// ============================================================
// Initialization
// ============================================================

function init() {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const essayDisplay = document.getElementById('essay-display');
  const tagPopup = document.getElementById('tag-popup');

  if (startBtn) startBtn.addEventListener('click', handleStart);
  if (resetBtn) resetBtn.addEventListener('click', handleReset);

  // Handle Selection
  if (essayDisplay) {
    essayDisplay.addEventListener('mouseup', handleSelection);
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

  console.log('[ReviewFlow] Manual Tagging initialized');
}

// ============================================================
// Event Handlers
// ============================================================

function handleStart() {
  const input = document.getElementById('essay-input');
  state.essayContent = input.value;

  if (state.essayContent.trim() === '') {
    alert('Please paste an essay first.');
    return;
  }

  renderEssay();
  updateUI();
  
  document.getElementById('essay-input-section').style.display = 'none';
  document.getElementById('analysis-results').style.display = 'block';
}

function handleReset() {
  if (confirm('Are you sure you want to discard this review?')) {
    state.essayContent = '';
    state.findings = [];
    document.getElementById('essay-input').value = '';
    document.getElementById('essay-input-section').style.display = 'block';
    document.getElementById('analysis-results').style.display = 'none';
  }
}

function handleSelection(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    // Basic index finding (Note: this is a simple implementation for M1)
    // In a complex essay with repeating words, we'd need more robust offset logic
    const range = selection.getRangeAt(0);
    
    state.currentSelection = {
      text: selectedText,
      // We calculate index relative to the text content to handle re-renders
      index: getSelectionIndex(selection) 
    };

    showPopup(e.pageX, e.pageY);
  } else {
    hidePopup();
  }
}

function getSelectionIndex(selection) {
  // Simple heuristic for M1: find the offset within the essayDisplay's text
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(document.getElementById('essay-display'));
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  return preSelectionRange.toString().length;
}

// ============================================================
// Tagging Logic
// ============================================================

function addFinding(category) {
  if (!state.currentSelection) return;

  const { text, index } = state.currentSelection;

  // Rule 2: Deduplication Policy
  // "Repeated identical errors count only once"
  const isDuplicate = state.findings.some(f => 
    f.text.toLowerCase() === text.toLowerCase() && 
    f.category === category
  );

  state.findings.push({
    text,
    index,
    category,
    isDuplicate
  });

  state.currentSelection = null;
  hidePopup();
  window.getSelection().removeAllRanges();

  renderEssay();
  renderFindingsLog();
  updateSummary();
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
  const sorted = [...state.findings].sort((a, b) => a.index - b.index);

  sorted.forEach(f => {
    html += escapeHTML(content.substring(lastIndex, f.index));
    const className = f.isDuplicate ? 'highlight-tag duplicate' : 'highlight-tag';
    html += `<span class="${className}" title="${f.category}">${escapeHTML(content.substring(f.index, f.index + f.text.length))}</span>`;
    lastIndex = f.index + f.text.length;
  });

  html += escapeHTML(content.substring(lastIndex));
  display.innerHTML = html;
}

function renderFindingsLog() {
  const list = document.getElementById('findings-list');
  list.innerHTML = '';

  state.findings.forEach((f, i) => {
    const li = document.createElement('li');
    li.style.marginBottom = '0.5rem';
    li.style.padding = '0.4rem';
    li.style.borderBottom = '1px solid var(--mu-ash)';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    
    li.innerHTML = `
      <span>
        <strong style="color: var(--mu-clay)">${f.category.charAt(0).toUpperCase()}</strong>: 
        "${f.text}"
      </span>
      <span style="font-size: 0.7rem; color: ${f.isDuplicate ? 'var(--mu-ash)' : 'var(--mu-clay)'}">
        ${f.isDuplicate ? 'REPEAT (0)' : 'NEW (+1)'}
      </span>
    `;
    list.appendChild(li);
  });
}

function updateSummary() {
  const counts = {
    orthographical: 0,
    structural: 0,
    readability: 0
  };

  state.findings.forEach(f => {
    if (!f.isDuplicate) {
      counts[f.category]++;
    }
  });

  document.getElementById('count-ortho').textContent = counts.orthographical;
  document.getElementById('count-struct').textContent = counts.structural;
  document.getElementById('count-read').textContent = counts.readability;

  const total = counts.orthographical + counts.structural + counts.readability;
  document.getElementById('total-count').textContent = total;
}

function updateUI() {
  // Reset scroll and view state
  window.scrollTo(0, 0);
}

// ============================================================
// Utilities
// ============================================================

function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', init);

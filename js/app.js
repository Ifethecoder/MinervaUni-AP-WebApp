/**
 * app.js — [App Name]
 *
 * Entry point for all application logic.
 * Keep this file organized by feature area as the app grows.
 * See SCRATCHPAD.md for current milestone and DECISIONS.md for
 * architectural choices made so far.
 */

// ============================================================
// State
// ============================================================

const state = {
  essayContent: '',
  errors: []
};

// ============================================================
// Initialization
// ============================================================

function init() {
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleAnalyzeClick);
  }
  console.log('[App] initialized');
}

// ============================================================
// Event handlers — add yours below
// ============================================================

function handleAnalyzeClick() {
  const essayInput = document.getElementById('essay-input');
  state.essayContent = essayInput.value;

  if (state.essayContent.trim() === '') {
    alert('Please paste an essay before analyzing.');
    return;
  }

  // Placeholder for grammar analysis logic
  analyzeGrammar(state.essayContent);

  renderResults();
}

// ============================================================
// Logic — add logic functions below
// ============================================================

function analyzeGrammar(content) {
  // Simulating error detection for M1
  // This will be replaced with actual logic (regex or API) later
  state.errors = [];
  
  // Example dummy error for demonstration
  if (content.toLowerCase().includes(' its ')) {
    state.errors.push({
      type: 'Possessive Error',
      description: 'Check if "its" or "it\'s" is correct here.',
      location: content.indexOf(' its ')
    });
  }
}

// ============================================================
// Rendering — add render functions below
// ============================================================

function renderResults() {
  const resultsSection = document.getElementById('analysis-results');
  const essayDisplay = document.getElementById('essay-display');
  const errorList = document.getElementById('error-list');

  resultsSection.style.display = 'block';
  essayDisplay.textContent = state.essayContent;

  errorList.innerHTML = '';
  if (state.errors.length === 0) {
    errorList.innerHTML = '<li>No common errors detected. Good job!</li>';
  } else {
    state.errors.forEach(err => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${err.type}:</strong> ${err.description}`;
      errorList.appendChild(li);
    });
  }

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', init);

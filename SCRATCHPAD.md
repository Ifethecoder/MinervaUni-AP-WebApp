# SCRATCHPAD

## Current State

**Status**: M1 COMPLETE
**Active milestone**: M1 — Stabilization and Documentation
**Last session**: 2026-04-25

**Next actions**:
- [ ] Run a focused browser QA pass on start, tag, duplicate, override, retag, delete, undo, reset, resume draft, filters, export, and keyboard shortcuts
- [ ] Refactor `js/app.js` into clearer sections or lightweight modules without changing behavior
- [ ] Confirm GitHub Pages is enabled and test the live deployment once published

**Open questions**:
- Are there any edge cases in text selection, overlapping highlights, or repeated phrases that need one more stability pass before M1 is considered fully hardened?

---

## Milestones

### M0 — Project Initialization

- [x] Clone template repository
- [x] Fill in GEMINI.md project identity section
- [x] **Define AI Guardrails**: In `DECISIONS.md`, document how this project handles data privacy and human accountability.
- [x] Define milestones M1–M3 below
- [x] Push initial commit to GitHub
- [ ] Enable GitHub Pages in repository settings
- [ ] Confirm live URL is accessible

### M1 — Manual Tagging Assistant (MVP)

- [x] **Manual Selection Engine**: AP can highlight text to tag an error category.
- [x] **Deduplication Logic**: Exact same errors (e.g., "wont" tagged twice) are automatically counted only once.
- [x] **Scoring Summary**: Real-time counts for Orthographical, Structural, and Readability categories.
- [x] **Interactive Highlighting**: Tagged text is visually highlighted and tracked in the Findings Log.
- [x] **Privacy-First**: 100% client-side logic; no automated scanning noise.
- [x] **Reviewer Corrections**: Findings can be retagged, deleted, and undone.
- [x] **Duplicate Transparency**: Repeats show their source finding and can be manually overridden when needed.
- [x] **Opt-In Draft Recovery**: Active reviews can persist locally on the same device when explicitly enabled.
- [x] **Filtering and Export**: Findings can be filtered and exported as a plain-text review summary.
- [x] **Keyboard Shortcuts**: Popup tagging supports keyboard-driven categorization.

### M1.1 — Hardening and Maintenance

- [ ] End-to-end browser QA pass for the full M1 workflow
- [ ] Refactor `js/app.js` for maintainability
- [ ] Verify mobile layout and keyboard accessibility
- [ ] Confirm deployment and live-site behavior

---

## Session Log

### 2026-03-29 — Initial Setup & Milestone 1 Completion

**AI Tool(s) Used**: Gemini CLI (March 2026)
**Purpose**: Project initialization, architectural design, and M1 implementation.
**Modifications & Verification**: 
- Defined project identity and milestones for ReviewFlow.
- Pivoted from automated regex-based detection to a manual "Highlight & Tag" system to better align with Minerva AI Guardrails and AP needs.
- Implemented `window.getSelection()` based tagging, real-time deduplication (Rule 2), and a scoring dashboard.
- Verified logic with test cases ("wont" repetition, "san francisco" capitalization).
**Learning Reflection**: The pivot from automation to a manual assistant highlighted the importance of "Human-in-the-Loop" design. While AI/Regex can find errors, the AP's judgment is more reliable for the specific nuances of the Admissions Handbook.
**Session Link/Context**: Initial project setup through M1 completion.

### 2026-04-25 — M1 Hardening and Scope Clarification

**AI Tool(s) Used**: Codex (GPT-5-based coding assistant)
**Purpose**: Strengthen the existing manual grammar-review workflow and align documentation with the current product scope.
**Modifications & Verification**:
- Refactored findings to use stable ids and explicit text ranges.
- Added retag, delete, and undo controls to the findings log.
- Improved duplicate transparency with source references and manual override support.
- Moved major inline UI styling into reusable CSS classes.
- Added local draft recovery, findings filters, export, and popup keyboard shortcuts.
- Changed draft recovery to explicit opt-in so essay text is not stored locally by default.
- Verified JavaScript syntax with `node --check js/app.js`.
**Learning Reflection**: M1 became substantially more usable without changing the app's core philosophy. The best improvements were the ones that reduced reviewer friction while preserving human judgment.
**Session Link/Context**: Post-M1 stabilization pass focused on maintainability and reviewer productivity.

# SCRATCHPAD

## Current State

**Status**: M1 COMPLETE
**Active milestone**: M2 — Rubric Evidence Assistant
**Last session**: 2026-03-29

**Next actions**:
- [ ] Define the Rubric Evidence categories in a new `rubric.md` or update `js/app.js`
- [ ] Implement a second tagging mode for "Rubric Evidence" (qualitative)
- [ ] Add a sidebar panel to toggle/filter different rubric highlights

**Open questions**:
- How should we visually distinguish between "Grammar Errors" and "Rubric Evidence" highlights? (e.g., different colors or underline styles)

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

### M2 — Rubric Evidence Assistant

...

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

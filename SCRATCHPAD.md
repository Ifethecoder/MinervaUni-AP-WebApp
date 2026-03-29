# SCRATCHPAD

## Current State

**Status**: IN PROGRESS
**Active milestone**: M1 — Grammar Review Assistant (Core MVP)
**Last session**: 2026-03-29

**Next actions**:
- [ ] Implement robust grammar error detection (Regex-based)
- [ ] Add visual highlighting (underlines) for errors in the essay display
- [ ] Create tooltips/modals for error explanations

**Open questions**:
- Which specific grammar errors should we prioritize for M1? (e.g., its/it's, then/than, subject-verb agreement)
- How will the rubric evidence highlighting be visually represented?

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

*A user can see highlights in the essay that correspond to specific rubric criteria, assisting in qualitative evaluation.*

**Values checklist**:
- [ ] Learning
- [ ] Agency
- [ ] Privacy
- [ ] Transparency

**Acceptance criteria**:
- [ ] Rubric criteria panel/sidebar
- [ ] Colored highlighting of text sections matching criteria
- [ ] Ability to toggle highlights for different rubric sections

### M3 — Full Review Workflow + Export

*A user can complete a full review, add notes, and export the results for final submission.*

**Values checklist**:
- [ ] Learning
- [ ] Agency
- [ ] Privacy
- [ ] Transparency

**Acceptance criteria**:
- [ ] Review summary dashboard
- [ ] Manual notes/comments section for each highlight
- [ ] Export functionality (e.g., Download as PDF or copy to clipboard)

<!-- Add milestones as the project grows. Keep acceptance criteria user-observable. -->

---

## Session Log

> Append a brief entry after each session. Never edit past entries.
> Format: what state you found, what you did, what state you left it in.
> **Disclosure**: Use the [Minerva Disclosure Template](#disclosure-template) below for significant AI-assisted work.

---

### Disclosure Template

*Copy and fill this for each session where significant AI was used (from Part 3.5 of Student Guardrails).*

**AI Tool(s) Used**: [e.g., Gemini 1.5 Pro, March 2026]
**Purpose**: [e.g., brainstorming, outlining, debugging, editing]
**Modifications & Verification**: [What did you change? How did you verify the AI's accuracy?]
**Learning Reflection**: [What value did this AI use add to your learning or work quality?]
**Session Link/Context**: [Briefly describe the chat session or provide a link if possible]

---

<!-- First entry goes here after your first working session. -->

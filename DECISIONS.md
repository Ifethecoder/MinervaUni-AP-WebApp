# Architecture Decision Record

> Log every significant technical or design decision here.
> This file is **append-only** — never edit or remove past decisions.
> A decision is significant if a future session would benefit from knowing why it was made.

**Format for each entry:**

```
## Decision NNN — [Short title]
**Date**: YYYY-MM-DD
**Decision**: [What was decided, in one sentence]
**Rationale**: [Why this was the right choice for this project]
**Alternatives considered**: [What else was on the table]
**Trade-offs**: [What we gain, what we give up]

**Guardrails Alignment**:
- **Privacy & IP**: [How does this decision protect student data and clarify ownership?]
- **Disclosure**: [How will this choice be disclosed to users/stakeholders?]
- **Responsibility**: [Who is the human responsible for this decision's impact?]
- **Bias & Trust**: [What measures mitigate bias in this specific choice?]
- **Values**: [Which core Minerva value does this align with?]
```

---

## Decision 001 — Vanilla HTML/CSS/JS, no framework

**Date**: [YYYY-MM-DD]
**Decision**: Use plain HTML, CSS, and JavaScript with no build step and no framework.
**Rationale**: GitHub Pages hosts static files directly. No framework means no build pipeline, no dependencies to update, no abstraction between the code and the browser. The project remains readable and modifiable by anyone with basic web knowledge, which aligns with the learning-orientation principle of clarity over cleverness.
**Alternatives considered**: React, Vue, Svelte — all require a build step or CDN dependency; Astro — adds complexity for a single-page app
**Trade-offs**: We lose component reuse patterns and reactive state management. We gain zero setup friction, full control over output, and a codebase that doesn't rot when npm packages break.

## Decision 002 — Ethical AI & Data Privacy Guardrails

**Date**: [YYYY-MM-DD]
**Decision**: Adoption of Minerva University's AI Guardrails for all project development and deployment.
**Rationale**: To protect data privacy (especially student PII), ensure intellectual property integrity, and maintain human-centered learning. This project prioritizes human agency and accountability, treating AI as a "thinking partner" rather than a substitute.
**Specific Guardrails for this Project**:
1. **No Sensitive Data**: The app will not store or process real student records or PII.
2. **Human-in-the-Loop**: All AI-suggested code and content are reviewed by the human developer before commit.
3. **Mandatory Disclosure**: AI use is logged in `SCRATCHPAD.md`.
**Trade-offs**: Development may be slower due to mandatory human review and documentation overhead, but the resulting system is more ethical, secure, and aligned with institutional values.

## Decision 003 — AI Guardrails Implementation for ReviewFlow

**Date**: 2026-03-29
**Decision**: Implement specific UI and process guardrails to ensure transparency and human accountability.
**Rationale**: As per the Minerva Staff AI Guardrails, the application must clearly disclose its AI-assisted nature and ensure that humans (APs) remain the final decision-makers.
**Implementation**:
1. **Visual Disclosure**: Add an "AI-Assisted" badge in the footer of the web application.
2. **Human-in-the-Loop**: The UI will present AI findings as *suggestions* or *highlights* that the user must verify, rather than automated "corrections".
3. **Disclosure Template**: Use the Minerva Disclosure Template in `SCRATCHPAD.md` for all development sessions.
**Trade-offs**: Slightly more UI clutter due to the badge, but ensures compliance and user trust.

**Guardrails Alignment**:
- **Privacy & IP**: Protects the integrity of the evaluation process by clarifying AI's role.
- **Disclosure**: Mandatory visual badge and session logging.
- **Responsibility**: Explicitly states that the AP is the responsible party for final evaluations.
- **Bias & Trust**: Highlights are suggestions to be reviewed, reducing reliance on potentially biased AI output.
- **Values**: Accountability and Transparency.

## Decision 004 — Data Privacy & Synthetic Testing

**Date**: 2026-03-29
**Decision**: Use only synthetic or fully anonymized essay data for development and testing.
**Rationale**: To strictly adhere to Zero-Trust for sensitive data (PII) and FERPA/Minerva privacy standards. Real student essays contain PII that must not be processed in this AI session.
**Implementation**:
1. **Synthetic Data**: Generate or use public-domain sample essays for all testing.
2. **No PII**: Ensure no names, IDs, or identifiable personal details are ever committed or processed.
**Trade-offs**: Testing might not capture the full variety of real-world essay nuances, but the privacy risk of using real data is unacceptable.

**Guardrails Alignment**:
- **Privacy & IP**: Zero-trust for PII.
- **Disclosure**: Documented use of synthetic data.
- **Responsibility**: Human developer (Gemini + Student) ensures no real data is used.
- **Bias & Trust**: Avoids training/processing on sensitive real-world data.
- **Values**: Privacy and Care.

## Decision 005 — Pivot to Manual Tagging Assistant

**Date**: 2026-03-29
**Decision**: Replace automated regex detection with a manual "Highlight & Tag" workflow.
**Rationale**: Regex detection proved too fragile for the nuances of the admissions handbook. By allowing APs to manually highlight and categorize errors, the app preserves human expertise while automating the counting, deduplication, and reporting tasks. This aligns more closely with the "Human-in-the-Loop" guardrail.
**Implementation**: Use `window.getSelection()` to allow users to tag specific text spans with handbook categories.
**Trade-offs**: Requires more manual effort from the AP, but results in 100% accuracy based on human judgment.

**Guardrails Alignment**:
- **Privacy & IP**: No data processed by external AI; all judgment is local.
- **Disclosure**: Explicitly a human-led tool.
- **Responsibility**: AP remains the sole evaluator.
- **Values**: Accountability and Agency.

## Decision 006 — Keep Project Scope Focused on Manual Grammar Review

**Date**: 2026-04-25
**Decision**: Keep ReviewFlow focused on refining and hardening the manual grammar-review workflow instead of expanding into a rubric-evidence milestone.
**Rationale**: The current product is strongest when it reduces bookkeeping while preserving human judgment. Expanding into rubric evidence would widen the surface area, introduce new UX complexity, and distract from stabilizing the existing M1 workflow that users actually rely on.
**Alternatives considered**: Continue toward an M2 rubric-evidence assistant; broaden the product into a more general essay-evaluation platform
**Trade-offs**: We give up short-term feature expansion and a broader roadmap. We gain a clearer product identity, lower maintenance burden, and more time to strengthen reliability, accessibility, and reviewer confidence in the current workflow.

**Guardrails Alignment**:
- **Privacy & IP**: Keeps the tool narrowly scoped and fully client-side, reducing pressure to process more sensitive evaluation data.
- **Disclosure**: Makes the tool's role easier to explain: it supports manual grammar review rather than broader essay judgment.
- **Responsibility**: Reinforces that APs remain responsible for the evaluation itself while the app handles bookkeeping.
- **Bias & Trust**: Avoids drifting toward more interpretive or subjective automation.
- **Values**: Clarity, accountability, and human agency.

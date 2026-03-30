# ReviewFlow ✍️🔍

**A manual scoring assistant for admissions processors to evaluate essays with speed, consistency, and human-centered judgment.**

ReviewFlow is built to help admissions processors (APs) apply the official Minerva University Grammar Handbook and Writing Rubric efficiently. It automates the "bureaucracy" of grading—counting, deduplicating, and totaling—while leaving the critical evaluative judgment entirely in the hands of the human processor.

---

## 🧭 The ReviewFlow Philosophy

Aligned with the **Minerva AI Guardrails**, ReviewFlow follows a "Human-in-the-Loop" architecture:

1.  **Human-Led Judgment**: The app does not "auto-correct" or "auto-grade." The AP identifies errors by highlighting text, ensuring 100% alignment with the handbook's nuances.
2.  **Smart Deduplication**: Automatically implements **Rule 2** of the Grading Spec: repeated identical errors (e.g., the same misspelled word) are counted only once.
3.  **Real-Time Scoring**: Provides an instant summary of Orthographical, Structural, and Readability counts as the AP works.
4.  **Zero-Trust Privacy**: 100% client-side logic. No essay data is ever sent to external servers or AI APIs, ensuring total protection of applicant PII.
5.  **Official Branding**: Built with the official Minerva University Fall 2025 brand identity.

---

## 🚀 Features

### Milestone 1: Manual Tagging Assistant (Current)
- **Highlight & Tag**: Select any text in an essay to instantly categorize it as Orthographical, Structural, or Readability.
- **Automated Counting**: The app tracks the total grammar count based on your tags.
- **Intelligent Deduplication**: If you tag the same error multiple times, the app identifies it as a "REPEAT" and adds 0 to the final score.
- **Findings Log**: A transparent history of every tagged error for easy review.

### Coming Soon
- **M2: Rubric Evidence Assistant**: Qualitative highlighting for specific rubric criteria.
- **M3: Full Review Workflow & Export**: Generate final reports and export results for submission.

---

## 🛠 Tech Stack

-   **Frontend**: Vanilla HTML5, CSS3, and JavaScript (No frameworks, no build steps).
-   **Logic**: Browser-native `window.getSelection()` API for high-performance tagging.
-   **Styling**: Minerva Brand Standards (Obsidian, Bone, Clay).
-   **Hosting**: GitHub Pages (Static).

---

## 📖 Source of Truth

- **`GRAMMAR.md`**: The official digital "Constitution" for how grammar errors are counted in this app.
- **`DECISIONS.md`**: A log of every major architectural choice, including the pivot to a manual-first workflow.
- **`SCRATCHPAD.md`**: The active development log and milestone tracker.

---

## 🎨 Minerva Brand Identity
ReviewFlow adheres to the Fall 2025 Minerva University Standards:
- **Primary Colors**: Obsidian (#000000), Bone (#F0EBE6), Clay (#905112).
- **Typography**: Serif for headings (Chronicle Display), Sans-serif for UI (Neue Haas Grotesk).

---

**Developed as a Minerva University Student Project.**  
*AI-Assisted Development via Gemini CLI & Minerva AI Framework.*

# Grammar Grading Spec

## Purpose

This document defines how APs should count grammar errors in applicant essays for this app.

The goal is **not** to enforce every formal rule of English. The goal is to count **grammar problems that affect sentence clarity** in a way that matches the handbook.

The app should:
- identify handbook-compliant grammar issues
- group them into approved categories
- avoid counting excluded issues
- avoid double-counting repeated identical mistakes
- produce a final grammar error count

---

## Core Grading Principle

Count grammar errors that meaningfully affect clarity.

Use a **conservative standard**:
- count issues that clearly fit the handbook
- do not count issues just because they sound awkward unless they rise to the level of a handbook-supported error
- do not enforce style preferences as grammar errors

The handbook notes that applicants come from many English backgrounds, so grading should focus on clarity rather than hyper-strict formalism.

---

## Counting Rules

### Rule 1: Count only approved error types
All counted errors must fit one of these categories:
- Orthographical
- Structural
- Readability

### Rule 2: Repeated identical errors count once
If the **exact same mistake** appears multiple times, count it only the first time. 

Examples:
- the same misspelled word repeated 3 times = **1 error**
- the first word of multiple sentences incorrectly lowercase in the same repeated way = **1 error**
- two different run-on sentences = **2 errors**, because they are not the exact same error pattern

### Rule 3: Different errors count separately
If two issues are distinct, count both.

Example:
- one misspelling + one article error = **2 errors**

### Rule 4: One sentence can contain multiple errors
A single sentence may contain several countable issues.

Example:
- a run-on sentence with a misspelled word may count as:
  - 1 run-on error
  - 1 spelling error

### Rule 5: Use the handbook, not generic grammar software
Tools like Grammarly may flag many things, but only count errors supported by this spec. 

---

## Approved Categories

# 1. Orthographical Errors

Orthographical errors are writing-convention problems such as spelling, capitalization, homophone misuse, contraction errors, possessive errors, and punctuation errors. 

## Count these

### 1.1 Spelling
Count misspelled words.

Examples:
- `comfortble`
- `fullfilled`
- `expeled`
- `loadded`
- `ur`

### 1.2 Capitalization
Count incorrect capitalization when it is clearly wrong.

Examples:
- `san francisco`
- `I Was Going to go`
- `anne and samantha`

### 1.3 Homophone Misuse
Count wrong word choice when the issue is a homophone error.

Examples:
- `I’m going to right an essay`
- `It was to heavy`

### 1.4 Contraction Errors
Count missing apostrophes or malformed contractions.

Examples:
- `I wont go to class.`
- `Hes not very nice.`

### 1.5 Possessive Errors
Count incorrect possessive formation.

Examples:
- `I admire both my parent’s life stories.`
- `That is Samanthas hat.`

### 1.6 Punctuation Errors
Count punctuation mistakes that clearly impair sentence correctness or readability.

Examples:
- `For all mistakes I made; I am really sorry.`
- `Mary Claudia and Sylvia are good friends.`

## Do NOT count these as orthographical errors

### 1.7 Hyphenation
Do not count inconsistent or incorrect hyphenation.

Examples:
- `five year old boy`
- `civil-rights`
- `co-operative`
- `mother in law`

### 1.8 Word Breaks
Do not count broken or split compounds/phrases of this type.

Examples:
- `land mark`
- `now a days`

### 1.9 Missing Oxford Comma
Do not count missing Oxford commas.

---

# 2. Structural Errors

Structural errors are grammar problems in clause, phrase, or word construction. 

## Count these

### 2.1 Subject-Verb Agreement
Count disagreement between subject and verb.

Examples:
- `One of my professors always spill coffee on my papers.`
- `Everything she say is right.`
- `Everyone are going to the party tonight.`

### 2.2 Tense Misuse
Count incorrect tense formation or tense choice within a sentence when it is grammatically wrong.

Examples:
- `It is raining for two days.`
- `Have you went to the library lately?`
- `Someone pulled the fire alarm yesterday, so we get out of class without taking the test.` 

### 2.3 Quantifier Errors
Count wrong use of count/noncount quantity expressions.

Examples:
- `A few water was left in the glass.`
- `How many money does it cost?` 

### 2.4 Adjective/Adverb Errors
Count incorrect adjective/adverb form.

Examples:
- `He speaks very slow.`

### 2.5 Article Errors
Count missing, extra, or incorrect articles.

Examples:
- `All over world, humans are searching for happiness.`
- `An laptop was stolen from the store.` 

### 2.6 Word Order Errors
Count clearly incorrect word order.

Examples:
- `To the movies we are going.`
- `She is not interested to buy jewelry.` (if treated as structural misuse in context)
- `They always are late.` only count if the phrasing is clearly ungrammatical in context, not merely unusual. 
## Important note on structural errors
The handbook says the list is **not inclusive**. That means the app may count other clearly comparable structural grammar problems, but only when they closely match the handbook’s intent. Be conservative. 

---

# 3. Readability Errors

Readability errors are construction problems that impair the reader’s ability to process the meaning, including errors across a sentence. 

## Count these

### 3.1 Run-On Sentences
Count run-ons when sentence boundaries are missing or badly fused.

Example:
- `If you're going to the shops can you buy me some eggs and flour I want to make a cake.` 

#### Special run-on counting rule
If one run-on should actually be multiple separate sentences, count **one error for each additional sentence boundary that should exist**.

Example:
- if one run-on should be 6 separate sentences, count **5 run-on errors** 

### 3.2 Incomplete Sentences
Count sentence fragments that fail to form a complete sentence.

Examples:
- `After falling asleep on the sofa.`
- `After the rain stops.` 

### 3.3 Major Comma/Semicolon Problems
Count serious comma/semicolon misuse when it materially harms readability. 

### 3.4 Tense Shifts Across Sentences
Count incorrect tense shifts across sentence boundaries.

Example:
- `I went to the grocery store. There, I will buy carrots.` 

### 3.5 Incorrect or Super-Awkward Sentence Structure
Count sentence constructions that are strongly malformed and difficult to process.

Examples:
- `She played yesterday football.`
- other comparably distorted syntax that clearly damages readability

---

## Global Do-Not-Count List

Do **not** count the following:

- hyphenation problems
- word break problems
- missing Oxford comma
- unnecessary spacing such as `him .`
- failure to split into paragraphs
- failure to indent
- failure to leave empty lines between paragraphs 

These may affect presentation or organization, but they are not counted in the grammar total. 

---

## Decision Standard for the App

When evaluating an issue, use this order:

1. Does the issue clearly reduce grammatical clarity?
2. Does it fit an approved category or a very close handbook-aligned equivalent?
3. Is it excluded by the do-not-count rules?
4. Is it the exact same error already counted earlier?
5. If still uncertain, do **not** count it.

When uncertain, prefer under-counting over over-counting.

---

## Deduplication Policy

The app must track repeated identical errors.

### Count once
- same misspelled word repeated
- same repeated capitalization pattern
- same repeated missing apostrophe in the same contraction form
- same repeated article omission pattern, if genuinely identical and not meaningfully distinct in context :contentReference

### Count separately
- different misspelled words
- different run-on sentences
- a spelling error and a punctuation error in the same sentence
- two different article mistakes that are not exactly the same
- one run-on plus one fragment

### Practical rule
Treat errors as duplicates only when a trained AP would reasonably say:
> “This is the exact same mistake repeated.”

Otherwise, count separately.

---

## Output Format for the App

For each essay, the app should produce:

### A. Structured findings
For every counted issue:
- `quote`: exact text span
- `category`: orthographical | structural | readability
- `subtype`: spelling | capitalization | subject_verb_agreement | run_on | etc.
- `explanation`: brief handbook-aligned explanation
- `counted`: true | false
- `count_reason`: why it counts or why it was excluded
- `duplicate_of`: reference to earlier issue if not newly counted

### B. Summary
- total orthographical errors
- total structural errors
- total readability errors
- final grammar count

### C. Optional excluded issues section
Include issues detected but not counted, with reason:
- excluded by handbook
- duplicate of prior error
- style issue only
- not clear enough to count

---

## Recommended Prompting Behavior for the AI

The AI grader should follow these instructions:

- Be conservative.
- Only count handbook-supported grammar errors.
- Do not count style preferences.
- Do not count excluded formatting issues.
- Count repeated identical errors only once.
- Explain each counted issue briefly.
- Separate “detected issue” from “counted error.”
- When uncertain, do not count.

---

## Examples

### Example 1
Text:
`The students were excited to spend a year in san francisco.`

Counted issues:
1. capitalization: `san francisco`

Final count:
`1` :contentReference

---

### Example 2
Text:
`I wont worry too much about drinking water from the faucets.`

Counted issues:
1. contraction error: `wont`

Final count:
`1` :contentReference

---

### Example 3
Text:
`Everything she say is right.`

Counted issues:
1. subject-verb agreement: `say`

Final count:
`1` :contentReference

---

### Example 4
Text:
`I love to write papers I would write one everyday if I had the time.`

Counted issues:
1. run-on sentence

Final count:
`1` :contentReference

---

### Example 5
Text:
`After the rain stops.`

Counted issues:
1. incomplete sentence

Final count:
`1` :contentReference

---

### Example 6
Text:
`How many money does it cost?`

Counted issues:
1. quantifier error

Final count:
`1` :contentReference

---

### Example 7
Text:
`I’m going to right an essay, and it was to heavy to carry.`

Counted issues:
1. homophone misuse: `right`
2. homophone misuse: `to`

Final count:
`2` :contentReference

---

## Non-Examples

### Do not count
Text:
`This is my five year old brother.`

Reason:
- hyphenation is excluded 

Final count:
`0`

---

### Do not count
Text:
`She smiled at him .`

Reason:
- unnecessary spacing is excluded

Final count:
`0`

---

### Do not count
Text:
Essay has no paragraph breaks.

Reason:
- paragraph organization is evaluated elsewhere, not in grammar count :contentReference

Final count:
`0`

---

## Implementation Notes

This markdown file is the human-readable policy.

This file should be treated as the source of truth for handbook-aligned grammar counting.
# Tas Firearms Submission Builder V5.2

Companion website to the Tas Firearms Amendment Guide.

## Changes in V4

- Uses the same amendment titles, official wording, plain-English descriptions and current-versus-proposed summaries as Guide V3.2.
- Uses amendment-specific support, concern and unsure reasons.
- Adds constructive alternative suggestions when a user opposes a proposal.
- Includes a Read the full Guide link.
- Requires all 21 amendments to be answered before generation.
- Generates a structured individual submission and addressed email.

## Publish

Upload these files to the root of the submission-builder repository:

- index.html
- styles.css
- data.js
- app.js
- README.md

GitHub Pages will update after the commit.


## Version 4.1 PDF and email improvements

- Replaced printing of the textarea with a dedicated print-ready submission document.
- Added a structured on-screen preview with headings, positions, reasons, alternatives and comments.
- Added A4 print styling, sensible page margins and multi-page flow.
- Improved email formatting with amendment separators, headings, bullet points and CRLF line breaks.
- Kept the editable plain-text output available in an expandable section.


## Version 4.2 PDF polish

- Removes stale print content before and after printing to prevent extra blank pages.
- Adds a one-page submission summary with totals and amendment-by-amendment positions.
- Adds professional colour-coded badges:
  - Green: Support
  - Red: Oppose
  - Amber: Unsure
  - Grey: No comment
- Adds matching coloured amendment borders for fast visual scanning.
- Improves print-only layout and hides all non-submission website content.


## Version 5 PDF structure

- Adds a dedicated cover page.
- Keeps the executive summary on its own page.
- Uses a compact amendment-number and position table so the summary fits on one page.
- Starts the detailed submission after the summary.
- Prevents amendment cards from splitting across pages.
- Keeps the existing colour-coded support, oppose, unsure and no-comment indicators.


## Version 5.1 verified fix

- Adds visible Version 5.1 text and cache-busting file references.
- Removes the long titles from the summary and uses a compact three-column grid.
- Forces the cover and summary to exactly one A4 page each.
- Forces each amendment to begin on its own page.
- Keeps every amendment heading, position, reasons, alternatives and comments together.
- Overrides inherited Version 4 print rules that caused the previous page splitting.


## Version 5.2 consolidated layout

- Keeps the V5.1 cover, summary, colours and content.
- Allows multiple complete amendment boxes on each page.
- Keeps each amendment box together without splitting it between pages.
- Reduces spacing and padding to shorten the PDF while preserving readability.

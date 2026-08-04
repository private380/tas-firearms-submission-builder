# Tas Firearms Submission Builder V6.1 Anonymous Results

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


## Version 5.2.1 final fixes

- Updated all Amendment Guide links to:
  https://private380.github.io/tas-firearms-amendment-guide/
- Added fresh cache-busting references.
- Tightened cover-page spacing and dimensions so the footer remains on page 1.


## Version 5.3 PDF and email workflow

- Opens the formatted submission in a separate print window for more reliable PDF saving on iPhone, iPad and desktop browsers.
- Warns the user if pop-ups are blocked.
- Changes the email button to create a short professional covering email.
- The email no longer inserts the full submission into the email body.
- Because browsers do not permit mailto links to attach generated files automatically, the user saves the PDF first and attaches it manually in their email app.
- Adds clear instructions beside the PDF and email buttons.


## Version 5.3.1 hotfix

- Corrected a JavaScript syntax error in the prepared-email function.
- Restores the Start submission button and all other interactive controls.
- Validated app.js with Node.js before packaging.


## Version 5.4 Messenger guidance and final suggestions

- Detects Facebook Messenger, Instagram and similar in-app browsers.
- Advises users to open the website in Safari or Chrome before saving the PDF.
- Adds a Copy website link button.
- Adds optional tick-box suggestions for broader reforms and closing comments.
- Includes selected suggestions in the PDF and plain-text submission.


## Version 5.6

- Adds a prominent independent-software notice before users begin.
- Explains the four steps: complete, generate, save the PDF and attach it to the prepared email.
- Adds the complete expanded Further suggestions list, including safe anchoring, alarms, cameras, GPS tracking, key storage, rebates, evidence and transition arrangements.
- Counts PDF generations when the Save submission as PDF button is used.
- The counter is stored locally and is labelled as generated on this device; it is not a verified statewide or multi-user total.


## Version 5.7 global community counter

- Replaces the device-only number with one live total shared by every visitor.
- Uses Firebase Anonymous Authentication and Realtime Database.
- Updates the total in real time without refreshing.
- Records a generation when Save submission as PDF is selected.
- Keeps the existing browser-side protection against accidental repeat counting for the same completed submission.
- Includes `database.rules.json` and `FIREBASE-SETUP.md`.


## Version 6.0 public release

- Rebuilt from the latest approved Version 5.7 package.
- Fixes Further suggestions and Closing comments so every selected statement renders as a true bullet point.
- Removes literal `\n` characters from the PDF.
- Preserves the consolidated amendment-card layout.
- Preserves the independent-software notice, expanded suggestion choices, PDF/email workflow and Firebase global counter.
- Includes the Firebase rules and setup instructions required for the shared counter.


## Version 6.1 anonymous aggregate results

- Starts collecting anonymous aggregate positions from deployment.
- Records Support, Oppose, Unsure and No comment totals for all 21 amendments.
- Records counts for selected Further suggestions and Closing suggestions.
- Does not store identity fields, free-text comments or PDFs.
- Existing Version 6.0 users cannot be reconstructed; statistics begin from Version 6.1 deployment.

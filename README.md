# Tas Firearms Consultation Results — V3

Post-consultation public results site.

## Improvements in V2

- Cleaner A4 printing and page-break handling.
- Executive summary with automatically calculated key findings.
- Most-supported and most-opposed amendment rankings.
- Broader suggestions and closing themes ranked by selection count.
- Revised independence wording.
- Each amendment includes the support / oppose / unsure reason options respondents were presented with.

### Important data limitation

The original Firebase aggregation stored:
- amendment positions,
- predefined broader suggestions,
- predefined closing suggestions.

It did **not** store amendment-level reason selections, amendment-specific alternatives, free-text comments, names, emails or PDFs. Historical counts for individual amendment reasons therefore cannot be reconstructed. The site labels reason lists accordingly.

## Publish

Upload all files to the GitHub Pages repository root:
- index.html
- styles.css
- results.js
- data.js
- database.rules.json
- README.md

## Firebase

Publish `database.rules.json` in Firebase Console → Realtime Database → Rules.
It keeps the frozen aggregate dataset readable and blocks all further writes.


## V3 print/PDF layout

The public website retains the card-style layout.

When printing or saving as PDF, the site now switches to a dedicated report layout with:
- a cover page,
- executive summary,
- compact amendment result tables,
- one compact result block per amendment,
- stronger `break-inside: avoid` handling,
- ranked broader suggestions,
- methodology and project-independence wording.

The detailed amendment reason lists remain available on the website, but are intentionally excluded from the printed report because the backend did not store historical reason-selection counts and including every reason option makes the PDF substantially longer.

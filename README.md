# Tas Firearms Consultation Results — V2

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

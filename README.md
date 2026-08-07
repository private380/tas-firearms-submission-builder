# Tas Firearms Submission Builder — Closed Consultation Site

This repository contains the post-consultation version of the Tas Firearms Submission Builder.

The public consultation closed at 5 pm Friday 7 August 2026.

## Files

- `index.html` — consultation-closed landing page.
- `styles.css` — site styling.
- `results.html` — anonymous aggregate community-results report.
- `data.js` — amendment titles and reference data used by the results report.
- `database.rules.json` — reference copy of the Firebase rules used to freeze writes while retaining public read access to aggregate results.

## GitHub Pages

Use GitHub Pages with the `main` branch and `/ (root)` folder.

## Important Firebase step

Uploading this repository does **not** itself change Firebase Realtime Database rules. Apply the contents of `database.rules.json` separately in Firebase Console > Realtime Database > Rules, then publish them.

The locked rules preserve read access to the aggregate results but prevent further writes.

## Results wording

Community results reflect anonymous selections recorded when users generated a PDF through the independent builder. They are not an official government submission count and do not prove that every generated PDF was ultimately lodged.

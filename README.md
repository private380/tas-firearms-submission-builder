# Tas Firearms Consultation Results

Post-consultation public results site for the 2026 Tas Firearms Submission Builder.

## Publish

Upload these files to the repository root used by GitHub Pages:

- `index.html`
- `styles.css`
- `results.js`
- `data.js`
- `database.rules.json`

GitHub Pages should be configured to deploy from the `main` branch and `/ (root)`.

## Firebase

The site reads:

- `communityParticipation/generatedSubmissions`
- `communityResults`

The included `database.rules.json` keeps those paths publicly readable but blocks all further writes. Publish the contents manually in Firebase Console → Realtime Database → Rules.

## Important interpretation

Results represent anonymous aggregate selections recorded when users generated/saved a submission PDF through the independent builder. They are not an official government submission count and do not establish that every generated PDF was lodged.

# Firebase setup for Version 5.7

The website files are already configured for:

- Project: `tas-policy-watch-c451f`
- Realtime Database: `asia-southeast1`
- Anonymous Authentication

## Apply the database rules

1. Open Firebase Console.
2. Open **Databases & Storage → Realtime Database**.
3. Select the **Rules** tab.
4. Replace the existing locked rules with the contents of `database.rules.json`.
5. Select **Publish**.

These rules:

- Allow everyone to read the shared total.
- Allow only Firebase-authenticated visitors to increment it.
- Only permit the value to increase by exactly one per write.

## What the total means

The total records uses of **Save submission as PDF** through this builder.

It is not an official government count and cannot confirm that each generated PDF was emailed.

The website prevents ordinary repeat counting for the same completed submission in the same browser. As with any public client-side counter, it is an activity indicator rather than an independently audited statistic.

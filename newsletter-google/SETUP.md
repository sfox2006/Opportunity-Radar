# Newsletter integration

These Apps Script sources run in a separately authorised Google account, not on
GitHub Pages. The website embeds the public subscription form in `dist/newsletter.js`.

The response-sheet identifier in `GoogleForm.gs` is intentionally a placeholder.
Configure it in your private Apps Script copy, never in this public repository.
Run contact setup before installing the form-submit trigger. Review the Google
permissions and test using an explicitly approved subscriber before enabling use.

The response sheet must have the headers `Timestamp`, `Full name`, `Email` in
the `Form responses 1` tab. Contacts are added to the `Future Leaders` label.
The code does not send emails. Monthly sending is a separate workflow.

`Backfill.gs` is a historical, manually invoked 31-row migration utility, not a
scheduled job. Do not run it on another response sheet without reviewing the scope.

Tests use mocked services and synthetic subscribers. Passing them does not prove
the production form trigger, authorisation or contact synchronisation is working.
Private operational notes, account identifiers and subscriber records are excluded.

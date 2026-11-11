# Formspree integration

Owner endpoint: `https://formspree.io/f/mppdzldb`. Native HTML/vanilla-JS implementation follows the matching guide supplied by the owner. `src/components/form.mjs` renders POST/action markup; `public/site.js` enhances it with fetch, progress, localized errors and confirmed success. No SDK/CDN or private key is required.

Required: name, city, province/territory, property, service, description and at least one email/phone in the enhanced journey. Optional: company, timing, quantity, access and service-specific details. Hidden progressive fields are disabled. AJAX omits empty email for phone-only requests. Source-route context is allowlisted; language, stable service/property IDs, labels, brand/language subject and a random submission reference are included.

One request may be in flight; successful acceptance locks the form. The submission reference helps identify repeats but is **not provider-side idempotency**. Success requires HTTP success and `ok: true`. Rejection/invalid JSON cannot produce success. A 20-second timeout or lost connection preserves data and explains uncertainty; there is no automatic retry. Standard POST supports no-JS and provider verification. No personal data is stored in local storage, URLs or analytics; no uploads.

## Provider settings to verify

- Notification recipient, verified account, French delivery, subject/template and safe Reply-To for email and phone-only requests.
- Server validation rules for required fields, lengths and at least one usable contact. Browser validation is bypassable. Native no-JS POST relies on provider rules for cross-field validation.
- Provider rate/body limits, spam controls, CAPTCHA and final-host restrictions. `_gotcha` alone is not complete bot protection. Localhost may be rejected by a restrictive account policy.
- Retention/access practices, quota and any processing rules. No dashboard setting is claimed configured without evidence.

Consulted November 11, 2026: [AJAX guide](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/), [rules](https://help.formspree.io/articles/advanced-features/form-rules), [system limits](https://help.formspree.io/articles/form-and-project-settings/system-limits), [CAPTCHA](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings).

Browser tests intercept all provider traffic. They prove UI behaviour, not endpoint activity. Real endpoint acceptance, notification processing and destination inbox receipt are separate checks. See the launch checklist for actual evidence.

## Live check — November 11, 2026

After explicit owner authorization, exactly two test enquiries were sent using the actual local site's quote forms in Chrome at approximately 6:15 p.m. America/Toronto. No mocks or retries were used.

| Test | Contact | Provider | UI |
| --- | --- | --- | --- |
| `WS-LIVE-20261111-EN-1814` | Email | HTTP 200, `ok: true` | English acceptance confirmation |
| `WS-LIVE-20261111-FR-1814` | Phone only | HTTP 200, `ok: true` | French acceptance confirmation |

Both requests were clearly labelled as website tests with no work, appointment or callback requested. The French payload included accented text. The configured recipient and provider dashboard are not accessible here; no matching notifications were found in the connected Gmail account. **Inbox receipt and notification rendering remain unverified.** Do not mark the complete delivery gate passed until those are confirmed. Details: `docs/verification/live-form-report.json`.

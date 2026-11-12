# Optional analytics

Owner authorized use of an existing Google Analytics account. WindowServices.ca has its own GA4 property in the existing Grafov Group account; other properties are unchanged. Public identifiers: account `213675022`, property `563882484`, web stream `16324541423`, measurement ID `G-5ZL8YQ5ZPY`. Reporting timezone: Toronto; currency: CAD. Business size: Small (1–10), confirmed by the owner. `generate_lead` is registered as a key event with no default monetary value; `site_language` and `service` are registered as event-scoped custom dimensions.

The production build displays an English/French choice with equally styled Accept and Decline buttons. Google is not contacted until acceptance. The footer reopens the choice; withdrawal disables further events, removes accessible `_ga` cookies, and persists across pages and tabs. The preference expires after 180 days. Analytics cookies use a 180-day maximum lifetime without renewal on activity. Preview builds do not activate Analytics. Disabling JavaScript leaves the site and native Formspree submission usable without Analytics.

Enhanced measurement is disabled in the stream. Event and user data retention are set to two months, with reset on new user activity disabled; Google notes that this does not govern most aggregated standard reports. Advertising storage, advertising user data and personalization remain denied; Google Signals and advertising personalization are also disabled in the tag. There are no Google Ads links or API secrets. No entered form values, contact details, city, free text or arbitrary URL parameters are sent. Page locations come from the site's route map, with no query string or fragment; external referrers are reduced to their origin. Event parameters are fixed allowlists for page ID, site language, service, property type and error category.

| Event | Meaning |
| --- | --- |
| `page_view` | One view after consent on a document |
| `quote_cta_click` | Link to the quote form clicked |
| `phone_click`, `email_click` | Contact link clicked, not a completed conversation |
| `quote_start` | First input on the current quote form while opted in |
| `quote_validation_error` | Website validation rejected submission; no field values included |
| `quote_submit_error` | Provider rejection, rate limit, timeout or network failure |
| `generate_lead` | Formspree returned HTTP success and `ok: true`, once per form; not inbox receipt, a booking or completed work |

Reports omit visitors who decline or block Analytics. Native no-JavaScript submissions and provider verification redirects cannot produce a confirmed lead event on this site. There is no automatic retry and no conversion event from merely visiting the next-steps page. Do not interpret a lack of tracked conversions as no enquiries.

Validation: `tests/analytics.mjs` intercepts all Google/Formspree requests to check bilingual refusal, acceptance, withdrawal, sanitized URLs, allowlisted payloads and accepted-lead semantics. Functional browser QA persists a refusal in its isolated browser context. No additional real enquiries are needed for these checks.

Live verification completed: two consented QA homepage visits emitted debug page views during setup. The final check received HTTP 204, had no browser errors, sent no Google requests before consent or after withdrawal, and removed Analytics cookies. No real form enquiries or lead events were sent. The first visit exposed a blocked tag diagnostic image; the documented no-advertising Google tag hosts were added to CSP and the final check passed. See `verification/live-analytics-report.json`.

Reporting visibility remains pending: the new property’s DebugView still showed zero devices/events at final inspection. The live collection endpoint accepted the correct measurement ID with HTTP 204; this verifies delivery to Google, not availability in processed reports. Review reporting once normal opted-in traffic has accumulated.

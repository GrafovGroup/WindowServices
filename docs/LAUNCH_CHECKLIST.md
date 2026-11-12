# Launch checklist — November 11, 2026

Production flags are supported by the evidence below. The final installed release and checks are recorded in PROJECT_STATUS.md and docs/verification.

| Check | Status | Evidence / scope |
| --- | --- | --- |
| Approved artwork | PASS | Owner approved option #1 reconstruction after reviewing the visual proof; brand-approval.json. |
| Core service capability | PASS | Owner confirmed cleaning, repair, installation and replacement, subject to project/location confirmation; launch-owner-confirmations.json. |
| Operator and privacy facts | PASS | Superclean Canada Inc.; Privacy Officer at info@windowservices.ca; unsuccessful enquiries deleted after 12 months from last contact, with legal/dispute exceptions. Owner-adopted policy appears in EN/FR. |
| Form endpoint and acceptance | PASS | Owner's mppdzldb endpoint; two earlier enquiries accepted and receipt owner-confirmed. Two final authorized live-origin enquiries accepted (EN/email and FR/phone-only); live-launch-forms-report.json. |
| Final notification receipt | NOT TESTED | Final requests accepted by provider; final recipient inbox receipt is not independently confirmed. Earlier receipt is owner-confirmed. |
| Provider controls | PASS | Enabled, Formshield, honeypot, domain restriction, required/type/length rules and available quota verified; form-provider-settings.json. Contact OR and enum checks are client-side, not provider combination rules. |
| WHC account and backup | PASS | Existing Pro plan, srv48.swhc.ca, separate ~/windowservices.ca root; packages/backups in non-public ~/windowservices-staging. |
| DNS cutover | PASS | Both authoritative servers return 51.161.57.68, TTL 300; all non-web records preserved. Cached parking answers may persist through their previous TTL. |
| Valid HTTPS | PASS | Strict certificate verification succeeds for windowservices.ca and www. AutoSSL repaired after removing this domain's incorrect certificate binding. |
| Build, Node checks and audit | PASS | Eight Node test groups; 42 routes, 2,548 internal references; branding, routes, validation, metadata, sitemap and package-integrity checks. Final production rerun recorded with release. |
| WHC preview integrity and 404s | PASS | Live 42-route + 69-file hash crawl. Dedicated localized error documents resolve LiteSpeed internal-error recursion; real EN/FR missing URLs and explicit error routes return 404. |
| Production package/install | NOT TESTED | Final production package and installation pending in this source checkpoint. |
| Production live crawl/browser/a11y | NOT TESTED | Final production rerun pending. Earlier Chrome tests passed 42 routes, 84 responsive views and 20 automated axe combinations. |
| Safari/Firefox/Edge and physical mobile | NOT TESTED | Desktop Chrome with responsive viewports only; not a real-device or accessibility certification. |
| Field performance | NOT TESTED | No production field data or Core Web Vitals claim. |
| Search consoles | NOT TESTED | No property verification or sitemap submission claimed. |
| Analytics/uploads/accounts/payments | NOT APPLICABLE | Outside the implemented scope. |

Review builds remain noindex by default. Production uses the approved HTTPS origin and includes only canonical indexable pages in its sitemap. Quote, confirmation and error pages remain noindex. No fake offices, testimonials, certifications or service guarantees are published.

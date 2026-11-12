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
| Build, Node checks and audit | PASS | Eight Node test groups; 42 routes, 2,752 internal references; branding, routes, validation, metadata, sitemap and package-integrity checks. Final clean production rerun recorded with release. |
| WHC preview integrity and 404s | PASS | Live 42-route + 69-file hash crawl. Dedicated localized error documents resolve LiteSpeed internal-error recursion; real EN/FR missing URLs and explicit error routes return 404. |
| Production package/install | PASS | Clean e7a9c9123ab0; 131 public files; extracted inventory and 42-route audit pass; archive checksum matches WHC; backups preserved. whc-seo-ux-release.json and production-release-manifest.json. |
| Production live crawl/browser/a11y | PASS | Final clean release: 42 route hashes + 84 additional file hashes, TLS, headers, root/HTTP/www redirects and real EN/FR 404s. Chrome: 42 routes, 84 responsive views, EN/FR form mocks; axe: 24 combinations, zero automatic violations. The final follow-up changes only security-policy files; all HTML/CSS/JS/images are byte-identical to the tested build. |
| Safari/Firefox/Edge and physical mobile | NOT TESTED | Desktop Chrome with responsive viewports only; not a real-device or accessibility certification. |
| Lab performance | PASS | WHC homepage: Lighthouse 12.8.2 simulated mobile 100; LCP 1.5 s, CLS 0, TBT 0 ms, before consent. Final security-only change leaves page assets identical. |
| Field performance | NOT TESTED | No production field data or Core Web Vitals claim. |
| Search property verification/submission | PASS | Google domain ownership and Bing site ownership verified by added DNS records. Production 36-URL sitemap submitted to both; search-launch-report.json. |
| Google live crawl eligibility | PASS | Live test reports URL available to Google and page can be indexed. Fetched HTML contains the new operator/site content and correct /en/ canonical. |
| Search indexing | NOT TESTED | Both Google and Bing report Success and 36 discovered sitemap URLs. The earlier Google fetch delay resolved; current indexing is not independently confirmed. No ranking or indexing guarantee. |
| Analytics | PASS | Existing account; bilingual opt-in and event allowlists. Live debug page view accepted HTTP 204; refusal/withdrawal prevent requests; cookies removed. No new form enquiries. See ANALYTICS.md and live-analytics-report.json. |
| Uploads/visitor accounts/payments | NOT APPLICABLE | Outside the implemented scope. |

Review builds remain noindex by default. Production uses the approved HTTPS origin and includes only canonical indexable pages in its sitemap. Quote, confirmation and error pages remain noindex. No fake offices, testimonials, certifications or service guarantees are published.

# Launch checklist — November 11, 2026

Statuses distinguish a tested review build from a public launch. Production flags remain false until evidence resolves the blockers.

| Check | Status | Evidence / remaining work |
| --- | --- | --- |
| Static build | PASS | Node 24.22.1; no build dependencies; 42 EN/FR routes. |
| Validation, routes, branding and package integrity | PASS | Eight Node test groups: contact alternatives, lengths/IDs, locale mapping, safe context, logo requirements/variants and detection of tampered, missing, extra, private or linked release files. |
| Generated output | PASS | 42 routes, 2,548 internal references including responsive image candidates and branded social cards; unique metadata, H1s, icons, canonical/hreflang, JSON-LD and exact sitemap membership. Custom SITE_URL passes; deliberately incorrect canonical is rejected. |
| Downloadable review package | PASS | 113 public output files; extracted archive passes all file checksums and the 42-route audit. Source commit and working-tree status recorded. Production guard remains enforced. See docs/verification/release-check-report.json. |
| Browser HTTP/interaction/responsive checks | PASS | Chrome 157.0.8103.51 via Playwright 1.62.1: 42 routes, 84 responsive views (360/390/768/1280/1440/1920), EN/FR provider mocks, menu focus/Escape, locale links, 404s, no-JS form and reduced motion. Exact browser version in docs/verification/browser-report.json. |
| Automated accessibility | PASS | axe-core 4.11.0 in Chrome; 20 page/viewport combinations, zero automatic A/AA violations. Not an accessibility certification. |
| Visual review | PASS | Desktop EN home/repair, mobile FR home/quote, tablet FR areas screenshots inspected. Long French copy fits. |
| Favicon implementation | PASS / VISUAL REVIEW | Reconstructed architectural emblem in valid 16/32/48 ICO, SVG, 96/180/192/512 PNGs and manifest. Final owner review pending. |
| Logo concept selection | PASS | Owner reconfirmed option #1 — Architectural / Commercial — on November 11, 2026. |
| Concept #1 artwork implementation | PASS / VISUAL REVIEW | Original sheet recovered and retained unchanged. Real SVG paths, transparent/reversed/monochrome PNGs and bilingual social cards are installed. Reconstruction uses outlined Manrope lettering; owner visual check pending. |
| Form endpoint integration | PASS | Owner's `mppdzldb` endpoint in real HTML POST and JS enhancement. |
| Live form acceptance | PASS | Two owner-authorized live submissions on November 11, 2026 at about 6:15 p.m. Toronto time: EN/email and FR/phone-only. Both returned HTTP 200 with `ok: true` and displayed localized confirmation. Exactly two POSTs, no retries. See docs/verification/live-form-report.json. |
| Notification/inbox receipt | PASS — OWNER CONFIRMED | Owner replied "received" after the two live tests on November 11, 2026. Receipt is owner-confirmed; mailbox contents, French notification formatting and dashboard settings were not independently inspected. |
| Provider rules and abuse controls | BLOCKED | Dashboard verification required: required/contact rules, limits, CAPTCHA/spam and host restrictions. Honeypot is not complete protection. |
| Service/region capability | BLOCKED | Core pages are review content. Region availability qualified; no office claims. Confirm fulfilment before release. |
| Legal/privacy/retention | BLOCKED | Confirm contracting entity and real access/retention practices. Current privacy copy reflects the chosen form processor. |
| WHC hosting preparation | PASS | Existing Web Hosting Pro account inspected through cPanel. Separate addon-domain root ~/windowservices.ca and non-public ~/windowservices-staging folder created. Server srv48.swhc.ca, shared IP 51.161.57.68, LiteSpeed with Apache-compatible configuration. |
| Apache rules | PASS — LOCAL | Local Apache 2.4.67: root redirect, real EN/FR 404s, security/noindex headers, MIME handling and query-preserving directory redirects. Full browser suite also ran against Apache. See docs/verification/apache-check-report.json. |
| Final domain/HTTPS/DNS cutover | BLOCKED | Public domain still uses WHC parking nameservers and A 149.56.225.6. No registrar DNS/mail change or live website release performed. Verify authoritative records, final TLS and WHC behaviour before cutover. |
| Safari, Edge, Firefox, real mobile devices | NOT TESTED | Current browser verification uses desktop Chrome with responsive viewport sizes. |
| Field performance | NOT TESTED | No production field data, Lighthouse score or Core Web Vitals claim. Self-hosted media and small JS limit runtime requests. |
| Google/Bing | NOT TESTED | No property verification, sitemap submission or indexing evidence. Review sitemap is empty. |
| Analytics, uploads, accounts/payments | NOT APPLICABLE | Not included in this scope. |

Before public release: complete the logo visual check, confirm actual operations and legal/privacy facts, confirm provider controls, and verify DNS/HTTPS and form behaviour on the final domain. No fake placeholder offices, reviews, projects, certifications, prices or guarantees appear.

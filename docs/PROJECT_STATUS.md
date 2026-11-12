# Project status — November 11, 2026

Phase: **bilingual review build with reconstructed branding; WHC hosting prepared**. Canonical source: `GrafovGroup/WindowServices`, `main`. Read the latest source revision with `git rev-parse HEAD` and match it to the release manifest. Original prompt baseline: `3d20c42e65fe3781618f449231ad82224cb887be`.

Implemented: 42 EN/FR routes, responsive navigation/footer, four core service pillars, commercial/residential/property-management journeys, a qualified national enquiry hub, three guides, contact/about/privacy/accessibility, quote/next steps and localized 404s. Includes self-hosted stock media, canonical/locale metadata and schema, branded social cards and noindex review safeguards.

Branding: the original five-concept sheet was recovered through the owner's signed-in Chrome Library session. Selected option #1 is now reconstructed as editable SVG paths, transparent PNGs, reversed/monochrome variants and the favicon package, and installed in the review site. Lettering is standardized in Manrope. The owner was shown docs/preview/brand-proof.png and asked for the required visual check; no final reconstruction approval is recorded yet.

Forms: owner's Formspree endpoint mppdzldb is integrated. Exactly two explicitly authorized live enquiries (EN/email, FR/phone-only) were accepted with HTTP 200 and ok:true on November 11; the owner confirmed notification receipt. Browser test submissions remain mocked. Provider account controls and final-domain behaviour need verification.

Hosting: owner selected existing WHC Web Hosting Pro and authorized login. cPanel access succeeded through the classic WHC interface. WindowServices.ca was absent and has now been added with its own ~/windowservices.ca document root; ~/windowservices-staging was created outside public document roots. Actual server is srv48.swhc.ca / 51.161.57.68, running LiteSpeed with Apache compatibility. Public domain still serves WHC parking. No registrar DNS/mail change or public website release has been made. No Site was created.

Quality: eight Node test groups pass. The current audit checks 42 routes and 2,548 references, including responsive images and social cards, with custom-origin/canonical and exact sitemap checks. Current branding passed 42 HTTP routes, 84 responsive views and 20 automated accessibility combinations on local Apache. Real localized 404s and generated .htaccess headers/redirects were verified. No real-device Safari/iOS, field-performance, indexing or ranking claim is made.

Packaging: node scripts/package.mjs rebuilds and audits output, then creates a tar.gz package with 113 public files, a source revision and SHA-256 inventory. It distinguishes working changes from a clean release. Verification rejects tampered/missing/extra/private/linked files. Production guards remain enforced. See docs/DEPLOYMENT.md and the launch checklist.

Remaining: owner visual check of the reconstructed logo; actual service/region fulfilment, contracting/privacy facts and provider controls; final-domain TLS/DNS and release verification. Continue this source and the configured WHC account rather than creating a duplicate site or hosting account.

Staging verification: `windowservices-preview-5263960e9689.tar.gz` and its checksum are uploaded to `~/windowservices-staging`. The archive was built from clean source `5263960e9689236374a408502c41d046b923047f`. Its authenticated WHC read-back matches SHA-256 `1e64428d098d35812459ab372f1e0d79bfa68344ba59c02a0a52c366255707c0` (3,044,346 bytes). This is a non-public staged package, not a live deployment. Evidence: `docs/verification/whc-staging-report.json`.

# WHC deployment and recovery

The owner authorized public launch on the existing WHC Web Hosting Pro account. The site is live at https://windowservices.ca/en/ and /fr/. No passwords, cookies, private keys or browser-session URLs are stored in source.

## Installed release

| Item | Verified state |
| --- | --- |
| Server | srv48.swhc.ca, 51.161.57.68, LiteSpeed with Apache compatibility |
| Document root | /home/nqgwub76/windowservices.ca; separate from the primary site's public_html |
| Internal addon subdomain | windowservices.bodycams.ca |
| Non-public staging | /home/nqgwub76/windowservices-staging |
| Source | ef2e0e1162c8e1f88c1e1eb8974cbcadadad7b77, clean |
| Package | windowservices-production-ef2e0e1162c8.tar.gz; 3,048,909 bytes |
| SHA-256 | 5c3118c1dd6650109b95e15654a0f9cb5cd0e8167243e814d9453ea9f62589ab |
| Output | 116 public files; 42 routes; 36 indexable sitemap URLs |
| Evidence | verification/whc-production-report.json, production-release-manifest.json and live-site-report.json |

The uploaded archive checksum matched on WHC. Only site/. was copied into the document root. cgi-bin and .well-known were preserved. No source tree, Node process, database, credentials, release archive or private evidence is deployed publicly.

## Build, package and verify

Use Node 24, Git and tar on macOS/Linux. All launch gates must have evidence; production packaging rejects dirty source.

```sh
node --test tests/*.test.mjs
SITE_MODE=production node scripts/package.mjs
mkdir /tmp/windowservices-release
# Extract the actual archive produced by the command above.
tar -xzf artifacts/windowservices-production-<revision>.tar.gz -C /tmp/windowservices-release
node scripts/verify-package.mjs /tmp/windowservices-release
```

The archive contains site/, release.json (source, mode/origin and all file hashes) and DEPLOY.txt. Keep the manifest, instructions and archive outside public roots. The build reads environment variables directly; .env is not automatically loaded. SITE_URL defaults to https://windowservices.ca. Normal development/preview builds remain noindex with an empty sitemap.

Upload to non-public staging, verify the SHA-256, then extract into a unique release directory. Private sessions may use umask 077, so explicitly set directories within the verified site/ payload to 755 and files to 644 before copying it. Keep the containing staging directory and backups private. The first production check detected and corrected restrictive extraction permissions before handoff.

## Routing, indexing and forms

Root .htaccess sets security headers, preferred HTTPS host, / to /en/ (301 in production), clean directory URLs and real English 404s. fr/.htaccess selects the French error document and repeats canonical redirect rules, because its RewriteEngine does not inherit the parent rules. Stable /_errors/en.html and /_errors/fr.html avoid LiteSpeed internal-error recursion; their HTML is noindex. Missing paths and explicit localized 404 routes return actual 404 status. _headers and _redirects are alternatives for other static hosts and do not configure WHC.

Production indexable pages have no noindex directive. Quote, confirmation and error pages retain noindex. robots.txt allows crawling and points to the actual 36-URL sitemap. Canonical/hreflang, structured data, responsive images and icons are audited. Headers include CSP, nosniff, restricted device permissions and strict-origin-when-cross-origin referrers. Production public cache lifetime is one hour with revalidation.

Formspree mppdzldb is public configuration, with native POST plus small JavaScript enhancement. Domain restriction, Formshield, honeypot and backend required/type/length rules are verified. Email-or-phone and enum membership are website checks; provider settings do not express those combination rules. _language=en/fr localizes provider fallback pages. Existing notifications go to the verified Superclean inbox. Optional consent-gated GA4 is configured; see ANALYTICS.md. No CAPTCHA embed, uploads, user accounts or payments are installed. Shared provider capacity is 200 enquiries/month; check current usage in the account.

## DNS and TLS

Authoritative nameservers remain parking1.whc.ca and parking2.whc.ca. The web A record changed from 149.56.225.6 to 51.161.57.68, TTL 300. www CNAME, MX, SPF and forwarding verification were preserved. Google TXT and Bing CNAME ownership records were subsequently added while preserving all existing records. See verification/dns-launch-report.json. Some caches can retain the previous roughly four-hour A-record TTL despite fresh authoritative answers.

The previous SSL binding on this domain used an unrelated certificate. Non-secret binding metadata was backed up to staging/tls-bindings-before-20261111.json, mode 600. Only WindowServices' SSL host binding was removed; stored certificates/private keys and other host bindings were preserved. AutoSSL was rerun and issued a valid Let's Encrypt certificate for apex and www, expiring February 10, 2027. Renewal is active, will_renew=1, has_problems=0. All three other bindings match the pre-change inventory. See [cPanel SSL guide](https://docs.cpanel.net/knowledge-base/security/guide-to-ssl/118/).

## Final live checks

```sh
SITE_MODE=production node scripts/check-live.mjs
```

During propagation, VERIFY_IP=51.161.57.68 selects the verified WHC origin while preserving the hostname and strict TLS validation. Final origin checks passed 42 route bodies and 69 additional public file hashes, localized 404s, forbidden host-configuration files, root redirect, HTTP/www canonical redirects with queries, security and indexing headers.

Browser tests use TEST_URL, optional CHROME_PATH and NODE_PATH, and optional HOST_RESOLVER_RULES during propagation. All Formspree traffic is mocked or aborted. Chrome tested 42 routes and 84 responsive views; axe tested 20 combinations. Desktop responsive emulation is not evidence of physical-device/Safari/Firefox/Edge behaviour.

Two final explicitly authorized real enquiries were accepted after provider settings and TLS were configured. Earlier test notifications were owner-confirmed. Final inbox receipt is not independently confirmed. Never rerun a live submission test without explicit authorization.

Google and Bing ownership are verified and the final sitemap was submitted. Check verification/search-launch-report.json for fetch/processing status; submission does not imply indexing.

## Recovery

Keep these non-public backups:

- windowservices-before-launch-20261111.tar.gz: original domain root before any website files (cgi-bin/.well-known).
- windowservices-preview-before-production-20261111.tar.gz: functional noindex preview immediately before production.
- windowservices-production-ef2e0e1162c8.tar.gz and its extracted release directory: final verified production.

For ordinary rollback, verify a known package, extract it into a new non-public directory, normalize only its public payload permissions and restore site/. plus its host configuration. Check files removed by later versions against manifests; do not blindly delete host-created cgi-bin or .well-known. The preview backup deliberately disables indexing. Restoring the initial backup removes the website and is not the usual content rollback. A DNS rollback, if needed, changes only the web A record and preserves mail.

Reference: [WHC DNS records](https://help.whc.ca/en/articles/618475-how-do-i-update-my-domain-s-dns-records). Actual account/domain paths were inspected; the primary hosting domain was not changed. There is no separate Sites-hosted project.

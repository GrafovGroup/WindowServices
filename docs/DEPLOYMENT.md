# WHC deployment and recovery

The owner selected existing WHC hosting and authorized the agent to use the signed-in account. Login succeeded through WHC's Classic Client Area after the new dashboard's cPanel launch control failed. No passwords, cookies or session URLs are stored in source.

## Verified hosting state — November 11, 2026

| Item | Observed state |
| --- | --- |
| Plan | Existing WHC Web Hosting Pro |
| Server | `srv48.swhc.ca`; shared hosting IP `51.161.57.68` |
| Web server | Direct virtual-host response identifies LiteSpeed; cPanel reports Apache 2.4.69 compatibility |
| Domain | `windowservices.ca` created as a separate addon domain |
| Document root | `~/windowservices.ca`, separate from the primary site's `public_html` |
| Required internal subdomain | `windowservices.bodycams.ca` |
| Staging directory | `~/windowservices-staging`, created outside public document roots |
| Public domain | Nameservers retained: `parking1.whc.ca` / `parking2.whc.ca`; A changed to `51.161.57.68`, TTL 300 |
| DNS/mail changes | Web A record only; www CNAME and all mail/unrelated records preserved |

The cPanel domain creation provisions its hosting-side domain/zone and required subdomain. It does not establish that the registrar's authoritative parking DNS points to this server. Public DNS, existing mail records and final HTTPS must be inspected together before any cutover. Do not change the hosting account's primary domain.

## Build and review package

```sh
node scripts/build.mjs
node --test tests/*.test.mjs
node scripts/audit.mjs
node scripts/package.mjs
```

Packaging requires Node 24, Git and `tar` on macOS/Linux. It rebuilds fresh output and audits it before producing `artifacts/windowservices-preview-<commit>.tar.gz` and a SHA-256 sidecar. Working changes add `-working` to the name and are flagged in the manifest. The archive contains:

- `site/`: only the static website output, including `.htaccess`.
- `release.json`: source commit, dirty-tree status, mode/origin and every public file's size/checksum.
- `DEPLOY.txt`: upload and verification instructions.

Extract into an empty local directory, then run `node scripts/verify-package.mjs /path/to/extracted-package`. This checks every file and audits the routes, metadata, social images and sitemap using the packaged origin. Store the archive and manifest outside the public document root. Only the contents of `site/` belong in `~/windowservices.ca` when release is authorized. No Node process, repository, credentials or source documentation belongs on the public host.

Review output uses noindex metadata and headers, an empty sitemap and no-store caching. Noindex is not access control; use host authentication for a private review deployment. Storing an archive in the non-public staging directory does not publish the website.

## Server configuration

The generated `.htaccess` targets the verified Apache-compatible WHC server. It provides `/` → `/en/`, clean directory URLs, real localized 404 responses, MIME types, security headers and mode-specific indexing/cache controls. Production adds HTTPS/preferred-host redirects. `_headers` and `_redirects` remain alternatives for other compatible static hosts; they do not configure WHC.

The rules were tested on local Apache 2.4.67 using real HTTP responses, including French missing pages, explicit 404 routes, security headers and query-preserving trailing-slash redirects. This is not proof of the final live hostname's behaviour. Recheck all rules on WHC after deployment. Preserve any necessary existing host authentication settings when installing the generated configuration.

Production builds require all evidence-backed `launch` flags, both real logo variants and a clean committed source tree for packaging. `SITE_MODE=production node scripts/package.mjs` is enabled: the owner confirmations and live form/hosting checks support all five gates. The build reads environment variables directly; `.env` is not automatically loaded. Configure `SITE_URL` to the verified HTTPS origin without a trailing slash.

The Formspree endpoint is public configuration. Confirm provider host restrictions, server validation, abuse controls and final-domain delivery. The CSP currently permits local assets and Formspree; any future CAPTCHA embed needs its exact domains configured and tested.

## Cutover and recovery

Before cutover, inspect the authoritative DNS and preserve mail/unrelated records; use the confirmed WHC target rather than the current parking address. Verify the final certificate, preferred host, redirects, EN/FR deep links, forms, icons, canonical/hreflang, robots and sitemap. No Google/Bing verification or submission has been performed.

Keep the previous verified site output and its host configuration. Roll back by restoring that package and configuration, retaining a record of the source revision. Canonical source is `https://github.com/GrafovGroup/WindowServices.git`; there is no separate Sites remote.

WHC references consulted November 11, 2026: [cPanel access](https://help.whc.ca/en/articles/625469-how-to-access-cpanel), [addon domains](https://clients.whc.ca/index.php?language=english&rp=%2Fknowledgebase%2F153%2FDomaines-suppl%C3%A9mentaires-et-alias.html), [File Manager](https://clients.whc.ca/index.php?language=english&rp=%2Fknowledgebase%2F1730%2FHow-to-use-the-File-Manager.html). The account's actual domain root was verified in cPanel rather than assumed from a primary-domain example.

Staging verification: `windowservices-preview-5263960e9689.tar.gz` and its checksum are uploaded to `~/windowservices-staging`. The archive was built from clean source `5263960e9689236374a408502c41d046b923047f`. Its authenticated WHC read-back matches SHA-256 `1e64428d098d35812459ab372f1e0d79bfa68344ba59c02a0a52c366255707c0` (3,044,346 bytes). This is a non-public staged package, not a live deployment. Evidence: `docs/verification/whc-staging-report.json`.

## Launch preparation — November 11, 2026

Authoritative DNS now points to 51.161.57.68. The previous web A was 149.56.225.6 with a roughly four-hour TTL; some recursive caches can retain it until expiry. The authoritative nameservers, www CNAME, MX, SPF and forwarding verification records were preserved. The before/after record comparison confirmed no non-web changes.

The preview release 0a0de7fe57fb was installed and its output verified on WHC. The before-launch backup is ~/windowservices-staging/windowservices-before-launch-20261111.tar.gz (mode 600). It preserves the original empty domain root, including host cgi-bin and .well-known. Retain the verified preview archive for content rollback; it is deliberately noindex.

Live LiteSpeed needed stable error-document paths. The generator now creates /_errors/en.html and /_errors/fr.html; fr/.htaccess selects the French document. These files carry noindex metadata. Missing routes and explicit /en/404/ and /fr/404/ return genuine 404 responses. Root .htaccess provides security and production canonical redirects. Never publish source, archives, private evidence or credentials in the document root.

HTTPS initially inherited a certificate unrelated to WindowServices. A non-secret binding inventory was saved to ~/windowservices-staging/tls-bindings-before-20261111.json (mode 600). Only the WindowServices SSL host binding was removed using cPanel SSL delete_ssl; stored certificates/private keys and other domain bindings were preserved. AutoSSL was rerun and strict apex/www certificate validation then passed. See [cPanel SSL guide](https://docs.cpanel.net/knowledge-base/security/guide-to-ssl/118/).

Final verification during resolver propagation can use VERIFY_IP=51.161.57.68 with scripts/check-live.mjs. This changes the connection address while preserving the real hostname and strict TLS validation. Browser tests accept HOST_RESOLVER_RULES for the same purpose; all QA Formspree requests are intercepted. These tests do not prove all public recursive resolvers have expired cached parking answers.

To restore a verified package, extract it into a new non-public staging directory, validate its SHA-256 and release inventory, then copy only site/. into the domain root. Preserve .well-known and cgi-bin. Restoring the initial before-launch backup removes the site; use the preceding verified site package for ordinary content rollback. DNS rollback, if necessary, restores only the web A record and must not alter mail records.

### Production extraction permissions and French redirects

Private staging sessions use umask 077. GNU tar extraction without preserved permissions can therefore create 700 directories and 600 files. Before copying a verified site payload, set directories under its site/ folder to 755 and files to 644; keep the containing staging directory and backups private. Copy only that prepared public payload. The first production check caught and corrected this before handoff.

A French directory with its own RewriteEngine does not inherit the parent canonical rules. Both generated configurations now contain the same production HTTPS/preferred-host redirect, followed by their localized error rules. The live verifier checks a French query-bearing URL through HTTP and www to catch this condition.

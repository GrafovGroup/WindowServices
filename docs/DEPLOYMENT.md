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
| Public domain | Still WHC parking: nameservers `parking1.whc.ca` / `parking2.whc.ca`, A `149.56.225.6` |
| Public site/DNS changes | No website release or registrar DNS/mail change performed |

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

Production builds require all evidence-backed `launch` flags, both real logo variants and a clean committed source tree for packaging. `SITE_MODE=production node scripts/package.mjs` remains blocked until the launch checklist is resolved. The build reads environment variables directly; `.env` is not automatically loaded. Configure `SITE_URL` to the verified HTTPS origin without a trailing slash.

The Formspree endpoint is public configuration. Confirm provider host restrictions, server validation, abuse controls and final-domain delivery. The CSP currently permits local assets and Formspree; any future CAPTCHA embed needs its exact domains configured and tested.

## Cutover and recovery

Before cutover, inspect the authoritative DNS and preserve mail/unrelated records; use the confirmed WHC target rather than the current parking address. Verify the final certificate, preferred host, redirects, EN/FR deep links, forms, icons, canonical/hreflang, robots and sitemap. No Google/Bing verification or submission has been performed.

Keep the previous verified site output and its host configuration. Roll back by restoring that package and configuration, retaining a record of the source revision. Canonical source is `https://github.com/GrafovGroup/WindowServices.git`; there is no separate Sites remote.

WHC references consulted November 11, 2026: [cPanel access](https://help.whc.ca/en/articles/625469-how-to-access-cpanel), [addon domains](https://clients.whc.ca/index.php?language=english&rp=%2Fknowledgebase%2F153%2FDomaines-suppl%C3%A9mentaires-et-alias.html), [File Manager](https://clients.whc.ca/index.php?language=english&rp=%2Fknowledgebase%2F1730%2FHow-to-use-the-File-Manager.html). The account's actual domain root was verified in cPanel rather than assumed from a primary-domain example.

Staging verification: `windowservices-preview-5263960e9689.tar.gz` and its checksum are uploaded to `~/windowservices-staging`. The archive was built from clean source `5263960e9689236374a408502c41d046b923047f`. Its authenticated WHC read-back matches SHA-256 `1e64428d098d35812459ab372f1e0d79bfa68344ba59c02a0a52c366255707c0` (3,044,346 bytes). This is a non-public staged package, not a live deployment. Evidence: `docs/verification/whc-staging-report.json`.

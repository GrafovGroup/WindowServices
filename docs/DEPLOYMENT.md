# Deployment and recovery

No hosting account/project or domain binding is configured. No production deployment, DNS/mail changes or Google/Bing submissions have occurred. Local preview is `http://127.0.0.1:4173/en/` and `/fr/` while the server runs on this computer.

`node scripts/build.mjs` generates `dist/`. Default review mode uses noindex metadata, an empty sitemap and noindex host headers where supported. Noindex is not privacy: protect any private review deployment with host authentication.

Complete the launch checklist and record evidence before changing `launch` flags in `src/config/site.mjs`. `SITE_MODE=production` fails until all five flags are true. Flags are a safeguard, not independent verification. Production build: `SITE_MODE=production node scripts/build.mjs`.

Confirm actual hosting plan, document root, HTTPS, preferred hostname and server features. For WHC Pro, upload only the contents of `dist/` after authorization; never the repository, `.env`, documentation or local preview server. No Node process is required on the host.

Implement actual HTTP redirects for `/` → `/en/`, HTTPS/preferred hostname and trailing slashes. Invalid routes must return real HTTP 404 with EN/FR error documents, not the homepage. Preserve non-personal quote context. `_headers`/`_redirects` are included for compatible hosts; they are not assumed to configure WHC. Prepare equivalent `.htaccess` only after Apache/LiteSpeed support is confirmed. Verify actual error-document and cache behaviour.

CSP allows local assets and Formspree. If embedding a provider CAPTCHA later, configure the exact domains and test it. The current standard POST fallback leaves the site for provider verification. Confirm Formspree domain restrictions against the actual host. Use appropriate static caching on production; preview intentionally uses no-store.

Run unit, route and browser checks on the release output, then verify final hostname, statuses, EN/FR links, actual delivery, icons, canonical/hreflang, robots and sitemap. Never submit a preview sitemap. Search-console verification and submission require the correct authorized account.

Canonical source remote: `https://github.com/GrafovGroup/WindowServices.git`. Record `git rev-parse HEAD` for every release. There is no separate Sites remote. Keep the previous host output and matching configuration; rollback by redeploying that verified release. No force-push. Formspree endpoint is public; secrets belong in the host/provider, never in source or browser code.

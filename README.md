# WindowServices.ca

Bilingual static website for commercial and residential window-service enquiries. Canonical source: [GrafovGroup/WindowServices](https://github.com/GrafovGroup/WindowServices).

The website has **42 EN/FR routes**: home, four core services, commercial, residential, property management, a national enquiry hub, three guides, contact, quote, about, privacy, accessibility, next steps and localized 404s. The quote form uses the owner's Formspree endpoint `https://formspree.io/f/mppdzldb`.

**Live on WHC:** [English](https://windowservices.ca/en/) · [Français](https://windowservices.ca/fr/). All five production gates are supported by the [launch checklist](docs/LAUNCH_CHECKLIST.md). The approved option #1 reconstruction is installed; see the [logo proof](docs/preview/brand-proof.png). The operator is Superclean Canada Inc. The clean deployed revision is ef2e0e1162c8. Release evidence and current deployment status are in [project status](docs/PROJECT_STATUS.md).

## Build and preview

Use Node.js 24 LTS. No package installation is needed to build or serve the site.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173/en/` or `/fr/`. Rebuild after source edits, then reload. Stop the server with Ctrl+C. Set `PORT` to change the port. The loopback preview server always sends noindex headers and is not a production server.

Equivalent npm scripts: `npm run build`, `npm run dev`, `npm run check`. The lockfile records the intentionally dependency-free build. Generated `dist/` is ignored; deploy verified output using the release process. The owner selected existing WHC hosting. Its separate domain root and non-public staging folder are configured. Authoritative web DNS points to WHC; mail records were preserved.

## Release package

```sh
SITE_MODE=production node scripts/package.mjs
```

This rebuilds and audits the site, then creates `artifacts/windowservices-production-<revision>.tar.gz` and its SHA-256 checksum. Packaging uses Node 24, Git and the system `tar` command (available on macOS/Linux). The archive contains `site/`, a file-checksum/source manifest and deployment instructions. Working changes are explicitly marked in preview package names and metadata; production packaging requires committed source and all launch gates.

Extract into an empty directory, then verify it from the source checkout:

```sh
node scripts/verify-package.mjs /path/to/extracted-package
```

Upload only the contents of `site/` to the verified WHC document root with the included Apache-compatible `.htaccess` when release is authorized. Keep the manifest and instructions outside the web root. Review packages remain noindex; private previews need host authentication. See [deployment and recovery](docs/DEPLOYMENT.md).

## Checks

```sh
node scripts/build.mjs
node --test tests/*.test.mjs
node scripts/audit.mjs
```

Optional browser tooling is separate from the production build:

```sh
npm install --no-save --package-lock=false playwright@1.62.1 axe-core@4.11.0
npx playwright install chromium
# Keep the local preview server running in another terminal.
node tests/browser.mjs
node tests/accessibility.mjs
```

Use `CHROME_PATH` for an existing Chrome executable, `NODE_PATH` for an existing package directory, or `AXE_SCRIPT` for a separately installed axe bundle. Reports/screenshots go to ignored `artifacts/`. Browser tests intercept Formspree traffic; they never create real submissions. Live delivery testing requires separate explicit authorization.

## Editing

- `src/content/`: paired service copy and guides.
- `src/i18n/`: messages and route equivalents.
- `src/config/site.mjs`: contacts, region list, endpoint and production gates.
- `src/config/brand.mjs`: option #1 selection and the shared horizontal/reversed reconstructed logo exports.
- `src/components/`: shared page and form templates.
- `public/`: CSS, small JS modules, responsive photography, vector logos, social cards and favicon assets.
- `assets/originals/`: licensed photographic originals.
- `scripts/`, `tests/`: build, preview and verification.
- `docs/`: project continuity, source evidence and deployment notes.

Use `route()` and `quoteLink()` rather than hardcoded navigation. Add both translations together. Optional, consent-gated GA4 measures visits and enquiry steps; see docs/ANALYTICS.md. No uploads, visitor accounts, payments or database are included. The build reads environment variables directly; `.env` is not automatically loaded. Use `.env.example` as a reference or `node --env-file=.env scripts/build.mjs`. Never commit credentials or enquiries. The Formspree form ID is intentionally public.

## Resume

Read [MASTER_PROMPT.md](MASTER_PROMPT.md), [status](docs/PROJECT_STATUS.md), [decisions](docs/DECISIONS.md) and [launch checklist](docs/LAUNCH_CHECKLIST.md). Preserve the approved option #1 reconstruction and owner-confirmed operating/privacy policy. Final live EN/email and FR/phone-only enquiries were accepted under the configured provider restrictions. Earlier notification receipt was owner-confirmed. Follow the deployment record for the installed release and remaining checks; never resubmit real test enquiries without explicit authorization.

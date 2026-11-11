# WindowServices.ca

Bilingual static website for commercial and residential window-service enquiries. Canonical source: [GrafovGroup/WindowServices](https://github.com/GrafovGroup/WindowServices).

The initial review build has **42 EN/FR routes**: home, four core services, commercial, residential, property management, a national enquiry hub, three guides, contact, quote, about, privacy, accessibility, next steps and localized 404s. The quote form uses the owner's Formspree endpoint `https://formspree.io/f/mppdzldb`.

**Review build, not a production launch.** All pages are noindex. Production is gated on the evidence in [the launch checklist](docs/LAUNCH_CHECKLIST.md). The original concept #1 artwork could not be retrieved from its private Library link. The present wordmark and W favicon are temporary, not the approved final identity.

## Build and preview

Use Node.js 24 LTS. No package installation is needed to build or serve the site.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173/en/` or `/fr/`. Rebuild after source edits, then reload. Stop the server with Ctrl+C. Set `PORT` to change the port. The loopback preview server always sends noindex headers and is not a production server.

Equivalent npm scripts: `npm run build`, `npm run dev`, `npm run check`. The lockfile records the intentionally dependency-free build. Generated `dist/` is ignored; deploy its contents only after release checks.

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
- `src/components/`: shared page and form templates.
- `public/`: CSS, small JS modules, responsive photography and temporary brand/icon assets.
- `assets/originals/`: licensed photographic originals.
- `scripts/`, `tests/`: build, preview and verification.
- `docs/`: project continuity, source evidence and deployment notes.

Use `route()` and `quoteLink()` rather than hardcoded navigation. Add both translations together. No analytics, uploads, accounts, payments or database are included. The build reads environment variables directly; `.env` is not automatically loaded. Use `.env.example` as a reference or `node --env-file=.env scripts/build.mjs`. Never commit credentials or enquiries. The Formspree form ID is intentionally public.

## Resume

Read [MASTER_PROMPT.md](MASTER_PROMPT.md), [status](docs/PROJECT_STATUS.md), [decisions](docs/DECISIONS.md) and [launch checklist](docs/LAUNCH_CHECKLIST.md). Preserve concept #1, resolve its source artwork, verify form delivery and business facts, then select the actual host. No production publishing, DNS changes or search submissions have been performed.

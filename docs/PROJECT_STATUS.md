# Project status — November 11, 2026

Phase: **initial bilingual review build implemented; production launch awaits evidence**. Source target: `GrafovGroup/WindowServices`, `main`. Identify this implementation with `git log -1 --format=%H -- docs/PROJECT_STATUS.md` after checkout. Original prompt baseline: `3d20c42e65fe3781618f449231ad82224cb887be`.

Implemented: 42 EN/FR routes; responsive header/footer; four service pillars; commercial/residential/property-management journeys; all 13 regions in a qualified hub; three guides; contact/about/privacy/accessibility; quote/next steps and localized 404s. Includes temporary wordmark/icons, self-hosted responsive stock media, metadata/schema, reciprocal language alternates, root redirect and noindex review safeguards.

Owner's Formspree endpoint is integrated. On November 11, 2026, after explicit authorization, exactly two live enquiries (EN/email, FR/phone-only) were accepted by Formspree with HTTP 200 and `ok: true`; both showed localized UI confirmation. The owner subsequently confirmed receipt of the test notifications. Provider settings and final-host behaviour still need verification. See the launch checklist and docs/verification/live-form-report.json. No production publishing, DNS/mail changes or search submission has been performed.

Build, route/link audit, meaningful unit tests and browser/accessibility checks are documented in the checklist. No real-device Safari/iOS verification, field performance data or ranking is claimed.

Remaining: original logo/exports; actual service/region fulfilment; Formspree account rules and final-host verification; contracting entity and privacy practices; actual host/domain binding. Conditional specialist services and local pages remain planned, not advertised as available.

Resume by reading this record, decisions and checklist. Resolve the exact missing evidence, preserve concept #1, verify the final-host form behaviour and prepare a release on the selected host. Continue this source rather than creating another starter or duplicate Site.

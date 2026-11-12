# Project status — November 11, 2026

Phase: **production release authorized; final installation and verification in progress**. Canonical source: GrafovGroup/WindowServices, main. The original master prompt remains unchanged. Match installed output to the release manifest rather than assuming the latest documentation commit is the deployed source revision.

Implemented: 42 EN/FR routes, four core services, commercial/residential/property-management journeys, one qualified national enquiry hub, three guides, contact/about/privacy/accessibility, quote/next steps and localized 404s. Approved option #1 vector branding, self-hosted media, canonical/hreflang metadata, structured data and bilingual social cards are included.

All five production gates are cleared: approved logo; owner-confirmed core service capability subject to project/location; named operator and adopted privacy policy; accepted live enquiries with earlier owner-confirmed inbox receipt; verified WHC domain root, authoritative DNS and valid TLS. Owner evidence is in docs/verification/launch-owner-confirmations.json and brand-approval.json.

Hosting: srv48.swhc.ca / 51.161.57.68, LiteSpeed, document root /home/nqgwub76/windowservices.ca. Authoritative web A record now points to WHC; nameservers, mail and unrelated DNS records are unchanged. Existing resolver caches may temporarily return the parking site. Valid HTTPS covers apex and www. A wrong certificate binding on this domain was removed before AutoSSL issued the correct certificate; other bindings were not intentionally modified.

Formspree: required/type/length checks, Formshield, honeypot and windowservices.ca domain restriction are configured. Email-or-phone and enum membership remain website validation because the provider UI does not express those combination rules. Shared quota is 200/month; 42 were used before the two final launch tests. No plan or billing change was made. Final EN/email and FR/phone-only requests both returned HTTP 200 with ok:true and localized success. Final inbox receipt is not independently confirmed; earlier receipt was owner-confirmed. No more live submissions are authorized.

Release preparation: LiteSpeed-specific error routing now uses separate EN/FR internal documents and a French directory configuration. Preview live verification passed 42 routes and 69 additional files with exact content hashes, valid TLS, headers, root redirect and genuine localized 404s. Production packaging includes 116 public files. Final production browser/accessibility/crawl reports will be recorded after installation.

Search-console submission, real-device/Safari/Firefox/Edge checks and field performance are distinct from launch readiness; record only checks actually performed. No ranking, indexing, compliance or performance certification is claimed.

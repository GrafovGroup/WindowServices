# Decisions — November 11, 2026

| Decision | Authority / reason |
| --- | --- |
| Preserve MASTER_PROMPT.md and save source to GrafovGroup/WindowServices | Explicit owner request. Original prompt remains unchanged. |
| Use logo option #1 — Architectural / Commercial | Owner explicitly reconfirmed "lets use option 1" on November 11, 2026. The recovered artwork was reconstructed and visually approved by the owner. |
| Use the owner's existing WHC hosting | Owner selected WHC on November 11, 2026 and asked the agent to log in. Account inspected through cPanel; separate domain root and non-public staging folder created. The owner later authorized public launch; authoritative web DNS now points to the verified WHC server. |
| Package fresh, audited output with file checksums | Implementation choice for reproducible source recovery and upload verification. Archive includes public site files plus a separate source/checksum manifest; it does not deploy or change DNS. |
| `/en/` and `/fr/`, shared route equivalence map | Master prompt. No geolocation redirect. |
| Dependency-free Node 24 static generator | Implementation choice permitted by the static-first brief. No client framework is needed. Portable output for ordinary hosting. |
| Native HTML POST plus vanilla-JS enhancement | Matches the owner's Formspree HTML/JS guides. Endpoint `mppdzldb` supplied by owner; no CDN SDK dependency. |
| Noindex review build with production gates | Preview remains the safe default. All production gates are now supported by owner confirmations and live hosting/form evidence. |
| Reconstructed option #1 replaces temporary wordmark and W icon | Original sheet recovered and retained unchanged. Geometry traced; licensed Manrope lettering outlined. Owner explicitly approved the reconstruction on November 11, 2026 after viewing the proof. |
| Four service pages, useful guides, one coverage hub | No verified specialist capability/local presence to justify more advertised services or city pages. |
| No uploads, analytics or accounts | No approved integrations or need. Personal data never goes into URLs or analytics. |
| Mocked submission tests | Real Formspree tests may send notifications; explicit authorization requested separately. |

Sites skill design and local-preview guidance informed the build. No Sites project was registered: the selected destination is GitHub, and the owner selected existing WHC for the authorized production release.

| Launch decision | Authority / reason |
| --- | --- |
| Launch on existing WHC | Explicit owner request to complete remaining checks and get the site live. Web DNS changes preserve mail/unrelated records. |
| Confirmed operator and privacy policy | Owner supplied Superclean Canada Inc. and adopted the Privacy Officer contact plus 12-month unsuccessful-enquiry policy. |
| Four core services with qualified availability | Owner confirmed all four subject to project and location confirmation. |
| Provider fallback language | Formspree _language uses en/fr alongside internal language=en-CA/fr-CA. Documented provider option; mocked browser payloads verify it without extra live submissions. |
| Stable LiteSpeed error routing | Live testing exposed generic 404s with the previous conditional configuration. Separate internal documents and French directory scope passed actual WHC checks. |

## Production launch outcome

Clean release ef2e0e1162c8 is installed on existing WHC. Archive SHA-256 and final file/route hashes match. All four core services remain subject to project/location confirmation. The adopted operator and privacy policy are published bilingually. Google and Bing domain ownership were verified with additional DNS records; the 36-URL production sitemap was submitted to both. Processing/indexing is recorded separately. No recurring automation or extra real test enquiry was created.

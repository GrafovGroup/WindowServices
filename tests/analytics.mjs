// Consent and lead semantics; all provider and Google requests are intercepted.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { route } from '../src/i18n/routes.mjs';
import { writeFile } from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)('playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const report={checkedAt:new Date().toISOString(),origin:base,checks:[]};
try {
 const context=await browser.newContext({viewport:{width:390,height:844}});let tags=0;
 await context.route('https://formspree.io/**',r=>r.abort());
 await context.route(/https:\/\/(www\.googletagmanager\.com|[^/]*google-analytics\.com)\//,async r=>{tags++;await r.fulfill({contentType:'text/javascript',body:''});});
 // Simulate stale unversioned code in a returning visitor's cache. New pages must bypass it.
 await context.route('**/site.js',r=>r.fulfill({contentType:'text/javascript',body:'throw new Error("Stale script loaded")'}));
 const page=await context.newPage();
 const events=()=>page.evaluate(()=>Array.from(window.dataLayer||[],v=>Array.from(v)).filter(v=>v[0]==='event'));
 for(const lang of ['en','fr']){
  await page.goto(base+'/'+lang+'/');await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.locator('#analytics-consent').waitFor({state:'visible'});assert.equal(tags,0);
  await page.locator('[data-consent="declined"]').click();await page.reload();assert.equal(tags,0);assert(await page.locator('#analytics-consent').isHidden());
  report.checks.push(`${lang}: no Google requests before consent or after refusal`);
 }
 await page.goto(base+route('quote','en')+'?email=private@example.com&message=secret');
 await page.locator('[data-analytics-settings]').click();await page.locator('[data-consent="accepted"]').click();
 await page.waitForFunction(()=>window.dataLayer?.length);assert.equal(tags,1);
 let queue=await page.evaluate(()=>Array.from(window.dataLayer,v=>Array.from(v)));
 assert(!JSON.stringify(queue).includes('private@example.com'));assert(!JSON.stringify(queue).includes('secret'));
 assert.equal(queue.find(v=>v[0]==='config')[2].send_page_view,false);
 assert.equal((await events()).filter(v=>v[1]==='page_view').length,1);
 await page.locator('#submit-request').click();assert((await events()).some(v=>v[1]==='quote_validation_error'));
 await page.locator('#name').fill('PRIVATE PERSON');await page.locator('#email').fill('private@example.com');await page.locator('#city').fill('Private city');
 await page.locator('#province').selectOption('QC');await page.locator('#property').selectOption('commercial');await page.locator('#service').selectOption('repair');await page.locator('#message').fill('PRIVATE PROJECT INFORMATION');
 await page.route('https://formspree.io/f/mppdzldb',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false}'}));
 await page.locator('#submit-request').click();await page.locator('#form-status').waitFor({state:'visible'});
 assert(!(await events()).some(v=>v[1]==='generate_lead'));
 await page.unroute('https://formspree.io/f/mppdzldb');
 await page.route('https://formspree.io/f/mppdzldb',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
 await page.locator('#submit-request').click();await page.locator('#form-success').waitFor({state:'visible'});
 const sent=await events();assert.equal(sent.filter(v=>v[1]==='generate_lead').length,1);
 assert.deepEqual(sent.find(v=>v[1]==='generate_lead')[2],{page_id:'quote',site_language:'en',service:'repair',property_type:'commercial',send_to:queue.find(v=>v[0]==='config')[1]});
 assert(!JSON.stringify(sent).includes('PRIVATE'));assert(!JSON.stringify(sent).includes('private@example.com'));
 report.checks.push('Only accepted Formspree response produces one generate_lead; no entered personal data or URL query reaches Analytics');
 await page.locator('[data-analytics-settings]').click();await page.locator('[data-consent="declined"]').click();
 const before=(await events()).length;
 await page.evaluate(async()=>{const {track}=await import('/analytics.js'+new URL(document.querySelector('script[src*="site.js"]').src).search);track('phone_click');});
 assert.equal((await events()).length,before);
 assert(await page.locator('[data-analytics-settings]').evaluate(e=>e===document.activeElement));
 const prior=tags;await page.reload();assert.equal(tags,prior);assert.equal(await page.evaluate(()=>typeof window.gtag),'undefined');
 report.checks.push('Withdrawal blocks subsequent events and persists across reload; settings return keyboard focus');
 assert(await page.locator('#analytics-consent').isHidden());
 report.pass=true;await writeFile('artifacts/analytics-report.json',JSON.stringify(report,null,2));console.log('PASS: bilingual opt-in/refusal/withdrawal; sanitized URLs and allowlisted payloads; accepted-lead semantics. No real submissions or analytics hits.');
} finally {await browser.close();}

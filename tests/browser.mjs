// Optional QA dependency: playwright 1.62.1. No production dependency.
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { route } from '../src/i18n/routes.mjs';
const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,...(process.env.HOST_RESOLVER_RULES?{args:['--host-resolver-rules='+process.env.HOST_RESOLVER_RULES]}:{}),...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
// Never send test enquiries to the real provider. Each test explicitly mocks a result.
await context.route('https://formspree.io/**',r=>r.abort());
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={browser:await browser.version(),checkedAt:new Date().toISOString(),origin:base,connectedTo:process.env.HOST_RESOLVER_RULES||'default DNS',routes:0,responsive:[],forms:[],screenshots:[]};
await mkdir('artifacts',{recursive:true});
try {
 const manifest=JSON.parse(await readFile('dist/route-manifest.json','utf8'));
 for(const item of manifest) {
   const response=await page.goto(base+item.path);assert.equal(response.status(),item.id==='error'?404:200,item.path);
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('html').getAttribute('lang'),item.lang+'-CA');
   const missing=await page.locator('img').evaluateAll(imgs=>imgs.filter(img=>!img.hasAttribute('alt')).length);assert.equal(missing,0);
   assert.equal(await page.locator('a[href=""],a[href="#"]').count(),0);report.routes++;
 }
 for(const width of [360,390,768,1280,1440,1920])for(const lang of ['en','fr'])for(const id of ['home','cleaning','commercial','residential','quote','areas','condensation']) {
   await page.setViewportSize({width,height:900});await page.goto(base+route(id,lang));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${lang}/${id} overflows at ${width}`);
   report.responsive.push(`${lang}/${id}@${width}`);
 }
 for(const [lang,id,width,name] of [['en','home',1440,'home-desktop'],['fr','home',390,'home-mobile-fr'],['fr','quote',390,'quote-mobile-fr'],['en','repair',1440,'repair-desktop'],['fr','areas',768,'areas-tablet-fr']]) {
   await page.setViewportSize({width,height:1000});await page.goto(base+route(id,lang));
   await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
   await page.screenshot({path:`artifacts/${name}.png`,fullPage:true});report.screenshots.push(name+'.png');
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/fr/');
 await page.locator('#menu-toggle').click();assert(await page.locator('#mobile-menu').evaluate(el=>el.open));
 assert(await page.evaluate(()=>document.body.classList.contains('menu-open')));
 await page.keyboard.press('Shift+Tab');assert(await page.locator('#mobile-menu').evaluate(el=>el.contains(document.activeElement)));
 await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),false);
 assert.equal(await page.locator('#menu-toggle').evaluate(el=>el===document.activeElement),true);
 await page.goto(base+'/en/services/window-repair/');await page.locator('.utility [data-language]').click();assert(page.url().endsWith('/fr/services/reparation-fenetres/'));
 await page.locator('details').first().locator('summary').click();assert(await page.locator('details').first().getAttribute('open')!==null);
 async function fill(lang) {
   await page.goto(base+route('quote',lang)+'?service=cleaning&property=commercial&province=QC&source=cleaning');
   assert.equal(await page.locator('input[name="_language"]').inputValue(),lang);assert.equal(await page.locator('#service').inputValue(),'cleaning');assert.equal(await page.locator('#property').inputValue(),'commercial');
   assert.equal(await page.locator('input[name="source_route"]').inputValue(),route('cleaning',lang));
   assert(await page.locator('#frequency').isVisible());
   await page.locator('#name').fill('WEBSITE TEST — DO NOT BOOK');await page.locator('#email').fill('website-test@example.com');
   await page.locator('#city').fill('Montréal');await page.locator('#message').fill('Integration test only. Essai technique — aucun travail demandé.');
 }
 for(const lang of ['en','fr']) {
   await page.goto(base+route('quote',lang));await page.locator('#submit-request').click();assert(await page.locator('#name-error').isVisible());
   assert.equal(await page.locator('#name').getAttribute('aria-invalid'),'true');
   await fill(lang);await page.locator('#email').fill('');await page.locator('#phone').fill('(833) 696-9996');
   let requests=0;let payload='';
   await page.route('https://formspree.io/f/mppdzldb',async r=>{requests++;payload=r.request().postData()||'';await new Promise(resolve=>setTimeout(resolve,100));await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});});
   await page.locator('#submit-request').click();await page.locator('#form-success').waitFor({state:'visible'});assert.equal(requests,1);assert(payload.includes('Montréal'));assert(payload.includes('name="language"'));assert(payload.includes('name="_language"\r\n\r\n'+lang+'\r\n'));assert(!payload.includes('name="email"'));
   report.forms.push(`${lang}: phone-only accepted response, context, Unicode and single submission`);await page.unroute('https://formspree.io/f/mppdzldb');
   await fill(lang);await page.route('https://formspree.io/f/mppdzldb',r=>r.fulfill({status:422,contentType:'application/json',body:JSON.stringify({errors:[{field:'email',message:'Invalid email'}]})}));
   await page.locator('#submit-request').click();await page.locator('#email-error').waitFor({state:'visible'});assert.equal(await page.locator('#email').inputValue(),'website-test@example.com');assert(await page.locator('#form-success').isHidden());
   report.forms.push(`${lang}: provider rejection preserves details and cannot show success`);await page.unroute('https://formspree.io/f/mppdzldb');
   await fill(lang);await page.route('https://formspree.io/f/mppdzldb',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false})}));
   await page.locator('#submit-request').click();await page.locator('#form-status').waitFor({state:'visible'});assert(await page.locator('#form-success').isHidden());await page.unroute('https://formspree.io/f/mppdzldb');
   report.forms.push(`${lang}: HTTP 200 without acceptance is not success`);
   await fill(lang);await page.locator('#service').selectOption('replacement');assert(await page.locator('#frequency').isDisabled());assert(await page.locator('#openings').isVisible());
   await page.locator('#submit-request').click();await page.locator('#form-status').waitFor({state:'visible'});assert(await page.locator('#form-success').isHidden());assert.equal(await page.locator('#name').inputValue(),'WEBSITE TEST — DO NOT BOOK');
   report.forms.push(`${lang}: network failure and progressive field state`);
 }
 const noJs=await browser.newContext({javaScriptEnabled:false});await noJs.route('https://formspree.io/**',r=>r.abort());const plain=await noJs.newPage();await plain.goto(base+'/fr/demander-une-soumission/');assert.equal(await plain.locator('form').getAttribute('action'),'https://formspree.io/f/mppdzldb');assert(await plain.locator('#quote-form noscript').isVisible());assert.equal(await plain.locator('input[name="_language"]').inputValue(),'fr');await noJs.close();
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/en/');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 assert.equal((await page.goto(base+'/fr/page-inconnue/')).status(),404);assert.equal(await page.locator('html').getAttribute('lang'),'fr-CA');
 assert.deepEqual(errors,[]);report.pass=true;await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2));console.log(`PASS: ${report.routes} HTTP routes; ${report.responsive.length} responsive views; bilingual form states; menu keyboard/focus; locale links; 404; reduced motion; no-JS form.`);
} finally {await browser.close();}

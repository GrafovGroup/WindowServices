import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { route } from '../src/i18n/routes.mjs';
const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const axeSource=await readFile(process.env.AXE_SCRIPT||require.resolve('axe-core/axe.min.js'),'utf8');
const browser=await chromium.launch({headless:true,...(process.env.HOST_RESOLVER_RULES?{args:['--host-resolver-rules='+process.env.HOST_RESOLVER_RULES]}:{}),...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
try {
 const page=await browser.newPage();await page.route('https://formspree.io/**',r=>r.abort());
 for(const width of [390,1440])for(const lang of ['en','fr'])for(const id of ['home','repair','quote','areas','privacy']) {
  await page.setViewportSize({width,height:900});await page.goto((process.env.TEST_URL||'http://127.0.0.1:4173')+route(id,lang));
  await page.evaluate(axeSource);
  const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  results.push({path:route(id,lang),width,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>v.id)});
 }
 await writeFile('artifacts/accessibility-report.json',JSON.stringify(results,null,2));
 const violations=results.flatMap(r=>r.violations.map(v=>({path:r.path,width:r.width,...v})));
 if(violations.length)console.log(JSON.stringify(violations,null,2));assert.equal(violations.length,0);
 console.log(`PASS: axe-core 4.11.0, ${results.length} page/viewport combinations, no automatic WCAG A/AA violations. Manual review still required.`);
} finally {await browser.close();}

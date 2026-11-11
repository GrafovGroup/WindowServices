import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { route } from '../src/i18n/routes.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const manifest=JSON.parse(await readFile(resolve(root,'route-manifest.json'),'utf8'));
const titles=new Set(),descriptions=new Set();let references=0;
for(const page of manifest) {
 const html=await readFile(resolve(root,'.'+page.path,'index.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(title&&!titles.has(title),`Duplicate/missing title: ${page.path}`);titles.add(title);
 const description=html.match(/name="description" content="([^"]+)"/)?.[1];assert(description&&!descriptions.has(description),`Duplicate/missing description: ${page.path}`);descriptions.add(description);
 assert.equal((html.match(/<h1>/g)||[]).length,1,`H1: ${page.path}`);
 assert(html.includes(`<html lang="${page.lang}-CA">`));
 for(const lang of ['en','fr'])assert(html.includes(`hreflang="${lang}-CA" href="https://windowservices.ca${route(page.id,lang)}"`));
 for(const icon of ['/favicon.ico','/favicon.svg','/favicon-96.png','/apple-touch-icon.png','/site.webmanifest'])assert(html.includes(icon));
 assert(html.includes(`content="${page.indexable?'index,follow':'noindex,follow'}"`));
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
   const path=match[1];const target=resolve(root,'.'+path,path.endsWith('/')?'index.html':'');
   assert((await stat(target).catch(()=>null))?.isFile(),`Missing ${path} from ${page.path}`);references++;
 }
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
 assert(!/aggregateRating|"review"|"openingHours"|"priceRange"/.test(html),'Unsupported schema');
}
const ico=await readFile(resolve(root,'favicon.ico'));assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
assert.equal((await readFile(resolve(root,'sitemap.xml'),'utf8')).includes('<loc>'),manifest.some(p=>p.indexable));
console.log(`PASS: ${manifest.length} routes; ${references} internal references; unique metadata; paired locales; icons; schema; preview indexing.`);

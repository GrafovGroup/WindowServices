import { mkdir, rm, cp, writeFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, launch } from '../src/config/site.mjs';
import { brand, validateBrand } from '../src/config/brand.mjs';
import { routes, route } from '../src/i18n/routes.mjs';
import { renderPage } from '../src/components/render.mjs';
import { esc } from '../src/components/html.mjs';
import { contentSecurityPolicy } from './lib/security.mjs';
import { apacheConfig, frenchApacheConfig } from './lib/apache-config.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'dist');
if(!['preview','production'].includes(site.mode))throw new Error('SITE_MODE must be preview or production.');
if(site.mode==='production') {
  const missing=Object.entries(launch).filter(([,ok])=>!ok).map(([key])=>key);
  if(missing.length)throw new Error(`Production release blocked: ${missing.join(', ')}. Record evidence before changing src/config/site.mjs.`);
}
const origin=new URL(site.origin);
if(origin.protocol!=='https:' || origin.origin!==site.origin)throw new Error('SITE_URL must be an HTTPS origin without a trailing slash.');
if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(site.formEndpoint))throw new Error('Use a verified Formspree endpoint.');
validateBrand(brand,{production:site.mode==='production'});
for(const variant of ['horizontal','reversed'])if(brand[variant]) {
  const asset=join(root,'public',brand[variant].src);
  if(!(await stat(asset).catch(()=>null))?.isFile())throw new Error(`Missing ${variant} brand asset: ${brand[variant].src}`);
}
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});await cp(join(root,'public'),output,{recursive:true});
const manifest=[];
for(const id of Object.keys(routes))for(const lang of ['en','fr']) {
  const path=route(id,lang),dir=join(output,path);
  await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),renderPage(id,lang));
  manifest.push({id,lang,path,indexable:site.mode==='production'&&!['quote','thanks','error'].includes(id)});
}
await writeFile(join(output,'404.html'),renderPage('error','en'));
await mkdir(join(output,'_errors'),{recursive:true});
for(const lang of ['en','fr'])await writeFile(join(output,'_errors',`${lang}.html`),renderPage('error',lang));
await writeFile(join(output,'index.html'),`<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=/en/"><title>WindowServices.ca — English / Français</title><link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"></head><body><p><a href="/en/">English</a> · <a href="/fr/">Français</a></p></body></html>`);
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${manifest.filter(p=>p.indexable).map(p=>`<url><loc>${esc(site.origin+p.path)}</loc></url>`).join('')}</urlset>`);
await writeFile(join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
await writeFile(join(output,'_redirects'),`/ /en/ ${site.mode==='production'?301:302}\n/fr/* /fr/404/index.html 404\n/* /404.html 404\n`);
await writeFile(join(output,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: ${contentSecurityPolicy}\n${site.mode==='preview'?'  X-Robots-Tag: noindex, follow\n':''}`);
await writeFile(join(output,'route-manifest.json'),JSON.stringify(manifest,null,2));
await writeFile(join(output,'.htaccess'),apacheConfig(site));
await writeFile(join(output,'fr','.htaccess'),frenchApacheConfig(site));
console.log(`Built ${manifest.length} EN/FR routes in ${site.mode} mode. Output: ${output}`);

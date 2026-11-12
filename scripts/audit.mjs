import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { routes, route } from '../src/i18n/routes.mjs';
import { site } from '../src/config/site.mjs';

export async function auditSite({ output, origin, mode }) {
  const root = resolve(output);
  assert(['preview', 'production'].includes(mode), 'Unknown build mode');
  assert.equal(new URL(origin).origin, origin, 'Expected an origin without a path');
  const manifest = JSON.parse(await readFile(resolve(root, 'route-manifest.json'), 'utf8'));
  const expected = Object.keys(routes).flatMap(id => ['en', 'fr'].map(lang => ({
    id, lang, path: route(id, lang),
    indexable: mode === 'production' && !['quote', 'thanks', 'error'].includes(id),
  })));
  assert.deepEqual(manifest, expected, 'Route manifest does not match the source routes and release mode');
  const titles = new Set(), descriptions = new Set();
  let references = 0;
  async function checkAsset(path, from) {
    const target = resolve(root, '.' + path, path.endsWith('/') ? 'index.html' : '');
    assert(target.startsWith(root + sep), `Asset outside output: ${path}`);
    assert((await stat(target).catch(() => null))?.isFile(), `Missing ${path} from ${from}`);
    references++;
  }
  for (const page of manifest) {
    const html = await readFile(resolve(root, '.' + page.path, 'index.html'), 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert(title && !titles.has(title), `Duplicate/missing title: ${page.path}`);
    titles.add(title);
    const description = html.match(/name="description" content="([^"]+)"/)?.[1];
    assert(description && !descriptions.has(description), `Duplicate/missing description: ${page.path}`);
    descriptions.add(description);
    assert.equal((html.match(/<h1>/g) || []).length, 1, `H1: ${page.path}`);
    assert(html.includes(`<html lang="${page.lang}-CA">`));
    assert(html.includes(`rel="canonical" href="${origin + page.path}"`), `Canonical: ${page.path}`);
    assert(html.includes(`property="og:url" content="${origin + page.path}"`), `Sharing URL: ${page.path}`);
    const socialImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    assert(socialImage?.startsWith(origin + '/brand/'), `Brand sharing image: ${page.path}`);
    await checkAsset(new URL(socialImage).pathname, page.path);
    for (const lang of ['en', 'fr']) {
      assert(html.includes(`hreflang="${lang}-CA" href="${origin + route(page.id, lang)}"`), `Language alternate: ${page.path}`);
    }
    assert(html.includes(`hreflang="x-default" href="${origin + route(page.id, 'en')}"`));
    for (const icon of ['/favicon.ico', '/favicon.svg', '/favicon-96.png', '/apple-touch-icon.png', '/site.webmanifest']) assert(html.includes(icon));
    assert(html.includes(`name="robots" content="${page.indexable ? 'index,follow' : 'noindex,follow'}"`));
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) await checkAsset(match[1], page.path);
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) await checkAsset(candidate.trim().split(/\s+/)[0], page.path);
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
    assert(!/aggregateRating|"review"|"openingHours"|"priceRange"/.test(html), 'Unsupported schema');
  }
  const ico = await readFile(resolve(root, 'favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  const actualUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(actualUrls, expected.filter(page => page.indexable).map(page => origin + page.path), 'Sitemap membership');
  const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
  assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Robots sitemap origin');
  const headers = await readFile(resolve(root, '_headers'), 'utf8');
  assert.equal(headers.includes('X-Robots-Tag: noindex'), mode === 'preview', 'Host indexing headers');
  return { routes: manifest.length, references, origin, mode };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await auditSite({ output: fileURLToPath(new URL('../dist/', import.meta.url)), origin: site.origin, mode: site.mode });
  console.log(`PASS: ${result.routes} routes; ${result.references} internal references; canonical/locale URLs; responsive images; icons; schema; ${result.mode} sitemap and indexing.`);
}

import assert from 'node:assert/strict';
import https from 'node:https';
import http from 'node:http';
import { isIP } from 'node:net';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { inventory } from './lib/release-files.mjs';
import { site } from '../src/config/site.mjs';

// An explicit origin IP lets us verify WHC during DNS propagation. TLS hostname
// and certificate validation remain enabled; no requests submit form data.
const ip = process.env.VERIFY_IP;
if (ip) assert(isIP(ip), 'VERIFY_IP must be an IP address');
const lookup = ip ? (_host, options, done) => options?.all
  ? done(null, [{ address: ip, family: isIP(ip) }]) : done(null, ip, isIP(ip)) : undefined;
const get = url => new Promise((resolve, reject) => {
  const client = url.startsWith('https:') ? https : http;
  const request = client.get(url, { lookup, headers: { 'User-Agent': 'WindowServices-launch-check' } }, response => {
    const certificate = response.socket.getPeerCertificate?.();
    const chunks = [];
    response.on('data', chunk => chunks.push(chunk));
    response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks), certificate }));
    response.on('error', reject);
  });
  request.setTimeout(15000, () => request.destroy(new Error(`Timeout: ${url}`)));
  request.on('error', reject);
});
const manifest = JSON.parse(await readFile('dist/route-manifest.json', 'utf8'));
const files = await inventory('dist');
const byPath = new Map(files.map(file => [file.path, file]));
const production = site.mode === 'production';
const checked = [];
let certificate;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function security(response) {
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.match(response.headers['content-security-policy'] || '', /form-action https:\/\/formspree\.io/);
  if (production) assert(!/noindex/i.test(response.headers['x-robots-tag'] || ''));
  else assert.match(response.headers['x-robots-tag'] || '', /noindex/i);
}
for (const item of manifest) {
  const response = await get(site.origin + item.path);
  assert.equal(response.status, item.id === 'error' ? 404 : 200, item.path);
  assert.equal(hash(response.body), byPath.get(item.path.slice(1) + 'index.html').sha256, `Published content differs: ${item.path}`);
  security(response);
  if (response.certificate?.subject) certificate = response.certificate;
  checked.push({ path: item.path, status: response.status });
}
for (const lang of ['en', 'fr']) {
  const response = await get(`${site.origin}/${lang}/launch-check-missing-page/`);
  assert.equal(response.status, 404);
  assert.match(response.body.toString(), new RegExp(`<html lang="${lang}-CA"`));
}
let publicFiles = 0;
for (const file of files) {
  if (file.path === 'index.html' || /(?:^|\/)\.htaccess$/.test(file.path) || ['_headers', '_redirects'].includes(file.path)) continue;
  if (manifest.some(item => item.path.slice(1) + 'index.html' === file.path)) continue;
  const response = await get(site.origin + '/' + file.path);
  assert.equal(response.status, file.path === '404.html' ? 404 : 200, file.path);
  assert.equal(hash(response.body), file.sha256, `Published file differs: ${file.path}`);
  publicFiles++;
}
for (const path of ['/.htaccess', '/fr/.htaccess']) assert.equal((await get(site.origin + path)).status, 403, path);
const root = await get(site.origin + '/');
assert.equal(root.status, production ? 301 : 302);
assert.equal(new URL(root.headers.location, site.origin).pathname, '/en/');
if (production) {
  for (const origin of [site.origin.replace('https:', 'http:'), site.origin.replace('://', '://www.')]) {
    const response = await get(origin + '/fr/?check=redirect');
    assert.equal(response.status, 301, origin);
    assert.equal(response.headers.location, site.origin + '/fr/?check=redirect', origin);
  }
}
const report = {
  checkedAt: new Date().toISOString(), origin: site.origin, mode: site.mode,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  sourceDirty: !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(),
  connectedTo: ip || 'public DNS', certificateValidation: 'enabled',
  certificate: certificate ? { subject: certificate.subject, issuer: certificate.issuer, validFrom: certificate.valid_from, validTo: certificate.valid_to, subjectAltName: certificate.subjectaltname } : null,
  routes: checked, additionalFilesHashMatched: publicFiles,
  checks: ['All published route bodies match the local release', 'Localized genuine 404 responses', 'Security and indexing headers', 'Static asset SHA-256 matches', 'Host configuration files forbidden', 'Root redirect', ...(production ? ['HTTP to HTTPS redirect', 'www to canonical host redirect', 'Redirect query preserved'] : [])],
};
await writeFile('artifacts/live-site-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`PASS: ${checked.length} live routes, ${publicFiles} additional public files, TLS, redirects, headers and localized 404s.`);

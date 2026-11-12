import { cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { site } from '../src/config/site.mjs';
import { brand } from '../src/config/brand.mjs';
import { inventory, verifyRelease } from './lib/release-files.mjs';
import { auditSite } from './audit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const source = { commit: git('rev-parse', 'HEAD'), dirty: Boolean(git('status', '--porcelain', '--untracked-files=normal')) };
if (site.mode === 'production' && source.dirty) throw new Error('Commit the reviewed source before creating a production package.');

// Always rebuild, so an older dist/ cannot masquerade as the current source.
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit', env: process.env });
const output = join(root, 'dist');
const checks = await auditSite({ output, origin: site.origin, mode: site.mode });
const files = await inventory(output);
const artifacts = join(root, 'artifacts');
await mkdir(artifacts, { recursive: true });
const staging = await mkdtemp(join(artifacts, '.package-'));
const archiveName = `windowservices-${site.mode}-${source.commit.slice(0, 12)}${source.dirty ? '-working' : ''}.tar.gz`;
try {
  await cp(output, join(staging, 'site'), { recursive: true });
  const manifest = {
    schemaVersion: 1, createdAt: new Date().toISOString(), mode: site.mode, origin: site.origin,
    source, selectedLogoConcept: brand.selectedConcept,
    logoArtworkConfigured: Boolean(brand.horizontal && brand.reversed),
    routeCount: checks.routes, totalBytes: files.reduce((sum, file) => sum + file.bytes, 0), files,
  };
  await writeFile(join(staging, 'release.json'), JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(join(staging, 'DEPLOY.txt'), `WindowServices.ca — ${site.mode} package\n\nSource: ${source.commit}${source.dirty ? ' plus uncommitted working changes' : ''}\nOrigin: ${site.origin}\n\n${site.mode === 'preview' ? 'REVIEW ONLY: pages are noindex and the sitemap is empty. Noindex is not access control. Use host authentication for a private preview.\n\n' : ''}Upload only the contents of site/ to the confirmed document root. Keep this file and release.json outside the public web root. No Node process or source upload is required.\n\nThe included .htaccess targets the verified WHC LiteSpeed/Apache-compatible server. It supplies root redirects, localized real 404s, security headers and preview indexing controls. _headers and _redirects are alternatives for other compatible hosts. Verify the actual host before publishing; this package does not change DNS, mail or provider settings.\n\nFrom the source checkout, after extracting this archive:\nnode scripts/verify-package.mjs /path/to/extracted-package\n\nVerify actual host behaviour and the launch checklist before release. Preserve the previous verified package and host configuration for rollback.\n`);
  await verifyRelease(staging);
  const temporaryArchive = join(staging, archiveName);
  execFileSync('tar', ['--format=ustar', '-czf', temporaryArchive, '-C', staging, 'site', 'release.json', 'DEPLOY.txt'], {
    env: { ...process.env, COPYFILE_DISABLE: '1' }, stdio: 'inherit',
  });
  const archive = join(artifacts, archiveName);
  await rename(temporaryArchive, archive);
  const digest = createHash('sha256').update(await readFile(archive)).digest('hex');
  await writeFile(archive + '.sha256', `${digest}  ${archiveName}\n`);
  console.log(`PACKAGED: ${files.length} files; ${checks.routes} routes; ${site.mode}.\n${archive}\nSHA-256: ${digest}`);
} finally {
  await rm(staging, { recursive: true, force: true });
}

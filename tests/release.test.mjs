import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { validateBrand } from '../src/config/brand.mjs';
import { renderBrand } from '../src/components/brand.mjs';
import { inventory, verifyRelease } from '../scripts/lib/release-files.mjs';

test('production requires both logo variants; preview can use the temporary wordmark', () => {
  const waiting = { horizontal: null, reversed: null };
  assert.doesNotThrow(() => validateBrand(waiting));
  assert.throws(() => validateBrand(waiting, { production: true }), /Approved horizontal/);
  assert.match(renderBrand({}, waiting), /class="wordmark"/);
  const partial = { horizontal: { src: '/brand/approved.svg', width: 560, height: 112 }, reversed: null };
  assert.throws(() => validateBrand(partial, { production: true }), /Approved reversed/);
});

test('brand exports use local paths and real dimensions; footer selects the reversed variant', () => {
  const config = {
    horizontal: { src: '/brand/approved.svg', width: 560, height: 112 },
    reversed: { src: '/brand/approved-white.svg', width: 560, height: 112 },
  };
  assert.doesNotThrow(() => validateBrand(config, { production: true }));
  assert.match(renderBrand({}, config), /src="\/brand\/approved.svg" width="560" height="112"/);
  assert.match(renderBrand({ reversed: true }, config), /src="\/brand\/approved-white.svg"/);
  for (const src of ['https://example.com/logo.svg', '/brand/../logo.svg', '/brand/logo.svg?x=1', '/brand/a".svg']) {
    assert.throws(() => validateBrand({ ...config, horizontal: { ...config.horizontal, src } }), /local file/);
  }
  assert.throws(() => validateBrand({ ...config, horizontal: { ...config.horizontal, width: 0 } }), /dimensions/);
});

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'windowservices-release-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'site'));
  const content = '<!doctype html><title>Release fixture</title>';
  await writeFile(join(directory, 'site/index.html'), content);
  const manifest = { schemaVersion: 1, mode: 'preview', origin: 'https://windowservices.ca', files: [
    { path: 'index.html', bytes: Buffer.byteLength(content), sha256: createHash('sha256').update(content).digest('hex') },
  ] };
  await writeFile(join(directory, 'release.json'), JSON.stringify(manifest));
  return directory;
}

test('release verification detects changed, missing and extra public files', async t => {
  const directory = await fixture(t);
  await verifyRelease(directory);
  await writeFile(join(directory, 'site/index.html'), 'changed after packaging');
  await assert.rejects(verifyRelease(directory), /checksums/);
  await rm(join(directory, 'site/index.html'));
  await assert.rejects(verifyRelease(directory), /checksums/);
  await writeFile(join(directory, 'site/extra.html'), 'unexpected file');
  await assert.rejects(verifyRelease(directory), /checksums/);
});

test('release inventory rejects private files, unexpected binaries and symlinks', async t => {
  const directory = await fixture(t);
  const output = join(directory, 'site');
  for (const name of ['.env', 'archive.zip']) {
    await writeFile(join(output, name), 'test fixture');
    await assert.rejects(inventory(output), /Private file|Unsupported release file/);
    await rm(join(output, name));
  }
  await symlink(join(directory, 'release.json'), join(output, 'linked.json'));
  await assert.rejects(inventory(output), /Symbolic links/);
});

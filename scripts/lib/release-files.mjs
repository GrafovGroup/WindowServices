import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const extensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg', '.ico', '.png', '.webp', '.webmanifest']);
const hostFiles = new Set(['_headers', '_redirects', '.htaccess']);

// Package only the freshly built public output. Never follow symbolic links.
export async function inventory(directory, prefix = '') {
  const files = [];
  const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'));
  for (const entry of entries) {
    const path = prefix + entry.name;
    assert(!entry.isSymbolicLink(), `Symbolic links are not allowed in a release: ${path}`);
    assert(!entry.name.startsWith('.') || hostFiles.has(path), `Private file in release output: ${path}`);
    if (entry.isDirectory()) files.push(...await inventory(join(directory, entry.name), path + '/'));
    else {
      assert(entry.isFile(), `Unsupported release entry: ${path}`);
      assert(hostFiles.has(path) || extensions.has(extname(entry.name)), `Unsupported release file: ${path}`);
      const content = await readFile(join(directory, entry.name));
      files.push({ path, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') });
    }
  }
  return files;
}

export async function verifyRelease(directory) {
  const manifest = JSON.parse(await readFile(join(directory, 'release.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, 1, 'Unsupported release manifest');
  assert(['preview', 'production'].includes(manifest.mode), 'Unknown release mode');
  assert.equal(new URL(manifest.origin).origin, manifest.origin, 'Invalid release origin');
  assert.match(manifest.origin, /^https:\/\//);
  assert.deepEqual(await inventory(join(directory, 'site')), manifest.files, 'Release files do not match their checksums');
  return manifest;
}

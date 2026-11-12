import { resolve } from 'node:path';
import { verifyRelease } from './lib/release-files.mjs';
import { auditSite } from './audit.mjs';

if (process.argv.length !== 3) throw new Error('Usage: node scripts/verify-package.mjs /path/to/extracted-package');
const directory = resolve(process.argv[2]);
const manifest = await verifyRelease(directory);
const result = await auditSite({ output: resolve(directory, 'site'), origin: manifest.origin, mode: manifest.mode });
console.log(`PASS: ${manifest.files.length} file checksums; ${result.routes} routes; ${manifest.mode} package from ${manifest.source.commit}${manifest.source.dirty ? ' (working changes)' : ''}.`);

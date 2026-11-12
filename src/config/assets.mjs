import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// One content-derived version keeps the stylesheet and ES module graph together.
export const versionedAssets=['styles.css','site.js','analytics.js','form-validation.js'];
const hash=createHash('sha256');
for(const file of versionedAssets)hash.update(readFileSync(new URL('../../public/'+file,import.meta.url)));
export const assetVersion=hash.digest('hex').slice(0,12);

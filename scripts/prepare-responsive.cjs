// Optional authoring utility: Sharp 0.35.5. Re-encode original photographs only.
// Committed derivatives keep the production build dependency-free.
const sharp=require('sharp');
const fs=require('node:fs/promises');
(async()=>{
 for(const file of (await fs.readdir('assets/originals')).filter(file=>file.endsWith('.jpg')))
  for(const width of [320,960])await sharp(`assets/originals/${file}`).rotate().resize({width}).webp({quality:76}).toFile(`public/images/${file.replace('.jpg','')}-${width}.webp`);
})();

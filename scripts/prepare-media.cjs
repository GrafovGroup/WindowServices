// Optional authoring utility: npm install --no-save --package-lock=false sharp@0.35.5
// Build/preview use committed derivatives and do not need sharp.
const sharp=require('sharp');
const fs=require('node:fs/promises');
const path=require('node:path');
process.chdir(path.resolve(__dirname,'..'));
(async()=>{
 for(const file of (await fs.readdir('assets/originals')).filter(file=>file.endsWith('.jpg'))) {
  for(const width of [640,1280,1920])await sharp(`assets/originals/${file}`).rotate().resize({width}).webp({quality:80}).toFile(`public/images/${file.replace('.jpg','')}-${width}.webp`);
 }
 const svg=await fs.readFile('public/favicon.svg');
 for(const [size,name] of [[16,'favicon-16.png'],[32,'favicon-32.png'],[48,'favicon-48.png'],[96,'favicon-96.png'],[180,'apple-touch-icon.png'],[192,'icon-192.png'],[512,'icon-512.png']])await sharp(svg).resize(size,size).png().toFile(`public/${name}`);
 const sizes=[16,32,48],pngs=await Promise.all(sizes.map(size=>fs.readFile(`public/favicon-${size}.png`)));
 const header=Buffer.alloc(6+sizes.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
 for(let i=0;i<sizes.length;i++){
  const p=6+i*16;header[p]=sizes[i];header[p+1]=sizes[i];header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(pngs[i].length,p+8);header.writeUInt32LE(offset,p+12);offset+=pngs[i].length;
 }
 await fs.writeFile('public/favicon.ico',Buffer.concat([header,...pngs]));
 for(const file of (await fs.readdir('public/brand')).filter(file=>file.endsWith('.svg')))await sharp(`public/brand/${file}`).png().toFile(`public/brand/${file.replace('.svg','.png')}`);
 console.log('Responsive WebP, real multi-size ICO, PNG icons and transparent wordmark exports regenerated.');
})();

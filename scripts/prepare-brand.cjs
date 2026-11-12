// Optional asset preparation: Sharp 0.35.5. No dependency in the normal site build.
const fs=require('node:fs/promises');
const path=require('node:path');
const sharp=require('sharp');
(async()=>{
 const root=path.resolve(__dirname,'..'),brand=path.join(root,'public/brand'),pub=path.join(root,'public');
 for(const name of (await fs.readdir(brand)).filter(n=>/^logo-.*\.svg$/.test(n))){
  const source=path.join(brand,name);
  await sharp(source,{density:192}).png().toFile(source.replace(/\.svg$/,'.png'));
 }
 for(const lang of ['en','fr'])await sharp(path.join(brand,`social-card-${lang}.svg`)).png().toFile(path.join(brand,`social-card-${lang}.png`));
 const icon=path.join(brand,'icon-source.svg');
 const sizes=[[16,'favicon-16.png'],[32,'favicon-32.png'],[48,'favicon-48.png'],[96,'favicon-96.png'],[180,'apple-touch-icon.png'],[192,'icon-192.png'],[512,'icon-512.png']];
 const entries=[];
 for(const [size,name] of sizes){const png=await sharp(icon,{density:384}).resize(size,size).png().toBuffer();await fs.writeFile(path.join(pub,name),png);if(size<=48)entries.push({size,png});}
 const header=Buffer.alloc(6+entries.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(entries.length,4);
 let offset=header.length;
 entries.forEach(({size,png},i)=>{const at=6+i*16;header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(png.length,at+8);header.writeUInt32LE(offset,at+12);offset+=png.length;});
 await fs.writeFile(path.join(pub,'favicon.ico'),Buffer.concat([header,...entries.map(x=>x.png)]));
 console.log('Rendered transparent logo PNGs, bilingual social cards and 16/32/48 ICO plus PNG icons.');
})().catch(error=>{console.error(error);process.exitCode=1;});

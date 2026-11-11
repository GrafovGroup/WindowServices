import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png','.webmanifest':'application/manifest+json'};
const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Robots-Tag':'noindex, follow','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://formspree.io; form-action https://formspree.io; base-uri 'none'; frame-ancestors 'none'; object-src 'none'"};
http.createServer(async(req,res)=>{
  const send=(status,body,type='text/html; charset=utf-8',extra={})=>{res.writeHead(status,{...headers,'Content-Type':type,...extra});res.end(req.method==='HEAD'?undefined:body);};
  if(!['GET','HEAD'].includes(req.method))return send(405,'Method not allowed','text/plain',{Allow:'GET, HEAD'});
  try {
    const url=new URL(req.url,'http://localhost');const path=decodeURIComponent(url.pathname);
    if(path==='/')return send(302,'Redirecting','text/plain',{Location:'/en/'+url.search});
    let file=resolve(root,'.'+path);
    if(!file.startsWith(root.endsWith(sep)?root:root+sep))return send(403,'Forbidden','text/plain');
    let info=await stat(file).catch(()=>null);
    if(info?.isDirectory()) {
      if(!path.endsWith('/'))return send(308,'Redirecting','text/plain',{Location:url.pathname+'/'+url.search});
      file=resolve(file,'index.html');info=await stat(file).catch(()=>null);
    }
    if(info?.isFile())return send(/\/(en|fr)\/404\//.test(path)?404:200,await readFile(file),types[extname(file)]||'application/octet-stream');
    send(404,await readFile(resolve(root,path.startsWith('/fr/')?'fr/404/index.html':'404.html')));
  } catch { send(400,'Bad request','text/plain'); }
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/en/`));

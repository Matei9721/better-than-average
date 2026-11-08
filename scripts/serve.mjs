import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2);
const root=fileURLToPath(new URL(args.includes('--dist')?'../dist/':'../',import.meta.url));
const port=Number(process.env.PORT || 4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const entrypoints=new Set(['index.html','styles.css','app.js','data.js','model.js']);
http.createServer(async (request,response)=>{
  try {
    let pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname).replace(/^\/better-than-average(?=\/|$)/,'');
    if(pathname.endsWith('/'))pathname+='index.html';
    const relative=pathname.replace(/^\/+/, '');
    const target=resolve(root,relative);
    if(!target.startsWith(resolve(root)+sep) || (!entrypoints.has(relative) && !relative.startsWith('assets/'))) {response.writeHead(404).end('Not found');return;}
    const body=await readFile(target);
    response.writeHead(200,{'Content-Type':types[extname(target)] || 'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch(error) {response.writeHead(error instanceof URIError?400:404).end('Not found');}
}).listen(port,'127.0.0.1',()=>process.stdout.write(`Playground: http://127.0.0.1:${port}/better-than-average/\n`));

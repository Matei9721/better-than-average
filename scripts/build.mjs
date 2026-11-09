import {mkdir, cp, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const output=new URL('../dist/',import.meta.url);
await mkdir(output,{recursive:true});
for (const name of ['index.html','styles.css','passport.css','app.js','passport.js','data.js','model.js','assets']) await cp(new URL(name,root),new URL(name,output),{recursive:true});
await writeFile(new URL('.nojekyll',output),'');
process.stdout.write(`Built static site: ${fileURLToPath(output)}\n`);

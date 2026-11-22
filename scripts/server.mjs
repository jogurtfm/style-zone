import http from 'node:http';
import {readFile,writeFile,mkdir,readdir,rename,realpath} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseRecord,parseRating,serializeRecord,serializeRating,safePath,safeUrl,validateRating} from '../dist/model.mjs';
import {parseItemRating,serializeItemRating,validateItemRating} from '../dist/item-model.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=process.env.STYLE_ZONE_DATA_ROOT?{dataRoot:process.env.STYLE_ZONE_DATA_ROOT}:JSON.parse(await readFile(path.join(root,'.local/config.json'),'utf8'));
export const dataRoot=await realpath(config.dataRoot);
const port=Number(process.env.STYLE_ZONE_PORT??8790);
const allowedHosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif'};
async function safeFile(relative,existing=false){safePath(relative);const target=path.resolve(dataRoot,relative);if(!target.startsWith(dataRoot+path.sep))throw Error('Path outside wardrobe.');
  const parent=await realpath(existing?target:path.dirname(target));if(parent!==dataRoot&&!parent.startsWith(dataRoot+path.sep))throw Error('Linked path outside wardrobe.');return target;}
async function files(dir){try{const entries=await readdir(path.join(dataRoot,dir),{withFileTypes:true});const result=[];for(const entry of entries){if(entry.isSymbolicLink())continue;const relative=dir+'/'+entry.name;if(entry.isDirectory())result.push(...await files(relative));else if(entry.isFile()&&entry.name.endsWith('.md'))result.push(relative);}return result;}catch(error){if(error.code==='ENOENT')return [];throw error;}}
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
async function body(req,limit=1024*1024){let size=0;const parts=[];for await(const chunk of req){size+=chunk.length;if(size>limit)throw Error('Request too large.');parts.push(chunk);}return Buffer.concat(parts);}
const queues=new Map();
async function serialized(key,fn){const previous=queues.get(key)??Promise.resolve();const next=previous.catch(()=>{}).then(fn);queues.set(key,next);try{return await next;}finally{if(queues.get(key)===next)queues.delete(key);}}
async function catalog(){const data={outfits:[],pieces:[],ratings:[],item_ratings:[],warnings:[]},ids=new Set();for(const relative of (await Promise.all(['Outfits','Pieces','Ratings','ItemRatings'].map(files))).flat().sort()){try{const text=await readFile(await safeFile(relative,true),'utf8');if(relative.startsWith('Ratings/'))data.ratings.push(parseRating(text));else if(relative.startsWith('ItemRatings/'))data.item_ratings.push(parseItemRating(text));else{const record=parseRecord(text,relative);if(ids.has(record.id))throw Error(`Duplicate ID ${record.id}`);ids.add(record.id);data[record.type==='piece'?'pieces':'outfits'].push(record);}}catch(error){data.warnings.push(`${relative}: ${error.message}`);}}return data;}
async function saveRecord(record,type){
  if(record.type!==type)throw Error('Wrong record type.');
  parseRecord(serializeRecord(record));
  if(record.image)safePath(record.image);if(type==='piece'&&record.product_url&&!safeUrl(record.product_url))throw Error('Invalid product link.');
  const dir=type==='piece'?'Pieces':'Outfits',relative=record.path??`${dir}/${record.id}.md`;
  if(!relative.startsWith(dir+'/')||!relative.endsWith('.md'))throw Error('Unexpected record path.');safePath(relative);
  const file=await safeFile(relative);
  await serialized(file,async()=>{let current='';try{current=await readFile(await safeFile(relative,true),'utf8');if(parseRecord(current).id!==record.id)throw Error('Record identity changed.');if(record.originalText&&record.originalText!==current)throw Error('This note changed since you opened it. Reopen the item editor.');}catch(error){if(error.code!=='ENOENT')throw error;}
    const tmp=file+'.'+randomUUID()+'.tmp';await writeFile(tmp,serializeRecord(record,current),{flag:'wx'});await rename(tmp,file);});
}
const server=http.createServer(async(req,res)=>{
  if(!allowedHosts.has(req.headers.host??'')){json(res,403,{error:'Local host required.'});return;}
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://cdn.shopify.com; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  const url=new URL(req.url,'http://127.0.0.1');
  try{
    if(req.method==='POST'){
      if(![`http://127.0.0.1:${port}`,`http://localhost:${port}`].includes(req.headers.origin??'')){json(res,403,{error:'Open Style Zone locally to make edits.'});return;}
      if(url.pathname==='/api/images'){
        const type=req.headers['content-type'],ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}[type];if(!ext)throw Error('Choose a JPG, PNG, WebP or GIF.');
        const bytes=await body(req,20*1024*1024);const valid=ext==='jpg'?bytes[0]===255&&bytes[1]===216:ext==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==='webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':bytes.toString('ascii',0,3)==='GIF';if(!valid)throw Error('Image format did not match its file type.');
        await mkdir(path.join(dataRoot,'Assets/Uploads'),{recursive:true});const relative=`Assets/Uploads/${randomUUID()}.${ext}`;await writeFile(await safeFile(relative),bytes,{flag:'wx'});json(res,201,{path:relative});return;
      }
      if(!req.headers['content-type']?.startsWith('application/json'))throw Error('JSON request required.');
      const value=JSON.parse((await body(req)).toString('utf8'));
      if(url.pathname==='/api/item-ratings'){validateItemRating(value);const current=await catalog();if(!current.pieces.some(p=>p.id===value.piece_id))throw Error('Item no longer exists.');await mkdir(path.join(dataRoot,'ItemRatings'),{recursive:true});await writeFile(await safeFile(`ItemRatings/${value.id}.md`),serializeItemRating(value),{flag:'wx'});json(res,201,{saved:true});return;}
      if(url.pathname==='/api/ratings'){validateRating(value);const current=await catalog();if(!current.outfits.some(o=>o.id===value.outfit_id))throw Error('Outfit no longer exists.');await writeFile(await safeFile(`Ratings/${value.id}.md`),serializeRating(value),{flag:'wx'});json(res,201,{saved:true});return;}
      if(url.pathname==='/api/pieces'||url.pathname==='/api/outfits'){await saveRecord(value,url.pathname==='/api/pieces'?'piece':'outfit');json(res,200,{saved:true});return;}
      json(res,404,{error:'Unknown action.'});return;
    }
    if(req.method!=='GET'){json(res,405,{error:'Method not allowed.'});return;}
    if(url.pathname==='/api/catalog'){json(res,200,await catalog());return;}
    if(url.pathname==='/api/health'){json(res,200,{app:'style-zone',schema:1});return;}
    if(url.pathname==='/api/assets'){const relative=url.searchParams.get('path')??'';const extension=path.extname(relative).toLowerCase();if(!mime[extension]?.startsWith('image/'))throw Error('Image file required.');const bytes=await readFile(await safeFile(relative,true));res.writeHead(200,{'Content-Type':mime[extension],'Cache-Control':'private, max-age=300'});res.end(bytes);return;}
    const file={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css'}[url.pathname];if(!file){json(res,404,{error:'Not found.'});return;}
    const bytes=await readFile(path.join(root,'dist',file));res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-cache'});res.end(bytes);
  }catch(error){json(res,error.code==='ENOENT'?404:400,{error:error.message});}
});
server.listen(port,'127.0.0.1',()=>console.log(`Style Zone ready at http://127.0.0.1:${port}`));

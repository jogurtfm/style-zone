import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {parseRecord,serializeRecord,newRating} from '../src/model.ts';
import {newItemRating,parseItemRating} from '../src/item-model.ts';
test('Local API protects writes, preserves notes, rejects stale edits and persists independent rating notes',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'style-zone-test-'));let child;
 try{
  for(const dir of ['Outfits','Pieces','Ratings','Assets'])await mkdir(path.join(root,dir));
  const data=JSON.parse(await readFile(new URL('../starter/catalog.json',import.meta.url),'utf8'));const o=data.outfits[0],p=data.pieces[0];
  await writeFile(path.join(root,'Outfits',o.id+'.md'),serializeRecord(o));const piecePath=path.join(root,'Pieces',p.id+'.md');await writeFile(piecePath,serializeRecord(p)+'\nMy sizing note.\n');
  const url='http://127.0.0.1:18879';child=spawn(process.execPath,['scripts/server.mjs'],{env:{...process.env,STYLE_ZONE_DATA_ROOT:root,STYLE_ZONE_PORT:'18879'},stdio:['ignore','pipe','pipe'],windowsHide:true});
  await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Server did not start')),10000);child.stdout.on('data',d=>{if(d.toString().includes('ready at')){clearTimeout(timeout);resolve();}});child.on('error',reject);child.on('exit',code=>{if(code)reject(Error('Server exited '+code));});});
  const post=(route,value,origin=url)=>fetch(url+'/api/'+route,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(value)});
  let response=await fetch(url+'/api/catalog');const catalog=await response.json();assert.equal(catalog.outfits.length,1);assert.equal(catalog.pieces.length,1);const update={...catalog.pieces[0],price:70};
  assert.equal((await post('pieces',update,'https://example.com')).status,403);
  assert.equal((await post('pieces',update)).status,200);assert((await readFile(piecePath,'utf8')).endsWith('My sizing note.\n'));assert.equal(parseRecord(await readFile(piecePath,'utf8')).price,70);
  assert.equal((await post('pieces',{...update,price:80})).status,400);
  const votes=[newRating(o,1),newRating(o,5)];const responses=await Promise.all(votes.map(v=>post('ratings',v)));assert(responses.every(r=>r.status===201));response=await fetch(url+'/api/catalog');assert.equal((await response.json()).ratings.length,2);
  assert.equal((await post('ratings',{...votes[0],id:'invalid-vote',rating:8})).status,400);assert.equal((await post('ratings',votes[0])).status,400);
  const itemVotes=[newItemRating(p,2,p.slot,'First opinion'),newItemRating(p,5,p.slot,'Changed my mind')];assert((await Promise.all(itemVotes.map(v=>post('item-ratings',v)))).every(r=>r.status===201));const itemText=await readFile(path.join(root,'ItemRatings',itemVotes[0].id+'.md'),'utf8');assert.equal(parseItemRating(itemText).note,'First opinion');const after=await(await fetch(url+'/api/catalog')).json();assert.equal(after.item_ratings.length,2);assert.equal(after.ratings.length,2);assert.equal((await post('item-ratings',itemVotes[0])).status,400);assert.equal((await post('item-ratings',{...itemVotes[0],id:'invalid-vote',rating:7})).status,400);assert.equal((await post('item-ratings',{...itemVotes[0],id:'missing-item-event',piece_id:'missing-piece'})).status,400);assert.equal(await readFile(path.join(root,'ItemRatings',itemVotes[0].id+'.md'),'utf8'),itemText);
  assert.equal((await fetch(url+'/api/assets?path=..%2Fsecret.jpg')).status,400);
 }finally{if(child){child.kill();await new Promise(resolve=>child.once('exit',resolve));}assert(path.resolve(root).startsWith(path.join(path.resolve(tmpdir()),'style-zone-test-')));await rm(root,{recursive:true,force:true});}
});

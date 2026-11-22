import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseRecord,serializeRecord,serializeRating,parseRating,newRating,latestRatings,taste,filterOutfits,DEFAULT_FILTERS,cost,safePath,safeUrl} from '../src/model.ts';
const starter=JSON.parse(await readFile(new URL('../starter/catalog.json',import.meta.url),'utf8'));
const outfit=starter.outfits[0];
test('Starter data round trips with unique stable IDs and complete piece references',()=>{
 const ids=new Set();for(const x of [...starter.pieces,...starter.outfits]){assert(!ids.has(x.id));ids.add(x.id);assert.equal(parseRecord(serializeRecord(x)).id,x.id);}
 for(const o of starter.outfits)for(const id of o.piece_ids)assert(starter.pieces.some(p=>p.id===id));
});
test('Saving known fields preserves handwritten notes and unknown frontmatter',()=>{
 const initial=serializeRecord({...starter.pieces[0],custom_tag:'keep'});const previous=initial+'\nHandwritten sizing notes.\n';const piece=parseRecord(previous);piece.price=60;const saved=serializeRecord(piece,previous);assert(saved.includes('custom_tag: keep'));assert(saved.endsWith('Handwritten sizing notes.\n'));assert.equal(parseRecord(saved).price,60);assert(!saved.includes('originalText:'));
});
test('Unknown prices, missing pieces and foreign currencies do not become zero-dollar outfits',()=>{
 const o={...outfit,piece_ids:['one','missing']};const p={...starter.pieces[0],id:'one',price:20,currency:'EUR'};assert.deepEqual(cost(o,[p]).unknown,2);assert.equal(cost(outfit,starter.pieces).complete,true);assert.equal(cost(outfit,starter.pieces).known,346);
 const owned=starter.pieces.map(p=>({...p,ownership:'owned'}));assert.equal(cost(outfit,owned).known,0);assert.equal(cost(outfit,owned).owned,4);
});
test('Budget filtering is strict about unpriced pieces unless explicitly included',()=>{
 const catalog={...starter,outfits:[...starter.outfits,{...outfit,id:'unpriced-look',piece_ids:['missing']}],ratings:[],warnings:[]};const strict=filterOutfits(catalog,{...DEFAULT_FILTERS,maxPrice:'400'});assert.equal(strict.length,1);assert.equal(strict[0].id,outfit.id);const permissive=filterOutfits(catalog,{...DEFAULT_FILTERS,maxPrice:'400',includeUnknown:true});assert(permissive.length>1);assert(filterOutfits(catalog,{...DEFAULT_FILTERS,color:'burgundy'}).every(o=>o.colors.includes('burgundy')));assert.equal(filterOutfits(catalog,{...DEFAULT_FILTERS,ownedOnly:true}).length,0);
});
test('Rating history syncs independently, while only latest rating per outfit trains preferences',()=>{
 const first={...newRating(outfit,5),id:'aaaaaaaaaa',created_at:'2026-11-21T12:00:00Z'},second={...newRating(outfit,1),id:'bbbbbbbbbb',created_at:'2026-11-21T13:00:00Z'};
 assert.equal(latestRatings([second,first]).get(outfit.id).rating,1);const profile=taste([first,second]);assert.equal(profile.rated,1);assert.equal(profile.events,2);assert.equal(profile.liked,0);assert(profile.features.every(f=>f.count===1&&f.score<0&&Math.abs(f.score)<2));assert.equal(parseRating(serializeRating(second)).rating,1);
});
test('Rating ties have deterministic ordering across devices and invalid votes are rejected',()=>{
 const a={...newRating(outfit,3),id:'aaaaaaaaaa',created_at:'2026-11-21T12:00:00Z'},b={...a,id:'bbbbbbbbbb',rating:4};assert.equal(latestRatings([a,b]).get(outfit.id).id,latestRatings([b,a]).get(outfit.id).id);assert.throws(()=>newRating(outfit,0));assert.throws(()=>newRating(outfit,5.5));assert.throws(()=>parseRating('corrupt file'));
});
test('Links and filesystem paths reject unsafe destinations',()=>{
 for(const path of ['../secret','/absolute','C:/private','Assets/../secret','Assets\\private'])assert.throws(()=>safePath(path));assert.equal(safeUrl('javascript:alert(1)'),'');assert.equal(safePath('Assets/Research/photo.jpg'),'Assets/Research/photo.jpg');
});

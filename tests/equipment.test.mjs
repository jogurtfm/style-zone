import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GEAR_SLOTS,slotOptions,isProduct,createVariation,newRating,equipmentFor,cost,reconcileProductEdit,equipmentSignature,currentPreview,filterOutfits,DEFAULT_FILTERS} from '../src/model.ts';
const catalog=JSON.parse(await readFile(new URL('../starter/catalog.json',import.meta.url),'utf8'));
test('Every equipment slot has multiple exact researched product options',()=>{
 assert.equal(GEAR_SLOTS.length,11);for(const slot of GEAR_SLOTS)assert(slotOptions(catalog.pieces,slot.id).length>=2,slot.label);
 for(const p of catalog.pieces){assert(isProduct(p));assert.match(p.product_url,/\/products\/[^/?]+$/);assert(p.image_source_url.startsWith('https://cdn.shopify.com/'));assert(p.available_sizes.length>0);assert.equal(p.product_checked_at,'2026-11-22');}
});
test('Every set visual maps to its exact product, not a generic equivalent',()=>{
 for(const set of catalog.outfits){assert.equal(set.image,'');assert.deepEqual(new Set(set.piece_ids),new Set(Object.values(set.equipment)));for(const [slot,id]of Object.entries(set.equipment)){assert(slotOptions(catalog.pieces,slot).some(p=>p.id===id));}assert(cost(set,catalog.pieces).complete);}
});
test('Unavailable or unverified products cannot appear as slot swap options',()=>{
 const sample=catalog.pieces.find(p=>p.slot==='shoes');assert.equal(slotOptions([{...sample,availability:'unavailable'}],'shoes').length,0);assert.equal(slotOptions([{...sample,product_checked_at:''}],'shoes').length,0);assert.equal(slotOptions([{...sample,product_url:'javascript:alert(1)'}],'shoes').length,0);
});
test('Saving a variation replaces only the chosen slot and preserves the original set',()=>{
 const original=catalog.outfits[0],before=structuredClone(original),eq={...equipmentFor(original,catalog.pieces)},boot=catalog.pieces.find(p=>p.id==='product-brown-captain');eq.shoes=boot.id;const variation=createVariation(original,eq,catalog.pieces,'Boot variation');assert.deepEqual(original,before);assert.notEqual(variation.id,original.id);assert.equal(variation.equipment.shoes,boot.id);assert.equal(variation.equipment.shirt,original.equipment.shirt);assert(!variation.piece_ids.includes('product-white-premier'));assert.equal(variation.path,undefined);assert.equal(cost(variation,catalog.pieces).known,410);assert.throws(()=>createVariation(original,{shoes:'product-blue-oxford'},catalog.pieces,'Invalid slot'));
});
test('Ratings preserve exact equipped item IDs so later research can learn slot preferences',()=>{
 const set=structuredClone(catalog.outfits[0]),vote=newRating(set,4);set.equipment.shoes='different';assert.equal(vote.snapshot.equipment.shoes,'product-white-premier');assert(vote.snapshot.piece_ids.includes('product-white-premier'));
});
test('Changing a product link or photo clears the previous verification',()=>{
 const original=catalog.pieces[0];assert(isProduct(reconcileProductEdit(original,{...original,ownership:'owned'})));assert(!isProduct(reconcileProductEdit(original,{...original,product_url:'https://example.com/another-product'})));assert(!isProduct(reconcileProductEdit(original,{...original,image:'Assets/different.jpg'})));
});
test('Empty legacy equipment maps recover slots without overriding intentional choices',()=>{
 const set=catalog.outfits.find(o=>o.title==='Everyday Blue');assert.deepEqual(equipmentFor({...set,equipment:{}},catalog.pieces),set.equipment);
 assert.deepEqual(equipmentFor({...set,equipment:undefined},catalog.pieces),set.equipment);
 assert.deepEqual(equipmentFor({...set,equipment:{shirt:set.equipment.shirt}},catalog.pieces),{shirt:set.equipment.shirt});
 const piece={...catalog.pieces[0],slot:undefined,compatible_slots:['shirt']};assert.equal(equipmentFor({...set,equipment:{},piece_ids:[piece.id]},[piece]).shirt,piece.id);
});
test('Styling previews are bound to exact current items and are cleared by remixes',()=>{
 const original=structuredClone(catalog.outfits[0]);original.style_preview={kind:'ai-styling-preview',image:'Assets/Renders/look.png',generated_at:'2026-11-22T12:00:00Z',signature:equipmentSignature(original,catalog.pieces)};
 assert(currentPreview(original,catalog.pieces));const changed=structuredClone(catalog.pieces);changed.find(p=>p.id===original.piece_ids[0]).image_source_url='https://cdn.shopify.com/different-color.jpg';assert.equal(currentPreview(original,changed),undefined);
 assert.equal(currentPreview({...original,style_preview:{...original.style_preview,image:'../outside.png'}},catalog.pieces),undefined);
 assert.equal(currentPreview({...original,equipment:{shirt:'unknown-id'}},catalog.pieces),undefined);
 const remix=createVariation(original,{...original.equipment,shoes:'product-brown-captain'},catalog.pieces,'New shoes');assert.equal(remix.style_preview,undefined);assert(original.style_preview);
});
test('Collections filter independently and current renders break neutral recommendation ties',()=>{
 const a=structuredClone(catalog.outfits[0]),b=structuredClone(catalog.outfits[1]);a.collection='Character Casual';a.title='Z Rendered';b.title='A Unrendered';a.style_preview={kind:'ai-styling-preview',image:'Assets/Renders/look.png',generated_at:'2026-11-22T12:00:00Z',signature:equipmentSignature(a,catalog.pieces)};
 const data={outfits:[a,b],pieces:catalog.pieces,ratings:[],warnings:[]};assert.equal(filterOutfits(data,{...DEFAULT_FILTERS})[0].id,a.id);assert.deepEqual(filterOutfits(data,{...DEFAULT_FILTERS,collection:'Character Casual'}).map(o=>o.id),[a.id]);assert.equal(filterOutfits(data,{...DEFAULT_FILTERS,sort:'title'})[0].id,b.id);
});

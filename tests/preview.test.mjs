import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {fitPreview} from '../src/equipment.ts';
import {equipmentSignature} from '../src/model.ts';
test('Rendered looks keep exact item access and recover when the preview image has not synced',async()=>{
 const c=JSON.parse(await readFile(new URL('../starter/catalog.json',import.meta.url),'utf8')),o=c.outfits[0];const dom=new JSDOM('<main></main>');globalThis.document=dom.window.document;
 o.style_preview={kind:'ai-styling-preview',image:'Assets/Renders/set.png',signature:equipmentSignature(o,c.pieces),generated_at:'2026-11-22T12:00:00Z'};let slot;const box=fitPreview(o,c.pieces,{imageUrl:p=>'/'+p},s=>slot=s);document.querySelector('main').append(box);
 assert.equal(box.querySelector('.sz-render-stage').hidden,false);assert.equal(box.querySelector('.sz-flat-lay').hidden,true);assert.match(box.textContent,/AI styling preview/);assert.equal(box.querySelectorAll('.sz-render-product').length,4);box.querySelector('.sz-render-product').click();assert(slot);
 box.querySelector('.sz-render-stage img').dispatchEvent(new dom.window.Event('error'));assert.equal(box.querySelector('.sz-flat-lay').hidden,false);assert.equal(box.querySelector('.sz-render-stage').hidden,true);assert.match(box.textContent,/Preview image is unavailable/);
 [...box.querySelectorAll('button')].find(b=>b.textContent==='Render').click();assert.equal(box.querySelector('.sz-render-stage').hidden,false);dom.window.close();
});

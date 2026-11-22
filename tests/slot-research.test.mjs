import test from 'node:test';
import assert from 'node:assert/strict';
import {scrapeSlotOptions} from '../scripts/scrape-slot-options.mjs';
const piece={id:'test',slot:'shirt',compatible_slots:['shirt'],product_url:'https://www.taylorstitch.com/products/test-shirt'};
test('Slot refresh records stock, exact photo source, and available variant price ranges',async()=>{
 const product={id:123,title:'Exact shirt',available:true,images:['//cdn.shopify.com/exact-shirt.jpg'],variants:[{id:1,title:'S',sku:'sku-s',price:5500,available:true},{id:2,title:'M',sku:'sku-m',price:6500,available:true},{id:3,title:'L',price:3500,available:false}]};
 const result=await scrapeSlotOptions({pieces:[piece]},{date:'2026-11-22',request:async()=>({ok:true,json:async()=>product})});assert.equal(result.errors.length,0);assert.equal(result.products[0].price,55);assert.equal(result.products[0].price_max,65);assert.equal(result.products[0].available_variants.length,2);assert.equal(result.products[0].image_source_url,'https://cdn.shopify.com/exact-shirt.jpg');
});
test('Slot refresh retains an unavailable observation rather than inventing a buyable product',async()=>{
 const result=await scrapeSlotOptions({pieces:[piece]},{request:async()=>({ok:true,json:async()=>({id:123,title:'Sold out',available:false,images:['//cdn.shopify.com/shirt.jpg'],variants:[]})})});assert.equal(result.products[0].availability,'unavailable');assert.equal(result.products[0].price,null);
});
test('Unrecognized shop links are reported without fetching an arbitrary URL',async()=>{
 const result=await scrapeSlotOptions({pieces:[{...piece,product_url:'https://example.com/'}]},{request:async()=>{throw Error('Should never fetch');}});assert.equal(result.products.length,0);assert.equal(result.errors.length,1);assert.match(result.errors[0].error,/adapter/);
});
test('Color-specific options retain their own photograph, stock and prices',async()=>{
 const product={id:123,title:'Colored sock',available:true,options:[{name:'Color'},{name:'Size'}],images:['//cdn.shopify.com/black.jpg'],variants:[{id:1,title:'Black / M',options:['Black','M'],price:500,available:true},{id:2,title:'Yellow / M',options:['Yellow','M'],price:800,available:true,featured_image:{src:'//cdn.shopify.com/yellow.jpg'}}]};
 const request=async()=>({ok:true,json:async()=>product});const record={...piece,product_url:'https://losangelesapparel.net/products/unisex-sock?variant=2',variant_color:'Yellow'};
 const report=await scrapeSlotOptions({pieces:[record]},{request});assert.equal(report.products[0].price,8);assert.equal(report.products[0].available_variants.length,1);assert.equal(report.products[0].image_source_url,'https://cdn.shopify.com/yellow.jpg');assert(report.products[0].product_url.endsWith('?variant=2'));
 const unavailable=await scrapeSlotOptions({pieces:[{...record,variant_color:'Red'}]},{request});assert.equal(unavailable.products[0].availability,'unavailable');assert.equal(unavailable.products[0].price,null);
 const missingPhoto=await scrapeSlotOptions({pieces:[{...record,variant_color:'Black'}]},{request});assert.equal(missingPhoto.products.length,0);assert.match(missingPhoto.errors[0].error,/no variant photo/);
});

// Refresh public product evidence for the slot database. Does not mutate vault notes.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const supported=new Set(['www.taylorstitch.com','thursdayboots.com','goodr.com','bronsonshop.com','mokuyobi.com','losangelesapparel.net','martialartsmart.com','teddyfresh.com','heatersvintage.com','recollect.ltd','basementvintage.com','upthriftshop.com','cndvintage.com']);
export async function scrapeSlotOptions(catalog,{request=fetch,date=new Date().toISOString().slice(0,10)}={}){
  const products=[],errors=[];
  for(const piece of catalog.pieces){
    try{
      const url=new URL(piece.product_url);if(url.protocol!=='https:'||!supported.has(url.hostname)||!/^\/products\/[^/]+$/.test(url.pathname)||url.username||url.password)throw Error('This retailer needs a verified product adapter.');
      url.hash='';const buyUrl=url.href;url.search='';const endpoint=url.href+'.js';const response=await request(endpoint,{signal:AbortSignal.timeout(30000),redirect:'error'});if(!response.ok)throw Error(`Retailer returned HTTP ${response.status}.`);
      const product=await response.json();const colorIndex=product.options?.findIndex(o=>/^colou?r$/i.test(typeof o==='string'?o:o.name))??-1;
      if(piece.variant_color&&colorIndex<0)throw Error('The retailer did not expose a color option; review this variant manually.');
      const variants=product.variants?.filter(v=>v.available===true&&(!piece.variant_color||(v.options?.[colorIndex]??v[`option${colorIndex+1}`])===piece.variant_color))??[];
      const prices=variants.map(v=>v.price/100);if(prices.some(p=>!Number.isFinite(p)||p<0))throw Error('Retailer returned an invalid price.');
      const colorPhoto=variants.find(v=>typeof v.featured_image?.src==='string')?.featured_image.src;
      if(piece.variant_color&&variants.length&&!colorPhoto)throw Error('This available color has no variant photo; review its exact photo manually.');
      const source=colorPhoto??product.images?.[0];if(typeof product.id!=='number'||typeof product.title!=='string'||typeof source!=='string')throw Error('Incomplete product metadata.');
      const photo=source.startsWith('//')?'https:'+source:source;if(!photo.startsWith('https://cdn.shopify.com/'))throw Error('Review the new photo host before using it.');
      products.push({id:piece.id,slot:piece.slot,compatible_slots:piece.compatible_slots,variant_color:piece.variant_color,product_url:buyUrl,source_endpoint:endpoint,product_id:String(product.id),title:product.title,price:prices.length?Math.min(...prices):null,price_max:prices.length?Math.max(...prices):null,currency:'USD',availability:product.available===true&&variants.length?'available':'unavailable',product_checked_at:date,image_source_url:photo,available_variants:variants.map(v=>({id:String(v.id),title:v.title,sku:v.sku??'',price:v.price/100}))});
    }catch(error){errors.push({id:piece.id,url:piece.product_url,error:error.message});}
  }
  return {schema:1,researched_on:date,products,errors};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const option=flag=>{const i=process.argv.indexOf(flag);return i<0?null:process.argv[i+1];};
  const catalog=JSON.parse(await readFile(option('--catalog')??'starter/catalog.json','utf8'));
  const report=await scrapeSlotOptions(catalog);const output=option('--out');if(output){const target=path.resolve(output);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,JSON.stringify(report,null,2)+'\n',{flag:'wx'});}
  console.log(JSON.stringify({checked:report.products.length,available:report.products.filter(p=>p.availability==='available').length,unavailable:report.products.filter(p=>p.availability==='unavailable').length,errors:report.errors,report:output?path.resolve(output):'No file written; provide --out a-new-report.json.'},null,2));if(report.errors.length)process.exitCode=1;
}

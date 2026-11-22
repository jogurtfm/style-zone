import {parse, stringify} from 'yaml';

export const SCHEMA = 1;
export const GEAR_SLOTS = [
  {id:'hat',label:'Hat',short:'Hat'}, {id:'glasses',label:'Glasses',short:'Glasses'},
  {id:'neck',label:'Neck',short:'Neck'}, {id:'base',label:'Layer 0 · under',short:'Layer 0'},
  {id:'shirt',label:'Layer 1 · shirt',short:'Layer 1'}, {id:'outer',label:'Layer 2 · overshirt / jacket',short:'Layer 2'},
  {id:'wrist',label:'Wrist',short:'Wrist'}, {id:'lower',label:'Lower body',short:'Lower body'},
  {id:'accessories',label:'Accessories',short:'Accessory'}, {id:'socks',label:'Socks',short:'Socks'},
  {id:'shoes',label:'Shoes',short:'Shoes'}
] as const;
export type GearSlot = typeof GEAR_SLOTS[number]['id'];
export const COLORS: Record<string, string> = {
  navy:'#25395b', blue:'#7c9fca', cream:'#ede9d9', brown:'#79543b',
  black:'#22252b', gray:'#8b8e98', olive:'#687354', burgundy:'#863e54',
  white:'#ffffff', plum:'#76527f', petrol:'#347779', red:'#ca5149', stone:'#bbb5a8', gold:'#c2a054', copper:'#b97e5a'
};
export interface Outfit {
  schema:number; type:'outfit'; id:string; title:string; season:string;
  styles:string[]; colors:string[]; occasions:string[]; piece_ids:string[];
  image:string; image_credit:string; source_urls:string[]; notes:string; path?:string; originalText?:string;
  equipment?:Partial<Record<GearSlot,string>>;
}
export interface Piece {
  schema:number; type:'piece'; id:string; title:string; category:string;
  colors:string[]; ownership:'owned'|'wishlist'|'reference'; price:number|null;
  currency:string; store:string; product_url:string; price_checked_at:string;
  price_note:string; image:string; notes:string; path?:string; originalText?:string;
  slot?:GearSlot; compatible_slots?:GearSlot[]; product_id?:string; sku?:string;
  image_source_url?:string; image_credit?:string; product_checked_at?:string;
  availability?:'available'|'unavailable'|'unverified'; available_sizes?:string[];
}
export interface Rating {
  schema:number; type:'rating'; id:string; outfit_id:string; rating:number;
  created_at:string; note:string; reasons:string[];
  snapshot:{title:string; styles:string[]; colors:string[]; occasions:string[];piece_ids?:string[];equipment?:Partial<Record<GearSlot,string>>};
}
export interface Catalog {outfits:Outfit[]; pieces:Piece[]; ratings:Rating[]; warnings:string[]}
export interface Store {
  load():Promise<Catalog>;
  rate(event:Rating):Promise<void>;
  savePiece(piece:Piece):Promise<void>;
  saveOutfit(outfit:Outfit):Promise<void>;
  saveImage(file:File):Promise<string>;
  imageUrl(path:string):string;
  export(data:unknown):Promise<void>;
  openNote?(path:string):void;
  subscribe?(callback:()=>void):()=>void;
}
export function safePath(path:string):string {
  if (!path || path.includes('\\') || path.startsWith('/') || path.includes(':') || path.split('/').some(p=>p==='..'||p==='.'||!p)) throw Error('Use a relative path inside the wardrobe folder.');
  return path;
}
export function safeUrl(value:string):string {
  try {const url=new URL(value); return ['https:','http:'].includes(url.protocol)?url.href:'';} catch {return '';}
}
export function pieceSlots(piece:Piece):GearSlot[]{
  const slots=new Set(GEAR_SLOTS.map(s=>s.id));
  return [...new Set([...(piece.compatible_slots??[]),...(piece.slot?[piece.slot]:[])])].filter(s=>slots.has(s));
}
export function isProduct(piece:Piece):boolean {
  return Boolean(piece.availability==='available'&&piece.product_checked_at&&(piece.product_id||piece.sku)&&safeUrl(piece.product_url)&&(piece.image||safeUrl(piece.image_source_url??''))&&piece.price!==null);
}
export function reconcileProductEdit(previous:Piece|undefined,next:Piece):Piece {
  if(previous&&['title','store','product_url','image'].some(key=>previous[key as keyof Piece]!==next[key as keyof Piece]))return {...next,availability:'unverified',product_checked_at:'',image_source_url:''};
  return next;
}
export function equipmentFor(outfit:Outfit,pieces:Piece[]):Partial<Record<GearSlot,string>> {
  const explicit=Object.fromEntries(GEAR_SLOTS.filter(s=>typeof outfit.equipment?.[s.id]==='string'&&outfit.equipment[s.id]).map(s=>[s.id,outfit.equipment![s.id]]));
  // Older notes can contain an empty map. Recover from exact item references,
  // but keep nonempty maps authoritative so intentionally empty slots stay empty.
  if(Object.keys(explicit).length)return explicit;
  const result:Partial<Record<GearSlot,string>>={};for(const id of outfit.piece_ids){const p=pieces.find(x=>x.id===id);const slot=p&&pieceSlots(p).find(s=>!result[s]);if(slot)result[slot]=id;}return result;
}
export function slotOptions(pieces:Piece[],slot:GearSlot):Piece[]{return pieces.filter(p=>isProduct(p)&&pieceSlots(p).includes(slot)).sort((a,b)=>(a.price??Infinity)-(b.price??Infinity)||a.title.localeCompare(b.title));}
export function createVariation(outfit:Outfit,equipment:Partial<Record<GearSlot,string>>,pieces:Piece[],title:string):Outfit {
  const ids=[...new Set(Object.values(equipment).filter((id):id is string=>Boolean(id)))];
  if(!ids.length)throw Error('Equip at least one product.');
  for(const slot of GEAR_SLOTS){const id=equipment[slot.id];if(!id)continue;const piece=pieces.find(p=>p.id===id);if(!piece||!isProduct(piece)||!pieceSlots(piece).includes(slot.id))throw Error(`Choose a verified product for ${slot.label}.`);}
  return {...outfit,id:`outfit-${crypto.randomUUID()}`,path:undefined,originalText:undefined,title:title.trim()||`${outfit.title} / Remix`,piece_ids:ids,equipment:{...equipment},colors:[...new Set(ids.flatMap(id=>pieces.find(p=>p.id===id)?.colors??[]))],image:'',image_credit:'',source_urls:ids.map(id=>pieces.find(p=>p.id===id)!.product_url),notes:`Variation of ${outfit.title}. Exact products are tagged by equipment slot.`};
}
const array=(value:unknown):string[]=>Array.isArray(value)?value.filter((x):x is string=>typeof x==='string'):[];
export function parseRecord(text:string,path=''):Outfit|Piece {
  const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw Error('Missing YAML frontmatter');
  const raw=parse(match[1]);
  if (!raw || raw.schema!==SCHEMA || !['outfit','piece'].includes(raw.type) || typeof raw.id!=='string' || !/^[a-z0-9][a-z0-9-]{0,100}$/.test(raw.id) || typeof raw.title!=='string' || !raw.title.trim()) throw Error('Invalid record identity or schema');
  const base={...raw,colors:array(raw.colors),notes:text.slice(match[0].length).replace(/^# [^\n]*\r?\n/,'').trim(),path,originalText:text};
  if(raw.type==='outfit') return {...base,styles:array(raw.styles),occasions:array(raw.occasions),piece_ids:array(raw.piece_ids),source_urls:array(raw.source_urls),image:typeof raw.image==='string'?raw.image:'',image_credit:typeof raw.image_credit==='string'?raw.image_credit:'',season:typeof raw.season==='string'?raw.season:''} as Outfit;
  if(raw.price!==null && raw.price!==undefined && (typeof raw.price!=='number'||!Number.isFinite(raw.price)||raw.price<0)) throw Error('Invalid price');
  return {...base,price:raw.price??null,ownership:['owned','wishlist','reference'].includes(raw.ownership)?raw.ownership:'reference',currency:raw.currency??'USD',category:raw.category??'other',store:raw.store??'',product_url:raw.product_url??'',price_checked_at:raw.price_checked_at??'',price_note:raw.price_note??'',image:raw.image??''} as Piece;
}
export function serializeRecord(record:Outfit|Piece, previous=''):string {
  const {notes,path,originalText,...properties}=record;
  // Preserve agent-added frontmatter fields and handwritten body text on edit.
  const old=previous.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const existing=old?parse(old[1]):{};
  if(previous&&!old) throw Error('Cannot overwrite a note without valid frontmatter.');
  const body=old?previous.slice(old[0].length):`# ${record.title}\n\n${notes}\n`;
  return `---\n${stringify({...existing,...properties},{lineWidth:0}).trim()}\n---\n${body}`;
}
export function validateRating(raw:unknown):Rating {
  const x=raw as Rating;
  if(!x||x.schema!==1||x.type!=='rating'||typeof x.id!=='string'||!/^[a-zA-Z0-9-]{10,100}$/.test(x.id)||typeof x.outfit_id!=='string'||!Number.isInteger(x.rating)||x.rating<1||x.rating>5||typeof x.created_at!=='string'||!Number.isFinite(Date.parse(x.created_at))||typeof x.note!=='string'||!Array.isArray(x.reasons)||!x.reasons.every(v=>typeof v==='string')||!x.snapshot||typeof x.snapshot.title!=='string'||!Array.isArray(x.snapshot.styles)||!Array.isArray(x.snapshot.colors)||!Array.isArray(x.snapshot.occasions)||![...x.snapshot.styles,...x.snapshot.colors,...x.snapshot.occasions].every(v=>typeof v==='string')) throw Error('Invalid rating event');
  return x;
}
export function serializeRating(event:Rating):string {return `---\n${stringify(validateRating(event),{lineWidth:0}).trim()}\n---\n# Outfit rating\n\n${event.rating} / 5 for ${event.snapshot.title}\n\n${event.note}\n`;}
export function parseRating(text:string):Rating {const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);if(!match)throw Error('Missing rating frontmatter');return validateRating(parse(match[1]));}
export function newRating(outfit:Outfit,rating:number,note='',reasons:string[]=[]):Rating {
  return validateRating({schema:1,type:'rating',id:crypto.randomUUID(),outfit_id:outfit.id,rating,created_at:new Date().toISOString(),note,reasons,snapshot:{title:outfit.title,styles:[...outfit.styles],colors:[...outfit.colors],occasions:[...outfit.occasions],piece_ids:[...outfit.piece_ids],...(outfit.equipment?{equipment:{...outfit.equipment}}:{})}});
}
export function latestRatings(events:Rating[]):Map<string,Rating> {
  const result=new Map<string,Rating>();
  for(const e of events){const prior=result.get(e.outfit_id);if(!prior||`${e.created_at}|${e.id}`>`${prior.created_at}|${prior.id}`)result.set(e.outfit_id,e);}
  return result;
}
export function cost(outfit:Outfit,pieces:Piece[]){
  const byId=new Map(pieces.map(p=>[p.id,p]));
  let known=0,unknown=0,owned=0,stale=0;
  for(const id of new Set(outfit.piece_ids)){
    const p=byId.get(id);
    if(p?.ownership==='owned'){owned++;continue;}
    if(!p||p.price===null||p.currency!=='USD'){unknown++;continue;}
    known+=p.price;
    if(!p.price_checked_at||!Number.isFinite(Date.parse(p.price_checked_at))||Date.now()-Date.parse(p.price_checked_at)>30*86400000)stale++;
  }
  return {known:Math.round(known*100)/100,unknown,owned,stale,complete:unknown===0};
}
export interface Filters {search:string;style:string;color:string;store:string;occasion:string;rating:string;maxPrice:string;includeUnknown:boolean;ownedOnly:boolean;sort:string}
export const DEFAULT_FILTERS:Filters={search:'',style:'',color:'',store:'',occasion:'',rating:'',maxPrice:'',includeUnknown:false,ownedOnly:false,sort:'recommended'};
export function taste(events:Rating[]){
  const latest=[...latestRatings(events).values()];
  const features=new Map<string,{sum:number;count:number;label:string;kind:string}>();
  for(const e of latest) for(const kind of ['styles','colors','occasions'] as const) for(const label of new Set(e.snapshot[kind])){
    const key=`${kind}:${label}`,f=features.get(key)??{sum:0,count:0,label,kind};
    f.sum+=e.rating-3;f.count++;features.set(key,f);
  }
  const list=[...features.values()].map(f=>({...f,score:f.sum/(f.count+3),average:3+f.sum/f.count})).sort((a,b)=>b.score-a.score||b.count-a.count||a.label.localeCompare(b.label));
  return {rated:latest.length,events:events.length,liked:latest.filter(e=>e.rating>=4).length,features:list};
}
export function recommendation(outfit:Outfit,events:Rating[]):{score:number;reasons:string[]} {
  const profile=taste(events),matches=profile.features.filter(f=>f.kind==='styles'?outfit.styles.includes(f.label):f.kind==='colors'?outfit.colors.includes(f.label):outfit.occasions.includes(f.label));
  const score=matches.length?matches.reduce((s,f)=>s+f.score,0)/Math.sqrt(matches.length):0;
  return {score,reasons:matches.filter(f=>f.score>0).sort((a,b)=>b.score-a.score).slice(0,2).map(f=>`${f.label} (${f.count} rated look${f.count===1?'':'s'})`)};
}
export function filterOutfits(catalog:Catalog,filters:Filters):Outfit[]{
  const latest=latestRatings(catalog.ratings),byId=new Map(catalog.pieces.map(p=>[p.id,p]));
  return catalog.outfits.filter(o=>{
    const c=cost(o,catalog.pieces),r=latest.get(o.id)?.rating;
    return (!filters.search||`${o.title} ${o.notes} ${o.styles.join(' ')}`.toLowerCase().includes(filters.search.toLowerCase()))
      &&(!filters.style||o.styles.includes(filters.style))&&(!filters.color||o.colors.includes(filters.color))
      &&(!filters.occasion||o.occasions.includes(filters.occasion))&&(!filters.store||o.piece_ids.some(id=>byId.get(id)?.store===filters.store))
      &&(!filters.rating||(filters.rating==='unrated'?!r:filters.rating==='liked'?(r??0)>=4:r===Number(filters.rating)))
      &&(!filters.ownedOnly||o.piece_ids.length>0&&o.piece_ids.every(id=>byId.get(id)?.ownership==='owned'))
      &&(filters.maxPrice===''||((c.complete||filters.includeUnknown)&&c.known<=Number(filters.maxPrice)));
  }).sort((a,b)=>{
    if(filters.sort==='price') {const ac=cost(a,catalog.pieces),bc=cost(b,catalog.pieces);return Number(!ac.complete)-Number(!bc.complete)||ac.known-bc.known;}
    if(filters.sort==='rating')return (latest.get(b.id)?.rating??0)-(latest.get(a.id)?.rating??0)||a.title.localeCompare(b.title);
    if(filters.sort==='title')return a.title.localeCompare(b.title);
    return recommendation(b,catalog.ratings).score-recommendation(a,catalog.ratings).score||a.title.localeCompare(b.title);
  });
}

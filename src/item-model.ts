import {parse,stringify} from 'yaml';
import {GEAR_SLOTS,isProduct,pieceSlots,type GearSlot,type Piece} from './model';

export interface ItemRating {
  schema:1;type:'item-rating';id:string;piece_id:string;rating:number;created_at:string;note:string;reasons:string[];rated_slot?:GearSlot;
  snapshot:{title:string;colors:string[];slots:GearSlot[];style_tags:string[];pattern:string;silhouette:string;source_type:string;product_url:string;variant_color:string};
}
const strings=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string');
export const itemStyleTags=(p:Piece):string[]=>Array.isArray(p.style_tags)?p.style_tags.filter((v):v is string=>typeof v==='string'):[];
const textField=(v:unknown)=>typeof v==='string'?v:'';
export function validateItemRating(value:unknown):ItemRating {
  const x=value as ItemRating,slots=new Set<string>(GEAR_SLOTS.map(s=>s.id)),s=x?.snapshot;
  if(!x||x.schema!==1||x.type!=='item-rating'||typeof x.id!=='string'||!/^[a-zA-Z0-9-]{10,100}$/.test(x.id)||typeof x.piece_id!=='string'||!/^[a-z0-9][a-z0-9-]{0,100}$/.test(x.piece_id)||!Number.isInteger(x.rating)||x.rating<1||x.rating>5||typeof x.created_at!=='string'||!Number.isFinite(Date.parse(x.created_at))||typeof x.note!=='string'||!strings(x.reasons)||x.rated_slot!==undefined&&!slots.has(x.rated_slot)||!s||typeof s.title!=='string'||!strings(s.colors)||!strings(s.slots)||s.slots.some(v=>!slots.has(v))||!strings(s.style_tags)||![s.pattern,s.silhouette,s.source_type,s.product_url,s.variant_color].every(v=>typeof v==='string'))throw Error('Invalid item rating event');
  return x;
}
export function newItemRating(piece:Piece,rating:number,rated_slot?:GearSlot,note='',reasons:string[]=[]):ItemRating {
  if(rated_slot&&!pieceSlots(piece).includes(rated_slot))throw Error('This item does not belong in that slot.');
  return validateItemRating({schema:1,type:'item-rating',id:crypto.randomUUID(),piece_id:piece.id,rating,created_at:new Date().toISOString(),note,reasons,rated_slot,snapshot:{title:piece.title,colors:[...piece.colors],slots:pieceSlots(piece),style_tags:[...itemStyleTags(piece)],pattern:textField(piece.stylist_features?.pattern),silhouette:textField(piece.stylist_features?.silhouette),source_type:textField(piece.source_type),product_url:piece.product_url,variant_color:piece.variant_color??''}});
}
export function serializeItemRating(event:ItemRating):string {return `---\n${stringify(validateItemRating(event),{lineWidth:0}).trim()}\n---\n# Item rating\n\n${event.rating} / 5 for ${event.snapshot.title}\n\n${event.note}\n`;}
export function parseItemRating(text:string):ItemRating {const m=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);if(!m)throw Error('Missing item rating frontmatter');return validateItemRating(parse(m[1]));}
export function latestItemRatings(events:ItemRating[]):Map<string,ItemRating>{const map=new Map<string,ItemRating>();for(const e of events){const old=map.get(e.piece_id);if(!old||Date.parse(e.created_at)>Date.parse(old.created_at)||Date.parse(e.created_at)===Date.parse(old.created_at)&&e.id>old.id)map.set(e.piece_id,e);}return map;}
export function libraryOptions(pieces:Piece[],slot:GearSlot|'',curatedOnly=true):Piece[]{const selected=(p:Piece)=>pieceSlots(p).filter(s=>Array.isArray(p.library_slots)&&p.library_slots.includes(s));const curated=curatedOnly&&pieces.some(p=>isProduct(p)&&selected(p).length);return pieces.filter(p=>isProduct(p)&&(curated?(slot?selected(p).includes(slot):selected(p).length>0):(slot?pieceSlots(p).includes(slot):true)));}
function features(snapshot:ItemRating['snapshot'],rated_slot?:GearSlot){return [...new Set([...snapshot.colors.map(c=>'color:'+c),...snapshot.style_tags.map(s=>'style:'+s),...(snapshot.pattern?['pattern:'+snapshot.pattern]:[]),...(snapshot.silhouette?['shape:'+snapshot.silhouette]:[]),...(snapshot.source_type?['source:'+snapshot.source_type]:[]),...(rated_slot?['slot:'+rated_slot]:[])])];}
export function itemTaste(events:ItemRating[]){const latest=[...latestItemRatings(events).values()],map=new Map<string,{key:string;label:string;kind:string;sum:number;count:number}>();for(const e of latest)for(const key of features(e.snapshot,e.rated_slot)){const [kind,...name]=key.split(':'),f=map.get(key)??{key,label:name.join(':'),kind,sum:0,count:0};f.sum+=e.rating-3;f.count++;map.set(key,f);}return {rated:latest.length,events:events.length,liked:latest.filter(e=>e.rating>=4).length,features:[...map.values()].map(f=>({...f,average:3+f.sum/f.count,score:f.sum/(f.count+3)})).sort((a,b)=>b.score-a.score||b.count-a.count||a.key.localeCompare(b.key))};}
export function itemRecommendation(piece:Piece,events:ItemRating[],summary=itemTaste(events)){const snapshot={colors:piece.colors,style_tags:itemStyleTags(piece),pattern:textField(piece.stylist_features?.pattern),silhouette:textField(piece.stylist_features?.silhouette),source_type:textField(piece.source_type)} as ItemRating['snapshot'],keys=new Set(features(snapshot));const matches=summary.features.filter(f=>keys.has(f.key));return {score:matches.reduce((n,f)=>n+f.score,0)/Math.sqrt(Math.max(1,matches.length)),evidence:matches.reduce((n,f)=>n+f.count,0)};}

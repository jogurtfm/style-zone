import {GEAR_SLOTS,equipmentFor,isProduct,pieceSlots,slotOptions,createVariation,cost,safeUrl,type Outfit,type Piece,type Catalog,type Store,type GearSlot} from './model';
const node=(tag:string,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const usd=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export function slotIcon(slot:string):SVGSVGElement {
  const paths:Record<string,string>={hat:'M3 16h18M6 16V9a6 6 0 0 1 12 0v7',glasses:'M2 12h3m5 0h4m5 0h3M5 8h5v7H5zM14 8h5v7h-5z',neck:'m6 3 6 8 6-8M6 3l-2 8 7 10 4-3-3-7',base:'m8 4-6 4 3 5 3-2v10h8V11l3 2 3-5-6-4-4 3z',shirt:'m8 4-6 4 3 5 3-2v10h8V11l3 2 3-5-6-4-4 3zM12 8v13',outer:'M8 3 3 7v14h5V10l4 4 4-4v11h5V7l-5-4-4 7z',wrist:'M9 2h6v5H9zM9 17h6v5H9zM7 7h10v10H7z',lower:'M6 3h12l2 18h-6l-2-10-2 10H4zM6 7h12',accessories:'M5 8h14v13H5zM8 8V5a4 4 0 0 1 8 0v3',socks:'M8 3h8v11l-7 7H4v-6l4-4zM8 7h8',shoes:'M3 10h5l3 5 9 2 1 4H3zM3 17h10'};
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',paths[slot]??paths.accessories);p.setAttribute('fill','none');p.setAttribute('stroke','currentColor');p.setAttribute('stroke-width','1.5');p.setAttribute('stroke-linejoin','round');svg.append(p);return svg;
}
export function productPhoto(piece:Piece,store:Store):HTMLElement {
  const frame=node('div','sz-product-photo');
  if(!isProduct(piece)){frame.append(node('span','sz-muted','Exact product needed'));return frame;}
  const img=document.createElement('img');img.alt=piece.title;img.loading='lazy';let fallback=safeUrl(piece.image_source_url??'');
  try{if(piece.image)img.src=store.imageUrl(piece.image);else img.src=fallback;}catch{img.src=fallback;fallback='';}
  img.onerror=()=>{if(fallback&&img.src!==fallback){img.src=fallback;fallback='';}else{img.remove();frame.append(node('span','sz-muted','Photo unavailable'));}};
  frame.append(img);return frame;
}
export function gearBoard(outfit:Outfit,pieces:Piece[],store:Store,onSlot:(slot:GearSlot)=>void,compact=false):HTMLElement {
  const eq=equipmentFor(outfit,pieces),board=node('div',`sz-gear-board ${compact?'sz-gear-compact':''}`);board.setAttribute('aria-label',`Tagged products in ${outfit.title}`);
  for(const slot of GEAR_SLOTS){const id=eq[slot.id],piece=pieces.find(p=>p.id===id);if(compact&&!piece)continue;
    const button=document.createElement('button');button.type='button';button.className=`sz-gear-slot ${piece&&isProduct(piece)?'is-equipped':'is-empty'}`;button.dataset.slot=slot.id;button.setAttribute('aria-label',`${slot.label}: ${piece?.title??'Empty slot'}`);button.onclick=()=>onSlot(slot.id);
    if(piece&&isProduct(piece))button.append(productPhoto(piece,store));else button.append(slotIcon(slot.id));
    const tag=node('span','sz-slot-tag',slot.short);tag.prepend(slotIcon(slot.id));button.append(tag);
    if(piece&&isProduct(piece)){button.append(node('span','sz-slot-price',usd(piece.price!)));button.title=`${slot.label} · ${piece.title} · ${usd(piece.price!)} · ${piece.store}`;}
    else button.append(node('span','sz-empty-label',piece?'Product link needed':'Optional'));
    board.append(button);
  }
  return board;
}
export function productInfo(piece:Piece,store:Store):HTMLElement {
  const box=node('section','sz-product-info');box.append(productPhoto(piece,store),node('p','sz-eyebrow',piece.store),node('h3','',piece.title),node('strong','sz-product-price',piece.price===null?'Unpriced':`${piece.currency} ${piece.price.toFixed(2)}`));
  if(isProduct(piece)){
    const a=document.createElement('a');a.className='sz-button sz-primary';a.href=safeUrl(piece.product_url);a.target='_blank';a.rel='noopener noreferrer';a.textContent='View exact product';box.append(a,node('p','sz-stock',`Available when checked ${piece.product_checked_at}`));
    const sizes=piece.available_sizes??[];if(sizes.length){const details=node('details','sz-available-sizes');details.append(node('summary','',`${sizes.length} available size options`),node('p','sz-muted',sizes.join(', ')));box.append(details);}else box.append(node('p','sz-muted','Choose your size at the retailer.'));
  }else box.append(node('p','sz-muted','This item needs a verified product link and photograph before it can appear in a shoppable set.'));
  box.append(node('p','sz-muted',piece.price_note),node('p','sz-credit',piece.image_credit??''));return box;
}
export function loadoutEditor(parent:HTMLElement,outfit:Outfit,catalog:Catalog,store:Store,onSave:(outfit:Outfit)=>Promise<void>,initialSlot?:GearSlot){
  let eq={...equipmentFor(outfit,catalog.pieces)},selected:GearSlot=initialSlot??'shirt',name=`${outfit.title} / Remix`,dirty=false;
  const draw=()=>{
    parent.replaceChildren();const current={...outfit,equipment:eq,piece_ids:[...new Set(Object.values(eq).filter((x):x is string=>Boolean(x)))]};const summary=cost(current,catalog.pieces);
    const header=node('div','sz-loadout-summary');header.append(node('span','sz-loadout-pill',`${Object.keys(eq).length} / ${GEAR_SLOTS.length} slots equipped`),node('strong','',summary.unknown?`${usd(summary.known)} + unpriced`:usd(summary.known)),node('p','sz-muted','Exact products shown. Optional slots can stay empty. Prices and stock are dated observations, before tax and shipping.'));parent.append(header);
    const columns=node('div','sz-equipment-editor'),visual=node('div','sz-equipment-visual');const board=gearBoard(current,catalog.pieces,store,slot=>{selected=slot;draw();});board.querySelector(`[data-slot="${selected}"]`)?.setAttribute('aria-pressed','true');visual.append(board);
    const selectedSlot=GEAR_SLOTS.find(s=>s.id===selected)!;const panel=node('section','sz-slot-options');panel.append(node('p','sz-eyebrow','EQUIPMENT SLOT'),node('h3','',selectedSlot.label));const equipped=catalog.pieces.find(p=>p.id===eq[selected]);
    if(equipped){panel.append(productInfo(equipped,store));const remove=document.createElement('button');remove.type='button';remove.className='sz-text-button';remove.textContent='Leave this slot empty';remove.onclick=()=>{delete eq[selected];dirty=true;draw();};panel.append(remove);}else panel.append(node('p','sz-muted','No item equipped. Choose a product below or keep this slot empty.'));
    const options=slotOptions(catalog.pieces,selected);panel.append(node('h3','sz-options-heading',`${options.length} researched options`));const list=node('div','sz-options-list');
    for(const p of options){const row=document.createElement('button');row.type='button';row.className=`sz-option-row ${eq[selected]===p.id?'is-equipped':''}`;row.setAttribute('aria-label',`Equip ${p.title} in ${selectedSlot.label}`);row.append(productPhoto(p,store));const text=node('span','sz-option-copy');text.append(node('strong','',p.title),node('span','sz-muted',`${p.store} · ${usd(p.price!)}`),node('span','sz-equip-label',eq[selected]===p.id?'Equipped':'Try this item'));row.append(text);row.onclick=()=>{for(const slot of GEAR_SLOTS)if(eq[slot.id]===p.id)delete eq[slot.id];eq[selected]=p.id;dirty=true;draw();};list.append(row);}panel.append(list);columns.append(visual,panel);parent.append(columns);
    const savebar=node('div','sz-save-variation');const input=document.createElement('input');input.className='sz-input';input.value=name;input.setAttribute('aria-label','Variation name');input.oninput=()=>name=input.value;const save=document.createElement('button');save.type='button';save.className='sz-button sz-primary';save.textContent='Save as new set';save.disabled=!dirty;const status=node('p','sz-muted');status.setAttribute('role','status');save.onclick=()=>{save.disabled=true;void(async()=>{try{await onSave(createVariation(outfit,eq,catalog.pieces,name));dirty=false;status.textContent='Variation saved. Original set preserved.';}catch(error){status.textContent=error instanceof Error?error.message:String(error);save.disabled=false;}})();};savebar.append(input,save,status);parent.append(savebar);
  };draw();
}

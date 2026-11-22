import {COLORS,DEFAULT_FILTERS,cost,filterOutfits,latestRatings,newRating,recommendation,safeUrl,taste,type Catalog,type Filters,type Outfit,type Piece,type Store} from './model';

type Page='outfits'|'rate'|'wardrobe'|'profile';
function el<K extends keyof HTMLElementTagNameMap>(tag:K,cls='',text=''):HTMLElementTagNameMap[K]{const x=document.createElement(tag);x.className=cls;x.textContent=text;return x;}
function button(text:string,action:()=>void,cls='sz-button'){const b=el('button',cls,text);b.type='button';b.addEventListener('click',action);return b;}
function link(text:string,url:string){const a=el('a','sz-link',text);a.href=safeUrl(url);a.target='_blank';a.rel='noopener noreferrer';return a;}
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value);}
const unique=(values:string[])=>[...new Set(values)].sort();
function label(text:string,control:HTMLElement){const l=el('label','sz-field');l.append(el('span','sz-label',text),control);return l;}
function input(name:string,value='',type='text'){const x=el('input','sz-input');x.name=name;x.value=value;x.type=type;return x;}
function select(name:string,options:[string,string][],value=''){const s=el('select','sz-select');s.name=name;for(const [v,t]of options){const o=el('option','',t);o.value=v;s.append(o);}s.value=value;return s;}

export class StyleZoneApp {
  private data:Catalog={outfits:[],pieces:[],ratings:[],warnings:[]};
  private filters:Filters={...DEFAULT_FILTERS};
  private page:Page='outfits';
  private focusId='';
  private detail:HTMLDialogElement|null=null;
  private unsub?:()=>void;
  private disposed=false;
  private pending=new Set<string>();
  private refreshTimer?:ReturnType<typeof setTimeout>;
  private refreshSequence=0;
  private hasLoaded=false;
  private keyHandler=(event:KeyboardEvent)=>{
    if(this.page!=='rate'||this.detail?.open||event.ctrlKey||event.altKey||event.metaKey||(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable=true]')))return;
    const outfit=this.visible().find(o=>o.id===this.focusId);
    if(outfit&&/^[1-5]$/.test(event.key)){event.preventDefault();void this.rate(outfit,Number(event.key),true);}
  };
  constructor(private root:HTMLElement,private store:Store){}
  async start(){this.root.classList.add('style-zone-app');this.root.append(el('p','sz-loading','Opening your wardrobe…'));document.addEventListener('keydown',this.keyHandler);await this.reload();this.unsub=this.store.subscribe?.(()=>{clearTimeout(this.refreshTimer);this.refreshTimer=setTimeout(()=>{if(!this.detail?.open)void this.reload();},250);});}
  dispose(){this.disposed=true;this.unsub?.();clearTimeout(this.refreshTimer);document.removeEventListener('keydown',this.keyHandler);this.detail?.remove();this.root.replaceChildren();}
  private async reload(){const sequence=++this.refreshSequence;try{const data=await this.store.load();if(this.disposed||sequence!==this.refreshSequence)return;const unchanged=this.hasLoaded&&JSON.stringify(data)===JSON.stringify(this.data);this.data=data;this.hasLoaded=true;if(unchanged)return;const active=document.activeElement;if(active instanceof Element&&this.root.contains(active)&&active.matches('input,textarea,select'))return;this.render();}catch(error){this.toast(error instanceof Error?error.message:String(error),true);}}
  private visible(){return filterOutfits(this.data,this.filters);}
  private navigate(page:Page){this.page=page;this.render();}
  private toast(message:string,error=false){const target=el('div',`sz-toast ${error?'sz-error':''}`,message);target.setAttribute('role',error?'alert':'status');this.root.append(target);setTimeout(()=>target.remove(),6500);}
  private render(){
    if(this.disposed||this.detail?.open)return;
    this.root.classList.toggle('sz-is-rate',this.page==='rate');
    const scroll=this.root.querySelector('.sz-content')?.scrollTop??0;
    this.root.replaceChildren();
    const shell=el('div','sz-shell');
    const rail=el('aside','sz-rail');
    const brand=el('div','sz-brand');brand.append(el('span','sz-logo','SZ'),el('div','', 'STYLE ZONE'));rail.append(brand,el('p','sz-rail-caption','A wardrobe that gets you.'));
    const nav=el('nav','sz-nav');nav.setAttribute('aria-label','Style Zone');
    for(const [id,icon,title]of [['outfits','◫','Outfit lab'],['rate','✦','Quick rate'],['wardrobe','▤','Your pieces'],['profile','◉','Your taste']] as const){const b=button(title,()=>this.navigate(id),`sz-nav-button ${this.page===id?'is-active':''}`);b.prepend(el('span','sz-nav-icon',icon));b.setAttribute('aria-current',this.page===id?'page':'false');nav.append(b);}rail.append(nav);
    const progress=taste(this.data.ratings);const railFoot=el('div','sz-rail-foot');railFoot.append(el('span','sz-eyebrow','GETTING TO KNOW YOU'),el('strong','',`${progress.rated} looks rated`),el('p','sz-muted',progress.rated?'Every rating makes the next edit more personal.':'Start with five looks. Go with your first instinct.'));
    const bar=el('div','sz-progress');const fill=el('span');fill.style.width=`${Math.min(100,progress.rated/5*100)}%`;bar.append(fill);railFoot.append(bar,button('Export for stylist',()=>void this.export(),'sz-button sz-subtle'));rail.append(railFoot);
    const content=el('main','sz-content');
    const top=el('div','sz-topbar');top.append(el('span','sz-eyebrow','YOUR PERSONAL STYLE WORKSPACE'),el('span','sz-season','FALL / WINTER 2026'));content.append(top);
    if(this.page==='outfits'||this.page==='rate')this.renderOutfits(content);
    if(this.page==='wardrobe')this.renderPieces(content);
    if(this.page==='profile')this.renderProfile(content);
    if(this.data.warnings.length){const warning=el('details','sz-warning');warning.append(el('summary','',`${this.data.warnings.length} data issue${this.data.warnings.length===1?'':'s'} to review`));for(const text of this.data.warnings)warning.append(el('p','',text));content.append(warning);}
    shell.append(rail,content);this.root.append(shell);content.scrollTop=scroll;
  }
  private heading(parent:HTMLElement,eyebrow:string,title:string,description:string){const h=el('header','sz-heading');h.append(el('p','sz-eyebrow',eyebrow),el('h1','',title),el('p','sz-intro',description));parent.append(h);return h;}
  private renderOutfits(parent:HTMLElement){
    const focused=this.page==='rate';
    const heading=this.heading(parent,focused?'TRUST YOUR FIRST INSTINCT':'BUILD YOUR NEXT ROTATION',focused?'Would you wear this?':'Find your kind of good.',focused?'Rate from 1 to 5. The next look follows automatically.':'Explore a few directions. Save what clicks. Make the look your own.');
    if(!focused)heading.append(button('Create outfit',()=>this.outfitForm(),'sz-button sz-primary'));
    const stats=el('div','sz-stats');const profile=taste(this.data.ratings);
    for(const [n,t]of [[this.data.outfits.length,'outfit ideas'],[profile.liked,'strong contenders'],[this.data.pieces.filter(p=>p.ownership==='owned').length,'pieces you own']]){const item=el('div');item.append(el('strong','',String(n)),el('span','',String(t)));stats.append(item);}if(!focused)parent.append(stats);
    if(focused){const refine=el('details','sz-session-filters');refine.append(el('summary','','Refine this session'));this.renderFilters(refine);parent.append(refine);}else this.renderFilters(parent);
    const outfits=this.visible();
    const count=el('div','sz-results');count.append(el('p','sz-muted',`${outfits.length} look${outfits.length===1?'':'s'} in this edit`));
    const sort=select('sort',[['recommended','For you'],['rating','Highest rated'],['price','Lowest known cost'],['title','By name']],this.filters.sort);sort.setAttribute('aria-label','Sort outfits');sort.onchange=()=>{this.filters.sort=sort.value;this.render();};count.append(sort);parent.append(count);
    if(!outfits.length){const empty=el('div','sz-empty');empty.append(el('h2','',this.data.outfits.length?'No looks match this edit.':'Your outfit collection starts here.'),el('p','sz-muted',this.data.outfits.length?'Try a different palette or relax a filter. Unpriced looks stay out of a budget filter unless you include them.':'Create an outfit from your pieces, or add Markdown suggestions to the wardrobe folder.'),button('Reset filters',()=>{this.filters={...DEFAULT_FILTERS};this.render();}));parent.append(empty);return;}
    if(focused){
      const latest=latestRatings(this.data.ratings);
      let current=outfits.find(o=>o.id===this.focusId)??outfits.find(o=>!latest.has(o.id))??outfits[0];this.focusId=current.id;
      const stage=el('div','sz-rate-stage');stage.append(this.outfitCard(current,true));const controls=el('div','sz-rate-footer');controls.append(el('p','sz-muted',latest.has(current.id)?`Current rating: ${latest.get(current.id)!.rating}/5. You can change it.`:'Not rated yet. Keyboard: 1–5.'),button('Skip this look',()=>{this.focusId=outfits[(outfits.indexOf(current)+1)%outfits.length].id;this.render();},'sz-button sz-subtle'));stage.append(controls);parent.append(stage);
    }else{const grid=el('div','sz-outfit-grid');for(const o of outfits)grid.append(this.outfitCard(o));parent.append(grid);}
  }
  private renderFilters(parent:HTMLElement){
    const panel=el('section','sz-filters');panel.setAttribute('aria-label','Outfit filters');
    const search=input('search',this.filters.search,'search');search.placeholder='Search looks, textures, ideas…';search.setAttribute('aria-label','Search outfits');
    // Keep typing uninterrupted; only the results are rerendered after a brief pause.
    let timer:ReturnType<typeof setTimeout>;search.oninput=()=>{this.filters.search=search.value;clearTimeout(timer);timer=setTimeout(()=>{const position=search.selectionStart;this.render();const replacement=this.root.querySelector<HTMLInputElement>('input[name=search]');replacement?.focus();if(position!==null)replacement?.setSelectionRange(position,position);},350);};panel.append(search);
    const row=el('div','sz-filter-row');
    for(const [key,title,values]of [
      ['style','All directions',unique(this.data.outfits.flatMap(o=>o.styles))],
      ['store','All stores',unique(this.data.pieces.map(p=>p.store).filter(Boolean))],
      ['occasion','Any occasion',unique(this.data.outfits.flatMap(o=>o.occasions))]
    ] as const){const s=select(key,[['',title],...values.map(x=>[x,x] as [string,string])],this.filters[key]);s.setAttribute('aria-label',title);s.onchange=()=>{this.filters[key]=s.value;this.render();};row.append(s);}
    const rating=select('rating',[['','All ratings'],['unrated','Not rated'],['liked','Loved · 4–5'],...Array.from({length:5},(_,i)=>[String(i+1),`${i+1} / 5`] as [string,string])],this.filters.rating);rating.setAttribute('aria-label','Rating filter');rating.onchange=()=>{this.filters.rating=rating.value;this.render();};row.append(rating);
    const budget=input('maxPrice',this.filters.maxPrice,'number');budget.min='0';budget.step='1';budget.placeholder='Max to buy · $';budget.setAttribute('aria-label','Maximum cost to buy in USD');let budgetTimer:ReturnType<typeof setTimeout>;budget.oninput=()=>{this.filters.maxPrice=budget.value;clearTimeout(budgetTimer);budgetTimer=setTimeout(()=>{const focused=document.activeElement===budget;this.render();if(focused)this.root.querySelector<HTMLInputElement>('input[name=maxPrice]')?.focus();},300);};budget.onchange=()=>{clearTimeout(budgetTimer);this.filters.maxPrice=budget.value;this.render();};row.append(budget);panel.append(row);
    const palette=el('div','sz-palettes');palette.append(el('span','sz-label','PALETTE'));
    const all=button('All',()=>{this.filters.color='';this.render();},`sz-color-all ${!this.filters.color?'is-active':''}`);all.setAttribute('aria-pressed',String(!this.filters.color));palette.append(all);
    for(const color of unique(this.data.outfits.flatMap(o=>o.colors))){const sw=button('',()=>{this.filters.color=this.filters.color===color?'':color;this.render();},`sz-swatch ${this.filters.color===color?'is-active':''}`);sw.style.setProperty('--swatch',COLORS[color]??'#888');sw.title=color;sw.setAttribute('aria-label',`Filter palette: ${color}`);sw.setAttribute('aria-pressed',String(this.filters.color===color));palette.append(sw);}panel.append(palette);
    const toggles=el('div','sz-filter-toggles');for(const [key,title]of [['includeUnknown','Include unpriced looks in budget'],['ownedOnly','Only pieces I own']] as const){const box=input(key,'','checkbox');box.checked=this.filters[key];box.onchange=()=>{this.filters[key]=box.checked;this.render();};const l=el('label','sz-checkbox');l.append(box,el('span','',title));toggles.append(l);}toggles.append(button('Clear',()=>{this.filters={...DEFAULT_FILTERS};this.render();},'sz-clear'));panel.append(toggles);parent.append(panel);
  }
  private image(outfit:Outfit){const wrap=el('div','sz-look-image');const image=el('img');image.alt=`Inspiration reference for ${outfit.title}`;image.loading='lazy';try{image.src=this.store.imageUrl(outfit.image);}catch{}image.onerror=()=>{image.hidden=true;wrap.classList.add('sz-image-missing');wrap.append(el('span','',outfit.styles[0]??'Your next look'));};wrap.append(image,el('span','sz-image-label','INSPIRATION REFERENCE'));return wrap;}
  private outfitCard(outfit:Outfit,focus=false){
    const card=el('article',`sz-outfit-card ${focus?'sz-focused':''}`);card.dataset.outfitId=outfit.id;
    const picture=button('',()=>this.openOutfit(outfit),'sz-picture-button');picture.setAttribute('aria-label',`View outfit: ${outfit.title}`);picture.append(this.image(outfit));card.append(picture);
    const body=el('div','sz-card-body');const meta=el('div','sz-card-meta');meta.append(el('span','sz-eyebrow',outfit.styles[0]??'YOUR EDIT'),this.swatches(outfit.colors));body.append(meta,el('h2','',outfit.title),el('p','sz-card-description',outfit.notes.split('\n')[0]||outfit.season));
    const c=cost(outfit,this.data.pieces),price=el('div','sz-cost');price.append(el('strong','',c.unknown?`${money(c.known)} known`:c.known?`${money(c.known)} to buy`:'Already in your wardrobe'),el('span','sz-muted',c.unknown?`${c.unknown} unpriced · ${c.owned} owned`:`${c.owned} owned · before tax / shipping`));body.append(price);
    const latest=latestRatings(this.data.ratings).get(outfit.id);body.append(this.ratingButtons(outfit,latest?.rating,focus));
    const footer=el('div','sz-card-footer');footer.append(button('See the pieces',()=>this.openOutfit(outfit),'sz-text-button'),el('span','sz-muted',latest?`Rated ${latest.rating}/5`:'Not rated'));
    body.append(footer);const match=recommendation(outfit,this.data.ratings);if(match.reasons.length)body.append(el('p','sz-match',`Fits your interest in ${match.reasons.join(' + ')}`));card.append(body);return card;
  }
  private swatches(colors:string[]){const row=el('span','sz-mini-swatches');for(const color of colors){const s=el('span');s.style.background=COLORS[color]??'#888';s.title=color;row.append(s);}row.setAttribute('aria-label',colors.join(', '));return row;}
  private ratingButtons(outfit:Outfit,rating?:number,advance=false){const group=el('div','sz-rating');group.setAttribute('role','group');group.setAttribute('aria-label',`Rate ${outfit.title}`);for(let n=1;n<=5;n++){const b=button(String(n),()=>void this.rate(outfit,n,advance),`sz-rate-button ${rating===n?'is-selected':''}`);b.setAttribute('aria-label',`Rate ${outfit.title} ${n} out of 5`);b.setAttribute('aria-pressed',String(rating===n));b.disabled=this.pending.has(outfit.id);group.append(b);}return group;}
  private async rate(outfit:Outfit,value:number,advance=false,note?:string,reasons?:string[]){
    if(this.pending.has(outfit.id))return false;this.pending.add(outfit.id);
    const before=this.visible(),at=before.findIndex(o=>o.id===outfit.id);
    try{const prior=latestRatings(this.data.ratings).get(outfit.id);const event=newRating(outfit,value,note??prior?.note??'',reasons??prior?.reasons??[]);await this.store.rate(event);if(!this.data.ratings.some(r=>r.id===event.id))this.data.ratings.push(event);if(advance)this.focusId=before[(at+1)%before.length]?.id??'';this.render();this.toast(`Saved ${value}/5 for ${outfit.title}`);return true;}catch(error){this.toast(`Rating not saved: ${error instanceof Error?error.message:String(error)}`,true);return false;}finally{this.pending.delete(outfit.id);this.root.querySelectorAll<HTMLButtonElement>(`article[data-outfit-id="${outfit.id}"] .sz-rate-button`).forEach(b=>b.disabled=false);}
  }
  private dialog(title:string){
    const previousFocus=document.activeElement as HTMLElement|null;
    this.detail?.close();this.detail?.remove();
    const dialog=el('dialog','sz-dialog');const top=el('div','sz-dialog-header');const heading=el('h2','',title);heading.id='sz-dialog-title';dialog.setAttribute('aria-labelledby',heading.id);top.append(heading,button('Close',()=>dialog.close(),'sz-button sz-subtle'));dialog.append(top);this.root.append(dialog);this.detail=dialog;dialog.addEventListener('close',()=>{if(this.detail===dialog)this.detail=null;dialog.remove();previousFocus?.focus();void this.reload();},{once:true});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.showModal();return dialog;
  }
  private openOutfit(outfit:Outfit){
    const dialog=this.dialog(outfit.title),layout=el('div','sz-detail-layout'),visual=el('div');visual.append(this.image(outfit),el('p','sz-credit',outfit.image_credit||'Image credit on linked source.'));const details=el('div');details.append(this.swatches(outfit.colors),el('p','sz-intro',outfit.notes),el('p','sz-muted',`${outfit.season} · ${outfit.occasions.join(', ')}`));
    const c=cost(outfit,this.data.pieces);details.append(el('h3','',c.unknown?`${money(c.known)} known + ${c.unknown} unpriced`:`${money(c.known)} left to buy`),el('p','sz-muted','Suggested equivalents below may differ from the reference photo. Prices exclude tax and shipping; check the retailer for your size and current price.'));
    for(const id of outfit.piece_ids){const p=this.data.pieces.find(p=>p.id===id);if(!p){details.append(el('p','sz-warning',`Missing piece: ${id}`));continue;}details.append(this.pieceRow(p));}
    const rate=el('section','sz-detail-rate');rate.append(el('h3','','How does this feel?'));const rating=latestRatings(this.data.ratings).get(outfit.id);const note=el('textarea','sz-input');note.placeholder='What works or doesn’t? Optional.';note.setAttribute('aria-label','Reason for your outfit rating');note.value=rating?.note??'';const chosen=new Set(rating?.reasons??[]);const reasons=el('div','sz-reason-tags');for(const reason of ['Love the palette','Love the shape','Too formal','Too busy','Wrong fit']){const b=button(reason,()=>{chosen.has(reason)?chosen.delete(reason):chosen.add(reason);b.setAttribute('aria-pressed',String(chosen.has(reason)));},'sz-reason');b.setAttribute('aria-pressed',String(chosen.has(reason)));reasons.append(b);}rate.append(note,reasons);const rg=el('div','sz-rating');for(let n=1;n<=5;n++){const b=button(String(n),()=>{void this.rate(outfit,n,false,note.value,[...chosen]).then(saved=>{if(saved){rg.querySelectorAll('button').forEach((x,i)=>x.setAttribute('aria-pressed',String(i+1===n)));}});},'sz-rate-button');b.setAttribute('aria-label',`Save ${n} out of 5 with feedback`);b.setAttribute('aria-pressed',String(rating?.rating===n));rg.append(b);}rate.append(rg);details.append(rate);
    const sources=el('div','sz-sources');sources.append(el('h3','','Original references'));outfit.source_urls.forEach((url,i)=>{if(safeUrl(url))sources.append(link(`Source ${i+1}`,url));});if(outfit.path&&this.store.openNote)sources.append(button('Open outfit note',()=>{dialog.close();this.store.openNote!(outfit.path!);},'sz-text-button'));details.append(sources);layout.append(visual,details);dialog.append(layout);
  }
  private pieceRow(piece:Piece){const row=el('div','sz-piece-row');const text=el('div');text.append(el('strong','',piece.title),el('p','sz-muted',`${piece.store||'Store not selected'} · ${piece.ownership}${piece.price_checked_at?` · checked ${piece.price_checked_at}`:''}`));if(piece.price_note)text.append(el('p','sz-price-note',piece.price_note));const actions=el('div','sz-piece-actions');actions.append(el('span','',piece.ownership==='owned'?'Owned':piece.price===null?'Price needed':`${piece.currency} ${piece.price.toFixed(2)}`));if(safeUrl(piece.product_url))actions.append(link('Shop / view',piece.product_url));actions.append(button('Edit item',()=>this.pieceForm(piece),'sz-text-button'));row.append(text,actions);return row;}
  private renderPieces(parent:HTMLElement){const h=this.heading(parent,'MAKE THE MOST OF WHAT YOU HAVE','Your pieces. Your possibilities.','Add what you own, collect potential additions, and keep useful prices and links in one place.');h.append(button('Add a piece',()=>this.pieceForm(),'sz-button sz-primary'));const owned=this.data.pieces.filter(p=>p.ownership==='owned').length;parent.append(el('p','sz-muted',`${owned} owned · ${this.data.pieces.length-owned} ideas to explore`));if(!owned)parent.append(el('div','sz-tip','Nothing has been marked as yours yet. Add your clothes or edit an equivalent you already own.'));const grid=el('div','sz-pieces-grid');for(const p of this.data.pieces){const card=el('article','sz-piece-card');if(p.image){const image=el('img');try{image.src=this.store.imageUrl(p.image);}catch{}image.alt=p.title;image.loading='lazy';card.append(image);}card.append(this.swatches(p.colors),el('span','sz-eyebrow',p.category),this.pieceRow(p));grid.append(card);}parent.append(grid);}
  private pieceForm(piece?:Piece){
    const dialog=this.dialog(piece?'Edit your piece':'Add a piece'),form=el('form','sz-form');
    const title=input('title',piece?.title??'');title.required=true;form.append(label('Name',title));
    const category=select('category',['top','knitwear','outerwear','bottom','shoes','accessory','other'].map(x=>[x,x]),piece?.category??'top');
    const ownership=select('ownership',[['owned','I own this'],['wishlist','On my wishlist'],['reference','An idea / equivalent']],piece?.ownership??'owned');form.append(label('Category',category),label('Status',ownership));
    const colors=input('colors',piece?.colors.join(', ')??'');colors.placeholder='navy, cream, brown';form.append(label('Colors separated by commas',colors));
    const price=input('price',piece?.price===null||piece?.price===undefined?'':String(piece.price),'number');price.min='0';price.step='0.01';form.append(label('Price in USD · blank if unknown',price));
    const store=input('store',piece?.store??''),url=input('product_url',piece?.product_url??'','url');form.append(label('Store',store),label('Store or product link',url));
    const checked=input('price_checked_at',piece?.price_checked_at??'','date');form.append(label('Date price was checked',checked));const priceNote=input('price_note',piece?.price_note??'');priceNote.placeholder='Color, sale terms, sizing, or price caveats';form.append(label('Price notes',priceNote));
    const image=input('image',piece?.image??'');image.placeholder='Assets/my-jacket.jpg';form.append(label('Image path in wardrobe folder',image));const upload=input('photo','','file');upload.accept='image/jpeg,image/png,image/webp,image/gif';form.append(label('Or attach a photo',upload));
    const notes=el('textarea','sz-input');notes.placeholder='Fit, fabric, or other details';if(!piece)form.append(label('Notes',notes));else form.append(el('p','sz-muted','Existing handwritten notes are preserved. Edit the Markdown note for longer details.'));
    const error=el('p','sz-form-error');error.setAttribute('role','alert');const save=el('button','sz-button sz-primary','Save piece');save.type='submit';form.append(error,save);
    form.onsubmit=event=>{event.preventDefault();save.disabled=true;void(async()=>{try{const file=upload.files?.[0],imagePath=file?await this.store.saveImage(file):image.value.trim();const id=piece?.id??`piece-${crypto.randomUUID()}`;const record:Piece={...(piece??{}),schema:1,type:'piece',id,title:title.value.trim(),category:category.value,ownership:ownership.value as Piece['ownership'],colors:colors.value.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean),price:price.value===''?null:Number(price.value),currency:'USD',store:store.value.trim(),product_url:url.value.trim(),price_checked_at:checked.value,price_note:priceNote.value.trim(),image:imagePath,notes:piece?.notes??notes.value.trim()};await this.store.savePiece(record);dialog.close();this.toast('Piece saved.');await this.reload();}catch(e){error.textContent=e instanceof Error?e.message:String(e);save.disabled=false;}})();};dialog.append(form);
  }
  private outfitForm(){
    const dialog=this.dialog('Create an outfit'),form=el('form','sz-form');const title=input('title');title.required=true;form.append(label('Outfit name',title));const styles=input('styles');styles.placeholder='retro sport, relaxed';form.append(label('Directions separated by commas',styles));const colors=input('colors');colors.placeholder='navy, cream, brown';form.append(label('Palette separated by commas',colors));const occasions=input('occasions');occasions.placeholder='everyday, evening';form.append(label('Occasions separated by commas',occasions));const image=input('image');image.placeholder='Assets/Research/01-S01.jpg';form.append(label('Image path in wardrobe folder',image));const upload=input('photo','','file');upload.accept='image/jpeg,image/png,image/webp,image/gif';form.append(label('Or attach an outfit photo',upload));const credit=input('image_credit');form.append(label('Image credit',credit));const source=input('source_url','','url');form.append(label('Inspiration source link',source));
    const items=el('fieldset','sz-piece-choices');items.append(el('legend','','Choose pieces'));for(const p of this.data.pieces){const checkbox=input('piece_ids',p.id,'checkbox');const l=el('label','sz-checkbox');l.append(checkbox,el('span','',`${p.title} · ${p.ownership}`));items.append(l);}form.append(items);const notes=el('textarea','sz-input');form.append(label('Styling notes',notes));const error=el('p','sz-form-error');error.setAttribute('role','alert');const save=el('button','sz-button sz-primary','Save outfit');save.type='submit';form.append(error,save);form.onsubmit=e=>{e.preventDefault();save.disabled=true;void(async()=>{try{const pieceIds=[...items.querySelectorAll<HTMLInputElement>('input:checked')].map(x=>x.value);if(!pieceIds.length)throw Error('Choose at least one piece.');const list=(text:string)=>text.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);const file=upload.files?.[0];const o:Outfit={schema:1,type:'outfit',id:`outfit-${crypto.randomUUID()}`,title:title.value.trim(),season:'Fall Winter 2026',styles:list(styles.value),colors:list(colors.value),occasions:list(occasions.value),piece_ids:pieceIds,image:file?await this.store.saveImage(file):image.value.trim(),image_credit:credit.value.trim(),source_urls:source.value?[source.value]:[],notes:notes.value.trim()};await this.store.saveOutfit(o);dialog.close();this.page='outfits';await this.reload();this.toast('Outfit added.');}catch(e){error.textContent=e instanceof Error?e.message:String(e);save.disabled=false;}})();};dialog.append(form);
  }
  private renderProfile(parent:HTMLElement){
    const profile=taste(this.data.ratings);this.heading(parent,'A STYLE THAT EVOLVES WITH YOU','A little more you, every time.','Your ratings reveal patterns in the looks you enjoy. These are starting points for your next suggestions.');
    const overview=el('div','sz-profile-summary');overview.append(el('strong','',`${profile.rated}`),el('div','',`distinct outfits rated · ${profile.events} rating events · ${profile.liked} rated 4 or 5`));parent.append(overview);
    if(!profile.rated){const empty=el('div','sz-empty');empty.append(el('h2','','Let’s find what clicks.'),el('p','sz-muted','Rate a few different outfits. A 1 or 2 is as useful as a 5.'),button('Start quick rating',()=>this.navigate('rate'),'sz-button sz-primary'));parent.append(empty);return;}
    parent.append(el('p','sz-tip',profile.rated<5?'Early impressions: a few ratings can suggest a direction, but don’t define your style.':'Your latest rating for each outfit is used once. Changing a rating updates the signals without counting the same look twice.'));
    const columns=el('div','sz-profile-columns');for(const [title,features]of [['Leaning toward',profile.features.filter(f=>f.score>0).slice(0,8)],['Less your thing',profile.features.filter(f=>f.score<0).reverse().slice(0,8)]] as const){const section=el('section','sz-profile-card');section.append(el('h2','',title));if(!features.length)section.append(el('p','sz-muted','No clear signal yet.'));for(const f of features){const row=el('div','sz-feature');row.append(el('strong','',f.label),el('span','sz-muted',`${f.average.toFixed(1)}/5 · ${f.count} look${f.count===1?'':'s'}`));section.append(row);}columns.append(section);}parent.append(columns);
    parent.append(el('p','sz-muted','Signals compare ratings with the neutral midpoint of 3 and soften patterns supported by few examples. Colors and styles appear together, so these are associations rather than proof of why you liked an outfit.'));
    const history=el('section','sz-profile-card');history.append(el('h2','','Your latest calls'));const latest=[...latestRatings(this.data.ratings).values()].sort((a,b)=>b.created_at.localeCompare(a.created_at));for(const r of latest.slice(0,30)){const row=el('div','sz-history');row.append(el('strong','',`${r.rating}/5`),el('div','',r.snapshot.title),el('span','sz-muted',r.note||r.reasons.join(', ')||new Date(r.created_at).toLocaleDateString()));history.append(row);}parent.append(history,button('Export for stylist',()=>void this.export(),'sz-button sz-primary'));
  }
  private async export(){try{await this.store.export({schema:1,exported_at:new Date().toISOString(),...this.data,preference_summary:taste(this.data.ratings),latest_ratings:[...latestRatings(this.data.ratings).values()]});this.toast('Export saved with outfits, pieces, rating history and taste signals.');}catch(e){this.toast(`Export failed: ${e instanceof Error?e.message:String(e)}`,true);}}
}

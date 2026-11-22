import {Plugin,ItemView,Notice,PluginSettingTab,Setting,TFile,normalizePath,type WorkspaceLeaf,type App} from 'obsidian';
import {StyleZoneApp} from './app';
import {parseRecord,parseRating,serializeRating,serializeRecord,safePath,safeUrl,type Catalog,type Store,type Piece,type Outfit} from './model';
import starter from '../starter/catalog.json';
import {parseItemRating,serializeItemRating,type ItemRating} from './item-model';

const VIEW='style-zone-view';
interface Settings {folder:string;starterCatalogVersion?:number;starterFolder?:string}
export class WardrobeStore implements Store {
  constructor(private plugin:StyleZonePlugin){}
  private full(path:string){return normalizePath(`${this.plugin.settings.folder}/${safePath(path)}`);}
  async ensureDirectory(path:string){const parts=normalizePath(path).split('/');let current='';for(const part of parts){current=current?`${current}/${part}`:part;if(!this.plugin.app.vault.getAbstractFileByPath(current)){try{await this.plugin.app.vault.createFolder(current);}catch(error){if(!this.plugin.app.vault.getAbstractFileByPath(current))throw error;}}}}
  async load():Promise<Catalog>{
    const data:Catalog={outfits:[],pieces:[],ratings:[],item_ratings:[],warnings:[]},base=`${this.plugin.settings.folder}/`;
    const files=this.plugin.app.vault.getFiles().filter(f=>f.path.startsWith(base)&&f.extension==='md').sort((a,b)=>a.path.localeCompare(b.path));const ids=new Set<string>();
    await Promise.all(files.map(async file=>{
      const relative=file.path.slice(base.length);
      try{
        if(relative.startsWith('Ratings/')){data.ratings.push(parseRating(await this.plugin.app.vault.read(file)));return;}
        if(relative.startsWith('ItemRatings/')){data.item_ratings!.push(parseItemRating(await this.plugin.app.vault.read(file)));return;}
        if(!relative.startsWith('Outfits/')&&!relative.startsWith('Pieces/'))return;
        const record=parseRecord(await this.plugin.app.vault.read(file),relative);if(ids.has(record.id))throw Error(`Duplicate ID ${record.id}`);ids.add(record.id);
        if(record.type==='outfit')data.outfits.push(record);else data.pieces.push(record);
      }catch(error){data.warnings.push(`${relative}: ${error instanceof Error?error.message:String(error)}`);}
    }));
    data.outfits.sort((a,b)=>a.title.localeCompare(b.title));data.pieces.sort((a,b)=>a.title.localeCompare(b.title));return data;
  }
  async ensureStarter(){
    const data=await this.load(),ids=new Set([...data.outfits,...data.pieces].map(x=>x.id));
    for(const record of [...starter.pieces,...starter.outfits] as (Piece|Outfit)[]){
      if(ids.has(record.id))continue;
      const path=this.full(`${record.type==='piece'?'Pieces':'Outfits'}/${record.id}.md`);await this.ensureDirectory(path.slice(0,path.lastIndexOf('/')));
      // Add only: a synced or handwritten note at this path always wins.
      if(this.plugin.app.vault.getAbstractFileByPath(path))continue;
      try{await this.plugin.app.vault.create(path,serializeRecord(record));}
      catch(error){if(!this.plugin.app.vault.getAbstractFileByPath(path))throw error;}
      ids.add(record.id);
    }
  }
  async rate(event:Parameters<Store['rate']>[0]){const path=this.full(`Ratings/${event.id}.md`);await this.ensureDirectory(this.full('Ratings'));await this.plugin.app.vault.create(path,serializeRating(event));}
  async rateItem(event:ItemRating){const text=serializeItemRating(event),data=await this.load();if(!data.pieces.some(p=>p.id===event.piece_id))throw Error('Item no longer exists.');await this.ensureDirectory(this.full('ItemRatings'));await this.plugin.app.vault.create(this.full(`ItemRatings/${event.id}.md`),text);}
  private async save(record:Piece|Outfit){
    const directory=record.type==='piece'?'Pieces':'Outfits';
    // A record cannot redirect writes into another folder or an unrelated note.
    const relative=record.path??`${directory}/${record.id}.md`;safePath(relative);
    if(!relative.startsWith(directory+'/')||!relative.endsWith('.md'))throw Error('Unexpected record location.');
    if(record.image)safePath(record.image);if(record.type==='piece'&&record.product_url&&!safeUrl(record.product_url))throw Error('Use an http or https product URL.');
    parseRecord(serializeRecord(record));
    const path=this.full(relative);await this.ensureDirectory(path.slice(0,path.lastIndexOf('/')));const file=this.plugin.app.vault.getAbstractFileByPath(path);
    if(file instanceof TFile) await this.plugin.app.vault.process(file,current=>{if(parseRecord(current).id!==record.id)throw Error('The note identity changed. Reload before editing.');if(record.originalText&&record.originalText!==current)throw Error('This note changed since you opened it. Reopen the item editor.');return serializeRecord(record,current);});
    else if(file)throw Error('A folder occupies this note path.');else await this.plugin.app.vault.create(path,serializeRecord(record));
  }
  savePiece(record:Piece){return this.save(record);}
  saveOutfit(record:Outfit){return this.save(record);}
  async saveImage(file:File){if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)||file.size>20*1024*1024)throw Error('Choose a JPG, PNG, WebP or GIF under 20 MB.');const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}[file.type];const relative=`Assets/Uploads/${crypto.randomUUID()}.${ext}`;await this.ensureDirectory(this.full('Assets/Uploads'));await this.plugin.app.vault.createBinary(this.full(relative),await file.arrayBuffer());return relative;}
  imageUrl(path:string){const file=this.plugin.app.vault.getAbstractFileByPath(this.full(path));if(!(file instanceof TFile))throw Error('Image not found');return this.plugin.app.vault.getResourcePath(file);}
  async export(data:unknown){await this.ensureDirectory(this.full('Exports'));const name=`Exports/style-zone-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;await this.plugin.app.vault.create(this.full(name),JSON.stringify(data,null,2));new Notice(`Saved ${this.plugin.settings.folder}/${name}`);}
  openNote(path:string){void this.plugin.app.workspace.openLinkText(this.full(path),'',true);}
  subscribe(callback:()=>void){const vault=this.plugin.app.vault;const relevant=(file:{path:string})=>{if(file.path.startsWith(this.plugin.settings.folder+'/'))callback();};const refs=[vault.on('modify',relevant),vault.on('create',relevant),vault.on('delete',relevant),vault.on('rename',relevant)];return()=>refs.forEach(ref=>vault.offref(ref));}
}
class StyleZoneView extends ItemView {
  ui?:StyleZoneApp;
  constructor(leaf:WorkspaceLeaf,private plugin:StyleZonePlugin){super(leaf);}
  getViewType(){return VIEW;}
  getDisplayText(){return 'Style Zone';}
  getIcon(){return 'shirt';}
  async onOpen(){this.contentEl.empty();const store=new WardrobeStore(this.plugin);try{await this.plugin.prepareStarter(store);}catch(error){new Notice(`Starter items could not be added: ${error instanceof Error?error.message:String(error)}`);}this.ui=new StyleZoneApp(this.contentEl,store);await this.ui.start();}
  async onClose(){this.ui?.dispose();}
}
class StyleZoneSettings extends PluginSettingTab {
  constructor(app:App,private plugin:StyleZonePlugin){super(app,plugin);}
  display(){this.containerEl.empty();this.containerEl.createEl('h2',{text:'Style Zone'});new Setting(this.containerEl).setName('Wardrobe folder').setDesc('A folder inside this vault. Your outfits, pieces and rating notes live here.').addText(text=>text.setValue(this.plugin.settings.folder).onChange(value=>{try{safePath(value);this.plugin.settings.folder=value;}catch{}}));new Setting(this.containerEl).setName('Save folder').setDesc('Close and reopen Style Zone after changing folders.').addButton(button=>button.setButtonText('Save').onClick(async()=>{try{safePath(this.plugin.settings.folder);await this.plugin.saveData(this.plugin.settings);new Notice('Wardrobe folder saved.');}catch{new Notice('Enter a relative vault folder, such as Sync/Style Zone.');}}));new Setting(this.containerEl).setName('Starter outfit ideas').setDesc('Adds missing Fall 2026 outfit and item notes. Existing records and ratings are preserved. Research photos arrive through your vault sync.').addButton(button=>button.setButtonText('Add starter ideas').onClick(()=>void this.plugin.initialize()));}
}
export default class StyleZonePlugin extends Plugin {
  settings:Settings={folder:'Sync/Style Zone'};
  async onload(){const saved=await this.loadData();if(saved?.folder){try{safePath(saved.folder);this.settings.folder=saved.folder;}catch{new Notice('Style Zone ignored an invalid folder setting.');}}
    if(saved?.starterCatalogVersion===1&&saved.starterFolder===this.settings.folder){this.settings.starterCatalogVersion=1;this.settings.starterFolder=saved.starterFolder;}
    this.registerView(VIEW,leaf=>new StyleZoneView(leaf,this));this.registerObsidianProtocolHandler('style-zone',()=>void this.open());this.addRibbonIcon('shirt','Open Style Zone',()=>void this.open());this.addCommand({id:'open',name:'Open wardrobe',callback:()=>void this.open()});this.addCommand({id:'initialize',name:'Add starter outfit ideas',callback:()=>void this.initialize()});this.addSettingTab(new StyleZoneSettings(this.app,this));
  }
  async open(){let leaf=this.app.workspace.getLeavesOfType(VIEW)[0];if(!leaf){leaf=this.app.workspace.getLeaf('tab');await leaf.setViewState({type:VIEW,active:true});}await this.app.workspace.revealLeaf(leaf);}
  async prepareStarter(store:WardrobeStore){if(this.settings.starterCatalogVersion===1&&this.settings.starterFolder===this.settings.folder)return;await store.ensureStarter();this.settings.starterCatalogVersion=1;this.settings.starterFolder=this.settings.folder;await this.saveData(this.settings);}
  async initialize(){try{const store=new WardrobeStore(this);await store.ensureStarter();await this.prepareStarter(store);new Notice('Starter ideas added. Existing notes and ratings preserved.');await this.open();}catch(error){new Notice(`Could not add starter ideas: ${error instanceof Error?error.message:String(error)}`);}}
}

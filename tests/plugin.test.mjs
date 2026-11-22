import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
test('Mobile plugin loads and registers its view without Node or Electron runtime access',async()=>{
 const source=await readFile(new URL('../main.js',import.meta.url),'utf8');
 class Plugin{registered=[];app={workspace:{}};async loadData(){return null;}registerView(...args){this.registered.push(['view',...args]);}registerObsidianProtocolHandler(...args){this.registered.push(['protocol',...args]);}addRibbonIcon(...args){this.registered.push(['ribbon',...args]);}addCommand(...args){this.registered.push(['command',...args]);}addSettingTab(...args){this.registered.push(['settings',...args]);}}
 class PluginSettingTab{constructor(app,plugin){}}
 const module={exports:{}};const context=vm.createContext({module,exports:module.exports,console,TextEncoder,TextDecoder,URL,crypto:globalThis.crypto,setTimeout,clearTimeout,require(name){assert.equal(name,'obsidian','Plugin attempted a non-mobile runtime import');return {Plugin,ItemView:class{},Notice:class{},PluginSettingTab,Setting:class{},TFile:class{},normalizePath:p=>p};}});
 vm.runInContext(source,context,{timeout:5000});const plugin=new module.exports.default();await plugin.onload();assert(plugin.registered.some(x=>x[0]==='view'&&x[1]==='style-zone-view'));assert.equal(plugin.settings.folder,'Sync/Style Zone');assert(plugin.registered.some(x=>x[0]==='protocol'&&x[1]==='style-zone'));
});
test('Mobile starter recovery adds missing records without changing edited notes, racing creates or rating history',async()=>{
 const source=await readFile(new URL('../main.js',import.meta.url),'utf8'),starter=JSON.parse(await readFile(new URL('../starter/catalog.json',import.meta.url),'utf8'));
 const {serializeRecord}=await import('../src/model.ts');class TFile{constructor(path){this.path=path;this.extension='md';}}
 const files=new Map(),folders=new Set(),base='Sync/Style Zone/';let writes=0;
 const edited=serializeRecord({...starter.pieces[0],ownership:'owned',personal_tag:'keep me',notes:'Handwritten fit notes.'});files.set(base+'Pieces/renamed.md',edited);
 const ratingPath=base+'Ratings/history.md',ratingText='private rating history';files.set(ratingPath,ratingText);
 const collidedPath=base+'Pieces/'+starter.pieces[1].id+'.md';let raced=false;
 const vault={getFiles:()=>[...files.keys()].map(p=>new TFile(p)),getAbstractFileByPath:p=>files.has(p)?new TFile(p):folders.has(p)?{}:null,read:async f=>files.get(f.path),createFolder:async p=>folders.add(p),create:async(p,text)=>{if(p===collidedPath&&!raced){raced=true;files.set(p,serializeRecord({...starter.pieces[1],notes:'Arrived through sync.'}));throw Error('Already exists');}assert(!files.has(p),'Existing note overwritten');files.set(p,text);writes++;}};
 const module={exports:{}},context=vm.createContext({module,exports:module.exports,console,TextEncoder,TextDecoder,URL,crypto:globalThis.crypto,setTimeout,clearTimeout,require(name){assert.equal(name,'obsidian');return {Plugin:class{},ItemView:class{},Notice:class{},PluginSettingTab:class{},Setting:class{},TFile,normalizePath:p=>p};}});vm.runInContext(source,context,{timeout:5000});
 const store=new module.exports.WardrobeStore({settings:{folder:'Sync/Style Zone'},app:{vault}});await store.ensureStarter();assert.equal(files.get(base+'Pieces/renamed.md'),edited);assert.equal(files.get(ratingPath),ratingText);assert(files.get(collidedPath).includes('Arrived through sync.'));assert.equal(files.size,35);assert(!files.has(base+'Pieces/'+starter.pieces[0].id+'.md'));const count=writes;await store.ensureStarter();assert.equal(writes,count);
});

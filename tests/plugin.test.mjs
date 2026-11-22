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

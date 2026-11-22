import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {serializeRecord} from '../dist/model.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const value=flag=>{const i=process.argv.indexOf(flag);return i<0?null:process.argv[i+1];};
const vault=value('--vault'),explicit=value('--data-root');
if(!vault&&!explicit)throw Error('Provide --vault ABSOLUTE_VAULT or --data-root DIRECTORY.');
const dataRoot=path.resolve(explicit??path.join(vault,'Sync/Style Zone'));
for(const dir of ['Outfits','Pieces','Ratings','Inspirations','Existing Pieces','Assets/Research','Assets/Uploads','Exports'])await mkdir(path.join(dataRoot,dir),{recursive:true});
const starter=JSON.parse(await readFile(path.join(root,'starter/catalog.json'),'utf8'));
let added=0;
for(const record of [...starter.pieces,...starter.outfits]){try{await writeFile(path.join(dataRoot,record.type==='piece'?'Pieces':'Outfits',record.id+'.md'),serializeRecord(record),{flag:'wx'});added++;}catch(error){if(error.code!=='EEXIST')throw error;}}
const research=value('--research');let copied=0;
if(research){const folder=path.resolve(research,'Visual References');for(const name of await readdir(folder)){if(!/\.(jpg|jpeg|png|webp|gif)$/i.test(name))continue;try{await copyFile(path.join(folder,name),path.join(dataRoot,'Assets/Research',name),1);copied++;}catch(error){if(error.code!=='EEXIST')throw error;}}}
const instructions=await readFile(path.join(root,'docs/VAULT-GUIDE.md'),'utf8');
try{await writeFile(path.join(dataRoot,'README.md'),instructions,{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
await mkdir(path.join(root,'.local'),{recursive:true});await writeFile(path.join(root,'.local/config.json'),JSON.stringify({schema:1,dataRoot},null,2));
console.log(JSON.stringify({dataRoot,newNotes:added,newImages:copied,existingNotesPreserved:true,pluginInstalled:false},null,2));

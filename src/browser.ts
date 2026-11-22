import {StyleZoneApp} from './app';
import {safePath,type Store,type Piece,type Outfit} from './model';
async function request(path:string,options:RequestInit={}){const response=await fetch(`/api/${path}`,{...options,headers:{'Content-Type':'application/json',...options.headers}});if(!response.ok)throw Error((await response.json()).error??'Could not save.');return response.json();}
const store:Store={
  load:()=>request('catalog'),
  rate:event=>request('ratings',{method:'POST',body:JSON.stringify(event)}),
  rateItem:event=>request('item-ratings',{method:'POST',body:JSON.stringify(event)}),
  savePiece:(piece:Piece)=>request('pieces',{method:'POST',body:JSON.stringify(piece)}),
  saveOutfit:(outfit:Outfit)=>request('outfits',{method:'POST',body:JSON.stringify(outfit)}),
  saveImage:async(file:File)=>{const response=await fetch(`/api/images?name=${encodeURIComponent(file.name)}`,{method:'POST',headers:{'Content-Type':file.type},body:file});const data=await response.json();if(!response.ok)throw Error(data.error);return data.path;},
  imageUrl:path=>`/api/assets?path=${encodeURIComponent(safePath(path))}`,
  export:async(data)=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`style-zone-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
  subscribe:callback=>{const timer=setInterval(callback,15000);return()=>clearInterval(timer);}
};
const root=document.getElementById('app')!;const app=new StyleZoneApp(root,store);void app.start();

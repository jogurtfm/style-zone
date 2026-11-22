// Uses the same Windows Credential Manager route as Color Sprint. Tokens stay in memory.
import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const git='C:/Program Files/Git/cmd/git.exe',repository='jogurtfm/style-zone';
if(!process.execArgv.includes('--use-system-ca')||process.env.NODE_TLS_REJECT_UNAUTHORIZED==='0'||/^(1|true|yes)$/i.test(process.env.GIT_SSL_NO_VERIFY??''))throw Error('Use Node 24+ with --use-system-ca and normal certificate verification.');
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'};
function run(args,input){const r=spawnSync(git,['-c','http.sslBackend=schannel','-c','credential.interactive=never',...args],{cwd:root,env,input,encoding:'utf8',windowsHide:true,timeout:120000});if(r.status!==0)throw Error(`Git ${args[0]} failed; output withheld to protect credentials.`);return r.stdout.trim();}
const raw=run(['credential','fill'],'protocol=https\nhost=github.com\nusername=jogurtfm\n\n'),token=raw.split(/\r?\n/).find(x=>x.startsWith('password='))?.slice(9);if(!token)throw Error('Saved GitHub credential unavailable.');
const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Style-Zone-release'};
async function request(url,options={},missing=false){let response;try{response=await fetch(url,{...options,headers:{...headers,...options.headers},redirect:'error',signal:AbortSignal.timeout(120000)});}catch{throw Error('GitHub HTTPS request failed; credential withheld.');}if(missing&&response.status===404)return null;if(!response.ok)throw Error(`GitHub HTTP ${response.status}; response body withheld.`);return response.json();}
const account=await request('https://api.github.com/user');if(account.login!=='jogurtfm')throw Error('Unexpected authenticated account.');
const api=`https://api.github.com/repos/${repository}`;
let repo=await request(api,{},true);
if(!process.argv.includes('--publish')){console.log(JSON.stringify({account:account.login,target:repository,repositoryExists:Boolean(repo),pushAllowed:repo?.permissions?.push??null,published:false},null,2));process.exit(0);}
const manifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'));
if(manifest.id!=='style-zone'||manifest.version!=='0.4.0'||manifest.isDesktopOnly!==false)throw Error('Unexpected plugin manifest.');
const head=run(['rev-parse','HEAD']);if(run(['status','--porcelain','--untracked-files=no']))throw Error('Commit reviewed source before publication.');
const tracked=run(['ls-files']).split('\n');if(tracked.some(file=>/^(agentresearch|Existing Pieces|Inspirations|Outfit Combos|\.local|private)(\/|$)/.test(file)))throw Error('Private research or wardrobe paths are tracked.');
if(!repo)repo=await request('https://api.github.com/user/repos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'style-zone',description:'Markdown-first wardrobe and outfit ratings for Obsidian desktop and mobile.',private:false,auto_init:false})});
if(repo.full_name!==repository||!repo.permissions?.push)throw Error('Repository permission mismatch.');
const remotes=run(['remote']);if(!remotes.split('\n').includes('origin'))run(['remote','add','origin',`https://github.com/${repository}.git`]);
if(run(['remote','get-url','--push','origin'])!==`https://github.com/${repository}.git`)throw Error('Unexpected Git push destination.');
run(['push','-u','origin','HEAD:main']);if(run(['ls-remote','origin','refs/heads/main']).split(/\s/)[0]!==head)throw Error('Remote commit mismatch.');
let release=await request(`${api}/releases/tags/${manifest.version}`,{},true);
if(!release)release=await request(api+'/releases',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tag_name:manifest.version,target_commitish:head,name:`Style Zone ${manifest.version}`,body:'Support rendered styling previews alongside exact product flat lays and equipment slots. Each preview is visibly labeled as an AI illustration and bound to the current item identities, color variants and source photos. Swaps hide stale previews and saved remixes clear them. Keep actual product thumbnails, prices and buy links available beside the illustration. Add collection filtering and prefer valid renders when recommendation scores tie. Add reviewed retailer evidence adapters for Bronson, Mokuyobi, Los Angeles Apparel, MartialArtSmart and Teddy Fresh, including color-specific stock and photo validation. Personal styling briefs, research, product photos and renders remain in the configured wardrobe vault and are excluded from this public release. The plugin does not call an image-generation API. Update through BRAT: jogurtfm/style-zone.',draft:true,prerelease:false})});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');const verified=[];
for(const name of ['main.js','manifest.json','styles.css']){
 const bytes=await readFile(path.join(root,name));let asset=release.assets.find(a=>a.name===name);
 if(!asset)asset=await request(`https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:bytes});
 if(asset.size!==bytes.length||asset.digest&&asset.digest!==`sha256:${hash(bytes)}`)throw Error('Release asset differs; no replacement attempted.');verified.push({name,sha256:hash(bytes)});
}
if(release.draft)release=await request(`${api}/releases/${release.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({draft:false,make_latest:'true'})});
const latest=await request(api+'/releases/latest');if(latest.tag_name!==manifest.version||latest.assets.filter(a=>['main.js','manifest.json','styles.css'].includes(a.name)).length!==3)throw Error('BRAT release assets incomplete.');
for(const local of verified){const asset=latest.assets.find(a=>a.name===local.name);const response=await fetch(asset.browser_download_url,{signal:AbortSignal.timeout(120000)});if(!response.ok||hash(Buffer.from(await response.arrayBuffer()))!==local.sha256)throw Error('Public release file hash mismatch.');}
console.log(JSON.stringify({repository:repo.html_url,release:release.html_url,commit:head,version:manifest.version,bratRepository:repository,verifiedAssets:verified,phoneInstallation:'unverified'},null,2));

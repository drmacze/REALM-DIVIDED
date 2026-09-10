const ACCESS_HASH='efdaa9f198bc21b63031e555e866391faa846624717fbc32eda2ea1b67520a03';
const SESSION_KEY='realm_divided_console_session';
const NOTES_KEY='realm_divided_dev_notes';
const gate=document.getElementById('gate');
const consoleView=document.getElementById('console');
const gateForm=document.getElementById('gateForm');
const accessCode=document.getElementById('accessCode');
const gateMessage=document.getElementById('gateMessage');

async function sha256(value){const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function showConsole(){gate.hidden=true;consoleView.hidden=false;loadDashboard()}
function lockConsole(){sessionStorage.removeItem(SESSION_KEY);consoleView.hidden=true;gate.hidden=false;accessCode.value='';accessCode.focus()}
if(sessionStorage.getItem(SESSION_KEY)==='open')showConsole();
gateForm?.addEventListener('submit',async e=>{e.preventDefault();gateMessage.textContent='Checking…';const ok=(await sha256(accessCode.value))===ACCESS_HASH;if(ok){sessionStorage.setItem(SESSION_KEY,'open');gateMessage.textContent='';showConsole()}else{gateMessage.textContent='Access denied';accessCode.select()}});
document.getElementById('lockButton')?.addEventListener('click',lockConsole);

async function loadDashboard(){
  const repoState=document.getElementById('repoState');
  const deployState=document.getElementById('deployState');
  const deployTime=document.getElementById('deployTime');
  const commitShort=document.getElementById('commitShort');
  const commitMessage=document.getElementById('commitMessage');
  const preorderState=document.getElementById('preorderState');
  try{
    const [buildRes,configRes]=await Promise.all([
      fetch('../build-info.json?ts='+Date.now()),
      fetch('../site-config.json?ts='+Date.now())
    ]);
    const build=buildRes.ok?await buildRes.json():null;
    const config=configRes.ok?await configRes.json():null;
    if(repoState)repoState.textContent='Public';
    if(deployState)deployState.textContent=build?.status||'Unknown';
    if(deployTime)deployTime.textContent=build?.deployedAt?new Date(build.deployedAt).toLocaleString():'GitHub Pages';
    if(commitShort)commitShort.textContent=build?.commit||'Unknown';
    if(commitMessage)commitMessage.textContent=build?.build?'Build '+build.build:'main';
    if(preorderState)preorderState.textContent=config?.preorderState||'Unknown';
  }catch(err){
    if(repoState)repoState.textContent='Public';
    [deployState,commitShort,preorderState].forEach(el=>{if(el)el.textContent='Unavailable'});
  }
}

document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);const old=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1200)}catch{}}));
const notes=document.getElementById('notes');if(notes)notes.value=localStorage.getItem(NOTES_KEY)||'';
document.getElementById('saveNotes')?.addEventListener('click',()=>{localStorage.setItem(NOTES_KEY,notes?.value||'');const status=document.getElementById('noteStatus');if(status){status.textContent='Saved locally';setTimeout(()=>status.textContent='',1500)}});

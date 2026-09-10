const ACCESS_HASH='4d35f2359baa99e0c6acbdbc6e035950b6935d1c9a8793920775855036148957';
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
  try{
    const [repoRes,runRes,commitRes,configRes]=await Promise.all([
      fetch('https://api.github.com/repos/drmacze/REALM-DIVIDED'),
      fetch('https://api.github.com/repos/drmacze/REALM-DIVIDED/actions/runs?per_page=1'),
      fetch('https://api.github.com/repos/drmacze/REALM-DIVIDED/commits/main'),
      fetch('../site-config.json?ts='+Date.now())
    ]);
    const repo=repoRes.ok?await repoRes.json():null;
    const runs=runRes.ok?await runRes.json():null;
    const commit=commitRes.ok?await commitRes.json():null;
    const config=configRes.ok?await configRes.json():null;
    const repoState=document.getElementById('repoState');
    const deployState=document.getElementById('deployState');
    const deployTime=document.getElementById('deployTime');
    const commitShort=document.getElementById('commitShort');
    const commitMessage=document.getElementById('commitMessage');
    const preorderState=document.getElementById('preorderState');
    if(repoState)repoState.textContent=repo?.private?'Private':'Public';
    const run=runs?.workflow_runs?.[0];
    if(deployState)deployState.textContent=run?(run.status==='completed'?(run.conclusion||'completed'):run.status):'Unknown';
    if(deployTime)deployTime.textContent=run?.updated_at?new Date(run.updated_at).toLocaleString():'GitHub Pages';
    if(commitShort)commitShort.textContent=commit?.sha?commit.sha.slice(0,7):'Unknown';
    if(commitMessage)commitMessage.textContent=commit?.commit?.message||'main';
    if(preorderState)preorderState.textContent=config?.preorderState||'Unknown';
  }catch(err){
    ['repoState','deployState','commitShort','preorderState'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='Unavailable'})
  }
}

document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);const old=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1200)}catch{}}));
const notes=document.getElementById('notes');if(notes)notes.value=localStorage.getItem(NOTES_KEY)||'';
document.getElementById('saveNotes')?.addEventListener('click',()=>{localStorage.setItem(NOTES_KEY,notes?.value||'');const status=document.getElementById('noteStatus');if(status){status.textContent='Saved locally';setTimeout(()=>status.textContent='',1500)}});

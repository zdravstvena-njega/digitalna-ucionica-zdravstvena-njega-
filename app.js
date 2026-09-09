const content=document.getElementById('content');
const home=document.getElementById('home');
const sidebar=document.querySelector('.sidebar');
let currentView='home';

(function initMobileNav(){
  const actions=document.querySelector('.top-actions');
  if(actions && !document.querySelector('.mobile-nav-toggle')){
    const b=document.createElement('button');
    b.className='btn mobile-nav-toggle';
    b.type='button';
    b.innerHTML='☰ <span>Sadržaj</span>';
    b.addEventListener('click',openNav);
    actions.appendChild(b);
  }
  if(sidebar && !sidebar.querySelector('.mobile-nav-close')){
    const c=document.createElement('button');
    c.className='mobile-nav-close';
    c.type='button';
    c.innerHTML='<span>Zdravstvena njega 3 · Sadržaj</span><span>✕</span>';
    c.addEventListener('click',closeNav);
    sidebar.prepend(c);
  }
  if(!document.querySelector('.nav-backdrop')){
    const d=document.createElement('div');
    d.className='nav-backdrop';
    d.addEventListener('click',closeNav);
    document.body.appendChild(d);
  }
})();

function openNav(){sidebar?.classList.add('open');document.querySelector('.nav-backdrop')?.classList.add('show');document.body.style.overflow='hidden'}
function closeNav(){sidebar?.classList.remove('open');document.querySelector('.nav-backdrop')?.classList.remove('show');document.body.style.overflow=''}
function setActiveLesson(n){document.querySelectorAll('.lesson-btn[data-lesson]').forEach(x=>x.classList.toggle('active',+x.dataset.lesson===n))}
function showHome(){currentView='home';content.innerHTML='';home.style.display='block';setActiveLesson(0);closeNav();window.scrollTo(0,0)}
function showHeartHome(){showHome()}

async function loadHtml(path,label='sadržaj'){
  try{
    const r=await fetch(`${path}?v=${Date.now()}`,{cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  }catch(e){
    console.error('Greška pri učitavanju:',path,e);
    return `<div class="section"><div class="callout danger"><strong>Nije moguće učitati ${label}</strong>Provjeri internetsku vezu i osvježi stranicu. Ako se problem ponavlja, pokušaj ponovno otvoriti početnu stranicu.</div></div>`;
  }
}

function injectLessonVisual(n){
  const visuals={
    1:['assets/heart-flow.svg','Srce i krvotok','Originalna shema malog i velikog krvnog optoka.'],
    3:['assets/ekg-placement.svg','EKG – elektrode i odvodi','Položaj 10 elektroda za snimanje 12-kanalnog EKG-a.'],
    5:['assets/acs-progression.svg','Od ateroskleroze do AIM-a','Razvoj plaka, rupture, tromba i akutnog infarkta miokarda.'],
    6:['assets/hf-pulmonary-edema.svg','Srčano popuštanje i plućni edem','Veza smanjene pumpne funkcije, plućne kongestije i edema.'],
    7:['assets/bp-measurement.svg','Pravilno mjerenje krvnog tlaka','Položaj bolesnika, ruke i manžete za pouzdanije mjerenje.']
  };
  const v=visuals[n];
  if(!v)return;
  const lesson=content.querySelector('.lesson');
  const header=content.querySelector('.lesson-header');
  if(!lesson||!header||content.querySelector('.lesson-visual'))return;
  const fig=document.createElement('figure');
  fig.className='lesson-visual';
  fig.style.margin='0 0 18px';
  fig.style.padding='12px';
  fig.style.background='#fff';
  fig.style.border='1px solid #d9e2ec';
  fig.style.borderRadius='16px';
  fig.innerHTML=`<img src="${v[0]}?v=3" alt="${v[1]}" loading="eager" style="display:block;width:100%;height:auto;border-radius:10px"><figcaption style="margin-top:8px;color:#64748b;font-size:.9rem;text-align:center">${v[2]} · Zdravstvena njega 3</figcaption>`;
  header.insertAdjacentElement('afterend',fig);
}

async function openLesson(n){
  n=Math.max(1,Math.min(10,n));
  currentView='lesson-'+n;
  home.style.display='none';
  content.innerHTML='<div class="section">Učitavanje lekcije…</div>';
  closeNav();
  content.innerHTML=await loadHtml(`data/lesson-${String(n).padStart(2,'0')}.html`,`lekciju ${n}`);
  const loadedLesson=content.querySelector('.lesson');
  if(loadedLesson) loadedLesson.classList.add('active');
  injectLessonVisual(n);
  setActiveLesson(n);
  wireLesson(n);
  if(n===10)buildExam();
  window.scrollTo(0,0);
}
async function showAux(kind){
  currentView=kind;home.style.display='none';content.innerHTML='<div class="section">Učitavanje…</div>';closeNav();
  content.innerHTML=await loadHtml(`data/${kind}.html`,kind);setActiveLesson(0);window.scrollTo(0,0)
}
function wireLesson(n){
 const c=content.querySelector('.done-check');
 if(c){c.checked=localStorage.getItem('zn-heart-done-'+n)==='1';c.addEventListener('change',()=>{localStorage.setItem('zn-heart-done-'+n,c.checked?'1':'0');progress()})}
 content.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>n<10?openLesson(n+1):showHome()));
 content.querySelectorAll('.prev').forEach(b=>b.addEventListener('click',()=>n>1?openLesson(n-1):showHome()));
}
document.querySelectorAll('.lesson-btn[data-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(+b.dataset.lesson)));

function progress(){let c=0;for(let i=1;i<=10;i++)if(localStorage.getItem('zn-heart-done-'+i)==='1')c++;document.getElementById('progressBar').style.width=(c*10)+'%';document.getElementById('progressText').textContent=c+' / 10'}
progress();

const simText={
 plaqueStage:["Stabilan aterosklerotski plak sužava lumen, ali je površina očuvana.","Površina plaka puca ili erodira i izlaže trombogeni sadržaj.","Trombociti i koagulacija stvaraju tromb koji dodatno sužava ili zatvara arteriju.","Nedostatak protoka uzrokuje ishemiju; ako potraje nastaje nekroza miokarda."],
 bpStage:["1. Bolesnik miruje nekoliko minuta prije mjerenja.","2. Leđa i stopala su poduprti, noge nisu prekrižene, ruka je u visini srca.","3. Odabrana je validirana manžeta odgovarajuće veličine na goloj nadlaktici.","4. Izvode se ponovljena mjerenja prema protokolu i procjenjuje trend/prosjek."],
 ecgStage:["SA čvor pokreće impuls → depolarizacija pretklijetki (P val).","Impuls usporava kroz AV čvor → PR interval predstavlja AV provođenje.","Brza depolarizacija klijetki stvara QRS kompleks.","Repolarizacija klijetki prikazuje se prvenstveno T valom."],
 acsStage:["Stabilan plak sužava koronarnu arteriju.","Ruptura/erozija izlaže trombogeni sadržaj.","Nastaje tromb koji može djelomično ili potpuno zatvoriti lumen.","Smanjen protok dovodi do ishemije, a produljena ishemija do nekroze."],
 edemaStage:["Lijeva klijetka ne prazni krv dovoljno učinkovito.","Raste tlak u lijevom atriju i plućnim venama/kapilarama.","Tekućina prelazi u plućni intersticij → dispneja i smanjena podajnost pluća.","Tekućina može ući u alveole → teška hipoksemija, hropci i akutni plućni edem."],
 measureStage:["Bolesnik miruje prije mjerenja.","Pravilno sjedi, ruka je poduprta u visini srca.","Manžeta je odgovarajuće veličine i pravilno postavljena.","Mjerenje se ponavlja i procjenjuje prosjek/trend."],
 perfusionStage:["Srce izbacuje manje krvi nego što je potrebno tkivima.","Aktiviraju se simpatički i neurohormonalni mehanizmi: tahikardija, vazokonstrikcija i zadržavanje tekućine pokušavaju održati perfuziju.","Ako kompenzacija nije dovoljna, mozak, bubrezi i periferna tkiva dobivaju premalo krvi: konfuzija, oligurija, hladna periferija i slab puls.","Teška i trajna hipoperfuzija može prijeći u kardiogeni šok s hipotenzijom, poremećajem svijesti i progresivnim zatajenjem organa."],
 dvtStage:["Tromb se formira u dubokoj veni, najčešće donjeg ekstremiteta.","Dio tromba može se odvojiti od stijenke vene.","Embolus putuje venskim sustavom kroz desno srce prema plućnim arterijama.","Začepljenje plućne arterije uzrokuje plućnu emboliju: naglu dispneju, bol, tahikardiju, hipoksemiju, a kod masivne PE i šok/sinkopu."]
};
function simStep(id,idx,btn){const el=document.getElementById(id);if(!el)return;el.textContent=(simText[id]||[])[idx]||'';btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}
function animateBlood(){const flow=document.getElementById('bloodFlow');if(!flow){openLesson(1).then(()=>setTimeout(animateBlood,150));return}const spans=[...flow.querySelectorAll('span')];let i=0;spans.forEach(x=>x.classList.remove('pulse'));const tick=()=>{spans.forEach(x=>x.classList.remove('pulse'));if(i>=spans.length)return;spans[i].classList.add('pulse');i++;setTimeout(tick,550)};tick()}

function buildExam(){
 const qWrap=document.getElementById('oralQuestions');
 if(qWrap&&!qWrap.dataset.built){let current='';window.ORAL_QUESTIONS.forEach((q,i)=>{if(q[0]!==current){current=q[0];qWrap.insertAdjacentHTML('beforeend',`<h4>${current}</h4>`)}qWrap.insertAdjacentHTML('beforeend',`<div class="question-card"><strong>${i+1}. ${q[1]}</strong><br><button class="btn" onclick="toggleAnswer('a${i}')">Prikaži model odgovora</button><div class="answer" id="a${i}">${q[2]}</div></div>`)});qWrap.dataset.built='1'}
 const sWrap=document.getElementById('scenarios');
 if(sWrap&&!sWrap.dataset.built){window.SCENARIOS.forEach((s,i)=>sWrap.insertAdjacentHTML('beforeend',`<div class="scenario"><strong>Scenarij ${i+1}: ${s[0]}</strong><p>${s[1]}</p><p><em>Pitanja:</em> Što prvo uočavaš? Koji su prioriteti procjene? Kada zoveš liječnika/tim? Što dokumentiraš?</p><button class="btn" onclick="toggleAnswer('s${i}')">Prikaži model</button><div class="answer" id="s${i}">${s[2]}</div></div>`));sWrap.dataset.built='1'}
}
function toggleAnswer(id){document.getElementById(id)?.classList.toggle('show')}

async function doSearch(){
 const q=document.getElementById('searchInput').value.trim().toLowerCase();if(!q)return;
 for(let i=1;i<=10;i++){
   try{const r=await fetch(`data/lesson-${String(i).padStart(2,'0')}.html?v=${Date.now()}`,{cache:'no-store'});if(!r.ok)continue;const t=await r.text();if(t.toLowerCase().includes(q)){await openLesson(i);const el=[...content.querySelectorAll('p,li,td,h3,h4')].find(x=>x.textContent.toLowerCase().includes(q));if(el)el.scrollIntoView({behavior:'smooth',block:'center'});return}}catch(e){}
 }
 alert('Pojam nije pronađen u lekcijama.')
}
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
showHome();

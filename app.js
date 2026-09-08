const content=document.getElementById('content');
const home=document.getElementById('home');
let currentView='home';

function setActiveLesson(n){
  document.querySelectorAll('.lesson-btn[data-lesson]').forEach(x=>x.classList.toggle('active',+x.dataset.lesson===n));
}
function showHome(){currentView='home';content.innerHTML='';home.style.display='block';setActiveLesson(0);window.scrollTo(0,0)}
function showHeartHome(){showHome()}
async function openLesson(n){
  n=Math.max(1,Math.min(10,n));
  currentView='lesson-'+n;home.style.display='none';content.innerHTML='<div class="section">Učitavanje lekcije…</div>';
  const r=await fetch(`data/lesson-${String(n).padStart(2,'0')}.html`);
  content.innerHTML=await r.text();
  setActiveLesson(n);
  wireLesson(n);
  if(n===10)buildExam();
  window.scrollTo(0,0);
}
async function showAux(kind){
  currentView=kind;home.style.display='none';content.innerHTML='<div class="section">Učitavanje…</div>';
  const r=await fetch(`data/${kind}.html`);
  content.innerHTML=await r.text();
  setActiveLesson(0);
  window.scrollTo(0,0)
}
function wireLesson(n){
 const c=content.querySelector('.done-check');
 if(c){
   c.checked=localStorage.getItem('zn-heart-done-'+n)==='1';
   c.addEventListener('change',()=>{localStorage.setItem('zn-heart-done-'+n,c.checked?'1':'0');progress()})
 }
 content.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>n<10?openLesson(n+1):showHome()));
 content.querySelectorAll('.prev').forEach(b=>b.addEventListener('click',()=>n>1?openLesson(n-1):showHome()));
}
document.querySelectorAll('.lesson-btn[data-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(+b.dataset.lesson)));

function progress(){
 let c=0;
 for(let i=1;i<=10;i++) if(localStorage.getItem('zn-heart-done-'+i)==='1') c++;
 document.getElementById('progressBar').style.width=(c*10)+'%';
 document.getElementById('progressText').textContent=c+' / 10'
}
progress();

const simText={
 plaqueStage:["Stabilan aterosklerotski plak sužava lumen, ali je površina očuvana.","Površina plaka puca ili erodira i izlaže trombogeni sadržaj.","Trombociti i koagulacija stvaraju tromb koji dodatno sužava ili zatvara arteriju.","Nedostatak protoka uzrokuje ishemiju; ako potraje nastaje nekroza miokarda."],
 bpStage:["1. Bolesnik miruje nekoliko minuta prije mjerenja.","2. Leđa i stopala su poduprti, noge nisu prekrižene, ruka je u visini srca.","3. Odabrana je validirana manžeta odgovarajuće veličine na goloj nadlaktici.","4. Izvode se ponovljena mjerenja prema protokolu i procjenjuje trend/prosjek."],
 ecgStage:["SA čvor pokreće impuls → depolarizacija pretklijetki (P val).","Impuls usporava kroz AV čvor → PR interval predstavlja AV provođenje.","Brza depolarizacija klijetki stvara QRS kompleks.","Repolarizacija klijetki prikazuje se prvenstveno T valom."],
 acsStage:["Stabilan plak sužava koronarnu arteriju.","Ruptura/erozija izlaže trombogeni sadržaj.","Nastaje tromb koji može djelomično ili potpuno zatvoriti lumen.","Smanjen protok dovodi do ishemije, a produljena ishemija do nekroze."],
 edemaStage:["Lijeva klijetka ne prazni krv dovoljno učinkovito.","Raste tlak u lijevom atriju i plućnim venama/kapilarama.","Tekućina prelazi u plućni intersticij → dispneja i smanjena podajnost pluća.","Tekućina može ući u alveole → teška hipoksemija, hropci i akutni plućni edem."],
 measureStage:["Bolesnik miruje prije mjerenja.","Pravilno sjedi, ruka je poduprta u visini srca.","Manžeta je odgovarajuće veličine i pravilno postavljena.","Mjerenje se ponavlja i procjenjuje prosjek/trend."]
};
function simStep(id,idx,btn){
 const el=document.getElementById(id); if(!el)return;
 el.textContent=(simText[id]||[])[idx]||'';
 btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
 btn.classList.add('active')
}
function animateBlood(){
 const flow=document.getElementById('bloodFlow');
 if(!flow){openLesson(1).then(()=>setTimeout(animateBlood,150));return}
 const spans=[...flow.querySelectorAll('span')]; let i=0;
 spans.forEach(x=>x.classList.remove('pulse'));
 const tick=()=>{spans.forEach(x=>x.classList.remove('pulse'));if(i>=spans.length)return;spans[i].classList.add('pulse');i++;setTimeout(tick,550)};
 tick()
}
function buildExam(){
 const qWrap=document.getElementById('oralQuestions');
 if(qWrap&&!qWrap.dataset.built){
   let current='';
   window.ORAL_QUESTIONS.forEach((q,i)=>{
     if(q[0]!==current){current=q[0];qWrap.insertAdjacentHTML('beforeend',`<h4>${current}</h4>`)}
     qWrap.insertAdjacentHTML('beforeend',`<div class="question-card"><strong>${i+1}. ${q[1]}</strong><br><button class="btn" onclick="toggleAnswer('a${i}')">Prikaži model odgovora</button><div class="answer" id="a${i}">${q[2]}</div></div>`)
   });
   qWrap.dataset.built='1'
 }
 const sWrap=document.getElementById('scenarios');
 if(sWrap&&!sWrap.dataset.built){
   window.SCENARIOS.forEach((s,i)=>sWrap.insertAdjacentHTML('beforeend',`<div class="scenario"><strong>Scenarij ${i+1}: ${s[0]}</strong><p>${s[1]}</p><p><em>Pitanja:</em> Što prvo uočavaš? Koji su prioriteti procjene? Kada zoveš liječnika/tim? Što dokumentiraš?</p><button class="btn" onclick="toggleAnswer('s${i}')">Prikaži model</button><div class="answer" id="s${i}">${s[2]}</div></div>`));
   sWrap.dataset.built='1'
 }
}
function toggleAnswer(id){document.getElementById(id)?.classList.toggle('show')}
async function doSearch(){
 const q=document.getElementById('searchInput').value.trim().toLowerCase(); if(!q)return;
 for(let i=1;i<=10;i++){
   const t=await (await fetch(`data/lesson-${String(i).padStart(2,'0')}.html`)).text();
   if(t.toLowerCase().includes(q)){
     await openLesson(i);
     const el=[...content.querySelectorAll('p,li,td,h3,h4')].find(x=>x.textContent.toLowerCase().includes(q));
     if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
     return
   }
 }
 alert('Pojam nije pronađen u lekcijama.')
}
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});
showHome();

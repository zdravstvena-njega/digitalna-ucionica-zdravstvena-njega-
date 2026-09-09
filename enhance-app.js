(()=>{
const content=document.getElementById('content');
const rp=document.createElement('div');rp.className='reading-progress';document.body.appendChild(rp);
const topBtn=document.createElement('button');topBtn.className='back-top';topBtn.type='button';topBtn.setAttribute('aria-label','Na vrh stranice');topBtn.textContent='↑';topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));document.body.appendChild(topBtn);
const lightbox=document.createElement('div');lightbox.className='photo-lightbox';lightbox.innerHTML='<button type="button" class="lightbox-close" aria-label="Zatvori fotografiju">×</button><div class="lightbox-inner"><img alt="Uvećana fotografija medicinske opreme"><div class="lightbox-caption"></div></div>';document.body.appendChild(lightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.closest('.lightbox-close'))closePhoto()});
let enhanceTimer;
function slug(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)}
function placeExtra(lesson,n,box){
 const sections=[...lesson.querySelectorAll(':scope > .section')];
 const nav=lesson.querySelector('.nav-bottom');
 let anchor=null;
 if(n===1||n===3||n===5||n===6||n===9)anchor=sections[1]||nav;
 else if(n===2)anchor=sections[3]||nav;
 else if(n===4)anchor=sections[2]||nav;
 else if(n===7)anchor=sections.find(s=>/pravilno mjerenje/i.test(s.querySelector('h3')?.textContent||''))?.nextElementSibling||sections[2]||nav;
 else if(n===10)anchor=sections[1]||nav;
 if(anchor)lesson.insertBefore(box,anchor);else if(nav)lesson.insertBefore(box,nav);else lesson.appendChild(box);
}
function enhanceLesson(){
 const lesson=content?.querySelector('.lesson.active');if(!lesson)return;
 const n=parseInt((lesson.id||'').replace('lesson-',''),10);if(!n)return;
 if(window.LESSON_EXTRAS?.[n]&&!lesson.querySelector('.lesson-extra')){
   const box=document.createElement('div');box.className='lesson-extra';box.innerHTML=window.LESSON_EXTRAS[n];placeExtra(lesson,n,box);
 }
 const header=lesson.querySelector('.lesson-header');
 if(header&&!header.querySelector('.lesson-meta')){
   const words=lesson.textContent.trim().split(/\s+/).length;const mins=Math.max(5,Math.round(words/180));
   const meta=document.createElement('div');meta.className='lesson-meta';meta.innerHTML=`<span>📖 ${words.toLocaleString('hr-HR')} riječi</span><span>⏱ oko ${mins} min čitanja</span><span>🎓 lekcija ${String(n).padStart(2,'0')}/10</span>`;header.appendChild(meta);
 }
 if(header&&!lesson.querySelector('.lesson-map')){
   const heads=[...lesson.querySelectorAll('.section h3')];
   if(heads.length){
     heads.forEach((h,i)=>{if(!h.id)h.id=`l${n}-${slug(h.textContent)||i}`});
     const map=document.createElement('details');map.className='lesson-map';map.innerHTML=`<summary>🧭 Brza navigacija kroz lekciju</summary><div class="lesson-map-links">${heads.map(h=>`<a href="#${h.id}">${h.textContent}</a>`).join('')}</div>`;
     header.insertAdjacentElement('afterend',map);
     map.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth',block:'start'})}));
   }
 }
 initEnhancementWidgets(n);
}
function initEnhancementWidgets(n){
 if(n===1&&document.getElementById('hrRange'))updateHeartRate(document.getElementById('hrRange').value);
 if(n===2&&document.getElementById('equipmentQuiz')&&!document.getElementById('equipmentQuiz').dataset.ready)newEquipmentQuiz();
 if(n===3&&document.getElementById('ecgSimTrace'))setEcgDemo('sinus');
 if(n===6&&document.getElementById('congestionRange'))updateCongestion(document.getElementById('congestionRange').value);
 if(n===7&&document.getElementById('bpSys'))updateBp();
 content.querySelectorAll('.real-equipment-card img').forEach(img=>img.addEventListener('error',()=>img.closest('.real-equipment-card')?.classList.add('image-error'),{once:true}));
}
function scheduleEnhance(){clearTimeout(enhanceTimer);enhanceTimer=setTimeout(enhanceLesson,80)}
if(content)new MutationObserver(scheduleEnhance).observe(content,{childList:true,subtree:true});
window.addEventListener('scroll',()=>{
 const lesson=content?.querySelector('.lesson.active');
 if(lesson){const r=lesson.getBoundingClientRect();const total=Math.max(1,lesson.offsetHeight-window.innerHeight);const passed=Math.min(total,Math.max(0,-r.top+90));rp.style.width=`${Math.round((passed/total)*100)}%`}else rp.style.width='0%';
 topBtn.classList.toggle('show',window.scrollY>700);
},{passive:true});

window.updateHeartRate=function(value){
 const v=Math.max(35,Math.min(180,Number(value)||72));
 const number=document.getElementById('hrValue'),state=document.getElementById('hrState'),heart=document.getElementById('heartBeat'),text=document.getElementById('hrExplanation');
 if(number)number.textContent=Math.round(v);
 if(heart)heart.style.setProperty('--beat-sec',`${(60/v).toFixed(2)}s`);
 let naziv,opis,cls;
 if(v<60){naziv='bradikardija';opis='Frekvencija je ispod 60/min. Može biti fiziološka, primjerice u treniranih osoba, ali uz hipotenziju, bol u prsima, dispneju, sinkopu ili poremećaj svijesti zahtijeva brzu procjenu.';cls='low'}
 else if(v<=100){naziv='uobičajena frekvencija u mirovanju';opis='Vrijednost je unutar često korištenog raspona 60–100/min za odraslu osobu u mirovanju. I dalje procijeni pravilnost ritma i kliničko stanje.';cls='normal'}
 else{naziv='tahikardija';opis='Frekvencija je iznad 100/min. Razmisli o boli, temperaturi, hipovolemiji, hipoksemiji, anksioznosti, srčanom popuštanju ili aritmiji te procijeni hemodinamski učinak.';cls='high'}
 if(state){state.textContent=naziv;state.className=`hr-state ${cls}`}
 if(text)text.textContent=opis;
};
window.setHeartRate=function(v){const r=document.getElementById('hrRange');if(r){r.value=v;updateHeartRate(v)}};

const rhythmData={
 sinus:{label:'Sinusni ritam · približno 72/min',duration:'3.4s',path:'M0 65 L80 65 95 55 110 65 155 65 170 20 185 100 202 52 220 65 300 65 315 56 330 65 375 65 390 20 405 100 422 52 440 65 520 65 535 56 550 65 595 65 610 20 625 100 640 60',text:'Pravilnost i frekvencija djeluju uredno u ovom edukativnom primjeru. Stvarni EKG interpretira se sustavno i u kliničkom kontekstu.'},
 bradikardija:{label:'Bradikardija · približno 45/min',duration:'5.4s',path:'M0 65 L120 65 138 55 152 65 215 65 232 20 248 100 265 52 285 65 430 65 448 55 462 65 525 65 542 20 558 100 575 52 595 65 640 65',text:'Spor ritam nije automatski nestabilan. Procijeni svijest, tlak, bol u prsima, dispneju, perfuziju i mogući uzrok.'},
 tahikardija:{label:'Tahikardija · približno 130/min',duration:'2.0s',path:'M0 65 L38 65 48 56 57 65 75 65 86 22 98 98 108 52 120 65 158 65 168 56 177 65 195 65 206 22 218 98 228 52 240 65 278 65 288 56 297 65 315 65 326 22 338 98 348 52 360 65 398 65 408 56 417 65 435 65 446 22 458 98 468 52 480 65 518 65 528 56 537 65 555 65 566 22 578 98 588 52 600 65 640 65',text:'Kod ubrzanog ritma procijeni je li bolesnik hemodinamski stabilan i traži mogući uzrok. Monitor nije zamjena za 12-kanalni EKG kada je indiciran.'},
 nepravilan:{label:'Nepravilan ritam · edukativni primjer',duration:'3.2s',path:'M0 65 L45 65 55 57 66 65 88 65 101 24 113 96 124 53 136 65 195 65 207 57 217 65 245 65 258 22 271 100 282 52 292 65 318 65 331 58 341 65 357 65 370 22 383 99 394 52 404 65 475 65 486 58 497 65 525 65 538 24 551 96 563 53 575 65 640 65',text:'Nepravilan ritam zahtijeva procjenu bolesnika, pulsa i odgovarajući EKG zapis. Ovaj prikaz nije dijagnostički zapis određene aritmije.'}
};
function applyRhythm(pathEl,labelEl,textEl,type){const d=rhythmData[type]||rhythmData.sinus;if(pathEl){pathEl.setAttribute('d',d.path);pathEl.style.animationDuration=d.duration;pathEl.style.animation='none';void pathEl.getBoundingClientRect();pathEl.style.animation='ecgRun '+d.duration+' linear infinite'}if(labelEl)labelEl.textContent=d.label;if(textEl)textEl.textContent=d.text}
window.setRhythm=function(type){applyRhythm(document.getElementById('monitorTrace'),document.getElementById('monitorLabels'),null,type)};
window.setEcgDemo=function(type){applyRhythm(document.getElementById('ecgSimTrace'),document.getElementById('ecgSimLabel'),document.getElementById('ecgSimText'),type)};

window.updateBp=function(){
 const s=Number(document.getElementById('bpSys')?.value),d=Number(document.getElementById('bpDia')?.value),out=document.getElementById('bpResult');if(!out||!s||!d)return;
 let label,cls,detail;
 if(s>=140||d>=90){label='Ordinacijska hipertenzija';cls='bp-danger';detail='ESC 2024: ≥140 sistolički i/ili ≥90 dijastolički mmHg.'}
 else if(s<120&&d<70){label='Nepovišen krvni tlak';cls='bp-ok';detail='ESC 2024: sistolički <120 i dijastolički <70 mmHg.'}
 else{label='Povišen krvni tlak';cls='bp-warn';detail='ESC 2024: sistolički 120–139 i/ili dijastolički 70–89 mmHg.'}
 out.className=`bp-result ${cls}`;out.innerHTML=`<strong>${s}/${d} mmHg · ${label}</strong><span>${detail}</span>`;
};
window.setBp=function(s,d){const a=document.getElementById('bpSys'),b=document.getElementById('bpDia');if(a&&b){a.value=s;b.value=d;updateBp()}};

window.updateCongestion=function(value){
 const v=Math.max(0,Math.min(3,Number(value)||0)),lung=document.getElementById('lungSim'),text=document.getElementById('congestionText');if(lung)lung.className=`lung-sim level-${v}`;
 const t=[
 '<strong>0 – bez izražene kongestije:</strong> model prikazuje relativno očuvan zračni prostor.',
 '<strong>1 – plućna kongestija:</strong> raste tlak u plućnim venama i kapilarama; mogu se javiti dispneja pri naporu i početni znakovi zastoja.',
 '<strong>2 – intersticijski edem:</strong> tekućina se nakuplja u intersticiju; disanje postaje teže, mogu se javiti ortopneja i hropci.',
 '<strong>3 – alveolarni edem:</strong> tekućina ulazi u alveole; mogu se javiti teška dispneja, hipoksemija, difuzni hropci i pjenasti iskašljaj – hitno stanje.'
 ];if(text)text.innerHTML=t[v];
};

window.acsChoice=function(choice){const out=document.getElementById('acsFeedback');if(!out)return;if(choice==='ekg'){out.className='quiz-feedback correct';out.innerHTML='<strong>Točno.</strong> Prioritet je procjena bolesnika i brzo snimanje 12-kanalnog EKG-a uz vitalne znakove, SpO₂ i aktiviranje liječnika/tima. Troponin je važan, ali ne smije nepotrebno odgoditi EKG.'}else if(choice==='troponin'){out.className='quiz-feedback wrong';out.innerHTML='<strong>Nije najbolji izbor.</strong> Kod sumnje na ACS ne čeka se troponin da bi se napravio EKG. Simptomi, EKG i biomarkeri tumače se zajedno.'}else{out.className='quiz-feedback wrong';out.innerHTML='<strong>Nije rutinski za svakoga.</strong> Kisik se primjenjuje kod hipoksemije, respiratornog distresa ili druge jasne indikacije prema protokolu; normoksemičnom bolesniku s ACS-om ne daje se automatski.'}};

window.newEquipmentQuiz=function(){
 const wrap=document.getElementById('equipmentQuiz'),data=window.ZN3_EQUIPMENT||[];if(!wrap||data.length<4)return;wrap.dataset.ready='1';
 const correct=data[Math.floor(Math.random()*data.length)];const distract=data.filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);const choices=[correct,...distract].sort(()=>Math.random()-.5);
 wrap.dataset.answer=correct.naziv;wrap.innerHTML=`<div class="quiz-photo"><img src="${correct.slika}" alt="Fotografija medicinske opreme za prepoznavanje" loading="lazy" referrerpolicy="no-referrer"></div><p><strong>Koju opremu vidiš?</strong></p><div class="quiz-options">${choices.map(c=>`<button class="btn" type="button" onclick="answerEquipment(this,'${c.naziv.replace(/'/g,"\\'")}')">${c.naziv}</button>`).join('')}</div><div class="equipment-feedback">Odaberi odgovor.</div>`;
};
window.answerEquipment=function(btn,name){const wrap=document.getElementById('equipmentQuiz'),feedback=wrap?.querySelector('.equipment-feedback');if(!wrap||!feedback)return;wrap.querySelectorAll('.quiz-options button').forEach(b=>b.disabled=true);if(name===wrap.dataset.answer){btn.classList.add('answer-correct');feedback.innerHTML='<strong>Točno.</strong> Prepoznaj uređaj po funkciji, priključcima, zaslonu i načinu na koji je uključen u bolesničku jedinicu.'}else{btn.classList.add('answer-wrong');feedback.innerHTML=`<strong>Nije.</strong> Točan odgovor je: ${wrap.dataset.answer}.`}};

window.openPhoto=function(index){const e=(window.ZN3_EQUIPMENT||[])[index];if(!e)return;const img=lightbox.querySelector('img'),cap=lightbox.querySelector('.lightbox-caption');img.src=e.slika;img.alt=e.naziv;cap.innerHTML=`<strong>${e.naziv}</strong><p>${e.opis}</p><span>${e.licenca}</span><a href="${e.izvor}" target="_blank" rel="noopener">Otvori izvor fotografije ↗</a>`;lightbox.classList.add('show');document.body.style.overflow='hidden'};
window.closePhoto=closePhoto;function closePhoto(){lightbox.classList.remove('show');lightbox.querySelector('img').src='';document.body.style.overflow=''}

window.jumpToSimulator=async function(lesson,id){await openLesson(lesson);setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'center'}),160)};
window.randomOralQuestion=function(){
 const arr=window.ORAL_QUESTIONS||[];const out=document.getElementById('randomQuestionResult');if(!out||!arr.length)return;
 const i=Math.floor(Math.random()*arr.length),q=arr[i];
 out.innerHTML=`<span class="phase-badge">${q[0]}</span><h4>${q[1]}</h4><button class="btn" type="button" onclick="toggleRandomAnswer(this)">Prikaži model odgovora</button><div class="answer">${q[2]}</div>`;
 out.scrollIntoView({behavior:'smooth',block:'center'});
};
window.toggleRandomAnswer=function(btn){btn.nextElementSibling?.classList.toggle('show')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox.classList.contains('show'))closePhoto()});
scheduleEnhance();
})();
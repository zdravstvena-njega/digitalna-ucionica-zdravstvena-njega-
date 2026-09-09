(()=>{
const content=document.getElementById('content');
const rp=document.createElement('div');rp.className='reading-progress';document.body.appendChild(rp);
const topBtn=document.createElement('button');topBtn.className='back-top';topBtn.type='button';topBtn.setAttribute('aria-label','Na vrh stranice');topBtn.textContent='↑';topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));document.body.appendChild(topBtn);
let enhanceTimer;
function slug(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)}
function placeExtra(lesson,n,box){
 const sections=[...lesson.querySelectorAll(':scope > .section')];
 const nav=lesson.querySelector('.nav-bottom');
 let anchor=null;
 if(n===1||n===3||n===5||n===6||n===9)anchor=sections[1]||nav;
 else if(n===2)anchor=sections[3]||nav;
 else if(n===4)anchor=sections[2]||nav;
 else if(n===7)anchor=sections.find(s=>/pravilno mjerenje/i.test(s.querySelector('h3')?.textContent||''))?.nextElementSibling||nav;
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
}
function scheduleEnhance(){clearTimeout(enhanceTimer);enhanceTimer=setTimeout(enhanceLesson,80)}
if(content)new MutationObserver(scheduleEnhance).observe(content,{childList:true,subtree:true});
window.addEventListener('scroll',()=>{
 const lesson=content?.querySelector('.lesson.active');
 if(lesson){const r=lesson.getBoundingClientRect();const total=Math.max(1,lesson.offsetHeight-window.innerHeight);const passed=Math.min(total,Math.max(0,-r.top+90));rp.style.width=`${Math.round((passed/total)*100)}%`}else rp.style.width='0%';
 topBtn.classList.toggle('show',window.scrollY>700);
},{passive:true});
window.randomOralQuestion=function(){
 const arr=window.ORAL_QUESTIONS||[];const out=document.getElementById('randomQuestionResult');if(!out||!arr.length)return;
 const i=Math.floor(Math.random()*arr.length),q=arr[i];
 out.innerHTML=`<span class="phase-badge">${q[0]}</span><h4>${q[1]}</h4><button class="btn" type="button" onclick="toggleRandomAnswer(this)">Prikaži model odgovora</button><div class="answer">${q[2]}</div>`;
 out.scrollIntoView({behavior:'smooth',block:'center'});
};
window.toggleRandomAnswer=function(btn){btn.nextElementSibling?.classList.toggle('show')};
scheduleEnhance();
})();
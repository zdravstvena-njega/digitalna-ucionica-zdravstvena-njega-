(()=>{
const content=document.getElementById('content');
const CIVILIAN_EQUIPMENT=[
 {n:'Suvremena JIL soba – organizacija radnog mjesta',d:'Primjer jedinice intenzivnog liječenja u civilnoj općoj bolnici. Uoči krevet, monitoring, infuzijsku i respiratornu opremu, priključke te raspored koji omogućuje brz pristup bolesniku.',img:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mechelen_AZ_St_Maarten_Intensive_Care_Unit_01.jpg?width=1400',src:'https://commons.wikimedia.org/wiki/File:Mechelen_AZ_St_Maarten_Intensive_Care_Unit_01.jpg',lic:'Wikimedia Commons · Ad Meskens · CC BY-SA 4.0'},
 {n:'LIFEPAK 15 – profesionalni monitor/defibrilator',d:'Civilni primjer profesionalnog monitora/defibrilatora. Za učenika su važni prepoznavanje uređaja, sigurnost, monitoring i osnovna logika defibrilacije.',img:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lifepak_15.jpg?width=1400',src:'https://commons.wikimedia.org/wiki/File:Lifepak_15.jpg',lic:'Wikimedia Commons · Subarurally · CC BY-SA 4.0'}
];
function applyCivilianEquipment(){
 const data=window.ZN3_EQUIPMENT;
 if(Array.isArray(data)&&data.length>=2){Object.assign(data[0],CIVILIAN_EQUIPMENT[0]);Object.assign(data[1],CIVILIAN_EQUIPMENT[1]);}
 const cards=[...document.querySelectorAll('.real-modern-gallery .modern-device')];
 CIVILIAN_EQUIPMENT.forEach((e,i)=>{
   const card=cards[i];if(!card)return;
   const img=card.querySelector('img');if(img){img.src=e.img;img.alt=e.n;}
   const title=card.querySelector('figcaption strong');if(title)title.textContent=e.n;
   const desc=card.querySelector('figcaption p');if(desc)desc.textContent=e.d;
   const lic=card.querySelector('figcaption small');if(lic)lic.textContent=e.lic;
   const link=card.querySelector('figcaption a');if(link)link.href=e.src;
 });
}
function fixLesson2(){
 applyCivilianEquipment();
 const lesson=content?.querySelector('#lesson-2.active');if(!lesson)return;
 const wrap=lesson.querySelector('.real-modern-gallery')?.parentElement;
 if(wrap){
   const next=wrap.nextElementSibling;
   if(next?.classList.contains('manufacturer-links'))next.remove();
 }
 const q=document.getElementById('equipmentQuiz');
 if(q&&window.ZN3_EQUIPMENT?.length&&typeof window.newEquipmentQuiz==='function'&&!q.dataset.finalized){
   q.dataset.ready='';q.dataset.finalized='1';window.newEquipmentQuiz();
 }
}
let timer;
function run(){clearTimeout(timer);timer=setTimeout(fixLesson2,340)}
if(content)new MutationObserver(run).observe(content,{childList:true,subtree:true});
applyCivilianEquipment();
run();
})();
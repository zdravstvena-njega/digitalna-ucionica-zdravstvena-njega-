(()=>{
const content=document.getElementById('content');
const SOURCE='Nastavna ilustracija / autorov materijal';
const NEW_EQUIPMENT=[
 {n:'Monitor bolesnika',d:'Prikazuje EKG, puls, SpO₂, krvni tlak i druge parametre. Učenik treba prepoznati uređaj, provjeriti kvalitetu signala i uvijek usporediti alarm s kliničkim stanjem bolesnika.',img:'assets/monitor-bolesnika.webp'},
 {n:'Infuzijska / štrcaljkasta pumpa',d:'Omogućuje preciznu primjenu lijekova i infuzija. Provjeravaju se lijek, koncentracija, brzina, venski put i alarmi.',img:'assets/infuzijska-pumpa.webp'},
 {n:'Defibrilator / monitor',d:'Koristi se za defibrilaciju, sinkroniziranu kardioverziju te, ovisno o modelu, monitoring i vanjsku stimulaciju.',img:'assets/defibrilator.webp'},
 {n:'Reanimacijska kolica',d:'Sadrže hitne lijekove, potrošni materijal i pribor za reanimaciju. Moraju biti provjerena, nadopunjena i odmah dostupna.',img:'assets/reanimacijska-kolica.webp'},
 {n:'Moderni prostor JIL-a',d:'Organiziran je za kontinuirani nadzor i brz pristup kisiku, aspiraciji, infuzijskoj, respiratornoj i drugoj opremi.',img:'assets/moderni-jil-prostor.webp'},
 {n:'Bolesnik uz uzglavlje s opremom',d:'Prikazuje raspored monitora, infuzijskih sustava, priključaka i druge opreme oko bolesničkog kreveta u intenzivnoj skrbi.',img:'assets/uzglavlje-jil-bolesnika.webp'},
 {n:'Centralni dovod kisika i zidna jedinica',d:'Na uzglavnoj jedinici mogu biti kisik, medicinski zrak, vakuum/aspiracija te električni i podatkovni priključci.',img:'assets/centralni-dovod-kisika.webp'},
 {n:'Aspirator',d:'Stvara podtlak za uklanjanje sekreta i sadržaja kada je aspiracija indicirana. Provjeravaju se vakuum, spremnik, cijevi i pribor.',img:'assets/aspirator.webp'}
].map(e=>({...e,src:e.img,lic:SOURCE,naziv:e.n,opis:e.d,slika:e.img,izvor:e.img,licenca:SOURCE}));

function setEquipmentData(){
 window.ZN3_EQUIPMENT=NEW_EQUIPMENT;
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function fullGallery(){
 return `<div class="practice-reference"><strong>Oprema povezana s praksom</strong><p>Galerija koristi novi komplet nastavnih fotografija JIL/JIKS opreme. Cilj je prepoznati uređaj, njegovu osnovnu svrhu i sigurnosnu logiku; model na praksi može se razlikovati.</p></div><div class="real-modern-gallery">${NEW_EQUIPMENT.map((e,i)=>`<figure class="modern-device"${i===0?' data-device="ge"':''}><button class="photo-button" type="button" onclick="openPhoto(${i})" aria-label="Uvećaj fotografiju: ${esc(e.n)}"><img src="${e.img}" alt="${esc(e.n)}" loading="lazy"></button><figcaption><strong>${esc(e.n)}</strong><p>${esc(e.d)}</p><small>${esc(e.lic)}</small></figcaption></figure>`).join('')}</div>`;
}
function replaceGallery(lesson){
 const modern=lesson.querySelector('.real-modern-gallery');
 if(modern){
   const wrap=modern.parentElement;
   if(wrap && wrap.dataset.newEquipmentSet!=='1'){
     wrap.innerHTML=fullGallery();
     wrap.dataset.newEquipmentSet='1';
   }
 }else{
   const old=lesson.querySelector('.real-equipment-gallery');
   if(old){
     const wrap=document.createElement('div');
     wrap.dataset.newEquipmentSet='1';
     wrap.innerHTML=fullGallery();
     old.replaceWith(wrap);
   }
 }
 lesson.querySelectorAll('.real-equipment-gallery').forEach(el=>el.remove());
 lesson.querySelectorAll('.manufacturer-links').forEach(el=>el.remove());
}
function refreshQuiz(lesson){
 const q=lesson.querySelector('#equipmentQuiz');
 if(q&&typeof window.newEquipmentQuiz==='function'&&q.dataset.newSet!=='1'){
   q.dataset.ready='';
   q.dataset.finalized='1';
   q.dataset.newSet='1';
   window.newEquipmentQuiz();
 }
}
function fixLesson2(){
 setEquipmentData();
 const lesson=content?.querySelector('#lesson-2.active');
 if(!lesson)return;
 replaceGallery(lesson);
 refreshQuiz(lesson);
}
let timer;
function run(){clearTimeout(timer);timer=setTimeout(fixLesson2,40);}
setEquipmentData();
if(content)new MutationObserver(run).observe(content,{childList:true,subtree:true});
run();
})();

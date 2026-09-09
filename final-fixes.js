(()=>{
const content=document.getElementById('content');
function fixLesson2(){
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
run();
})();
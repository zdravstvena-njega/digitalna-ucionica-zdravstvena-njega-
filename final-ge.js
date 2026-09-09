(()=>{
const content=document.getElementById('content');
function addGE(){
 const lesson=content?.querySelector('#lesson-2.active');if(!lesson)return;
 const gallery=lesson.querySelector('.real-modern-gallery');
 if(gallery&&!gallery.querySelector('[data-device="ge"]')){
   const f=document.createElement('figure');f.className='modern-device';f.dataset.device='ge';
   f.innerHTML='<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Monitor_theo_d%E1%BB%95i_b%E1%BB%87nh_nh%C3%A2n.jpg?width=1200" alt="GE HealthCare monitor bolesnika" loading="lazy" referrerpolicy="no-referrer"><figcaption><strong>GE HealthCare – monitor bolesnika</strong><p>Stvarni primjer monitora za praćenje vitalnih funkcija. Za učenika je važnije razumjeti parametre, senzore, alarme i kliničku procjenu nego naučiti izbornike pojedinog modela.</p><small>Wikimedia Commons · Huynhvn · CC0</small><a href="https://commons.wikimedia.org/wiki/File:Monitor_theo_d%E1%BB%95i_b%E1%BB%87nh_nh%C3%A2n.jpg" target="_blank" rel="noopener">Izvor fotografije ↗</a></figcaption>';
   gallery.appendChild(f);
 }
 const links=lesson.querySelector('.real-modern-gallery')?.parentElement?.querySelector('.manufacturer-links');
 if(links&&!links.querySelector('[data-maker="ge"]')){
   const a=document.createElement('a');a.dataset.maker='ge';a.href='https://www.gehealthcare.com/en-us/products/patient-monitoring/patient-monitors/carescape-canvas';a.target='_blank';a.rel='noopener';a.innerHTML='<strong>GE HealthCare CARESCAPE Canvas</strong><span>Suvremena platforma za monitoring bolesnika ↗</span>';links.appendChild(a);
 }
}
let t;function run(){clearTimeout(t);t=setTimeout(addGE,450)}
if(content)new MutationObserver(run).observe(content,{childList:true,subtree:true});run();
})();
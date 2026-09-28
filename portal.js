(()=>{
  const total=10;
  let done=0;
  let firstOpen=null;
  for(let i=1;i<=total;i++){
    const isDone=localStorage.getItem('zn-heart-done-'+i)==='1';
    if(isDone) done++;
    else if(firstOpen===null) firstOpen=i;
  }
  if(firstOpen===null) firstOpen=10;
  const pct=Math.round((done/total)*100);
  const fill=document.getElementById('courseProgress');
  const count=document.getElementById('courseProgressCount');
  const note=document.getElementById('courseProgressNote');
  const resume=document.getElementById('resumeCourse');
  const chapterResume=document.getElementById('chapterResume');
  const chapterProgress=document.getElementById('chapterProgressText');
  if(fill) fill.style.width=pct+'%';
  if(count) count.textContent=pct+'%';
  if(note) note.textContent=done===0?'Još nisi označio završene lekcije. Počni od prve.':done===total?'Poglavlje je označeno kao završeno. Možeš ponoviti gradivo ili otvoriti završnu provjeru znanja.':`Završeno ${done} od ${total} lekcija.`;
  if(chapterProgress) chapterProgress.textContent=`${done}/${total} lekcija završeno`;
  const target=`srce-i-krvne-zile.html?lekcija=${firstOpen}`;
  if(resume){resume.href=target;resume.textContent=done===0?'Započni učenje →':done===total?'Ponovi završnu provjeru →':'Nastavi gdje si stao →'}
  if(chapterResume) chapterResume.href=target;
})();
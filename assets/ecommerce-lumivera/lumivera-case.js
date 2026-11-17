(()=>{
  'use strict';
  const links=[...document.querySelectorAll('#ecommerce-design [data-lum-image]')];
  if(!links.length||typeof HTMLDialogElement==='undefined')return;
  const viewer=document.createElement('dialog');
  viewer.className='lum-viewer';viewer.setAttribute('aria-label','LUMIVERA 电商视觉作品大图');
  if(typeof viewer.showModal!=='function')return;
  viewer.innerHTML='<div class="lum-viewer-bar"><p id="lum-viewer-title" aria-live="polite"></p><div class="lum-viewer-controls"><button type="button" data-lum-prev aria-label="上一张">←</button><button type="button" data-lum-next aria-label="下一张">→</button><button type="button" data-lum-close aria-label="关闭大图">×</button></div></div><div class="lum-viewer-scroll"><img alt=""></div><p class="lum-viewer-foot">上下滚动查看完整画面 · 方向键切换 · Esc 关闭</p>';
  viewer.setAttribute('aria-labelledby','lum-viewer-title');document.body.append(viewer);
  const title=viewer.querySelector('#lum-viewer-title'),image=viewer.querySelector('img'),scroll=viewer.querySelector('.lum-viewer-scroll');
  const prev=viewer.querySelector('[data-lum-prev]'),next=viewer.querySelector('[data-lum-next]'),close=viewer.querySelector('[data-lum-close]');
  let index=0,opener=null,oldOverflow='';
  function showItem(value){
    index=Math.max(0,Math.min(links.length-1,value));
    const link=links[index],source=link.querySelector('img');
    image.src=link.href;image.alt=source.alt;image.width=source.width;image.height=source.height;
    title.textContent=`${String(index+1).padStart(2,'0')} / ${String(links.length).padStart(2,'0')} · ${link.getAttribute('aria-label').replace('放大查看：','')}`;
    prev.disabled=index===0;next.disabled=index===links.length-1;scroll.scrollTop=0;
  }
  links.forEach((link,i)=>link.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();opener=link;oldOverflow=document.body.style.overflow;showItem(i);
    viewer.showModal();document.body.style.overflow='hidden';close.focus({preventScroll:true});
  }));
  prev.addEventListener('click',()=>showItem(index-1));next.addEventListener('click',()=>showItem(index+1));close.addEventListener('click',()=>viewer.close());
  viewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showItem(index+(event.key==='ArrowLeft'?-1:1));}
  });
  viewer.addEventListener('click',event=>{
    if(event.target!==viewer)return;
    const rect=viewer.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)viewer.close();
  });
  viewer.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;opener?.focus({preventScroll:true});});
})();

(() => {
  'use strict';
  const mobile = matchMedia('(max-width:760px)');
  // Old case-study return links used #projects, while the home section is #work.
  function restoreProjectAnchor() {
    if (document.body.dataset.mobilePage !== 'home' || location.hash !== '#projects') return;
    if (!document.documentElement.classList.contains('is-ready')) return;
    document.getElementById('work')?.scrollIntoView({block:'start',behavior:'instant'});
  }
  const readyObserver = new MutationObserver(restoreProjectAnchor);
  readyObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.addEventListener('hashchange',restoreProjectAnchor);
  restoreProjectAnchor();
  document.querySelectorAll('video').forEach(video=>{
    video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    if(!video.hasAttribute('autoplay')) video.preload='metadata';
  });
  if(!mobile.matches) return;
  const dataCaption=document.querySelector('.live-demo-caption');
  if(dataCaption) dataCaption.textContent='动态大屏可左右滑动查看，横屏浏览可显示更多内容。';
  const omsNote=document.querySelector('.oms-demo-bottom span:last-child');
  if(omsNote) omsNote.textContent='演示界面可左右滑动，横屏体验更完整。';
  const viewer=document.createElement('dialog');
  viewer.className='mobile-image-viewer';viewer.setAttribute('aria-label','作品图片放大查看');
  viewer.innerHTML='<div class="mobile-image-viewer__bar"><p>已放大 · 左右、上下滑动查看<br>也可使用双指缩放</p><button class="mobile-image-viewer__close" type="button">关闭 ×</button></div><div class="mobile-image-viewer__canvas"><img alt=""></div>';
  document.body.append(viewer);
  const canvas=viewer.querySelector('.mobile-image-viewer__canvas'),large=viewer.querySelector('img');
  let previous=null,previousOverflow='';
  function open(image){
    previous=document.activeElement;previousOverflow=document.body.style.overflow;
    large.src=image.currentSrc||image.src;large.alt=image.alt||'作品设计详情';
    large.style.width=Math.max(innerWidth-36,Math.min(image.naturalWidth,1000))+'px';
    document.body.style.overflow='hidden';viewer.showModal();canvas.scrollTop=canvas.scrollLeft=0;
  }
  viewer.querySelector('button').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;previous?.focus({preventScroll:true});});
  const profile=document.getElementById('profile-zoom');
  if(profile) profile.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();open(profile.querySelector('img'));},true);
  function enhance(image){
    if(image.dataset.mobileZoom||image.naturalWidth<600||image.closest('a,button,dialog,.loader,.background-scene,.ambient-layer,.work-marquee')) return;
    if(image.closest('.hero-art,.fortune-hero') && !image.alt) return;
    image.dataset.mobileZoom='true';image.classList.add('mobile-zoom-target');
    image.setAttribute('tabindex','0');image.setAttribute('role','button');
    image.setAttribute('aria-label',(image.alt||'作品图片')+'，点击放大查看');
    image.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();open(image);},true);
    image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(image);}});
  }
  document.querySelectorAll('main img').forEach(image=>{if(image.complete)enhance(image);else image.addEventListener('load',()=>enhance(image),{once:true});});
  if(document.body.dataset.mobilePage!=='home'){
    const first=document.querySelector('main section');
    if(first){const tip=document.createElement('p');tip.className='mobile-image-tip';tip.textContent='查看提示：作品大图可点按放大，滑动查看细节。';first.append(tip);}
  }
})();

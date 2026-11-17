(() => {
  const frame=document.querySelector('.live-demo-iframe');if(!frame)return;
  const stage=frame.parentElement;
  const status=document.createElement('p');status.className='dashboard-load-status';status.setAttribute('role','status');
  status.textContent='正在加载动态数据…';stage.before(status);
  let ready=false;
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.data?.type!=='portfolio-dashboard-layout')return;
    if(event.data.mobile&&Number.isFinite(event.data.height)&&event.data.height>100){
      frame.style.height=Math.min(Math.ceil(event.data.height)+8,12000)+'px';
      stage.classList.add('is-mobile-dashboard');
    }else{frame.style.height='';stage.classList.remove('is-mobile-dashboard')}
    if(event.data.ready){ready=true;status.textContent='实时演示已加载 · 向下浏览各项经营指标';status.classList.add('is-ready')}
  });
  setTimeout(()=>{if(!ready)status.textContent='动态数据正在准备，加载完成后会在此处显示。';},12000);
})();

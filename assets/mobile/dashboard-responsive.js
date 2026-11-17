(() => {
  const mobile=matchMedia('(max-width:1024px)');
  function report(){
    if(parent===window)return;
    parent.postMessage({type:'portfolio-dashboard-layout',mobile:mobile.matches,height:Math.ceil(document.getElementById('dashboard-scale-wrapper').getBoundingClientRect().height),ready:!!window.echarts&&!!document.querySelector('#sales-trend-chart canvas')},'*');
  }
  let timer;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(report,120)};
  const charts=new ResizeObserver(entries=>{
    requestAnimationFrame(()=>entries.forEach(({target})=>{
      if(target.clientWidth>0&&target.clientHeight>0)window.echarts?.getInstanceByDom(target)?.resize();
    }));
  });
  ['sparkline-gmv','sparkline-orders','sparkline-shipping','channel-pie-chart','sales-trend-chart','nb-map-chart','service-funnel-chart','service-reason-chart'].forEach(id=>{
    const element=document.getElementById(id);if(element)charts.observe(element);
  });
  new ResizeObserver(schedule).observe(document.getElementById('dashboard-scale-wrapper'));
  window.addEventListener('load',schedule);window.addEventListener('resize',schedule);
  document.addEventListener('click',schedule);report();
})();

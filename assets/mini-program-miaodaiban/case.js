(()=>{
  'use strict';
  document.querySelectorAll('[data-mini-copy]').forEach(button=>{
    let resetTimer;
    button.addEventListener('click',async()=>{
      clearTimeout(resetTimer);
      const label=button.querySelector('[data-mini-copy-label]');
      const feedback=button.closest('.mp-copy').querySelector('[data-mini-feedback]');
      const value=button.getAttribute('data-mini-copy');
      button.disabled=true;label.textContent='正在复制…';
      let copied=false;
      try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);copied=true;}}catch(_){}
      if(!copied){
        const previous=document.activeElement,input=document.createElement('textarea');
        input.value=value;input.setAttribute('readonly','');input.style.cssText='position:fixed;left:-9999px;top:0';
        document.body.append(input);input.select();
        try{copied=document.execCommand('copy');}catch(_){}
        input.remove();previous?.focus({preventScroll:true});
      }
      button.disabled=false;
      label.textContent=copied?'口令已复制 ✓':'请手动复制';
      feedback.textContent=copied?'已复制微信小程序口令，可在微信中使用。':'请复制：'+value;
      resetTimer=setTimeout(()=>{label.textContent='复制小程序口令';},2400);
    });
  });
  const codeButtons=[...document.querySelectorAll('[data-mini-qr]')];
  if(codeButtons.length){
    const dialog=document.createElement('dialog');
    dialog.className='mp-qr-dialog';dialog.setAttribute('aria-label','微信扫码体验截图秒待办');
    dialog.innerHTML='<button type="button" class="mp-qr-close" data-cursor="pointer" aria-label="关闭小程序码">×</button><img alt="截图秒待办正式版微信小程序码"><p>使用微信扫一扫，即可体验小程序</p>';
    document.body.append(dialog);
    let previousOverflow='',previousFocus=null;
    codeButtons.forEach(button=>button.addEventListener('click',()=>{
      dialog.querySelector('img').src=button.getAttribute('data-mini-qr');
      previousFocus=button;previousOverflow=document.body.style.overflow;
      if(typeof dialog.showModal==='function'){
        dialog.showModal();document.body.style.overflow='hidden';
        dialog.querySelector('button').focus({preventScroll:true});
      }else{window.open(button.getAttribute('data-mini-qr'),'_blank','noopener');}
    }));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const rect=dialog.getBoundingClientRect();
      if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
    });
    dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;previousFocus?.focus({preventScroll:true});});
  }
})();

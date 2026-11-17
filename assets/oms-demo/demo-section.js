(() => {
    const root = document.getElementById('oms-interactive-demo');
    if (!root) return;
    const button = root.querySelector('[data-oms-start]');
    const label = root.querySelector('[data-oms-button-label]');
    const status = root.querySelector('[data-oms-status]');
    const preview = root.querySelector('[data-oms-preview]');
    const viewport = root.querySelector('[data-oms-viewport]');
    const frame = root.querySelector('[data-oms-frame]');
    let timer;
    let checkTimer;
    let ready = false;
    function showDemo() {
        clearTimeout(timer);
        clearTimeout(checkTimer);
        ready = true;
        preview.hidden = true;
        viewport.hidden = false;
        viewport.style.position = '';
        viewport.style.inset = '';
        viewport.style.visibility = '';
        frame.removeAttribute('tabindex');
        frame.focus({ preventScroll: true });
    }
    // Also supports local file previews, where frames can have opaque origins.
    window.addEventListener('message', event => {
        if (event.source === frame.contentWindow && event.data?.type === 'jhm-oms-demo-ready') showDemo();
    });
    function retry() {
        clearTimeout(timer);
        clearTimeout(checkTimer);
        button.disabled = false;
        button.removeAttribute('aria-busy');
        label.textContent = '重新加载';
        status.textContent = '暂未加载完成，请重试，或点击右上角“新窗口体验”。';
    }
    function checkReady() {
        if (!frame.getAttribute('src')) return;
        try {
            if (!frame.contentDocument?.getElementById('root')?.children.length) {
                checkTimer = setTimeout(checkReady, 80);
                return;
            }
        } catch { return; }
        showDemo();
    }
    frame.addEventListener('load', checkReady);
    frame.addEventListener('error', retry);
    button.addEventListener('click', () => {
        if (ready) return;
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        label.textContent = '正在打开…';
        status.textContent = '正在准备交互界面，请稍候。';
        // Keep the iframe measurable while loading so charts get a real width.
        viewport.hidden = false;
        viewport.style.position = 'absolute';
        viewport.style.inset = '0';
        viewport.style.visibility = 'hidden';
        clearTimeout(checkTimer);
        frame.src = frame.dataset.src;
        clearTimeout(timer);
        timer = setTimeout(retry, 15000);
    });
})();

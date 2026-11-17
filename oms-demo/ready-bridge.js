(() => {
    if (window.parent === window) return;
    const root = document.getElementById('root');
    if (!root) return;
    const observer = new MutationObserver(check);
    function check() {
        if (!root.children.length) return;
        observer.disconnect();
        window.parent.postMessage({ type: 'jhm-oms-demo-ready' }, '*');
    }
    observer.observe(root, { childList: true });
    check();
})();

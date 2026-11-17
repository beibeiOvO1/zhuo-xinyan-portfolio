(() => {
  'use strict';

  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function copySelection(value) {
    const previousFocus = document.activeElement;
    const input = document.createElement('textarea');
    input.value = value;
    input.readOnly = true;
    input.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none';
    document.body.append(input);
    let copied = false;
    try {
      input.focus({ preventScroll: true });
      input.select();
      input.setSelectionRange(0, value.length);
      copied = document.execCommand('copy');
    } catch (_) {
      copied = false;
    } finally {
      input.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    return copied;
  }

  async function copyText(value) {
    // Local portfolio files can copy synchronously within the click gesture.
    if (location.protocol === 'file:' && copySelection(value)) return true;

    if (window.isSecureContext && navigator.clipboard?.writeText) {
      let timeout;
      try {
        const copied = navigator.clipboard.writeText(value).then(() => true);
        const expired = new Promise(resolve => {
          timeout = setTimeout(() => resolve(false), 1200);
        });
        if (await Promise.race([copied, expired])) return true;
      } catch (_) {
        // Continue with the selection-based fallback.
      } finally {
        clearTimeout(timeout);
      }
    }
    return copySelection(value);
  }

  for (const button of document.querySelectorAll('.contact-row[data-copy]')) {
    const status = button.querySelector('.copy-status');
    let resetTimer;

    button.addEventListener('click', async () => {
      if (button.disabled) return;
      clearTimeout(resetTimer);
      button.disabled = true;
      button.dataset.copyState = 'pending';
      status.textContent = '复制中…';

      const copied = await copyText(button.dataset.copy);
      button.disabled = false;
      button.dataset.copyState = copied ? 'success' : 'error';
      status.textContent = copied ? '已复制 ✓' : '复制失败';
      showToast(copied ? '已复制到剪贴板 ✓' : `请手动复制：${button.dataset.copy}`);

      resetTimer = setTimeout(() => {
        button.dataset.copyState = 'idle';
        status.textContent = '复制';
      }, 3000);
    });
  }
})();

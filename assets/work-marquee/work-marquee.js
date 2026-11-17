(() => {
  'use strict';

  const wall = document.querySelector('[data-work-marquee]');
  if (!wall) return;

  const toggle = wall.querySelector('[data-marquee-toggle]');
  const backgroundToggle = document.getElementById('background-motion');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = true;

  for (const track of wall.querySelectorAll('.work-marquee__track')) {
    const group = track.querySelector('.work-marquee__group');
    const clone = group.cloneNode(true);
    clone.dataset.marqueeClone = '';
    clone.setAttribute('aria-hidden', 'true');
    for (const link of clone.querySelectorAll('a')) link.tabIndex = -1;
    track.append(clone);
  }
  wall.classList.add('is-enhanced');

  function sync() {
    const backgroundEnabled = backgroundToggle?.getAttribute('aria-pressed') !== 'false';
    const allowed = !reducedMotion.matches && backgroundEnabled;
    wall.dataset.running = String(allowed && !userPaused && inView && !document.hidden);
    toggle.disabled = !allowed;
    toggle.setAttribute('aria-pressed', String(userPaused || !allowed));
    toggle.textContent = allowed ? (userPaused ? '播放图片滚动' : '暂停图片滚动') : '图片滚动已关闭';
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    sync();
  });
  backgroundToggle?.addEventListener('click', () => queueMicrotask(sync));
  reducedMotion.addEventListener('change', () => queueMicrotask(sync));
  document.addEventListener('visibilitychange', sync);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '150px 0px' });
    observer.observe(wall);
  }
  sync();
})();

(()=>{
  'use strict';
  const videos = document.querySelectorAll('[data-ai-stage] video');

  for (const video of videos) {
    const stage = video.closest('[data-ai-stage]');
    const button = stage.querySelector('[data-ai-play]');
    const label = button.querySelector('[data-ai-play-label]');
    const status = stage.closest('.ai-film-player').querySelector('[data-ai-status]');
    button.hidden = false;

    function showPlayButton(text) {
      button.hidden = false;
      button.disabled = false;
      label.textContent = text;
    }

    button.addEventListener('click', async () => {
      if (video.error) video.load();
      if (video.ended) video.currentTime = 0;
      stage.dataset.state = 'loading';
      button.disabled = true;
      label.textContent = '正在加载…';
      status.textContent = '正在准备视频…';

      try {
        await video.play();
      } catch (error) {
        if (error.name === 'AbortError' && !video.error) {
          stage.dataset.state = 'paused';
          showPlayButton('点击继续播放');
          status.textContent = '已暂停，可继续观看。';
          return;
        }
        stage.dataset.state = 'error';
        showPlayButton('重试播放');
        status.textContent = '暂时无法播放，可重试或点击「独立窗口观看」。';
      }
    });

    video.addEventListener('play', () => {
      for (const other of videos) {
        if (other !== video && !other.paused) other.pause();
      }
    });

    video.addEventListener('playing', () => {
      stage.dataset.state = 'playing';
      button.hidden = true;
      button.disabled = false;
      status.textContent = '正在播放，可暂停、拖动进度或全屏观看。';
    });

    video.addEventListener('waiting', () => {
      if (video.paused) return;
      stage.dataset.state = button.hidden ? 'buffering' : 'loading';
      status.textContent = '视频加载中，请稍候…';
    });

    video.addEventListener('pause', () => {
      if (video.ended) return;
      stage.dataset.state = 'paused';
      if (!button.hidden) showPlayButton('点击继续播放');
      status.textContent = '已暂停，可使用播放器继续观看。';
    });

    video.addEventListener('ended', () => {
      stage.dataset.state = 'ended';
      showPlayButton('再看一次');
      status.textContent = '播放结束，可点击重播。';
    });

    video.addEventListener('error', () => {
      stage.dataset.state = 'error';
      showPlayButton('重试播放');
      status.textContent = '视频暂时无法加载，请尝试「独立窗口观看」。';
    });
  }
})();

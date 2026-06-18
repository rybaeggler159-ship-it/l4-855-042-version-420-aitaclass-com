(function () {
  var video = document.getElementById('movie-player');
  var cover = document.getElementById('player-cover');
  var configElement = document.getElementById('movie-player-config');

  if (!video || !cover || !configElement) {
    return;
  }

  var config = {};

  try {
    config = JSON.parse(configElement.textContent || '{}');
  } catch (error) {
    config = {};
  }

  var loaded = false;
  var hlsInstance = null;

  function attachMedia() {
    if (loaded || !config.src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.src;
      loaded = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance.loadSource(config.src);
      hlsInstance.attachMedia(video);
      loaded = true;
      return;
    }

    video.src = config.src;
    loaded = true;
  }

  function startPlayback() {
    attachMedia();
    cover.classList.add('is-hidden');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  cover.addEventListener('click', startPlayback);

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    cover.classList.add('is-hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();

(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = document.querySelector("script[data-hls-loader]");
    if (existing) {
      existing.addEventListener("load", callback, { once: true });
      existing.addEventListener("error", callback, { once: true });
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.async = true;
    script.setAttribute("data-hls-loader", "true");
    script.addEventListener("load", callback, { once: true });
    script.addEventListener("error", callback, { once: true });
    document.head.appendChild(script);
  }

  function setupPlayer(player) {
    var video = player.querySelector("video");
    var source = video ? video.getAttribute("data-src") : "";
    var loading = player.querySelector("[data-player-loading]");
    var centerButton = player.querySelector("[data-player-center]");
    var playButton = player.querySelector("[data-player-play]");
    var muteButton = player.querySelector("[data-player-mute]");
    var fullscreenButton = player.querySelector("[data-player-fullscreen]");
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function hideLoading() {
      if (loading) {
        loading.hidden = true;
      }
    }

    function attachSource() {
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, hideLoading);
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          }
        });
      } else {
        video.src = source;
      }
    }

    function updatePlayState() {
      var playing = !video.paused && !video.ended;
      player.classList.toggle("is-playing", playing);
      if (playButton) {
        playButton.textContent = playing ? "❚❚" : "▶";
      }
      if (centerButton) {
        centerButton.textContent = playing ? "❚❚" : "▶";
      }
    }

    function togglePlay() {
      if (video.paused || video.ended) {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      } else {
        video.pause();
      }
    }

    function toggleMute() {
      video.muted = !video.muted;
      if (muteButton) {
        muteButton.textContent = video.muted ? "🔇" : "🔊";
      }
    }

    function toggleFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    }

    video.addEventListener("loadedmetadata", hideLoading);
    video.addEventListener("canplay", hideLoading);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    video.addEventListener("ended", updatePlayState);
    video.addEventListener("click", togglePlay);

    [centerButton, playButton].forEach(function (button) {
      if (button) {
        button.addEventListener("click", togglePlay);
      }
    });

    if (muteButton) {
      muteButton.addEventListener("click", toggleMute);
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", toggleFullscreen);
    }

    loadHls(function () {
      attachSource();
      updatePlayState();
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(setupPlayer);
  });
})();

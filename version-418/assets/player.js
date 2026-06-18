function initMoviePlayer(streamUrl) {
  var video = document.getElementById("movie-video");
  var cover = document.querySelector(".player-cover");
  var button = document.getElementById("player-button");
  var started = false;
  var hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function playVideo() {
    var request = video.play();
    if (request && typeof request.catch === "function") {
      request.catch(function() {
        video.controls = true;
      });
    }
  }

  function startPlayback() {
    if (started) {
      playVideo();
      return;
    }

    started = true;
    video.controls = true;

    if (cover) {
      cover.classList.add("is-hidden");
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      playVideo();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, playVideo);
      return;
    }

    video.src = streamUrl;
    playVideo();
  }

  if (button) {
    button.addEventListener("click", startPlayback);
  }

  if (cover) {
    cover.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function() {
    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
    }
  });

  window.addEventListener("beforeunload", function() {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

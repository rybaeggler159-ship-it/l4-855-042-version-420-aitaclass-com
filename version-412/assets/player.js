import { H as Hls } from "./hls-vendor.js";

var setupPlayer = function (player) {
  var video = player.querySelector("video");
  var button = player.querySelector(".play-layer");
  var stream = player.getAttribute("data-stream");
  var loaded = false;
  var hls = null;

  if (!video || !button || !stream) {
    return;
  }

  var loadStream = function () {
    if (loaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    loaded = true;
  };

  var play = function () {
    loadStream();
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        player.classList.remove("is-playing");
      });
    }
  };

  button.addEventListener("click", function (event) {
    event.preventDefault();
    player.classList.add("is-playing");
    play();
  });

  player.addEventListener("click", function (event) {
    if (event.target === video || event.target.closest("button") || event.target.closest("a")) {
      return;
    }
    player.classList.add("is-playing");
    play();
  });

  video.addEventListener("play", function () {
    player.classList.add("is-playing");
  });

  video.addEventListener("pause", function () {
    if (!video.ended) {
      player.classList.remove("is-playing");
    }
  });

  video.addEventListener("ended", function () {
    player.classList.remove("is-playing");
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
};

document.querySelectorAll(".player-card").forEach(setupPlayer);

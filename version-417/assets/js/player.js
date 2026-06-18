(function() {
  var libraryLoading = false;
  var libraryCallbacks = [];

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function flushLibraryCallbacks() {
    var callbacks = libraryCallbacks.slice();
    libraryCallbacks.length = 0;
    callbacks.forEach(function(callback) {
      callback();
    });
  }

  function loadLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    libraryCallbacks.push(callback);
    if (libraryLoading) {
      return;
    }
    libraryLoading = true;
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
    script.onload = flushLibraryCallbacks;
    script.onerror = flushLibraryCallbacks;
    document.head.appendChild(script);
  }

  function initShell(shell) {
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var stream = shell.getAttribute("data-stream");
    var attached = false;
    var streamReady = false;
    var readyCallbacks = [];
    var hls = null;

    function flushReadyCallbacks() {
      streamReady = true;
      var callbacks = readyCallbacks.slice();
      readyCallbacks.length = 0;
      callbacks.forEach(function(callback) {
        callback();
      });
    }

    function whenStreamReady(callback) {
      if (!callback) {
        return;
      }
      if (streamReady) {
        callback();
      } else {
        readyCallbacks.push(callback);
      }
    }

    function playVideo() {
      if (!video) {
        return;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function() {});
      }
    }

    function attach(callback) {
      whenStreamReady(callback);
      if (!video || !stream || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        flushReadyCallbacks();
        return;
      }
      loadLibrary(function() {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, flushReadyCallbacks);
          hls.on(window.Hls.Events.ERROR, function(event, data) {
            if (!data || !data.fatal || !hls) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              hls = null;
            }
          });
        } else {
          video.src = stream;
          flushReadyCallbacks();
        }
      });
    }

    function start() {
      attach(playVideo);
      if (overlay) {
        overlay.classList.add("hidden");
      }
    }

    if (!video || !stream) {
      return;
    }
    attach();
    if (overlay) {
      overlay.addEventListener("click", start);
    }
    video.addEventListener("click", function() {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });
    video.addEventListener("ended", function() {
      if (overlay) {
        overlay.classList.remove("hidden");
      }
    });
    window.addEventListener("pagehide", function() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  ready(function() {
    document.querySelectorAll(".player-shell").forEach(initShell);
  });
})();

function initMoviePlayer(videoId, shellId, buttonId, videoSource) {
    var video = document.getElementById(videoId);
    var shell = document.getElementById(shellId);
    var button = document.getElementById(buttonId);
    var loaded = false;
    var hlsInstance = null;

    function bindSource() {
        if (loaded || !video) {
            return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSource;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                maxBufferLength: 30,
                enableWorker: true
            });
            hlsInstance.loadSource(videoSource);
            hlsInstance.attachMedia(video);
        } else {
            video.src = videoSource;
        }
    }

    function start(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        bindSource();
        if (shell) {
            shell.classList.add("is-playing");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener("click", start);
    }
    if (shell) {
        shell.addEventListener("click", function (event) {
            if (!loaded || event.target === shell || event.target === button) {
                start(event);
            }
        });
    }
    if (video) {
        video.addEventListener("play", function () {
            if (shell) {
                shell.classList.add("is-playing");
            }
        });
    }
}

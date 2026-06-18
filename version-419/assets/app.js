(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initMobileMenu() {
        var button = document.querySelector(".mobile-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var open = panel.classList.toggle("open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function initHeroCarousel() {
        var hero = document.querySelector("[data-hero-carousel]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector(".movie-filter-input");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            var chips = Array.prototype.slice.call(scope.querySelectorAll(".filter-chip"));
            var activeField = "all";
            var activeValue = "all";
            if (scope.hasAttribute("data-query-sync") && input) {
                var params = new URLSearchParams(window.location.search);
                var query = params.get("q") || "";
                input.value = query;
            }
            function apply() {
                var query = normalize(input ? input.value : "");
                var shown = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.tags,
                        card.dataset.year,
                        card.dataset.type,
                        card.dataset.region,
                        card.dataset.category
                    ].join(" "));
                    var chipOk = activeValue === "all" || normalize(card.dataset[activeField]).indexOf(normalize(activeValue)) !== -1;
                    var queryOk = !query || haystack.indexOf(query) !== -1;
                    var visible = chipOk && queryOk;
                    card.style.display = visible ? "" : "none";
                    if (visible) {
                        shown += 1;
                    }
                });
                scope.classList.toggle("is-empty", shown === 0);
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            chips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    chips.forEach(function (item) {
                        item.classList.remove("active");
                    });
                    chip.classList.add("active");
                    activeField = chip.dataset.filterField || "all";
                    activeValue = chip.dataset.filterValue || "all";
                    apply();
                });
            });
            apply();
        });
    }

    window.setupMoviePlayer = function (sourceUrl) {
        var video = document.getElementById("movieVideo");
        var shell = document.querySelector(".video-shell");
        var cover = document.getElementById("posterPlay");
        var play = document.getElementById("playToggle");
        var mute = document.getElementById("muteToggle");
        var fullscreen = document.getElementById("fullscreenToggle");
        if (!video || !sourceUrl) {
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
        } else {
            video.src = sourceUrl;
        }
        function updateState() {
            if (shell) {
                shell.classList.toggle("is-playing", !video.paused);
            }
            if (play) {
                play.textContent = video.paused ? "▶" : "暂停";
            }
        }
        function startPlayback() {
            var action = video.paused ? video.play() : video.pause();
            if (action && typeof action.catch === "function") {
                action.catch(function () {});
            }
            updateState();
        }
        if (cover) {
            cover.addEventListener("click", startPlayback);
        }
        if (play) {
            play.addEventListener("click", startPlayback);
        }
        if (mute) {
            mute.addEventListener("click", function () {
                video.muted = !video.muted;
                mute.textContent = video.muted ? "静音" : "音量";
            });
        }
        if (fullscreen && shell) {
            fullscreen.addEventListener("click", function () {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (shell.requestFullscreen) {
                    shell.requestFullscreen();
                }
            });
        }
        video.addEventListener("play", updateState);
        video.addEventListener("pause", updateState);
        video.addEventListener("click", startPlayback);
        updateState();
    };

    ready(function () {
        initMobileMenu();
        initHeroCarousel();
        initFilters();
    });
})();

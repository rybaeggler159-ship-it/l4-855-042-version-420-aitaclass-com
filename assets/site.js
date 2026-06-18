(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let index = 0;
        let timer = null;

        const show = function (next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        };

        const start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        };

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        show(0);
        start();
    }

    const filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
        const input = filterRoot.querySelector('[data-filter-input]');
        const cards = Array.from(filterRoot.querySelectorAll('[data-card]'));
        const pills = Array.from(filterRoot.querySelectorAll('[data-filter-year]'));
        const empty = filterRoot.querySelector('[data-empty]');
        let selectedYear = 'all';

        const apply = function () {
            const query = input ? input.value.trim().toLowerCase() : '';
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = card.getAttribute('data-title') || '';
                const year = card.getAttribute('data-year') || '';
                const matchQuery = !query || haystack.indexOf(query) !== -1;
                const matchYear = selectedYear === 'all' || year.indexOf(selectedYear) !== -1;
                const keep = matchQuery && matchYear;
                card.style.display = keep ? '' : 'none';
                if (keep) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };

        if (input) {
            const params = new URLSearchParams(window.location.search);
            const initial = params.get('q');
            if (initial) {
                input.value = initial;
            }
            input.addEventListener('input', apply);
        }

        pills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                selectedYear = pill.getAttribute('data-filter-year') || 'all';
                pills.forEach(function (item) {
                    item.classList.toggle('is-active', item === pill);
                });
                apply();
            });
        });

        apply();
    }

    document.querySelectorAll('[data-player]').forEach(function (player) {
        const video = player.querySelector('video');
        const layer = player.querySelector('[data-play-layer]');
        const button = player.querySelector('[data-play-button]');
        const stream = player.getAttribute('data-stream');
        let started = false;
        let hls = null;

        const begin = function () {
            if (!video || !stream) {
                return;
            }
            if (!started) {
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                video.controls = true;
            }
            if (layer) {
                layer.classList.add('is-hidden');
            }
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        };

        if (layer) {
            layer.addEventListener('click', begin);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                begin();
            });
        }
        video.addEventListener('play', function () {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();

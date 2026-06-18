(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function showSlide(index) {
      active = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot')) || 0;
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var input = document.querySelector('[data-search-input]');
  var list = document.querySelector('[data-filter-list]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var chosen = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function runFilter() {
    if (!list) {
      return;
    }

    var query = normalize(input ? input.value : '');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' '));
      var matchedQuery = !query || text.indexOf(query) !== -1;
      var matchedChip = chosen === 'all' || text.indexOf(normalize(chosen)) !== -1;
      card.classList.toggle('is-hidden', !(matchedQuery && matchedChip));
    });
  }

  if (input) {
    input.addEventListener('input', runFilter);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chosen = chip.getAttribute('data-filter') || 'all';
      chips.forEach(function (item) {
        item.classList.toggle('is-active', item === chip);
      });
      runFilter();
    });
  });

  function ensureHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-hls-loader]');
      if (existing) {
        existing.addEventListener('load', function () {
          resolve(window.Hls);
        });
        existing.addEventListener('error', reject);
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
      script.async = true;
      script.setAttribute('data-hls-loader', 'true');
      script.addEventListener('load', function () {
        resolve(window.Hls);
      });
      script.addEventListener('error', reject);
      document.head.appendChild(script);
    });
  }

  function startPlayer(shell) {
    var video = shell.querySelector('video');
    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    if (!stream) {
      return;
    }

    function play() {
      shell.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = stream;
      }
      play();
      return;
    }

    ensureHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        if (!video._hlsPlayer) {
          var hls = new Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          video._hlsPlayer = hls;
        }
        play();
      } else {
        video.src = stream;
        play();
      }
    }).catch(function () {
      video.src = stream;
      play();
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
    var button = shell.querySelector('.player-start');
    var video = shell.querySelector('video');

    if (button) {
      button.addEventListener('click', function () {
        startPlayer(shell);
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
          shell.classList.remove('is-playing');
        }
      });
    }
  });
})();

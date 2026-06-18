(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-nav]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupBackTop() {
    document.querySelectorAll("[data-back-top]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });
  }

  function setupImages() {
    document.querySelectorAll("img[data-cover]").forEach(function (image) {
      image.addEventListener("error", function () {
        image.removeAttribute("src");
      }, { once: true });
    });
  }

  function setupHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = nextIndex;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function next() {
      show((index + 1) % slides.length);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(next, 5200);
      });
    });

    show(0);
    timer = window.setInterval(next, 5200);
  }

  function includesText(source, target) {
    return String(source || "").toLowerCase().indexOf(String(target || "").toLowerCase()) !== -1;
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-form]").forEach(function (form) {
      var scope = form.closest("main") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var input = form.querySelector("[data-filter-input]");
      var region = form.querySelector("[data-filter-region]");
      var year = form.querySelector("[data-filter-year]");
      var genre = form.querySelector("[data-filter-genre]");
      var empty = scope.querySelector("[data-empty-state]");

      function apply() {
        var keyword = input ? input.value.trim() : "";
        var regionValue = region ? region.value : "";
        var yearValue = year ? year.value : "";
        var genreValue = genre ? genre.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var matchesKeyword = !keyword || includesText(card.getAttribute("data-search"), keyword);
          var matchesRegion = !regionValue || card.getAttribute("data-region") === regionValue;
          var matchesYear = !yearValue || card.getAttribute("data-year") === yearValue;
          var matchesGenre = !genreValue || includesText(card.getAttribute("data-genre"), genreValue) || includesText(card.getAttribute("data-search"), genreValue);
          var shouldShow = matchesKeyword && matchesRegion && matchesYear && matchesGenre;
          card.hidden = !shouldShow;
          if (shouldShow) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      ["input", "change"].forEach(function (eventName) {
        form.addEventListener(eventName, apply);
      });
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupBackTop();
    setupImages();
    setupHeroSlider();
    setupFilters();
  });
})();

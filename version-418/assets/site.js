(function() {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  ready(function() {
    var menuButton = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");

    if (menuButton && nav) {
      menuButton.addEventListener("click", function() {
        var isOpen = nav.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeIndex);
      });
    }

    function startHero() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function() {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(index);
        startHero();
      });
    });

    showSlide(0);
    startHero();

    var searchInput = document.querySelector("[data-card-search]");
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll("[data-filter-field]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }
      var query = normalize(searchInput ? searchInput.value : "");
      var visibleCount = 0;

      cards.forEach(function(card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));
        var matched = !query || haystack.indexOf(query) !== -1;

        filterSelects.forEach(function(select) {
          var field = select.getAttribute("data-filter-field");
          var value = normalize(select.value);
          if (value && normalize(card.getAttribute("data-" + field)).indexOf(value) === -1) {
            matched = false;
          }
        });

        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("show", visibleCount === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    filterSelects.forEach(function(select) {
      select.addEventListener("change", applyFilters);
    });
    applyFilters();
  });
})();

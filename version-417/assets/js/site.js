(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function() {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function() {
        mobileNav.classList.toggle("open");
      });
    }

    var backTop = document.querySelector("[data-back-top]");
    if (backTop) {
      backTop.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length > 1) {
      var current = 0;
      var setSlide = function(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle("active", i === current);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle("active", i === current);
        });
      };
      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          setSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      window.setInterval(function() {
        setSlide(current + 1);
      }, 5600);
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
      var input = scope.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-chip]"));
      var container = scope.parentElement.parentElement.querySelector("[data-card-container]");
      var cards = container ? Array.prototype.slice.call(container.querySelectorAll("[data-card]")) : [];
      var emptyState = scope.querySelector("[data-empty-state]");
      var active = "all";
      if (input && initialQuery) {
        input.value = initialQuery;
      }
      var apply = function() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var visible = 0;
        cards.forEach(function(card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var region = card.getAttribute("data-region") || "";
          var passText = !q || text.indexOf(q) !== -1;
          var passRegion = active === "all" || region === active;
          var show = passText && passRegion;
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });
        if (emptyState) {
          emptyState.hidden = visible !== 0;
        }
      };
      if (input) {
        input.addEventListener("input", apply);
      }
      chips.forEach(function(chip) {
        chip.addEventListener("click", function() {
          active = chip.getAttribute("data-filter-chip") || "all";
          chips.forEach(function(item) {
            item.classList.toggle("active", item === chip);
          });
          apply();
        });
      });
      apply();
    });
  });
})();

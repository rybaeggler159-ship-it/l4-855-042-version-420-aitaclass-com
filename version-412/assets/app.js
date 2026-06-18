(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    };

    var start = function () {
      if (timer || slides.length <= 1) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        stop();
        showSlide(Number(dot.getAttribute("data-slide") || 0));
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  var jumpSearch = document.querySelector("[data-jump-search]");

  if (jumpSearch) {
    jumpSearch.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = jumpSearch.querySelector("input");
      var target = document.querySelector("#site-search .filter-input");
      if (input && target) {
        target.value = input.value;
        target.dispatchEvent(new Event("input", { bubbles: true }));
        document.getElementById("site-search").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  var setupFilterScope = function (scope) {
    var input = scope.querySelector(".filter-input");
    var buttons = Array.prototype.slice.call(scope.querySelectorAll(".filter-btn"));
    var result = scope.querySelector(".filter-result");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-card"));
    if (!cards.length && scope.classList.contains("filter-toolbar")) {
      cards = Array.prototype.slice.call(document.querySelectorAll("main .movie-card, main .rank-card"));
    }
    var active = "all";

    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();

        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesFilter = active === "all" || text.indexOf(active.toLowerCase()) !== -1;
        var show = matchesQuery && matchesFilter;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          visible += 1;
        }
      });

      if (result) {
        result.textContent = visible ? "已筛选出 " + visible + " 部影片" : "未找到匹配影片";
      }
    };

    if (input) {
      input.addEventListener("input", apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        active = button.getAttribute("data-filter") || "all";
        apply();
      });
    });
  };

  document.querySelectorAll("[data-filter-scope]").forEach(setupFilterScope);
})();

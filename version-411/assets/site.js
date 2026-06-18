(function () {
  var navButton = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dots button'));
    var active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var categorySelect = document.querySelector('[data-category-select]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.js-card'));
  var emptyState = document.querySelector('[data-empty-state]');

  function runFilter() {
    if (!filterInput && !categorySelect) {
      return;
    }

    var term = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var category = categorySelect ? categorySelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var search = card.getAttribute('data-search') || '';
      var cardCategory = card.getAttribute('data-category') || '';
      var matchesTerm = !term || search.indexOf(term) !== -1;
      var matchesCategory = !category || cardCategory === category;
      var shouldShow = matchesTerm && matchesCategory;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput || categorySelect) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && filterInput) {
      filterInput.value = q;
    }
    if (filterInput) {
      filterInput.addEventListener('input', runFilter);
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', runFilter);
    }
    runFilter();
  }

  var heroSearch = document.querySelector('[data-hero-search]');

  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = heroSearch.querySelector('input');
      var query = input ? input.value.trim() : '';
      var target = './all-movies.html';
      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  }
})();

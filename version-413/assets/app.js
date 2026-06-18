document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    document.querySelectorAll(".search-scope").forEach(function (scope) {
        const wrapper = scope.closest("section") || document;
        const search = wrapper.querySelector(".site-search");
        const year = wrapper.querySelector(".year-filter");
        const cards = Array.from(scope.querySelectorAll(".movie-card"));

        function applyFilter() {
            const query = search ? search.value.trim().toLowerCase() : "";
            const selectedYear = year ? year.value : "";

            cards.forEach(function (card) {
                const text = (card.dataset.search || "").toLowerCase();
                const cardYear = card.dataset.year || "";
                const matchText = !query || text.indexOf(query) !== -1;
                const matchYear = !selectedYear || cardYear === selectedYear;
                card.classList.toggle("is-hidden", !(matchText && matchYear));
            });
        }

        if (search) {
            search.addEventListener("input", applyFilter);
        }
        if (year) {
            year.addEventListener("change", applyFilter);
        }
    });
});

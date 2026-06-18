(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var links = document.querySelector(".nav-links");
        if (toggle && links) {
            toggle.addEventListener("click", function () {
                links.classList.toggle("open");
            });
        }

        document.querySelectorAll(".site-search-form").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var index = 0;
            function show(next) {
                if (!slides.length) {
                    return;
                }
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
            if (slides.length > 1) {
                setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        var listSearch = document.querySelector(".listing-search");
        if (listSearch && query) {
            listSearch.value = query;
        }

        document.querySelectorAll(".searchable-list").forEach(function (list) {
            var block = list.closest(".section-block") || document;
            var input = block.querySelector(".listing-search");
            var select = block.querySelector(".year-filter");
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            function matchYear(card, value) {
                if (!value || value === "全部年份") {
                    return true;
                }
                var yearText = card.getAttribute("data-year") || "";
                var yearMatch = yearText.match(/(19|20)\d{2}/);
                var year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
                if (value === "2010-2019") {
                    return year >= 2010 && year <= 2019;
                }
                if (value === "2000-2009") {
                    return year >= 2000 && year <= 2009;
                }
                if (value === "更早") {
                    return year > 0 && year < 2000;
                }
                return yearText.indexOf(value) !== -1;
            }
            function filter() {
                var text = input ? input.value.trim().toLowerCase() : "";
                var yearValue = select ? select.value : "全部年份";
                cards.forEach(function (card) {
                    var hay = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-tags") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    var okText = !text || hay.indexOf(text) !== -1;
                    var okYear = matchYear(card, yearValue);
                    card.classList.toggle("is-hidden", !(okText && okYear));
                });
            }
            if (input) {
                input.addEventListener("input", filter);
            }
            if (select) {
                select.addEventListener("change", filter);
            }
            filter();
        });
    });
})();

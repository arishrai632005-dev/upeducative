/* =========================================================
   FOODHUB - MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    setupMobileMenu();
    renderPopularFoods();
    setupFAQ();
});

/* ================= MOBILE MENU ================= */

function setupMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("show");

        const isOpen = navLinks.classList.contains("show");

        menuToggle.setAttribute("aria-expanded", isOpen);

        if (isOpen) {
            menuToggle.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';
        } else {
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        });
    });

    document.addEventListener("click", function (event) {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navLinks.classList.remove("show");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    });
}

/* ================= POPULAR FOODS ================= */

function renderPopularFoods() {
    const grid = document.getElementById("popular-grid");

    if (!grid || typeof FOODS === "undefined") {
        return;
    }

    const popularFoods = [...FOODS]
        .sort(function (a, b) {
            return b.rating - a.rating;
        })
        .slice(0, 6);

    grid.innerHTML = popularFoods
        .map(function (food) {
            return foodCard(food);
        })
        .join("");
}

/* ================= FAQ ================= */

function setupFAQ() {
    const questions =
        document.querySelectorAll(".faq-question");

    questions.forEach(function (question) {
        question.addEventListener("click", function () {
            const item = question.closest(".faq-item");

            if (!item) {
                return;
            }

            const isOpen =
                item.classList.contains("open");

            document
                .querySelectorAll(".faq-item")
                .forEach(function (faq) {
                    faq.classList.remove("open");

                    const button =
                        faq.querySelector(".faq-question");

                    if (button) {
                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                });

            if (!isOpen) {
                item.classList.add("open");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });
}

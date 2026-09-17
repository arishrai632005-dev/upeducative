/* =========================================================
   FOODHUB - MENU PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    setupMenuPage();
});

/* ================= MENU SETUP ================= */

function setupMenuPage() {
    const foodGrid = document.getElementById("menu-grid");
    const searchInput = document.getElementById("food-search");
    const sortSelect = document.getElementById("sort-food");
    const filterButtons =
        document.querySelectorAll(".filter-btn");
    const resultCount =
        document.getElementById("result-count");

    if (!foodGrid || typeof FOODS === "undefined") {
        return;
    }

    let currentCategory = "All";
    let currentSearch = "";
    let currentSort = "default";

    /* ================= URL CATEGORY ================= */

    const params = new URLSearchParams(
        window.location.search
    );

    const urlCategory = params.get("category");

    if (urlCategory) {
        currentCategory = urlCategory;

        filterButtons.forEach(function (button) {
            if (
                button.dataset.category ===
                currentCategory
            ) {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");
            }
        });
    }

    /* ================= RENDER MENU ================= */

    function renderMenu() {
        let filteredFoods = [...FOODS];

        /* Category filter */

        if (currentCategory !== "All") {
            filteredFoods = filteredFoods.filter(
                function (food) {
                    return (
                        food.category ===
                        currentCategory
                    );
                }
            );
        }

        /* Search filter */

        if (currentSearch.trim() !== "") {
            const searchText =
                currentSearch.toLowerCase().trim();

            filteredFoods = filteredFoods.filter(
                function (food) {
                    return (
                        food.name
                            .toLowerCase()
                            .includes(searchText) ||
                        food.category
                            .toLowerCase()
                            .includes(searchText) ||
                        food.desc
                            .toLowerCase()
                            .includes(searchText)
                    );
                }
            );
        }

        /* Sorting */

        if (currentSort === "price-low") {
            filteredFoods.sort(function (a, b) {
                return a.price - b.price;
            });
        }

        if (currentSort === "price-high") {
            filteredFoods.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        if (currentSort === "rating") {
            filteredFoods.sort(function (a, b) {
                return b.rating - a.rating;
            });
        }

        /* Result count */

        if (resultCount) {
            resultCount.textContent =
                filteredFoods.length;
        }

        /* No results */

        if (filteredFoods.length === 0) {
            foodGrid.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <h3>No food found</h3>
                    <p>
                        Try another search or choose
                        a different category.
                    </p>
                </div>
            `;

            return;
        }

        /* Food cards */

        foodGrid.innerHTML = filteredFoods
            .map(function (food) {
                return foodCard(food);
            })
            .join("");
    }

    /* ================= SEARCH ================= */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            function () {
                currentSearch = searchInput.value;
                renderMenu();
            }
        );
    }

    /* ================= SORT ================= */

    if (sortSelect) {
        sortSelect.addEventListener(
            "change",
            function () {
                currentSort = sortSelect.value;
                renderMenu();
            }
        );
    }

    /* ================= CATEGORY FILTER ================= */

    filterButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                currentCategory =
                    button.dataset.category ||
                    "All";

                renderMenu();
            }
        );
    });

    /* ================= INITIAL RENDER ================= */

    renderMenu();
}

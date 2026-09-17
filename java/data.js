/* =========================================================
   FOODHUB - FOOD DATA & COMMON FUNCTIONS
   ========================================================= */

const FOODS = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burgers",
        price: 149,
        rating: 4.8,
        icon: "fa-burger",
        desc: "Juicy patty, fresh lettuce and signature sauce."
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        rating: 4.9,
        icon: "fa-pizza-slice",
        desc: "Classic tomato, mozzarella and fresh basil."
    },
    {
        id: 3,
        name: "Chicken Biryani",
        category: "Indian",
        price: 229,
        rating: 4.9,
        icon: "fa-bowl-food",
        desc: "Aromatic basmati rice with flavorful spices."
    },
    {
        id: 4,
        name: "Paneer Tikka",
        category: "Indian",
        price: 189,
        rating: 4.7,
        icon: "fa-bowl-food",
        desc: "Char-grilled paneer with herbs and spices."
    },
    {
        id: 5,
        name: "French Fries",
        category: "Snacks",
        price: 99,
        rating: 4.6,
        icon: "fa-bowl-food",
        desc: "Crispy golden fries with delicious seasoning."
    },
    {
        id: 6,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 159,
        rating: 4.8,
        icon: "fa-cake-candles",
        desc: "Rich chocolate cake with creamy layers."
    },
    {
        id: 7,
        name: "Cold Coffee",
        category: "Drinks",
        price: 119,
        rating: 4.5,
        icon: "fa-mug-hot",
        desc: "Chilled coffee blended until smooth."
    },
    {
        id: 8,
        name: "Veggie Pizza",
        category: "Pizza",
        price: 279,
        rating: 4.7,
        icon: "fa-pizza-slice",
        desc: "Loaded with fresh vegetables and cheese."
    },
    {
        id: 9,
        name: "Masala Dosa",
        category: "Indian",
        price: 139,
        rating: 4.8,
        icon: "fa-bowl-food",
        desc: "Crispy dosa with potato masala and chutney."
    },
    {
        id: 10,
        name: "Cheese Burger",
        category: "Burgers",
        price: 179,
        rating: 4.9,
        icon: "fa-burger",
        desc: "Cheesy burger with juicy patty and house sauce."
    },
    {
        id: 11,
        name: "Gulab Jamun",
        category: "Desserts",
        price: 89,
        rating: 4.7,
        icon: "fa-cookie-bite",
        desc: "Soft syrup-soaked Indian sweet."
    },
    {
        id: 12,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 79,
        rating: 4.4,
        icon: "fa-glass-water",
        desc: "Refreshing lemon drink served chilled."
    }
];

/* ================= PRICE FORMAT ================= */

function money(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

/* ================= CART STORAGE ================= */

function getCart() {
    return JSON.parse(
        localStorage.getItem("foodhub_cart") || "[]"
    );
}

function saveCart(cart) {
    localStorage.setItem(
        "foodhub_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}

/* ================= ADD TO CART ================= */

function addToCart(id) {
    const cart = getCart();

    const existingItem = cart.find(function (item) {
        return item.id === id;
    });

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: id,
            qty: 1
        });
    }

    saveCart(cart);

    toast("Item added to cart");
}

/* ================= CART COUNT ================= */

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce(function (total, item) {
        return total + item.qty;
    }, 0);

    document.querySelectorAll(".cart-count").forEach(function (element) {
        element.textContent = count;
    });
}

/* ================= TOAST ================= */

function toast(message) {
    let toastBox = document.querySelector(".toast");

    if (!toastBox) {
        toastBox = document.createElement("div");
        toastBox.className = "toast";
        document.body.appendChild(toastBox);
    }

    toastBox.textContent = message;
    toastBox.classList.add("show");

    setTimeout(function () {
        toastBox.classList.remove("show");
    }, 1800);
}

/* ================= FOOD CARD ================= */

function foodCard(food) {
    return `
        <article class="food-card">

            <div class="food-image">
                <i class="fa-solid ${food.icon}"></i>
            </div>

            <div class="food-body">

                <div class="food-top">

                    <h3>${food.name}</h3>

                    <span class="rating">
                        <i class="fa-solid fa-star"></i>
                        ${food.rating}
                    </span>

                </div>

                <p>${food.desc}</p>

                <div class="food-bottom">

                    <span class="price">
                        ${money(food.price)}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${food.id})"
                        aria-label="Add ${food.name} to cart">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

            </div>

        </article>
    `;
}

/* ================= INITIAL CART COUNT ================= */

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
});

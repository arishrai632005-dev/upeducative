/* =========================================================
   FOODHUB - CART PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    setupCoupon();
});

/* ================= CART CONSTANTS ================= */

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_LIMIT = 499;
const COUPON_CODE = "WELCOME20";
const COUPON_DISCOUNT = 0.20;

/* ================= RENDER CART ================= */

function renderCart() {
    const cartContainer =
        document.getElementById("cart-items");

    const emptyCart =
        document.getElementById("empty-cart");

    if (!cartContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = "";

        if (emptyCart) {
            emptyCart.classList.remove("hidden");
        }

        updateCartSummary(0);
        return;
    }

    if (emptyCart) {
        emptyCart.classList.add("hidden");
    }

    cartContainer.innerHTML = cart
        .map(function (cartItem) {
            const food = FOODS.find(function (item) {
                return item.id === cartItem.id;
            });

            if (!food) {
                return "";
            }

            return `
                <article class="cart-item">

                    <div class="cart-item-image">
                        <i class="fa-solid ${food.icon}"></i>
                    </div>

                    <div class="cart-item-info">

                        <h3>${food.name}</h3>

                        <p>${food.category}</p>

                        <div class="cart-item-price">
                            ${money(food.price)}
                        </div>

                        <div class="quantity-control">

                            <button
                                onclick="changeQuantity(${food.id}, -1)"
                                aria-label="Decrease quantity">
                                <i class="fa-solid fa-minus"></i>
                            </button>

                            <span>${cartItem.qty}</span>

                            <button
                                onclick="changeQuantity(${food.id}, 1)"
                                aria-label="Increase quantity">
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-actions">

                        <strong>
                            ${money(food.price * cartItem.qty)}
                        </strong>

                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${food.id})">

                            <i class="fa-solid fa-trash"></i>
                            Remove

                        </button>

                    </div>

                </article>
            `;
        })
        .join("");

    calculateCart();
}

/* ================= CHANGE QUANTITY ================= */

function changeQuantity(id, change) {
    const cart = getCart();

    const item = cart.find(function (cartItem) {
        return cartItem.id === id;
    });

    if (!item) {
        return;
    }

    item.qty += change;

    if (item.qty <= 0) {
        const updatedCart = cart.filter(
            function (cartItem) {
                return cartItem.id !== id;
            }
        );

        saveCart(updatedCart);
    } else {
        saveCart(cart);
    }

    renderCart();
}

/* ================= REMOVE ITEM ================= */

function removeFromCart(id) {
    const cart = getCart();

    const updatedCart = cart.filter(
        function (item) {
            return item.id !== id;
        }
    );

    saveCart(updatedCart);

    toast("Item removed from cart");

    renderCart();
}

/* ================= CALCULATE CART ================= */

function calculateCart() {
    const cart = getCart();

    let subtotal = 0;

    cart.forEach(function (cartItem) {
        const food = FOODS.find(function (item) {
            return item.id === cartItem.id;
        });

        if (food) {
            subtotal += food.price * cartItem.qty;
        }
    });

    updateCartSummary(subtotal);
}

/* ================= CART SUMMARY ================= */

function updateCartSummary(subtotal) {
    const deliveryElement =
        document.getElementById("delivery-charge");

    const subtotalElement =
        document.getElementById("subtotal");

    const discountElement =
        document.getElementById("discount");

    const totalElement =
        document.getElementById("cart-total");

    let delivery = 0;

    if (subtotal > 0 && subtotal < FREE_DELIVERY_LIMIT) {
        delivery = DELIVERY_CHARGE;
    }

    const couponApplied =
        localStorage.getItem(
            "foodhub_coupon"
        ) === COUPON_CODE;

    let discount = 0;

    if (couponApplied) {
        discount = subtotal * COUPON_DISCOUNT;
    }

    const total =
        subtotal + delivery - discount;

    if (subtotalElement) {
        subtotalElement.textContent =
            money(subtotal);
    }

    if (deliveryElement) {
        if (delivery === 0 && subtotal > 0) {
            deliveryElement.textContent =
                "FREE";
        } else {
            deliveryElement.textContent =
                money(delivery);
        }
    }

    if (discountElement) {
        discountElement.textContent =
            discount > 0
                ? "-" + money(discount)
                : money(0);
    }

    if (totalElement) {
        totalElement.textContent =
            money(total);
    }
}

/* ================= COUPON ================= */

function setupCoupon() {
    const couponInput =
        document.getElementById("coupon-code");

    const couponButton =
        document.getElementById("apply-coupon");

    const couponMessage =
        document.getElementById(
            "coupon-message"
        );

    if (!couponInput || !couponButton) {
        return;
    }

    const savedCoupon =
        localStorage.getItem(
            "foodhub_coupon"
        );

    if (savedCoupon === COUPON_CODE) {
        couponInput.value = COUPON_CODE;

        if (couponMessage) {
            couponMessage.textContent =
                "20% discount applied.";

            couponMessage.className =
                "coupon-message success";
        }
    }

    couponButton.addEventListener(
        "click",
        function () {
            const code =
                couponInput.value
                    .trim()
                    .toUpperCase();

            if (code === COUPON_CODE) {
                localStorage.setItem(
                    "foodhub_coupon",
                    COUPON_CODE
                );

                if (couponMessage) {
                    couponMessage.textContent =
                        "Coupon applied! You saved 20%.";

                    couponMessage.className =
                        "coupon-message success";
                }

                calculateCart();
                toast("Coupon applied");
            } else {
                localStorage.removeItem(
                    "foodhub_coupon"
                );

                if (couponMessage) {
                    couponMessage.textContent =
                        "Invalid coupon code.";

                    couponMessage.className =
                        "coupon-message error";
                }

                calculateCart();
            }
        }
    );
}

/* ================= CHECKOUT BUTTON ================= */

function goToCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        toast("Your cart is empty");
        return;
    }

    window.location.href = "checkout.html";
}
